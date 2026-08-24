"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const motionTargets =
  "[data-motion-header], [data-motion-intro], [data-motion-reveal]";

export default function SiteMotion() {
  const pathname = usePathname();
  const headerHasAnimated = useRef(false);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const introTimeline = gsap.timeline({
          defaults: { ease: "power3.out" },
        });

        if (!headerHasAnimated.current) {
          introTimeline.fromTo(
            "[data-motion-header]",
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

        introTimeline.fromTo(
          "[data-motion-intro]",
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.68,
            stagger: 0.07,
            clearProps: "opacity,transform,visibility",
          },
          headerHasAnimated.current ? "-=0.36" : 0,
        );

        gsap.utils.toArray("[data-motion-reveal]").forEach((element) => {
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

        requestAnimationFrame(() => ScrollTrigger.refresh());
      });

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(motionTargets, { clearProps: "all" });
      });

      return () => media.revert();
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
