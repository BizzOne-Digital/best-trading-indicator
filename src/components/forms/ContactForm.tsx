"use client";
import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Field, inputCls } from "./Field";
import type { Dict } from "@/lib/i18n";

type Errors = Record<string, string>;

export default function ContactForm({ t, plans }: { t: Dict; plans: { slug: string; name: string }[] }) {
  const [state, setState] = useState<"idle" | "sending" | "ok">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const msg = (code?: string) => (code ? (t.v as Record<string, string>)[code] ?? t.v.generic : undefined);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setErrors({});
    setFormError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const j = await res.json().catch(() => ({}));
      if (res.ok && j.ok) return setState("ok");
      if (j.fields) setErrors(j.fields);
      setFormError(msg(j.error) ?? t.v.generic);
    } catch {
      setFormError(t.v.generic);
    }
    setState("idle");
  }

  if (state === "ok") {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-accent/50 bg-accent/5 p-10 text-center" role="status">
        <CheckCircle2 className="h-14 w-14 text-accent" />
        <p className="mt-4 text-lg font-semibold">{t.contact.ok}</p>
      </div>
    );
  }
  const f = (name: string, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <Field id={name} label={label} error={msg(errors[name])}>
      <input id={name} name={name} className={inputCls} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${name}-err` : undefined} {...props} />
    </Field>
  );
  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {f("firstName", t.contact.first, { required: true, autoComplete: "given-name" })}
        {f("lastName", t.contact.last, { required: true, autoComplete: "family-name" })}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {f("email", t.contact.email, { required: true, type: "email", autoComplete: "email" })}
        {f("tradingViewUsername", t.contact.tv, { required: true, autoComplete: "off" })}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {f("subject", t.contact.subject)}
        <Field id="planInterest" label={t.contact.plan}>
          <select id="planInterest" name="planInterest" className={inputCls} defaultValue="">
            <option value="">{t.contact.none}</option>
            {plans.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
          </select>
        </Field>
      </div>
      <Field id="message" label={t.contact.message} error={msg(errors.message)}>
        <textarea id="message" name="message" rows={6} required className={inputCls} aria-invalid={!!errors.message} />
      </Field>
      {/* Honeypot: hidden from humans */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px] h-0 w-0 opacity-0" aria-hidden />
      {formError && <p role="alert" className="rounded-lg border border-down/40 bg-down/10 px-4 py-3 text-sm text-down">{formError}</p>}
      <button disabled={state === "sending"} className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-bold disabled:opacity-60 sm:w-auto sm:px-8">
        {state === "sending" ? <><Loader2 className="h-4 w-4 animate-spin" />{t.contact.sending}</> : <><Send className="h-4 w-4" />{t.contact.send}</>}
      </button>
    </form>
  );
}
