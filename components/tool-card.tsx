import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Tool } from '@/lib/tools';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  tool: Tool;
  variant?: 'default' | 'compact';
  className?: string;
}

export function ToolCard({ tool, variant = 'default', className }: ToolCardProps) {
  const Icon = tool.icon;
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={cn(
        'group relative flex flex-col rounded-xl border border-border/60 bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md',
        variant === 'compact' && 'p-4',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br shadow-sm',
            tool.group === 'image' && 'from-blue-500/15 to-violet-500/15 text-blue-600 dark:text-blue-400',
            tool.group === 'pdf' && 'from-rose-500/15 to-orange-500/15 text-rose-600 dark:text-rose-400',
            tool.group === 'generator' && 'from-emerald-500/15 to-teal-500/15 text-emerald-600 dark:text-emerald-400',
            variant === 'compact' ? 'h-9 w-9' : 'h-10 w-10'
          )}
        >
          <Icon className={cn(variant === 'compact' ? 'h-4 w-4' : 'h-5 w-5')} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className={cn('font-semibold leading-tight', variant === 'compact' ? 'text-sm' : 'text-base')}>
              {tool.shortTitle || tool.title}
            </h3>
            {tool.status === 'soon' && (
              <Badge variant="warn" className="text-[10px]">Soon</Badge>
            )}
            {tool.trending && tool.status === 'working' && (
              <Badge variant="success" className="text-[10px]">Hot</Badge>
            )}
          </div>
          <p className={cn('mt-1 text-muted-foreground line-clamp-2', variant === 'compact' ? 'text-xs' : 'text-sm')}>
            {tool.description}
          </p>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>
    </Link>
  );
}
