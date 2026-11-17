"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import Logo from "./Logo";
import type { Dict, Locale } from "@/lib/i18n";

export default function Header({ t, locale }: { t: Dict; locale: Locale }) {
  const path = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const links = [
    ["/", t.nav.home], ["/about", t.nav.about], ["/features", t.nav.features], ["/pricing", t.nav.pricing],
    ["/testimonials", t.nav.testimonials], ["/blogs", t.nav.blogs], ["/faq", t.nav.faq], ["/contact", t.nav.contact],
  ] as const;

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const setLang = (l: string) => {
    document.cookie = `bti_locale=${l};path=/;max-age=31536000;samesite=lax`;
    router.refresh();
  };
  const active = (h: string) => (h === "/" ? path === "/" : path.startsWith(h));

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${scrolled ? "border-line/80 bg-bg/80 backdrop-blur-xl" : "border-white/5 bg-transparent"}`}>
      <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="BTI – Best Trading Indicator home"><Logo /></Link>
        <nav className="hidden items-center gap-1 xl:flex" aria-label="Main">
          {links.map(([h, l]) => (
            <Link key={h} href={h} className={`relative px-3 py-6 text-[15px] font-medium transition-colors hover:text-accent ${active(h) ? "text-white" : "text-fg/85"}`}>
              {l}
              {active(h) && <span className="absolute inset-x-3 bottom-3.5 h-[2px] rounded bg-accent shadow-[0_0_10px_#00e6a7]" />}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <label className="relative hidden sm:block">
            <span className="sr-only">Language</span>
            <select value={locale} onChange={(e) => setLang(e.target.value)} className="appearance-none rounded-lg border border-line bg-bg2/60 py-2 pl-3 pr-8 text-sm font-medium uppercase outline-none focus:border-accent">
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-muted" />
          </label>
          <Link href="/pricing" className="btn-primary hidden items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold md:inline-flex">
            {t.cta.access} <ArrowRight className="h-4 w-4" />
          </Link>
          <button onClick={() => setOpen(true)} className="rounded-lg border border-line p-2 xl:hidden" aria-label="Open menu" aria-expanded={open}>
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-black/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside role="dialog" aria-label="Menu" className="fixed right-0 top-0 z-50 flex h-dvh w-[86%] max-w-sm flex-col border-l border-line bg-bg2 p-6"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.28 }}>
              <div className="mb-8 flex items-center justify-between">
                <Logo compact />
                <button onClick={() => setOpen(false)} aria-label="Close menu" className="rounded-lg border border-line p-2"><X className="h-5 w-5" /></button>
              </div>
              <nav className="flex flex-col gap-1" aria-label="Mobile">
                {links.map(([h, l]) => (
                  <Link key={h} href={h} className={`rounded-lg px-4 py-3 text-lg font-medium ${active(h) ? "bg-accent/10 text-accent" : "hover:bg-white/5"}`}>{l}</Link>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-3">
                <div className="flex gap-2">
                  {(["en", "es"] as const).map((l) => (
                    <button key={l} onClick={() => setLang(l)} className={`flex-1 rounded-lg border py-2 text-sm font-semibold uppercase ${locale === l ? "border-accent text-accent" : "border-line"}`}>{l}</button>
                  ))}
                </div>
                <Link href="/pricing" className="btn-primary flex items-center justify-center gap-2 rounded-xl py-3 font-bold">{t.cta.access} <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
