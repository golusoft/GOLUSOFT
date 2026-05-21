import * as React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { siteConfig } from '@/lib/site';
import { JsonLd } from '@/components/json-ld';
import { breadcrumbsJsonLd } from '@/lib/seo';

interface PageShellProps {
  title: string;
  description?: string;
  updatedAt?: string;
  breadcrumb?: { name: string; href?: string }[];
  children: React.ReactNode;
}

export function PageShell({ title, description, updatedAt, breadcrumb = [], children }: PageShellProps) {
  const crumbs = [
    { name: 'Home', url: siteConfig.url },
    ...breadcrumb.map((b) => ({
      name: b.name,
      url: b.href ? `${siteConfig.url}${b.href}` : siteConfig.url,
    })),
    { name: title, url: siteConfig.url },
  ];

  return (
    <>
      <JsonLd data={breadcrumbsJsonLd(crumbs)} />

      <div className="container-tight pt-6">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex items-center gap-1 flex-wrap">
            <li>
              <Link href="/" className="inline-flex items-center gap-1 hover:text-foreground">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
            </li>
            {breadcrumb.map((b, i) => (
              <React.Fragment key={i}>
                <li>
                  <ChevronRight className="h-3.5 w-3.5" />
                </li>
                <li>
                  {b.href ? (
                    <Link href={b.href} className="hover:text-foreground">{b.name}</Link>
                  ) : (
                    <span>{b.name}</span>
                  )}
                </li>
              </React.Fragment>
            ))}
            <li>
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li className="text-foreground font-medium">{title}</li>
          </ol>
        </nav>
      </div>

      <header className="container-tight pt-6 pb-4">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-3 text-muted-foreground text-balance max-w-3xl">{description}</p>
        )}
        {updatedAt && <p className="mt-2 text-xs text-muted-foreground">Last updated: {updatedAt}</p>}
      </header>

      <article className="container-tight pb-16">
        <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-3 prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2 prose-p:text-muted-foreground prose-li:text-muted-foreground prose-a:text-primary">
          {children}
        </div>
      </article>
    </>
  );
}
