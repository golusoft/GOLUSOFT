import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { siteConfig } from '@/lib/site';
import { TOOLS } from '@/lib/tools';

const FOOTER_GROUPS = [
  {
    title: 'Image Tools',
    links: TOOLS.filter((t) => t.group === 'image' && t.popular).slice(0, 6).map((t) => ({
      href: `/tools/${t.slug}`,
      label: t.shortTitle || t.title,
    })),
  },
  {
    title: 'PDF Tools',
    links: TOOLS.filter((t) => t.group === 'pdf' && t.popular).slice(0, 6).map((t) => ({
      href: `/tools/${t.slug}`,
      label: t.shortTitle || t.title,
    })),
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About Us' },
      { href: '/contact', label: 'Contact' },
      { href: '/blog', label: 'Blog' },
      { href: '/feedback', label: 'Feedback' },
      { href: '/support', label: 'Support' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy-policy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Use' },
      { href: '/disclaimer', label: 'Disclaimer' },
      { href: '/dmca', label: 'DMCA Policy' },
      { href: '/cookie-policy', label: 'Cookie Policy' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-muted/30">
      <div className="container-wide py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-white">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="gradient-text">{siteConfig.name}</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Free Image &amp; PDF tools that run in your browser. No signup, no watermark, no limits.
            </p>
          </div>

          {FOOTER_GROUPS.map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-semibold mb-3">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-border/60 pt-6 text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Link href="/sitemap-page" className="hover:text-foreground">Sitemap</Link>
            <Link href="/faq" className="hover:text-foreground">FAQ</Link>
            <Link href="/trending" className="hover:text-foreground">Trending</Link>
            <Link href="/new" className="hover:text-foreground">New Tools</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
