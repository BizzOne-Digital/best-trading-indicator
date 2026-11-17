"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, X, Film } from "lucide-react";

function embedUrl(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu")) {
      const id = u.hostname === "youtu.be" ? u.pathname.slice(1) : u.searchParams.get("v") ?? u.pathname.split("/").pop();
      return { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0` };
    }
    if (u.hostname.includes("vimeo")) return { kind: "iframe", src: `https://player.vimeo.com/video/${u.pathname.split("/").filter(Boolean).pop()}?autoplay=1` };
    return { kind: "video", src: url };
  } catch {
    return null;
  }
}

export default function VideoModal({ url, label, closeLabel, soonLabel, variant = "button", thumbnail }: { url?: string; label: string; closeLabel: string; soonLabel: string; variant?: "button" | "thumb"; thumbnail?: string }) {
  const [open, setOpen] = useState(false);
  const e = url ? embedUrl(url) : null;
  useEffect(() => {
    if (!open) return;
    const k = (ev: KeyboardEvent) => ev.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);

  return (
    <>
      {variant === "button" ? (
        <button onClick={() => setOpen(true)} className="btn-ghost inline-flex items-center justify-center gap-3 rounded-xl px-7 py-3.5 text-base font-semibold">
          <Play className="h-4 w-4 fill-current" /> {label}
        </button>
      ) : (
        <button onClick={() => setOpen(true)} aria-label={label} className="group relative block aspect-video w-full overflow-hidden rounded-2xl border border-line bg-card">
          {thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumbnail} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80 transition group-hover:scale-105" loading="lazy" />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,230,167,.25),transparent_60%)]" />
          )}
          <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-bg shadow-[0_0_0_12px_rgba(0,230,167,.15),0_0_50px_rgba(0,230,167,.6)] transition group-hover:scale-110">
            <Play className="ml-1 h-8 w-8 fill-current" />
          </span>
        </button>
      )}
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} role="dialog" aria-modal="true" aria-label={label}>
            <motion.div className="relative w-full max-w-4xl" initial={{ scale: 0.94 }} animate={{ scale: 1 }} exit={{ scale: 0.94 }} onClick={(ev) => ev.stopPropagation()}>
              <button onClick={() => setOpen(false)} className="absolute -top-12 right-0 rounded-lg border border-white/20 p-2 text-white" aria-label={closeLabel}><X className="h-5 w-5" /></button>
              <div className="aspect-video overflow-hidden rounded-2xl border border-line bg-bg2">
                {e?.kind === "iframe" && <iframe src={e.src} title={label} className="h-full w-full" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />}
                {e?.kind === "video" && <video src={e.src} controls autoPlay className="h-full w-full" />}
                {!e && (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted">
                    <Film className="h-12 w-12 text-accent" />
                    <p className="text-lg text-white">{soonLabel}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
