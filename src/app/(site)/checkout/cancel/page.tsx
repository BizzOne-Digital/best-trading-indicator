import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { Container } from "@/components/Section";

export const metadata: Metadata = { title: "Payment canceled", robots: { index: false } };

export default async function CancelPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const plan = (await searchParams).plan;
  return (
    <section className="pb-20 pt-36">
      <Container className="max-w-xl text-center">
        <XCircle className="mx-auto h-16 w-16 text-muted" />
        <h1 className="mt-5 text-3xl font-extrabold">Payment canceled</h1>
        <p className="mt-3 text-muted">No payment was taken. You can return to checkout whenever you are ready, or contact us if you have questions.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={plan ? `/checkout?plan=${encodeURIComponent(plan)}` : "/pricing"} className="btn-primary rounded-xl px-7 py-3 font-bold">Try again</Link>
          <Link href="/contact" className="btn-ghost rounded-xl px-7 py-3 font-semibold">Contact support</Link>
        </div>
      </Container>
    </section>
  );
}
