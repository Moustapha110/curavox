import { POWERED_BY } from "@/lib/constants";

export interface ImpiricusBadgeProps {
  size?: "sm" | "md";
  className?: string;
  /** @deprecated tone variants removed — single neutral style used */
  tone?: "brand" | "gold" | "neutral";
  /** @deprecated dark prop removed — badge auto-adapts via CSS tokens */
  dark?: boolean;
}

const sizeClasses = {
  sm: "h-6 px-2.5 text-[10px] gap-1.5",
  md: "h-8 px-3.5 text-xs gap-2",
} as const;

const monoSizes = { sm: 14, md: 18 } as const;

export function ImpiricusBadge({ size = "md", className = "" }: ImpiricusBadgeProps) {
  const mono = monoSizes[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border border-line bg-surface-2 font-semibold uppercase tracking-[0.14em] text-mist ${sizeClasses[size]} ${className}`}
      title={POWERED_BY}
    >
      <span
        aria-hidden
        className="inline-flex shrink-0 items-center justify-center rounded-full bg-current font-display font-bold lowercase tracking-normal"
        style={{ width: mono, height: mono }}
      >
        <span className="text-surface" style={{ fontSize: mono * 0.72, lineHeight: 1 }}>
          i
        </span>
      </span>
      <span>{POWERED_BY}</span>
    </span>
  );
}

export default ImpiricusBadge;
