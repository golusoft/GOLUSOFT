'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Trash2, Download, Settings2, Lock, Unlock, Loader2, Zap, RotateCcw } from 'lucide-react';

import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

import { redrawToCanvas, getImageDimensions, getOutputMime, getOutputName, type OutputFormat } from '@/lib/image';
import { downloadAsZip } from '@/lib/zip';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { SIZE_PRESETS, PRESET_GROUP_LABELS } from '@/lib/presets';

type Mode = 'pixels' | 'percent' | 'preset' | 'physical';
type Unit = 'cm' | 'mm' | 'inch';

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
  outputW?: number;
  outputH?: number;
  status: 'idle' | 'processing' | 'done' | 'error';
  error?: string;
}

export function ImageResizerClient() {
  const [items, setItems] = React.useState<Item[]>([]);
  const [mode, setMode] = React.useState<Mode>('pixels');
  const [width, setWidth] = React.useState<number>(1080);
  const [height, setHeight] = React.useState<number>(1080);
  const [percent, setPercent] = React.useState<number>(50);
  const [presetId, setPresetId] = React.useState<string>('instagram-square');
  const [unit, setUnit] = React.useState<Unit>('cm');
  const [physW, setPhysW] = React.useState<number>(10);
  const [physH, setPhysH] = React.useState<number>(15);
  const [dpi, setDpi] = React.useState<number>(300);
  const [lockRatio, setLockRatio] = React.useState<boolean>(true);
  const [format, setFormat] = React.useState<OutputFormat>('auto');
  const [quality, setQuality] = React.useState<number>(92);
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
    setItems((prev) => [...prev, ...next]);
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

  function physicalToPixels(value: number, u: Unit, dotsPerInch: number): number {
    if (u === 'cm') return Math.round((value / 2.54) * dotsPerInch);
    if (u === 'mm') return Math.round((value / 25.4) * dotsPerInch);
    return Math.round(value * dotsPerInch);
  }

  function targetSize(item: Item): { w: number; h: number } {
    const ratio = item.origWidth / item.origHeight;

    if (mode === 'pixels') {
      let w = Math.max(1, Math.round(width));
      let h = Math.max(1, Math.round(height));
      if (lockRatio) h = Math.round(w / ratio);
      return { w, h };
    }
    if (mode === 'percent') {
      const w = Math.max(1, Math.round((item.origWidth * percent) / 100));
      const h = Math.max(1, Math.round((item.origHeight * percent) / 100));
      return { w, h };
    }
    if (mode === 'preset') {
      const p = SIZE_PRESETS.find((x) => x.id === presetId);
      if (!p) return { w: item.origWidth, h: item.origHeight };
      return { w: p.width, h: p.height };
    }
    // physical
    const w = physicalToPixels(physW, unit, dpi);
    let h = physicalToPixels(physH, unit, dpi);
    if (lockRatio) h = Math.round(w / ratio);
    return { w, h };
  }

  // Sync height when width changes in lock-ratio pixel mode
  function onWidthChange(v: number) {
    setWidth(v);
    if (lockRatio && items[0]) {
      const ratio = items[0].origWidth / items[0].origHeight;
      setHeight(Math.round(v / ratio));
    }
  }
  function onHeightChange(v: number) {
    setHeight(v);
    if (lockRatio && items[0]) {
      const ratio = items[0].origWidth / items[0].origHeight;
      setWidth(Math.round(v * ratio));
    }
  }

  async function processOne(item: Item): Promise<Item> {
    try {
      const { w, h } = targetSize(item);
      const mime = getOutputMime(item.file, format);
      const blob = await redrawToCanvas(item.file, { width: w, height: h, mime, quality: quality / 100 });
      const outputName = getOutputName(item.file, format, '-resized');
      return {
        ...item,
        status: 'done',
        outputBlob: blob,
        outputUrl: URL.createObjectURL(blob),
        outputName,
        outputSize: blob.size,
        outputW: w,
        outputH: h,
      };
    } catch (e: any) {
      return { ...item, status: 'error', error: e?.message || 'Resize failed' };
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
    toast.success('Resize complete');
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
      'golusoft-resized-images.zip'
    );
  }

  const grouped = React.useMemo(() => {
    const out: Record<string, typeof SIZE_PRESETS> = {};
    SIZE_PRESETS.forEach((p) => {
      out[p.group] = out[p.group] || [];
      out[p.group].push(p);
    });
    return out;
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* MAIN */}
      <div className="lg:col-span-2 space-y-4">
        <FileDropzone
          accept="image/jpeg,image/png,image/webp,image/bmp"
          onFiles={addFiles}
          label="Drop images here, or click to upload"
          hint="JPG, PNG, WEBP, BMP — up to 50MB per file."
          maxSize={50 * 1024 * 1024}
        />

        {items.length > 0 && (
          <div className="rounded-xl border border-border/60 bg-card p-4 flex flex-wrap items-center gap-3 justify-between">
            <div className="text-sm text-muted-foreground">
              <strong className="text-foreground">{items.length}</strong> file{items.length === 1 ? '' : 's'} ready
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={processAll} disabled={running} variant="gradient" size="sm">
                {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                {running ? 'Resizing…' : 'Resize all'}
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
                    {it.outputW && it.outputH && (
                      <> → <span className="text-emerald-600">{it.outputW}×{it.outputH}</span> · {formatBytes(it.outputSize || 0)}</>
                    )}
                    {it.error && <span className="text-destructive"> · {it.error}</span>}
                  </p>
                  {it.status === 'done' && <Badge variant="success" className="mt-1 text-[10px]">Done</Badge>}
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
            <h3 className="font-semibold">Resize settings</h3>
          </header>

          <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
            <TabsList className="grid w-full grid-cols-4 text-xs">
              <TabsTrigger value="pixels">Pixels</TabsTrigger>
              <TabsTrigger value="percent">%</TabsTrigger>
              <TabsTrigger value="preset">Preset</TabsTrigger>
              <TabsTrigger value="physical">cm/in</TabsTrigger>
            </TabsList>

            <TabsContent value="pixels" className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="w">Width (px)</Label>
                  <Input id="w" type="number" min={1} value={width} onChange={(e) => onWidthChange(Number(e.target.value) || 1)} />
                </div>
                <div>
                  <Label htmlFor="h">Height (px)</Label>
                  <Input id="h" type="number" min={1} value={height} onChange={(e) => onHeightChange(Number(e.target.value) || 1)} />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLockRatio((v) => !v)}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                {lockRatio ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                Aspect ratio {lockRatio ? 'locked' : 'unlocked'}
              </button>
            </TabsContent>

            <TabsContent value="percent" className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <Label>Scale</Label>
                <span className="text-sm font-medium">{percent}%</span>
              </div>
              <Slider value={[percent]} min={1} max={200} step={1} onValueChange={(v) => setPercent(v[0])} />
              <div className="flex flex-wrap gap-1">
                {[10, 25, 50, 75, 100, 150, 200].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPercent(p)}
                    className={`rounded-full border px-2.5 py-0.5 text-xs ${percent === p ? 'bg-primary text-primary-foreground border-primary' : 'border-border'}`}
                  >
                    {p}%
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="preset" className="space-y-3 pt-2">
              <Label>Choose a preset</Label>
              <Select value={presetId} onValueChange={setPresetId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(grouped) as (keyof typeof grouped)[]).map((g) => (
                    <SelectGroup key={g}>
                      <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase">
                        {PRESET_GROUP_LABELS[g as keyof typeof PRESET_GROUP_LABELS]}
                      </div>
                      {grouped[g].map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.label} — {p.width}×{p.height}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Includes Instagram, WhatsApp, YouTube, passport, A4, Full HD &amp; more.</p>
            </TabsContent>

            <TabsContent value="physical" className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Width</Label>
                  <Input type="number" min={0.1} step={0.1} value={physW} onChange={(e) => setPhysW(Number(e.target.value) || 0)} />
                </div>
                <div>
                  <Label>Height</Label>
                  <Input type="number" min={0.1} step={0.1} value={physH} onChange={(e) => setPhysH(Number(e.target.value) || 0)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Unit</Label>
                  <Select value={unit} onValueChange={(v) => setUnit(v as Unit)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cm">cm</SelectItem>
                      <SelectItem value="mm">mm</SelectItem>
                      <SelectItem value="inch">inches</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>DPI</Label>
                  <Input type="number" min={72} max={1200} step={1} value={dpi} onChange={(e) => setDpi(Math.max(72, Number(e.target.value) || 300))} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Output ≈ <strong>{physicalToPixels(physW, unit, dpi)}×{physicalToPixels(physH, unit, dpi)}</strong> px
              </p>
              <button type="button" onClick={() => setLockRatio((v) => !v)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                {lockRatio ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                Aspect ratio {lockRatio ? 'locked' : 'unlocked'}
              </button>
            </TabsContent>
          </Tabs>

          <div>
            <Label>Output format</Label>
            <Select value={format} onValueChange={(v) => setFormat(v as OutputFormat)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto (keep original)</SelectItem>
                <SelectItem value="jpeg">JPEG (.jpg)</SelectItem>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="webp">WEBP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label>Quality</Label>
              <span className="text-sm font-medium">{quality}</span>
            </div>
            <Slider value={[quality]} min={10} max={100} step={1} onValueChange={(v) => setQuality(v[0])} className="mt-2" />
          </div>

          <Button onClick={() => { setMode('pixels'); setWidth(1080); setHeight(1080); setPercent(50); setLockRatio(true); setFormat('auto'); setQuality(92); }} variant="ghost" className="w-full">
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
        </div>
      </aside>
    </div>
  );
}

function physicalToPixels(value: number, u: Unit, dotsPerInch: number): number {
  if (u === 'cm') return Math.round((value / 2.54) * dotsPerInch);
  if (u === 'mm') return Math.round((value / 25.4) * dotsPerInch);
  return Math.round(value * dotsPerInch);
}
