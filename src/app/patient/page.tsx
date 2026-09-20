import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { buildCompanionPath } from "@/lib/companion";
import { DEMO_DOCTOR, ROUTES, TAGLINE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "For patients",
  description: "How to use your CuraVox medication companion.",
};

const STEPS = [
  {
    n: "1",
    title: "Scan the QR code from your doctor",
    body: "Your doctor gives you a QR code or a link. Point your phone camera at it, no app to install and no account to create.",
  },
  {
    n: "2",
    title: "Ask anything about your medication",
    body: "Type or speak in your own language. CuraVox explains how to take it, what to expect, and what to do if you miss a dose.",
  },
  {
    n: "3",
    title: "Hear the answer read aloud",
    body: "Tap the speaker on any reply to listen. If something sounds serious, CuraVox tells you to call 911 and your doctor right away.",
  },
];

export default function PatientInfoPage() {
  const demoHref = buildCompanionPath("demo", {
    drug: "metformin",
    lang: "es",
    doctor: DEMO_DOCTOR.name,
    patient: "María",
  });

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-canvas">
      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8">
        <Logo />
        <Link
          href={ROUTES.home}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-4 text-sm text-mist transition-colors hover:border-accent/40 hover:text-accent"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </Link>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-5 pb-20 pt-8 sm:px-8 sm:pt-14">
        <h1 className="mt-5 text-center font-display text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="text-accent">For patients</span>
        </h1>
        <p className="mt-4 max-w-xl text-center text-base leading-relaxed text-mist sm:text-lg">
          {TAGLINE} CuraVox is a free companion your doctor creates for you. It only talks about the
          medication you were prescribed, in Spanish, French, or English.
        </p>

        <div className="mt-10 w-full rounded-3xl bg-surface border border-line p-5 sm:p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
            You need a link or QR code from your doctor
          </p>
          <p className="mt-2 text-sm leading-relaxed text-mist">
            Each companion is made for one prescription. If you do not have one yet, ask your doctor
            or clinic to create a CuraVox companion for you at your next visit.
          </p>
        </div>

        <ol className="mt-8 grid w-full gap-4 sm:grid-cols-3">
          {STEPS.map((step) => (
            <li key={step.n} className="rounded-3xl bg-surface border border-line p-5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent font-display text-base font-bold text-canvas">
                {step.n}
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold text-ink">{step.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-mist">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col items-center gap-3">
          <Button href={demoHref} size="lg">
            Try a demo companion
          </Button>
          <p className="text-xs text-mist">
            Opens a sample Spanish companion for Metformin prescribed by {DEMO_DOCTOR.name}.
          </p>
        </div>

        <p className="mt-14 max-w-lg text-center text-xs leading-relaxed text-mist/80">
          CuraVox is an AI assistant, not a doctor. It never changes your dose or gives a diagnosis.
          In an emergency, call 911.
        </p>
      </main>
    </div>
  );
}
