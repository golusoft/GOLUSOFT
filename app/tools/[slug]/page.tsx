import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getTool, TOOLS } from '@/lib/tools';
import { buildMetadata } from '@/lib/seo';
import { ToolPageShell } from '@/components/tool-page-shell';

const UniversalTool = dynamic(
  () => import('./universal-wrapper').then((m) => m.UniversalWrapper),
  { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-xl border border-border/60 bg-muted/30" /> }
);

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  // Only pre-render tools that don't have their own static page
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

export default async function DynamicToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  return (
    <ToolPageShell tool={tool}>
      <UniversalTool slug={slug} />
    </ToolPageShell>
  );
}
