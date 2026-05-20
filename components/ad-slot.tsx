'use client';

import * as React from 'react';
import { siteConfig } from '@/lib/site';
import { cn } from '@/lib/utils';

/**
 * AdSense slot component.
 * Renders a hidden placeholder when no client ID is set so layouts don't shift.
 * When NEXT_PUBLIC_ADSENSE_CLIENT is configured, mounts an <ins> ad unit and pushes adsbygoogle.
 */
interface AdSlotProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  layout?: 'in-article' | 'in-feed';
  className?: string;
  responsive?: boolean;
  /** Visual placeholder height when no ad is configured (avoids CLS). */
  minHeight?: number;
  label?: string;
}

export function AdSlot({
  slot,
  format = 'auto',
  layout,
  className,
  responsive = true,
  minHeight = 100,
  label = 'Advertisement',
}: AdSlotProps) {
  const client = siteConfig.adsense.client;
  const ref = React.useRef<HTMLModElement | null>(null);

  React.useEffect(() => {
    if (!client || !slot) return;
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, [client, slot]);

  if (!client || !slot) {
    // Reserved space — keeps CLS stable. Hidden in production.
    return (
      <div
        aria-hidden
        className={cn(
          'flex items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/30 text-xs text-muted-foreground',
          className
        )}
        style={{ minHeight }}
      >
        <span className="opacity-40">{label}</span>
      </div>
    );
  }

  return (
    <div className={cn('block', className)} aria-label={label}>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block', minHeight }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-ad-layout={layout}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
