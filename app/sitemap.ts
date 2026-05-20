import type { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/tools';
import { getAllPosts } from '@/lib/blog';
import { siteConfig } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${siteConfig.url}/tools`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteConfig.url}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteConfig.url}/search`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${siteConfig.url}/trending`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${siteConfig.url}/new`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${siteConfig.url}/sitemap-page`, lastModified: now, changeFrequency: 'weekly', priority: 0.4 },
    { url: `${siteConfig.url}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteConfig.url}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${siteConfig.url}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteConfig.url}/feedback`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${siteConfig.url}/support`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${siteConfig.url}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteConfig.url}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteConfig.url}/disclaimer`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteConfig.url}/dmca`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteConfig.url}/cookie-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const toolPages: MetadataRoute.Sitemap = TOOLS.map((t) => ({
    url: `${siteConfig.url}/tools/${t.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: t.popular ? 0.9 : t.status === 'working' ? 0.8 : 0.6,
  }));

  const blogPages: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
    url: `${siteConfig.url}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...toolPages, ...blogPages];
}
