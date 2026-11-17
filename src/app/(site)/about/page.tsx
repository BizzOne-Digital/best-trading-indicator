import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Brain, Eye, ShieldCheck } from "lucide-react";
import { About, Comparison } from "@/components/home/Sections";
import Stats from "@/components/home/Stats";
import { Container, PageHero, SectionHead } from "@/components/Section";
import { Reveal } from "@/components/ui";
import { getDict, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "About Us",
  description: "Meet the team behind BTI – Best Trading Indicator: traders with 12+ years of market experience building a clear, non-repainting market structure indicator for TradingView.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const [{ t, locale }, s] = await Promise.all([getDict(), getSettings()]);
  const es = locale === "es";
  const values = [
    [Eye, es ? "Claridad" : "Clarity", es ? "Un gráfico limpio que muestra estructura, tendencia y zonas clave sin ruido." : "One clean chart that shows structure, trend and key zones without the noise."],
    [Brain, es ? "Disciplina" : "Discipline", es ? "Herramientas que apoyan un proceso, no impulsos." : "Tools that support a repeatable process instead of impulse decisions."],
    [ShieldCheck, es ? "Honestidad" : "Honesty", es ? "Sin promesas de ganancias. El trading conlleva riesgo y lo decimos claramente." : "No profit promises. Trading carries risk and we say so clearly."],
  ] as const;
  return (
    <>
      <PageHero eyebrow={t.about.eyebrow} title={es ? "Traders construyendo herramientas para traders" : "Traders building tools for traders"} sub={es ? "Más de 12 años en los mercados, condensados en un indicador claro." : "12+ years in the markets, distilled into one clear indicator."} />
      <Stats t={t} s={s} />
      <section className="py-20"><Container><About s={s} t={t} locale={locale} full /></Container></section>
      <section className="bg-bg2/60 py-20">
        <Container>
          <SectionHead eyebrow={es ? "Nuestros valores" : "Our values"} title={es ? "Cómo trabajamos" : "How we work"} />
          <div className="grid gap-6 md:grid-cols-3">
            {values.map(([I, h, p], i) => (
              <Reveal key={h} delay={i * 0.08}>
                <div className="card-hover h-full rounded-2xl border border-line bg-card p-7">
                  <I className="h-10 w-10 text-accent" />
                  <h3 className="mt-4 text-xl font-bold">{h}</h3>
                  <p className="mt-2 text-muted">{p}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
      <section className="py-20">
        <Container className="max-w-4xl">
          <Comparison s={s} t={t} />
          <div className="mt-10 text-center">
            <Link href="/pricing" className="btn-primary inline-flex items-center gap-2 rounded-xl px-7 py-3.5 font-bold">{t.cta.viewPricing} <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </Container>
      </section>
    </>
  );
}
