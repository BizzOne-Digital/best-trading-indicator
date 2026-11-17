import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Quote, Star } from "lucide-react";
import { Container, PageHero } from "@/components/Section";
import { Reveal } from "@/components/ui";
import { getDict, getTestimonials } from "@/lib/content";
import { loc } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Client-approved reviews from traders using BTI – Best Trading Indicator on TradingView.",
  alternates: { canonical: "/testimonials" },
};

export default async function TestimonialsPage() {
  const [{ t, locale }, items] = await Promise.all([getDict(), getTestimonials()]);
  return (
    <>
      <PageHero eyebrow={t.test.eyebrow} title={t.test.title} sub={t.test.sub} />
      <Container className="pb-20">
        {items.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-line bg-card/50 p-10 text-center">
            <Quote className="mx-auto h-10 w-10 text-accent" />
            <p className="mt-4 text-lg">{t.test.empty}</p>
          </div>
        ) : (
          <div className="columns-1 gap-6 md:columns-2 lg:columns-3">
            {items.map((r, i) => (
              <Reveal key={r._id} delay={(i % 6) * 0.05} className="mb-6 break-inside-avoid">
                <figure className="card-hover rounded-2xl border border-line bg-card p-6">
                  {r.rating ? (
                    <div className="flex gap-0.5" aria-label={`${r.rating} out of 5`}>
                      {Array.from({ length: 5 }, (_, k) => <Star key={k} className={`h-4 w-4 ${k < r.rating! ? "fill-yellow-400 text-yellow-400" : "text-line"}`} />)}
                    </div>
                  ) : null}
                  <blockquote className="mt-3 leading-relaxed text-fg/90">“{loc(r, "text", locale)}”</blockquote>
                  <figcaption className="mt-4 flex items-center gap-2 text-sm font-semibold">
                    {r.name}
                    {r.verified && <span className="inline-flex items-center gap-1 text-xs font-medium text-accent"><BadgeCheck className="h-4 w-4" />{t.test.verified}</span>}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}
        <div className="mt-12 text-center">
          <Link href="/pricing" className="btn-primary inline-flex items-center gap-2 rounded-xl px-7 py-3.5 font-bold">{t.cta.access} <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </Container>
    </>
  );
}
