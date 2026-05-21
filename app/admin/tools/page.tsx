import Link from 'next/link';
import { TOOLS } from '@/lib/tools';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

export default function AdminToolsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Tools</h1>
        <p className="text-sm text-muted-foreground mt-1">All {TOOLS.length} tools registered in the catalog.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Catalog</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Title</th>
                <th className="px-4 py-2 font-medium">Slug</th>
                <th className="px-4 py-2 font-medium">Category</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Tags</th>
                <th className="px-4 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {TOOLS.map((t, i) => (
                <tr key={t.slug} className={i % 2 ? 'bg-muted/20' : ''}>
                  <td className="px-4 py-2 font-medium">{t.shortTitle || t.title}</td>
                  <td className="px-4 py-2 text-xs font-mono text-muted-foreground">{t.slug}</td>
                  <td className="px-4 py-2 text-xs text-muted-foreground">{t.category}</td>
                  <td className="px-4 py-2">
                    {t.status === 'working' ? (
                      <Badge variant="success">Live</Badge>
                    ) : (
                      <Badge variant="warn">Soon</Badge>
                    )}
                  </td>
                  <td className="px-4 py-2 text-xs">
                    <span className="space-x-1">
                      {t.popular && <Badge variant="secondary">popular</Badge>}
                      {t.trending && <Badge variant="default">trending</Badge>}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Link href={`/tools/${t.slug}`} target="_blank" className="inline-flex items-center gap-1 text-primary hover:underline">
                      Open <ExternalLink className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
