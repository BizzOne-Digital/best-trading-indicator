import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { Container, PageHero } from "@/components/Section";
import { getDict, getPosts, readingTime, type Post } from "@/lib/content";
import { BLOG_CATEGORIES, DEFAULT_BLOG_COVER } from "@/lib/defaults";

export const metadata: Metadata = {
  title: "Blog – Trading Education",
  description: "Articles on market structure, technical analysis, risk management, trading psychology and TradingView guides from the BTI team.",
  alternates: { canonical: "/blogs" },
};

const PER = 9;
const date = (d?: string) => (d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "");

function Cover({ p, className }: { p: Post; className: string }) {
  return (
    <div className={`relative overflow-hidden bg-card ${className}`}>
<Image src={p.coverImage || DEFAULT_BLOG_COVER} alt={p.title} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
    </div>
  );
}

export default async function BlogsPage({ searchParams }: { searchParams: Promise<{ q?: string; cat?: string; page?: string }> }) {
  const sp = await searchParams;
  const [{ t }, all] = await Promise.all([getDict(), getPosts()]);
  const q = (sp.q ?? "").trim().toLowerCase();
  const cat = sp.cat ?? "";
  const filtered = all.filter((p) => (!cat || p.category === cat) && (!q || `${p.title} ${p.excerpt}`.toLowerCase().includes(q)));
  const featured = !q && !cat ? filtered.find((p) => p.featured) : undefined;
  const rest = filtered.filter((p) => p !== featured);
  const pages = Math.max(1, Math.ceil(rest.length / PER));
  const page = Math.min(pages, Math.max(1, Number(sp.page) || 1));
  const shown = rest.slice((page - 1) * PER, page * PER);
  const href = (o: Record<string, string | number>) => {
    const u = new URLSearchParams({ ...(q && { q }), ...(cat && { cat }), ...Object.fromEntries(Object.entries(o).map(([k, v]) => [k, String(v)])) });
    for (const [k, v] of [...u]) if (!v) u.delete(k);
    return `/blogs${u.size ? `?${u}` : ""}`;
  };

  return (
    <>
      <PageHero eyebrow={t.blog.eyebrow} title={t.blog.title} sub={t.blog.sub}>
        <form className="mx-auto mt-8 flex max-w-md items-center gap-2 rounded-xl border border-line bg-card px-3" role="search">
          <Search className="h-4 w-4 text-muted" />
          <label htmlFor="q" className="sr-only">{t.blog.search}</label>
          <input id="q" name="q" defaultValue={sp.q} placeholder={t.blog.search} className="w-full bg-transparent py-3 outline-none" />
          {cat && <input type="hidden" name="cat" value={cat} />}
        </form>
      </PageHero>
      <Container className="pb-20">
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {["", ...BLOG_CATEGORIES].map((c) => (
            <Link key={c} href={href({ cat: c, page: "" })} className={`rounded-full border px-4 py-1.5 text-sm ${cat === c ? "border-accent bg-accent/10 text-accent" : "border-line text-muted hover:text-white"}`}>{c || t.blog.all}</Link>
          ))}
        </div>

        {featured && (
          <Link href={`/blogs/${featured.slug}`} className="group mb-10 grid overflow-hidden rounded-3xl border border-line bg-card md:grid-cols-2">
            <Cover p={featured} className="aspect-[16/10] md:aspect-auto md:min-h-80" />
            <div className="flex flex-col justify-center p-8">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">{t.blog.featured} · {featured.category}</span>
              <h2 className="mt-3 text-2xl font-extrabold group-hover:text-accent sm:text-3xl">{featured.title}</h2>
              <p className="mt-3 text-muted">{featured.excerpt}</p>
              <span className="mt-4 text-sm text-muted">{featured.author} · {date(featured.publishedAt)}</span>
            </div>
          </Link>
        )}

        {shown.length === 0 && !featured ? (
          <p className="py-16 text-center text-muted">{t.blog.empty}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p) => (
              <Link key={p._id} href={`/blogs/${p.slug}`} className="card-hover group flex flex-col overflow-hidden rounded-2xl border border-line bg-card">
                <Cover p={p} className="aspect-[16/10]" />
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">{p.category}</span>
                  <h3 className="mt-2 text-lg font-bold group-hover:text-accent">{p.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-muted">{p.excerpt}</p>
                  <span className="mt-auto pt-4 text-xs text-muted">{p.author} · {date(p.publishedAt)} · {readingTime(p.excerpt)}+ {t.blog.min}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {pages > 1 && (
          <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
            {page > 1 && <Link href={href({ page: page - 1 })} className="rounded-lg border border-line px-4 py-2 text-sm">{t.blog.prev}</Link>}
            {Array.from({ length: pages }, (_, i) => (
              <Link key={i} href={href({ page: i + 1 })} aria-current={page === i + 1 ? "page" : undefined} className={`rounded-lg border px-3.5 py-2 text-sm ${page === i + 1 ? "border-accent text-accent" : "border-line"}`}>{i + 1}</Link>
            ))}
            {page < pages && <Link href={href({ page: page + 1 })} className="rounded-lg border border-line px-4 py-2 text-sm">{t.blog.next}</Link>}
          </nav>
        )}
      </Container>
    </>
  );
}
