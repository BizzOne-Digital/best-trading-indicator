import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, Mail } from "lucide-react";
import { Container } from "@/components/Section";
import { connectDB, hasDb } from "@/lib/db";
import { Order } from "@/lib/models";
import { stripe } from "@/lib/stripe";

export const metadata: Metadata = { title: "Payment received", robots: { index: false } };
export const dynamic = "force-dynamic";

async function lookup(sessionId?: string) {
  if (!sessionId || !/^cs_[A-Za-z0-9_]+$/.test(sessionId) || !hasDb() || !process.env.STRIPE_SECRET_KEY) return null;
  try {
    const session = await stripe().checkout.sessions.retrieve(sessionId);
    await connectDB();
    const order = await Order.findOne({ stripeSessionId: sessionId }).lean<{ status: string; planName: string; tradingViewUsername: string }>();
    return { paid: session.payment_status === "paid", confirmed: order?.status === "paid", plan: order?.planName, tv: order?.tradingViewUsername, isSub: session.mode === "subscription" };
  } catch {
    return null;
  }
}

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const info = await lookup((await searchParams).session_id);
  return (
    <section className="pb-20 pt-36">
      <Container className="max-w-2xl text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-accent" />
        <h1 className="mt-5 text-3xl font-extrabold sm:text-4xl">{info?.paid ? "Thank you — payment received" : "Thank you for your order"}</h1>
        <p className="mt-3 text-lg text-muted">
          {info?.confirmed
            ? `Your ${info.plan} purchase is confirmed.`
            : "We are confirming your payment with Stripe. This usually takes a few seconds — a confirmation email will follow."}
        </p>
        <div className="mt-8 space-y-3 rounded-2xl border border-line bg-card p-6 text-left">
          <p className="flex gap-3"><Clock className="h-5 w-5 shrink-0 text-accent" /><span><strong>TradingView access: pending.</strong> Our team will manually add {info?.tv ? <code className="rounded bg-bg2 px-1.5 font-mono text-accent">{info.tv}</code> : "your TradingView username"} to the BTI invite-only script, usually within one business day. Access is not active until we confirm it by email.</span></p>
          <p className="flex gap-3"><Mail className="h-5 w-5 shrink-0 text-accent" /><span>Check your inbox for the receipt. If your TradingView username is wrong, <Link href="/contact" className="text-accent underline">contact us</Link> right away.</span></p>
          {info?.isSub && <p className="text-sm text-muted">Manage or cancel your subscription anytime from <Link href="/subscription-help" className="text-accent underline">Subscription Help</Link>.</p>}
        </div>
        <Link href="/" className="btn-primary mt-8 inline-flex rounded-xl px-7 py-3 font-bold">Back to home</Link>
      </Container>
    </section>
  );
}
