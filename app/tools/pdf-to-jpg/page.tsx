import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getTool } from '@/lib/tools';
import { buildMetadata } from '@/lib/seo';
import { ToolPageShell } from '@/components/tool-page-shell';

const PdfToJpgClient = dynamic(() => import('./client').then((m) => m.PdfToJpgClient), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse rounded-xl border border-border/60 bg-muted/30" />,
});

const SLUG = 'pdf-to-jpg';
const tool = getTool(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  keywords: tool.keywords,
  path: `/tools/${SLUG}`,
});

export default function Page() {
  if (!tool) notFound();
  return (
    <ToolPageShell tool={tool}>
      <PdfToJpgClient />
    </ToolPageShell>
  );
}
