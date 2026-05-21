'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Trash2, Download, Settings2, Loader2, Zap, RotateCcw } from 'lucide-react';

import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

import { loadImage, canvasToBlob, getImageDimensions } from '@/lib/image';
import { downloadAsZip } from '@/lib/zip';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { encodeIco, blobToUint8 } from '@/lib/ico';

type TargetFormat = 'jpeg' | 'png' | 'webp' | 'bmp' | 'ico';

const ICO_SIZES = [16, 32, 48, 64, 128, 256];

interface Item {
  id: string;
  file: File;
  previewUrl: string;
  origWidth: number;
  origHeight: number;
  outputBlob?: Blob;
  outputUrl?: string;
  outputName?: string;
  outputSize?: number;
  status: 'idle' | 'processing' | 'done' | 'error';
  error?: string;
}

export function ImageConverterClient() {
  const [items, setItems] = React.useState<Item[]>([]);
  const [target, setTarget] = React.useState<TargetFormat>('webp');
  const [quality, setQuality] = React.useState<number>(92);
  const [bgColor, setBgColor] = React.useState<string>('#ffffff');
  const [transparentBg, setTransparentBg] = React.useState<boolean>(true);
  const [running, setRunning] = React.useState<boolean>(false);

  React.useEffect(() => {
    return () => {
      items.forEach((it) => {
        URL.revokeObjectURL(it.previewUrl);
        if (it.outputUrl) URL.revokeObjectURL(it.outputUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addFiles(files: File[]) {
    const next: Item[] = [];
    for (const f of files) {
      try {
        const dims = await getImageDimensions(f);
        next.push({
          id: crypto.randomUUID(),
          file: f,
          previewUrl: URL.createObjectURL(f),
          origWidth: dims.width,
          origHeight: dims.height,
          status: 'idle',
        });
      } catch {
        toast.error(`Could not read "${f.name}"`);
      }
    }
    setItems((p) => [...p, ...next]);
  }

  function removeItem(id: string) {
    setItems((prev) => {
      const t = prev.find((p) => p.id === id);
      if (t) {
        URL.revokeObjectURL(t.previewUrl);
        if (t.outputUrl) URL.revokeObjectURL(t.outputUrl);
      }
      return prev.filter((p) => p.id !== id);
    });
  }

  function clearAll() {
    items.forEach((it) => {
      URL.revokeObjectURL(it.previewUrl);
      if (it.outputUrl) URL.revokeObjectURL(it.outputUrl);
    });
    setItems([]);
  }

  /** Draw to a canvas with optional opaque background fill. */
  async function drawOpaque(file: File, w: number, h: number): Promise<HTMLCanvasElement> {
    const url = URL.createObjectURL(file);
    try {
      const img = await loadImage(url);
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d')!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      const lossy = target === 'jpeg' || target === 'bmp';
      // JPEG and BMP have no alpha — fill background
      if (lossy || (!transparentBg && (target === 'png' || target === 'webp'))) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.drawImage(img, 0, 0, w, h);
      return c;
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async function convertToIco(file: File): Promise<{ blob: Blob; outputName: string }> {
    const dims = await getImageDimensions(file);
    const max = Math.max(dims.width, dims.height);
    const sizes = ICO_SIZES.filter((s) => s <= Math.max(256, max));
    const entries = [];
    for (const size of sizes) {
      // eslint-disable-next-line no-await-in-loop
      const c = await drawOpaque(file, size, size);
      // eslint-disable-next-line no-await-in-loop
      const png = await canvasToBlob(c, 'image/png');
      // eslint-disable-next-line no-await-in-loop
      const bytes = await blobToUint8(png);
      entries.push({ width: size, height: size, pngBytes: bytes });
    }
    const blob = encodeIco(entries);
    const base = file.name.replace(/\.[^/.]+$/, '');
    return { blob, outputName: `${base}.ico` };
  }

  async function processOne(item: Item): Promise<Item> {
    try {
      let blob: Blob;
      let outputName: string;

      if (target === 'ico') {
        const out = await convertToIco(item.file);
        blob = out.blob;
        outputName = out.outputName;
      } else {
        const c = await drawOpaque(item.file, item.origWidth, item.origHeight);
        const mime = target === 'jpeg' ? 'image/jpeg' : `image/${target}`;
        const q = target === 'png' ? undefined : quality / 100;
        blob = await canvasToBlob(c, mime, q);
        const base = item.file.name.replace(/\.[^/.]+$/, '');
        const ext = target === 'jpeg' ? 'jpg' : target;
        outputName = `${base}.${ext}`;
      }

      return {
        ...item,
        status: 'done',
        outputBlob: blob,
        outputUrl: URL.createObjectURL(blob),
        outputName,
        outputSize: blob.size,
      };
    } catch (e: any) {
      return { ...item, status: 'error', error: e?.message || 'Conversion failed' };
    }
  }

  async function processAll() {
    if (items.length === 0) {
      toast.error('Add at least one image first');
      return;
    }
    setRunning(true);
    setItems((prev) => prev.map((x) => ({ ...x, status: 'processing', outputBlob: undefined, outputUrl: undefined })));
    for (const it of items) {
      // eslint-disable-next-line no-await-in-loop
      const updated = await processOne(it);
      setItems((prev) => prev.map((x) => (x.id === it.id ? updated : x)));
    }
    setRunning(false);
    toast.success('Conversion complete');
  }

  async function downloadAll() {
    const done = items.filter((x) => x.status === 'done' && x.outputBlob && x.outputName);
    if (done.length === 0) return;
    if (done.length === 1) {
      downloadBlob(done[0].outputBlob!, done[0].outputName!);
      return;
    }
    await downloadAsZip(
      done.map((x) => ({ name: x.outputName!, blob: x.outputBlob! })),
      `golusoft-${target}-converted.zip`
    );
  }

  const supportsAlpha = target === 'png' || target === 'webp' || target === 'ico';

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* MAIN */}
      <div className="lg:col-span-2 space-y-4">
        <FileDropzone
          accept="image/jpeg,image/png,image/webp,image/bmp,image/gif,image/avif"
          onFiles={addFiles}
          label="Drop images here, or click to upload"
          hint="JPG, PNG, WEBP, BMP, GIF, AVIF — up to 50MB per file."
          maxSize={50 * 1024 * 1024}
        />

        {items.length > 0 && (
          <div className="rounded-xl border border-border/60 bg-card p-4 flex flex-wrap items-center gap-3 justify-between">
            <div className="text-sm text-muted-foreground">
              <strong className="text-foreground">{items.length}</strong> file{items.length === 1 ? '' : 's'} →{' '}
              <Badge variant="secondary" className="uppercase">{target}</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={processAll} disabled={running} variant="gradient" size="sm">
                {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                {running ? 'Converting…' : 'Convert all'}
              </Button>
              <Button onClick={downloadAll} disabled={running || !items.some((i) => i.status === 'done')} size="sm">
                <Download className="h-4 w-4" /> Download {items.length > 1 ? 'ZIP' : ''}
              </Button>
              <Button onClick={clearAll} variant="ghost" size="sm" disabled={running}>
                <Trash2 className="h-4 w-4" /> Clear
              </Button>
            </div>
          </div>
        )}

        {items.length > 0 && (
          <ul className="space-y-2">
            {items.map((it) => (
              <li key={it.id} className="rounded-xl border border-border/60 bg-card p-3 flex items-center gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.outputUrl || it.previewUrl} alt={it.file.name} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{it.file.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {it.origWidth}×{it.origHeight} · {formatBytes(it.file.size)}
                    {it.outputSize !== undefined && (
                      <> → <span className="text-emerald-600">{formatBytes(it.outputSize)}</span></>
                    )}
                    {it.error && <span className="text-destructive"> · {it.error}</span>}
                  </p>
                  {it.status === 'done' && <Badge variant="success" className="mt-1 text-[10px]">{target.toUpperCase()}</Badge>}
                  {it.status === 'processing' && <Badge variant="secondary" className="mt-1 text-[10px]">Processing…</Badge>}
                  {it.status === 'error' && <Badge variant="destructive" className="mt-1 text-[10px]">Error</Badge>}
                </div>
                <div className="flex flex-col gap-1">
                  {it.status === 'done' && it.outputBlob && it.outputName && (
                    <Button size="icon" variant="ghost" aria-label="Download" onClick={() => downloadBlob(it.outputBlob!, it.outputName!)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  <Button size="icon" variant="ghost" aria-label="Remove" onClick={() => removeItem(it.id)} disabled={running}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* SETTINGS */}
      <aside className="lg:col-span-1">
        <div className="lg:sticky lg:top-20 rounded-xl border border-border/60 bg-card p-5 space-y-5">
          <header className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            <h3 className="font-semibold">Conversion settings</h3>
          </header>

          <div>
            <Label>Convert to</Label>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {(['jpeg', 'png', 'webp', 'bmp', 'ico'] as TargetFormat[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTarget(t)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium uppercase transition-colors ${target === t ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-accent'}`}
                >
                  {t === 'jpeg' ? 'JPG' : t}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {target === 'webp' && 'WebP gives the smallest file size with great quality.'}
              {target === 'jpeg' && 'JPG is widely supported and small. No transparency.'}
              {target === 'png' && 'PNG is lossless and supports transparency.'}
              {target === 'bmp' && 'BMP is uncompressed and large. Use for legacy apps.'}
              {target === 'ico' && 'Generates a multi-size .ico (16, 32, 48, 64, 128, 256).'}
            </p>
          </div>

          {target !== 'png' && target !== 'ico' && (
            <div>
              <div className="flex items-center justify-between">
                <Label>Quality</Label>
                <span className="text-sm font-medium">{quality}</span>
              </div>
              <Slider value={[quality]} min={10} max={100} step={1} onValueChange={(v) => setQuality(v[0])} className="mt-2" />
            </div>
          )}

          {supportsAlpha && (
            <div className="flex items-center justify-between">
              <div>
                <Label className="block">Keep transparency</Label>
                <p className="text-xs text-muted-foreground">When source has alpha.</p>
              </div>
              <Switch checked={transparentBg} onCheckedChange={setTransparentBg} disabled={target === 'jpeg' || target === 'bmp'} />
            </div>
          )}

          {(target === 'jpeg' || target === 'bmp' || !transparentBg) && (
            <div>
              <Label>Background color</Label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-10 w-12 rounded-lg border border-border bg-transparent cursor-pointer"
                  aria-label="Background color"
                />
                <span className="font-mono text-sm">{bgColor}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Used for formats without transparency.</p>
            </div>
          )}

          <Button onClick={() => { setTarget('webp'); setQuality(92); setTransparentBg(true); setBgColor('#ffffff'); }} variant="ghost" className="w-full">
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
        </div>
      </aside>
    </div>
  );
}
