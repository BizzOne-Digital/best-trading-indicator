"use client";
import { useRef, useState } from "react";
import { ImagePlus, Loader2, RefreshCw, Trash2 } from "lucide-react";

const TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX = 8 * 1024 * 1024;

/** Reusable admin image input: uploads to MongoDB via /api/upload and returns the public URL. */
export default function LocalImageField({ value, onChange, folder = "misc", label }: { value?: string; onChange: (url: string) => void; folder?: "products" | "gallery" | "pages" | "misc" | string; label?: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function upload(file: File) {
    setMsg(null);
    if (!TYPES.includes(file.type)) return setMsg({ ok: false, text: "Use PNG, JPEG, WEBP or GIF." });
    if (file.size > MAX) return setMsg({ ok: false, text: "Image must be 8 MB or smaller." });
    setBusy(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    try {
      const r = await fetch("/api/upload", { method: "POST", body: fd });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Upload failed");
      onChange(j.url);
      setMsg({ ok: true, text: "Uploaded. Remember to save." });
    } catch (e) {
      setMsg({ ok: false, text: (e as Error).message });
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div>
      {label && <p className="mb-1.5 text-sm font-medium">{label}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-24 w-40 items-center justify-center overflow-hidden rounded-lg border border-line bg-bg2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <ImagePlus className="h-6 w-6 text-muted" />}
        </div>
        <div className="flex flex-col gap-2">
          <button type="button" disabled={busy} onClick={() => input.current?.click()} className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-1.5 text-sm hover:border-accent disabled:opacity-50">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : value ? <RefreshCw className="h-4 w-4" /> : <ImagePlus className="h-4 w-4" />}
            {busy ? "Uploading…" : value ? "Replace" : "Upload"}
          </button>
          {value && (
            <button type="button" onClick={() => { onChange(""); setMsg({ ok: true, text: "Removed. Remember to save." }); }} className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-1.5 text-sm hover:border-down hover:text-down">
              <Trash2 className="h-4 w-4" />Remove
            </button>
          )}
        </div>
        <input ref={input} type="file" accept={TYPES.join(",")} hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
      </div>
      {msg && <p role="status" className={`mt-1.5 text-xs ${msg.ok ? "text-accent" : "text-down"}`}>{msg.text}</p>}
    </div>
  );
}
