"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK_QUERY } from "@/lib/gsap";

/**
 * A persistent glowing orb fixed behind the page. One page-length scrubbed
 * timeline moves it through every section so the hero's light source is the
 * same object the user sees at the CTA.
 */
export function AmbientOrb() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const orb = root.querySelector<HTMLElement>("[data-orb]");
      const tint = root.querySelector<HTMLElement>("[data-orb-tint]");
      const drift = root.querySelector<HTMLElement>("[data-orb-drift]");
      if (!orb || !tint || !drift) return;

      const mm = gsap.matchMedia();
      mm.add(
        { motionOk: MOTION_OK_QUERY, isDesktop: "(min-width: 768px)" },
        (ctx) => {
          const c = ctx.conditions ?? {};
          if (!c.motionOk) {
            gsap.set(orb, { opacity: 0.35, scale: 0.9 });
            return;
          }

          const landing = document.querySelector("[data-landing]") ?? document.body;
          const travel = c.isDesktop ? 1 : 0.55;

          // Positions roughly follow the scroll length of each section:
          // hero ~1.9vh, problem ~3.6vh, phone stage ~6.2vh, features ~1.5vh,
          // CTA ~1vh, footer ~0.4vh (total 14.6 units).
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: landing,
              start: "top top",
              end: "bottom bottom",
              scrub: 1.2,
              invalidateOnRefresh: true,
            },
          });

          tl.to(orb, { xPercent: 35 * travel, yPercent: -6, scale: 1.5, opacity: 0.55, duration: 1.8 }, 0.6)
            .to(orb, { xPercent: -30 * travel, yPercent: 6, scale: 1.2, opacity: 0.7, duration: 2 }, 4.5)
            .to(tint, { opacity: 1, duration: 2 }, 4.5)
            .to(orb, { xPercent: 0, yPercent: 0, scale: 0.8, opacity: 0.25, duration: 1.4 }, 10.8)
            .to(tint, { opacity: 0, duration: 1.4 }, 10.8)
            .to(orb, { scale: 2.2, opacity: 0.9, duration: 1 }, 12.6)
            .to(orb, { scale: 1.6, opacity: 0.15, duration: 0.6 }, 14)
            .to({}, { duration: 0.01 }, 14.6);

          // Subtle pointer parallax on desktop.
          if (!c.isDesktop) return;
          const xTo = gsap.quickTo(drift, "x", { duration: 1.4, ease: "power3.out" });
          const yTo = gsap.quickTo(drift, "y", { duration: 1.4, ease: "power3.out" });
          const onMove = (e: PointerEvent) => {
            const nx = e.clientX / window.innerWidth - 0.5;
            const ny = e.clientY / window.innerHeight - 0.5;
            xTo(nx * 60);
            yTo(ny * 40);
          };
          window.addEventListener("pointermove", onMove, { passive: true });
          return () => window.removeEventListener("pointermove", onMove);
        }
      );
    },
    { scope: ref }
  );

  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        data-orb
        className="absolute left-1/2 top-1/2 h-[64vmin] w-[64vmin] will-change-transform"
        style={{ marginLeft: "-32vmin", marginTop: "-32vmin" }}
      >
        <div data-orb-drift className="relative h-full w-full">
          <div className="animate-float relative h-full w-full">
            {/* Gold halo */}
            <div
              className="absolute -inset-[12%] rounded-full opacity-30 blur-2xl md:blur-3xl"
              style={{
                background:
                  "radial-gradient(circle at 60% 60%, rgba(245,185,74,.35), transparent 60%)",
              }}
            />
            {/* Brand core */}
            <div
              className="absolute inset-0 rounded-full blur-2xl md:blur-3xl"
              style={{
                background:
                  "radial-gradient(circle at 42% 40%, rgba(247,94,94,.6) 0%, rgba(247,94,94,.22) 38%, rgba(247,94,94,.05) 62%, transparent 72%)",
              }}
            />
            {/* Gold tint, faded in during the phone stage */}
            <div
              data-orb-tint
              className="absolute inset-0 rounded-full opacity-0 blur-2xl md:blur-3xl"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(245,185,74,.55) 0%, rgba(245,185,74,.18) 40%, transparent 70%)",
              }}
            />
            {/* Rotating conic ring */}
            <div
              className="animate-spin-slow absolute inset-[16%] rounded-full opacity-50"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0%, rgba(247,94,94,.8) 12%, transparent 30%, rgba(245,185,74,.7) 52%, transparent 70%, rgba(247,94,94,.5) 88%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(circle, transparent 57%, black 59%, black 65%, transparent 67%)",
                maskImage:
                  "radial-gradient(circle, transparent 57%, black 59%, black 65%, transparent 67%)",
              }}
            />
            {/* Inner bright spot */}
            <div
              className="absolute inset-[34%] rounded-full blur-xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,.35) 0%, rgba(247,94,94,.35) 40%, transparent 70%)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AmbientOrb;
