import type { Metadata } from "next";
import { PortalShell } from "@/components/physician/PortalShell";
import { StatCard } from "@/components/physician/StatCard";
import { CompanionTable } from "@/components/physician/CompanionTable";
import { CoraInbox } from "@/components/physician/CoraInbox";
import { Button } from "@/components/ui/Button";
import { DASHBOARD_STATS } from "@/data/demo-companions";
import { DEMO_DOCTOR, ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Dashboard",
};

function CompanionsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.2-.6L3 21l1.7-4.2A8.4 8.4 0 0 1 3 11.5a8.4 8.4 0 0 1 9-8.4 8.4 8.4 0 0 1 9 8.4Z" />
    </svg>
  );
}

function PatientsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
    </svg>
  );
}

function LanguagesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export default function DashboardPage() {
  return (
    <PortalShell>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Dashboard</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Welcome, {DEMO_DOCTOR.name}
          </h1>
          <p className="mt-2 text-sm text-mist">
            {DEMO_DOCTOR.clinic} · {DEMO_DOCTOR.specialty}
          </p>
        </div>
        <Button href={ROUTES.create} size="lg" icon={<PlusIcon />}>
          Create New Companion
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Companions Created"
          value={DASHBOARD_STATS.companionsCreated}
          icon={<CompanionsIcon />}
          hint="All time"
        />
        <StatCard
          label="Active Patients"
          value={DASHBOARD_STATS.activePatients}
          icon={<PatientsIcon />}
          hint="Opened a companion in the last 30 days"
        />
        <StatCard
          label="Languages Supported"
          value={DASHBOARD_STATS.languagesSupported}
          icon={<LanguagesIcon />}
          hint="Spanish, French, English"
        />
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-ink">Recent companions</h2>
          <span className="text-xs text-mist">Demo data</span>
        </div>
      <div className="mt-8">
        <CoraInbox />
      </div>
        <CompanionTable />
      </section>
    </PortalShell>
  );
}
