import type { Metadata } from 'next';
import Link from 'next/link';
import { TOOLS, CATEGORIES } from '@/lib/tools';
import { getAllPosts } from '@/lib/blog';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Sitemap',
  description: 'Browse every page on GOLUSOFT.',
  path: '/sitemap-page',
});

const STATIC_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/tools', label: 'All Tools' },
  { href: '/trending', label: 'Trending' },
  { href: '/new', label: 'New Tools' },
  { href: '/blog', label: 'Blog' },
  { href: '/search', label: 'Search' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/faq', label: 'FAQ' },
  { href: '/support', label: 'Support' },
  { href: '/feedback', label: 'Feedback' },
];

const LEGAL_LINKS = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Use' },
  { href: '/disclaimer', label: 'Disclaimer' },
  { href: '/dmca', label: 'DMCA Policy' },
  { href: '/cookie-policy', label: 'Cookie Policy' },
];

export default function HtmlSitemapPage() {
  const posts = getAllPosts();
  return (
    <>
      <header className="container-tight pt-12 pb-6">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Sitemap</h1>
        <p className="mt-3 text-muted-foreground">A complete index of {TOOLS.length} tools, {posts.length} articles, and every other page on GOLUSOFT.</p>
      </header>

      <section className="container-tight pb-16 space-y-10">
        <div>
          <h2 className="text-xl font-bold mb-3">Site</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-sm">
            {STATIC_LINKS.map((l) => (
              <li key={l.href}><Link href={l.href} className="text-primary hover:underline">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        {CATEGORIES.map((cat) => {
          const list = TOOLS.filter((t) => t.category === cat.id);
          if (list.length === 0) return null;
          return (
            <div key={cat.id}>
              <h2 className="text-xl font-bold mb-3">{cat.label} <span className="text-muted-foreground text-sm font-normal">({list.length})</span></h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 text-sm">
                {list.map((t) => (
                  <li key={t.slug}>
                    <Link href={`/tools/${t.slug}`} className="text-primary hover:underline">{t.shortTitle || t.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        {posts.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-3">Blog</h2>
            <ul className="space-y-1.5 text-sm">
              {posts.map((p) => (
                <li key={p.slug}><Link href={`/blog/${p.slug}`} className="text-primary hover:underline">{p.title}</Link></li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h2 className="text-xl font-bold mb-3">Legal</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-sm">
            {LEGAL_LINKS.map((l) => (
              <li key={l.href}><Link href={l.href} className="text-primary hover:underline">{l.label}</Link></li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
