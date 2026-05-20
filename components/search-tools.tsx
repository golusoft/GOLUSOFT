'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { TOOLS } from '@/lib/tools';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchToolsProps {
  size?: 'default' | 'lg';
  className?: string;
  placeholder?: string;
}

export function SearchTools({ size = 'default', className, placeholder = 'Search 100+ tools — try "compress", "merge pdf", "qr code"…' }: SearchToolsProps) {
  const router = useRouter();
  const [q, setQ] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [hl, setHl] = React.useState(0);
  const wrap = React.useRef<HTMLDivElement>(null);

  const results = React.useMemo(() => {
    if (!q.trim()) return [];
    const needle = q.toLowerCase();
    return TOOLS.filter((t) =>
      t.title.toLowerCase().includes(needle) ||
      t.description.toLowerCase().includes(needle) ||
      t.keywords.some((k) => k.includes(needle))
    ).slice(0, 8);
  }, [q]);

  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHl((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHl((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = results[hl];
      if (target) {
        router.push(`/tools/${target.slug}`);
        setOpen(false);
        setQ('');
      } else if (q.trim()) {
        router.push(`/search?q=${encodeURIComponent(q)}`);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div ref={wrap} className={cn('relative w-full', className)}>
      <div className="relative">
        <Search className={cn('absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground', size === 'lg' ? 'h-5 w-5' : 'h-4 w-4')} />
        <Input
          aria-label="Search tools"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); setHl(0); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          placeholder={placeholder}
          className={cn(size === 'lg' ? 'h-14 pl-11 pr-10 text-base' : 'h-11 pl-10 pr-10')}
        />
        {q && (
          <button
            aria-label="Clear search"
            onClick={() => { setQ(''); setOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {open && results.length > 0 && (
        <div className="absolute z-30 mt-2 w-full rounded-xl border border-border/60 bg-popover shadow-lg overflow-hidden">
          <ul className="max-h-96 overflow-auto py-1">
            {results.map((t, i) => {
              const Icon = t.icon;
              return (
                <li key={t.slug}>
                  <Link
                    href={`/tools/${t.slug}`}
                    onClick={() => { setOpen(false); setQ(''); }}
                    onMouseEnter={() => setHl(i)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 text-sm',
                      hl === i ? 'bg-accent' : ''
                    )}
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{t.shortTitle || t.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{t.description}</div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
