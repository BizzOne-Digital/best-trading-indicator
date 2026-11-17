import type { Metadata } from "next";
import { Container, PageHero } from "@/components/Section";
import PortalForm from "@/components/forms/PortalForm";
import { getDict } from "@/lib/content";

export const metadata: Metadata = {
  title: "Subscription Help",
  description: "Manage your BTI subscription: invoices, payment method updates and cancellation through the secure Stripe billing portal.",
  alternates: { canonical: "/subscription-help" },
};

export default async function SubscriptionHelp() {
  const { t } = await getDict();
  return (
    <>
      <PageHero eyebrow={t.footer.support} title="Manage Your Subscription" sub="Update your card, download invoices or cancel renewal through Stripe's secure billing portal." />
      <Container className="grid max-w-5xl gap-8 pb-20 md:grid-cols-2">
        <div className="rounded-3xl border border-line bg-card p-7">
          <h2 className="text-xl font-bold">Get your billing portal link</h2>
          <p className="mt-2 text-sm text-muted">Enter the email you used at checkout. If it matches a BTI customer, we will email you a secure one-time link.</p>
          <div className="mt-5"><PortalForm t={t} /></div>
        </div>
        <div className="space-y-4 text-sm text-muted">
          {[
            ["Cancelling", "Cancelling stops future renewals. Your access stays active until the end of the period you already paid for."],
            ["Failed payments", "If a renewal fails, Stripe retries automatically. Update your card in the portal to avoid interruption."],
            ["Lifetime access", "Lifetime purchases are one-time payments and have no renewals to manage."],
            ["Changing TradingView username", "Contact us with your old and new username; we will update your invite-only access."],
          ].map(([h, p]) => (
            <div key={h} className="rounded-2xl border border-line bg-bg2 p-5"><h3 className="font-semibold text-fg">{h}</h3><p className="mt-1">{p}</p></div>
          ))}
        </div>
      </Container>
    </>
  );
}
