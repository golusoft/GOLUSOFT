import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function AdminErrorsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Error logs</h1>
        <p className="text-sm text-muted-foreground mt-1">Recent errors and exceptions from the platform.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>No recent errors</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center text-center py-10">
          <AlertTriangle className="h-12 w-12 text-emerald-500 mb-3" />
          <p className="text-muted-foreground max-w-md">
            Wire this view up to Sentry, Logtail, or your hosting provider's log API to surface recent exceptions, slow requests, and 5xx events.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
