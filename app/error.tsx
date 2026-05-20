'use client';

import * as React from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  React.useEffect(() => {
    // Forward to error tracking provider if configured
    // eslint-disable-next-line no-console
    console.error('[GOLUSOFT] page error:', error);
  }, [error]);

  return (
    <div className="container-tight py-24 text-center">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4">
        <AlertTriangle className="h-7 w-7" />
      </span>
      <h1 className="text-3xl md:text-4xl font-extrabold">Something went wrong</h1>
      <p className="mt-3 text-muted-foreground max-w-md mx-auto">
        We hit an unexpected error. Please try again — and if it keeps happening, let us know.
      </p>
      {error.digest && <p className="mt-2 text-xs font-mono text-muted-foreground">Error ID: {error.digest}</p>}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button onClick={reset} variant="gradient">
          <RotateCcw className="h-4 w-4" /> Try again
        </Button>
        <Link href="/"><Button variant="outline">Go home</Button></Link>
        <Link href="/contact"><Button variant="ghost">Report issue</Button></Link>
      </div>
    </div>
  );
}
