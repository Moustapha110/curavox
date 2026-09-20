"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK_QUERY } from "@/lib/gsap";
import { STATS } from "@/lib/constants";

export function ProblemSection() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add({ motionOk: MOTION_OK_QUERY }, (ctx) => {
        const c = ctx.conditions ?? {};
        if (!c.motionOk) return;

        const head = q<HTMLElement>("[data-problem-head]")[0];
        if (head) {
          gsap.from(head, {
            y: 30, opacity: 0, ease: "none",
            scrollTrigger: { trigger: head, start: "top 85%", end: "top 60%", scrub: true },
          });
        }

        q<HTMLElement>("[data-stat]").forEach((card) => {
          gsap.from(card, {
            y: 40, opacity: 0, ease: "none",
            scrollTrigger: { trigger: card, start: "top 90%", end: "top 65%", scrub: true },
          });
        });
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="problem" className="relative border-t border-line px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto w-full max-w-5xl">
        <div data-problem-head className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">The problem</p>
          <h2 className="mt-4 text-balance font-display text-3xl font-bold tracking-[-0.02em] text-ink sm:text-4xl md:text-5xl">
            A prescription you can&apos;t read is a prescription you can&apos;t follow.
          </h2>
        </div>

        <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3 md:gap-5">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              data-stat
              className="rounded-2xl border border-line bg-surface p-6 shadow-card transition-shadow hover:shadow-card-hover"
            >
              <div className="font-display text-4xl font-bold tracking-tight text-accent md:text-5xl">
                {stat.prefix && <span className="text-2xl text-mist md:text-3xl">{stat.prefix}</span>}
                <span>{stat.value}</span>
                {stat.suffix && <span>{stat.suffix}</span>}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-mist">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProblemSection;
