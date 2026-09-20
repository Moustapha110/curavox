"use client";

import { gsap } from "@/lib/gsap";
import { ScrollSection } from "@/components/ScrollSection";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";

/* Subtle SVG heartbeat line that draws in on scroll */
function HeartbeatLine() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 opacity-[0.05]"
      width="320"
      height="40"
      viewBox="0 0 320 40"
      fill="none"
    >
      <path
        d="M0 20h90l10-16 14 32 12-24 8 14h6l10-16 14 32 12-24 8 14H320"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-accent svg-draw"
        style={{ "--dash-length": "600" } as React.CSSProperties}
      />
    </svg>
  );
}

export function PhysicianCTA() {
  return (
    <ScrollSection
      id="physicians"
      start="top 80%"
      end="top 45%"
      scrub={true}
      className="relative overflow-hidden border-t border-line px-5 py-28 md:px-8 md:py-40"
      build={({ tl, q }) => {
        tl.from(q("[data-cta-content]"), { y: 50, opacity: 0, scale: 0.96, duration: 1, ease: "power2.out" }, 0);
      }}
    >
      <div data-cta-content className="relative z-10 mx-auto max-w-3xl text-center will-change-transform">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">For physicians</p>
        <h2 className="mt-4 text-balance font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl md:text-7xl">
          Bridge the language gap{" "}
          <span className="text-accent">today.</span>
        </h2>
        <p className="mt-6 text-balance text-base leading-relaxed text-mist md:text-xl">
          Create a CuraVox companion in under a minute, right from the Impiricus workflow you already
          use. Your patients get answers they understand. You get fewer callbacks.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Button href={ROUTES.physician} size="lg">
            Open the physician portal
          </Button>
          <Button href={ROUTES.patientInfo} variant="secondary" size="lg">
            See the patient experience
          </Button>
        </div>
        <p className="mt-6 text-xs text-mist/70">Demo login: demo@impiricus.com · curavox2026</p>
      </div>
      <HeartbeatLine />
    </ScrollSection>
  );
}

export default PhysicianCTA;
