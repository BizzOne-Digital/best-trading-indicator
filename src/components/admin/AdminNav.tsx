"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  BadgeCheck, BookOpen, CreditCard, FileText, HelpCircle, Home, Image as ImageIcon, LayoutDashboard, LayoutTemplate, LogOut, Menu, MessageSquare,
  Repeat, Search, Settings, ShoppingCart, Sparkles, Star, Users, Video, X, ScrollText, Tag,
} from "lucide-react";
import Logo from "../Logo";

const NAV: [string, string, typeof Home][] = [
  ["/admin", "Dashboard", LayoutDashboard],
  ["/admin/settings?tab=pages", "Pages", LayoutTemplate],
  ["/admin/settings?tab=hero", "Homepage Content", Home],
  ["/admin/features", "Features", Sparkles],
  ["/admin/plans", "Pricing Plans", Tag],
  ["/admin/orders", "Orders", ShoppingCart],
  ["/admin/customers", "Customers", Users],
  ["/admin/subscriptions", "Subscriptions", Repeat],
  ["/admin/access", "TradingView Access", BadgeCheck],
  ["/admin/testimonials", "Testimonials", Star],
  ["/admin/blogs", "Blogs", BookOpen],
  ["/admin/faqs", "FAQ", HelpCircle],
  ["/admin/inquiries", "Contact Inquiries", MessageSquare],
  ["/admin/media", "Images / Media", ImageIcon],
  ["/admin/settings?tab=video", "Videos", Video],
  ["/admin/legal", "Legal Pages", FileText],
  ["/admin/settings?tab=seo", "SEO", Search],
  ["/admin/settings?tab=site", "Website Settings", Settings],
  ["/admin/audit", "Audit Log", ScrollText],
];

export default function AdminNav({ email }: { email: string }) {
  const path = usePathname();
  const sp = useSearchParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => {
    const [p, q] = href.split("?");
    if (q) return path === p && sp.get("tab") === new URLSearchParams(q).get("tab");
    return p === "/admin" ? path === "/admin" : path.startsWith(p);
  };
  return (
    <>
      <div className="flex items-center justify-between border-b border-line p-4 lg:hidden">
        <Logo compact />
        <button onClick={() => setOpen(true)} aria-label="Open admin menu" className="rounded-lg border border-line p-2"><Menu className="h-5 w-5" /></button>
      </div>
      {open && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-bg2 transition-transform lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between p-5">
          <Link href="/admin"><Logo compact /></Link>
          <button onClick={() => setOpen(false)} className="lg:hidden" aria-label="Close menu"><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          {NAV.map(([href, label, I]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} className={`mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${isActive(href) ? "bg-accent/15 font-semibold text-accent" : "text-muted hover:bg-white/5 hover:text-white"}`}>
              <I className="h-4 w-4" />{label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-line p-4 text-xs text-muted">
          <p className="truncate">{email}</p>
          <div className="mt-2 flex gap-2">
            <Link href="/" target="_blank" className="flex-1 rounded-lg border border-line py-1.5 text-center hover:text-white"><CreditCard className="mr-1 inline h-3 w-3" />View site</Link>
            <button onClick={async () => { await fetch("/api/admin/auth", { method: "DELETE" }); router.replace("/admin/login"); }} className="flex-1 rounded-lg border border-line py-1.5 hover:text-down">
              <LogOut className="mr-1 inline h-3 w-3" />Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
