import { headers } from "next/headers";
import { connectDB } from "./db";
import { RateLimit } from "./models";

export async function clientIp() {
  const h = await headers();
  return (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "unknown").trim();
}

/** DB-backed fixed-window limiter (works across serverless instances). Returns true if allowed. */
export async function rateLimit(bucket: string, limit: number, windowSec: number) {
  await connectDB();
  const ip = await clientIp();
  const win = Math.floor(Date.now() / (windowSec * 1000));
  const key = `${bucket}:${ip}:${win}`;
  const doc = await RateLimit.findOneAndUpdate(
    { key },
    { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((win + 1) * windowSec * 1000) } },
    { upsert: true, new: true },
  );
  return doc.count <= limit;
}
