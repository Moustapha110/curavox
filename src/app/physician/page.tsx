import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/physician/LoginForm";
import { Logo } from "@/components/ui/Logo";
import { ROUTES, TAGLINE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Physician Login",
  description: "Sign in to create CuraVox medication companions for your patients.",
};

const VALUE_POINTS = [
  {
    title: "Create a companion in under a minute",
    body: "Pick the medication, pick the language, add a first name. Done.",
  },
  {
    title: "Patients scan, no app required",
    body: "A QR code opens the companion in any phone browser, in their language.",
  },
  {
    title: "Only physician-approved drug information",
    body: "The AI answers strictly from the drug data and redirects everything else to you.",
  },
];

export default function PhysicianLoginPage() {
  return (
    <div className="relative flex min-h-dvh flex-col bg-canvas lg:flex-row">
      {/* Left brand panel */}
      <section className="relative flex flex-col justify-between px-6 py-8 sm:px-10 lg:w-1/2 lg:px-14 lg:py-12">
        <div className="flex items-center justify-between">
          <Logo />
          <Link
            href={ROUTES.home}
            className="text-sm text-mist transition-colors hover:text-accent"
          >
            Back to site
          </Link>
        </div>

        <div className="my-10 lg:my-0">
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            The physician portal for{" "}
            <span className="text-accent">CuraVox</span>
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-mist">
            {TAGLINE}
          </p>

          <ul className="mt-10 hidden space-y-5 lg:block">
            {VALUE_POINTS.map((v) => (
              <li key={v.title} className="flex gap-4">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="m5 12 5 5L20 7" />
                  </svg>
                </span>
                <div>
                  <p className="font-semibold text-ink">{v.title}</p>
                  <p className="mt-0.5 text-sm text-mist">{v.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="hidden text-xs text-mist/70 lg:block">
          Built at VTHacks 14
        </p>
      </section>

      {/* Right login panel */}
      <section className="relative flex flex-1 items-center justify-center bg-surface-2 px-5 pb-12 lg:px-14 lg:py-12">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </section>
    </div>
  );
}
