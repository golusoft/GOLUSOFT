import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';
import { getAllPosts } from '@/lib/blog';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Blog — Image & PDF guides, tutorials, and tips',
  description: `Tutorials, comparisons, and tips on images, PDFs, and web tools — from the ${siteConfig.name} team.`,
  path: '/blog',
});

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <header className="container-tight pt-12 pb-6">
        <p className="text-sm text-muted-foreground">{posts.length} articles</p>
        <h1 className="mt-2 text-3xl md:text-5xl font-extrabold tracking-tight">Blog</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Practical guides on image compression, PDF tools, and the web technologies that power GOLUSOFT.
        </p>
      </header>

      <section className="container-tight pb-16">
        <ul className="space-y-4">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/blog/${p.slug}`}
                className="group block rounded-2xl border border-border/60 bg-card p-6 hover:border-primary/40 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(p.publishedAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
                  <span>·</span>
                  <span>{p.author}</span>
                </div>
                <h2 className="mt-2 text-xl md:text-2xl font-bold group-hover:text-primary transition-colors">
                  {p.title}
                </h2>
                <p className="mt-2 text-muted-foreground">{p.description}</p>
                <p className="mt-4 inline-flex items-center gap-1 text-sm text-primary font-medium">
                  Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">#{t}</span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
