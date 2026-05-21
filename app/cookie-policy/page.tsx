import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';
import { PageShell } from '@/components/page-shell';

export const metadata: Metadata = buildMetadata({
  title: 'Cookie Policy',
  description: `${siteConfig.name} cookie policy and how to manage cookies.`,
  path: '/cookie-policy',
});

export default function Page() {
  return (
    <PageShell title="Cookie Policy" updatedAt="May 1, 2026">
      <p>
        This page explains how {siteConfig.name} uses cookies and similar technologies. For broader privacy information, see our <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>

      <h2>What are cookies?</h2>
      <p>
        Cookies are small text files stored by your browser when you visit a website. They are commonly used to remember preferences, support analytics, and serve advertising.
      </p>

      <h2>Categories we use</h2>
      <h3>Strictly necessary</h3>
      <p>Required for the site to function. Examples: theme preference, locale.</p>

      <h3>Functional</h3>
      <p>Improve usability. Examples: recently used tools, last-used compression settings.</p>

      <h3>Analytics</h3>
      <p>
        Help us understand how the site is used in aggregate. We do not collect personal identifiers in analytics. Set only after consent in regions where consent is required.
      </p>

      <h3>Advertising</h3>
      <p>
        Google AdSense may set cookies to serve and measure ads. You can opt out at{' '}
        <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
      </p>

      <h2>How to control cookies</h2>
      <p>
        You can clear or block cookies from your browser settings (Chrome, Safari, Firefox, Edge). Note that blocking strictly necessary cookies may break parts of the site.
      </p>

      <h2>Do Not Track</h2>
      <p>
        We honor the Global Privacy Control (GPC) signal where applicable. Browsers that send the GPC header will not be served personalized advertising cookies.
      </p>
    </PageShell>
  );
}
