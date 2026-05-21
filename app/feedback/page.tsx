import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';
import { PageShell } from '@/components/page-shell';
import { FeedbackForm } from './form';

export const metadata: Metadata = buildMetadata({
  title: 'Feedback',
  description: `Share feedback or request a feature for ${siteConfig.name}.`,
  path: '/feedback',
});

export default function Page() {
  return (
    <PageShell
      title="Feedback"
      description="Tell us what's working, what's not, and what tool we should build next."
    >
      <div className="not-prose mt-4">
        <FeedbackForm />
      </div>
    </PageShell>
  );
}
