import Link from 'next/link';
import { TOOLS, CATEGORIES } from '@/lib/tools';
import { getAllPosts } from '@/lib/blog';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AdminHome() {
  const total = TOOLS.length;
  const working = TOOLS.filter((t) => t.status === 'working').length;
  const soon = TOOLS.filter((t) => t.status === 'soon').length;
  const popular = TOOLS.filter((t) => t.popular).length;
  const trending = TOOLS.filter((t) => t.trending).length;
  const posts = getAllPosts().length;

  const stats = [
    { label: 'Total tools', value: total, change: 'baseline' },
    { label: 'Live tools', value: working, change: `${Math.round((working / total) * 100)}%` },
    { label: 'Coming soon', value: soon, change: 'roadmap' },
    { label: 'Popular tools', value: popular },
    { label: 'Trending tools', value: trending },
    { label: 'Blog posts', value: posts },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">A read-only snapshot of the GOLUSOFT catalog and content.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border/60 bg-card p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-3xl font-extrabold">{s.value}</p>
            {s.change && <p className="mt-0.5 text-xs text-muted-foreground">{s.change}</p>}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>By category</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2">
            {CATEGORIES.map((c) => {
              const list = TOOLS.filter((t) => t.category === c.id);
              const live = list.filter((t) => t.status === 'working').length;
              return (
                <li key={c.id} className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2 text-sm">
                  <span className="font-medium">{c.label}</span>
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Badge variant="success">{live} live</Badge>
                    <Badge variant="warn">{list.length - live} soon</Badge>
                  </span>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick links</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Link href="/admin/tools"><Button variant="outline" size="sm">Manage tools</Button></Link>
          <Link href="/admin/blog"><Button variant="outline" size="sm">Manage blog</Button></Link>
          <Link href="/admin/seo"><Button variant="outline" size="sm">SEO overview</Button></Link>
          <Link href="/admin/sitemap"><Button variant="outline" size="sm">Sitemap viewer</Button></Link>
          <Link href="/admin/errors"><Button variant="outline" size="sm">Error logs</Button></Link>
        </CardContent>
      </Card>
    </div>
  );
}
