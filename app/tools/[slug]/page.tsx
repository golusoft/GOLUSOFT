import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Clock, Wrench } from 'lucide-react';
import { getTool, TOOLS } from '@/lib/tools';
import { buildMetadata } from '@/lib/seo';
import { ToolPageShell } from '@/components/tool-page-shell';
import { Button } from '@/components/ui/button';

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  // Only generate params for non-working tools — working ones have their own
  // static /tools/<slug>/page.tsx routes that take precedence over this dynamic route.
  return TOOLS.filter((t) => t.status !== 'working').map((t) => ({ slug: t.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return buildMetadata({ title: 'Tool not found', description: 'This tool does not exist.', noIndex: true });
  return buildMetadata({
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    path: `/tools/${tool.slug}`,
  });
}

/**
 * Fallback dynamic tool page.
 * Working tools have their own static route at app/tools/<slug>/page.tsx
 * which takes precedence over this dynamic route in the App Router.
 * This file therefore only renders for "soon" tools (and 404s for unknown slugs).
 */
export default async function DynamicToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool}>
      <div className="rounded-2xl border border-dashed border-border/70 bg-gradient-to-br from-muted/30 to-transparent p-8 md:p-12 text-center">
        <span className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-amber-500/15 text-amber-600 mb-4">
          <Clock className="h-7 w-7" />
        </span>
        <h2 className="text-xl md:text-2xl font-bold">Coming soon — implementation in progress</h2>
        <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
          This tool is on the GOLUSOFT roadmap and will launch shortly. In the meantime, try one of the live tools below.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link href="/tools/image-compressor"><Button variant="gradient">Compress Image</Button></Link>
          <Link href="/tools/pdf-compressor"><Button variant="outline">Compress PDF</Button></Link>
          <Link href="/tools/merge-pdf"><Button variant="outline">Merge PDF</Button></Link>
          <Link href="/tools"><Button variant="ghost"><Wrench className="h-4 w-4" /> All tools</Button></Link>
        </div>
      </div>
    </ToolPageShell>
  );
}
