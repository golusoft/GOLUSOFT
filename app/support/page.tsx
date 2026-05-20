import type { Metadata } from 'next';
import Link from 'next/link';
import { LifeBuoy, MessageCircle, BookOpen, Bug } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';
import { PageShell } from '@/components/page-shell';

export const metadata: Metadata = buildMetadata({
  title: 'Support',
  description: `Get help using ${siteConfig.name} tools.`,
  path: '/support',
});

const ITEMS = [
  { icon: BookOpen, title: 'Read the FAQ', text: 'Most questions are answered there in under a minute.', href: '/faq', cta: 'Open FAQ' },
  { icon: MessageCircle, title: 'Contact us', text: 'Email a human. We respond within 1-2 business days.', href: '/contact', cta: 'Contact' },
  { icon: Bug, title: 'Report a bug', text: 'Found something broken? Tell us what you expected vs. what happened.', href: 'mailto:bugs@golusoft.com', cta: 'Email bugs' },
  { icon: LifeBuoy, title: 'Status', text: 'Site, CDN, and analytics health. Updated automatically.', href: 'https://status.golusoft.com', cta: 'View status' },
];

export default function Page() {
  return (
    <PageShell title="Support" description="Pick the option that best matches what you need.">
      <div className="not-prose grid gap-4 sm:grid-cols-2 mt-4">
        {ITEMS.map((it) => (
          <Link
            key={it.title}
            href={it.href}
            className="group rounded-xl border border-border/60 bg-card p-5 hover:border-primary/40 hover:shadow-sm transition-all"
          >
            <it.icon className="h-6 w-6 text-primary mb-2" />
            <h3 className="font-semibold">{it.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{it.text}</p>
            <p className="mt-3 text-sm font-medium text-primary group-hover:underline">{it.cta} →</p>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
