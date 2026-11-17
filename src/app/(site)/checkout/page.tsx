import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ShieldCheck } from "lucide-react";
import { Container } from "@/components/Section";
import CheckoutForm from "@/components/forms/CheckoutForm";
import { effectivePrice, getDict, getPlans } from "@/lib/content";
import { loc } from "@/lib/i18n";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const { plan: slug } = await searchParams;
  const [{ t, locale }, plans] = await Promise.all([getDict(), getPlans()]);
  const plan = plans.find((p) => p.slug === slug);
  if (!plan) notFound();
  const { price } = effectivePrice(plan);
  const per = plan.interval === "month" ? t.pricing.month : plan.interval === "year" ? t.pricing.year : t.pricing.lifetime;
  return (
    <section className="relative pb-20 pt-32">
      <div className="grid-bg absolute inset-0 opacity-50" />
      <Container className="relative grid max-w-5xl gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl border border-line bg-card p-6 sm:p-8">
          <h1 className="text-2xl font-extrabold sm:text-3xl">{t.checkout.title}</h1>
          <p className="mt-2 text-muted">{t.checkout.sub}</p>
          <div className="mt-6"><CheckoutForm t={t} plan={plan.slug} /></div>
        </div>
        <aside className="h-fit rounded-3xl border border-accent/50 bg-gradient-to-b from-[#0c2a26] to-card p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">BTI · {loc(plan, "name", locale)}</p>
          <p className="mt-2"><span className="font-head text-4xl font-extrabold">${price}</span> <span className="text-muted">USD {per}</span></p>
          {loc(plan, "note", locale) && <p className="mt-1 text-sm text-accent">{loc(plan, "note", locale)}</p>}
          <ul className="mt-5 space-y-2.5 text-sm">
            {(locale === "es" && plan.features_es?.length ? plan.features_es : plan.features).map((f) => <li key={f} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-accent" />{f}</li>)}
          </ul>
          <p className="mt-6 flex gap-2 border-t border-line pt-5 text-xs text-muted"><ShieldCheck className="h-4 w-4 shrink-0 text-accent" />{t.checkout.secure}</p>
          <Link href="/pricing" className="mt-4 inline-block text-sm text-accent underline">{t.nav.pricing}</Link>
        </aside>
      </Container>
    </section>
  );
}
