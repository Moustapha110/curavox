"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MOTION_OK_QUERY } from "@/lib/gsap";
import { GlassCard } from "@/components/GlassCard";
import { FEATURES } from "@/lib/constants";

const iconProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const ICONS: Record<string, ReactNode> = {
  globe: (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  ),
  mic: (
    <svg {...iconProps}>
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8" />
    </svg>
  ),
  shield: (
    <svg {...iconProps}>
      <path d="M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  wallet: (
    <svg {...iconProps}>
      <path d="M3 7a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
      <path d="M3 10h18M16 14h2" />
    </svg>
  ),
  zap: (
    <svg {...iconProps}>
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
    </svg>
  ),
  lock: (
    <svg {...iconProps}>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4M12 15v2" />
    </svg>
  ),
};

export function FeaturesGrid() {
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

        const head = q<HTMLElement>("[data-features-head]")[0];
        if (head) {
          gsap.from(head, {
            y: 40,
            opacity: 0,
            ease: "none",
            scrollTrigger: { trigger: head, start: "top 85%", end: "top 55%", scrub: true },
          });
        }

        q<HTMLElement>("[data-feature]").forEach((card) => {
          gsap.from(card, {
            y: 60,
            opacity: 0,
            ease: "none",
            scrollTrigger: { trigger: card, start: "top 92%", end: "top 65%", scrub: true },
          });
        });
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="features" className="relative px-5 py-24 md:px-8 md:py-36">
      <div className="mx-auto w-full max-w-5xl">
        <div data-features-head className="mx-auto max-w-3xl text-center will-change-transform">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Features</p>
          <h2 className="mt-4 text-balance font-display text-3xl font-bold tracking-[-0.02em] text-ink sm:text-4xl md:text-6xl">
            Built for the moment after the prescription.
          </h2>
          <p className="mt-5 text-balance text-base leading-relaxed text-mist md:text-lg">
            Everything a patient needs to feel safe with a new medication, delivered through the
            Impiricus platform physicians already use.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 md:gap-6 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} data-feature className="will-change-transform">
              <GlassCard
                title={feature.title}
                description={feature.description}
                icon={ICONS[feature.icon] ?? ICONS.globe}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesGrid;
