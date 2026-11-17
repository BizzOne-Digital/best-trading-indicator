import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/content";
import { siteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const routes = ["", "/about", "/features", "/pricing", "/testimonials", "/blogs", "/faq", "/contact", "/subscription-help", "/privacy-policy", "/terms-and-conditions", "/refund-policy", "/risk-disclaimer"];
  const posts = await getPosts();
  return [
    ...routes.map((r) => ({
      url: `${base}${r}`, changeFrequency: "weekly" as const, priority: r === "" ? 1 : 0.7,
      alternates: { languages: { en: `${base}${r}`, es: `${base}${r || "/"}?lang=es` } },
    })),
    ...posts.map((p) => ({ url: `${base}/blogs/${p.slug}`, lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined, priority: 0.6 })),
  ];
}
