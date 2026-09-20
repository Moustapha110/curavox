"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK_QUERY } from "@/lib/gsap";
import { Button } from "@/components/ui/Button";
import { ROUTES, TAGLINE } from "@/lib/constants";

const TITLE_CHARS = ["C", "u", "r", "a", "V", "o", "x"] as const;
const ACCENT_FROM = 4;

/** Subtle SVG heartbeat line that draws itself in */
function PulseLine() {
  return (
    <svg
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.07]"
      width="600"
      height="80"
      viewBox="0 0 600 80"
      fill="none"
      aria-hidden
    >
      <path
        d="M0 40h180l15-28 20 56 18-42 12 24 10-10h345"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-accent"
        style={{
          strokeDasharray: 800,
          strokeDashoffset: 800,
          animation: "line-draw 3s ease-out 0.8s forwards",
        }}
      />
    </svg>
  );
}

export function Hero() {
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

        const enter = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.15 });
        enter
          .from(q("[data-char]"), { y: 50, opacity: 0, stagger: 0.04, duration: 1 })
          .from(q("[data-enter]"), { y: 20, opacity: 0, duration: 0.8, stagger: 0.1 }, "-=0.5");
      });
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      data-hero
      className="relative flex min-h-[80svh] items-center justify-center overflow-hidden px-5 py-20 md:min-h-[85svh] md:py-28"
    >
      <PulseLine />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
        <h1
          aria-label="CuraVox"
          className="font-display text-[clamp(3.5rem,13vw,9rem)] font-bold leading-[0.92] tracking-[-0.05em]"
        >
          {TITLE_CHARS.map((ch, i) => (
            <span
              key={`${ch}-${i}`}
              data-char
              aria-hidden
              className={`inline-block ${i >= ACCENT_FROM ? "text-accent" : "text-ink"}`}
            >
              {ch}
            </span>
          ))}
        </h1>

        <p className="mt-5 max-w-lg">
          <span data-enter className="block text-balance text-lg leading-relaxed text-mist md:text-xl">
            {TAGLINE}
          </span>
        </p>

        <div className="mt-8">
          <div data-enter className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <Button href={ROUTES.physician} size="lg">
              I&apos;m a Physician
            </Button>
            <Button href={ROUTES.patientInfo} variant="secondary" size="lg">
              I&apos;m a Patient
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
