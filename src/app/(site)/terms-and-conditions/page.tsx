import LegalView, { legalMeta } from "@/components/LegalView";

export const metadata = legalMeta("Terms and Conditions", "terms-and-conditions", "Terms governing use of the BTI TradingView indicator and subscriptions.");

export default function Page() {
  return <LegalView slug="terms-and-conditions" />;
}
