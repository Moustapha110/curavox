import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { EVENT, POWERED_BY, ROUTES } from "@/lib/constants";

const FOOTER_LINKS = [
  { label: "Home", href: ROUTES.home },
  { label: "Physicians", href: ROUTES.physician },
  { label: "Patients", href: ROUTES.patientInfo },
] as const;

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-surface-2 px-5 py-14 md:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-4">
          <Logo withImpiricus />
          <p className="max-w-sm text-sm leading-relaxed text-mist">
            A multilingual AI medication companion that a physician can hand to any patient in
            seconds.
          </p>
        </div>

        <nav aria-label="Footer" className="flex gap-6 text-sm text-mist">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mx-auto mt-12 flex w-full max-w-5xl flex-col gap-3 border-t border-line pt-6 text-xs text-mist md:flex-row md:items-center md:justify-between">
        <p className="font-medium text-ink/60">
          Built at {EVENT} · {POWERED_BY}
        </p>
        <p className="max-w-xl text-mist/70 md:text-right">
          CuraVox is a hackathon prototype built for the Impiricus challenge as an extension of the
          Impiricus HCP engagement platform. Impiricus is a trademark of its owner; this project is
          not an official Impiricus product. AI answers are not medical advice.
        </p>
      </div>
      <p className="mx-auto mt-4 w-full max-w-5xl text-[11px] text-mist/50">
        2026 CuraVox team. Metformin demo content is illustrative.
      </p>
    </footer>
  );
}

export default Footer;
