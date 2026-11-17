import type Stripe from "stripe";
import { connectDB, hasDb } from "@/lib/db";
import { Customer, Order, PricingPlan } from "@/lib/models";
import { checkoutSchema, fieldErrors } from "@/lib/validation";
import { rateLimit } from "@/lib/ratelimit";
import { siteUrl, stripe } from "@/lib/stripe";
import { effectivePrice } from "@/lib/content";
import { DEFAULT_PLANS } from "@/lib/defaults";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!hasDb() || !process.env.STRIPE_SECRET_KEY) {
    return Response.json({ error: "generic", message: "Checkout is not configured yet. Please contact support." }, { status: 503 });
  }
  const parsed = checkoutSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "required", fields: fieldErrors(parsed.error) }, { status: 400 });
  const d = parsed.data;

  try {
    await connectDB();
    if (!(await rateLimit("checkout", 10, 600))) return Response.json({ error: "rate" }, { status: 429 });

    if ((await PricingPlan.estimatedDocumentCount()) === 0) await PricingPlan.insertMany(DEFAULT_PLANS).catch(() => {});
    const plan = await PricingPlan.findOne({ slug: d.plan, visible: true }).lean<{ slug: string; name: string; interval: "month" | "year" | "lifetime"; price: number; regularPrice?: number; showRegularPrice?: boolean; promoStart?: string; promoEnd?: string; stripePriceId?: string }>();
    if (!plan) return Response.json({ error: "generic", message: "This plan is not available." }, { status: 400 });
    const { price } = effectivePrice(plan);
    const amount = Math.round(price * 100);

    const customer = await Customer.findOneAndUpdate(
      { email: d.email },
      { $set: { firstName: d.firstName, lastName: d.lastName, tradingViewUsername: d.tradingViewUsername } },
      { upsert: true, new: true },
    );
    const order = await Order.create({
      customer: customer._id, plan: plan.slug, planName: plan.name, interval: plan.interval,
      amount: price, tradingViewUsername: d.tradingViewUsername, status: "pending",
    });

    const recurring = plan.interval !== "lifetime";
    const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = plan.stripePriceId
      ? { price: plan.stripePriceId, quantity: 1 }
      : {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amount,
            product_data: { name: `BTI – Best Trading Indicator (${plan.name})`, description: "TradingView invite-only indicator access" },
            ...(recurring && { recurring: { interval: plan.interval as "month" | "year" } }),
          },
        };

    const meta = { orderId: String(order._id), customerId: String(customer._id), plan: plan.slug, tradingViewUsername: d.tradingViewUsername };
    const params: Stripe.Checkout.SessionCreateParams = {
      mode: recurring ? "subscription" : "payment",
      line_items: [lineItem],
      client_reference_id: String(order._id),
      metadata: meta,
      success_url: `${siteUrl()}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl()}/checkout/cancel?plan=${plan.slug}`,
      allow_promotion_codes: false,
      ...(customer.stripeCustomerId ? { customer: customer.stripeCustomerId } : { customer_email: d.email }),
      ...(recurring
        ? { subscription_data: { metadata: meta } }
        : { payment_intent_data: { metadata: meta }, customer_creation: customer.stripeCustomerId ? undefined : "always" }),
    };
    // Card + wallets (Google Pay / Apple Pay) are offered automatically when enabled in the Stripe Dashboard.
    const session = await stripe().checkout.sessions.create(params, { idempotencyKey: `order-${order._id}` });
    order.stripeSessionId = session.id;
    await order.save();
    return Response.json({ url: session.url });
  } catch (e) {
    console.error("checkout failed", e);
    return Response.json({ error: "generic" }, { status: 500 });
  }
}
