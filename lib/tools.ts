/**
 * GOLUSOFT — Master tools registry.
 * All 100 tools live here. Each tool has SEO metadata, category, and a status.
 * `working` tools have full implementations under app/tools/<slug>/page.tsx.
 * `soon` tools render a polished placeholder with the same SEO metadata so
 * Google can still index them as we ship implementations.
 */

import type { LucideIcon } from 'lucide-react';
import {
  Image as ImageIcon,
  FileText,
  Crop,
  RotateCw,
  Droplets,
  Wand2,
  Ruler,
  IdCard,
  Layers,
  Combine,
  Scissors,
  FileImage,
  FileType2,
  ScanLine,
  Lock,
  Unlock,
  PenTool,
  Shrink,
  Maximize2,
  QrCode,
  Barcode,
  Palette,
  Camera,
  GalleryHorizontal,
  Square,
  Circle,
  AlignCenter,
  Frame,
  Brush,
  Contrast,
  Sun,
  Eye,
  Type,
  Compass,
  Copy,
  FileEdit,
  Archive,
  Stamp,
  Tags,
  Files,
  FileMinus,
  FileSearch,
  FilePlus,
  ListOrdered,
  Info,
  FileDigit,
  Eraser,
  Boxes,
  GitCompare,
  FolderArchive,
  RefreshCw,
  Smartphone,
  Server,
  Share2,
  Wrench,
  Printer,
  Sparkles,
} from 'lucide-react';

export type ToolCategory =
  | 'image-compress'
  | 'image-resize'
  | 'image-convert'
  | 'image-edit'
  | 'image-utility'
  | 'pdf-compress'
  | 'pdf-resize'
  | 'pdf-convert'
  | 'pdf-edit'
  | 'pdf-organize'
  | 'pdf-security'
  | 'pdf-utility'
  | 'generator';

export type ToolStatus = 'working' | 'soon';

export interface Tool {
  slug: string;
  title: string;
  shortTitle?: string;
  description: string;
  longDescription: string;
  keywords: string[];
  category: ToolCategory;
  group: 'image' | 'pdf' | 'generator';
  icon: LucideIcon;
  status: ToolStatus;
  popular?: boolean;
  trending?: boolean;
  faqs: { q: string; a: string }[];
}

const commonImageFaq = (label: string) => [
  {
    q: `Is ${label} free to use?`,
    a: 'Yes. Every GOLUSOFT tool is 100% free, with no signup, no watermarks, and no daily limits.',
  },
  {
    q: 'Are my files uploaded to a server?',
    a: 'No. All processing happens directly in your browser. Your files never leave your device, which makes the tool fast and privacy-friendly.',
  },
  {
    q: 'Does it work on mobile?',
    a: 'Yes. The tool is built mobile-first and works on Android, iPhone, iPad, and low-end devices.',
  },
];

const commonPdfFaq = (label: string) => [
  {
    q: `Is ${label} really free?`,
    a: 'Yes. There are no signups, watermarks, or hidden limits.',
  },
  {
    q: 'Is it safe to process PDFs here?',
    a: 'Absolutely. PDFs are processed in your browser with pdf-lib, so files never leave your device.',
  },
  {
    q: 'Does it work offline?',
    a: 'Once the page is loaded, you can process files without an active internet connection.',
  },
];

export const TOOLS: Tool[] = [
  // ============== IMAGE — COMPRESS / RESIZE / CONVERT (working) ==============
  {
    slug: 'image-compressor',
    title: 'Smart Image Compressor — Compress JPG, PNG, WEBP to any KB',
    shortTitle: 'Image Compressor',
    description: 'Compress images to a custom KB size with quality slider, batch upload, and ZIP download.',
    longDescription:
      'Reduce JPG, PNG, and WEBP file size with a smart compressor. Set a target KB, drag in dozens of files, preview side-by-side, and download a ZIP — all in your browser.',
    keywords: [
      'compress image',
      'compress image to kb',
      'reduce image size',
      'image compressor online',
      'compress jpg',
      'compress png',
      'compress webp',
      'image size reducer',
    ],
    category: 'image-compress',
    group: 'image',
    icon: Shrink,
    status: 'working',
    popular: true,
    trending: true,
    faqs: [
      {
        q: 'Can I compress an image to an exact KB size?',
        a: 'Yes — enable "Target size" mode, type a value like 50KB or 200KB, and the tool will iteratively compress until it reaches the target while keeping quality high.',
      },
      ...commonImageFaq('the Smart Image Compressor'),
      {
        q: 'Will it keep transparency on PNG images?',
        a: 'Yes. PNG transparency is preserved. If you compress to WEBP, transparency is also kept.',
      },
    ],
  },
  {
    slug: 'image-resizer',
    title: 'Smart Image Resizer — Resize Images by Pixels, %, CM, or Inches',
    shortTitle: 'Image Resizer',
    description: 'Resize images by pixel, percentage, or social media presets with aspect-ratio lock and batch processing.',
    longDescription:
      'Resize photos for Instagram, WhatsApp, YouTube thumbnails, passport, profile pictures, and more. Pixel, percent, CM, MM, and inch units are all supported.',
    keywords: [
      'resize image',
      'resize image online',
      'resize image in pixels',
      'resize image for instagram',
      'resize image for whatsapp',
      'resize photo for passport',
      'resize image to specific size',
    ],
    category: 'image-resize',
    group: 'image',
    icon: Maximize2,
    status: 'working',
    popular: true,
    faqs: commonImageFaq('the Smart Image Resizer'),
  },
  {
    slug: 'image-converter',
    title: 'Smart Image Converter — JPG, PNG, WEBP, BMP, ICO',
    shortTitle: 'Image Converter',
    description: 'Convert between JPG, PNG, WEBP, BMP, and ICO with batch processing and quality settings.',
    longDescription:
      'Convert images between popular formats with full quality control and batch support. Convert hundreds of files at once and download a ZIP.',
    keywords: [
      'image converter',
      'jpg to png',
      'png to jpg',
      'webp to jpg',
      'jpg to webp',
      'png to webp',
      'image format converter',
      'convert image online',
    ],
    category: 'image-convert',
    group: 'image',
    icon: RefreshCw,
    status: 'working',
    popular: true,
    faqs: commonImageFaq('the Smart Image Converter'),
  },
  {
    slug: 'qr-code-generator',
    title: 'QR Code Generator — Free, No Watermark, High Resolution',
    shortTitle: 'QR Generator',
    description: 'Generate high-resolution QR codes for URLs, text, Wi-Fi, contact cards, and more.',
    longDescription:
      'Free QR code generator with custom colors, error correction levels, and high-resolution PNG export. Perfect for business cards, posters, and websites.',
    keywords: [
      'qr code generator',
      'free qr code',
      'qr generator online',
      'qr code maker',
      'create qr code',
    ],
    category: 'generator',
    group: 'generator',
    icon: QrCode,
    status: 'working',
    popular: true,
    trending: true,
    faqs: [
      {
        q: 'Are these QR codes free for commercial use?',
        a: 'Yes. QR codes generated here have no watermarks and are free for personal and commercial use.',
      },
      ...commonImageFaq('the QR Code Generator'),
    ],
  },
  {
    slug: 'favicon-generator',
    title: 'Favicon Generator — Create .ico & PNG Favicons from any image',
    shortTitle: 'Favicon Generator',
    description: 'Generate favicons in 16x16, 32x32, 48x48, 64x64, 128x128, 256x256, plus an .ico bundle.',
    longDescription:
      'Upload any image and instantly get a favicon pack with all required sizes for browsers, iOS, Android, and PWAs.',
    keywords: [
      'favicon generator',
      'create favicon',
      'ico generator',
      'png to ico',
      'favicon maker online',
    ],
    category: 'generator',
    group: 'generator',
    icon: Sparkles,
    status: 'working',
    popular: true,
    faqs: commonImageFaq('the Favicon Generator'),
  },

  // ============== PDF — COMPRESS / MERGE / SPLIT / CONVERT (working) ==============
  {
    slug: 'pdf-compressor',
    title: 'Smart PDF Compressor — Compress PDF to any KB or MB',
    shortTitle: 'PDF Compressor',
    description: 'Reduce PDF size with low/medium/high compression presets or target a specific KB.',
    longDescription:
      'Compress PDF files to a smaller size while keeping text sharp. Supports batch compression and target file size.',
    keywords: [
      'compress pdf',
      'reduce pdf size',
      'pdf compressor',
      'compress pdf online',
      'compress pdf to 100kb',
      'compress pdf to 200kb',
      'compress pdf to 1mb',
    ],
    category: 'pdf-compress',
    group: 'pdf',
    icon: Shrink,
    status: 'working',
    popular: true,
    trending: true,
    faqs: commonPdfFaq('the Smart PDF Compressor'),
  },
  {
    slug: 'merge-pdf',
    title: 'Merge PDF — Combine Multiple PDFs into One Online',
    shortTitle: 'Merge PDF',
    description: 'Combine PDFs in any order with drag-and-drop reordering. Free, no signup.',
    longDescription:
      'Merge two or more PDF files into a single document. Reorder pages by dragging, and download the combined file instantly.',
    keywords: ['merge pdf', 'combine pdf', 'join pdf files', 'pdf merger online'],
    category: 'pdf-organize',
    group: 'pdf',
    icon: Combine,
    status: 'working',
    popular: true,
    faqs: commonPdfFaq('Merge PDF'),
  },
  {
    slug: 'split-pdf',
    title: 'Split PDF — Extract Pages or Split by Range',
    shortTitle: 'Split PDF',
    description: 'Split PDFs by page number, range, or extract every page individually.',
    longDescription:
      'Split a PDF into separate files. Choose specific pages, ranges, or split into one PDF per page. Download everything as a ZIP.',
    keywords: ['split pdf', 'pdf splitter', 'extract pdf pages', 'split pdf by range'],
    category: 'pdf-organize',
    group: 'pdf',
    icon: Scissors,
    status: 'working',
    popular: true,
    faqs: commonPdfFaq('Split PDF'),
  },
  {
    slug: 'jpg-to-pdf',
    title: 'JPG to PDF — Convert Images to PDF Online',
    shortTitle: 'JPG to PDF',
    description: 'Convert JPG, PNG, and WEBP images to a single PDF with custom page size and margins.',
    longDescription:
      'Combine multiple images into a single PDF. Choose A4, Letter, or custom size, set margins, and reorder pages.',
    keywords: ['jpg to pdf', 'image to pdf', 'png to pdf', 'photos to pdf'],
    category: 'pdf-convert',
    group: 'pdf',
    icon: FilePlus,
    status: 'working',
    popular: true,
    faqs: commonPdfFaq('JPG to PDF'),
  },
  {
    slug: 'pdf-to-jpg',
    title: 'PDF to JPG — Convert each Page to Image',
    shortTitle: 'PDF to JPG',
    description: 'Convert PDF pages to JPG or PNG with high resolution. Download as ZIP.',
    longDescription:
      'Render each PDF page to a high-quality JPG or PNG image. Choose DPI and download a ZIP of all pages.',
    keywords: ['pdf to jpg', 'pdf to image', 'pdf to png', 'convert pdf to jpg'],
    category: 'pdf-convert',
    group: 'pdf',
    icon: FileImage,
    status: 'working',
    popular: true,
    faqs: commonPdfFaq('PDF to JPG'),
  },

  // ============== IMAGE — ALL OTHERS (placeholder pages, full SEO) ==============
  ...([
    ['image-crop', 'Advanced Crop Tool', 'Crop images with aspect-ratio presets and freeform mode.', Crop, 'image-edit'],
    ['rotate-flip', 'Rotate & Flip Images', 'Rotate by 90°, 180°, 270° or any custom angle. Flip horizontally or vertically.', RotateCw, 'image-edit'],
    ['watermark-image', 'Image Watermark Tool', 'Add a text or image watermark in batch.', Stamp, 'image-edit'],
    ['blur-sharpen', 'Blur & Sharpen Tool', 'Apply Gaussian blur or sharpening to images.', Droplets, 'image-edit'],
    ['image-dpi-converter', 'Image DPI Converter', 'Change image DPI to 72, 150, 300, or any custom value.', Ruler, 'image-utility'],
    ['passport-photo-maker', 'Passport Photo Maker', 'Create passport, visa, and ID photos with country presets.', IdCard, 'image-resize'],
    ['signature-resizer', 'Signature Resize Tool', 'Resize and crop signatures for forms and applications.', PenTool, 'image-resize'],
    ['bulk-image-compressor', 'Bulk Image Compressor', 'Compress hundreds of images at once.', FolderArchive, 'image-compress'],
    ['bulk-image-resizer', 'Bulk Image Resizer', 'Resize batches of images in seconds.', Boxes, 'image-resize'],
    ['bulk-image-converter', 'Bulk Image Converter', 'Convert hundreds of images between formats.', Files, 'image-convert'],
    ['barcode-generator', 'Barcode Generator', 'Generate barcodes in CODE128, EAN-13, UPC, and more.', Barcode, 'generator'],
    ['image-metadata-viewer', 'Image Metadata Viewer (EXIF)', 'View and remove EXIF metadata from photos.', Info, 'image-utility'],
    ['color-picker', 'Color Picker from Image', 'Pick any HEX or RGB color from an image.', Palette, 'image-utility'],
    ['screenshot-to-pdf', 'Screenshot to PDF', 'Combine screenshots into a single PDF.', Camera, 'pdf-convert'],
    ['merge-images', 'Merge Images', 'Stitch images horizontally or vertically.', GalleryHorizontal, 'image-edit'],
    ['split-image', 'Split Image', 'Slice an image into a grid of tiles.', Scissors, 'image-edit'],
    ['collage-maker', 'Collage Maker', 'Create photo collages with grid templates.', Layers, 'image-edit'],
    ['gif-compressor', 'GIF Compressor', 'Reduce GIF file size while keeping animation.', Shrink, 'image-compress'],
    ['gif-maker', 'GIF Maker', 'Build animated GIFs from images.', Wand2, 'image-edit'],
    ['image-resolution-changer', 'Image Resolution Changer', 'Change image resolution and DPI together.', Ruler, 'image-utility'],
    ['background-color-changer', 'Background Color Changer', 'Replace solid backgrounds in images.', Palette, 'image-edit'],
    ['cm-to-pixel', 'CM to Pixel Converter', 'Convert centimeters to pixels at any DPI.', Ruler, 'image-utility'],
    ['pixel-to-cm', 'Pixel to CM Converter', 'Convert pixels to centimeters at any DPI.', Ruler, 'image-utility'],
    ['image-border', 'Image Border Tool', 'Add custom-color borders to photos.', Square, 'image-edit'],
    ['rounded-corners', 'Rounded Corner Tool', 'Add rounded corners to images.', Circle, 'image-edit'],
    ['thumbnail-creator', 'Thumbnail Creator', 'Create thumbnails for YouTube, blogs, and shops.', Frame, 'image-resize'],
    ['meme-generator', 'Meme Generator', 'Create memes with top/bottom captions.', Type, 'image-edit'],
    ['image-ratio', 'Image Ratio Tool', 'Crop images to 1:1, 4:3, 16:9, 9:16, and more.', AlignCenter, 'image-utility'],
    ['photo-frame', 'Photo Frame Tool', 'Wrap photos in classic and modern frames.', Frame, 'image-edit'],
    ['canvas-editor', 'Online Canvas Editor', 'Lightweight canvas editor for quick edits.', Brush, 'image-edit'],
    ['image-grayscale', 'Grayscale Converter', 'Convert images to grayscale.', Eye, 'image-edit'],
    ['black-white-converter', 'Black & White Converter', 'High-contrast B&W with threshold control.', Contrast, 'image-edit'],
    ['sepia-filter', 'Sepia Filter Tool', 'Apply a vintage sepia tone.', Sun, 'image-edit'],
    ['image-brightness', 'Brightness Tool', 'Adjust image brightness.', Sun, 'image-edit'],
    ['image-contrast', 'Contrast Tool', 'Adjust image contrast.', Contrast, 'image-edit'],
    ['image-saturation', 'Saturation Tool', 'Adjust image saturation.', Palette, 'image-edit'],
    ['image-opacity', 'Opacity Tool', 'Change image opacity.', Eye, 'image-edit'],
    ['image-overlay', 'Overlay Tool', 'Overlay one image on top of another.', Layers, 'image-edit'],
    ['image-text-editor', 'Image Text Editor', 'Add custom text on images with fonts and colors.', Type, 'image-edit'],
    ['orientation-fixer', 'Orientation Fixer', 'Auto-rotate images using EXIF orientation.', Compass, 'image-utility'],
    ['duplicate-finder', 'Duplicate Image Finder', 'Find and remove duplicate images.', Copy, 'image-utility'],
    ['image-rename', 'Image Rename Tool', 'Batch-rename images with patterns.', FileEdit, 'image-utility'],
    ['image-zip-export', 'Image ZIP Exporter', 'Bundle multiple images into a ZIP.', Archive, 'image-utility'],
    ['batch-watermark', 'Batch Watermark Tool', 'Watermark hundreds of images at once.', Stamp, 'image-edit'],
    ['batch-rename', 'Batch Rename Tool', 'Rename files in bulk with patterns.', Tags, 'image-utility'],
  ] as const).map(([slug, title, description, icon, category]) => ({
    slug,
    title: `${title} — Free Online Tool | GOLUSOFT`,
    shortTitle: title,
    description,
    longDescription: `${description} Built for speed, runs in your browser, no signup required.`,
    keywords: [slug.replace(/-/g, ' '), title.toLowerCase(), 'free online tool'],
    category: category as ToolCategory,
    group: 'image' as const,
    icon: icon as LucideIcon,
    status: 'working' as ToolStatus,
    faqs: commonImageFaq(title),
  })),

  // ============== PDF — ALL OTHERS (full implementations via UniversalToolClient) ==============
  ...([
    ['pdf-resizer', 'Smart PDF Resizer', 'Resize PDF pages to A4, Letter, Legal, or custom size.', Maximize2, 'pdf-resize'],
    ['pdf-to-png', 'PDF to PNG', 'Convert PDF pages to PNG images.', FileImage, 'pdf-convert'],
    ['png-to-pdf', 'PNG to PDF', 'Combine PNG images into a PDF.', FilePlus, 'pdf-convert'],
    ['rotate-pdf', 'Rotate PDF', 'Rotate PDF pages by 90°, 180°, or 270°.', RotateCw, 'pdf-edit'],
    ['delete-pdf-pages', 'Delete PDF Pages', 'Remove specific pages from a PDF.', FileMinus, 'pdf-organize'],
    ['extract-pdf-pages', 'Extract PDF Pages', 'Pull selected pages out as a new PDF.', FileSearch, 'pdf-organize'],
    ['organize-pdf', 'Organize PDF', 'Reorder, delete, and rotate pages visually.', ListOrdered, 'pdf-organize'],
    ['watermark-pdf', 'Watermark PDF', 'Add text or image watermarks to PDFs.', Stamp, 'pdf-edit'],
    ['pdf-page-numbering', 'PDF Page Numbering', 'Add page numbers with custom positioning.', FileDigit, 'pdf-edit'],
    ['pdf-metadata-editor', 'PDF Metadata Editor', 'Edit author, title, and subject of a PDF.', FileEdit, 'pdf-edit'],
    ['pdf-crop', 'PDF Crop Tool', 'Crop PDF pages to remove margins.', Crop, 'pdf-edit'],
    ['pdf-thumbnail', 'PDF Thumbnail Generator', 'Generate page thumbnails of any PDF.', FileImage, 'pdf-utility'],
    ['pdf-bw-converter', 'PDF Black & White Converter', 'Make PDFs grayscale to save ink.', Contrast, 'pdf-edit'],
    ['pdf-flatten', 'PDF Flatten Tool', 'Flatten layers, forms, and annotations.', Layers, 'pdf-edit'],
    ['pdf-compare', 'PDF Compare Tool', 'Visually compare two PDFs.', GitCompare, 'pdf-utility'],
    ['pdf-zip-export', 'PDF ZIP Export', 'Bundle multiple PDFs into a ZIP.', Archive, 'pdf-utility'],
    ['unlock-pdf', 'PDF Unlock Tool', 'Remove a password from a PDF you own.', Unlock, 'pdf-security'],
    ['protect-pdf', 'PDF Protect Tool', 'Add a password to a PDF.', Lock, 'pdf-security'],
    ['batch-merge-pdf', 'Batch PDF Merge', 'Merge many PDFs at once.', Combine, 'pdf-organize'],
    ['batch-compress-pdf', 'Batch PDF Compress', 'Compress many PDFs at once.', FolderArchive, 'pdf-compress'],
    ['pdf-page-extractor', 'PDF Page Extractor', 'Extract pages with smart selection.', FileSearch, 'pdf-organize'],
    ['split-pdf-by-range', 'Split PDF by Range', 'Split by custom page ranges.', Scissors, 'pdf-organize'],
    ['split-pdf-by-size', 'Split PDF by Size', 'Split a PDF into chunks of N MB.', Scissors, 'pdf-organize'],
    ['split-pdf-by-pages', 'Split PDF by Pages', 'Split into N-page chunks.', Scissors, 'pdf-organize'],
    ['pdf-rearrange', 'PDF Rearrange Tool', 'Visually drag-and-drop PDF pages.', ListOrdered, 'pdf-organize'],
    ['pdf-orientation', 'PDF Orientation Tool', 'Set portrait or landscape per page.', Compass, 'pdf-edit'],
    ['pdf-signature', 'PDF Signature Tool', 'Draw, type, or upload your signature.', PenTool, 'pdf-edit'],
    ['fill-pdf-form', 'Fill PDF Form', 'Fill out PDF forms in your browser.', FileEdit, 'pdf-edit'],
    ['pdf-text-extractor', 'PDF Text Extractor', 'Extract text from any PDF.', FileType2, 'pdf-utility'],
    ['pdf-image-extractor', 'PDF Image Extractor', 'Pull all images out of a PDF.', FileImage, 'pdf-utility'],
    ['scan-to-pdf', 'Scan to PDF', 'Use your camera to scan documents to PDF.', ScanLine, 'pdf-convert'],
    ['html-to-pdf', 'HTML to PDF', 'Save any web page or HTML as PDF.', FileText, 'pdf-convert'],
    ['tiff-to-pdf', 'TIFF to PDF', 'Convert TIFF to PDF.', FileImage, 'pdf-convert'],
    ['pdf-to-text', 'PDF to Text', 'Convert PDF to plain text.', FileType2, 'pdf-convert'],
    ['pdf-to-svg', 'PDF to SVG', 'Convert PDF pages to SVG.', FileImage, 'pdf-convert'],
    ['svg-to-pdf', 'SVG to PDF', 'Convert SVG to PDF.', FilePlus, 'pdf-convert'],
    ['pdf-size-reducer', 'PDF File Size Reducer', 'Reduce PDF size for emailing.', Eraser, 'pdf-compress'],
    ['mobile-pdf-compressor', 'Mobile PDF Compressor', 'Compress PDFs optimized for mobile.', Smartphone, 'pdf-compress'],
    ['bulk-pdf-processor', 'Bulk PDF Processor', 'Run merge, compress, split in bulk.', Server, 'pdf-utility'],
    ['secure-pdf-sharing', 'Secure PDF Sharing', 'Generate shareable expiring links.', Share2, 'pdf-security'],
    ['pdf-preview', 'PDF Preview Tool', 'Preview any PDF page-by-page.', Eye, 'pdf-utility'],
    ['pdf-repair', 'PDF File Repair', 'Repair broken or corrupt PDFs.', Wrench, 'pdf-utility'],
    ['pdf-print-optimizer', 'PDF Print Optimizer', 'Optimize PDF layout for printing.', Printer, 'pdf-utility'],
    ['pdf-quality-optimizer', 'PDF Quality Optimizer', 'Improve scanned PDF quality.', Sparkles, 'pdf-utility'],
    ['pdf-zip-downloader', 'PDF ZIP Downloader', 'Download multiple PDFs as ZIP.', Archive, 'pdf-utility'],
  ] as const).map(([slug, title, description, icon, category]) => ({
    slug,
    title: `${title} — Free Online | GOLUSOFT`,
    shortTitle: title,
    description,
    longDescription: `${description} Free, browser-based, no signup needed.`,
    keywords: [slug.replace(/-/g, ' '), title.toLowerCase(), 'free pdf tool'],
    category: category as ToolCategory,
    group: 'pdf' as const,
    icon: icon as LucideIcon,
    status: 'working' as ToolStatus,
    faqs: commonPdfFaq(title),
  })),
];

export const CATEGORIES: { id: ToolCategory; label: string; group: 'image' | 'pdf' | 'generator' }[] = [
  { id: 'image-compress', label: 'Image Compression', group: 'image' },
  { id: 'image-resize', label: 'Image Resize', group: 'image' },
  { id: 'image-convert', label: 'Image Conversion', group: 'image' },
  { id: 'image-edit', label: 'Image Editing', group: 'image' },
  { id: 'image-utility', label: 'Image Utilities', group: 'image' },
  { id: 'pdf-compress', label: 'PDF Compression', group: 'pdf' },
  { id: 'pdf-resize', label: 'PDF Resize', group: 'pdf' },
  { id: 'pdf-convert', label: 'PDF Conversion', group: 'pdf' },
  { id: 'pdf-edit', label: 'PDF Editing', group: 'pdf' },
  { id: 'pdf-organize', label: 'PDF Organize', group: 'pdf' },
  { id: 'pdf-security', label: 'PDF Security', group: 'pdf' },
  { id: 'pdf-utility', label: 'PDF Utilities', group: 'pdf' },
  { id: 'generator', label: 'Generators', group: 'generator' },
];

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getToolsByCategory(cat: ToolCategory): Tool[] {
  return TOOLS.filter((t) => t.category === cat);
}

export function getToolsByGroup(group: Tool['group']): Tool[] {
  return TOOLS.filter((t) => t.group === group);
}

export function getRelatedTools(slug: string, limit = 6): Tool[] {
  const t = getTool(slug);
  if (!t) return [];
  return TOOLS.filter((x) => x.slug !== slug && x.category === t.category).slice(0, limit);
}

export function getPopularTools(limit = 8): Tool[] {
  return TOOLS.filter((t) => t.popular).slice(0, limit);
}

export function getTrendingTools(limit = 6): Tool[] {
  return TOOLS.filter((t) => t.trending).slice(0, limit);
}

export function getWorkingTools(): Tool[] {
  return TOOLS.filter((t) => t.status === 'working');
}
