import Link from 'next/link';
import { Search, Home } from 'lucide-react';
import { TOOLS } from '@/lib/tools';
import { Button } from '@/components/ui/button';
import { ToolCard } from '@/components/tool-card';

export default function NotFound() {
  const popular = TOOLS.filter((t) => t.popular).slice(0, 6);
  return (
    <div className="container-wide py-16 md:py-24">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-7xl md:text-9xl font-extrabold gradient-text">404</p>
        <h1 className="mt-3 text-2xl md:text-4xl font-extrabold">Page not found</h1>
        <p className="mt-3 text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link href="/"><Button variant="gradient"><Home className="h-4 w-4" /> Go home</Button></Link>
          <Link href="/tools"><Button variant="outline">Browse tools</Button></Link>
          <Link href="/search"><Button variant="ghost"><Search className="h-4 w-4" /> Search</Button></Link>
        </div>
      </div>

      <div className="mt-14">
        <h2 className="text-xl font-semibold text-center mb-6">Popular tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto">
          {popular.map((t) => <ToolCard key={t.slug} tool={t} variant="compact" />)}
        </div>
      </div>
    </div>
  );
}
