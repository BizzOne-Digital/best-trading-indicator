import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import { About, Comparison, FeatureGrid, PricingCards, Showcase, VideoSection } from "@/components/home/Sections";
import { Container, SectionHead } from "@/components/Section";
import { getDict, getFeatures, getMedia, getPlans, getSettings } from "@/lib/content";

export default async function Home() {
  const [{ t, locale }, s, features, plans, showcase, slides] = await Promise.all([
    getDict(), getSettings(), getFeatures(), getPlans(), getMedia("showcase"), getMedia("slideshow"),
  ]);
  return (
    <>
      <Hero s={s} t={t} locale={locale} />
      <Stats t={t} s={s} />
      <section className="relative overflow-hidden py-20">
        <div className="glow right-0 top-1/3 h-80 w-[30rem] bg-accent/10" />
        <Container className="relative">
          <About s={s} t={t} locale={locale} />
        </Container>
      </section>
      <section className="relative overflow-hidden border-t border-line/60 bg-bg2/50 py-20">
        <div className="glow left-1/2 top-10 h-80 w-[40rem] -translate-x-1/2 bg-accent/10" />
        <Container className="relative max-w-5xl">
          <Comparison s={s} t={t} />
        </Container>
      </section>
      <FeatureGrid features={features} t={t} locale={locale} />
      <Showcase t={t} media={showcase} slides={slides} />
      <VideoSection s={s} t={t} />
      <section id="pricing" className="relative overflow-hidden border-t border-line/60 bg-bg2/50 py-20">
        <div className="grid-bg absolute inset-0 opacity-60" />
        <Container className="relative">
          <SectionHead eyebrow={t.pricing.eyebrow} title={t.pricing.title} sub={t.pricing.sub} />
          <PricingCards plans={plans} t={t} locale={locale} />
        </Container>
      </section>
    </>
  );
}
