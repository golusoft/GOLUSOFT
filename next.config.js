/** @type {import('next').NextConfig} */

/**
 * Content-Security-Policy.
 * - 'unsafe-inline' for styles is required for Tailwind/Next.js inline styles.
 * - 'unsafe-eval' is required only for pdfjs-dist's worker. We pass `isEvalSupported: false`
 *   to pdf.js to mitigate this, but its worker still relies on dynamic imports/blob URLs.
 * - script-src includes Google AdSense + GA + cdnjs (pdf.js worker fallback).
 * - connect-src allows the same plus the GA collection endpoint and our origin.
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' https://fonts.gstatic.com data:",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://www.googletagmanager.com https://cdnjs.cloudflare.com",
  "connect-src 'self' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com https://cdnjs.cloudflare.com",
  "worker-src 'self' blob:",
  "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
  "manifest-src 'self'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@radix-ui/react-tabs', '@radix-ui/react-select'],
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // Long-cache static assets
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      // Edge-cache the sitemap and robots a bit but allow re-fetch
      {
        source: '/sitemap.xml',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=86400' }],
      },
      {
        source: '/robots.txt',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=86400' }],
      },
      // Never cache API
      {
        source: '/api/:path*',
        headers: [{ key: 'Cache-Control', value: 'no-store, max-age=0' }],
      },
    ];
  },
  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
      { source: '/index', destination: '/', permanent: true },
      { source: '/sitemap', destination: '/sitemap-page', permanent: false },
    ];
  },
};

module.exports = nextConfig;
