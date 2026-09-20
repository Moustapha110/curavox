"use client";

import { useEffect, useRef, type ChangeEvent, type FormEvent, type KeyboardEvent } from "react";
import { VoiceButton } from "@/components/VoiceButton";
import type { UiStrings } from "@/lib/i18n";

export interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (text: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled?: boolean;
  strings: UiStrings;
  voice: {
    supported: boolean;
    listening: boolean;
    onToggle: () => void;
  };
}

const MAX_ROWS_HEIGHT = 140;

export function ChatInput({
  value,
  onChange,
  onSend,
  onStop,
  isStreaming,
  disabled = false,
  strings,
  voice,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, MAX_ROWS_HEIGHT)}px`;
  }, [value]);

  const canSend = value.trim().length > 0 && !isStreaming && !disabled;

  function submit() {
    const text = value.trim();
    if (!text || isStreaming || disabled) return;
    onSend(text);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    submit();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  }

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.target.value);
  }

  return (
    <div className="safe-bottom sticky bottom-0 z-30 border-t border-line bg-canvas/85 backdrop-blur-xl">
      <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-2xl items-end gap-2 px-3 py-2.5">
        <VoiceButton
          supported={voice.supported}
          listening={voice.listening}
          onToggle={voice.onToggle}
          label={voice.listening ? strings.listening : strings.tapToSpeak}
          disabled={disabled || isStreaming}
        />

        <div className="relative flex min-h-11 flex-1 items-end rounded-[22px] border border-line bg-surface-2 transition-colors focus-within:border-accent/50">
          {voice.listening && (
            <span className="pointer-events-none absolute -top-8 left-2 inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-canvas shadow-glow">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-canvas animate-pulse" />
              {strings.listening}
            </span>
          )}
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={strings.inputPlaceholder}
            disabled={disabled}
            enterKeyHint="send"
            autoCapitalize="sentences"
            aria-label={strings.inputPlaceholder}
            className="input-16 max-h-[140px] w-full resize-none bg-transparent px-4 py-2.5 leading-6 text-ink placeholder:text-mist/60 outline-none disabled:opacity-60"
          />
        </div>

        {isStreaming ? (
          <button
            type="button"
            onClick={onStop}
            aria-label={strings.stop}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink ring-1 ring-line transition-colors hover:bg-surface"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <rect x="6" y="6" width="12" height="12" rx="3" />
            </svg>
          </button>
        ) : (
          <button
            type="submit"
            disabled={!canSend}
            aria-label={strings.send}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-canvas shadow-[0_8px_24px_-8px_rgba(247,94,94,.8)] transition-[opacity,transform] hover:scale-105 active:scale-95 disabled:opacity-35 disabled:hover:scale-100"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M3.4 20.4 21.6 12 3.4 3.6 3.4 10l12 2-12 2z" />
            </svg>
          </button>
        )}
      </form>
    </div>
  );
}

export default ChatInput;
