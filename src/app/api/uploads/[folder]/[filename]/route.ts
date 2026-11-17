import { connectDB } from "@/lib/db";
import { StoredUpload } from "@/lib/models";

export const runtime = "nodejs";

const FOLDERS = new Set(["products", "gallery", "pages", "misc"]);
const NAME = /^[a-z0-9-]+\.(png|jpg|webp|gif)$/;

export async function GET(_req: Request, { params }: { params: Promise<{ folder: string; filename: string }> }) {
  const { folder, filename } = await params;
  if (!FOLDERS.has(folder) || !NAME.test(filename)) return new Response("Not found", { status: 404 });
  await connectDB();
  const doc = await StoredUpload.findOne({ folder, filename }).lean<{ data: { buffer: ArrayBuffer } | Buffer; mimeType: string; size: number }>();
  if (!doc) return new Response("Not found", { status: 404 });
  const raw = doc.data as unknown as { buffer?: Uint8Array } & Uint8Array;
  const body = Buffer.isBuffer(raw) ? raw : Buffer.from(raw.buffer ?? raw);
  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": doc.mimeType,
      "Content-Length": String(body.length),
      // Filenames are unique per upload, so the URL is immutable.
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
