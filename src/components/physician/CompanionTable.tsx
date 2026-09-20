"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QRModal } from "./QRModal";
import { DEMO_COMPANIONS } from "@/data/demo-companions";
import { LANGUAGE_MAP } from "@/lib/constants";
import { buildCompanionUrl } from "@/lib/companion";
import { usePublicOrigin } from "@/hooks/usePublicOrigin";
import { getKB, companionNotesFrom } from "@/lib/knowledge-base";
import { getDrug } from "@/data/metformin";
import type { Companion } from "@/lib/types";

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/** Precomputed at module load from fixed ISO strings (no Date construction during render). */
const FORMATTED_DATES: Record<string, string> = Object.fromEntries(
  DEMO_COMPANIONS.map((c) => [c.id, DATE_FORMAT.format(new Date(c.createdAt))]),
);

function QrIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <path d="M14 14h3v3h-3zM20 14v1M20 20h1M14 20h3M20 17v1" />
    </svg>
  );
}

export interface CompanionTableProps {
  companions?: Companion[];
}

export function CompanionTable({ companions = DEMO_COMPANIONS }: CompanionTableProps) {
  const router = useRouter();
  const publicOrigin = usePublicOrigin();
  const [selected, setSelected] = useState<{ companion: Companion; url: string } | null>(null);

  function openQr(e: React.MouseEvent, c: Companion) {
    e.stopPropagation();
    const origin = publicOrigin || window.location.origin;
    const notes = companionNotesFrom(getKB(c.id));
    setSelected({ companion: c, url: buildCompanionUrl(origin, c.id, { ...c, notes: notes.length > 0 ? notes : undefined }) });
  }

  function navigateToPatient(c: Companion) {
    router.push(`/physician/patient/${c.id}`);
  }

  function close() {
    setSelected(null);
  }

  const qrButtonClass =
    "inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3.5 text-xs font-semibold text-mist transition-colors hover:border-accent hover:text-accent";

  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-line bg-surface md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-surface-2 text-xs uppercase tracking-[0.14em] text-mist">
              <th className="px-5 py-3.5 font-semibold">Patient</th>
              <th className="px-5 py-3.5 font-semibold">Medication</th>
              <th className="px-5 py-3.5 font-semibold">Language</th>
              <th className="px-5 py-3.5 font-semibold">Created</th>
              <th className="px-5 py-3.5 text-right font-semibold">QR code</th>
            </tr>
          </thead>
          <tbody>
            {companions.map((c) => {
              const lang = LANGUAGE_MAP[c.lang];
              return (
                <tr
                  key={c.id}
                  onClick={() => navigateToPatient(c)}
                  className="cursor-pointer border-t border-line text-ink transition-colors last:border-0 hover:bg-surface-2/50"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft font-display text-xs font-bold text-accent">
                        {(c.patient ?? "?").slice(0, 1).toUpperCase()}
                      </span>
                      <div>
                        <p className="font-medium text-ink">{c.patient ?? "Anonymous patient"}</p>
                        <p className="font-mono text-[11px] text-mist">{c.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-ink">{getDrug(c.drug).drugName}</td>
                  <td className="px-5 py-3.5 text-ink">
                    <span className="mr-1.5">{lang.flag}</span>
                    {lang.nativeLabel}
                  </td>
                  <td className="px-5 py-3.5 text-mist">{FORMATTED_DATES[c.id] ?? c.createdAt.slice(0, 10)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button type="button" onClick={(e) => openQr(e, c)} className={qrButtonClass}>
                      <QrIcon />
                      Show
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden">
        {companions.map((c) => {
          const lang = LANGUAGE_MAP[c.lang];
          return (
            <li
              key={c.id}
              onClick={() => navigateToPatient(c)}
              className="cursor-pointer rounded-2xl border border-line bg-surface p-4 transition-colors hover:bg-surface-2/50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft font-display text-sm font-bold text-accent">
                    {(c.patient ?? "?").slice(0, 1).toUpperCase()}
                  </span>
                  <div>
                    <p className="font-medium text-ink">{c.patient ?? "Anonymous patient"}</p>
                    <p className="text-xs text-mist">
                      {getDrug(c.drug).drugName} · {lang.flag} {lang.nativeLabel}
                    </p>
                  </div>
                </div>
                <button type="button" onClick={(e) => openQr(e, c)} className={qrButtonClass} aria-label="Show QR code">
                  <QrIcon />
                </button>
              </div>
              <p className="mt-3 text-xs text-mist">
                Created {FORMATTED_DATES[c.id] ?? c.createdAt.slice(0, 10)} · <span className="font-mono">{c.id}</span>
              </p>
            </li>
          );
        })}
      </ul>

      <QRModal companion={selected?.companion ?? null} url={selected?.url ?? null} onClose={close} />
    </>
  );
}

export default CompanionTable;
