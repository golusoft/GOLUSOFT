import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { JsonLd } from '@/components/json-ld';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo';
import { siteConfig } from '@/lib/site';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1220' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  applicationName: siteConfig.name,
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  formatDetection: { telephone: false, email: false, address: false },
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    creator: siteConfig.twitter,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adsClient = siteConfig.adsense.client;

  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        {adsClient && (
          <Script
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsClient}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster richColors position="top-center" closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
