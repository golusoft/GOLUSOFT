import type { Metadata } from 'next';
import { Mail, MessageCircle, Twitter, Github } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';
import { PageShell } from '@/components/page-shell';

export const metadata: Metadata = buildMetadata({
  title: `Contact ${siteConfig.name}`,
  description: `Get in touch with ${siteConfig.name} for support, partnerships, or feedback.`,
  path: '/contact',
});

const CHANNELS = [
  { icon: Mail, title: 'Email us', text: 'For all general questions, feedback, and partnerships.', href: 'mailto:hello@golusoft.com', label: 'hello@golusoft.com' },
  { icon: MessageCircle, title: 'Support', text: 'Trouble using a tool? Tell us what is happening.', href: 'mailto:support@golusoft.com', label: 'support@golusoft.com' },
  { icon: Twitter, title: 'Twitter / X', text: 'Quick questions and product news.', href: 'https://twitter.com/golusoft', label: '@golusoft' },
  { icon: Github, title: 'GitHub', text: 'Found a bug? Open an issue.', href: 'https://github.com/golusoft/GOLUSOFT', label: 'github.com/golusoft' },
];

export default function Page() {
  return (
    <PageShell
      title="Contact"
      description="We respond to most messages within 1-2 business days."
    >
      <div className="not-prose grid gap-4 sm:grid-cols-2 mt-4">
        {CHANNELS.map((c) => (
          <a
            key={c.title}
            href={c.href}
            target={c.href.startsWith('http') ? '_blank' : undefined}
            rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="group rounded-xl border border-border/60 bg-card p-5 hover:border-primary/40 hover:shadow-sm transition-all"
          >
            <c.icon className="h-6 w-6 text-primary mb-2" />
            <h3 className="font-semibold">{c.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{c.text}</p>
            <p className="mt-2 text-sm font-medium text-primary group-hover:underline">{c.label}</p>
          </a>
        ))}
      </div>

      <h2>Office hours</h2>
      <p>
        Monday to Friday, 9 AM to 6 PM IST. Most messages are answered within 24 hours, but allow up to 2 business days during peak weeks.
      </p>

      <h2>What to include</h2>
      <p>To help us help you faster, please include:</p>
      <ul>
        <li>Which tool you were using (URL is helpful).</li>
        <li>Your browser and operating system.</li>
        <li>What you expected vs. what actually happened.</li>
        <li>A screenshot if relevant.</li>
      </ul>

      <p className="text-xs">Please do <strong>not</strong> attach the original file you were processing — we cannot accept user files for privacy reasons.</p>
    </PageShell>
  );
}
