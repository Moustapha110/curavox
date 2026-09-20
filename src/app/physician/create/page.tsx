import type { Metadata } from "next";
import { PortalShell } from "@/components/physician/PortalShell";
import { CreateCompanionWizard } from "@/components/physician/CreateCompanionWizard";

export const metadata: Metadata = {
  title: "Create Companion",
};

export default function CreateCompanionPage() {
  return (
    <PortalShell>
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">New companion</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Create a medication companion
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-sm text-mist">
          Four quick steps. The result is a QR code and link your patient can open on any phone.
        </p>
      </div>
      <CreateCompanionWizard />
    </PortalShell>
  );
}
