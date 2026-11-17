import { requireAdminApi, audit } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { SiteSettings } from "@/lib/models";
import { SETTINGS_TABS } from "@/lib/admin-resources";
import { DEFAULT_SETTINGS } from "@/lib/defaults";
import { cleanupUpload, refreshContent } from "@/lib/admin-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FIELDS = Object.values(SETTINGS_TABS).flatMap((t) => t.fields);

export async function GET(req: Request) {
  const auth = await requireAdminApi(req);
  if ("error" in auth) return auth.error;
  await connectDB();
  const doc = await SiteSettings.findOne({ key: "main" }).lean<{ data: object }>();
  return Response.json({ data: { ...DEFAULT_SETTINGS, ...(doc?.data ?? {}) } }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(req: Request) {
  const auth = await requireAdminApi(req);
  if ("error" in auth) return auth.error;
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const set: Record<string, unknown> = {};
  for (const f of FIELDS) {
    if (!(f.name in body)) continue;
    const v = body[f.name];
    if (f.type === "boolean") set[`data.${f.name}`] = Boolean(v);
    else {
      const s = String(v ?? "").trim().slice(0, 5000);
      if ((f.type === "image" || /Url$/.test(f.name)) && s && !/^(\/(?!\/)|https:\/\/)/.test(s)) {
        return Response.json({ error: `${f.label} must be an https URL or uploaded image` }, { status: 400 });
      }
      if (f.name === "contactEmail" && s && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return Response.json({ error: "Invalid contact email" }, { status: 400 });
      set[`data.${f.name}`] = s;
    }
  }
  await connectDB();
  const before = await SiteSettings.findOne({ key: "main" }).lean<{ data?: Record<string, unknown> }>();
  await SiteSettings.updateOne({ key: "main" }, { $set: set }, { upsert: true });
  for (const f of FIELDS.filter((f) => f.type === "image")) {
    const old = before?.data?.[f.name] as string | undefined;
    if (old && set[`data.${f.name}`] !== undefined && set[`data.${f.name}`] !== old) await cleanupUpload(old);
  }
  await audit(auth.admin.email, "update", "settings", { fields: Object.keys(set) });
  refreshContent();
  return Response.json({ ok: true });
}
