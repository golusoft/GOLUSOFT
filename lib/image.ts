/**
 * Image processing utilities.
 * All operations run in the browser using Canvas + browser-image-compression.
 */

import imageCompression from 'browser-image-compression';

export type OutputFormat = 'jpeg' | 'png' | 'webp' | 'bmp' | 'auto';

export interface CompressOptions {
  /** Target file size in KB. If set, we iteratively compress to approach this. */
  targetKB?: number;
  /** Quality 0..100. Used as starting point if targetKB is set. */
  quality?: number;
  /** Max dimension in pixels (longest side). 0 = no scaling. */
  maxDimension?: number;
  /** Output format. 'auto' keeps the original. */
  format?: OutputFormat;
  /** Preserve EXIF metadata where possible. */
  preserveExif?: boolean;
  /** Web worker for performance. */
  useWebWorker?: boolean;
  onProgress?: (p: number) => void;
}

const MIME: Record<Exclude<OutputFormat, 'auto'>, string> = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  bmp: 'image/bmp',
};

const EXT: Record<Exclude<OutputFormat, 'auto'>, string> = {
  jpeg: 'jpg',
  png: 'png',
  webp: 'webp',
  bmp: 'bmp',
};

export function getOutputMime(file: File, format: OutputFormat): string {
  if (format === 'auto') return file.type || 'image/jpeg';
  return MIME[format];
}

export function getOutputName(file: File, format: OutputFormat, suffix = ''): string {
  const base = file.name.replace(/\.[^/.]+$/, '');
  const target = format === 'auto'
    ? (file.name.split('.').pop() || 'jpg').toLowerCase()
    : EXT[format];
  return `${base}${suffix}.${target}`;
}

/**
 * Compress an image. Supports target-KB mode (binary search on quality) and
 * direct quality mode. Returns a Blob along with achieved size info.
 */
export async function compressImage(
  file: File,
  opts: CompressOptions = {}
): Promise<{ blob: Blob; outputName: string; outputType: string }> {
  const {
    targetKB,
    quality = 80,
    maxDimension = 0,
    format = 'auto',
    preserveExif = false,
    useWebWorker = true,
    onProgress,
  } = opts;

  const outputType = getOutputMime(file, format);
  const outputName = getOutputName(file, format);

  // Helper that delegates to browser-image-compression with one set of params.
  async function pass(q: number): Promise<File> {
    return imageCompression(file, {
      maxSizeMB: targetKB ? targetKB / 1024 : Number.MAX_SAFE_INTEGER,
      maxWidthOrHeight: maxDimension > 0 ? maxDimension : undefined,
      initialQuality: q / 100,
      useWebWorker,
      fileType: outputType,
      preserveExif,
      onProgress,
    });
  }

  // If we have a target KB and the format isn't lossless PNG, do a quick
  // bounded iteration. browser-image-compression already does this internally,
  // but we add an outer guard so PNG -> JPEG conversions also converge.
  if (targetKB && outputType !== 'image/png' && outputType !== 'image/bmp') {
    let q = quality;
    let out = await pass(q);
    let tries = 0;
    while (out.size / 1024 > targetKB && q > 5 && tries < 4) {
      q = Math.max(5, Math.round(q * 0.7));
      out = await pass(q);
      tries++;
    }
    return { blob: out, outputName, outputType };
  }

  const out = await pass(quality);
  return { blob: out, outputName, outputType };
}

/**
 * Generic canvas-based redraw used by resize / convert / format change.
 */
export async function redrawToCanvas(
  file: File,
  opts: { width?: number; height?: number; mime: string; quality?: number }
): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const w = opts.width || img.naturalWidth;
    const h = opts.height || img.naturalHeight;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, w, h);
    return await canvasToBlob(canvas, opts.mime, opts.quality ?? 0.92);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

export function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Failed to encode image'))),
      mime,
      quality
    );
  });
}

export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    return { width: img.naturalWidth, height: img.naturalHeight };
  } finally {
    URL.revokeObjectURL(url);
  }
}
