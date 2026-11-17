import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getDict, getSettings } from "@/lib/content";
import { siteUrl } from "@/lib/site";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [{ t, locale }, s] = await Promise.all([getDict(), getSettings()]);
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BTI – Best Trading Indicator",
    url: siteUrl(),
    logo: `${siteUrl()}/icon.svg`,
    email: s.contactEmail,
    sameAs: [s.instagramUrl, s.tiktokUrl].filter(Boolean),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      <Header t={t} locale={locale} />
      <main id="main">{children}</main>
      <Footer t={t} s={s} />
    </>
  );
}
