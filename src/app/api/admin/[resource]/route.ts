import { requireAdminApi, audit } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { RESOURCES } from "@/lib/admin-resources";
import { modelFor, refreshContent, sanitize } from "@/lib/admin-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ resource: string }> };
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function GET(req: Request, { params }: Ctx) {
  const auth = await requireAdminApi(req);
  if ("error" in auth) return auth.error;
  const def = RESOURCES[(await params).resource];
  if (!def) return Response.json({ error: "Unknown resource" }, { status: 404 });
  await connectDB();
  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const limit = Math.min(100, Number(url.searchParams.get("limit")) || 25);
  const q = url.searchParams.get("q")?.trim().slice(0, 80);
  const status = url.searchParams.get("status");
  const filter: Record<string, unknown> = {};
  if (q && def.search) filter.$or = def.search.map((f) => ({ [f]: { $regex: esc(q), $options: "i" } }));
  if (status) filter.status = status;
  const M = modelFor(def);
  let query = M.find(filter).sort(def.sort).skip((page - 1) * limit).limit(limit);
  if (def.populate) query = query.populate(def.populate.split(" ").map((p) => ({ path: p, select: p === "customer" ? "firstName lastName email tradingViewUsername" : "planName amount status createdAt" })));
  const [items, total] = await Promise.all([query.lean(), M.countDocuments(filter)]);
  return Response.json({ items, total, page, pages: Math.max(1, Math.ceil(total / limit)) }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request, { params }: Ctx) {
  const auth = await requireAdminApi(req);
  if ("error" in auth) return auth.error;
  const def = RESOURCES[(await params).resource];
  if (!def?.create) return Response.json({ error: "Not allowed" }, { status: 405 });
  try {
    await connectDB();
    const data = sanitize(def, await req.json());
    const doc = await modelFor(def).create(data);
    await audit(auth.admin.email, "create", `${def.key}:${doc._id}`);
    refreshContent();
    return Response.json({ item: doc });
  } catch (e) {
    const msg = (e as { code?: number }).code === 11000 ? "An item with this slug already exists" : (e as Error).message;
    return Response.json({ error: msg }, { status: 400 });
  }
}
