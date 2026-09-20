"use client";

import { useRef, type CSSProperties } from "react";
import { gsap, useGSAP, MOTION_OK_QUERY } from "@/lib/gsap";

/* ═══════════════════════════════════════════════════════════════
   ScrollBackground — 4-layer parallax depth system + vignette

   L0  Dot grid            Deepest · slowest scroll · subtle texture
   L1  Gradient orbs       Mid-ground · varied parallax speeds
   L2  Section color washes  Atmospheric · tied to section visibility
   L3  Heartbeat trace     Foreground · draws with scroll progress
   +   Edge vignette       Depth-of-field framing
   ═══════════════════════════════════════════════════════════════ */

// ─── Heartbeat SVG path ─────────────────────────────────────
// viewBox 0 0 120 1000 · vertical line at x=60 with ECG pulses at the given y's
function heartbeatPath(pulses: number[], amp = 1): string {
  const d: string[] = ["M 60 0"];
  let y = 0;
  for (const py of pulses) {
    const mid = (y + py) / 2;
    d.push(`C 57 ${mid - 20}, 63 ${mid + 20}, 60 ${py}`);
    d.push(
      `c 0 5, ${-4 * amp} 8, ${-4 * amp} 12`,
      "l 0 6",
      `l ${4 * amp} 5`,
      `l ${-26 * amp} -22`,
      `l ${30 * amp} 28`,
      `l ${-4 * amp} 4`,
      `c 0 5, ${-7 * amp} 12, 0 16`,
      "l 0 8",
    );
    y = py + 79;
  }
  d.push(`C 63 ${(y + 1000) / 2 - 30}, 57 ${(y + 1000) / 2 + 30}, 60 1000`);
  return d.join(" ");
}

const TRACES = [
  // right, hero trace: boldest
  { pos: "right-[5%] md:right-[9%] lg:right-[13%]", width: "w-[110px]", pulses: [190, 478, 758], amp: 1.15, main: 3.2, glow: 16, mainOp: 0.7, glowOp: 0.14, scrub: 1.1 },
  // left, hugging the content edge
  { pos: "left-[2%] md:left-[262px]", width: "w-[80px]", pulses: [120, 330, 560, 850], amp: 0.9, main: 2.2, glow: 12, mainOp: 0.45, glowOp: 0.1, scrub: 1.6 },
  // center-right, faint and slow
  { pos: "left-[52%]", width: "w-[70px]", pulses: [420, 680], amp: 0.7, main: 1.6, glow: 10, mainOp: 0.28, glowOp: 0.07, scrub: 2.2 },
] as const;

// ─── Bubbles (3D spheres) ───────────────────────────────────
// depth 0 = far (small, blurred, slow) … 1 = near (large, crisp, fast)
const BUBBLES = [
  { x: "12%", y: "18%", size: 120, depth: 0.85, tint: "red" },
  { x: "78%", y: "8%",  size: 64,  depth: 0.35, tint: "ink" },
  { x: "90%", y: "38%", size: 150, depth: 0.95, tint: "red" },
  { x: "30%", y: "42%", size: 44,  depth: 0.25, tint: "red" },
  { x: "60%", y: "55%", size: 96,  depth: 0.6,  tint: "ink" },
  { x: "18%", y: "70%", size: 170, depth: 1,    tint: "red" },
  { x: "72%", y: "78%", size: 56,  depth: 0.4,  tint: "red" },
  { x: "45%", y: "88%", size: 110, depth: 0.7,  tint: "ink" },
  { x: "88%", y: "92%", size: 38,  depth: 0.2,  tint: "red" },
  { x: "40%", y: "12%", size: 80,  depth: 0.5,  tint: "red" },
] as const;

function bubbleStyle(b: (typeof BUBBLES)[number]): CSSProperties {
  const rgb = b.tint === "red" ? "247,94,94" : "47,49,66";
  const alpha = 0.10 + b.depth * 0.16;
  return {
    left: b.x,
    top: b.y,
    width: b.size,
    height: b.size,
    marginLeft: -b.size / 2,
    marginTop: -b.size / 2,
    filter: `blur(${(1 - b.depth) * 2.2}px)`,
    background: [
      `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.35) 12%, rgba(255,255,255,0) 32%)`,
      `radial-gradient(circle at 50% 50%, rgba(${rgb},${alpha * 0.55}) 0%, rgba(${rgb},${alpha}) 62%, rgba(${rgb},${alpha * 1.6}) 100%)`,
    ].join(","),
    boxShadow: `inset -${b.size * 0.08}px -${b.size * 0.1}px ${b.size * 0.25}px rgba(${rgb},${alpha * 1.2}), 0 ${b.size * 0.18}px ${b.size * 0.45}px -${b.size * 0.12}px rgba(47,49,66,${0.10 + b.depth * 0.12})`,
  };
}

// ─── Orb definitions ────────────────────────────────────────
// All teal, varying opacity/size/speed for depth illusion
const ORBS = [
  { x: "8%",  y: "6%",  size: 460, opacity: 0.05,  speed: 0.18, drift: 40  },
  { x: "85%", y: "16%", size: 350, opacity: 0.04,  speed: 0.42, drift: -28 },
  { x: "14%", y: "46%", size: 540, opacity: 0.03,  speed: 0.62, drift: 24  },
  { x: "80%", y: "60%", size: 400, opacity: 0.045, speed: 0.32, drift: -36 },
  { x: "38%", y: "84%", size: 500, opacity: 0.025, speed: 0.52, drift: 20  },
] as const;

const ORB_RGB = "247,94,94";

// ─── Section wash configs ───────────────────────────────────
const WASHES = [
  { sectionId: "problem",      pos: "25% 28%",  spread: "55% 38%" },
  { sectionId: "how-it-works", pos: "68% 42%",  spread: "50% 35%" },
  { sectionId: "features",     pos: "42% 55%",  spread: "55% 40%" },
  { sectionId: "physicians",   pos: "55% 78%",  spread: "60% 42%" },
] as const;

export function ScrollBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add({ motionOk: MOTION_OK_QUERY }, () => {
        const landing = document.querySelector<HTMLElement>("[data-landing]");
        if (!landing) return;

        // ── L0 · Dot grid parallax ──
        const dots = el.querySelector<HTMLElement>("[data-dots]");
        if (dots) {
          gsap.to(dots, {
            yPercent: -8,
            ease: "none",
            scrollTrigger: {
              trigger: landing,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.3,
            },
          });
        }

        // ── L1 · Gradient orbs ──
        el.querySelectorAll<HTMLElement>("[data-orb]").forEach((orbEl, i) => {
          const cfg = ORBS[i];
          if (!cfg) return;

          gsap.to(orbEl, {
            y: () => -(window.innerHeight * 1.5 * cfg.speed),
            x: cfg.drift,
            scale: 1.15,
            rotation: i % 2 === 0 ? 10 : -8,
            ease: "none",
            scrollTrigger: {
              trigger: landing,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.4 + i * 0.15,
            },
          });
        });

        // ── L2 · Section color washes ──
        WASHES.forEach(({ sectionId }, i) => {
          const section = document.getElementById(sectionId);
          const wash = el.querySelector<HTMLElement>(`[data-wash="${i}"]`);
          if (!section || !wash) return;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              end: "bottom 25%",
              scrub: true,
            },
          });

          // Fade in ▸ hold ▸ fade out
          tl.fromTo(wash, { opacity: 0 }, { opacity: 1, duration: 0.3 })
            .to(wash, { opacity: 0, duration: 0.3 }, 0.7);
        });

        // ── L3 · Heartbeat trace ──
        el.querySelectorAll<SVGPathElement>("[data-hb]").forEach((path) => {
          const len = path.getTotalLength();
          gsap.set(path, {
            strokeDasharray: len,
            strokeDashoffset: len,
          });
          gsap.to(path, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: landing,
              start: "top top",
              end: "bottom bottom",
              // Glow draws slightly ahead for a bloom trail effect
              scrub: path.dataset.hb === "glow" ? 0.5 : Number(path.dataset.scrub ?? 1.2),
            },
          });
        });

        // ── L4 · 3D bubbles: scroll parallax by depth + gentle float ──
        const bubbleEls = el.querySelectorAll<HTMLElement>("[data-bubble]");
        const pointerSetters: Array<{ x: (v: number) => void; y: (v: number) => void; depth: number }> = [];
        bubbleEls.forEach((bEl, i) => {
          const cfg = BUBBLES[i];
          if (!cfg) return;
          gsap.to(bEl, {
            y: () => -(window.innerHeight * (0.6 + cfg.depth * 1.6)),
            rotation: i % 2 === 0 ? 40 : -35,
            scale: 1 + cfg.depth * 0.35,
            ease: "none",
            scrollTrigger: { trigger: landing, start: "top top", end: "bottom bottom", scrub: 0.6 + (1 - cfg.depth) * 0.9 },
          });
          // idle float so they never look static
          gsap.to(bEl.firstElementChild, {
            y: 10 + cfg.depth * 14,
            x: (i % 3) * 4 - 4,
            duration: 3.5 + (i % 4),
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          });
          pointerSetters.push({
            x: gsap.quickTo(bEl, "x", { duration: 0.9, ease: "power3.out" }),
            y: gsap.quickTo(bEl, "yPercent", { duration: 0.9, ease: "power3.out" }),
            depth: cfg.depth,
          });
        });
        const onPointer = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          pointerSetters.forEach((s) => {
            s.x(nx * 60 * s.depth);
            s.y(ny * 12 * s.depth);
          });
        };
        window.addEventListener("pointermove", onPointer, { passive: true });
        return () => window.removeEventListener("pointermove", onPointer);
      });
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* ═══ L0: Dot Grid ═══ */}
      <div
        data-dots
        className="absolute -inset-[12%] text-ink will-change-transform"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          opacity: 0.025,
        }}
      />

      {/* ═══ L1: Gradient Orbs ═══ */}
      {ORBS.map((orb, i) => (
        <div
          key={i}
          data-orb
          className="absolute rounded-full will-change-transform"
          style={{
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, rgba(${ORB_RGB},${orb.opacity}) 0%, rgba(${ORB_RGB},0) 70%)`,
          }}
        />
      ))}

      {/* ═══ L2: Section Color Washes ═══ */}
      {WASHES.map((w, i) => (
        <div
          key={`wash-${i}`}
          data-wash={i}
          className="absolute inset-0 opacity-0 will-change-[opacity]"
          style={{
            background: `radial-gradient(ellipse ${w.spread} at ${w.pos}, rgba(247,94,94,0.05) 0%, transparent 70%)`,
          }}
        />
      ))}

      {/* ═══ L3: Heartbeat Traces ═══ */}
      {TRACES.map((t, i) => {
        const d = heartbeatPath([...t.pulses], t.amp);
        return (
          <svg
            key={`trace-${i}`}
            className={`absolute top-0 h-full ${t.width} ${t.pos}`}
            viewBox="0 0 120 1000"
            preserveAspectRatio="none"
            fill="none"
          >
            <path d={d} stroke="var(--color-accent)" strokeWidth={t.glow} strokeLinecap="round" strokeLinejoin="round" opacity={t.glowOp} data-hb="glow" />
            <path d={d} stroke="var(--color-accent)" strokeWidth={t.main} strokeLinecap="round" strokeLinejoin="round" opacity={t.mainOp} data-hb="main" data-scrub={t.scrub} />
          </svg>
        );
      })}

      {/* ═══ L4: 3D Bubbles ═══ */}
      {BUBBLES.map((b, i) => (
        <div key={`bubble-${i}`} data-bubble className="absolute will-change-transform" style={{ left: b.x, top: b.y, width: b.size, height: b.size, marginLeft: -b.size / 2, marginTop: -b.size / 2 }}>
          <div className="h-full w-full rounded-full" style={{ ...bubbleStyle(b), left: undefined, top: undefined, marginLeft: undefined, marginTop: undefined }} />
        </div>
      ))}

      {/* ═══ Vignette Overlay ═══ */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 45%, rgba(0,0,0,0.04) 100%)",
        }}
      />
    </div>
  );
}

export default ScrollBackground;
