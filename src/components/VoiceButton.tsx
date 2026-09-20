"use client";

export interface VoiceButtonProps {
  listening: boolean;
  supported: boolean;
  onToggle: () => void;
  label: string;
  disabled?: boolean;
  className?: string;
}

export function VoiceButton({
  listening,
  supported,
  onToggle,
  label,
  disabled = false,
  className = "",
}: VoiceButtonProps) {
  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-label={label}
      aria-pressed={listening}
      className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-200 disabled:opacity-40 ${
        listening
          ? "bg-accent text-canvas shadow-glow"
          : "bg-surface-2 text-mist ring-1 ring-line hover:bg-surface hover:text-ink"
      } ${className}`}
    >
      {listening && (
        <>
          <span aria-hidden className="absolute inset-0 rounded-full bg-accent/50 animate-pulse-ring" />
          <span
            aria-hidden
            className="absolute inset-0 rounded-full bg-accent/40 animate-pulse-ring"
            style={{ animationDelay: "0.5s" }}
          />
        </>
      )}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="relative"
      >
        <rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" stroke="none" />
        <path d="M5 11a7 7 0 0 0 14 0" />
        <path d="M12 18v3" />
        <path d="M9 21h6" />
      </svg>
    </button>
  );
}

export default VoiceButton;
