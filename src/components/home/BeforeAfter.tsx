"use client";
import { useCallback, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = { before: React.ReactNode; after: React.ReactNode; labels: { before: string; beforeSub: string; after: string; afterSub: string } };

/** Accessible draggable comparison slider (mouse, touch, keyboard). */
export default function BeforeAfter({ before, after, labels }: Props) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef(false);

  const move = useCallback((clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  return (
    <div
      ref={box}
      className="relative aspect-[1000/520] w-full touch-pan-y select-none overflow-hidden rounded-2xl border border-line bg-bg2"
      onPointerDown={(e) => { drag.current = true; (e.target as HTMLElement).setPointerCapture?.(e.pointerId); move(e.clientX); }}
      onPointerMove={(e) => drag.current && move(e.clientX)}
      onPointerUp={() => (drag.current = false)}
      onPointerCancel={() => (drag.current = false)}
    >
      <div className="absolute inset-0">{after}</div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>{before}</div>

      <span className="pointer-events-none absolute bottom-10 left-3 rounded-lg sm:bottom-12 border border-white/15 bg-[#1b2636]/90 px-3 py-1.5 text-center text-xs font-semibold leading-tight">{labels.before}<br /><span className="font-normal text-muted">{labels.beforeSub}</span></span>
      <span className="pointer-events-none absolute bottom-10 right-16 rounded-lg sm:bottom-12 sm:right-20 bg-[#0b6b45]/95 px-3 py-1.5 text-center text-xs font-semibold leading-tight">{labels.after}<br /><span className="font-normal text-white/80">{labels.afterSub}</span></span>

      <div className="pointer-events-none absolute inset-y-0 w-[2px] bg-white shadow-[0_0_12px_rgba(255,255,255,.6)]" style={{ left: `${pos}%` }} />
      <button
        role="slider"
        aria-label="Comparison slider: drag to compare before and after BTI"
        aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pos)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
          if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
          if (e.key === "Home") setPos(0);
          if (e.key === "End") setPos(100);
        }}
        className="absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-white text-bg shadow-lg outline-none ring-accent focus-visible:ring-4"
        style={{ left: `${pos}%` }}
      >
        <ChevronLeft className="h-4 w-4" /><ChevronRight className="-ml-1 h-4 w-4" />
      </button>
    </div>
  );
}
