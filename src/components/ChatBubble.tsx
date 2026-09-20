"use client";

import { motion } from "framer-motion";
import type { ChatMessage } from "@/lib/types";
import type { UiStrings } from "@/lib/i18n";
import { LoadingDots } from "./LoadingDots";
import { CoraAvatar } from "./CoraAvatar";

export interface ChatBubbleProps {
  message: ChatMessage;
  onSpeak?: (message: ChatMessage) => void;
  speaking?: boolean;
  loadingSpeech?: boolean;
  ttsAvailable: boolean;
  strings: UiStrings;
}

function SpeakerIcon({ playing }: { playing: boolean }) {
  if (playing) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <rect x="6" y="6" width="12" height="12" rx="2.5" />
      </svg>
    );
  }
  return (
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
      <path d="M11 5 6 9H2v6h4l5 4V5z" fill="currentColor" stroke="none" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}

export function ChatBubble({
  message,
  onSpeak,
  speaking = false,
  loadingSpeech = false,
  ttsAvailable,
  strings,
}: ChatBubbleProps) {
  const isUser = message.role === "user";
  const isError = message.status === "error";
  const isTyping = message.status === "streaming" && message.content === "";
  const canSpeak =
    !isUser && ttsAvailable && !!onSpeak && message.status === "done" && message.content.trim().length > 0;

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.7 }}
      className={`flex w-full items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <span
          aria-hidden
          className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1 ring-accent/30"
        >
          <CoraAvatar size={32} />
        </span>
      )}

      <div className={`flex max-w-[82%] flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={
            isUser
              ? "bubble-user bg-accent px-4 py-2.5 text-[15px] leading-relaxed text-canvas shadow-[0_6px_20px_-8px_rgba(247,94,94,.7)]"
              : `bubble-assistant px-4 py-2.5 text-[15px] leading-relaxed ${
                  isError ? "bg-red-500/10 text-red-500 ring-1 ring-red-500/30" : "bg-surface-2 text-ink"
                }`
          }
        >
          {isTyping ? (
            <LoadingDots label={strings.thinking} className="py-1" />
          ) : (
            <p className="whitespace-pre-wrap [overflow-wrap:anywhere]">{message.content}</p>
          )}
        </div>

        {canSpeak && (
          <button
            type="button"
            onClick={() => onSpeak?.(message)}
            aria-label={speaking ? strings.stopSpeaking : strings.speak}
            aria-pressed={speaking}
            disabled={loadingSpeech}
            className={`relative ml-1 inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium transition-colors ${
              speaking
                ? "bg-accent text-canvas"
                : "bg-surface-2 text-mist ring-1 ring-line hover:bg-surface hover:text-ink"
            } disabled:opacity-70`}
          >
            {speaking && (
              <span
                aria-hidden
                className="absolute inset-0 rounded-full bg-accent/60 animate-pulse-ring"
              />
            )}
            <span className="relative inline-flex items-center gap-1.5">
              {loadingSpeech ? (
                <span
                  aria-hidden
                  className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
                />
              ) : (
                <SpeakerIcon playing={speaking} />
              )}
              <span>
                {loadingSpeech ? strings.loadingSpeech : speaking ? strings.stopSpeaking : strings.speak}
              </span>
            </span>
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default ChatBubble;
