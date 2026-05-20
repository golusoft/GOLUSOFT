import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, ArrowLeft } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';
import { getPost, getAllPosts } from '@/lib/blog';
import { JsonLd } from '@/components/json-ld';
import { breadcrumbsJsonLd } from '@/lib/seo';
import { AdSlot } from '@/components/ad-slot';

export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return buildMetadata({ title: 'Post not found', description: '', noIndex: true });
  return buildMetadata({
    title: post.title,
    description: post.description,
    keywords: post.tags,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const url = `${siteConfig.url}/blog/${post.slug}`;
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    author: { '@type': 'Organization', name: post.author },
    publisher: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.url },
    mainEntityOfPage: url,
  };

  const crumbs = [
    { name: 'Home', url: siteConfig.url },
    { name: 'Blog', url: `${siteConfig.url}/blog` },
    { name: post.title, url },
  ];

  return (
    <>
      <JsonLd data={[articleLd, breadcrumbsJsonLd(crumbs)]} />

      <article className="container-tight py-12">
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> All articles
        </Link>

        <header className="mt-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(post.publishedAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
            <span>·</span>
            <span>{post.author}</span>
          </div>
          <h1 className="mt-2 text-3xl md:text-5xl font-extrabold tracking-tight text-balance">{post.title}</h1>
          <p className="mt-3 text-muted-foreground text-lg max-w-3xl">{post.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.map((t) => (
              <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">#{t}</span>
            ))}
          </div>
        </header>

        <AdSlot className="my-8" minHeight={120} label="Advertisement" />

        <div
          className="prose prose-neutral dark:prose-invert max-w-none prose-h2:mt-10 prose-h2:mb-3 prose-h3:mt-6 prose-a:text-primary"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: post.body }}
        />

        <div className="mt-12 rounded-2xl border border-border/60 bg-gradient-to-br from-blue-500/5 to-violet-500/5 p-6 text-center">
          <p className="text-muted-foreground">Liked this article?</p>
          <h3 className="mt-1 text-xl font-bold">Try the tools that inspired it.</h3>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link href="/tools/image-compressor" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Compress images</Link>
            <Link href="/tools/pdf-compressor" className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium">Compress PDFs</Link>
            <Link href="/tools" className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium">All tools</Link>
          </div>
        </div>
      </article>
    </>
  );
}
