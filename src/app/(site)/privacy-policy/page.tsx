import LegalView, { legalMeta } from "@/components/LegalView";

export const metadata = legalMeta("Privacy Policy", "privacy-policy", "How BTI – Best Trading Indicator collects, uses and protects your personal data.");

export default function Page() {
  return <LegalView slug="privacy-policy" />;
}
