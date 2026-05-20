import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container-wide py-24 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold">Tool not found</h1>
      <p className="mt-3 text-muted-foreground">
        We couldn't find the tool you're looking for. It may have moved or been renamed.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link href="/tools"><Button variant="gradient">Browse all tools</Button></Link>
        <Link href="/"><Button variant="outline">Go home</Button></Link>
      </div>
    </div>
  );
}
