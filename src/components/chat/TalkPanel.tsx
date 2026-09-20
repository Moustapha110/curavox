"use client";

import { CoraAvatar } from "@/components/CoraAvatar";
import type { UiStrings } from "@/lib/i18n";
import type { CoraVoiceState } from "@/hooks/useCoraVoice";

export interface TalkPanelProps {
  state: CoraVoiceState;
  thinking: boolean;
  onTap: () => void;
  onStop: () => void;
  strings: UiStrings;
  error?: string | null;
}

/** One big button. Tap to talk, tap again to send. Cora answers out loud. */
export function TalkPanel({ state, thinking, onTap, onStop, strings, error }: TalkPanelProps) {
  const busy = state === "transcribing" || thinking;
  const label =
    state === "recording" ? strings.tapToSend
    : state === "transcribing" ? strings.transcribing
    : thinking ? strings.thinking
    : state === "speaking" ? strings.speaking
    : strings.tapToTalk;

  return (
    <div className="safe-bottom sticky bottom-0 z-30 border-t border-line bg-canvas/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-3 px-4 pb-5 pt-4">
        <button
          type="button"
          onClick={state === "speaking" ? onStop : onTap}
          disabled={busy}
          aria-label={label}
          className={`relative flex h-24 w-24 items-center justify-center rounded-full transition-transform active:scale-95 disabled:opacity-70 ${
            state === "recording"
              ? "bg-accent text-white shadow-[0_18px_50px_-12px_rgba(247,94,94,.9)]"
              : state === "speaking"
                ? "bg-surface text-accent ring-2 ring-accent"
                : "bg-accent text-white shadow-[0_14px_40px_-14px_rgba(247,94,94,.8)] hover:scale-105"
          }`}
        >
          {state === "recording" && (
            <>
              <span aria-hidden className="absolute inset-0 rounded-full bg-accent/50 animate-pulse-ring" />
              <span aria-hidden className="absolute inset-0 rounded-full bg-accent/40 animate-pulse-ring" style={{ animationDelay: "0.5s" }} />
            </>
          )}
          {state === "speaking" ? (
            <CoraAvatar size={72} className="animate-pulse" />
          ) : busy ? (
            <span aria-hidden className="h-8 w-8 animate-spin rounded-full border-[3px] border-white/40 border-t-white" />
          ) : state === "recording" ? (
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <rect x="6" y="6" width="12" height="12" rx="3" />
            </svg>
          ) : (
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" stroke="none" />
              <path d="M5 11a7 7 0 0 0 14 0" />
              <path d="M12 18v3" />
              <path d="M9 21h6" />
            </svg>
          )}
        </button>
        <p className="text-center text-[15px] font-semibold text-ink">{label}</p>
        <p className="text-center text-xs text-mist">{error ?? strings.talkHint}</p>
      </div>
    </div>
  );
}

export default TalkPanel;
