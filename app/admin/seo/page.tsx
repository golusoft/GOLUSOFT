import Link from 'next/link';
import { TOOLS } from '@/lib/tools';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, FileText, Search } from 'lucide-react';
import { siteConfig } from '@/lib/site';

export default function AdminSeoPage() {
  const totalKeywords = TOOLS.reduce((acc, t) => acc + t.keywords.length, 0);
  const avg = Math.round(totalKeywords / TOOLS.length);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">SEO</h1>
        <p className="text-sm text-muted-foreground mt-1">An overview of meta, structured data, and submission targets.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-border/60 bg-card p-4">
          <FileText className="h-5 w-5 text-primary mb-2" />
          <p className="text-xs text-muted-foreground">Indexed pages (sitemap)</p>
          <p className="mt-1 text-3xl font-extrabold">{TOOLS.length + 17}</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-4">
          <Search className="h-5 w-5 text-primary mb-2" />
          <p className="text-xs text-muted-foreground">Total keywords across tools</p>
          <p className="mt-1 text-3xl font-extrabold">{totalKeywords}</p>
          <p className="text-xs text-muted-foreground">avg {avg} per tool</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-4">
          <Globe className="h-5 w-5 text-primary mb-2" />
          <p className="text-xs text-muted-foreground">Site URL</p>
          <p className="mt-1 text-sm font-mono break-all">{siteConfig.url}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Structured data emitted</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>✓ Organization (root layout)</li>
            <li>✓ WebSite + SearchAction (root layout)</li>
            <li>✓ BreadcrumbList (every page)</li>
            <li>✓ WebApplication (every tool page)</li>
            <li>✓ FAQPage (every tool page + /faq)</li>
            <li>✓ Article (each blog post)</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Submission checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm">
            <li>1. Submit <Link href="/sitemap.xml" className="text-primary hover:underline">/sitemap.xml</Link> to <a className="text-primary hover:underline" href="https://search.google.com/search-console" target="_blank" rel="noopener">Google Search Console</a></li>
            <li>2. Submit to <a className="text-primary hover:underline" href="https://www.bing.com/webmasters" target="_blank" rel="noopener">Bing Webmaster</a></li>
            <li>3. Set <code>NEXT_PUBLIC_GSC_VERIFICATION</code> in env once you receive the verification token</li>
            <li>4. Set <code>NEXT_PUBLIC_ADSENSE_CLIENT</code> after AdSense approval</li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top targeted keywords</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-1.5">
          {Array.from(new Set(TOOLS.flatMap((t) => t.keywords))).slice(0, 40).map((k) => (
            <Badge key={k} variant="secondary" className="text-xs font-normal">{k}</Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
