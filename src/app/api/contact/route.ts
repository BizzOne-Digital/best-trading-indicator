import { connectDB, hasDb } from "@/lib/db";
import { ContactInquiry } from "@/lib/models";
import { contactSchema, fieldErrors } from "@/lib/validation";
import { rateLimit } from "@/lib/ratelimit";
import { ADMIN_EMAIL, sendMail } from "@/lib/mail";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!hasDb()) return Response.json({ error: "generic" }, { status: 503 });
  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "required", fields: fieldErrors(parsed.error) }, { status: 400 });
  if (parsed.data.website) return Response.json({ ok: true }); // honeypot hit: pretend success, store nothing

  try {
    await connectDB();
    if (!(await rateLimit("contact", 5, 600))) return Response.json({ error: "rate" }, { status: 429 });
    const { website: _hp, ...data } = parsed.data;
    void _hp;
    const doc = await ContactInquiry.create(data);
    // Stored first; only then do we report success. Email is best-effort.
    await sendMail(ADMIN_EMAIL, `New BTI inquiry from ${data.firstName} ${data.lastName}`, [
      `Name: ${data.firstName} ${data.lastName}`, `Email: ${data.email}`, `TradingView: ${data.tradingViewUsername}`,
      `Subject: ${data.subject || "-"}`, `Plan interest: ${data.planInterest || "-"}`, "", data.message, "", `Inquiry ID: ${doc._id}`,
    ]);
    return Response.json({ ok: true });
  } catch (e) {
    console.error("contact failed", e);
    return Response.json({ error: "generic" }, { status: 500 });
  }
}
