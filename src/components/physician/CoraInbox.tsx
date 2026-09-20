"use client";

import { useCallback, useEffect, useState } from "react";
import { DEMO_DOCTOR, LANGUAGE_MAP, isLanguageCode } from "@/lib/constants";
import type { InboxItem } from "@/lib/inbox-store";

const KIND_LABEL: Record<InboxItem["kind"], string> = {
  question: "Question for you",
  appointment: "Appointment request",
  urgent: "Needs attention",
};

const KIND_STYLE: Record<InboxItem["kind"], string> = {
  question: "bg-accent-soft text-accent",
  appointment: "bg-surface-2 text-ink",
  urgent: "bg-accent text-white",
};

function timeAgo(ts: number): string {
  const s = Math.max(1, Math.round((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  return `${Math.round(m / 60)} h ago`;
}

export interface CoraInboxProps {
  companionId?: string; // limit to one patient
  compact?: boolean;
}

/** What Cora has filed on patients' behalf: questions, appointment requests, urgent flags. Reply and Cora delivers it to the patient in their language. */
export function CoraInbox({ companionId, compact = false }: CoraInboxProps) {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [sending, setSending] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const r = await fetch(`/api/inbox${companionId ? `?companion=${encodeURIComponent(companionId)}` : ""}`, { cache: "no-store" });
      if (r.ok) setItems(((await r.json()) as { items: InboxItem[] }).items);
    } catch {}
  }, [companionId]);

  useEffect(() => {
    void load();
    const h = window.setInterval(() => void load(), 4000);
    return () => window.clearInterval(h);
  }, [load]);

  async function reply(item: InboxItem) {
    const text = (drafts[item.id] ?? "").trim();
    if (!text) return;
    setSending(item.id);
    try {
      await fetch("/api/inbox", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, reply: text, doctorName: DEMO_DOCTOR.name }),
      });
      setDrafts((d) => ({ ...d, [item.id]: "" }));
      await load();
    } finally {
      setSending(null);
    }
  }

  const open = items.filter((i) => i.status === "open");
  const answered = items.filter((i) => i.status === "answered").slice(0, compact ? 2 : 5);

  return (
    <div className="rounded-2xl border border-line bg-surface p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold text-ink">Cora inbox</h2>
          <p className="mt-1 text-sm text-mist">
            Things Cora did for patients that need you: questions, appointment requests, concerns. Reply here and Cora tells the patient in their language.
          </p>
        </div>
        {open.length > 0 && (
          <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">{open.length} open</span>
        )}
      </div>

      {open.length === 0 && answered.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-line px-4 py-8 text-center text-sm text-mist">
          Nothing waiting. When a patient asks Cora something outside the care plan, or asks for an appointment, it shows up here.
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {open.map((item) => {
            const lang = isLanguageCode(item.lang) ? LANGUAGE_MAP[item.lang] : null;
            return (
              <li key={item.id} className="rounded-xl border border-line bg-surface-2 p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className={`rounded-full px-2.5 py-0.5 font-semibold ${KIND_STYLE[item.kind]}`}>{KIND_LABEL[item.kind]}</span>
                  <span className="font-semibold text-ink">{item.patient}</span>
                  {lang && <span className="text-mist">{lang.flag} {lang.label}</span>}
                  <span className="text-mist">· {timeAgo(item.createdAt)}</span>
                </div>
                <p className="mt-2 text-sm text-ink">{item.text}</p>
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={drafts[item.id] ?? ""}
                    onChange={(e) => setDrafts((d) => ({ ...d, [item.id]: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === "Enter") void reply(item); }}
                    placeholder={item.kind === "appointment" ? "e.g. Tuesday 9:40 am works, front desk will confirm" : "Your answer, in English. Cora translates it."}
                    className="flex-1 rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-mist/70 focus:border-accent focus:ring-1 focus:ring-accent/30 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => void reply(item)}
                    disabled={sending === item.id || !(drafts[item.id] ?? "").trim()}
                    className="shrink-0 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-40"
                  >
                    {sending === item.id ? "Sending…" : "Send to patient"}
                  </button>
                </div>
              </li>
            );
          })}
          {answered.map((item) => (
            <li key={item.id} className="rounded-xl border border-line px-4 py-3 opacity-80">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-surface-2 px-2.5 py-0.5 font-semibold text-mist">Delivered</span>
                <span className="font-semibold text-ink">{item.patient}</span>
                <span className="text-mist">· {KIND_LABEL[item.kind].toLowerCase()} · {timeAgo(item.answeredAt ?? item.createdAt)}</span>
              </div>
              <p className="mt-1.5 text-sm text-mist">{item.text}</p>
              <p className="mt-1 text-sm text-ink"><span className="font-semibold">You:</span> {item.reply}</p>
              {item.delivery && <p className="mt-1 text-sm text-accent"><span className="font-semibold">Cora told the patient:</span> {item.delivery}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CoraInbox;
