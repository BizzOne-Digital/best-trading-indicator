import "server-only";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";
import { connectDB, hasDb } from "./db";
import { BlogPost, FAQ, Feature, LegalPage, MediaAsset, PricingPlan, SiteSettings, Testimonial } from "./models";
import { DEFAULT_FAQS, DEFAULT_FEATURES, DEFAULT_LEGAL, DEFAULT_MEDIA, DEFAULT_PLANS, DEFAULT_SETTINGS, type Settings } from "./defaults";
import { DICTS, LOCALE_COOKIE, type Locale } from "./i18n";

export const CONTENT_TAG = "content";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const plain = (v: unknown): any => JSON.parse(JSON.stringify(v));
export type FeatureDoc = { _id?: string; icon?: string; title: string; description: string; title_es?: string; description_es?: string };

export async function getLocale(): Promise<Locale> {
  const v = (await cookies()).get(LOCALE_COOKIE)?.value;
  return v === "es" ? "es" : "en";
}
export async function getDict() {
  const locale = await getLocale();
  return { locale, t: DICTS[locale] };
}

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  if (!hasDb()) return fallback;
  try {
    await connectDB();
    return await fn();
  } catch (e) {
    console.error("[content] falling back to defaults:", (e as Error).message);
    return fallback;
  }
}

async function seedIfEmpty(model: typeof Feature, docs: object[]) {
  if ((await model.estimatedDocumentCount()) === 0) await model.insertMany(docs).catch(() => {});
}

const cached = <T,>(key: string, fn: () => Promise<T>) => unstable_cache(fn, [key], { tags: [CONTENT_TAG], revalidate: 3600 });

export const getSettings = cached("settings", () =>
  safe(async () => {
    const doc = await SiteSettings.findOne({ key: "main" }).lean<{ data: Partial<Settings> }>();
    return { ...DEFAULT_SETTINGS, ...(doc?.data ?? {}) } as Settings;
  }, DEFAULT_SETTINGS),
);

export const getFeatures = cached("features", () =>
  safe(async () => {
    await seedIfEmpty(Feature, DEFAULT_FEATURES.map((f, i) => ({ ...f, order: i })));
    return plain(await Feature.find({ visible: true }).sort({ order: 1 }).lean()) as FeatureDoc[];
  }, DEFAULT_FEATURES.map((f, i) => ({ ...f, _id: String(i) })) as FeatureDoc[]),
);

export type Plan = (typeof DEFAULT_PLANS)[number] & { _id?: string; regularPrice?: number; discountPercent?: number; showRegularPrice?: boolean; promoStart?: string; promoEnd?: string; featured?: boolean; badge?: string; stripePriceId?: string };

export const getPlans = cached("plans", () =>
  safe(async () => {
    await seedIfEmpty(PricingPlan, DEFAULT_PLANS);
    return plain(await PricingPlan.find({ visible: true }).sort({ order: 1 }).lean()) as Plan[];
  }, DEFAULT_PLANS as Plan[]),
);

export const getFaqs = cached("faqs", () =>
  safe(async () => {
    await seedIfEmpty(FAQ, DEFAULT_FAQS);
    return plain(await FAQ.find({ visible: true }).sort({ order: 1 }).lean()) as typeof DEFAULT_FAQS;
  }, DEFAULT_FAQS),
);

export const getLegal = (slug: string) =>
  cached(`legal-${slug}`, () =>
    safe(async () => {
      await seedIfEmpty(LegalPage, DEFAULT_LEGAL);
      return plain(await LegalPage.findOne({ slug }).lean()) as { title: string; content: string; approved?: boolean; updatedAt?: string } | null;
    }, DEFAULT_LEGAL.find((l) => l.slug === slug) ?? null),
  )();

export const getTestimonials = cached("testimonials", () =>
  safe(async () => plain(await Testimonial.find({ approved: true }).sort({ order: 1, createdAt: -1 }).lean()) as { _id: string; name: string; text: string; text_es?: string; rating?: number; verified?: boolean }[], []),
);

export const getMedia = (group: "showcase" | "slideshow") =>
  cached(`media-${group}`, () =>
    safe(async () => plain(await MediaAsset.find({ group, visible: true }).sort({ order: 1 }).lean()) as { _id: string; url: string; alt?: string; title?: string }[], []),
  )().then((items) => (items.length ? items : DEFAULT_MEDIA[group]));

export type Post = { _id: string; title: string; slug: string; excerpt?: string; content?: string; category?: string; coverImage?: string; author?: string; featured?: boolean; seoTitle?: string; seoDescription?: string; publishedAt?: string; createdAt?: string; updatedAt?: string };

export const getPosts = cached("posts", () =>
  safe(async () => plain(await BlogPost.find({ published: true }).sort({ publishedAt: -1 }).select("-content").lean()) as Post[], []),
);
export const getPost = (slug: string) =>
  cached(`post-${slug}`, () => safe(async () => plain(await BlogPost.findOne({ slug, published: true }).lean()) as Post | null, null))();

export function readingTime(text = "") {
  return Math.max(1, Math.round(text.split(/\s+/).length / 220));
}

/** Plan price currently in effect (promo window aware). */
export function effectivePrice(p: Pick<Plan, "price" | "regularPrice" | "showRegularPrice" | "promoStart" | "promoEnd">) {
  // `price` is the current offer price (no extra discount is applied on top).
  // If a promo window is defined and we're outside it, fall back to the regular price.
  const now = Date.now();
  const hasWindow = Boolean(p.promoStart || p.promoEnd);
  const inWindow = (!p.promoStart || +new Date(p.promoStart) <= now) && (!p.promoEnd || +new Date(p.promoEnd) >= now);
  if (hasWindow && !inWindow && p.regularPrice) return { price: p.regularPrice, original: undefined };
  const showOriginal = p.showRegularPrice && p.regularPrice && p.regularPrice > p.price;
  return { price: p.price, original: showOriginal ? p.regularPrice : undefined };
}
