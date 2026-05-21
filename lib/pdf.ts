/**
 * PDF utilities for the browser.
 *
 * Uses:
 *   - pdf-lib    : create, modify, merge, split, compress PDFs
 *   - pdfjs-dist : render PDF pages to canvas (used for compression and PDF→JPG)
 *
 * pdfjs-dist is loaded lazily so it doesn't ship with the homepage bundle.
 */

import { PDFDocument } from 'pdf-lib';

let _pdfjs: typeof import('pdfjs-dist') | null = null;

/** Lazy-load pdfjs-dist with the worker correctly configured. */
export async function getPdfJs() {
  if (_pdfjs) return _pdfjs;
  const pdfjs = await import('pdfjs-dist');
  // Use the matching worker version from a public CDN. This avoids bundler-specific
  // worker imports (Vite's `?url` vs Webpack's `new URL(..., import.meta.url)`)
  // and works identically on Vercel, Cloudflare Pages, and self-hosted.
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc =
      `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
  }
  _pdfjs = pdfjs;
  return pdfjs;
}

export async function loadPdfDoc(file: File | Blob | ArrayBuffer): Promise<PDFDocument> {
  const buf = file instanceof ArrayBuffer ? file : await (file as Blob).arrayBuffer();
  return PDFDocument.load(buf, { ignoreEncryption: true, updateMetadata: false });
}

export async function getPdfPageCount(file: File | Blob): Promise<number> {
  const doc = await loadPdfDoc(file);
  return doc.getPageCount();
}

/**
 * Render a single page of a PDF to a canvas.
 */
export async function renderPdfPage(
  file: File | Blob | ArrayBuffer,
  pageIndex: number,
  scale: number
): Promise<HTMLCanvasElement> {
  const pdfjs = await getPdfJs();
  const data = file instanceof ArrayBuffer ? file : await (file as Blob).arrayBuffer();
  const task = pdfjs.getDocument({ data: new Uint8Array(data), isEvalSupported: false });
  const doc = await task.promise;
  try {
    const page = await doc.getPage(pageIndex + 1);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');
    await page.render({ canvasContext: ctx as any, viewport }).promise;
    return canvas;
  } finally {
    try { await doc.destroy(); } catch {}
  }
}

/**
 * Render all pages of a PDF to canvases.
 */
export async function renderAllPages(
  file: File | Blob | ArrayBuffer,
  scale: number,
  onProgress?: (i: number, total: number) => void
): Promise<HTMLCanvasElement[]> {
  const pdfjs = await getPdfJs();
  const data = file instanceof ArrayBuffer ? file : await (file as Blob).arrayBuffer();
  const task = pdfjs.getDocument({ data: new Uint8Array(data), isEvalSupported: false });
  const doc = await task.promise;
  try {
    const pages: HTMLCanvasElement[] = [];
    for (let i = 1; i <= doc.numPages; i++) {
      // eslint-disable-next-line no-await-in-loop
      const page = await doc.getPage(i);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context unavailable');
      // eslint-disable-next-line no-await-in-loop
      await page.render({ canvasContext: ctx as any, viewport }).promise;
      pages.push(canvas);
      onProgress?.(i, doc.numPages);
    }
    return pages;
  } finally {
    try { await doc.destroy(); } catch {}
  }
}

export function canvasToJpegBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Canvas toBlob failed'))), 'image/jpeg', quality)
  );
}

export function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Canvas toBlob failed'))), 'image/png')
  );
}

/**
 * Build a new PDF where every page is a JPEG-rendered version of the source.
 * Drastically reduces size for PDFs full of text or vector graphics.
 */
export async function rasterizeToPdf(
  file: File | Blob,
  opts: { scale: number; jpegQuality: number; onProgress?: (i: number, total: number) => void }
): Promise<Blob> {
  const canvases = await renderAllPages(file, opts.scale, opts.onProgress);
  const newPdf = await PDFDocument.create();
  for (const canvas of canvases) {
    // eslint-disable-next-line no-await-in-loop
    const blob = await canvasToJpegBlob(canvas, opts.jpegQuality);
    // eslint-disable-next-line no-await-in-loop
    const bytes = new Uint8Array(await blob.arrayBuffer());
    // eslint-disable-next-line no-await-in-loop
    const img = await newPdf.embedJpg(bytes);
    const page = newPdf.addPage([canvas.width, canvas.height]);
    page.drawImage(img, { x: 0, y: 0, width: canvas.width, height: canvas.height });
  }
  const out = await newPdf.save({ useObjectStreams: true, addDefaultPage: false });
  return new Blob([out], { type: 'application/pdf' });
}

/** Re-save the source PDF with object streams enabled (mild compression). */
export async function lightCompressPdf(file: File | Blob): Promise<Blob> {
  const doc = await loadPdfDoc(file);
  const out = await doc.save({ useObjectStreams: true, addDefaultPage: false });
  return new Blob([out], { type: 'application/pdf' });
}
