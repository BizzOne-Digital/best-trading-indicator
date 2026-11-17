import type { Metadata } from "next";
import Link from "next/link";
import { CreditCard, Lock, UserCheck } from "lucide-react";
import { PricingCards } from "@/components/home/Sections";
import { Container, PageHero, SectionHead } from "@/components/Section";
import { getDict, getFaqs, getPlans } from "@/lib/content";
import { loc } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Pricing",
  description: "BTI TradingView indicator access: Monthly $59, Yearly $299 or Lifetime $499 (USD). Secure Stripe checkout, invite-only script access added to your TradingView username.",
  alternates: { canonical: "/pricing" },
};

export default async function PricingPage() {
  const [{ t, locale }, plans, faqs] = await Promise.all([getDict(), getPlans(), getFaqs()]);
  const es = locale === "es";
  const steps = [
    [CreditCard, es ? "1. Elige tu plan" : "1. Choose your plan", es ? "Mensual, anual o de por vida. Pago seguro con Stripe (tarjeta y Google Pay cuando esté disponible)." : "Monthly, yearly or lifetime. Secure Stripe checkout (card, plus Google Pay where available)."],
    [UserCheck, es ? "2. Indica tu usuario de TradingView" : "2. Add your TradingView username", es ? "Lo usamos para concederte acceso al script por invitación." : "We use it to grant you access to the invite-only script."],
    [Lock, es ? "3. Recibe el acceso" : "3. Receive access", es ? "Tras confirmar el pago, nuestro equipo añade tu usuario manualmente (normalmente en 1 día hábil)." : "After payment is confirmed, our team adds your username manually (usually within 1 business day)."],
  ] as const;
  const pricingFaqs = faqs.filter((f) => /subscription|lifetime|cancel|access/i.test(f.question)).slice(0, 4);
  return (
    <>
      <PageHero eyebrow={t.pricing.eyebrow} title={t.pricing.title} sub={t.pricing.sub} />
      <Container className="pb-16"><PricingCards plans={plans} t={t} locale={locale} /></Container>
      <section className="bg-bg2/60 py-16">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map(([I, h, p]) => (
              <div key={h} className="rounded-2xl border border-line bg-card p-6">
                <I className="h-8 w-8 text-accent" /><h3 className="mt-3 text-lg font-bold">{h}</h3><p className="mt-1 text-sm text-muted">{p}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <section className="py-16">
        <Container className="max-w-3xl">
          <SectionHead title={t.faq.title} />
          <div className="space-y-4">
            {pricingFaqs.map((f) => (
              <div key={f.question} className="rounded-xl border border-line bg-card p-5">
                <h3 className="font-bold">{loc(f, "question", locale)}</h3>
                <p className="mt-1.5 text-sm text-muted">{loc(f, "answer", locale)}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted">
            <Link href="/faq" className="text-accent underline">{t.nav.faq}</Link> · <Link href="/refund-policy" className="text-accent underline">{t.footer.refund}</Link> · <Link href="/subscription-help" className="text-accent underline">{t.footer.help}</Link>
          </p>
        </Container>
      </section>
    </>
  );
}
