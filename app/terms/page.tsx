import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';
import { PageShell } from '@/components/page-shell';

export const metadata: Metadata = buildMetadata({
  title: 'Terms of Use',
  description: `Terms governing the use of ${siteConfig.name} tools.`,
  path: '/terms',
});

export default function Page() {
  return (
    <PageShell title="Terms of Use" updatedAt="May 1, 2026">
      <p>
        By using {siteConfig.name}, you agree to these terms. If you do not agree, please do not use the service.
      </p>

      <h2>1. The service</h2>
      <p>
        {siteConfig.name} provides free online tools for processing images and PDF files in your browser. Tools are provided "as is" without any warranty of fitness for a particular purpose.
      </p>

      <h2>2. Acceptable use</h2>
      <ul>
        <li>You may only upload files you own or have permission to process.</li>
        <li>Do not use the platform for illegal content (CSAM, fraud, copyright infringement, etc.).</li>
        <li>Do not attempt to disrupt the service, abuse rate limits, or scrape content.</li>
        <li>Do not redistribute the source code under your own name without attribution.</li>
      </ul>

      <h2>3. Intellectual property</h2>
      <p>
        The {siteConfig.name} brand, design, and original code are owned by {siteConfig.name}. The files you process remain entirely yours — we acquire no rights to them.
      </p>

      <h2>4. Disclaimers</h2>
      <p>
        Tools are best-effort. We do not guarantee that compression, conversion, or rendering produces a file fit for any specific purpose. Always keep a backup of important originals.
      </p>

      <h2>5. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, {siteConfig.name} and its operators are not liable for any indirect, incidental, or consequential damages arising from use of the platform.
      </p>

      <h2>6. Third-party content</h2>
      <p>
        Ads, blog posts, and external links may originate from third parties. We are not responsible for their content or practices.
      </p>

      <h2>7. Changes</h2>
      <p>
        We may modify these terms at any time. Material changes will be highlighted on the homepage for at least 7 days.
      </p>

      <h2>8. Governing law</h2>
      <p>
        These terms are governed by the laws of the jurisdiction where {siteConfig.name} is operated. Disputes shall be resolved in the courts of that jurisdiction.
      </p>

      <h2>9. Contact</h2>
      <p>
        For questions, see the <Link href="/contact">Contact page</Link>.
      </p>
    </PageShell>
  );
}
