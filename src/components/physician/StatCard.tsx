"use client";

import { useEffect, type ReactNode } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

export interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  /** @deprecated accent variants removed — single teal accent used */
  accent?: string;
  suffix?: string;
  hint?: string;
}

export function StatCard({ label, value, icon, suffix = "", hint }: StatCardProps) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toLocaleString("en-US"));

  useEffect(() => {
    const controls = animate(mv, value, { duration: 1.2, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [mv, value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-surface border border-line rounded-2xl p-5 sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mist">{label}</p>
          <p className="mt-2 font-display text-4xl font-bold tracking-tight text-ink">
            <motion.span>{rounded}</motion.span>
            {suffix}
          </p>
          {hint && <p className="mt-1.5 text-xs text-mist">{hint}</p>}
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
          {icon}
        </span>
      </div>
    </motion.div>
  );
}

export default StatCard;
