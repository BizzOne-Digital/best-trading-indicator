import crypto from "crypto";
import { requireAdminApi, audit } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { StoredUpload } from "@/lib/models";

export const runtime = "nodejs";

const UPLOAD_FOLDERS = ["products", "gallery", "pages", "misc"] as const;
const TYPES: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif" };
const MAX = 8 * 1024 * 1024;

// Verify magic bytes so a renamed file can't masquerade as an image.
function sniff(b: Buffer) {
  if (b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b.subarray(0, 4).toString() === "RIFF" && b.subarray(8, 12).toString() === "WEBP") return "image/webp";
  if (b.subarray(0, 4).toString() === "GIF8") return "image/gif";
  return null;
}

export async function POST(req: Request) {
  const auth = await requireAdminApi(req);
  if ("error" in auth) return auth.error;
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  const folder = String(form?.get("folder") ?? "misc");
  if (!(file instanceof File)) return Response.json({ error: "No file provided" }, { status: 400 });
  if (!UPLOAD_FOLDERS.includes(folder as (typeof UPLOAD_FOLDERS)[number])) return Response.json({ error: "Invalid folder" }, { status: 400 });
  if (!TYPES[file.type]) return Response.json({ error: "Only PNG, JPEG, WEBP or GIF images are allowed" }, { status: 400 });
  if (file.size > MAX) return Response.json({ error: "Image must be 8 MB or smaller" }, { status: 400 });

  const data = Buffer.from(await file.arrayBuffer());
  const real = sniff(data);
  if (!real || real !== file.type) return Response.json({ error: "File content does not match its image type" }, { status: 400 });

  const base = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "image";
  const filename = `${base}-${Date.now().toString(36)}-${crypto.randomBytes(4).toString("hex")}.${TYPES[real]}`;
  await connectDB();
  await StoredUpload.create({ folder, filename, mimeType: real, size: data.length, data });
  await audit(auth.admin.email, "upload", `${folder}/${filename}`, { size: data.length });
  return Response.json({ url: `/api/uploads/${folder}/${filename}` });
}
