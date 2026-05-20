'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Loader2, Download, FileImage, Sparkles } from 'lucide-react';

import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { loadImage, canvasToBlob } from '@/lib/image';
import { encodeIco, blobToUint8 } from '@/lib/ico';
import { downloadAsZip } from '@/lib/zip';
import { downloadBlob } from '@/lib/utils';

const SIZES = [16, 32, 48, 64, 128, 192, 256, 512];
const ICO_SIZES = [16, 32, 48, 64, 128, 256];

interface FaviconResult {
  size: number;
  blob: Blob;
  url: string;
}

const MANIFEST = `{
  "name": "Your App",
  "short_name": "App",
  "icons": [
    { "src": "/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "display": "standalone"
}`;

const HTML_SNIPPET = `<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`;

export function FaviconClient() {
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string>('');
  const [results, setResults] = React.useState<FaviconResult[]>([]);
  const [icoBlob, setIcoBlob] = React.useState<Blob | null>(null);
  const [appleBlob, setAppleBlob] = React.useState<Blob | null>(null);
  const [running, setRunning] = React.useState(false);
  const [rounded, setRounded] = React.useState(false);
  const [bgColor, setBgColor] = React.useState('#ffffff');
  const [transparent, setTransparent] = React.useState(true);

  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      results.forEach((r) => URL.revokeObjectURL(r.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onPick(files: File[]) {
    const f = files[0];
    if (!f) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    results.forEach((r) => URL.revokeObjectURL(r.url));
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setResults([]);
    setIcoBlob(null);
    setAppleBlob(null);
  }

  async function generate() {
    if (!file) return toast.error('Upload a square image (PNG recommended)');
    setRunning(true);
    try {
      const url = URL.createObjectURL(file);
      const img = await loadImage(url);
      const baseSize = Math.min(img.naturalWidth, img.naturalHeight);

      const made: FaviconResult[] = [];
      const icoEntries: { width: number; height: number; pngBytes: Uint8Array }[] = [];

      for (const size of SIZES) {
        const c = document.createElement('canvas');
        c.width = size;
        c.height = size;
        const ctx = c.getContext('2d')!;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        if (!transparent) {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, size, size);
        }
        if (rounded) {
          const r = size / 2;
          ctx.beginPath();
          ctx.arc(r, r, r, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
        }
        // Draw cropped to square center
        const sourceMin = Math.min(img.naturalWidth, img.naturalHeight);
        const sx = (img.naturalWidth - sourceMin) / 2;
        const sy = (img.naturalHeight - sourceMin) / 2;
        ctx.drawImage(img, sx, sy, sourceMin, sourceMin, 0, 0, size, size);

        // eslint-disable-next-line no-await-in-loop
        const blob = await canvasToBlob(c, 'image/png');
        const url = URL.createObjectURL(blob);
        made.push({ size, blob, url });

        if (ICO_SIZES.includes(size)) {
          // eslint-disable-next-line no-await-in-loop
          const bytes = await blobToUint8(blob);
          icoEntries.push({ width: size, height: size, pngBytes: bytes });
        }
      }
      URL.revokeObjectURL(url);

      const ico = encodeIco(icoEntries);
      const apple = made.find((m) => m.size === 192)?.blob || made[0].blob;

      // cleanup old object URLs
      results.forEach((r) => URL.revokeObjectURL(r.url));
      setResults(made);
      setIcoBlob(ico);
      setAppleBlob(apple);
      void baseSize;
      toast.success(`Generated ${SIZES.length} sizes + favicon.ico`);
    } catch (e: any) {
      toast.error(e?.message || 'Generation failed');
    } finally {
      setRunning(false);
    }
  }

  async function downloadPack() {
    if (!icoBlob || results.length === 0) return;
    const items: { name: string; blob: Blob }[] = [
      { name: 'favicon.ico', blob: icoBlob },
      { name: 'apple-touch-icon.png', blob: appleBlob! },
      { name: 'site.webmanifest', blob: new Blob([MANIFEST], { type: 'application/manifest+json' }) },
      { name: 'README.txt', blob: new Blob([
        'GOLUSOFT favicon pack — drop these in your /public directory.\n\n' +
        'Add this to your <head>:\n\n' + HTML_SNIPPET,
      ], { type: 'text/plain' }) },
    ];
    for (const r of results) {
      if (r.size === 192 || r.size === 512) {
        items.push({ name: `android-chrome-${r.size}x${r.size}.png`, blob: r.blob });
      } else {
        items.push({ name: `favicon-${r.size}x${r.size}.png`, blob: r.blob });
      }
    }
    await downloadAsZip(items, 'golusoft-favicon-pack.zip');
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        {!file ? (
          <FileDropzone
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            multiple={false}
            onFiles={onPick}
            label="Drop your logo or icon here"
            hint="Use a square image at least 512×512 px for best results."
            maxSize={20 * 1024 * 1024}
          />
        ) : (
          <div className="rounded-xl border border-border/60 bg-card p-4 flex items-center gap-3">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Source" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">Source image</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onPick([])}>Change</Button>
          </div>
        )}

        {file && (
          <div className="rounded-xl border border-border/60 bg-card p-4 flex flex-wrap items-center gap-3 justify-between">
            <Badge variant="secondary">{SIZES.length} sizes + .ico + apple-touch + manifest</Badge>
            <div className="flex flex-wrap gap-2">
              <Button onClick={generate} disabled={running} variant="gradient" size="sm">
                {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {running ? 'Generating…' : 'Generate'}
              </Button>
              {icoBlob && (
                <Button onClick={downloadPack} size="sm">
                  <Download className="h-4 w-4" /> Download pack (ZIP)
                </Button>
              )}
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="rounded-xl border border-border/60 bg-card p-4 space-y-4">
            <h3 className="font-semibold">Preview</h3>
            <div className="flex flex-wrap items-end gap-4">
              {results.map((r) => (
                <div key={r.size} className="flex flex-col items-center gap-1">
                  <div
                    className="bg-muted/40 rounded-md flex items-center justify-center"
                    style={{ width: r.size > 64 ? 64 : r.size, height: r.size > 64 ? 64 : r.size }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.url} alt={`${r.size}x${r.size}`} width={r.size > 64 ? 64 : r.size} height={r.size > 64 ? 64 : r.size} />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{r.size}×{r.size}</span>
                  <button onClick={() => downloadBlob(r.blob, `favicon-${r.size}x${r.size}.png`)} className="text-[10px] text-primary hover:underline">
                    Download
                  </button>
                </div>
              ))}
            </div>
            <div className="rounded-lg bg-muted/30 p-3">
              <p className="text-xs font-semibold mb-1">Add this to your &lt;head&gt;:</p>
              <pre className="text-[11px] overflow-x-auto whitespace-pre-wrap">{HTML_SNIPPET}</pre>
            </div>
          </div>
        )}
      </div>

      <aside>
        <div className="lg:sticky lg:top-20 rounded-xl border border-border/60 bg-card p-5 space-y-4">
          <h3 className="font-semibold">Options</h3>
          <div className="flex items-center justify-between">
            <Label>Round corners</Label>
            <Switch checked={rounded} onCheckedChange={setRounded} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Transparent background</Label>
            <Switch checked={transparent} onCheckedChange={setTransparent} />
          </div>
          {!transparent && (
            <div>
              <Label>Background color</Label>
              <div className="mt-1 flex items-center gap-2">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-10 w-12 rounded-lg border border-border cursor-pointer" />
                <span className="font-mono text-sm">{bgColor}</span>
              </div>
            </div>
          )}
          <div className="rounded-lg bg-muted/30 p-3 text-xs text-muted-foreground">
            <FileImage className="inline h-3.5 w-3.5 mr-1" />
            Generates: <strong>{SIZES.join(', ')}</strong> px PNGs, plus a multi-size <code>.ico</code>, <code>apple-touch-icon.png</code>, and a <code>site.webmanifest</code>.
          </div>
        </div>
      </aside>
    </div>
  );
}
