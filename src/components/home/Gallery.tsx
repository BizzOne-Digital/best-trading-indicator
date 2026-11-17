"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

type Item = { url: string; alt?: string; title?: string };

export function Lightbox({ items, index, onClose, setIndex }: { items: Item[]; index: number; onClose: () => void; setIndex: (i: number) => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((index + 1) % items.length);
      if (e.key === "ArrowLeft") setIndex((index - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [index, items.length, onClose, setIndex]);
  const it = items[index];
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal="true" onClick={onClose}>
      <button className="absolute right-4 top-4 rounded-lg border border-white/20 p-2" aria-label="Close" onClick={onClose}><X className="h-5 w-5" /></button>
      {items.length > 1 && (
        <>
          <button className="absolute left-3 rounded-full bg-white/10 p-3" aria-label="Previous" onClick={(e) => { e.stopPropagation(); setIndex((index - 1 + items.length) % items.length); }}><ChevronLeft /></button>
          <button className="absolute right-3 rounded-full bg-white/10 p-3" aria-label="Next" onClick={(e) => { e.stopPropagation(); setIndex((index + 1) % items.length); }}><ChevronRight /></button>
        </>
      )}
      <div className="relative h-[80vh] w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
        <Image src={it.url} alt={it.alt || it.title || "BTI chart screenshot"} fill sizes="100vw" className="object-contain" />
      </div>
    </div>
  );
}

export default function Gallery({ items }: { items: Item[] }) {
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="relative aspect-[16/9] bg-bg2">
        <Image src={items[i].url} alt={items[i].alt || "BTI indicator chart screenshot"} fill sizes="(min-width:1024px) 70vw, 100vw" className="object-cover" />
        <button onClick={() => setOpen(true)} className="absolute right-3 top-3 rounded-lg bg-black/60 p-2" aria-label="Open full screen"><Maximize2 className="h-4 w-4" /></button>
      </div>
      {items.length > 1 && (
        <div className="flex gap-2 overflow-x-auto bg-bg2 p-2">
          {items.map((m, k) => (
            <button key={m.url} onClick={() => setI(k)} className={`relative h-14 w-24 shrink-0 overflow-hidden rounded-md border-2 ${k === i ? "border-accent" : "border-transparent opacity-60"}`} aria-label={`Show screenshot ${k + 1}`}>
              <Image src={m.url} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
      {open && <Lightbox items={items} index={i} setIndex={setI} onClose={() => setOpen(false)} />}
    </div>
  );
}
