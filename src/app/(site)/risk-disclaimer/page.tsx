import LegalView, { legalMeta } from "@/components/LegalView";

export const metadata = legalMeta("Trading Risk Disclaimer", "risk-disclaimer", "Trading involves substantial risk. BTI is an analytical tool and does not guarantee profits.");

export default function Page() {
  return <LegalView slug="risk-disclaimer" />;
}
