/**
 * Lightweight blog posts store. Posts live here as data so the site has
 * indexable, SEO-rich content from day one. Migrate to MDX or a CMS later
 * without changing routes.
 */

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date
  author: string;
  tags: string[];
  cover?: string;
  body: string; // raw HTML
}

export const POSTS: BlogPost[] = [
  {
    slug: 'how-to-compress-image-to-specific-kb',
    title: 'How to compress an image to a specific KB (and keep it sharp)',
    description: 'A practical guide to reducing image file size to an exact KB target — without losing visible quality.',
    publishedAt: '2026-05-10',
    author: 'GOLUSOFT Team',
    tags: ['image', 'compression', 'tutorial'],
    body: `
<p>If you've ever uploaded a photo to a government portal, a job application, or an exam form, you've probably hit the dreaded message: <em>"File must be smaller than 50 KB"</em>. Compressing to a specific size is one of the most common image tasks on the web — and one of the trickiest to get right.</p>

<h2>Why "compress to X KB" is hard</h2>
<p>JPEG quality and file size are not linear. Dropping from quality 90 to 85 might save 30% on one image and 5% on another, depending on how much detail the photo contains. That's why most "compress to 50 KB" tools fail — they pick a fixed quality and hope for the best.</p>

<h2>The right way: iterate</h2>
<p>The technique that works is binary search on quality. Start with a high quality, encode the image, measure the size, and adjust quality up or down until you converge on the target. The Smart Image Compressor on GOLUSOFT does this automatically.</p>

<ol>
  <li>Open <a href="/tools/image-compressor">the Image Compressor</a>.</li>
  <li>Switch to the <strong>Target size</strong> tab.</li>
  <li>Type your target (for example, 50 or 200 KB).</li>
  <li>Drag in your image and click <strong>Compress all</strong>.</li>
</ol>

<h2>Tips for better results</h2>
<ul>
  <li>Convert PNG to JPG when you don't need transparency — it cuts size dramatically.</li>
  <li>If you must hit a tiny target like 20 KB, also reduce the resolution. Most forms only need ~600px wide.</li>
  <li>WebP can give you 25-35% better compression than JPG at the same quality.</li>
</ul>

<h2>Why we run it in the browser</h2>
<p>Other tools upload your photo to a server, queue it, process it, and send it back. We don't. Everything happens in your browser using <code>browser-image-compression</code> and Canvas. Your file never leaves your device.</p>
`,
  },
  {
    slug: 'compress-pdf-without-losing-quality',
    title: 'Compress a PDF without losing quality: what actually works',
    description: 'Behind the scenes of PDF compression — and which trade-offs to choose for your use case.',
    publishedAt: '2026-05-08',
    author: 'GOLUSOFT Team',
    tags: ['pdf', 'compression', 'tutorial'],
    body: `
<p>"Compress this PDF" sounds simple, but PDFs are one of the most complex file formats on the web. Inside a PDF you can find vector text, raster images, embedded fonts, forms, JavaScript, attachments, and digital signatures. Compressing each of those is a different problem.</p>

<h2>Two real strategies</h2>
<h3>1. Lossless re-save</h3>
<p>Most PDFs are full of redundant objects. Re-saving with optimal object streams can shave 10-25% off the file size with no visible change.</p>

<h3>2. Page rasterization</h3>
<p>For dramatic reduction (50-85% smaller), render every page to a JPEG and rebuild the PDF. The trade-off: text is no longer searchable. This is the right choice when emailing a scan or sharing a flyer.</p>

<h2>Which mode should I use?</h2>
<ul>
  <li><strong>Documents with text I'll search later</strong>: Low (lossless re-save).</li>
  <li><strong>Scans and image-heavy reports</strong>: Medium or High.</li>
  <li><strong>Hard size limit (e.g., 1 MB email cap)</strong>: Use the <a href="/tools/pdf-compressor">Target size</a> mode.</li>
</ul>

<h2>How GOLUSOFT does it</h2>
<p>Our PDF compressor uses pdf-lib for the structural work and pdfjs-dist for rendering — both run in your browser. There's no upload, no queue, and no server fees. Files are processed locally, in front of you.</p>
`,
  },
  {
    slug: 'best-image-format-for-the-web',
    title: 'JPG vs PNG vs WebP vs AVIF: which image format should you use in 2026?',
    description: 'A practical comparison of the four image formats every developer and creator should know.',
    publishedAt: '2026-05-04',
    author: 'GOLUSOFT Team',
    tags: ['image', 'format', 'guide'],
    body: `
<p>Use the wrong image format and you waste bandwidth, battery, and money. Pick the right one and pages load faster, customers convert better, and Lighthouse stops yelling at you.</p>

<h2>The short answer</h2>
<ul>
  <li>Photos with no transparency → <strong>WebP</strong> (with JPG fallback).</li>
  <li>Photos with transparency → <strong>WebP</strong> or <strong>PNG</strong>.</li>
  <li>Logos, icons, screenshots → <strong>PNG</strong> or <strong>SVG</strong>.</li>
  <li>Cutting-edge sites that don't need legacy support → <strong>AVIF</strong>.</li>
</ul>

<h2>WebP vs JPG</h2>
<p>WebP is on average 25-35% smaller than JPG at the same visual quality. Browser support is universal in 2026. Use it.</p>

<h2>AVIF</h2>
<p>AVIF compresses even better than WebP — often 50% smaller than JPG — but encoding is slower. For a CDN-served thumbnail, that's fine. For a tool running in the browser, the trade-off is harder.</p>

<h2>How to convert</h2>
<p>Use the <a href="/tools/image-converter">Smart Image Converter</a> to switch between any of these. Batch conversion supported, ZIP download included.</p>
`,
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return [...POSTS].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}
