"use client";

import { useEffect, useState } from "react";

/**
 * The origin to embed in QR codes / share links.
 * Starts with window.location.origin (instant), then swaps in the LAN-reachable
 * origin reported by /api/origin so phones can actually open the link.
 */
export function usePublicOrigin(): string {
  const [origin, setOrigin] = useState<string>(() =>
    typeof window !== "undefined" ? window.location.origin : "",
  );

  useEffect(() => {
    let cancelled = false;
    fetch("/api/origin", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { origin?: string } | null) => {
        if (!cancelled && data?.origin) setOrigin(data.origin);
      })
      .catch(() => {
        /* keep window.location.origin */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return origin;
}
