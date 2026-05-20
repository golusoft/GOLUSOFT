'use client';

import * as React from 'react';
import { toast } from 'sonner';
import {
  Trash2, Download, Settings2, RotateCcw, FileImage, Zap, Loader2, Layers,
} from 'lucide-react';

import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

import { compressImage, type OutputFormat } from '@/lib/image';
import { downloadAsZip } from '@/lib/zip';
import { downloadBlob, formatBytes } from '@/lib/utils';

interface Item {
  id: string;
  file: File;
  previewUrl: string;
  status: 'idle' | 'processing' | 'done' | 'error';
  outputBlob?: Blob;
  outputUrl?: string;
  outputName?: string;
  error?: string;
  origSize: number;
  outputSize?: number;
  progress: number;
}

type Mode = 'target' | 'quality';

export function ImageCompressorClient() {
  const [items, setItems] = React.useState<Item[]>([]);
  const [mode, setMode] = React.useState<Mode>('quality');
  const [targetKB, setTargetKB] = React.useState<number>(200);
  const [quality, setQuality] = React.useState<number>(75);
  const [maxDimension, setMaxDimension] = React.useState<number>(0); // 0 = original
  const [format, setFormat] = React.useState<OutputFormat>('auto');
  const [preserveExif, setPreserveExif] = React.useState<boolean>(false);
  const [running, setRunning] = React.useState<boolean>(false);

  // Cleanup object URLs on unmount
  React.useEffect(() => {
    return () => {
      items.forEach((it) => {
        URL.revokeObjectURL(it.previewUrl);
        if (it.outputUrl) URL.revokeObjectURL(it.outputUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addFiles(files: File[]) {
    const next: Item[] = files.map((f) => ({
      id: crypto.randomUUID(),
      file: f,
      previewUrl: URL.createObjectURL(f),
      status: 'idle',
      origSize: f.size,
      progress: 0,
    }));
    setItems((prev) => [...prev, ...next]);
    if (files.length > 0) toast.success(`${files.length} image${files.length > 1 ? 's' : ''} added`);
  }

  function removeItem(id: string) {
    setItems((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
        if (target.outputUrl) URL.revokeObjectURL(target.outputUrl);
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

  async function processOne(item: Item): Promise<Item> {
    try {
      const { blob, outputName } = await compressImage(item.file, {
        targetKB: mode === 'target' ? targetKB : undefined,
        quality,
        maxDimension,
        format,
        preserveExif,
        useWebWorker: true,
        onProgress: (p) => {
          setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, progress: p } : x)));
        },
      });
      const outputUrl = URL.createObjectURL(blob);
      return {
        ...item,
        status: 'done',
        outputBlob: blob,
        outputUrl,
        outputName,
        outputSize: blob.size,
        progress: 100,
      };
    } catch (err: any) {
      return { ...item, status: 'error', error: err?.message || 'Compression failed', progress: 0 };
    }
  }

  async function processAll() {
    if (items.length === 0) {
      toast.error('Add at least one image first');
      return;
    }
    setRunning(true);
    // Mark all as processing
    setItems((prev) => prev.map((x) => ({ ...x, status: 'processing', progress: 0, outputBlob: undefined, outputUrl: undefined })));

    // Sequential to keep memory low on mobile
    for (const it of items) {
      // eslint-disable-next-line no-await-in-loop
      const updated = await processOne(it);
      setItems((prev) => prev.map((x) => (x.id === it.id ? updated : x)));
    }

    setRunning(false);
    toast.success('Compression complete');
  }

  async function downloadAll() {
    const done = items.filter((x) => x.status === 'done' && x.outputBlob && x.outputName);
    if (done.length === 0) {
      toast.error('Nothing to download yet');
      return;
    }
    if (done.length === 1) {
      downloadBlob(done[0].outputBlob!, done[0].outputName!);
      return;
    }
    await downloadAsZip(
      done.map((x) => ({ name: x.outputName!, blob: x.outputBlob! })),
      'golusoft-compressed-images.zip'
    );
  }

  const totalOrig = items.reduce((acc, x) => acc + x.origSize, 0);
  const totalOut = items.reduce((acc, x) => acc + (x.outputSize || 0), 0);
  const savings = totalOrig > 0 && totalOut > 0 ? Math.max(0, Math.round((1 - totalOut / totalOrig) * 100)) : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* MAIN COLUMN */}
      <div className="lg:col-span-2 space-y-4">
        <FileDropzone
          accept="image/jpeg,image/png,image/webp,image/bmp,image/gif,image/avif"
          onFiles={addFiles}
          label="Drop images here, or click to upload"
          hint="JPG, PNG, WEBP, BMP, GIF, AVIF — up to 50MB per file."
          maxSize={50 * 1024 * 1024}
        />

        {/* Stats summary */}
        {items.length > 0 && (
          <div className="rounded-xl border border-border/60 bg-card p-4 flex flex-wrap items-center gap-3 justify-between">
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
              <span><Layers className="inline h-4 w-4 mr-1 text-muted-foreground" />{items.length} files</span>
              <span>Original: <strong>{formatBytes(totalOrig)}</strong></span>
              {totalOut > 0 && (
                <>
                  <span>Compressed: <strong className="text-emerald-600">{formatBytes(totalOut)}</strong></span>
                  <span><Badge variant="success">−{savings}%</Badge></span>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={processAll} disabled={running} variant="gradient" size="sm">
                {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                {running ? 'Processing…' : 'Compress all'}
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

        {/* Items list */}
        {items.length > 0 && (
          <ul className="space-y-2">
            {items.map((it) => (
              <li key={it.id} className="rounded-xl border border-border/60 bg-card p-3 flex items-center gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.outputUrl || it.previewUrl} alt={it.file.name} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{it.file.name}</p>
                    {it.status === 'done' && it.outputSize !== undefined && (
                      <Badge variant="success" className="text-[10px]">
                        −{Math.max(0, Math.round((1 - it.outputSize / it.origSize) * 100))}%
                      </Badge>
                    )}
                    {it.status === 'error' && <Badge variant="destructive" className="text-[10px]">Error</Badge>}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatBytes(it.origSize)}
                    {it.outputSize !== undefined && (
                      <> → <span className="text-emerald-600">{formatBytes(it.outputSize)}</span></>
                    )}
                    {it.error && <span className="text-destructive"> · {it.error}</span>}
                  </p>
                  {(it.status === 'processing' || it.status === 'done') && (
                    <Progress value={it.status === 'done' ? 100 : it.progress} className="mt-2 h-1.5" />
                  )}
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

      {/* SETTINGS COLUMN */}
      <aside className="lg:col-span-1">
        <div className="lg:sticky lg:top-20 rounded-xl border border-border/60 bg-card p-5 space-y-5">
          <header className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            <h3 className="font-semibold">Compression settings</h3>
          </header>

          <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="quality">Quality</TabsTrigger>
              <TabsTrigger value="target">Target size</TabsTrigger>
            </TabsList>

            <TabsContent value="quality" className="space-y-3 pt-2">
              <div>
                <div className="flex items-center justify-between">
                  <Label>Quality</Label>
                  <span className="text-sm font-medium">{quality}</span>
                </div>
                <Slider
                  value={[quality]}
                  min={10}
                  max={100}
                  step={1}
                  onValueChange={(v) => setQuality(v[0])}
                  className="mt-2"
                />
                <p className="mt-1 text-xs text-muted-foreground">Higher = better quality, larger file. 75 is a good default.</p>
              </div>
            </TabsContent>

            <TabsContent value="target" className="space-y-3 pt-2">
              <div>
                <Label htmlFor="targetKB">Target size (KB)</Label>
                <Input
                  id="targetKB"
                  type="number"
                  min={1}
                  max={10000}
                  value={targetKB}
                  onChange={(e) => setTargetKB(Math.max(1, Math.min(10000, Number(e.target.value) || 0)))}
                  className="mt-1"
                />
                <div className="mt-2 flex flex-wrap gap-1">
                  {[20, 50, 100, 200, 500, 1000].map((kb) => (
                    <button
                      key={kb}
                      onClick={() => setTargetKB(kb)}
                      className={`rounded-full border px-2.5 py-0.5 text-xs ${targetKB === kb ? 'bg-primary text-primary-foreground border-primary' : 'border-border'}`}
                    >
                      {kb < 1000 ? `${kb}KB` : `${kb / 1000}MB`}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">We iteratively compress until the file size is at or below your target.</p>
              </div>
            </TabsContent>
          </Tabs>

          <div>
            <div className="flex items-center justify-between">
              <Label>Resize (longest side)</Label>
              <span className="text-sm font-medium">{maxDimension === 0 ? 'Original' : `${maxDimension}px`}</span>
            </div>
            <Slider
              value={[maxDimension]}
              min={0}
              max={4000}
              step={100}
              onValueChange={(v) => setMaxDimension(v[0])}
              className="mt-2"
            />
            <p className="mt-1 text-xs text-muted-foreground">Optional — set 0 to keep the original resolution.</p>
          </div>

          <div>
            <Label>Output format</Label>
            <Select value={format} onValueChange={(v) => setFormat(v as OutputFormat)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto (keep original)</SelectItem>
                <SelectItem value="jpeg">JPEG (.jpg) — smallest</SelectItem>
                <SelectItem value="webp">WEBP — best compression</SelectItem>
                <SelectItem value="png">PNG (lossless)</SelectItem>
                <SelectItem value="bmp">BMP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="block">Preserve EXIF</Label>
              <p className="text-xs text-muted-foreground">Keep camera metadata (date, GPS, etc.).</p>
            </div>
            <Switch checked={preserveExif} onCheckedChange={setPreserveExif} />
          </div>

          <Button onClick={() => { setMode('quality'); setQuality(75); setTargetKB(200); setMaxDimension(0); setFormat('auto'); setPreserveExif(false); }} variant="ghost" className="w-full">
            <RotateCcw className="h-4 w-4" /> Reset to defaults
          </Button>
        </div>
      </aside>
    </div>
  );
}
