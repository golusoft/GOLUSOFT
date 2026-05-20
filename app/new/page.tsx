import type { Metadata } from 'next';
import { getWorkingTools } from '@/lib/tools';
import { ToolCard } from '@/components/tool-card';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'New Tools',
  description: 'Recently launched tools on GOLUSOFT.',
  path: '/new',
});

export default function NewToolsPage() {
  const newTools = getWorkingTools();

  return (
    <>
      <header className="container-wide pt-12 pb-6">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">New tools</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          The latest tools we have shipped. We launch new ones every week — bookmark this page.
        </p>
      </header>

      <section className="container-wide pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {newTools.map((t) => <ToolCard key={t.slug} tool={t} variant="compact" />)}
        </div>
      </section>
    </>
  );
}
