import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';
import { PageShell } from '@/components/page-shell';

export const metadata: Metadata = buildMetadata({
  title: 'DMCA Policy',
  description: `${siteConfig.name} responds to valid DMCA takedown notices.`,
  path: '/dmca',
});

export default function Page() {
  return (
    <PageShell title="DMCA Policy" updatedAt="May 1, 2026">
      <p>
        {siteConfig.name} respects the intellectual property rights of others and complies with the Digital Millennium Copyright Act (DMCA). Because file processing happens entirely in the user's browser, we do not host user-generated files. However, we will respond to valid notices regarding any content we publish on this website (blog posts, copy, illustrations, etc.).
      </p>

      <h2>How to file a DMCA notice</h2>
      <p>If you believe content on this site infringes your copyright, please email our designated agent at <a href="mailto:dmca@golusoft.com">dmca@golusoft.com</a> with the following:</p>
      <ol>
        <li>An electronic or physical signature of the copyright owner or an authorized representative.</li>
        <li>Identification of the copyrighted work claimed to have been infringed.</li>
        <li>Identification of the material on our site that is infringing, with a URL or precise location.</li>
        <li>Your contact information (name, address, telephone, email).</li>
        <li>A statement that you have a good-faith belief that the use is not authorized by the copyright owner, its agent, or the law.</li>
        <li>A statement, made under penalty of perjury, that the information is accurate and that you are the copyright owner or authorized to act on the owner's behalf.</li>
      </ol>

      <h2>Counter-notice</h2>
      <p>
        If you believe content was removed in error, you may submit a counter-notice including your contact information, the material removed, a sworn statement of your good-faith belief that the removal was a mistake, and your consent to the jurisdiction of the federal court in your district.
      </p>

      <h2>Repeat infringers</h2>
      <p>
        It is our policy to terminate the access of users who are repeat infringers in appropriate circumstances.
      </p>
    </PageShell>
  );
}
