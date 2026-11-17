import { connectDB, hasDb } from "@/lib/db";
import { Customer } from "@/lib/models";
import { email as emailSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/ratelimit";
import { siteUrl, stripe } from "@/lib/stripe";
import { sendMail } from "@/lib/mail";

export const runtime = "nodejs";

/** Emails a one-time Stripe billing-portal link to the customer (never returned in the response,
 *  so knowing someone's email is not enough to manage their subscription). */
export async function POST(req: Request) {
  if (!hasDb() || !process.env.STRIPE_SECRET_KEY) return Response.json({ error: "generic" }, { status: 503 });
  const parsed = emailSchema.safeParse((await req.json().catch(() => ({})))?.email);
  if (!parsed.success) return Response.json({ error: "email" }, { status: 400 });
  try {
    await connectDB();
    if (!(await rateLimit("portal", 5, 900))) return Response.json({ error: "rate" }, { status: 429 });
    const c = await Customer.findOne({ email: parsed.data });
    if (c?.stripeCustomerId) {
      const s = await stripe().billingPortal.sessions.create({ customer: c.stripeCustomerId, return_url: `${siteUrl()}/subscription-help` });
      await sendMail(c.email, "Your BTI billing portal link", [
        `Hi ${c.firstName},`, "Use this secure link to view invoices, update your card or cancel your subscription:", s.url,
        "The link expires shortly. If you did not request it, you can ignore this email.",
      ]);
    }
    return Response.json({ ok: true }); // same response whether or not the email exists
  } catch (e) {
    console.error("portal failed", e);
    return Response.json({ error: "generic" }, { status: 500 });
  }
}
