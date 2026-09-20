"use client";

import { useEffect, useRef, useState } from "react";
import { QRCode, generateDataURL } from "react-qrcode-logo";

export interface QRCodeDisplayProps {
  value: string;
  size?: number;
  label?: string;
  showActions?: boolean;
  className?: string;
}

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="96" height="96"><circle cx="24" cy="24" r="24" fill="#ffffff"/><path d="M24 7C14.6 7 7 13.6 7 21.8c0 4.4 2.2 8.3 5.7 11L11.1 40l8.2-4.1c1.5.4 3.1.5 4.7.5 9.4 0 17-6.6 17-14.8S33.4 7 24 7Z" fill="#F75E5E"/><path d="M13.5 22.5h4.6l2.4-5.6 3.6 11.2 3.1-8.1 2 3.6h5.3" stroke="#050505" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;

const LOGO_DATA_URI = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(LOGO_SVG)}`;

const ACTION_CLASS =
  "inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-white/[.04] px-3.5 text-xs font-semibold text-white transition-colors hover:border-brand/40 hover:bg-white/[.08] disabled:opacity-50";

function qrOptions(value: string, size: number) {
  return {
    value,
    size,
    quietZone: 12,
    bgColor: "#ffffff",
    fgColor: "#050505",
    ecLevel: (value.length > 350 ? "M" : "H") as "M" | "H",
    qrStyle: "dots" as const,
    eyeRadius: 8,
    logoImage: LOGO_DATA_URI,
    logoWidth: Math.round(size * 0.2),
    logoPadding: 4,
    logoPaddingStyle: "circle" as const,
    removeQrCodeBehindLogo: value.length <= 350,
  };
}

export function QRCodeDisplay({
  value,
  size = 220,
  label,
  showActions = true,
  className = "",
}: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const copiedTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copiedTimer.current) window.clearTimeout(copiedTimer.current);
    };
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (copiedTimer.current) window.clearTimeout(copiedTimer.current);
      copiedTimer.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy this link", value);
    }
  }

  async function handleDownload() {
    setDownloading(true);
    try {
      const dataUrl = await generateDataURL(qrOptions(value, 640), "png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "curavox-companion-qr.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="relative">
        <div
          aria-hidden
          className="absolute -inset-4 rounded-[2rem] bg-brand/25 blur-2xl"
        />
        <div className="relative rounded-3xl bg-white p-2 shadow-[0_20px_60px_-20px_rgba(247,94,94,.55)] ring-1 ring-brand/30">
          <QRCode {...qrOptions(value, size)} />
        </div>
      </div>

      {label && <p className="text-center text-sm text-mist">{label}</p>}

      {showActions && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button type="button" onClick={handleCopy} className={ACTION_CLASS}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="9" y="9" width="12" height="12" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? "Copied" : "Copy link"}
          </button>
          <button type="button" onClick={handleDownload} disabled={downloading} className={ACTION_CLASS}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 3v12" />
              <path d="m7 10 5 5 5-5" />
              <path d="M4 21h16" />
            </svg>
            {downloading ? "Preparing" : "Download PNG"}
          </button>
          <a href={value} target="_blank" rel="noreferrer" className={ACTION_CLASS}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M14 4h6v6" />
              <path d="M20 4 10 14" />
              <path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5" />
            </svg>
            Open link
          </a>
        </div>
      )}
    </div>
  );
}

export default QRCodeDisplay;
