"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MOTION_OK_QUERY } from "@/lib/gsap";

export interface ScrollSectionBuildContext {
  tl: gsap.core.Timeline;
  el: HTMLElement;
  q: gsap.utils.SelectorFunc;
  isDesktop: boolean;
  isMobile: boolean;
}

export interface ScrollSectionProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  /** Pin the section while its timeline scrubs. */
  pin?: boolean;
  /** ScrollTrigger end, e.g. "+=260%". */
  end?: string;
  /** Scrub amount; defaults to 1 (smoothed). */
  scrub?: number | boolean;
  /** Start override. Defaults to "top top" when pinned, "top 80%" otherwise. */
  start?: string;
  /** Populates the scrubbed timeline. Runs only when motion is allowed. */
  build: (ctx: ScrollSectionBuildContext) => void;
  children: ReactNode;
}

/**
 * Generic scroll-driven section. Creates one scrubbed GSAP timeline bound to
 * the section, wrapped in gsap.matchMedia so reduced-motion users get a static
 * (fully visible) section.
 */
export function ScrollSection({
  id,
  className = "",
  style,
  pin = false,
  end,
  scrub,
  start,
  build,
  children,
}: ScrollSectionProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(
        {
          motionOk: MOTION_OK_QUERY,
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
        },
        (ctx) => {
          const conditions = ctx.conditions ?? {};
          if (!conditions.motionOk) return;
          const q = gsap.utils.selector(el);
          const tl = gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: {
              trigger: el,
              start: start ?? (pin ? "top top" : "top 80%"),
              end: end ?? (pin ? "+=150%" : "top 30%"),
              scrub: scrub ?? 1,
              pin,
              pinSpacing: pin,
              anticipatePin: pin ? 1 : 0,
              invalidateOnRefresh: true,
            },
          });
          build({
            tl,
            el,
            q,
            isDesktop: Boolean(conditions.isDesktop),
            isMobile: Boolean(conditions.isMobile),
          });
        }
      );
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id={id} data-scroll-section className={className} style={style}>
      {children}
    </section>
  );
}

export default ScrollSection;
