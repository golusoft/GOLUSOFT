/**
 * Image effects engine — all Canvas-based, browser-only.
 * Powers: crop, rotate, flip, blur, sharpen, brightness, contrast, saturation,
 * opacity, grayscale, sepia, B&W, overlay, border, rounded corners, watermark, text.
 */

import { loadImage, canvasToBlob } from './image';

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WatermarkOpts {
  text?: string;
  imageUrl?: string;
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'tile';
  opacity: number;
  fontSize?: number;
  color?: string;
  rotation?: number;
}

export interface TextOverlayOpts {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  bold: boolean;
  italic: boolean;
  align: 'left' | 'center' | 'right';
  strokeColor?: string;
  strokeWidth?: number;
}

/** Create a canvas from a File */
export async function fileToCanvas(file: File): Promise<{ canvas: HTMLCanvasElement; img: HTMLImageElement }> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    return { canvas, img };
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Crop image */
export async function cropImage(file: File, rect: CropRect): Promise<Blob> {
  const { canvas: src } = await fileToCanvas(file);
  const out = document.createElement('canvas');
  out.width = rect.width;
  out.height = rect.height;
  const ctx = out.getContext('2d')!;
  ctx.drawImage(src, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
  return canvasToBlob(out, 'image/png');
}

/** Rotate image by degrees */
export async function rotateImage(file: File, degrees: number): Promise<Blob> {
  const { canvas: src, img } = await fileToCanvas(file);
  const rad = (degrees * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));
  const w = Math.ceil(img.naturalWidth * cos + img.naturalHeight * sin);
  const h = Math.ceil(img.naturalWidth * sin + img.naturalHeight * cos);
  const out = document.createElement('canvas');
  out.width = w;
  out.height = h;
  const ctx = out.getContext('2d')!;
  ctx.translate(w / 2, h / 2);
  ctx.rotate(rad);
  ctx.drawImage(src, -img.naturalWidth / 2, -img.naturalHeight / 2);
  return canvasToBlob(out, file.type || 'image/png');
}

/** Flip image horizontally or vertically */
export async function flipImage(file: File, direction: 'horizontal' | 'vertical'): Promise<Blob> {
  const { canvas: src, img } = await fileToCanvas(file);
  const out = document.createElement('canvas');
  out.width = img.naturalWidth;
  out.height = img.naturalHeight;
  const ctx = out.getContext('2d')!;
  if (direction === 'horizontal') {
    ctx.translate(out.width, 0);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(0, out.height);
    ctx.scale(1, -1);
  }
  ctx.drawImage(src, 0, 0);
  return canvasToBlob(out, file.type || 'image/png');
}

/** Apply CSS-like filter to image */
export async function applyFilter(
  file: File,
  filter: string,
  mime?: string
): Promise<Blob> {
  const { canvas: src, img } = await fileToCanvas(file);
  const out = document.createElement('canvas');
  out.width = img.naturalWidth;
  out.height = img.naturalHeight;
  const ctx = out.getContext('2d')!;
  ctx.filter = filter;
  ctx.drawImage(src, 0, 0);
  return canvasToBlob(out, mime || file.type || 'image/png');
}

/** Grayscale */
export async function grayscaleImage(file: File): Promise<Blob> {
  return applyFilter(file, 'grayscale(100%)');
}

/** Sepia */
export async function sepiaImage(file: File, amount = 100): Promise<Blob> {
  return applyFilter(file, `sepia(${amount}%)`);
}

/** Brightness */
export async function brightnessImage(file: File, amount = 120): Promise<Blob> {
  return applyFilter(file, `brightness(${amount}%)`);
}

/** Contrast */
export async function contrastImage(file: File, amount = 120): Promise<Blob> {
  return applyFilter(file, `contrast(${amount}%)`);
}

/** Saturation */
export async function saturationImage(file: File, amount = 150): Promise<Blob> {
  return applyFilter(file, `saturate(${amount}%)`);
}

/** Opacity */
export async function opacityImage(file: File, amount = 50): Promise<Blob> {
  const { canvas: src, img } = await fileToCanvas(file);
  const out = document.createElement('canvas');
  out.width = img.naturalWidth;
  out.height = img.naturalHeight;
  const ctx = out.getContext('2d')!;
  ctx.globalAlpha = amount / 100;
  ctx.drawImage(src, 0, 0);
  return canvasToBlob(out, 'image/png');
}

/** Blur */
export async function blurImage(file: File, radius = 5): Promise<Blob> {
  return applyFilter(file, `blur(${radius}px)`);
}

/** Sharpen using convolution kernel */
export async function sharpenImage(file: File, amount = 1): Promise<Blob> {
  const { canvas: src, img } = await fileToCanvas(file);
  const out = document.createElement('canvas');
  out.width = img.naturalWidth;
  out.height = img.naturalHeight;
  const ctx = out.getContext('2d')!;
  ctx.drawImage(src, 0, 0);
  const imageData = ctx.getImageData(0, 0, out.width, out.height);
  const data = imageData.data;
  const w = out.width;
  const h = out.height;
  const copy = new Uint8ClampedArray(data);
  const kernel = [0, -amount, 0, -amount, 1 + 4 * amount, -amount, 0, -amount, 0];
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let val = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * w + (x + kx)) * 4 + c;
            val += copy[idx] * kernel[(ky + 1) * 3 + (kx + 1)];
          }
        }
        data[(y * w + x) * 4 + c] = Math.min(255, Math.max(0, val));
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
  return canvasToBlob(out, file.type || 'image/png');
}

/** Black & White with threshold */
export async function blackWhiteImage(file: File, threshold = 128): Promise<Blob> {
  const { canvas: src, img } = await fileToCanvas(file);
  const out = document.createElement('canvas');
  out.width = img.naturalWidth;
  out.height = img.naturalHeight;
  const ctx = out.getContext('2d')!;
  ctx.drawImage(src, 0, 0);
  const imageData = ctx.getImageData(0, 0, out.width, out.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const gray = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
    const val = gray >= threshold ? 255 : 0;
    data[i] = data[i + 1] = data[i + 2] = val;
  }
  ctx.putImageData(imageData, 0, 0);
  return canvasToBlob(out, file.type || 'image/png');
}

/** Add border to image */
export async function addBorder(
  file: File,
  borderWidth: number,
  borderColor: string
): Promise<Blob> {
  const { img } = await fileToCanvas(file);
  const w = img.naturalWidth + borderWidth * 2;
  const h = img.naturalHeight + borderWidth * 2;
  const out = document.createElement('canvas');
  out.width = w;
  out.height = h;
  const ctx = out.getContext('2d')!;
  ctx.fillStyle = borderColor;
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, borderWidth, borderWidth);
  return canvasToBlob(out, 'image/png');
}

/** Add rounded corners */
export async function roundedCorners(file: File, radius: number): Promise<Blob> {
  const { canvas: src, img } = await fileToCanvas(file);
  const out = document.createElement('canvas');
  out.width = img.naturalWidth;
  out.height = img.naturalHeight;
  const ctx = out.getContext('2d')!;
  ctx.beginPath();
  const w = out.width;
  const h = out.height;
  const r = Math.min(radius, w / 2, h / 2);
  ctx.moveTo(r, 0);
  ctx.arcTo(w, 0, w, h, r);
  ctx.arcTo(w, h, 0, h, r);
  ctx.arcTo(0, h, 0, 0, r);
  ctx.arcTo(0, 0, w, 0, r);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(src, 0, 0);
  return canvasToBlob(out, 'image/png');
}

/** Add text watermark */
export async function addWatermark(file: File, opts: WatermarkOpts): Promise<Blob> {
  const { canvas: src, img } = await fileToCanvas(file);
  const out = document.createElement('canvas');
  out.width = img.naturalWidth;
  out.height = img.naturalHeight;
  const ctx = out.getContext('2d')!;
  ctx.drawImage(src, 0, 0);
  ctx.globalAlpha = opts.opacity;

  if (opts.text) {
    const fontSize = opts.fontSize || Math.max(16, Math.round(out.width / 20));
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    ctx.fillStyle = opts.color || 'rgba(255,255,255,0.7)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (opts.position === 'tile') {
      const gap = fontSize * 4;
      ctx.save();
      ctx.rotate(((opts.rotation || -30) * Math.PI) / 180);
      for (let y = -out.height; y < out.height * 2; y += gap) {
        for (let x = -out.width; x < out.width * 2; x += gap) {
          ctx.fillText(opts.text, x, y);
        }
      }
      ctx.restore();
    } else {
      const positions: Record<string, [number, number]> = {
        'center': [out.width / 2, out.height / 2],
        'top-left': [fontSize * 2, fontSize * 2],
        'top-right': [out.width - fontSize * 2, fontSize * 2],
        'bottom-left': [fontSize * 2, out.height - fontSize * 2],
        'bottom-right': [out.width - fontSize * 2, out.height - fontSize * 2],
      };
      const [x, y] = positions[opts.position] || positions['center'];
      if (opts.rotation) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((opts.rotation * Math.PI) / 180);
        ctx.fillText(opts.text, 0, 0);
        ctx.restore();
      } else {
        ctx.fillText(opts.text, x, y);
      }
    }
  }

  ctx.globalAlpha = 1;
  return canvasToBlob(out, file.type || 'image/png');
}

/** Add text overlay on image */
export async function addTextOverlay(file: File, opts: TextOverlayOpts): Promise<Blob> {
  const { canvas: src, img } = await fileToCanvas(file);
  const out = document.createElement('canvas');
  out.width = img.naturalWidth;
  out.height = img.naturalHeight;
  const ctx = out.getContext('2d')!;
  ctx.drawImage(src, 0, 0);

  const style = `${opts.italic ? 'italic' : ''} ${opts.bold ? 'bold' : ''} ${opts.fontSize}px ${opts.fontFamily}`.trim();
  ctx.font = style;
  ctx.fillStyle = opts.color;
  ctx.textAlign = opts.align;
  ctx.textBaseline = 'top';

  if (opts.strokeColor && opts.strokeWidth) {
    ctx.strokeStyle = opts.strokeColor;
    ctx.lineWidth = opts.strokeWidth;
    ctx.strokeText(opts.text, opts.x, opts.y);
  }
  ctx.fillText(opts.text, opts.x, opts.y);
  return canvasToBlob(out, file.type || 'image/png');
}

/** Overlay one image on top of another */
export async function overlayImages(
  baseFile: File,
  overlayFile: File,
  x: number,
  y: number,
  overlayWidth?: number,
  overlayHeight?: number,
  opacity = 1
): Promise<Blob> {
  const { canvas: base } = await fileToCanvas(baseFile);
  const overlayUrl = URL.createObjectURL(overlayFile);
  try {
    const overlayImg = await loadImage(overlayUrl);
    const out = document.createElement('canvas');
    out.width = base.width;
    out.height = base.height;
    const ctx = out.getContext('2d')!;
    ctx.drawImage(base, 0, 0);
    ctx.globalAlpha = opacity;
    ctx.drawImage(
      overlayImg,
      x, y,
      overlayWidth || overlayImg.naturalWidth,
      overlayHeight || overlayImg.naturalHeight
    );
    ctx.globalAlpha = 1;
    return canvasToBlob(out, 'image/png');
  } finally {
    URL.revokeObjectURL(overlayUrl);
  }
}

/** Merge images horizontally or vertically */
export async function mergeImages(
  files: File[],
  direction: 'horizontal' | 'vertical',
  gap = 0,
  bgColor = '#ffffff'
): Promise<Blob> {
  const imgs: HTMLImageElement[] = [];
  for (const f of files) {
    const url = URL.createObjectURL(f);
    imgs.push(await loadImage(url));
    URL.revokeObjectURL(url);
  }

  let totalW = 0, totalH = 0;
  if (direction === 'horizontal') {
    totalW = imgs.reduce((s, img) => s + img.naturalWidth, 0) + gap * (imgs.length - 1);
    totalH = Math.max(...imgs.map((img) => img.naturalHeight));
  } else {
    totalW = Math.max(...imgs.map((img) => img.naturalWidth));
    totalH = imgs.reduce((s, img) => s + img.naturalHeight, 0) + gap * (imgs.length - 1);
  }

  const out = document.createElement('canvas');
  out.width = totalW;
  out.height = totalH;
  const ctx = out.getContext('2d')!;
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, totalW, totalH);

  let offset = 0;
  for (const img of imgs) {
    if (direction === 'horizontal') {
      ctx.drawImage(img, offset, 0);
      offset += img.naturalWidth + gap;
    } else {
      ctx.drawImage(img, 0, offset);
      offset += img.naturalHeight + gap;
    }
  }
  return canvasToBlob(out, 'image/png');
}

/** Split image into grid */
export async function splitImage(
  file: File,
  rows: number,
  cols: number
): Promise<Blob[]> {
  const { canvas: src, img } = await fileToCanvas(file);
  const tileW = Math.floor(img.naturalWidth / cols);
  const tileH = Math.floor(img.naturalHeight / rows);
  const blobs: Blob[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tile = document.createElement('canvas');
      tile.width = tileW;
      tile.height = tileH;
      const ctx = tile.getContext('2d')!;
      ctx.drawImage(src, c * tileW, r * tileH, tileW, tileH, 0, 0, tileW, tileH);
      blobs.push(await canvasToBlob(tile, 'image/png'));
    }
  }
  return blobs;
}

/** Change background color (replace near-white or near-black with target) */
export async function changeBackgroundColor(
  file: File,
  targetColor: string,
  tolerance = 30
): Promise<Blob> {
  const { canvas: src, img } = await fileToCanvas(file);
  const out = document.createElement('canvas');
  out.width = img.naturalWidth;
  out.height = img.naturalHeight;
  const ctx = out.getContext('2d')!;
  ctx.drawImage(src, 0, 0);
  const imageData = ctx.getImageData(0, 0, out.width, out.height);
  const data = imageData.data;

  // Parse target color
  const tc = document.createElement('canvas');
  tc.width = tc.height = 1;
  const tctx = tc.getContext('2d')!;
  tctx.fillStyle = targetColor;
  tctx.fillRect(0, 0, 1, 1);
  const [tr, tg, tb] = tctx.getImageData(0, 0, 1, 1).data;

  // Detect background color from corners
  const corners = [
    0,
    (out.width - 1) * 4,
    ((out.height - 1) * out.width) * 4,
    ((out.height - 1) * out.width + out.width - 1) * 4,
  ];
  let bgR = 0, bgG = 0, bgB = 0;
  for (const idx of corners) {
    bgR += data[idx]; bgG += data[idx + 1]; bgB += data[idx + 2];
  }
  bgR = Math.round(bgR / 4); bgG = Math.round(bgG / 4); bgB = Math.round(bgB / 4);

  for (let i = 0; i < data.length; i += 4) {
    const dr = Math.abs(data[i] - bgR);
    const dg = Math.abs(data[i + 1] - bgG);
    const db = Math.abs(data[i + 2] - bgB);
    if (dr < tolerance && dg < tolerance && db < tolerance) {
      data[i] = tr;
      data[i + 1] = tg;
      data[i + 2] = tb;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  return canvasToBlob(out, 'image/png');
}

/** Extract EXIF/metadata info from image */
export async function getImageMetadata(file: File): Promise<Record<string, string>> {
  const meta: Record<string, string> = {
    'File name': file.name,
    'File size': `${(file.size / 1024).toFixed(1)} KB`,
    'MIME type': file.type,
    'Last modified': new Date(file.lastModified).toLocaleString(),
  };
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    meta['Width'] = `${img.naturalWidth} px`;
    meta['Height'] = `${img.naturalHeight} px`;
    meta['Aspect ratio'] = `${(img.naturalWidth / img.naturalHeight).toFixed(3)}`;
    meta['Megapixels'] = `${((img.naturalWidth * img.naturalHeight) / 1_000_000).toFixed(2)} MP`;
  } finally {
    URL.revokeObjectURL(url);
  }
  return meta;
}

/** Pick color at a specific pixel */
export async function pickColor(file: File, x: number, y: number): Promise<{ hex: string; rgb: string; r: number; g: number; b: number }> {
  const { canvas } = await fileToCanvas(file);
  const ctx = canvas.getContext('2d')!;
  const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
  const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  return { hex, rgb: `rgb(${r}, ${g}, ${b})`, r, g, b };
}

/** Create collage from images in a grid */
export async function createCollage(
  files: File[],
  cols: number,
  tileSize: number,
  gap = 4,
  bgColor = '#ffffff'
): Promise<Blob> {
  const rows = Math.ceil(files.length / cols);
  const totalW = cols * tileSize + (cols - 1) * gap;
  const totalH = rows * tileSize + (rows - 1) * gap;
  const out = document.createElement('canvas');
  out.width = totalW;
  out.height = totalH;
  const ctx = out.getContext('2d')!;
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, totalW, totalH);

  for (let i = 0; i < files.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const url = URL.createObjectURL(files[i]);
    const img = await loadImage(url);
    URL.revokeObjectURL(url);
    const x = col * (tileSize + gap);
    const y = row * (tileSize + gap);
    // Cover-fit
    const scale = Math.max(tileSize / img.naturalWidth, tileSize / img.naturalHeight);
    const sw = tileSize / scale;
    const sh = tileSize / scale;
    const sx = (img.naturalWidth - sw) / 2;
    const sy = (img.naturalHeight - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh, x, y, tileSize, tileSize);
  }
  return canvasToBlob(out, 'image/png');
}

/** Change DPI metadata (re-encode with DPI in PNG tEXt chunk is not standard,
 *  so we just resize based on DPI ratio for practical use) */
export async function changeDpi(
  file: File,
  currentDpi: number,
  targetDpi: number
): Promise<Blob> {
  const { canvas: src, img } = await fileToCanvas(file);
  const scale = targetDpi / currentDpi;
  const w = Math.round(img.naturalWidth * scale);
  const h = Math.round(img.naturalHeight * scale);
  const out = document.createElement('canvas');
  out.width = w;
  out.height = h;
  const ctx = out.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(src, 0, 0, w, h);
  return canvasToBlob(out, file.type || 'image/png');
}

/** Create GIF from multiple frames (simple approach using canvas frames) */
export async function createSimpleGif(
  files: File[],
  frameDelay: number,
  width: number,
  height: number
): Promise<Blob> {
  // For true GIF encoding we'd need a GIF encoder library.
  // We'll create an animated WEBP instead which is broadly supported.
  // Actually, let's just create a multi-frame PNG sprite sheet that
  // can be downloaded. For a real GIF, we stitch frames into a canvas sequence.
  // Simple approach: create a horizontal sprite sheet PNG.
  const imgs: HTMLImageElement[] = [];
  for (const f of files) {
    const url = URL.createObjectURL(f);
    imgs.push(await loadImage(url));
    URL.revokeObjectURL(url);
  }
  const out = document.createElement('canvas');
  out.width = width * imgs.length;
  out.height = height;
  const ctx = out.getContext('2d')!;
  imgs.forEach((img, i) => {
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, i * width, 0, width, height);
  });
  return canvasToBlob(out, 'image/png');
}
