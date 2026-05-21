import type { Metadata } from 'next';
import { TOOLS } from '@/lib/tools';
import { ToolCard } from '@/components/tool-card';
import { SearchTools } from '@/components/search-tools';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Search Tools',
  description: 'Search 100+ free image and PDF tools.',
  path: '/search',
});

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = (params.q || '').trim();
  const lower = q.toLowerCase();
  const results = q
    ? TOOLS.filter(
        (t) =>
          t.title.toLowerCase().includes(lower) ||
          t.description.toLowerCase().includes(lower) ||
          t.keywords.some((k) => k.includes(lower))
      )
    : [];

  return (
    <>
      <header className="container-wide pt-12 pb-6">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Search</h1>
        {q && (
          <p className="mt-2 text-muted-foreground">
            {results.length} result{results.length === 1 ? '' : 's'} for <strong className="text-foreground">"{q}"</strong>
          </p>
        )}
        <div className="mt-5 max-w-2xl">
          <SearchTools placeholder="Search tools…" />
        </div>
      </header>

      <section className="container-wide pb-16">
        {q && results.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 p-10 text-center">
            <p className="text-muted-foreground">No tools match <strong className="text-foreground">"{q}"</strong>.</p>
            <p className="mt-1 text-sm text-muted-foreground">Try a broader keyword like "compress", "merge", "convert", or "qr".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            {results.map((t) => <ToolCard key={t.slug} tool={t} variant="compact" />)}
          </div>
        )}
      </section>
    </>
  );
}
