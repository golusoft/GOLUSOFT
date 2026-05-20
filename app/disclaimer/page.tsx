import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';
import { PageShell } from '@/components/page-shell';

export const metadata: Metadata = buildMetadata({
  title: 'Disclaimer',
  description: `Disclaimer for ${siteConfig.name}.`,
  path: '/disclaimer',
});

export default function Page() {
  return (
    <PageShell title="Disclaimer" updatedAt="May 1, 2026">
      <h2>General information only</h2>
      <p>
        The information and tools on {siteConfig.name} are provided in good faith for general informational and utility purposes. We make no representation or warranty of any kind regarding accuracy, adequacy, validity, reliability, availability, or completeness.
      </p>

      <h2>No professional advice</h2>
      <p>
        Nothing on this site constitutes legal, accounting, medical, or other professional advice. Always consult an appropriate professional before relying on output for critical use cases (e.g., legal documents, official ID photos).
      </p>

      <h2>External links</h2>
      <p>
        Our site may include links to third-party sites. We do not investigate or monitor these external sites for accuracy or appropriateness, and we are not responsible for their content.
      </p>

      <h2>Errors and omissions</h2>
      <p>
        Despite our best efforts, content on the site may contain typographical errors or inaccuracies. We reserve the right to correct any such errors at any time without prior notice.
      </p>

      <h2>Use at your own risk</h2>
      <p>
        Use of {siteConfig.name} is solely at your own risk. We are not liable for losses or damages arising from use of our tools, including data loss. Always keep a backup of original files.
      </p>
    </PageShell>
  );
}
