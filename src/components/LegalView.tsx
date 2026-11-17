import { notFound } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Container, PageHero } from "./Section";
import { getLegal } from "@/lib/content";
import { markdownToHtml } from "@/lib/markdown";

export default async function LegalView({ slug }: { slug: string }) {
  const page = await getLegal(slug);
  if (!page) notFound();
  return (
    <>
      <PageHero eyebrow="Legal" title={page.title} sub={page.updatedAt ? `Last updated ${new Date(page.updatedAt).toLocaleDateString("en-US", { dateStyle: "long" })}` : undefined} />
      <Container className="max-w-3xl pb-20">
        {!page.approved && (
          <p className="mb-8 flex gap-2 rounded-xl border border-yellow-500/40 bg-yellow-500/10 p-4 text-sm text-yellow-200">
            <AlertTriangle className="h-5 w-5 shrink-0" /> This document is a draft pending client legal review.
          </p>
        )}
        <div className="prose-bti" dangerouslySetInnerHTML={{ __html: markdownToHtml(page.content.replace(/^> Draft[^\n]*\n+/, "")) }} />
      </Container>
    </>
  );
}

export const legalMeta = (title: string, slug: string, description: string) => ({ title, description, alternates: { canonical: `/${slug}` } });
