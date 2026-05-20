import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import type { Tool } from '@/lib/tools';
import { getRelatedTools } from '@/lib/tools';
import { siteConfig } from '@/lib/site';
import { ToolCard } from '@/components/tool-card';
import { AdSlot } from '@/components/ad-slot';
import { JsonLd } from '@/components/json-ld';
import { breadcrumbsJsonLd, faqJsonLd, softwareAppJsonLd } from '@/lib/seo';

interface ToolPageShellProps {
  tool: Tool;
  children: React.ReactNode;
}

export function ToolPageShell({ tool, children }: ToolPageShellProps) {
  const url = `${siteConfig.url}/tools/${tool.slug}`;
  const related = getRelatedTools(tool.slug, 6);

  const crumbs = [
    { name: 'Home', url: siteConfig.url },
    { name: 'Tools', url: `${siteConfig.url}/tools` },
    { name: tool.shortTitle || tool.title, url },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbsJsonLd(crumbs),
          softwareAppJsonLd({
            name: tool.shortTitle || tool.title,
            description: tool.description,
            url,
            category: tool.group === 'pdf' ? 'BusinessApplication' : 'UtilitiesApplication',
          }),
          faqJsonLd(tool.faqs),
        ]}
      />

      <div className="container-wide pt-6">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex items-center gap-1 flex-wrap">
            <li>
              <Link href="/" className="inline-flex items-center gap-1 hover:text-foreground">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
            </li>
            <li><ChevronRight className="h-3.5 w-3.5" /></li>
            <li><Link href="/tools" className="hover:text-foreground">Tools</Link></li>
            <li><ChevronRight className="h-3.5 w-3.5" /></li>
            <li className="text-foreground font-medium truncate" aria-current="page">
              {tool.shortTitle || tool.title}
            </li>
          </ol>
        </nav>
      </div>

      <header className="container-wide pt-4 pb-2">
        <div className="flex items-start gap-4">
          <span className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/15 to-violet-500/15 text-primary">
            <tool.icon className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-balance">
              {tool.shortTitle || tool.title}
            </h1>
            <p className="mt-2 text-muted-foreground text-balance max-w-2xl">{tool.longDescription}</p>
          </div>
        </div>
      </header>

      <section className="container-wide py-6">{children}</section>

      <div className="container-wide">
        <AdSlot className="mx-auto max-w-3xl my-2" minHeight={120} label="In-content ad" />
      </div>

      {/* FAQ */}
      <section className="container-wide py-10">
        <h2 className="text-2xl font-bold">Frequently asked questions</h2>
        <div className="mt-5 space-y-3">
          {tool.faqs.map((f, i) => (
            <details
              key={i}
              className="group rounded-xl border border-border/60 bg-card p-4 open:shadow-sm"
            >
              <summary className="cursor-pointer list-none font-medium flex items-center justify-between gap-2">
                <span>{f.q}</span>
                <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="container-wide py-10">
          <h2 className="text-2xl font-bold">Related tools</h2>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {related.map((r) => <ToolCard key={r.slug} tool={r} variant="compact" />)}
          </div>
        </section>
      )}
    </>
  );
}
