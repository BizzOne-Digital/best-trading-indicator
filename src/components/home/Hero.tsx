import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BarChart3, Layers, ShieldCheck, Target } from "lucide-react";
import ChartSVG from "../ChartSVG";
import VideoModal from "../VideoModal";
import { Reveal } from "../ui";
import { LogoMark } from "../Logo";
import type { Settings } from "@/lib/defaults";
import { loc, type Dict, type Locale } from "@/lib/i18n";

export default function Hero({ s, t, locale }: { s: Settings; t: Dict; locale: Locale }) {
  const hl = [
    [Target, t.hl.nonRepaint], [BarChart3, t.hl.logic], [Layers, t.hl.structure], [ShieldCheck, t.hl.consistency],
  ] as const;
  return (
    <section className="relative overflow-hidden pb-14 pt-28 lg:pb-20 lg:pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,#0b2a2a_0%,#050b15_55%)]" />
      <div className="grid-bg absolute inset-0" />
      <div className="glow animate-drift right-[-5%] top-10 h-[28rem] w-[36rem] bg-accent/20" />
      <div className="glow left-[-10%] bottom-0 h-72 w-[30rem] bg-accent2/10" />
      <svg className="absolute bottom-0 left-0 h-40 w-full opacity-30" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden>
        <path d="M0 120 C200 80 320 140 520 90 S860 30 1040 80 1300 40 1440 20" fill="none" stroke="#00e6a7" strokeWidth="1.5" />
        <path d="M0 140 C240 110 380 150 600 120 S920 70 1120 110 1340 80 1440 70" fill="none" stroke="#00b894" strokeWidth="1" />
      </svg>

      <div className="relative mx-auto grid max-w-[1320px] items-center gap-12 px-4 sm:px-6 lg:grid-cols-[45fr_55fr]">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-lg border border-accent/60 bg-accent/5 px-3 py-1.5 text-sm font-medium">
              <span className="font-head font-extrabold italic text-white">TV</span> {s.heroBadge}
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-5 text-[2.4rem] font-extrabold leading-[1.08] sm:text-5xl xl:text-[3.6rem]">
              {loc(s, "heroTitle1", locale)}
              <br />
              {loc(s, "heroTitle2", locale)} <span className="grad-text">{loc(s, "heroHighlight", locale)}</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-fg/85">{loc(s, "heroDescription", locale)}</p>
          </Reveal>
          <Reveal delay={0.22}>
            <ul className="mt-7 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4">
              {hl.map(([I, l]) => (
                <li key={l} className="flex items-center gap-2.5 text-sm font-medium leading-tight">
                  <I className="h-7 w-7 shrink-0 text-accent" aria-hidden /> {l}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.3} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/pricing" className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-base font-bold">
              {s.heroPrimaryCta} <ArrowRight className="h-5 w-5" />
            </Link>
            <VideoModal url={s.videoUrl} label={s.heroSecondaryCta} closeLabel={t.video.close} soonLabel={t.video.soon} />
          </Reveal>
          {s.showTraderCount && s.traderCount && <p className="mt-5 text-sm text-muted">{s.traderCount}</p>}
        </div>

        <Reveal delay={0.15} className="relative">
          <div className="animate-floaty">
            <div className="relative rounded-[22px] border border-[#2a3a50] bg-[#0d1522] p-2.5 shadow-[0_40px_120px_-30px_rgba(0,230,167,.45)]">
              <div className="overflow-hidden rounded-[14px] border border-line">
                <div className={`${s.heroImage ? "hidden" : "flex"} items-center gap-3 border-b border-line bg-[#0e1726] px-3 py-2 font-mono text-[11px] text-muted`}>
                  <span className="h-2.5 w-2.5 rounded-full bg-down/80" /><span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" /><span className="h-2.5 w-2.5 rounded-full bg-up/80" />
                  <span className="ml-2">15m</span><span>|</span><span>Indicators</span>
                  <span className="ml-auto flex items-center gap-1.5 text-fg"><LogoMark size={14} /> BTI</span>
                </div>
                {s.heroImage ? (
                  <Image src={s.heroImage} alt="BTI indicator on a TradingView chart" width={1200} height={640} priority className="h-auto w-full" sizes="(min-width:1024px) 55vw, 100vw" />
                ) : (
                  <ChartSVG className="block aspect-[1000/520] w-full" title="Illustrative BTI chart showing structure zones with buy and sell markers" />
                )}
              </div>
            </div>
            <div className="mx-auto h-3 w-[104%] -translate-x-[2%] rounded-b-2xl bg-gradient-to-b from-[#3a4656] to-[#1b2330]" />
          </div>
          <p className="mt-3 text-center text-xs text-muted">{t.illustrative}</p>
        </Reveal>
      </div>
    </section>
  );
}
