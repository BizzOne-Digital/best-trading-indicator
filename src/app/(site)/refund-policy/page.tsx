import LegalView, { legalMeta } from "@/components/LegalView";

export const metadata = legalMeta("Refund & Cancellation Policy", "refund-policy", "How cancellations, refunds and failed payments work for BTI subscriptions and lifetime access.");

export default function Page() {
  return <LegalView slug="refund-policy" />;
}
