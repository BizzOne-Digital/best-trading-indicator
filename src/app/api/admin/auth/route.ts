import { z } from "zod";
import { headers } from "next/headers";
import { login, logout } from "@/lib/auth";
import { connectDB, hasDb } from "@/lib/db";
import { rateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";

async function sameOrigin() {
  const h = await headers();
  const origin = h.get("origin");
  const host = h.get("x-forwarded-host") ?? h.get("host");
  return Boolean(origin && host && new URL(origin).host === host);
}

export async function POST(req: Request) {
  if (!(await sameOrigin())) return Response.json({ error: "Invalid origin" }, { status: 403 });
  if (!hasDb()) return Response.json({ error: "Database is not configured" }, { status: 503 });
  const p = z.object({ email: z.string().email().max(160), password: z.string().min(1).max(200) }).safeParse(await req.json().catch(() => null));
  if (!p.success) return Response.json({ error: "Enter your email and password" }, { status: 400 });
  await connectDB();
  if (!(await rateLimit("admin-login", 8, 900))) return Response.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  const user = await login(p.data.email, p.data.password);
  if (!user) return Response.json({ error: "Invalid email or password" }, { status: 401 });
  return Response.json({ ok: true });
}

export async function DELETE() {
  if (!(await sameOrigin())) return Response.json({ error: "Invalid origin" }, { status: 403 });
  await logout();
  return Response.json({ ok: true });
}
