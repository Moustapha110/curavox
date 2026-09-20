"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { motion, useScroll } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";

function subscribeScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}
const getScrolled = () => window.scrollY > 24;
const getScrolledServer = () => false;

const NAV_LINKS = [
  { label: "Physicians", href: ROUTES.physician },
  { label: "Patients", href: ROUTES.patientInfo },
] as const;

export function Navbar() {
  const scrolled = useSyncExternalStore(subscribeScroll, getScrolled, getScrolledServer);
  const { scrollYProgress } = useScroll();

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled
          ? "border-b border-line bg-canvas/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <Logo size="sm" />

        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-mist transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Button href={ROUTES.physician} size="sm">
          Physician login
        </Button>
      </nav>

      <motion.div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-brand"
        style={{ scaleX: scrollYProgress }}
      />
    </header>
  );
}

export default Navbar;
