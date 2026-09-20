"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DEMO_COMPANIONS } from "@/data/demo-companions";
import { buildCompanionUrl, encodeCompanionParams } from "@/lib/companion";
import { getKB, addNote, removeNote, saveRecord, companionNotesFrom, EMPTY_RECORD } from "@/lib/knowledge-base";
import { usePublicOrigin } from "@/hooks/usePublicOrigin";
import { getDrug } from "@/data/metformin";
import { LANGUAGE_MAP, ROUTES } from "@/lib/constants";
import { PortalShell } from "@/components/physician/PortalShell";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { CoraInbox } from "@/components/physician/CoraInbox";
import type { KnowledgeBase, PatientRecord } from "@/lib/knowledge-base";

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export default function PatientDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const companion = useMemo(
    () => DEMO_COMPANIONS.find((c) => c.id === id) ?? null,
    [id],
  );

  const publicOrigin = usePublicOrigin();
  const [kb, setKb] = useState<KnowledgeBase>({ notes: [], record: EMPTY_RECORD });
  const [draft, setDraft] = useState("");
  const [recordDraft, setRecordDraft] = useState<PatientRecord>(EMPTY_RECORD);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    if (companion) {
      const loaded = getKB(companion.id);
      setKb(loaded);
      setRecordDraft(loaded.record);
    }
  }, [companion]);

  const companionUrl = useMemo(() => {
    if (!companion) return "";
    const origin = publicOrigin || (typeof window !== "undefined" ? window.location.origin : "");
    const notes = companionNotesFrom(kb);
    return buildCompanionUrl(origin, companion.id, {
      ...companion,
      notes: notes.length > 0 ? notes : undefined,
    });
  }, [companion, kb, publicOrigin]);

  const handleSaveRecord = useCallback(() => {
    if (!companion) return;
    const updated = saveRecord(companion.id, recordDraft);
    setKb({ ...updated });
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1800);
  }, [companion, recordDraft]);

  const setField = (key: keyof PatientRecord) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setRecordDraft((r) => ({ ...r, [key]: e.target.value }));

  const handleAdd = useCallback(() => {
    if (!companion || !draft.trim()) return;
    const updated = addNote(companion.id, draft);
    setKb({ ...updated });
    setDraft("");
  }, [companion, draft]);

  const handleRemove = useCallback(
    (index: number) => {
      if (!companion) return;
      const updated = removeNote(companion.id, index);
      setKb({ ...updated });
    },
    [companion],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleAdd();
      }
    },
    [handleAdd],
  );

  if (!companion) {
    return (
      <PortalShell>
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
          <p className="text-lg text-mist">Patient not found</p>
          <Link
            href={ROUTES.dashboard}
            className="rounded-xl bg-ink text-canvas px-5 py-2.5 text-sm font-semibold"
          >
            Back to dashboard
          </Link>
        </div>
      </PortalShell>
    );
  }

  const drug = getDrug(companion.drug);
  const lang = LANGUAGE_MAP[companion.lang];
  const created = DATE_FORMAT.format(new Date(companion.createdAt));

  return (
    <PortalShell>
      {/* Back link */}
      <Link
        href={ROUTES.dashboard}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-mist transition-colors hover:text-ink"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to dashboard
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: patient info + knowledge base */}
        <div className="space-y-6 lg:col-span-2">
          {/* Patient info card */}
          <div className="rounded-2xl border border-line bg-surface p-6">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-soft font-display text-lg font-bold text-accent">
                {(companion.patient ?? "?").slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0">
                <h1 className="font-display text-2xl font-bold text-ink">
                  {companion.patient ?? "Anonymous patient"}
                </h1>
                <p className="mt-0.5 font-mono text-xs text-mist">
                  ID: {companion.id}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-line bg-surface-2 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mist">
                  Medication
                </p>
                <p className="mt-1 font-medium text-ink">{drug.drugName}</p>
              </div>
              <div className="rounded-xl border border-line bg-surface-2 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mist">
                  Language
                </p>
                <p className="mt-1 font-medium text-ink">
                  <span className="mr-1.5">{lang.flag}</span>
                  {lang.nativeLabel}
                </p>
              </div>
              <div className="rounded-xl border border-line bg-surface-2 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mist">
                  Date of birth
                </p>
                <p className="mt-1 font-medium text-ink">{kb.record.dob ? formatIso(kb.record.dob) : "—"}</p>
              </div>
              <div className="rounded-xl border border-line bg-surface-2 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mist">
                  Phone
                </p>
                <p className="mt-1 font-medium text-ink">{kb.record.phone || "—"}</p>
              </div>
              <div className="rounded-xl border border-line bg-surface-2 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mist">
                  Last visit
                </p>
                <p className="mt-1 font-medium text-ink">{kb.record.lastVisit ? formatIso(kb.record.lastVisit) : "—"}</p>
              </div>
              <div className="rounded-xl border border-line bg-surface-2 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mist">
                  Companion created
                </p>
                <p className="mt-1 font-medium text-ink">{created}</p>
              </div>
            </div>
          </div>

          <CoraInbox companionId={companion.id} compact />

          {/* Patient record: visit notes + contacts */}
          <div className="rounded-2xl border border-line bg-surface p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-bold text-ink">Visit notes and contacts</h2>
                <p className="mt-1 text-sm text-mist">
                  What you write here becomes part of what Cora knows. Date of birth and the patient's phone stay on this record and are never sent to the companion.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSaveRecord}
                className="shrink-0 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                {savedFlash ? "Saved" : "Save record"}
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Date of birth" hint="record only">
                <input type="date" value={recordDraft.dob} onChange={setField("dob")} className={INPUT} />
              </Field>
              <Field label="Patient phone" hint="record only">
                <input type="tel" value={recordDraft.phone} onChange={setField("phone")} placeholder="(540) 555-0100" className={INPUT} />
              </Field>
              <Field label="Last visit">
                <input type="date" value={recordDraft.lastVisit} onChange={setField("lastVisit")} className={INPUT} />
              </Field>
              <Field label="Clinic phone" hint="Cora gives this when the patient should call">
                <input type="tel" value={recordDraft.clinicPhone} onChange={setField("clinicPhone")} placeholder="(540) 555-0100" className={INPUT} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Last visit notes" hint="plan, dosing, cautions, follow-up">
                  <textarea
                    rows={4}
                    value={recordDraft.lastVisitNotes}
                    onChange={setField("lastVisitNotes")}
                    placeholder="e.g. Started metformin 500 mg with dinner; increase to twice daily after 2 weeks if tolerated. No NSAIDs (eGFR 58). Follow-up in 3 months."
                    className={`${INPUT} resize-y leading-relaxed`}
                  />
                </Field>
              </div>
              <Field label="Pharmacy">
                <input type="text" value={recordDraft.pharmacy} onChange={setField("pharmacy")} placeholder="CVS, South Main St, (540) 555-0177" className={INPUT} />
              </Field>
              <Field label="Emergency contact">
                <input type="text" value={recordDraft.emergencyContact} onChange={setField("emergencyContact")} placeholder="Luis (son), (540) 555-0188" className={INPUT} />
              </Field>
            </div>
          </div>

          {/* Knowledge base card */}
          <div className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-display text-lg font-bold text-ink">
              Extra instructions for Cora
            </h2>
            <p className="mt-1 text-sm text-mist">
              Short, specific notes the companion should follow for this patient. Everything on this page is encoded into the QR code, so the QR refreshes as you save.
            </p>

            {/* Add note input */}
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. Patient has kidney concerns, explain gently..."
                className="flex-1 rounded-xl border border-line bg-surface-2 px-4 py-3 text-sm text-ink placeholder:text-mist focus:border-accent focus:ring-1 focus:ring-accent/30 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAdd}
                disabled={!draft.trim()}
                className="shrink-0 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-canvas transition-opacity disabled:opacity-40"
              >
                Add
              </button>
            </div>

            {/* Notes list */}
            {kb.notes.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-line px-4 py-8 text-center text-sm text-mist">
                No notes yet. Add a note above to customize the AI companion for
                this patient.
              </div>
            ) : (
              <ul className="mt-4 space-y-2">
                {kb.notes.map((note, i) => (
                  <li
                    key={i}
                    className="group flex items-start gap-3 rounded-xl border border-line bg-surface-2 px-4 py-3"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent">
                      {i + 1}
                    </span>
                    <p className="flex-1 text-sm text-ink">{note}</p>
                    <button
                      type="button"
                      onClick={() => handleRemove(i)}
                      className="shrink-0 rounded-lg p-1 text-mist opacity-0 transition-all hover:bg-surface hover:text-ink group-hover:opacity-100"
                      aria-label={`Remove note ${i + 1}`}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        aria-hidden
                      >
                        <path d="M6 6l12 12M18 6 6 18" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right column: QR code */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-line bg-surface p-6">
            <h2 className="mb-4 text-center font-display text-lg font-bold text-ink">
              Patient QR Code
            </h2>
            {companionUrl && (
              <QRCodeDisplay value={companionUrl} size={200} showActions={false} />
            )}
            <p className="mt-4 text-center text-xs text-mist">
              QR code updates automatically as the record and notes change
            </p>
            {companionUrl && (
              <div className="mt-4 flex flex-col gap-2">
                <a
                  href={companionUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-mist transition-colors hover:border-accent hover:text-accent"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M14 4h6v6" />
                    <path d="M20 4 10 14" />
                    <path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5" />
                  </svg>
                  Open companion
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}

const INPUT =
  "w-full rounded-xl border border-line bg-surface-2 px-3.5 py-2.5 text-sm text-ink placeholder:text-mist/70 focus:border-accent focus:ring-1 focus:ring-accent/30 focus:outline-none";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between text-xs font-semibold uppercase tracking-[0.14em] text-mist">
        {label}
        {hint && <span className="normal-case tracking-normal font-normal text-mist/70">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

function formatIso(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return Number.isNaN(d.getTime()) ? iso : DATE_FORMAT.format(d);
}
