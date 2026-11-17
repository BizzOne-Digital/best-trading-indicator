import "server-only";
import { revalidateTag } from "next/cache";
import type { Model } from "mongoose";
import * as Models from "./models";
import { CONTENT_TAG } from "./content";
import type { ResourceDef } from "./admin-resources";
import { RESOURCES } from "./admin-resources";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function modelFor(def: ResourceDef): Model<any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (Models as any)[def.model];
}

const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 90);
const SAFE_URL = /^(\/(?!\/)|https:\/\/)/; // site-relative path (e.g. /api/uploads/…, /01_hero.png) or https

/** Whitelists + coerces input according to the resource's field definitions. */
export function sanitize(def: ResourceDef, input: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const f of def.fields) {
    if (f.type === "readonly" || !(f.name in input)) continue;
    const v = input[f.name];
    switch (f.type) {
      case "number": out[f.name] = v === "" || v == null ? undefined : Number(v); if (Number.isNaN(out[f.name])) throw new Error(`${f.label} must be a number`); break;
      case "boolean": out[f.name] = Boolean(v); break;
      case "date": out[f.name] = v ? new Date(String(v)) : null; break;
      case "list": out[f.name] = (Array.isArray(v) ? v : String(v ?? "").split("\n")).map((x) => String(x).trim()).filter(Boolean).slice(0, 30); break;
      case "select": if (v && f.options && !f.options.includes(String(v))) throw new Error(`Invalid ${f.label}`); out[f.name] = v ? String(v) : undefined; break;
      case "image": { const s = String(v ?? "").trim(); if (s && !SAFE_URL.test(s)) throw new Error(`${f.label} must be an uploaded image or https URL`); out[f.name] = s; break; }
      default: out[f.name] = String(v ?? "").slice(0, f.type === "markdown" ? 100_000 : 5000);
    }
    if (f.required && (out[f.name] === "" || out[f.name] == null)) throw new Error(`${f.label} is required`);
  }
  if (def.key === "blogs") {
    if (!out.slug && out.title) out.slug = slugify(String(out.title));
    else if (out.slug) out.slug = slugify(String(out.slug));
    if (out.published && !out.publishedAt) out.publishedAt = new Date();
  }
  if (def.key === "plans" && out.slug) out.slug = slugify(String(out.slug));
  return out;
}

/** Make sure default editable content exists so the admin can edit it before any public visit. */
export async function ensureSeeded() {
  const { DEFAULT_FAQS, DEFAULT_FEATURES, DEFAULT_LEGAL, DEFAULT_PLANS } = await import("./defaults");
  const pairs: [Model<unknown>, object[]][] = [
    [Models.Feature, DEFAULT_FEATURES.map((f, i) => ({ ...f, order: i }))], [Models.PricingPlan, DEFAULT_PLANS],
    [Models.FAQ, DEFAULT_FAQS], [Models.LegalPage, DEFAULT_LEGAL],
  ];
  for (const [M, docs] of pairs) if ((await M.estimatedDocumentCount()) === 0) await M.insertMany(docs).catch(() => {});
}

export function refreshContent() {
  revalidateTag(CONTENT_TAG);
}

/** Delete an uploaded image if no content document references it anymore. */
export async function cleanupUpload(url?: string) {
  if (!url || !url.startsWith("/api/uploads/")) return;
  const [, , , folder, filename] = url.split("/");
  const settings = await Models.SiteSettings.findOne({ key: "main" }).lean();
  if (JSON.stringify(settings ?? {}).includes(url)) return;
  for (const def of Object.values(RESOURCES)) {
    const imgFields = def.fields.filter((f) => f.type === "image" || f.type === "markdown").map((f) => f.name);
    if (!imgFields.length) continue;
    const q = { $or: imgFields.map((n) => ({ [n]: { $regex: url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") } })) };
    if (await modelFor(def).exists(q)) return;
  }
  await Models.StoredUpload.deleteOne({ folder, filename });
}

export function imageValues(def: ResourceDef, doc: Record<string, unknown> | null) {
  if (!doc) return [];
  return def.fields.filter((f) => f.type === "image").map((f) => doc[f.name] as string).filter(Boolean);
}
