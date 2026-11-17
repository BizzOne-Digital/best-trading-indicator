import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FeatureGrid, Showcase } from "@/components/home/Sections";
import { Container, PageHero } from "@/components/Section";
import ChartSVG from "@/components/ChartSVG";
import { getDict, getFeatures, getMedia } from "@/lib/content";

export const metadata: Metadata = {
  title: "Features",
  description: "BTI features: non-repainting signal methodology, market structure zones, buy and sell alerts, multi-market support and TradingView invite-only integration across multiple timeframes.",
  alternates: { canonical: "/features" },
};

export default async function FeaturesPage() {
  const [{ t, locale }, features, showcase, slides] = await Promise.all([getDict(), getFeatures(), getMedia("showcase"), getMedia("slideshow")]);
  return (
    <>
      <PageHero eyebrow={t.feat.eyebrow} title={t.feat.title} sub={t.feat.sub}>
        <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-line shadow-[0_30px_90px_-40px_rgba(0,230,167,.6)]">
          <ChartSVG seed={11} className="block aspect-[1000/520] w-full" />
        </div>
        <p className="mt-2 text-xs text-muted">{t.illustrative}</p>
      </PageHero>
      <FeatureGrid features={features} t={t} locale={locale} />
      <Showcase t={t} media={showcase} slides={slides} />
      <Container className="pb-20 text-center">
        <Link href="/pricing" className="btn-primary inline-flex items-center gap-2 rounded-xl px-7 py-3.5 font-bold">{t.cta.access} <ArrowRight className="h-4 w-4" /></Link>
      </Container>
    </>
  );
}
