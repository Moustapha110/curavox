"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { LANGUAGE_MAP } from "@/lib/constants";
import type { Companion } from "@/lib/types";

export interface QRModalProps {
  companion: Companion | null;
  url: string | null;
  onClose: () => void;
}

const SHARE_STEPS = [
  "Show this QR code to the patient at the end of the visit, or print it on the after-visit summary.",
  "The patient scans it with their phone camera. No app, no account, no password.",
  "The companion opens in their language and greets them by name.",
];

export function QRModal({ companion, url, onClose }: QRModalProps) {
  const open = !!companion && !!url;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && companion && url && (
        <motion.div
          key="qr-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 backdrop-blur-sm p-3 sm:items-center sm:p-6"
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="qr-modal-title"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-surface border border-line rounded-2xl shadow-xl p-5 sm:p-7"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-mist transition-colors hover:bg-surface-2 hover:text-ink"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>

            <h2 id="qr-modal-title" className="pr-10 font-display text-xl font-bold text-accent">
              {companion.patient ? `${companion.patient}'s companion` : "Patient companion"}
            </h2>
            <p className="mt-1 text-sm text-mist">
              Metformin · {LANGUAGE_MAP[companion.lang].flag} {LANGUAGE_MAP[companion.lang].nativeLabel} ·
              ID <span className="font-mono text-ink/80">{companion.id}</span>
            </p>

            {/* QR container — always white for scanability */}
            <div className="mt-6">
              <QRCodeDisplay value={url} size={200} />
            </div>

            <div className="mt-6 rounded-2xl border border-line bg-surface-2 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Share with patient</p>
              <ol className="mt-2 space-y-1.5 text-sm text-mist">
                {SHARE_STEPS.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="font-semibold text-ink/80">{i + 1}.</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default QRModal;
