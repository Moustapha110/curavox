/** Cora, the CuraVox companion. Illustrated, so nobody mistakes her for a real clinician. */
export function CoraAvatar({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden className={className}>
      <defs>
        <linearGradient id="cora-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FDE8E8" />
          <stop offset="1" stopColor="#F7C9C9" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="32" fill="url(#cora-bg)" />
      {/* shoulders / red top */}
      <path d="M10 64c2-12 10-18 22-18s20 6 22 18Z" fill="#F75E5E" />
      {/* neck */}
      <rect x="27" y="38" width="10" height="9" rx="4" fill="#E8B896" />
      {/* hair back */}
      <path d="M16 30c0-12 7-19 16-19s16 7 16 19v8c0 3-2 4-4 4H20c-2 0-4-1-4-4Z" fill="#2F3142" />
      {/* face */}
      <ellipse cx="32" cy="30" rx="11.5" ry="13" fill="#F2C4A2" />
      {/* hair front */}
      <path d="M20 27c1-8 6-12 12-12s11 4 12 12c-3-3-7-4-12-4s-9 1-12 4Z" fill="#2F3142" />
      {/* eyes */}
      <circle cx="27.5" cy="30" r="1.6" fill="#2F3142" />
      <circle cx="36.5" cy="30" r="1.6" fill="#2F3142" />
      {/* brows */}
      <path d="M25 26.5c1.5-1 3.5-1 5 0M34 26.5c1.5-1 3.5-1 5 0" stroke="#2F3142" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* smile */}
      <path d="M27.5 35.5c2.5 2.5 6.5 2.5 9 0" stroke="#B5563F" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      {/* cheeks */}
      <circle cx="24.5" cy="34" r="1.8" fill="#F79A9A" opacity=".6" />
      <circle cx="39.5" cy="34" r="1.8" fill="#F79A9A" opacity=".6" />
      {/* earring / red accent */}
      <circle cx="44" cy="33" r="1.3" fill="#F75E5E" />
    </svg>
  );
}

export default CoraAvatar;
