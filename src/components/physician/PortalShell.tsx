"use client";

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { DEMO_DOCTOR, ROUTES } from "@/lib/constants";
import {
  getPhysicianServerSnapshot,
  isPhysicianLoggedIn,
  logoutPhysician,
  subscribePhysicianSession,
} from "@/lib/physician-session";

const NAV = [
  { href: ROUTES.dashboard, label: "Dashboard" },
  { href: ROUTES.create, label: "Create" },
] as const;

export interface PortalShellProps {
  children: ReactNode;
}

export function PortalShell({ children }: PortalShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const loggedIn = useSyncExternalStore(
    subscribePhysicianSession,
    isPhysicianLoggedIn,
    getPhysicianServerSnapshot,
  );

  // Only redirect once we have read the browser session; the server snapshot is always "logged out".
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready && !loggedIn) router.replace(ROUTES.physician);
  }, [ready, loggedIn, router]);

  function handleSignOut() {
    logoutPhysician();
    router.replace(ROUTES.physician);
  }

  const initials = DEMO_DOCTOR.fullName
    .replace(/^Dr\.\s*/, "")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative flex min-h-dvh flex-col bg-canvas">
      <header className="sticky top-0 z-40 border-b border-line bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Logo href={ROUTES.dashboard} size="sm" />
            <nav className="hidden items-center gap-1 md:flex" aria-label="Portal">
              {NAV.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      active ? "bg-accent-soft text-accent" : "text-mist hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-3 text-sm text-ink md:inline-flex">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent font-display text-xs font-bold text-canvas">
                {initials}
              </span>
              {DEMO_DOCTOR.name}
            </span>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-full border border-line px-3.5 py-1.5 text-sm text-mist transition-colors hover:border-line hover:text-ink"
            >
              Sign out
            </button>
          </div>
        </div>

        <nav className="flex gap-1 border-t border-line px-4 py-2 md:hidden" aria-label="Portal mobile">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex-1 rounded-full px-3 py-1.5 text-center text-sm font-medium ${
                  active ? "bg-accent-soft text-accent" : "text-mist"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {loggedIn ? (
          children
        ) : (
          <div className="flex min-h-[40vh] items-center justify-center text-sm text-mist">
            Checking your session...
          </div>
        )}
      </main>

      <footer className="relative z-10 border-t border-line px-4 py-4 text-center text-xs text-mist/70">
        {DEMO_DOCTOR.clinic} · {DEMO_DOCTOR.specialty} · Demo session, no data stored
      </footer>
    </div>
  );
}

export default PortalShell;
