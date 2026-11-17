import { isValidObjectId } from "mongoose";
import { requireAdminApi, audit } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { RESOURCES } from "@/lib/admin-resources";
import { cleanupUpload, imageValues, modelFor, refreshContent, sanitize } from "@/lib/admin-server";
import { Customer } from "@/lib/models";
import { sendMail } from "@/lib/mail";

export const runtime = "nodejs";
type Ctx = { params: Promise<{ resource: string; id: string }> };

async function resolve(req: Request, ctx: Ctx) {
  const auth = await requireAdminApi(req);
  if ("error" in auth) return { error: auth.error };
  const { resource, id } = await ctx.params;
  const def = RESOURCES[resource];
  if (!def || !isValidObjectId(id)) return { error: Response.json({ error: "Not found" }, { status: 404 }) };
  await connectDB();
  return { def, id, admin: auth.admin };
}

export async function PATCH(req: Request, ctx: Ctx) {
  const r = await resolve(req, ctx);
  if ("error" in r) return r.error;
  const { def, id, admin } = r;
  try {
    const M = modelFor(def);
    const before = await M.findById(id).lean<Record<string, unknown>>();
    if (!before) return Response.json({ error: "Not found" }, { status: 404 });
    const data = sanitize(def, await req.json());

    if (def.key === "access") {
      data.attention = "";
      if (data.status === "granted" && before.status !== "granted") data.grantedAt = new Date();
      if (data.status === "revoked" && before.status !== "revoked") data.revokedAt = new Date();
    }
    const item = await M.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
    await audit(admin.email, "update", `${def.key}:${id}`, def.key === "access" || def.key === "plans" ? data : { fields: Object.keys(data) });

    // Notify customer when access is granted.
    if (def.key === "access" && data.status === "granted" && before.status !== "granted") {
      const c = await Customer.findById(item.customer).lean<{ email: string; firstName: string }>();
      if (c) await sendMail(c.email, "Your BTI TradingView access is active", [
        `Hi ${c.firstName},`, `Your TradingView account "${item.tradingViewUsername}" now has access to the BTI invite-only script.`,
        "In TradingView, open Indicators → Invite-only scripts and add BTI to your chart.",
        "Trading involves substantial risk. BTI is an analytical tool and does not guarantee profits.",
      ]);
    }
    for (const old of imageValues(def, before)) if (!imageValues(def, item?.toObject()).includes(old)) await cleanupUpload(old);
    refreshContent();
    return Response.json({ item });
  } catch (e) {
    const msg = (e as { code?: number }).code === 11000 ? "An item with this slug already exists" : (e as Error).message;
    return Response.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(req: Request, ctx: Ctx) {
  const r = await resolve(req, ctx);
  if ("error" in r) return r.error;
  const { def, id, admin } = r;
  if (!def.remove) return Response.json({ error: "Not allowed" }, { status: 405 });
  const doc = await modelFor(def).findByIdAndDelete(id).lean<Record<string, unknown>>();
  if (doc) for (const u of imageValues(def, doc)) await cleanupUpload(u);
  await audit(admin.email, "delete", `${def.key}:${id}`);
  refreshContent();
  return Response.json({ ok: true });
}
