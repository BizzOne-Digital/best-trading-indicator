import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "@/components/Section";
import ShareButtons from "@/components/ShareButtons";
import { getDict, getPost, getPosts, readingTime } from "@/lib/content";
import { markdownToHtml } from "@/lib/markdown";
import { siteUrl } from "@/lib/site";
import { DEFAULT_BLOG_COVER } from "@/lib/defaults";

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const p = await getPost((await params).slug);
  if (!p) return { title: "Article not found" };
  return {
    title: p.seoTitle || p.title,
    description: p.seoDescription || p.excerpt,
    alternates: { canonical: `/blogs/${p.slug}` },
    openGraph: { type: "article", title: p.seoTitle || p.title, description: p.seoDescription || p.excerpt, images: p.coverImage ? [p.coverImage] : undefined, publishedTime: p.publishedAt },
  };
}

export default async function BlogPostPage({ params }: P) {
  const { slug } = await params;
  const [{ t }, post, all] = await Promise.all([getDict(), getPost(slug), getPosts()]);
  if (!post) notFound();
  const related = all.filter((p) => p.slug !== slug && p.category === post.category).slice(0, 3);
  const url = `${siteUrl()}/blogs/${slug}`;
  const ld = {
    "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.excerpt,
    image: post.coverImage || undefined, datePublished: post.publishedAt, dateModified: post.updatedAt,
    author: { "@type": "Organization", name: post.author || "BTI Team" }, publisher: { "@type": "Organization", name: "BTI – Best Trading Indicator" }, mainEntityOfPage: url,
  };
  return (
    <article className="pb-20 pt-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Container className="max-w-3xl">
        <Link href="/blogs" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent"><ArrowLeft className="h-4 w-4" /> {t.nav.blogs}</Link>
        <span className="mt-6 block text-xs font-bold uppercase tracking-wider text-accent">{post.category}</span>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-5xl">{post.title}</h1>
        <p className="mt-4 text-sm text-muted">
          {post.author} · {post.publishedAt && new Date(post.publishedAt).toLocaleDateString("en-US", { dateStyle: "long" })} · {readingTime(post.content)} {t.blog.min}
        </p>
      </Container>
      <Container className="mt-8 max-w-5xl">
        <div className="relative aspect-[16/8] overflow-hidden rounded-3xl border border-line">
          <Image src={post.coverImage || DEFAULT_BLOG_COVER} alt={post.title} fill priority sizes="(min-width:1024px) 1024px, 100vw" className="object-cover" />
        </div>
      </Container>
      <Container className="mt-10 max-w-3xl">
        <div className="prose-bti" dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }} />
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <ShareButtons url={url} title={post.title} label={t.blog.share} />
          <Link href="/pricing" className="btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold">{t.cta.access} <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </Container>
      {related.length > 0 && (
        <Container className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">{t.blog.related}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((p) => (
              <Link key={p._id} href={`/blogs/${p.slug}`} className="card-hover rounded-2xl border border-line bg-card p-5">
                <span className="text-xs font-bold uppercase text-accent">{p.category}</span>
                <h3 className="mt-2 font-bold">{p.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </Container>
      )}
    </article>
  );
}
