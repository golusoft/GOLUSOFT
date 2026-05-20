import type { Metadata } from 'next';
import { ChevronRight } from 'lucide-react';
import { buildMetadata, faqJsonLd } from '@/lib/seo';
import { siteConfig } from '@/lib/site';
import { PageShell } from '@/components/page-shell';
import { JsonLd } from '@/components/json-ld';

export const metadata: Metadata = buildMetadata({
  title: 'FAQ — Frequently Asked Questions',
  description: `Common questions about ${siteConfig.name}, our tools, privacy, and pricing.`,
  path: '/faq',
});

const FAQS = [
  {
    q: `Is ${siteConfig.name} really free?`,
    a: 'Yes. Every tool is 100% free. No signup, no watermark, no daily limits, no premium tier.',
  },
  {
    q: 'Are my files uploaded to your servers?',
    a: 'No. Tools run entirely in your browser using JavaScript and WebAssembly. Your files never leave your device.',
  },
  {
    q: 'Does it work offline?',
    a: 'Once the page is loaded, most tools work without an internet connection. Some features (like the PDF.js worker) load from a CDN; once loaded, they continue to work.',
  },
  {
    q: 'How do I compress an image to a specific KB?',
    a: 'Open the Smart Image Compressor, switch to the "Target size" tab, type a value like 50 or 200, and click Compress. The tool will iterate until your file size matches.',
  },
  {
    q: 'How does PDF compression work?',
    a: 'For "Low" mode we re-save the PDF with optimal object streams. For Medium/High/Extreme modes we render every page to a JPEG and rebuild the PDF — this gives dramatic size reduction but the result is no longer text-selectable.',
  },
  {
    q: 'What is the maximum file size?',
    a: 'Up to 50 MB per image and 200 MB per PDF on most devices. Performance depends on your device memory.',
  },
  {
    q: 'Will GOLUSOFT add the rest of the 100 tools?',
    a: 'Yes. We ship new tools weekly. Tools marked "Soon" are scheduled and will go live when the implementation passes our quality bar.',
  },
  {
    q: 'Can I use the tools commercially?',
    a: 'Absolutely. Output you generate is yours. Watermark-free, royalty-free, no attribution required.',
  },
  {
    q: 'Do you store anything about me?',
    a: 'We collect anonymous usage analytics and standard server logs. We do not store your files or personal identifiers.',
  },
  {
    q: 'How can I request a tool or report a bug?',
    a: 'Use the Feedback or Contact page. We respond to most messages within 1-2 business days.',
  },
];

export default function Page() {
  return (
    <>
      <JsonLd data={faqJsonLd(FAQS)} />
      <PageShell
        title="Frequently asked questions"
        description="Quick answers to the most common questions about GOLUSOFT."
      >
        <div className="not-prose space-y-3 mt-6">
          {FAQS.map((f, i) => (
            <details key={i} className="group rounded-xl border border-border/60 bg-card p-4 open:shadow-sm">
              <summary className="cursor-pointer list-none font-medium flex items-center justify-between gap-2">
                <span>{f.q}</span>
                <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </PageShell>
    </>
  );
}
