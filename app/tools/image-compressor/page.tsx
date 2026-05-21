import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTool } from '@/lib/tools';
import { buildMetadata } from '@/lib/seo';
import { ToolPageShell } from '@/components/tool-page-shell';
import { ImageCompressorClient } from './client';

const SLUG = 'image-compressor';
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
      <ImageCompressorClient />
    </ToolPageShell>
  );
}
