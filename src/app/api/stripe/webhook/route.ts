import type Stripe from "stripe";
import { connectDB } from "@/lib/db";
import { Customer, Order, PaymentEvent, Subscription, TradingViewAccess } from "@/lib/models";
import { stripe } from "@/lib/stripe";
import { ADMIN_EMAIL, sendMail } from "@/lib/mail";

export const runtime = "nodejs";

/* eslint-disable @typescript-eslint/no-explicit-any */
const idOf = (v: unknown) => (typeof v === "string" ? v : (v as { id?: string } | null)?.id);
const periodEnd = (s: any) => {
  const ts = s.current_period_end ?? s.items?.data?.[0]?.current_period_end;
  return ts ? new Date(ts * 1000) : undefined;
};
const invoiceSub = (inv: any) => idOf(inv.subscription) ?? idOf(inv.parent?.subscription_details?.subscription);

async function fulfil(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") return; // async methods finish later
  const orderId = session.metadata?.orderId ?? session.client_reference_id;
  const order = await Order.findById(orderId);
  if (!order) throw new Error(`Order ${orderId} not found for session ${session.id}`);

  const stripeCustomerId = idOf(session.customer);
  const subId = idOf(session.subscription);
  const wasPaid = order.status === "paid";
  order.status = "paid";
  order.paidAt ??= new Date();
  order.stripeSessionId = session.id;
  order.stripePaymentIntentId = idOf(session.payment_intent) ?? order.stripePaymentIntentId;
  order.stripeSubscriptionId = subId ?? order.stripeSubscriptionId;
  await order.save();

  const customer = await Customer.findById(order.customer);
  if (customer && stripeCustomerId && customer.stripeCustomerId !== stripeCustomerId) {
    customer.stripeCustomerId = stripeCustomerId;
    await customer.save();
  }

  if (subId) {
    const sub: any = await stripe().subscriptions.retrieve(subId);
    await Subscription.findOneAndUpdate(
      { stripeSubscriptionId: subId },
      {
        $set: { customer: order.customer, order: order._id, plan: order.plan, status: sub.status, currentPeriodEnd: periodEnd(sub), cancelAtPeriodEnd: sub.cancel_at_period_end },
        $setOnInsert: { history: [{ date: new Date(), event: "started", amount: order.amount }] },
      },
      { upsert: true },
    );
  }

  await TradingViewAccess.findOneAndUpdate(
    { order: order._id },
    { $setOnInsert: { customer: order.customer, tradingViewUsername: order.tradingViewUsername, plan: order.plan, status: "pending" } },
    { upsert: true },
  );

  if (!wasPaid) {
    const name = customer ? `${customer.firstName} ${customer.lastName}` : "Customer";
    await sendMail(ADMIN_EMAIL, `New BTI ${order.planName} purchase – grant TradingView access`, [
      `Customer: ${name} (${customer?.email})`, `TradingView username: ${order.tradingViewUsername}`, `Plan: ${order.planName} – $${order.amount}`,
      "Action: add this username to the invite-only script, then mark access as Granted in /admin/access.",
    ]);
    if (customer?.email) {
      await sendMail(customer.email, "Your BTI payment is confirmed", [
        `Hi ${customer.firstName},`,
        `Thank you for purchasing BTI ${order.planName}. Your payment has been confirmed.`,
        `Our team will add your TradingView username "${order.tradingViewUsername}" to the BTI invite-only script, usually within one business day. We will email you once access is granted.`,
        "If your username is incorrect, reply to this email right away.",
        "Trading involves substantial risk. BTI is an analytical tool and does not guarantee profits.",
      ]);
    }
  }
}

async function onSubscriptionChange(sub: any, deleted = false) {
  const doc = await Subscription.findOneAndUpdate(
    { stripeSubscriptionId: sub.id },
    {
      $set: { status: deleted ? "canceled" : sub.status, currentPeriodEnd: periodEnd(sub), cancelAtPeriodEnd: sub.cancel_at_period_end },
      $push: { history: { date: new Date(), event: deleted ? "ended" : `status:${sub.status}${sub.cancel_at_period_end ? " (cancels at period end)" : ""}` } },
    },
    { new: true },
  );
  if (doc && (deleted || ["unpaid", "canceled", "incomplete_expired"].includes(sub.status))) {
    await TradingViewAccess.updateOne({ order: doc.order, status: "granted" }, { $set: { attention: "Subscription ended — revoke TradingView access" } });
    await Order.updateOne({ _id: doc.order, status: "paid" }, { $set: { status: "canceled" } });
  }
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  if (!secret || !sig) return new Response("Webhook not configured", { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(await req.text(), sig, secret);
  } catch (e) {
    console.error("webhook signature failed", (e as Error).message);
    return new Response("Invalid signature", { status: 400 });
  }

  await connectDB();
  try {
    await PaymentEvent.create({ eventId: event.id, type: event.type });
  } catch (e) {
    if ((e as { code?: number }).code === 11000) return Response.json({ received: true, duplicate: true });
    throw e;
  }

  try {
    const o: any = event.data.object;
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await fulfil(o);
        break;
      case "checkout.session.async_payment_failed":
      case "checkout.session.expired":
        await Order.updateOne({ stripeSessionId: o.id, status: "pending" }, { $set: { status: event.type.endsWith("expired") ? "canceled" : "failed" } });
        break;
      case "invoice.paid": {
        const subId = invoiceSub(o);
        if (subId) {
          const sub: any = await stripe().subscriptions.retrieve(subId);
          await Subscription.updateOne({ stripeSubscriptionId: subId }, {
            $set: { status: sub.status, currentPeriodEnd: periodEnd(sub) },
            $push: { history: { date: new Date(), event: o.billing_reason === "subscription_create" ? "first payment" : "renewal paid", amount: (o.amount_paid ?? 0) / 100 } },
          });
        }
        break;
      }
      case "invoice.payment_failed": {
        const subId = invoiceSub(o);
        if (subId) {
          const doc = await Subscription.findOneAndUpdate({ stripeSubscriptionId: subId }, { $set: { status: "past_due" }, $push: { history: { date: new Date(), event: "payment failed", amount: (o.amount_due ?? 0) / 100 } } });
          if (doc) await TradingViewAccess.updateOne({ order: doc.order }, { $set: { attention: "Renewal payment failed" } });
        }
        break;
      }
      case "customer.subscription.updated":
        await onSubscriptionChange(o);
        break;
      case "customer.subscription.deleted":
        await onSubscriptionChange(o, true);
        break;
      case "charge.refunded": {
        const pi = idOf(o.payment_intent);
        const full = o.amount_refunded >= o.amount;
        const order = pi ? await Order.findOne({ stripePaymentIntentId: pi }) : null;
        if (order && full) {
          order.status = "refunded";
          await order.save();
          await TradingViewAccess.updateOne({ order: order._id }, { $set: { attention: "Refunded — revoke TradingView access" } });
        } else if (!order) {
          console.warn(`charge.refunded: no order for payment_intent ${pi} (likely a subscription invoice) — review in Stripe`);
        }
        break;
      }
    }
    return Response.json({ received: true });
  } catch (e) {
    // Allow Stripe to retry: forget we saw this event.
    await PaymentEvent.deleteOne({ eventId: event.id }).catch(() => {});
    console.error(`webhook ${event.type} failed`, e);
    return new Response("Webhook handler error", { status: 500 });
  }
}
