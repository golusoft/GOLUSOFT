import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { getAllPosts } from '@/lib/blog';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AdminBlogPage() {
  const posts = getAllPosts();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Blog</h1>
        <p className="text-sm text-muted-foreground mt-1">Posts are stored in <code>lib/blog.ts</code>. Migrate to MDX or a CMS without changing routes.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>{posts.length} posts</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Title</th>
                <th className="px-4 py-2 font-medium">Slug</th>
                <th className="px-4 py-2 font-medium">Date</th>
                <th className="px-4 py-2 font-medium">Tags</th>
                <th className="px-4 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p, i) => (
                <tr key={p.slug} className={i % 2 ? 'bg-muted/20' : ''}>
                  <td className="px-4 py-2 font-medium">{p.title}</td>
                  <td className="px-4 py-2 text-xs font-mono text-muted-foreground">{p.slug}</td>
                  <td className="px-4 py-2 text-xs text-muted-foreground">{p.publishedAt}</td>
                  <td className="px-4 py-2 text-xs">
                    {p.tags.map((t) => <Badge key={t} variant="secondary" className="mr-1">{t}</Badge>)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Link href={`/blog/${p.slug}`} target="_blank" className="inline-flex items-center gap-1 text-primary hover:underline">
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
