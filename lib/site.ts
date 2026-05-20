export const siteConfig = {
  name: 'GOLUSOFT',
  tagline: 'Free Image & PDF Tools — Fast, Private, No Signup',
  description:
    'GOLUSOFT is a free online toolbox for compressing, resizing, converting, merging and editing images and PDFs. 100% free, no signup, no watermark. All processing happens in your browser.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://golusoft.com',
  ogImage: '/og.png',
  twitter: '@golusoft',
  keywords: [
    'image compressor',
    'pdf compressor',
    'compress image to KB',
    'resize image online',
    'merge pdf',
    'split pdf',
    'jpg to pdf',
    'pdf to jpg',
    'image converter',
    'free online tools',
    'reduce pdf size',
    'reduce image size',
  ],
  author: 'GOLUSOFT',
  links: {
    github: 'https://github.com/golusoft/GOLUSOFT',
    twitter: 'https://twitter.com/golusoft',
  },
  adsense: {
    client: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '',
  },
};

export type SiteConfig = typeof siteConfig;
