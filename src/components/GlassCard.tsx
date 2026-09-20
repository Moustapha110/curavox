"use client";

import type { ReactNode } from "react";

export interface GlassCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  accent?: "brand" | "gold"; // kept for API compat, both map to accent
  className?: string;
}

/**
 * Clean surface card with subtle hover elevation.
 * Single accent color (teal). Dark-mode aware via CSS tokens.
 */
export function GlassCard({
  title,
  description,
  icon,
  className = "",
}: GlassCardProps) {
  return (
    <div className={`group h-full ${className}`}>
      <div
        className="relative h-full overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-accent/30 md:p-7"
      >
        <div className="relative flex h-full flex-col gap-4">
          {icon && (
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/20 bg-accent-soft text-accent"
            >
              {icon}
            </div>
          )}
          <h3 className="font-display text-lg font-semibold tracking-tight text-ink md:text-xl">
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-mist md:text-[15px]">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default GlassCard;
