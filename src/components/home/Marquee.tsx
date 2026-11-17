"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Lightbox } from "./Gallery";

type Item = { url: string; alt?: string; title?: string };

/** Infinite auto-scrolling screenshot strip. Pauses on hover/touch, supports swipe + prev/next. */
export default function Marquee({ items, emptyLabel, title }: { items: Item[]; emptyLabel: string; title: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [lb, setLb] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const offset = useRef(0);

  useEffect(() => {
    if (!items.length || reduce) return;
    let raf = 0, last = performance.now();
    const tick = (now: number) => {
      const el = track.current;
      if (el && !paused) {
        offset.current += (now - last) * 0.04;
        const half = el.scrollWidth / 2;
        if (offset.current >= half) offset.current -= half;
        el.style.transform = `translate3d(${-offset.current}px,0,0)`;
      }
      last = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [items.length, paused, reduce]);

  const nudge = useCallback((dir: number) => {
    const el = track.current;
    if (!el) return;
    const half = el.scrollWidth / 2;
    offset.current = (((offset.current + dir * 340) % half) + half) % half;
    el.style.transition = "transform .45s ease";
    el.style.transform = `translate3d(${-offset.current}px,0,0)`;
    setTimeout(() => el && (el.style.transition = ""), 460);
  }, []);

  const touchX = useRef<number | null>(null);

  if (!items.length) {
    return <p className="mx-auto max-w-xl rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">{emptyLabel}</p>;
  }
  const loop = [...items, ...items];
  return (
    <div className="relative" aria-label={title} role="region">
      <div
        className={`overflow-hidden ${reduce ? "overflow-x-auto" : ""}`}
        onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
        onTouchStart={(e) => { setPaused(true); touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchX.current !== null) {
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 40) nudge(dx < 0 ? 1 : -1);
          }
          touchX.current = null;
          setTimeout(() => setPaused(false), 1500);
        }}
      >
        <div ref={track} className="flex w-max gap-5 px-4 will-change-transform">
          {loop.map((m, i) => (
            <button key={i} onClick={() => setLb(i % items.length)} aria-hidden={i >= items.length} tabIndex={i >= items.length ? -1 : 0}
              className="relative aspect-[16/10] w-[260px] shrink-0 overflow-hidden rounded-xl border border-line bg-card transition hover:border-accent sm:w-[340px]">
              <Image src={m.url} alt={m.alt || m.title || "BTI chart screenshot"} fill sizes="340px" loading="lazy" className="object-cover" />
            </button>
          ))}
        </div>
      </div>
      <div className="mt-5 flex justify-center gap-3">
        <button onClick={() => nudge(-1)} className="rounded-full border border-line p-2.5 hover:border-accent" aria-label="Previous screenshots"><ChevronLeft className="h-5 w-5" /></button>
        <button onClick={() => nudge(1)} className="rounded-full border border-line p-2.5 hover:border-accent" aria-label="Next screenshots"><ChevronRight className="h-5 w-5" /></button>
      </div>
      {lb !== null && <Lightbox items={items} index={lb} setIndex={setLb} onClose={() => setLb(null)} />}
    </div>
  );
}
