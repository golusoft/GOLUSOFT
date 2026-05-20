import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity } from 'lucide-react';

export default function AdminAnalyticsPage() {
  // Placeholder: in production wire to GA Data API or Plausible /api/v1/stats.
  const placeholder = [
    { metric: 'Page views (last 28 days)', value: '—' },
    { metric: 'Unique visitors', value: '—' },
    { metric: 'Top tool', value: '—' },
    { metric: 'Top traffic source', value: '—' },
    { metric: 'Avg time on page', value: '—' },
    { metric: 'Bounce rate', value: '—' },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Wire this dashboard up to your analytics provider (Google Analytics Data API, Plausible, or self-hosted).
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {placeholder.map((p) => (
          <div key={p.metric} className="rounded-xl border border-border/60 bg-card p-4">
            <Activity className="h-5 w-5 text-primary mb-2" />
            <p className="text-xs text-muted-foreground">{p.metric}</p>
            <p className="mt-1 text-3xl font-extrabold">{p.value}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How to wire this up</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-1.5 text-sm text-muted-foreground">
            <li>Add a server action that calls your analytics provider's API (GA Data API, Plausible, Umami).</li>
            <li>Cache the response with React's <code>cache()</code> or Next's <code>unstable_cache</code> for 5-15 minutes.</li>
            <li>Replace the placeholder values above with the cached numbers.</li>
            <li>Optionally render Recharts/Tremor charts for time-series.</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
