"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { DEMO_DOCTOR, DRUGS, LANGUAGES, ROUTES } from "@/lib/constants";
import type {
  CreateCompanionRequest,
  CreateCompanionResponse,
  DrugId,
  LanguageCode,
} from "@/lib/types";

const STEPS = ["Medication", "Language", "Patient", "Review"] as const;

const SHARE_STEPS = [
  "Show the QR code on your screen or print it on the after-visit summary.",
  "The patient scans it with their phone camera. No app, no account, no password.",
  "CuraVox greets them in their language and answers questions about this medication only.",
];

type Result = CreateCompanionResponse;

const stepVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

function ProgressRail({ step }: { step: number }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-3" aria-label="Progress">
      {STEPS.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <li key={label} className="flex flex-1 items-center gap-2 sm:gap-3">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                done
                  ? "bg-accent text-ink"
                  : active
                    ? "border-2 border-accent bg-accent-soft text-accent"
                    : "border border-line bg-surface-2 text-mist"
              }`}
              aria-current={active ? "step" : undefined}
            >
              {done ? <CheckIcon /> : i + 1}
            </span>
            <span className={`hidden text-xs font-semibold uppercase tracking-[0.14em] sm:block ${active ? "text-ink" : "text-mist"}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <span className="h-px flex-1 bg-surface-2">
                <span
                  className="block h-px bg-accent transition-[width] duration-500 ease-out-expo"
                  style={{ width: done ? "100%" : "0%" }}
                />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

const CARD_BASE =
  "relative w-full rounded-2xl border p-4 text-left transition-[border-color,background-color,transform] duration-300 ease-out-expo";

export function CreateCompanionWizard() {
  const [step, setStep] = useState(0);
  const [drug, setDrug] = useState<DrugId>("metformin");
  const [language, setLanguage] = useState<LanguageCode | null>(null);
  const [patientName, setPatientName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedDrug = DRUGS.find((d) => d.id === drug);
  const selectedLang = LANGUAGES.find((l) => l.code === language);

  const canNext =
    (step === 0 && !!selectedDrug?.available) ||
    (step === 1 && !!language) ||
    step === 2 ||
    step === 3;

  function next() {
    if (!canNext) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit() {
    if (!language || submitting) return;
    setSubmitting(true);
    setError(null);
    const body: CreateCompanionRequest = {
      drug,
      language,
      doctorName: DEMO_DOCTOR.name,
      patientName: patientName.trim() || undefined,
    };
    try {
      const res = await fetch("/api/create-companion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as Result | { error: string };
      if (!res.ok || !("url" in data)) {
        setError("error" in data ? data.error : "Could not create the companion. Please try again.");
        return;
      }
      setResult(data);
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setResult(null);
    setStep(0);
    setLanguage(null);
    setPatientName("");
    setError(null);
    setCopied(false);
  }

  async function copyLink() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy this link", result.url);
    }
  }

  /* ── Result view ── */
  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto w-full max-w-3xl"
      >
        <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-ink">
              <CheckIcon />
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">Companion created</h2>
              <p className="text-sm text-mist">
                {selectedDrug?.name} · {selectedLang?.flag} {selectedLang?.nativeLabel}
                {patientName.trim() ? ` · for ${patientName.trim()}` : ""}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-[auto_1fr] md:items-start">
            <QRCodeDisplay value={result.url} size={220} />

            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mist">Companion link</p>
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-line bg-surface-2 p-2 pl-3">
                  <code className="min-w-0 flex-1 truncate text-xs text-ink">{result.url}</code>
                  <button
                    type="button"
                    onClick={copyLink}
                    className="shrink-0 rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-canvas transition-colors hover:opacity-90"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <p className="mt-1.5 font-mono text-[11px] text-mist">ID {result.id}</p>
              </div>

              <div className="rounded-2xl border border-accent/25 bg-accent-soft p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Share with patient</p>
                <ol className="mt-2 space-y-2 text-sm text-ink">
                  {SHARE_STEPS.map((s, i) => (
                    <li key={i} className="flex gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-ink">
                        {i + 1}
                      </span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href={result.url} target="_blank" rel="noreferrer">
              Open patient view
            </Button>
            <Button variant="secondary" onClick={reset}>
              Create another
            </Button>
            <Button variant="ghost" href={ROUTES.dashboard}>
              Back to dashboard
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  /* ── Wizard steps ── */
  return (
    <div className="mx-auto w-full max-w-3xl">
      <ProgressRail step={step} />

      <div className="mt-8 min-h-[360px] rounded-3xl border border-line bg-surface p-5 sm:p-8">
        <AnimatePresence mode="wait" initial={false}>
          {step === 0 && (
            <motion.div key="step-0" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.28 }}>
              <h2 className="font-display text-2xl font-bold text-ink">Select medication</h2>
              <p className="mt-1 text-sm text-mist">The companion will only answer questions about this drug.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {DRUGS.map((d) => {
                  const active = d.id === drug && d.available;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      disabled={!d.available}
                      onClick={() => d.available && setDrug(d.id as DrugId)}
                      aria-pressed={active}
                      className={`${CARD_BASE} ${
                        active
                          ? "border-accent bg-accent-soft"
                          : d.available
                            ? "border-line bg-surface hover:border-accent/40 hover:bg-surface-2"
                            : "cursor-not-allowed border-line bg-surface opacity-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-display text-lg font-semibold text-ink">{d.name}</p>
                          <p className="mt-0.5 text-xs text-mist">{d.generic}</p>
                        </div>
                        {d.available ? (
                          <span className={`flex h-6 w-6 items-center justify-center rounded-full ${active ? "bg-accent text-ink" : "border border-line text-transparent"}`}>
                            <CheckIcon />
                          </span>
                        ) : (
                          <span className="rounded-full border border-accent/30 bg-accent-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
                            Coming soon
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step-1" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.28 }}>
              <h2 className="font-display text-2xl font-bold text-ink">Patient&apos;s preferred language</h2>
              <p className="mt-1 text-sm text-mist">Every message, voice included, will be in this language.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {LANGUAGES.map((l) => {
                  const active = l.code === language;
                  return (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setLanguage(l.code)}
                      aria-pressed={active}
                      className={`${CARD_BASE} ${
                        active
                          ? "border-accent bg-accent-soft"
                          : "border-line bg-surface hover:border-accent/40 hover:bg-surface-2"
                      }`}
                    >
                      <span className="text-3xl" aria-hidden>
                        {l.flag}
                      </span>
                      <p className="mt-3 font-display text-lg font-semibold text-ink">{l.nativeLabel}</p>
                      <p className="text-xs text-mist">{l.label}</p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step-2" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.28 }}>
              <h2 className="font-display text-2xl font-bold text-ink">Patient name</h2>
              <p className="mt-1 text-sm text-mist">Optional. Used only to personalize the greeting.</p>
              <div className="mt-6">
                <label htmlFor="patient-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-mist">
                  First name
                </label>
                <input
                  id="patient-name"
                  type="text"
                  maxLength={40}
                  autoComplete="off"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. María"
                  className="h-12 w-full rounded-xl border border-line bg-surface-2 px-4 text-[16px] text-ink placeholder:text-mist outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/30"
                />
                <p className="mt-3 flex items-start gap-2 text-xs text-mist">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="mt-0.5 shrink-0 text-accent">
                    <rect x="4" y="10" width="16" height="11" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                  Only a first name; no PHI is stored. The name lives inside the link itself, not on a server.
                </p>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step-3" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.28 }}>
              <h2 className="font-display text-2xl font-bold text-ink">Review &amp; generate</h2>
              <p className="mt-1 text-sm text-mist">Double-check the details, then create the companion.</p>
              <dl className="mt-6 divide-y divide-line rounded-2xl border border-line bg-surface-2">
                {[
                  ["Medication", selectedDrug?.name ?? ""],
                  ["Language", selectedLang ? `${selectedLang.flag} ${selectedLang.nativeLabel}` : ""],
                  ["Patient", patientName.trim() || "Not provided"],
                  ["Prescribing physician", DEMO_DOCTOR.fullName],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                    <dt className="text-mist">{k}</dt>
                    <dd className="text-right font-medium text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
              <AnimatePresence>
                {error && (
                  <motion.p
                    role="alert"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-500"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={back} disabled={step === 0 || submitting}>
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={next} disabled={!canNext}>
            Continue
          </Button>
        ) : (
          <Button onClick={submit} loading={submitting} size="lg">
            {submitting ? "Generating" : "Generate companion"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default CreateCompanionWizard;
