import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { getLocale, getSettings } from "@/lib/content";
import { siteUrl } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", weight: ["600", "700", "800"], display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", weight: ["400", "500"], display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: s.seoTitle, template: "%s | BTI – Best Trading Indicator" },
    description: s.seoDescription,
    applicationName: "BTI – Best Trading Indicator",
    keywords: ["Best Trading Indicator", "TradingView Indicator", "Market Structure Indicator", "Trading Indicator for Stocks", "Forex Trading Indicator", "Crypto Trading Indicator", "TradingView Invite-Only Script"],
    openGraph: { type: "website", siteName: "BTI – Best Trading Indicator", title: s.seoTitle, description: s.seoDescription, ...(s.ogImage && { images: [s.ogImage] }) },
    twitter: { card: "summary_large_image", title: s.seoTitle, description: s.seoDescription },
    alternates: { canonical: "/", languages: { en: "/", es: "/?lang=es", "x-default": "/" } },
  };
}

export const viewport: Viewport = { themeColor: "#050B15" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={`${inter.variable} ${jakarta.variable} ${mono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
