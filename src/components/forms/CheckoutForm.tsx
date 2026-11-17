"use client";
import { useState } from "react";
import Link from "next/link";
import { Loader2, Lock } from "lucide-react";
import { Field, inputCls } from "./Field";
import type { Dict } from "@/lib/i18n";

export default function CheckoutForm({ t, plan }: { t: Dict; plan: string }) {
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const msg = (c?: string) => (c ? (t.v as Record<string, string>)[c] ?? t.v.generic : undefined);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setFormError("");
    const data = { ...Object.fromEntries(new FormData(e.currentTarget)), plan };
    try {
      const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const j = await res.json().catch(() => ({}));
      if (res.ok && j.url) {
        window.location.assign(j.url);
        return;
      }
      if (j.fields) setErrors(j.fields);
      setFormError(j.message ?? msg(j.error) ?? t.v.generic);
    } catch {
      setFormError(t.v.generic);
    }
    setBusy(false);
  }

  const f = (name: string, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, hint?: string) => (
    <Field id={name} label={label} error={msg(errors[name])} hint={hint}>
      <input id={name} name={name} required className={inputCls} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${name}-err` : undefined} {...props} />
    </Field>
  );
  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {f("firstName", t.contact.first, { autoComplete: "given-name" })}
        {f("lastName", t.contact.last, { autoComplete: "family-name" })}
      </div>
      {f("email", t.contact.email, { type: "email", autoComplete: "email" })}
      {f("tradingViewUsername", t.contact.tv, { autoComplete: "off", spellCheck: false }, t.checkout.tvHint)}
      {formError && <p role="alert" className="rounded-lg border border-down/40 bg-down/10 px-4 py-3 text-sm text-down">{formError}</p>}
      <button disabled={busy} className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-bold disabled:opacity-60">
        {busy ? <><Loader2 className="h-5 w-5 animate-spin" />{t.checkout.paying}</> : <><Lock className="h-4 w-4" />{t.checkout.pay}</>}
      </button>
      <p className="text-center text-xs text-muted">
        {t.checkout.agree.split(/(Terms|Refund Policy|Risk Disclaimer|Términos|Política de reembolso|Aviso de riesgo)/).map((part, i) => {
          const map: Record<string, string> = { Terms: "/terms-and-conditions", "Refund Policy": "/refund-policy", "Risk Disclaimer": "/risk-disclaimer", Términos: "/terms-and-conditions", "Política de reembolso": "/refund-policy", "Aviso de riesgo": "/risk-disclaimer" };
          return map[part] ? <Link key={i} href={map[part]} className="text-accent underline" target="_blank">{part}</Link> : part;
        })}
      </p>
    </form>
  );
}
