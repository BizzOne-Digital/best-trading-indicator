"use client";
import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";

export default function ShareButtons({ url, title, label }: { url: string; title: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  const links = [
    ["X", `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`],
    ["Facebook", `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`],
    ["LinkedIn", `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`],
    ["WhatsApp", `https://wa.me/?text=${enc(`${title} ${url}`)}`],
  ];
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold"><Share2 className="h-4 w-4 text-accent" />{label}</span>
      {links.map(([n, h]) => (
        <a key={n} href={h} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-line px-3 py-1.5 text-xs hover:border-accent hover:text-accent">{n}</a>
      ))}
      <button
        onClick={async () => {
          await navigator.clipboard.writeText(url).catch(() => {});
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="inline-flex items-center gap-1 rounded-lg border border-line px-3 py-1.5 text-xs hover:border-accent"
        aria-label="Copy link"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Link2 className="h-3.5 w-3.5" />} Link
      </button>
    </div>
  );
}
