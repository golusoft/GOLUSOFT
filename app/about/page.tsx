import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Zap, Heart, Globe, Smartphone, Lock } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';
import { PageShell } from '@/components/page-shell';
import { TOOLS } from '@/lib/tools';

export const metadata: Metadata = buildMetadata({
  title: `About ${siteConfig.name}`,
  description: `${siteConfig.name} is a 100% free, browser-based suite of image and PDF tools designed for speed, privacy, and zero friction.`,
  path: '/about',
});

const VALUES = [
  { icon: Lock, title: 'Privacy-first', text: 'Files never leave your device. There is nothing to upload, log, or leak.' },
  { icon: Zap, title: 'Speed', text: 'Tools run instantly with no queue, no upload time, no waiting.' },
  { icon: Heart, title: 'Free forever', text: 'No signup, no watermark, no daily limits, no premium tier.' },
  { icon: Smartphone, title: 'Mobile-first', text: 'Designed to work flawlessly on low-end Android and iOS.' },
  { icon: Globe, title: 'Open access', text: 'Available worldwide. Built for English, Hindi, Spanish, and beyond.' },
  { icon: Shield, title: 'Safe', text: 'No tracking pixels in tools. Files never touch a server.' },
];

export default function Page() {
  return (
    <PageShell
      title={`About ${siteConfig.name}`}
      description="A modern toolbox built for everyday image and PDF tasks. No signup, no servers, no waiting."
    >
      <h2>Why we built {siteConfig.name}</h2>
      <p>
        Most online "free" tools are slow, watermark your files, or aggressively push you to a paid tier. We wanted a different experience — a toolbox that respects your time, your privacy, and your wallet.
      </p>
      <p>
        {siteConfig.name} runs entirely in your browser. When you compress an image or merge a PDF, your file never leaves your device. There's no upload, no queue, and no server cost — which is exactly why we can offer everything for free.
      </p>

      <h2>What's inside</h2>
      <ul>
        <li>{TOOLS.length} tools across image and PDF workflows</li>
        <li>Compression, resizing, conversion, merging, splitting, watermarking, and more</li>
        <li>Powered by modern web technology (Next.js 15, WebAssembly, Canvas, pdf-lib, browser-image-compression)</li>
      </ul>

      <h2>Our values</h2>
      <div className="not-prose grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
        {VALUES.map((v) => (
          <div key={v.title} className="rounded-xl border border-border/60 bg-card p-5">
            <v.icon className="h-6 w-6 text-primary mb-2" />
            <h3 className="font-semibold">{v.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{v.text}</p>
          </div>
        ))}
      </div>

      <h2>Roadmap</h2>
      <p>
        We're shipping new tools weekly. The remaining tools in our roadmap are visible at <Link href="/tools">/tools</Link> with a "soon" badge. Implementations are added one at a time so each tool is built well, not rushed.
      </p>

      <h2>Get in touch</h2>
      <p>
        We'd love to hear feedback, bug reports, and feature requests. Use the <Link href="/contact">contact page</Link> or write to us at <a href="mailto:hello@golusoft.com">hello@golusoft.com</a>.
      </p>
    </PageShell>
  );
}
