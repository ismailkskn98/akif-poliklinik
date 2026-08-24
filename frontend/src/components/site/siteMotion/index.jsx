"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const motionTargets = "[data-motion-header], [data-motion-intro], [data-motion-reveal]";

export default function SiteMotion({ children }) {
  const pathname = usePathname();
  const headerHasAnimated = useRef(false);
  const scope = useRef(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      const select = gsap.utils.selector(scope);

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const header = select("[data-motion-header]");
        const introElements = select("[data-motion-intro]");
        const shouldAnimateHeader = !headerHasAnimated.current && header.length;
        const introTimeline = gsap.timeline({
          defaults: { ease: "power3.out" },
        });

        if (shouldAnimateHeader) {
          introTimeline.fromTo(
            header,
            { autoAlpha: 0, y: -12 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              clearProps: "opacity,transform,visibility",
            },
          );
          headerHasAnimated.current = true;
        }

        if (introElements.length) {
          introTimeline.fromTo(
            introElements,
            { autoAlpha: 0, y: 16 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.68,
              stagger: 0.07,
              clearProps: "opacity,transform,visibility",
            },
            shouldAnimateHeader ? "-=0.36" : 0,
          );
        }

        select("[data-motion-reveal]").forEach((element) => {
          gsap.fromTo(
            element,
            { autoAlpha: 0, y: 20 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.72,
              ease: "power3.out",
              clearProps: "opacity,transform,visibility",
              scrollTrigger: {
                trigger: element,
                start: "top 88%",
                once: true,
              },
            },
          );
        });

        const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());

        return () => cancelAnimationFrame(refreshFrame);
      });

      media.add("(prefers-reduced-motion: reduce)", () => {
        const targets = select(motionTargets);

        if (targets.length) {
          gsap.set(targets, { clearProps: "all" });
        }
      });

      return () => media.revert();
    },
    { dependencies: [pathname], revertOnUpdate: true, scope },
  );

  return (
    <div ref={scope} className="relative z-20">
      {children}
    </div>
  );
}
