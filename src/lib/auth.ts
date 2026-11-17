import "server-only";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";
import { connectDB } from "./db";
import { AdminSession, AdminUser, AuditLog } from "./models";

export const SESSION_COOKIE = "bti_admin";
const TTL_MS = 1000 * 60 * 60 * 12;

const hash = (t: string) => crypto.createHash("sha256").update(t).digest("hex");

export async function ensureBootstrapAdmin() {
  await connectDB();
  const count = await AdminUser.countDocuments();
  const email = process.env.ADMIN_EMAIL, pw = process.env.ADMIN_PASSWORD;
  if (count === 0 && email && pw && pw.length >= 8) {
    await AdminUser.create({ email, name: "Owner", passwordHash: await bcrypt.hash(pw, 12) });
  }
}

export async function login(email: string, password: string) {
  await ensureBootstrapAdmin();
  const user = await AdminUser.findOne({ email: email.toLowerCase().trim() });
  const ok = user ? await bcrypt.compare(password, user.passwordHash) : await bcrypt.compare(password, "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinv");
  if (!user || !ok) return null;
  const token = crypto.randomBytes(32).toString("hex");
  await AdminSession.create({ tokenHash: hash(token), admin: user._id, expiresAt: new Date(Date.now() + TTL_MS) });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: TTL_MS / 1000,
  });
  await audit(user.email, "login", "admin");
  return user;
}

export async function logout() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    await connectDB();
    await AdminSession.deleteOne({ tokenHash: hash(token) });
  }
  jar.delete(SESSION_COOKIE);
}

export async function getAdmin(): Promise<{ id: string; email: string; name?: string } | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    await connectDB();
    const s = await AdminSession.findOne({ tokenHash: hash(token), expiresAt: { $gt: new Date() } }).populate("admin").lean<{ admin: { _id: unknown; email: string; name?: string } }>();
    if (!s?.admin) return null;
    return { id: String(s.admin._id), email: s.admin.email, name: s.admin.name };
  } catch {
    return null;
  }
}

/** For admin route handlers: auth + same-origin (CSRF) check. Returns admin or a Response. */
export async function requireAdminApi(req: Request, mutating = req.method !== "GET") {
  if (mutating) {
    const h = await headers();
    const origin = h.get("origin");
    const host = h.get("x-forwarded-host") ?? h.get("host");
    if (!origin || !host || new URL(origin).host !== host) {
      return { error: Response.json({ error: "Invalid origin" }, { status: 403 }) };
    }
  }
  const admin = await getAdmin();
  if (!admin) return { error: Response.json({ error: "Unauthorized" }, { status: 401 }) };
  return { admin };
}

export async function audit(admin: string, action: string, target: string, meta?: unknown) {
  try {
    await AuditLog.create({ admin, action, target, meta });
  } catch (e) {
    console.error("audit log failed", e);
  }
}
