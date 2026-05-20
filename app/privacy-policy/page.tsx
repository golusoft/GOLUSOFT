import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';
import { PageShell } from '@/components/page-shell';

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy',
  description: `${siteConfig.name} privacy policy. We never upload your files. Files are processed entirely in your browser.`,
  path: '/privacy-policy',
});

export default function Page() {
  return (
    <PageShell
      title="Privacy Policy"
      description={`How ${siteConfig.name} handles your data — short answer: we don't collect your files at all.`}
      updatedAt="May 1, 2026"
    >
      <h2>1. Summary</h2>
      <p>
        {siteConfig.name} is a free online toolbox that processes images and PDFs <strong>entirely in your browser</strong>. We do not upload, store, or transmit your files to our servers.
      </p>

      <h2>2. What we do not collect</h2>
      <ul>
        <li>The images, PDFs, or any files you process with our tools.</li>
        <li>The content of QR codes, forms, or other input you generate.</li>
        <li>Your name, email, or any account information — no signup is required.</li>
      </ul>

      <h2>3. What we may collect</h2>
      <p>To keep the service fast and reliable, we may collect:</p>
      <ul>
        <li><strong>Anonymous analytics</strong> via Google Analytics or a privacy-friendly equivalent (page views, browser, country at the city level, referrer). These do not identify you.</li>
        <li><strong>Server logs</strong> for incoming HTTP requests (IP, user-agent, request path) for security and abuse prevention. These rotate within 30 days.</li>
        <li><strong>Voluntary form submissions</strong> if you write to us via the Contact or Feedback page.</li>
      </ul>

      <h2>4. Cookies and local storage</h2>
      <p>We use a small number of cookies and local-storage entries:</p>
      <ul>
        <li><strong>Theme</strong> preference (light/dark/system).</li>
        <li><strong>Recently used tools</strong> for quick access.</li>
        <li><strong>Analytics cookies</strong> (only if you accept the cookie banner).</li>
        <li><strong>Advertising cookies</strong> served by Google AdSense (subject to your consent in regions where it is required).</li>
      </ul>
      <p>See our <Link href="/cookie-policy">Cookie Policy</Link> for details.</p>

      <h2>5. Advertising</h2>
      <p>
        We display ads through Google AdSense. AdSense may use cookies to serve ads based on your prior visits to this and other websites. You can opt out of personalized advertising by visiting{' '}
        <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
      </p>

      <h2>6. Third-party services</h2>
      <p>We rely on a small set of third-party services to deliver the platform:</p>
      <ul>
        <li><strong>Vercel / Cloudflare</strong> for hosting and CDN.</li>
        <li><strong>Google AdSense</strong> for monetization.</li>
        <li><strong>Google Analytics</strong> for anonymous usage statistics.</li>
        <li><strong>cdnjs / unpkg</strong> for serving the PDF.js worker.</li>
      </ul>

      <h2>7. Data retention</h2>
      <p>
        Because file processing happens locally, there is no file data to retain. Server logs rotate within 30 days. Contact form submissions are retained only as long as needed to respond to your message.
      </p>

      <h2>8. Children's privacy</h2>
      <p>
        {siteConfig.name} is not directed to children under 13. We do not knowingly collect personal information from children.
      </p>

      <h2>9. Your rights</h2>
      <p>
        Under GDPR, CCPA, and similar laws, you have the right to access, rectify, or delete personal information we hold. Because we do not collect identifying personal data by default, most rights apply only to voluntary contact submissions. To exercise any right, email us at <a href="mailto:privacy@golusoft.com">privacy@golusoft.com</a>.
      </p>

      <h2>10. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The "Last updated" date at the top reflects the most recent revision.
      </p>

      <h2>11. Contact</h2>
      <p>
        Questions? Reach us at <a href="mailto:privacy@golusoft.com">privacy@golusoft.com</a> or via the <Link href="/contact">Contact page</Link>.
      </p>
    </PageShell>
  );
}
