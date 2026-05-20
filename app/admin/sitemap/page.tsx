import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminSitemapPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Sitemap</h1>
        <p className="text-sm text-muted-foreground mt-1">Generated dynamically from <code>app/sitemap.ts</code>.</p>
      </header>

      <Card>
        <CardHeader><CardTitle>Live sitemap</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            The sitemap is regenerated on each deploy and includes every tool, blog post, and static page.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/sitemap.xml" target="_blank">
              <Button variant="outline" size="sm">Open sitemap.xml</Button>
            </Link>
            <Link href="/robots.txt" target="_blank">
              <Button variant="outline" size="sm">Open robots.txt</Button>
            </Link>
            <Link href="/sitemap-page" target="_blank">
              <Button variant="outline" size="sm">Open HTML sitemap</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
