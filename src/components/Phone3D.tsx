"use client";

import type { CSSProperties, ReactNode, Ref } from "react";

export interface Phone3DProps {
  ref?: Ref<HTMLDivElement>;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Pure CSS 3D phone mockup. No animation inside; parents animate the outer
 * [data-phone] node with GSAP (rotateX / rotateY / translateZ).
 */
export function Phone3D({ ref, children, className = "", style }: Phone3DProps) {
  return (
    <div
      ref={ref}
      data-phone
      className={`relative preserve-3d backface-hidden will-change-transform ${className}`}
      style={{
        width: "clamp(240px, 26vw, 330px)",
        aspectRatio: "9 / 19.5",
        ...style,
      }}
    >
      {/* Floor shadow — toned down for light background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-6 -bottom-10 h-14 rounded-full bg-ink/15 blur-2xl"
        style={{ transform: "translateZ(-60px)" }}
      />

      {/* Titanium frame */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-[3rem] border border-white/15"
        style={{
          background:
            "linear-gradient(145deg, #3a3a40 0%, #1c1c20 30%, #121215 60%, #2a2a2f 100%)",
          boxShadow:
            "0 0 0 1px rgba(0,0,0,.9), inset 0 0 0 2px rgba(255,255,255,.06), inset 0 0 0 5px #080808, 0 40px 80px -20px rgba(0,0,0,.35), 0 0 40px -20px rgba(247,94,94,.15)",
        }}
      />

      {/* Side buttons */}
      <div aria-hidden className="absolute -left-[3px] top-[18%] h-[5%] w-[3px] rounded-l bg-[#2b2b30]" />
      <div aria-hidden className="absolute -left-[3px] top-[26%] h-[9%] w-[3px] rounded-l bg-[#2b2b30]" />
      <div aria-hidden className="absolute -left-[3px] top-[37%] h-[9%] w-[3px] rounded-l bg-[#2b2b30]" />
      <div aria-hidden className="absolute -right-[3px] top-[28%] h-[13%] w-[3px] rounded-r bg-[#2b2b30]" />

      {/* Screen */}
      <div
        data-phone-screen
        className="absolute inset-[9px] overflow-hidden rounded-[2.5rem] bg-[#FBF8F1]"
        style={{ transform: "translateZ(2px)" }}
      >
        {children}
      </div>

      {/* Dynamic island */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[14px] z-10 h-[26px] w-[34%] -translate-x-1/2 rounded-full bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,.05)]"
        style={{ transform: "translateX(-50%) translateZ(4px)" }}
      >
        <span className="absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#0c1a2a] shadow-[inset_0_0_2px_rgba(80,140,255,.6)]" />
      </div>

      {/* Glare */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[3rem]"
        style={{
          transform: "translateZ(3px)",
          background:
            "linear-gradient(115deg, rgba(255,255,255,.14) 0%, rgba(255,255,255,.04) 28%, transparent 50%, rgba(255,255,255,.03) 100%)",
        }}
      />
    </div>
  );
}

export default Phone3D;
