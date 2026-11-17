"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { inputCls } from "./Field";
import type { Dict } from "@/lib/i18n";

export default function PortalForm({ t }: { t: Dict }) {
  const [state, setState] = useState<"idle" | "busy" | "ok">("idle");
  const [err, setErr] = useState("");
  if (state === "ok") return <p role="status" className="rounded-xl border border-accent/40 bg-accent/5 p-4 text-sm">If that email belongs to a BTI subscriber, a secure billing link is on its way. Check your inbox (and spam folder).</p>;
  return (
    <form
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        setState("busy");
        setErr("");
        const email = new FormData(e.currentTarget).get("email");
        const r = await fetch("/api/billing-portal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }).catch(() => null);
        const j = await r?.json().catch(() => ({}));
        if (r?.ok) return setState("ok");
        setErr((t.v as Record<string, string>)[j?.error] ?? t.v.generic);
        setState("idle");
      }}
      className="space-y-3"
    >
      <label htmlFor="pemail" className="text-sm font-medium">{t.contact.email}</label>
      <input id="pemail" name="email" type="email" required autoComplete="email" className={inputCls} />
      {err && <p role="alert" className="text-sm text-down">{err}</p>}
      <button disabled={state === "busy"} className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold disabled:opacity-60">
        {state === "busy" && <Loader2 className="h-4 w-4 animate-spin" />} Email me the link
      </button>
    </form>
  );
}
