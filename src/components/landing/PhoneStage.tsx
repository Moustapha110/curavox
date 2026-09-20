"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK_QUERY } from "@/lib/gsap";
import { Phone3D } from "@/components/Phone3D";
import { ChatMockup } from "@/components/landing/ChatMockup";
import { DEMO_DOCTOR } from "@/lib/constants";

const STEPS = [
  {
    n: "01",
    title: "Prescribe",
    body: `${DEMO_DOCTOR.name} writes a prescription and picks the patient's language.`,
  },
  {
    n: "02",
    title: "Create",
    body: "One tap creates a persistent AI companion with a QR code to hand to the patient.",
  },
  {
    n: "03",
    title: "Chat",
    body: "The patient scans the code and asks questions in their own language, by text or by voice.",
  },
] as const;

/** Subtle SVG connector line between steps */
function StepConnector() {
  return (
    <div className="ml-[19px] flex h-6 items-center">
      <svg width="2" height="24" viewBox="0 0 2 24" fill="none" aria-hidden>
        <line
          x1="1" y1="0" x2="1" y2="24"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          className="text-line-strong"
        />
      </svg>
    </div>
  );
}

export function PhoneStage() {
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

        const phone = q<HTMLElement>("[data-phone]")[0];
        if (phone) {
          gsap.from(phone, {
            y: 50, opacity: 0, ease: "none",
            scrollTrigger: { trigger: phone, start: "top 85%", end: "top 55%", scrub: true },
          });
        }

        q<HTMLElement>("[data-step]").forEach((step) => {
          gsap.from(step, {
            y: 24, opacity: 0, ease: "none",
            scrollTrigger: { trigger: step, start: "top 90%", end: "top 72%", scrub: true },
          });
        });

        const head = q<HTMLElement>("[data-stage-head]")[0];
        if (head) {
          gsap.from(head, {
            y: 30, opacity: 0, ease: "none",
            scrollTrigger: { trigger: head, start: "top 85%", end: "top 60%", scrub: true },
          });
        }
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="how-it-works" className="relative border-t border-line px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto w-full max-w-5xl">
        <div data-stage-head className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">How it works</p>
          <h2 className="mt-4 text-balance font-display text-3xl font-bold tracking-[-0.02em] text-ink sm:text-4xl md:text-5xl">
            Three steps. One minute. Done.
          </h2>
        </div>

        <div className="mt-14 flex flex-col items-center gap-12 md:mt-20 md:grid md:grid-cols-2 md:items-center md:gap-16">
          {/* Steps */}
          <div className="flex flex-col">
            {STEPS.map((step, i) => (
              <div key={step.n}>
                <div data-step className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-sm font-bold text-accent shadow-card">
                    {step.n}
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold tracking-tight text-ink md:text-xl">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-mist">{step.body}</p>
                  </div>
                </div>
                {i < STEPS.length - 1 && <StepConnector />}
              </div>
            ))}
          </div>

          {/* Phone */}
          <div className="flex justify-center" style={{ perspective: 1200 }}>
            <Phone3D style={{ width: "clamp(220px, 22vw, 280px)" }}>
              <ChatMockup />
            </Phone3D>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PhoneStage;
