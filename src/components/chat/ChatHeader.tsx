"use client";

import { CoraAvatar } from "@/components/CoraAvatar";
import { ImpiricusBadge } from "@/components/ui/ImpiricusBadge";
import { LANGUAGE_MAP } from "@/lib/constants";
import type { UiStrings } from "@/lib/i18n";
import type { LanguageCode } from "@/lib/types";

export interface ChatHeaderProps {
  drugName: string;
  doctorName: string;
  language: LanguageCode;
  strings: UiStrings;
  notice?: string | null;
}

export function ChatHeader({ drugName, doctorName, language, strings, notice }: ChatHeaderProps) {
  const lang = LANGUAGE_MAP[language];
  return (
    <header className="safe-top sticky top-0 z-30 border-b border-line bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-2xl items-center gap-3 px-4 py-3">
        <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full ring-2 ring-accent/30">
          <CoraAvatar size={44} />
          <span
            aria-hidden
            className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-canvas bg-accent"
          />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[15px] font-semibold leading-tight text-ink">
            {strings.headerTitle}
          </p>
          <p className="truncate text-xs text-mist">
            {strings.headerSubtitle} · {drugName} · {strings.prescribedBy} {doctorName}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <ImpiricusBadge size="sm" />
          <span className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-[11px] text-mist">
            <span aria-hidden>{lang.flag}</span>
            {lang.nativeLabel}
          </span>
        </div>
      </div>
      <div className="border-t border-line/70 bg-surface-2">
        <p className="mx-auto max-w-2xl px-4 py-1 text-center text-[11px] text-mist/80">{strings.disclaimer}</p>
      </div>
      {notice && (
        <div role="status" className="border-t border-accent/30 bg-accent-soft">
          <p className="mx-auto max-w-2xl px-4 py-1.5 text-center text-xs font-medium text-accent">{notice}</p>
        </div>
      )}
    </header>
  );
}

export default ChatHeader;
