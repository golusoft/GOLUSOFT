import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/site';

export const runtime = 'edge';
export const alt = `${siteConfig.name} — Free Image & PDF tools`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0b1220 0%, #1e3a8a 50%, #4c1d95 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '64px 80px',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 64, height: 64, borderRadius: 16,
              background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 40, fontWeight: 900,
            }}
          >
            G
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1 }}>{siteConfig.name}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, maxWidth: 1000 }}>
            Free Image &amp; PDF tools that just work.
          </div>
          <div style={{ fontSize: 28, opacity: 0.85, maxWidth: 900 }}>
            Compress, resize, convert, merge — all in your browser. No signup. No watermark.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 24, fontSize: 22, opacity: 0.8 }}>
          <span>100% Free</span>
          <span>·</span>
          <span>Privacy First</span>
          <span>·</span>
          <span>100+ Tools</span>
        </div>
      </div>
    ),
    size
  );
}
