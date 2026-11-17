import type { Metadata } from "next";
import { Clock, Mail, MessageSquare } from "lucide-react";
import { Container, PageHero } from "@/components/Section";
import ContactForm from "@/components/forms/ContactForm";
import { getDict, getPlans, getSettings } from "@/lib/content";
import { loc } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the BTI – Best Trading Indicator team about TradingView access, subscriptions or support.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const [{ t, locale }, s, plans] = await Promise.all([getDict(), getSettings(), getPlans()]);
  const es = locale === "es";
  return (
    <>
      <PageHero eyebrow={t.contact.eyebrow} title={t.contact.title} sub={t.contact.sub} />
      <Container className="grid gap-8 pb-20 lg:grid-cols-[1fr_2fr]">
        <aside className="space-y-4">
          {[
            [Mail, "Email", <a key="m" href={`mailto:${s.contactEmail}`} className="text-accent hover:underline">{s.contactEmail}</a>],
            [Clock, es ? "Tiempo de respuesta" : "Response time", es ? "Normalmente en 1 día hábil" : "Usually within 1 business day"],
            [MessageSquare, es ? "Incluye" : "Please include", es ? "Tu usuario de TradingView para consultas de acceso" : "Your TradingView username for access questions"],
          ].map(([I, h, b], i) => {
            const Ico = I as typeof Mail;
            return (
              <div key={i} className="flex gap-4 rounded-2xl border border-line bg-card p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent"><Ico className="h-5 w-5" /></span>
                <div><p className="font-semibold">{h as string}</p><p className="text-sm text-muted">{b as React.ReactNode}</p></div>
              </div>
            );
          })}
        </aside>
        <div className="rounded-3xl border border-line bg-card/80 p-6 sm:p-8">
          <ContactForm t={t} plans={plans.map((p) => ({ slug: p.slug, name: loc(p, "name", locale) }))} />
        </div>
      </Container>
    </>
  );
}
