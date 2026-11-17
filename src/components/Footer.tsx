import Link from "next/link";
import { Mail } from "lucide-react";
import Logo from "./Logo";
import type { Dict } from "@/lib/i18n";
import type { Settings } from "@/lib/defaults";
import { DISCLAIMER } from "@/lib/defaults";

const IG = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
);
const TT = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden><path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.3 7.3 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6Z" /></svg>
);

export default function Footer({ t, s }: { t: Dict; s: Settings }) {
  const col = (title: string, items: [string, string][]) => (
    <div>
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-accent">{title}</h3>
      <ul className="space-y-2.5">
        {items.map(([h, l]) => (
          <li key={h + l}><Link href={h} className="text-sm text-muted transition-colors hover:text-white">{l}</Link></li>
        ))}
      </ul>
    </div>
  );
  return (
    <footer className="relative border-t border-accent/15 bg-[#040912]">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">{t.footer.desc}</p>
          <a href={`mailto:${s.contactEmail}`} className="mt-5 inline-flex items-center gap-2 text-sm text-fg hover:text-accent"><Mail className="h-4 w-4 text-accent" />{s.contactEmail}</a>
          <div className="mt-5 flex gap-3">
            {s.instagramUrl && <a href={s.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="rounded-lg border border-line p-2.5 text-muted hover:border-accent hover:text-accent"><IG /></a>}
            {s.tiktokUrl && <a href={s.tiktokUrl} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="rounded-lg border border-line p-2.5 text-muted hover:border-accent hover:text-accent"><TT /></a>}
          </div>
        </div>
        {col(t.footer.quick, [["/", t.nav.home], ["/about", t.nav.about], ["/features", t.nav.features], ["/pricing", t.nav.pricing], ["/blogs", t.nav.blogs], ["/contact", t.nav.contact]])}
        {col(t.footer.support, [["/faq", t.nav.faq], ["/contact", t.nav.contact], ["/subscription-help", t.footer.help]])}
        {col(t.footer.legal, [["/privacy-policy", t.footer.privacy], ["/terms-and-conditions", t.footer.terms], ["/refund-policy", t.footer.refund], ["/risk-disclaimer", t.footer.risk]])}
      </div>
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6">
        <div className="rounded-xl border border-down/20 bg-down/[0.04] p-4 text-xs leading-relaxed text-muted">
          <strong className="text-fg">Risk notice: </strong>{DISCLAIMER} Past performance does not guarantee future results. <Link href="/risk-disclaimer" className="text-accent underline">Read the full risk disclaimer</Link>.
        </div>
      </div>
      <div className="mx-auto mt-8 flex max-w-[1320px] flex-col items-center justify-between gap-2 border-t border-accent/10 px-4 py-6 text-xs text-muted sm:flex-row sm:px-6">
        <span>© {new Date().getFullYear()} BTI – Best Trading Indicator. {t.footer.rights}</span>
        <span className="font-mono">besttradingindicator.us</span>
      </div>
    </footer>
  );
}
