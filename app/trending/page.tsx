import type { Metadata } from 'next';
import { TOOLS, getTrendingTools, getPopularTools } from '@/lib/tools';
import { ToolCard } from '@/components/tool-card';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Trending Tools',
  description: 'The most-used Image and PDF tools on GOLUSOFT this week.',
  path: '/trending',
});

export default function TrendingPage() {
  const trending = getTrendingTools(6);
  const popular = getPopularTools(12);

  return (
    <>
      <header className="container-wide pt-12 pb-6">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Trending tools</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          What people are reaching for this week. {TOOLS.length}+ tools available — these are the hits.
        </p>
      </header>

      <section className="container-wide pb-12">
        <h2 className="text-xl font-semibold mb-4">Hot right now</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {trending.map((t) => <ToolCard key={t.slug} tool={t} />)}
        </div>
      </section>

      <section className="container-wide pb-16">
        <h2 className="text-xl font-semibold mb-4">Always popular</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {popular.map((t) => <ToolCard key={t.slug} tool={t} variant="compact" />)}
        </div>
      </section>
    </>
  );
}
