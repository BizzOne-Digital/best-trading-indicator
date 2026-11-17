import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, PageHero } from "@/components/Section";
import { getDict, getFaqs } from "@/lib/content";
import { loc } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about BTI: TradingView invite-only access, non-repainting signals, subscriptions, cancellation, lifetime access and risk.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const [{ t, locale }, faqs] = await Promise.all([getDict(), getFaqs()]);
  const ld = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: loc(f, "question", locale), acceptedAnswer: { "@type": "Answer", text: loc(f, "answer", locale) } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <PageHero eyebrow={t.faq.eyebrow} title={t.faq.title} sub={t.faq.sub} />
      <Container className="max-w-3xl pb-20">
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <details key={i} className="group rounded-2xl border border-line bg-card open:border-accent/60" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-left font-semibold [&::-webkit-details-marker]:hidden">
                {loc(f, "question", locale)}
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-accent transition group-open:rotate-45">+</span>
              </summary>
              <p className="px-5 pb-5 leading-relaxed text-muted">{loc(f, "answer", locale)}</p>
            </details>
          ))}
        </div>
        <div className="mt-12 rounded-2xl border border-line bg-bg2 p-8 text-center">
          <p className="text-lg font-semibold">{t.contact.title}</p>
          <Link href="/contact" className="btn-primary mt-4 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-bold">{t.cta.contact} <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </Container>
    </>
  );
}
