import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, CheckCircle2 } from "lucide-react";
import ChartSVG from "../ChartSVG";
import BeforeAfter from "./BeforeAfter";
import Icon from "../Icon";
import { Reveal } from "../ui";
import { Container, Eyebrow, SectionHead } from "../Section";
import VideoModal from "../VideoModal";
import Gallery from "./Gallery";
import Marquee from "./Marquee";
import type { Settings } from "@/lib/defaults";
import { loc, type Dict, type Locale } from "@/lib/i18n";
import { effectivePrice, type Plan } from "@/lib/content";

export function About({ s, t, locale, full }: { s: Settings; t: Dict; locale: Locale; full?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-none lg:rounded-r-3xl">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <Reveal className="relative z-10 py-4">
          <Eyebrow>{t.about.eyebrow}</Eyebrow>
          <h2 className="mt-2 text-3xl font-extrabold">{loc(s, "aboutTitle", locale)}</h2>
          <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-fg/85">
            {loc(s, "aboutBody", locale).split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <ul className="mt-5 space-y-2.5">
            {t.about.b.map((b) => (
              <li key={b} className="flex items-center gap-2.5 text-[15px]"><CheckCircle2 className="h-5 w-5 shrink-0 fill-accent text-bg" aria-hidden />{b}</li>
            ))}
          </ul>
          {!full && (
            <Link href="/about" className="btn-primary mt-7 inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-bold">{t.cta.learnAbout} <ArrowRight className="h-4 w-4" /></Link>
          )}
        </Reveal>
        <Reveal delay={0.1} className="relative aspect-[14/11] overflow-hidden rounded-3xl border border-line">
          {s.aboutImage && <Image src={s.aboutImage} alt="Professional trader working at multiple trading monitors in a dark office" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-r from-bg/40 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent mix-blend-multiply" />
          <div className="absolute inset-0 bg-accent/10 mix-blend-overlay" />
        </Reveal>
      </div>
    </div>
  );
}

export function Comparison({ s, t }: { s: Settings; t: Dict }) {
  const img = (src: string, alt: string) => <Image src={src} alt={alt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />;
  const useImages = s.beforeImage && s.afterImage;
  return (
    <Reveal>
      <div className="text-center">
        <Eyebrow pill>{t.ba.eyebrow}</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">{t.ba.title}</h2>
        <p className="mt-2 text-muted sm:text-lg">{t.ba.sub}</p>
      </div>
      <div className="mt-8 shadow-[0_30px_90px_-40px_rgba(0,230,167,.5)]">
        <BeforeAfter
          labels={t.ba}
          before={useImages ? img(s.beforeImage, "Chart without BTI") : <ChartSVG overlay={false} className="h-full w-full" brand={false} title="Illustrative chart without BTI overlay" />}
          after={useImages ? img(s.afterImage, "Same chart with BTI overlay") : <ChartSVG overlay className="h-full w-full" brand={false} title="Same illustrative chart with BTI overlay" />}
        />
      </div>
      <p className="mt-3 text-center text-xs text-muted">{t.ba.note}</p>
    </Reveal>
  );
}

type Feat = { _id?: string; icon?: string; title: string; description: string };
export function FeatureGrid({ features, t, locale }: { features: Feat[]; t: Dict; locale: Locale }) {
  return (
    <section id="features" className="bg-light py-20 text-[#0b1220]">
      <Container>
        <SectionHead light eyebrow={t.feat.eyebrow} title={t.feat.title} sub={t.feat.sub} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
          {features.map((f, i) => (
            <Reveal key={f._id ?? i} delay={i * 0.05}>
              <div className="card-hover group relative h-full overflow-hidden rounded-2xl border border-[#e2e9f1] bg-white p-6 shadow-[0_6px_20px_-12px_rgba(10,20,34,.25)]">
                <span className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-accent to-accent2 transition-transform duration-300 group-hover:scale-x-100" />
                <Icon name={f.icon} className="h-10 w-10 text-accent2" strokeWidth={2.2} />
                <h3 className="mt-4 text-lg font-bold">{loc(f, "title", locale)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4b5a6d]">{loc(f, "description", locale)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function Showcase({ t, media, slides }: { t: Dict; media: { url: string; alt?: string; title?: string }[]; slides: { url: string; alt?: string; title?: string }[] }) {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="glow left-1/2 top-20 h-96 w-[50rem] -translate-x-1/2 bg-accent/10" />
      <Container className="relative">
        <SectionHead eyebrow={t.show.eyebrow} title={t.show.title} sub={t.show.sub} />
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_280px]">
          <Reveal className="overflow-hidden rounded-2xl border border-line shadow-[0_30px_90px_-40px_rgba(0,230,167,.5)]">
            {media[0] ? <Gallery items={media} /> : <ChartSVG n={120} seed={21} className="block aspect-[1000/520] w-full" />}
          </Reveal>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {t.show.c.map((c, i) => (
              <Reveal key={c} delay={i * 0.06}>
                <li className="flex items-center gap-3 rounded-xl border border-line bg-card/70 p-4 text-sm font-medium">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent"><Check className="h-4 w-4" /></span>{c}
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
        <p className="mt-3 text-xs text-muted">{t.illustrative}</p>
      </Container>
      <div className="mt-14">
        <Marquee items={slides} emptyLabel={t.show.empty} title={t.show.gallery} />
      </div>
    </section>
  );
}

export function VideoSection({ s, t }: { s: Settings; t: Dict }) {
  return (
    <section className="py-20">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <Eyebrow pill>{t.video.eyebrow}</Eyebrow>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">{t.video.title}</h2>
            <p className="mt-3 text-lg text-muted">{t.video.sub}</p>
            <ul className="mt-6 space-y-2.5">
              {t.show.c.slice(0, 4).map((c) => <li key={c} className="flex items-center gap-2.5"><CheckCircle2 className="h-5 w-5 fill-accent text-bg" />{c}</li>)}
            </ul>
            <Link href="/pricing" className="btn-primary mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-bold">{t.cta.access} <ArrowRight className="h-4 w-4" /></Link>
          </Reveal>
          <Reveal delay={0.1}>
            <VideoModal variant="thumb" url={s.videoUrl} thumbnail={s.videoThumbnail} label={t.video.title} closeLabel={t.video.close} soonLabel={t.video.soon} />
            {!s.videoUrl && <p className="mt-2 text-center text-xs text-muted">{t.video.soon}</p>}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

export function PricingCards({ plans, t, locale }: { plans: Plan[]; t: Dict; locale: Locale }) {
  const per = (p: Plan) => (p.interval === "month" ? t.pricing.month : p.interval === "year" ? t.pricing.year : t.pricing.lifetime);
  return (
    <div>
      <div className="mx-auto grid max-w-5xl items-stretch gap-6 md:grid-cols-3">
        {plans.map((p, i) => {
          const { price, original } = effectivePrice(p);
          return (
            <Reveal key={p.slug} delay={i * 0.08} className="h-full">
              <div className={`relative flex h-full flex-col rounded-3xl border p-7 ${p.featured ? "border-accent bg-gradient-to-b from-[#0c2a26] to-card shadow-[0_0_0_1px_#00e6a7,0_30px_80px_-30px_rgba(0,230,167,.7)] md:-translate-y-3" : "border-line bg-card"}`}>
                {p.badge && <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-extrabold uppercase tracking-wide text-bg">{p.badge}</span>}
                <h3 className="text-xl font-bold">{loc(p, "name", locale)}</h3>
                <div className="mt-4 flex items-end gap-2">
                  {original && <span className="mb-1.5 font-mono text-lg text-muted line-through">${original}</span>}
                  <span className="font-head text-5xl font-extrabold">${price}</span>
                  <span className="mb-1.5 text-sm text-muted">USD {per(p)}</span>
                </div>
                {loc(p, "note", locale) && <p className="mt-2 text-sm font-medium text-accent">{loc(p, "note", locale)}</p>}
                <ul className="mt-6 space-y-3 text-sm">
                  {(locale === "es" && p.features_es?.length ? p.features_es : p.features).map((f) => (
                    <li key={f} className="flex gap-2.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{f}</li>
                  ))}
                </ul>
                <Link href={`/checkout?plan=${p.slug}`} className={`mt-8 inline-flex items-center justify-center gap-2 rounded-xl py-3.5 font-bold transition ${p.featured ? "btn-primary" : "border border-accent/60 text-accent hover:bg-accent hover:text-bg"}`}>
                  {loc(p, "ctaLabel", locale)} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          );
        })}
      </div>
      <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-muted">{t.pricing.terms}</p>
    </div>
  );
}
