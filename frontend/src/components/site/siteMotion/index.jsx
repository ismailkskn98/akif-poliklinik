"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function SiteMotion({ children }) {
  const pathname = usePathname();
  const scope = useRef(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      const select = gsap.utils.selector(scope);

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const header = select("[data-motion-header]");

        if (header.length) {
          gsap.to(header, {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
          });
        }
      });

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(select("[data-motion-header]"), { clearProps: "all" });
      });

      return () => media.revert();
    },
    { scope },
  );

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      const select = gsap.utils.selector(scope);

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const introElements = select("[data-motion-intro]");

        if (introElements.length) {
          gsap.to(introElements, {
            autoAlpha: 1,
            y: 0,
            duration: 0.68,
            stagger: 0.07,
            ease: "power3.out",
          });
        }

        select("[data-motion-reveal]").forEach((element) => {
          gsap.to(element, {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
          });
        });

        const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());

        return () => cancelAnimationFrame(refreshFrame);
      });

      media.add("(prefers-reduced-motion: reduce)", () => {
        const targets = select("[data-motion-intro], [data-motion-reveal]");

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
