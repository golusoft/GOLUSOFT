import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { siteConfig } from '@/lib/site';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Effective runtime configuration. Change values in <code>lib/site.ts</code> or environment variables.</p>
      </header>

      <Card>
        <CardHeader><CardTitle>Site config</CardTitle></CardHeader>
        <CardContent>
          <dl className="grid gap-2 text-sm">
            {[
              ['Name', siteConfig.name],
              ['URL', siteConfig.url],
              ['Tagline', siteConfig.tagline],
              ['Twitter', siteConfig.twitter],
              ['AdSense client', siteConfig.adsense.client || '— not configured —'],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-3 gap-2 border-b border-border/40 py-2">
                <dt className="font-medium">{k}</dt>
                <dd className="col-span-2 font-mono text-muted-foreground break-all">{v}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Environment variables</CardTitle></CardHeader>
        <CardContent>
          <ul className="text-sm space-y-1.5 text-muted-foreground">
            <li><code>NEXT_PUBLIC_SITE_URL</code> — canonical site URL</li>
            <li><code>NEXT_PUBLIC_SITE_NAME</code> — display name</li>
            <li><code>NEXT_PUBLIC_GA_ID</code> — Google Analytics measurement ID (optional)</li>
            <li><code>NEXT_PUBLIC_ADSENSE_CLIENT</code> — AdSense publisher ID (optional)</li>
            <li><code>NEXT_PUBLIC_GSC_VERIFICATION</code> — Search Console verification (optional)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
