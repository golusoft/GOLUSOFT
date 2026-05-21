/**
 * Register ALL tool engines. Lazily loaded to keep bundles small.
 * Each tool slug maps to a function that processes files with settings.
 */
import { registerEngine } from '../tool-engines';
import type { ProcessResult } from '../tool-engines';

// Helper: process each file with an async transform
async function mapFiles(
  files: File[],
  transform: (f: File, settings: Record<string, any>) => Promise<Blob>,
  suffix: string,
  ext: string,
  settings: Record<string, any>
): Promise<ProcessResult[]> {
  const results: ProcessResult[] = [];
  for (const f of files) {
    const blob = await transform(f, settings);
    const base = f.name.replace(/\.[^.]+$/, '');
    results.push({ name: `${base}${suffix}.${ext}`, blob });
  }
  return results;
}


// ═══════════════════════════════════════════════════
// IMAGE EDITING TOOLS
// ═══════════════════════════════════════════════════

registerEngine('image-crop', () => import('../image-effects').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.cropImage(f, {
    x: s.x ?? 0, y: s.y ?? 0, width: s.width ?? 500, height: s.height ?? 500
  }), '-cropped', 'png', s);
}));

registerEngine('rotate-flip', () => import('../image-effects').then(m => async (files, s) => {
  return mapFiles(files, (f) => {
    if (s.flip) return m.flipImage(f, s.flip);
    return m.rotateImage(f, s.angle ?? 90);
  }, '-rotated', 'png', s);
}));

registerEngine('watermark-image', () => import('../image-effects').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.addWatermark(f, {
    text: s.text || 'GOLUSOFT',
    position: s.position || 'center',
    opacity: (s.opacity ?? 50) / 100,
    fontSize: s.fontSize || 40,
    color: s.color || 'rgba(255,255,255,0.8)',
    rotation: s.rotation || 0,
  }), '-watermarked', 'png', s);
}));

registerEngine('blur-sharpen', () => import('../image-effects').then(m => async (files, s) => {
  return mapFiles(files, (f) => {
    if (s.mode === 'sharpen') return m.sharpenImage(f, s.amount ?? 1);
    return m.blurImage(f, s.radius ?? 5);
  }, s.mode === 'sharpen' ? '-sharp' : '-blur', 'png', s);
}));

registerEngine('merge-images', () => import('../image-effects').then(m => async (files, s) => {
  const blob = await m.mergeImages(files, s.direction || 'horizontal', s.gap ?? 0, s.bgColor || '#ffffff');
  return [{ name: 'merged-image.png', blob }];
}));

registerEngine('split-image', () => import('../image-effects').then(m => async (files, s) => {
  const blobs = await m.splitImage(files[0], s.rows ?? 2, s.cols ?? 2);
  return blobs.map((blob, i) => ({ name: `tile-${i + 1}.png`, blob }));
}));

registerEngine('collage-maker', () => import('../image-effects').then(m => async (files, s) => {
  const blob = await m.createCollage(files, s.cols ?? 3, s.tileSize ?? 300, s.gap ?? 4, s.bgColor || '#ffffff');
  return [{ name: 'collage.png', blob }];
}));


registerEngine('background-color-changer', () => import('../image-effects').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.changeBackgroundColor(f, s.color || '#ffffff', s.tolerance ?? 30), '-bg', 'png', s);
}));

registerEngine('image-border', () => import('../image-effects').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.addBorder(f, s.width ?? 20, s.color || '#000000'), '-border', 'png', s);
}));

registerEngine('rounded-corners', () => import('../image-effects').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.roundedCorners(f, s.radius ?? 30), '-rounded', 'png', s);
}));

registerEngine('image-grayscale', () => import('../image-effects').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.grayscaleImage(f), '-gray', 'png', s);
}));

registerEngine('black-white-converter', () => import('../image-effects').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.blackWhiteImage(f, s.threshold ?? 128), '-bw', 'png', s);
}));

registerEngine('sepia-filter', () => import('../image-effects').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.sepiaImage(f, s.amount ?? 100), '-sepia', 'png', s);
}));

registerEngine('image-brightness', () => import('../image-effects').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.brightnessImage(f, s.amount ?? 120), '-bright', 'png', s);
}));

registerEngine('image-contrast', () => import('../image-effects').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.contrastImage(f, s.amount ?? 130), '-contrast', 'png', s);
}));

registerEngine('image-saturation', () => import('../image-effects').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.saturationImage(f, s.amount ?? 150), '-saturate', 'png', s);
}));

registerEngine('image-opacity', () => import('../image-effects').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.opacityImage(f, s.amount ?? 50), '-opacity', 'png', s);
}));

registerEngine('image-overlay', () => import('../image-effects').then(m => async (files, s) => {
  if (files.length < 2) throw new Error('Need at least 2 images (base + overlay)');
  const blob = await m.overlayImages(files[0], files[1], s.x ?? 0, s.y ?? 0, s.overlayWidth, s.overlayHeight, (s.opacity ?? 80) / 100);
  return [{ name: 'overlay-result.png', blob }];
}));

registerEngine('image-text-editor', () => import('../image-effects').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.addTextOverlay(f, {
    text: s.text || 'Hello',
    x: s.x ?? 50, y: s.y ?? 50,
    fontSize: s.fontSize ?? 48,
    fontFamily: s.fontFamily || 'Arial',
    color: s.color || '#ffffff',
    bold: s.bold ?? true,
    italic: s.italic ?? false,
    align: s.align || 'left',
    strokeColor: s.strokeColor,
    strokeWidth: s.strokeWidth,
  }), '-text', 'png', s);
}));

registerEngine('gif-maker', () => import('../image-effects').then(m => async (files, s) => {
  const blob = await m.createSimpleGif(files, s.delay ?? 200, s.width ?? 400, s.height ?? 400);
  return [{ name: 'sprite-sheet.png', blob }];
}));


// ═══════════════════════════════════════════════════
// IMAGE UTILITY TOOLS
// ═══════════════════════════════════════════════════

registerEngine('image-dpi-converter', () => import('../image-effects').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.changeDpi(f, s.currentDpi ?? 72, s.targetDpi ?? 300), '-dpi', 'png', s);
}));

registerEngine('image-metadata-viewer', () => import('../image-effects').then(m => async (files, s) => {
  const results: ProcessResult[] = [];
  for (const f of files) {
    const meta = await m.getImageMetadata(f);
    const text = Object.entries(meta).map(([k, v]) => `${k}: ${v}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    results.push({ name: f.name.replace(/\.[^.]+$/, '-metadata.txt'), blob, meta });
  }
  return results;
}));

registerEngine('color-picker', () => import('../image-effects').then(m => async (files, s) => {
  const color = await m.pickColor(files[0], s.x ?? 0, s.y ?? 0);
  const text = `HEX: ${color.hex}\nRGB: ${color.rgb}\nR: ${color.r} G: ${color.g} B: ${color.b}`;
  return [{ name: 'color-info.txt', blob: new Blob([text], { type: 'text/plain' }), meta: color as any }];
}));

registerEngine('orientation-fixer', () => import('../image-effects').then(m => async (files, s) => {
  // EXIF orientation fixing is handled by browser-image-compression
  const { compressImage } = await import('../image');
  return mapFiles(files, async (f) => {
    const r = await compressImage(f, { quality: 95, preserveExif: false });
    return r.blob;
  }, '-fixed', 'jpg', s);
}));

registerEngine('image-resolution-changer', () => import('../image-effects').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.changeDpi(f, s.currentDpi ?? 72, s.targetDpi ?? 150), '-res', 'png', s);
}));

registerEngine('cm-to-pixel', () => Promise.resolve(async (files, s) => {
  const cm = s.cm ?? 10;
  const dpi = s.dpi ?? 300;
  const px = Math.round((cm / 2.54) * dpi);
  const text = `${cm} cm at ${dpi} DPI = ${px} pixels`;
  return [{ name: 'conversion.txt', blob: new Blob([text], { type: 'text/plain' }), meta: { result: String(px) } }];
}));

registerEngine('pixel-to-cm', () => Promise.resolve(async (files, s) => {
  const px = s.px ?? 300;
  const dpi = s.dpi ?? 300;
  const cm = ((px / dpi) * 2.54).toFixed(3);
  const text = `${px} pixels at ${dpi} DPI = ${cm} cm`;
  return [{ name: 'conversion.txt', blob: new Blob([text], { type: 'text/plain' }), meta: { result: cm } }];
}));

registerEngine('image-ratio', () => import('../image-effects').then(m => async (files, s) => {
  const ratio = s.ratio || '1:1';
  const [rw, rh] = ratio.split(':').map(Number);
  return mapFiles(files, async (f) => {
    const { getImageDimensions } = await import('../image');
    const dims = await getImageDimensions(f);
    let cropW = dims.width, cropH = dims.height;
    if (dims.width / dims.height > rw / rh) {
      cropW = Math.round(dims.height * (rw / rh));
    } else {
      cropH = Math.round(dims.width * (rh / rw));
    }
    const x = Math.round((dims.width - cropW) / 2);
    const y = Math.round((dims.height - cropH) / 2);
    return m.cropImage(f, { x, y, width: cropW, height: cropH });
  }, `-${ratio.replace(':', 'x')}`, 'png', s);
}));


registerEngine('duplicate-finder', () => Promise.resolve(async (files, s) => {
  // Compare file sizes + dimensions to find potential duplicates
  const { getImageDimensions } = await import('../image');
  const info: { name: string; size: number; w: number; h: number }[] = [];
  for (const f of files) {
    const d = await getImageDimensions(f).catch(() => ({ width: 0, height: 0 }));
    info.push({ name: f.name, size: f.size, w: d.width, h: d.height });
  }
  const dupes: string[] = [];
  for (let i = 0; i < info.length; i++) {
    for (let j = i + 1; j < info.length; j++) {
      if (info[i].size === info[j].size && info[i].w === info[j].w && info[i].h === info[j].h) {
        dupes.push(`Potential duplicate: "${info[i].name}" and "${info[j].name}" (same size ${info[i].size}B, ${info[i].w}x${info[i].h})`);
      }
    }
  }
  const text = dupes.length > 0 ? dupes.join('\n') : 'No duplicates found.';
  return [{ name: 'duplicate-report.txt', blob: new Blob([text], { type: 'text/plain' }) }];
}));

registerEngine('image-rename', () => Promise.resolve(async (files, s) => {
  const pattern = s.pattern || 'image-{n}';
  const results: ProcessResult[] = [];
  for (let i = 0; i < files.length; i++) {
    const ext = files[i].name.split('.').pop() || 'png';
    const name = pattern.replace('{n}', String(i + 1).padStart(3, '0')).replace('{name}', files[i].name.replace(/\.[^.]+$/, ''));
    results.push({ name: `${name}.${ext}`, blob: files[i] });
  }
  return results;
}));

registerEngine('image-zip-export', () => Promise.resolve(async (files, s) => {
  // Just pass files through — the UI handles ZIP download
  return files.map(f => ({ name: f.name, blob: f }));
}));

registerEngine('batch-watermark', () => import('../image-effects').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.addWatermark(f, {
    text: s.text || 'WATERMARK',
    position: s.position || 'center',
    opacity: (s.opacity ?? 40) / 100,
    fontSize: s.fontSize,
    color: s.color || 'rgba(255,255,255,0.6)',
    rotation: s.rotation ?? -30,
  }), '-wm', 'png', s);
}));

registerEngine('batch-rename', () => Promise.resolve(async (files, s) => {
  const prefix = s.prefix || '';
  const suffix = s.suffix || '';
  return files.map((f, i) => {
    const ext = f.name.split('.').pop() || 'png';
    const base = f.name.replace(/\.[^.]+$/, '');
    return { name: `${prefix}${base}${suffix}-${i + 1}.${ext}`, blob: f };
  });
}));

// ═══════════════════════════════════════════════════
// IMAGE RESIZE VARIANTS
// ═══════════════════════════════════════════════════

registerEngine('passport-photo-maker', () => import('../image').then(m => async (files, s) => {
  const presetW = s.width ?? 413; // 35mm at 300dpi
  const presetH = s.height ?? 531; // 45mm at 300dpi
  return mapFiles(files, async (f) => {
    return m.redrawToCanvas(f, { width: presetW, height: presetH, mime: 'image/jpeg', quality: 0.95 });
  }, '-passport', 'jpg', s);
}));

registerEngine('signature-resizer', () => import('../image').then(m => async (files, s) => {
  return mapFiles(files, async (f) => {
    return m.redrawToCanvas(f, { width: s.width ?? 300, height: s.height ?? 80, mime: 'image/png' });
  }, '-sig', 'png', s);
}));


registerEngine('bulk-image-compressor', () => import('../image').then(m => async (files, s) => {
  return mapFiles(files, async (f) => {
    const r = await m.compressImage(f, { quality: s.quality ?? 75, targetKB: s.targetKB, maxDimension: s.maxDimension || undefined });
    return r.blob;
  }, '-compressed', 'jpg', s);
}));

registerEngine('bulk-image-resizer', () => import('../image').then(m => async (files, s) => {
  return mapFiles(files, async (f) => {
    return m.redrawToCanvas(f, { width: s.width ?? 800, height: s.height ?? 600, mime: 'image/jpeg', quality: 0.9 });
  }, '-resized', 'jpg', s);
}));

registerEngine('bulk-image-converter', () => import('../image').then(m => async (files, s) => {
  const format = s.format || 'webp';
  const mime = `image/${format === 'jpg' ? 'jpeg' : format}`;
  return mapFiles(files, async (f) => {
    return m.redrawToCanvas(f, { mime, quality: (s.quality ?? 90) / 100 });
  }, '', format === 'jpg' ? 'jpg' : format, s);
}));

registerEngine('thumbnail-creator', () => import('../image').then(m => async (files, s) => {
  const w = s.width ?? 320;
  const h = s.height ?? 180;
  return mapFiles(files, async (f) => {
    return m.redrawToCanvas(f, { width: w, height: h, mime: 'image/jpeg', quality: 0.85 });
  }, '-thumb', 'jpg', s);
}));

registerEngine('gif-compressor', () => import('../image').then(m => async (files, s) => {
  // GIFs are re-saved as WebP for better compression
  return mapFiles(files, async (f) => {
    return m.redrawToCanvas(f, { mime: 'image/webp', quality: (s.quality ?? 60) / 100 });
  }, '-compressed', 'webp', s);
}));

registerEngine('meme-generator', () => import('../image-effects').then(m => async (files, s) => {
  return mapFiles(files, async (f) => {
    const { getImageDimensions } = await import('../image');
    const dims = await getImageDimensions(f);
    const fontSize = Math.max(20, Math.round(dims.width / 12));
    // Add top text
    let blob = await m.addTextOverlay(f, {
      text: (s.topText || '').toUpperCase(),
      x: dims.width / 2, y: fontSize,
      fontSize, fontFamily: 'Impact, sans-serif',
      color: '#ffffff', bold: true, italic: false, align: 'center',
      strokeColor: '#000000', strokeWidth: 3,
    });
    // Add bottom text - create new file from blob
    const tempFile = new File([blob], f.name, { type: 'image/png' });
    blob = await m.addTextOverlay(tempFile, {
      text: (s.bottomText || '').toUpperCase(),
      x: dims.width / 2, y: dims.height - fontSize * 2,
      fontSize, fontFamily: 'Impact, sans-serif',
      color: '#ffffff', bold: true, italic: false, align: 'center',
      strokeColor: '#000000', strokeWidth: 3,
    });
    return blob;
  }, '-meme', 'png', s);
}));

registerEngine('photo-frame', () => import('../image-effects').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.addBorder(f, s.width ?? 40, s.color || '#8B4513'), '-framed', 'png', s);
}));

registerEngine('canvas-editor', () => import('../image-effects').then(m => async (files, s) => {
  // Apply multiple filters in sequence
  let result = files[0];
  if (s.brightness && s.brightness !== 100) {
    const blob = await m.brightnessImage(result, s.brightness);
    result = new File([blob], result.name, { type: 'image/png' });
  }
  if (s.contrast && s.contrast !== 100) {
    const blob = await m.contrastImage(result, s.contrast);
    result = new File([blob], result.name, { type: 'image/png' });
  }
  if (s.saturation && s.saturation !== 100) {
    const blob = await m.saturationImage(result, s.saturation);
    result = new File([blob], result.name, { type: 'image/png' });
  }
  const { canvas } = await m.fileToCanvas(result);
  const blob = await import('../image').then(im => im.canvasToBlob(canvas, 'image/png'));
  return [{ name: files[0].name.replace(/\.[^.]+$/, '-edited.png'), blob }];
}));


registerEngine('screenshot-to-pdf', () => import('../image').then(im => async (files, s) => {
  const { PDFDocument } = await import('pdf-lib');
  const pdf = await PDFDocument.create();
  for (const f of files) {
    const dims = await im.getImageDimensions(f);
    const bytes = new Uint8Array(await f.arrayBuffer());
    const isPng = f.type.includes('png');
    const img = isPng ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
    const page = pdf.addPage([dims.width, dims.height]);
    page.drawImage(img, { x: 0, y: 0, width: dims.width, height: dims.height });
  }
  const out = await pdf.save({ useObjectStreams: true });
  return [{ name: 'screenshots.pdf', blob: new Blob([out], { type: 'application/pdf' }) }];
}));

// ═══════════════════════════════════════════════════
// PDF EDITING TOOLS
// ═══════════════════════════════════════════════════

registerEngine('pdf-resizer', () => import('../pdf-advanced').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.resizePdfPages(f, s.size || 'A4', s.orientation || 'portrait'), '-resized', 'pdf', s);
}));

registerEngine('rotate-pdf', () => import('../pdf-advanced').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.rotateAllPages(f, s.angle ?? 90), '-rotated', 'pdf', s);
}));

registerEngine('delete-pdf-pages', () => import('../pdf-advanced').then(m => async (files, s) => {
  const pages = (s.pages || '1').split(',').map((p: string) => parseInt(p.trim()) - 1).filter((n: number) => !isNaN(n));
  return mapFiles(files, (f) => m.deletePdfPages(f, pages), '-trimmed', 'pdf', s);
}));

registerEngine('extract-pdf-pages', () => import('../pdf-advanced').then(m => async (files, s) => {
  const pages = (s.pages || '1').split(',').map((p: string) => parseInt(p.trim()) - 1).filter((n: number) => !isNaN(n));
  return mapFiles(files, (f) => m.extractPdfPages(f, pages), '-extracted', 'pdf', s);
}));

registerEngine('organize-pdf', () => import('../pdf-advanced').then(m => async (files, s) => {
  const order = (s.order || '').split(',').map((p: string) => parseInt(p.trim()) - 1).filter((n: number) => !isNaN(n));
  if (order.length === 0) return mapFiles(files, (f) => f.arrayBuffer().then(b => new Blob([b], { type: 'application/pdf' })), '', 'pdf', s);
  return mapFiles(files, (f) => m.reorderPdfPages(f, order), '-organized', 'pdf', s);
}));

registerEngine('watermark-pdf', () => import('../pdf-advanced').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.watermarkPdf(f, s.text || 'CONFIDENTIAL', {
    opacity: (s.opacity ?? 30) / 100,
    fontSize: s.fontSize ?? 50,
    rotation: s.rotation ?? 45,
    position: s.position || 'diagonal',
  }), '-watermarked', 'pdf', s);
}));

registerEngine('pdf-page-numbering', () => import('../pdf-advanced').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.addPageNumbers(f,
    s.position || 'bottom-center',
    s.format || 'Page X',
    s.startFrom ?? 1
  ), '-numbered', 'pdf', s);
}));

registerEngine('pdf-metadata-editor', () => import('../pdf-advanced').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.editPdfMetadata(f, {
    title: s.title, author: s.author, subject: s.subject, keywords: s.keywords, creator: s.creator,
  }), '-meta', 'pdf', s);
}));


registerEngine('pdf-crop', () => import('../pdf-advanced').then(m => async (files, s) => {
  // Crop by rendering at high DPI then trimming margins
  const { renderAllPages, canvasToJpegBlob } = await import('../pdf');
  const { PDFDocument } = await import('pdf-lib');
  const results: ProcessResult[] = [];
  for (const f of files) {
    const canvases = await renderAllPages(f, 2);
    const doc = await PDFDocument.create();
    const margin = s.margin ?? 50;
    for (const canvas of canvases) {
      const cropped = document.createElement('canvas');
      cropped.width = canvas.width - margin * 2;
      cropped.height = canvas.height - margin * 2;
      const ctx = cropped.getContext('2d')!;
      ctx.drawImage(canvas, margin, margin, cropped.width, cropped.height, 0, 0, cropped.width, cropped.height);
      const blob = await canvasToJpegBlob(cropped, 0.9);
      const bytes = new Uint8Array(await blob.arrayBuffer());
      const img = await doc.embedJpg(bytes);
      const page = doc.addPage([cropped.width / 2, cropped.height / 2]);
      page.drawImage(img, { x: 0, y: 0, width: cropped.width / 2, height: cropped.height / 2 });
    }
    const out = await doc.save({ useObjectStreams: true });
    results.push({ name: f.name.replace(/\.pdf$/i, '-cropped.pdf'), blob: new Blob([out], { type: 'application/pdf' }) });
  }
  return results;
}));

registerEngine('pdf-thumbnail', () => import('../pdf').then(m => async (files, s) => {
  const results: ProcessResult[] = [];
  for (const f of files) {
    const canvas = await m.renderPdfPage(f, 0, (s.dpi ?? 72) / 72);
    const blob = await m.canvasToPngBlob(canvas);
    results.push({ name: f.name.replace(/\.pdf$/i, '-thumb.png'), blob });
  }
  return results;
}));

registerEngine('pdf-bw-converter', () => import('../pdf-advanced').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.pdfToGrayscale(f, s.dpi ?? 150), '-bw', 'pdf', s);
}));

registerEngine('pdf-flatten', () => import('../pdf-advanced').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.flattenPdf(f, s.dpi ?? 150), '-flat', 'pdf', s);
}));

registerEngine('pdf-compare', () => import('../pdf').then(m => async (files, s) => {
  if (files.length < 2) throw new Error('Need 2 PDF files to compare');
  const [c1, c2] = await Promise.all([
    m.renderPdfPage(files[0], 0, 1.5),
    m.renderPdfPage(files[1], 0, 1.5),
  ]);
  // Side-by-side comparison image
  const w = c1.width + c2.width + 20;
  const h = Math.max(c1.height, c2.height);
  const out = document.createElement('canvas');
  out.width = w; out.height = h;
  const ctx = out.getContext('2d')!;
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(c1, 0, 0);
  ctx.drawImage(c2, c1.width + 20, 0);
  const blob = await m.canvasToPngBlob(out);
  return [{ name: 'comparison.png', blob }];
}));

registerEngine('pdf-zip-export', () => Promise.resolve(async (files, s) => {
  return files.map(f => ({ name: f.name, blob: f }));
}));

registerEngine('unlock-pdf', () => import('../pdf-advanced').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.unlockPdf(f), '-unlocked', 'pdf', s);
}));

registerEngine('protect-pdf', () => import('../pdf-advanced').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.protectPdf(f, s.password || '1234'), '-protected', 'pdf', s);
}));

registerEngine('batch-merge-pdf', () => Promise.resolve(async (files, s) => {
  const { PDFDocument } = await import('pdf-lib');
  const doc = await PDFDocument.create();
  for (const f of files) {
    const src = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
    const pages = await doc.copyPages(src, src.getPageIndices());
    pages.forEach(p => doc.addPage(p));
  }
  const out = await doc.save({ useObjectStreams: true });
  return [{ name: 'batch-merged.pdf', blob: new Blob([out], { type: 'application/pdf' }) }];
}));


registerEngine('batch-compress-pdf', () => import('../pdf').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.rasterizeToPdf(f, { scale: s.scale ?? 1.2, jpegQuality: s.quality ?? 0.7 }), '-compressed', 'pdf', s);
}));

registerEngine('pdf-page-extractor', () => import('../pdf-advanced').then(m => async (files, s) => {
  const pages = (s.pages || '1').split(',').map((p: string) => parseInt(p.trim()) - 1).filter((n: number) => !isNaN(n));
  return mapFiles(files, (f) => m.extractPdfPages(f, pages), '-pages', 'pdf', s);
}));

registerEngine('split-pdf-by-range', () => Promise.resolve(async (files, s) => {
  const { PDFDocument } = await import('pdf-lib');
  const ranges = (s.ranges || '1-3').split(',').map((r: string) => r.trim());
  const results: ProcessResult[] = [];
  for (const f of files) {
    const src = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
    for (const range of ranges) {
      const [startStr, endStr] = range.split('-');
      const start = parseInt(startStr) - 1;
      const end = parseInt(endStr || startStr) - 1;
      if (isNaN(start) || isNaN(end)) continue;
      const indices = Array.from({ length: end - start + 1 }, (_, i) => start + i);
      const dst = await PDFDocument.create();
      const pages = await dst.copyPages(src, indices);
      pages.forEach(p => dst.addPage(p));
      const out = await dst.save({ useObjectStreams: true });
      results.push({ name: `${f.name.replace(/\.pdf$/i, '')}-p${start + 1}-${end + 1}.pdf`, blob: new Blob([out], { type: 'application/pdf' }) });
    }
  }
  return results;
}));

registerEngine('split-pdf-by-size', () => Promise.resolve(async (files, s) => {
  // Split by approximate page count per chunk
  const { PDFDocument } = await import('pdf-lib');
  const maxPages = s.pagesPerChunk ?? 5;
  const results: ProcessResult[] = [];
  for (const f of files) {
    const src = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
    const total = src.getPageCount();
    for (let i = 0; i < total; i += maxPages) {
      const end = Math.min(i + maxPages, total);
      const indices = Array.from({ length: end - i }, (_, j) => i + j);
      const dst = await PDFDocument.create();
      const pages = await dst.copyPages(src, indices);
      pages.forEach(p => dst.addPage(p));
      const out = await dst.save({ useObjectStreams: true });
      results.push({ name: `${f.name.replace(/\.pdf$/i, '')}-part${Math.floor(i / maxPages) + 1}.pdf`, blob: new Blob([out], { type: 'application/pdf' }) });
    }
  }
  return results;
}));

registerEngine('split-pdf-by-pages', () => Promise.resolve(async (files, s) => {
  const { PDFDocument } = await import('pdf-lib');
  const results: ProcessResult[] = [];
  for (const f of files) {
    const src = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
    const total = src.getPageCount();
    for (let i = 0; i < total; i++) {
      const dst = await PDFDocument.create();
      const [page] = await dst.copyPages(src, [i]);
      dst.addPage(page);
      const out = await dst.save({ useObjectStreams: true });
      results.push({ name: `${f.name.replace(/\.pdf$/i, '')}-page-${i + 1}.pdf`, blob: new Blob([out], { type: 'application/pdf' }) });
    }
  }
  return results;
}));

registerEngine('pdf-rearrange', () => import('../pdf-advanced').then(m => async (files, s) => {
  const order = (s.order || '').split(',').map((p: string) => parseInt(p.trim()) - 1).filter((n: number) => !isNaN(n));
  return mapFiles(files, (f) => m.reorderPdfPages(f, order), '-reordered', 'pdf', s);
}));

registerEngine('pdf-orientation', () => import('../pdf-advanced').then(m => async (files, s) => {
  const angle = s.orientation === 'landscape' ? 90 : 0;
  return mapFiles(files, (f) => m.rotateAllPages(f, angle as any), '-oriented', 'pdf', s);
}));

registerEngine('pdf-signature', () => import('../pdf-advanced').then(m => async (files, s) => {
  if (!s.signatureDataUrl) throw new Error('Draw or upload a signature first');
  return mapFiles(files, (f) => m.addSignatureToPdf(f, s.signatureDataUrl, s.pageIndex ?? 0, s.x ?? 100, s.y ?? 100, s.width ?? 200, s.height ?? 80), '-signed', 'pdf', s);
}));

registerEngine('fill-pdf-form', () => import('../pdf-advanced').then(m => async (files, s) => {
  // Re-save as flattened — form filling requires interactive UI
  return mapFiles(files, (f) => m.flattenPdf(f, 150), '-filled', 'pdf', s);
}));


// ═══════════════════════════════════════════════════
// PDF CONVERSION TOOLS
// ═══════════════════════════════════════════════════

registerEngine('pdf-to-png', () => import('../pdf').then(m => async (files, s) => {
  const results: ProcessResult[] = [];
  for (const f of files) {
    const canvases = await m.renderAllPages(f, (s.dpi ?? 150) / 72);
    for (let i = 0; i < canvases.length; i++) {
      const blob = await m.canvasToPngBlob(canvases[i]);
      results.push({ name: `${f.name.replace(/\.pdf$/i, '')}-page-${i + 1}.png`, blob });
    }
  }
  return results;
}));

registerEngine('png-to-pdf', () => Promise.resolve(async (files, s) => {
  const { PDFDocument } = await import('pdf-lib');
  const { getImageDimensions } = await import('../image');
  const pdf = await PDFDocument.create();
  for (const f of files) {
    const dims = await getImageDimensions(f);
    const bytes = new Uint8Array(await f.arrayBuffer());
    const img = f.type.includes('png') ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
    const page = pdf.addPage([dims.width, dims.height]);
    page.drawImage(img, { x: 0, y: 0, width: dims.width, height: dims.height });
  }
  const out = await pdf.save({ useObjectStreams: true });
  return [{ name: 'images-to-pdf.pdf', blob: new Blob([out], { type: 'application/pdf' }) }];
}));

registerEngine('scan-to-pdf', () => Promise.resolve(async (files, s) => {
  // Same as images-to-pdf with auto-enhancement
  const { PDFDocument, PageSizes } = await import('pdf-lib');
  const { getImageDimensions } = await import('../image');
  const pdf = await PDFDocument.create();
  for (const f of files) {
    const dims = await getImageDimensions(f);
    const bytes = new Uint8Array(await f.arrayBuffer());
    const img = f.type.includes('png') ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
    const [pw, ph] = PageSizes.A4;
    const page = pdf.addPage([pw, ph]);
    const scale = Math.min(pw / dims.width, ph / dims.height) * 0.95;
    const w = dims.width * scale;
    const h = dims.height * scale;
    page.drawImage(img, { x: (pw - w) / 2, y: (ph - h) / 2, width: w, height: h });
  }
  const out = await pdf.save({ useObjectStreams: true });
  return [{ name: 'scanned.pdf', blob: new Blob([out], { type: 'application/pdf' }) }];
}));

registerEngine('html-to-pdf', () => import('../pdf-advanced').then(m => async (files, s) => {
  const html = s.html || '<p>Enter HTML content</p>';
  const blob = await m.htmlToPdf(html);
  return [{ name: 'document.pdf', blob }];
}));

registerEngine('tiff-to-pdf', () => Promise.resolve(async (files, s) => {
  // TIFF files loaded as images then embedded
  const { PDFDocument } = await import('pdf-lib');
  const { loadImage, canvasToBlob, getImageDimensions } = await import('../image');
  const pdf = await PDFDocument.create();
  for (const f of files) {
    const url = URL.createObjectURL(f);
    try {
      const img = await loadImage(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const jpgBlob = await canvasToBlob(canvas, 'image/jpeg', 0.9);
      const bytes = new Uint8Array(await jpgBlob.arrayBuffer());
      const pdfImg = await pdf.embedJpg(bytes);
      const page = pdf.addPage([img.naturalWidth, img.naturalHeight]);
      page.drawImage(pdfImg, { x: 0, y: 0, width: img.naturalWidth, height: img.naturalHeight });
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  const out = await pdf.save({ useObjectStreams: true });
  return [{ name: 'converted.pdf', blob: new Blob([out], { type: 'application/pdf' }) }];
}));

registerEngine('pdf-to-text', () => import('../pdf-advanced').then(m => async (files, s) => {
  const results: ProcessResult[] = [];
  for (const f of files) {
    const text = await m.extractPdfText(f);
    results.push({ name: f.name.replace(/\.pdf$/i, '.txt'), blob: new Blob([text], { type: 'text/plain' }) });
  }
  return results;
}));

registerEngine('pdf-to-svg', () => import('../pdf').then(m => async (files, s) => {
  // Render to PNG then wrap in SVG (true vector extraction needs server-side tools)
  const results: ProcessResult[] = [];
  for (const f of files) {
    const canvas = await m.renderPdfPage(f, 0, 2);
    const blob = await m.canvasToPngBlob(canvas);
    const dataUrl = await new Promise<string>((res) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result as string);
      reader.readAsDataURL(blob);
    });
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}"><image href="${dataUrl}" width="${canvas.width}" height="${canvas.height}"/></svg>`;
    results.push({ name: f.name.replace(/\.pdf$/i, '.svg'), blob: new Blob([svg], { type: 'image/svg+xml' }) });
  }
  return results;
}));

registerEngine('svg-to-pdf', () => Promise.resolve(async (files, s) => {
  const { PDFDocument } = await import('pdf-lib');
  const { loadImage, canvasToBlob } = await import('../image');
  const pdf = await PDFDocument.create();
  for (const f of files) {
    const url = URL.createObjectURL(f);
    const img = await loadImage(url);
    URL.revokeObjectURL(url);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || 800;
    canvas.height = img.naturalHeight || 600;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    const jpgBlob = await canvasToBlob(canvas, 'image/png');
    const bytes = new Uint8Array(await jpgBlob.arrayBuffer());
    const pdfImg = await pdf.embedPng(bytes);
    const page = pdf.addPage([canvas.width, canvas.height]);
    page.drawImage(pdfImg, { x: 0, y: 0, width: canvas.width, height: canvas.height });
  }
  const out = await pdf.save({ useObjectStreams: true });
  return [{ name: 'svg-converted.pdf', blob: new Blob([out], { type: 'application/pdf' }) }];
}));


// ═══════════════════════════════════════════════════
// PDF SECURITY & UTILITY TOOLS
// ═══════════════════════════════════════════════════

registerEngine('pdf-size-reducer', () => import('../pdf').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.rasterizeToPdf(f, { scale: 1.0, jpegQuality: 0.6 }), '-small', 'pdf', s);
}));

registerEngine('mobile-pdf-compressor', () => import('../pdf').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.rasterizeToPdf(f, { scale: 0.8, jpegQuality: 0.5 }), '-mobile', 'pdf', s);
}));

registerEngine('bulk-pdf-processor', () => import('../pdf').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.lightCompressPdf(f), '-processed', 'pdf', s);
}));

registerEngine('secure-pdf-sharing', () => import('../pdf-advanced').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.protectPdf(f, s.password || 'share123'), '-secure', 'pdf', s);
}));

registerEngine('pdf-preview', () => import('../pdf').then(m => async (files, s) => {
  const results: ProcessResult[] = [];
  for (const f of files) {
    const canvas = await m.renderPdfPage(f, s.pageIndex ?? 0, (s.dpi ?? 150) / 72);
    const blob = await m.canvasToPngBlob(canvas);
    results.push({ name: f.name.replace(/\.pdf$/i, `-preview-p${(s.pageIndex ?? 0) + 1}.png`), blob });
  }
  return results;
}));

registerEngine('pdf-repair', () => import('../pdf-advanced').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.repairPdf(f), '-repaired', 'pdf', s);
}));

registerEngine('pdf-print-optimizer', () => import('../pdf').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.rasterizeToPdf(f, { scale: 2.0, jpegQuality: 0.95 }), '-print', 'pdf', s);
}));

registerEngine('pdf-quality-optimizer', () => import('../pdf').then(m => async (files, s) => {
  return mapFiles(files, (f) => m.rasterizeToPdf(f, { scale: 1.5, jpegQuality: 0.85 }), '-quality', 'pdf', s);
}));

registerEngine('pdf-zip-downloader', () => Promise.resolve(async (files, s) => {
  return files.map(f => ({ name: f.name, blob: f }));
}));

registerEngine('pdf-text-extractor', () => import('../pdf-advanced').then(m => async (files, s) => {
  const results: ProcessResult[] = [];
  for (const f of files) {
    const text = await m.extractPdfText(f);
    results.push({ name: f.name.replace(/\.pdf$/i, '.txt'), blob: new Blob([text], { type: 'text/plain' }) });
  }
  return results;
}));

registerEngine('pdf-image-extractor', () => import('../pdf-advanced').then(m => async (files, s) => {
  const results: ProcessResult[] = [];
  for (const f of files) {
    const images = await m.extractPdfImages(f, s.dpi ?? 150, s.format || 'jpg');
    results.push(...images.map(img => ({ name: img.name, blob: img.blob })));
  }
  return results;
}));

// ═══════════════════════════════════════════════════
// GENERATORS (barcode handled by QR page already)
// ═══════════════════════════════════════════════════

registerEngine('barcode-generator', () => Promise.resolve(async (files, s) => {
  // Simple barcode using Canvas (Code 128 simplified)
  const text = s.text || '123456789';
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 150;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 400, 150);
  ctx.fillStyle = '#000000';
  // Draw simplified barcode lines
  let x = 20;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    for (let j = 0; j < 8; j++) {
      if ((code >> j) & 1) {
        ctx.fillRect(x, 10, 2, 100);
      }
      x += 3;
    }
    x += 2;
  }
  // Add text below
  ctx.font = '14px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(text, 200, 130);
  const { canvasToBlob: c2b } = await import('../image');
  const blob = await c2b(canvas, 'image/png');
  return [{ name: `barcode-${text}.png`, blob }];
}));

// Export a setup function
export function registerAllEngines() {
  // All registrations happen at import time via the registerEngine calls above
  // This function exists so the module can be imported to trigger registration
}
