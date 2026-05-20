import type { Metadata } from 'next';
import { TOOLS, CATEGORIES, type ToolCategory } from '@/lib/tools';
import { ToolCard } from '@/components/tool-card';
import { SearchTools } from '@/components/search-tools';
import { AdSlot } from '@/components/ad-slot';
import { buildMetadata } from '@/lib/seo';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'All Tools — Image & PDF Toolbox',
  description: 'Explore 100+ free Image and PDF tools. Compress, resize, convert, merge, split, and edit. Browser-based, no signup, no watermark.',
  path: '/tools',
});

interface PageProps {
  searchParams: Promise<{ group?: string; category?: string }>;
}

export default async function ToolsDirectoryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filterGroup = params.group as 'image' | 'pdf' | 'generator' | undefined;
  const filterCategory = params.category as ToolCategory | undefined;

  let visible = TOOLS;
  if (filterGroup) visible = visible.filter((t) => t.group === filterGroup);
  if (filterCategory) visible = visible.filter((t) => t.category === filterCategory);

  const groupedByCategory = CATEGORIES
    .filter((c) => !filterGroup || c.group === filterGroup)
    .map((c) => ({ ...c, tools: visible.filter((t) => t.category === c.id) }))
    .filter((c) => c.tools.length > 0);

  return (
    <>
      <section className="container-wide pt-10 md:pt-14 pb-6">
        <p className="text-sm text-muted-foreground">{visible.length} tools</p>
        <h1 className="mt-2 text-3xl md:text-5xl font-extrabold tracking-tight">
          {filterGroup === 'image'
            ? 'Image Tools'
            : filterGroup === 'pdf'
            ? 'PDF Tools'
            : filterGroup === 'generator'
            ? 'Generators'
            : 'All Tools'}
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Browse the full GOLUSOFT toolbox. Pick a category below or use the search bar to find what you need.
        </p>

        <div className="mt-5 max-w-2xl">
          <SearchTools />
        </div>

        {/* Filter chips */}
        <div className="mt-5 flex flex-wrap gap-2 -mb-1">
          <FilterChip href="/tools" active={!filterGroup && !filterCategory} label="All" />
          <FilterChip href="/tools?group=image" active={filterGroup === 'image'} label="Image" />
          <FilterChip href="/tools?group=pdf" active={filterGroup === 'pdf'} label="PDF" />
          <FilterChip href="/tools?group=generator" active={filterGroup === 'generator'} label="Generators" />
        </div>
      </section>

      <div className="container-wide">
        <AdSlot className="mx-auto max-w-3xl" minHeight={90} label="Top banner ad" />
      </div>

      <section className="container-wide py-8 space-y-12">
        {groupedByCategory.map((cat) => (
          <div key={cat.id}>
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-bold">{cat.label}</h2>
              <span className="text-sm text-muted-foreground">{cat.tools.length} tools</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {cat.tools.map((t) => <ToolCard key={t.slug} tool={t} variant="compact" />)}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

function FilterChip({ href, active, label }: { href: string; active?: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        'rounded-full border px-3.5 py-1.5 text-sm transition-colors',
        active
          ? 'bg-primary text-primary-foreground border-primary'
          : 'border-border/60 bg-background hover:bg-accent'
      )}
    >
      {label}
    </Link>
  );
}
