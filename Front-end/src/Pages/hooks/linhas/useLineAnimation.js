import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function useEnterAnimation(sectionRef, elementRefs, options = {}) {
  useEffect(() => {
    if (!sectionRef.current) return;

    const triggers = [];

    const direction = options.direction ?? "left-to-right";

    function getInitialClipPath() {
      if (direction === "left-to-right") {
        return "inset(0 100% 0 0)";
      }

      if (direction === "right-to-left") {
        return "inset(0 0 0 100%)";
      }

      if (direction === "top-to-bottom") {
        return "inset(0 0 100% 0)";
      }

      if (direction === "bottom-to-top") {
        return "inset(100% 0 0 0)";
      }

      return "inset(0 100% 0 0)";
    }

    elementRefs.forEach((elementRef, index) => {
      if (!elementRef?.current) return;

      gsap.set(elementRef.current, {
        opacity: 1,
        clipPath: getInitialClipPath(),
        WebkitClipPath: getInitialClipPath(),
      });

      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        scroller: ".container",
        start: options.start ?? "top center",

        onEnter: () => {
          gsap.fromTo(
            elementRef.current,
            {
              clipPath: getInitialClipPath(),
              WebkitClipPath: getInitialClipPath(),
            },
            {
              clipPath: "inset(0 0% 0 0)",
              WebkitClipPath: "inset(0 0% 0 0)",
              duration: options.duration ?? 1.4,
              delay: index * (options.stagger ?? 0.2),
              ease: options.ease ?? "power3.out",
            }
          );
        },

        onEnterBack: () => {
          gsap.fromTo(
            elementRef.current,
            {
              clipPath: getInitialClipPath(),
              WebkitClipPath: getInitialClipPath(),
            },
            {
              clipPath: "inset(0 0% 0 0)",
              WebkitClipPath: "inset(0 0% 0 0)",
              duration: options.duration ?? 1.4,
              delay: index * (options.stagger ?? 0.2),
              ease: options.ease ?? "power3.out",
            }
          );
        },

        onLeave: () => {
          gsap.set(elementRef.current, {
            clipPath: getInitialClipPath(),
            WebkitClipPath: getInitialClipPath(),
          });
        },

        onLeaveBack: () => {
          gsap.set(elementRef.current, {
            clipPath: getInitialClipPath(),
            WebkitClipPath: getInitialClipPath(),
          });
        },
      });

      triggers.push(trigger);
    });

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);
}