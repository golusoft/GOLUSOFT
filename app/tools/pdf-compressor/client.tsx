'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Trash2, Download, Settings2, Loader2, Zap, RotateCcw, FileText } from 'lucide-react';

import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

import { rasterizeToPdf, lightCompressPdf, getPdfPageCount } from '@/lib/pdf';
import { downloadAsZip } from '@/lib/zip';
import { downloadBlob, formatBytes } from '@/lib/utils';

type Mode = 'preset' | 'target';
type Preset = 'low' | 'medium' | 'high' | 'extreme';

const PRESETS: Record<Preset, { scale: number; quality: number; label: string; subtitle: string }> = {
  low: { scale: 2.0, quality: 0.85, label: 'Low (best quality)', subtitle: '~ 10-25% smaller' },
  medium: { scale: 1.5, quality: 0.75, label: 'Medium (balanced)', subtitle: '~ 30-50% smaller' },
  high: { scale: 1.2, quality: 0.6, label: 'High (smaller)', subtitle: '~ 50-70% smaller' },
  extreme: { scale: 0.9, quality: 0.45, label: 'Extreme (smallest)', subtitle: '~ 70-85% smaller' },
};

interface Item {
  id: string;
  file: File;
  pageCount: number;
  outputBlob?: Blob;
  outputName?: string;
  outputSize?: number;
  status: 'idle' | 'processing' | 'done' | 'error';
  error?: string;
  progress: number;
}

export function PdfCompressorClient() {
  const [items, setItems] = React.useState<Item[]>([]);
  const [mode, setMode] = React.useState<Mode>('preset');
  const [preset, setPreset] = React.useState<Preset>('medium');
  const [targetKB, setTargetKB] = React.useState<number>(500);
  const [running, setRunning] = React.useState<boolean>(false);

  async function addFiles(files: File[]) {
    const next: Item[] = [];
    for (const f of files) {
      try {
        const pages = await getPdfPageCount(f);
        next.push({
          id: crypto.randomUUID(),
          file: f,
          pageCount: pages,
          status: 'idle',
          progress: 0,
        });
      } catch {
        toast.error(`Could not read "${f.name}". Is it a valid PDF?`);
      }
    }
    setItems((prev) => [...prev, ...next]);
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  function clearAll() {
    setItems([]);
  }

  async function processOne(item: Item): Promise<Item> {
    try {
      let blob: Blob;

      if (mode === 'preset' && preset === 'low') {
        // Low preset = lossless re-save (no rasterization)
        blob = await lightCompressPdf(item.file);
      } else if (mode === 'preset') {
        const p = PRESETS[preset];
        blob = await rasterizeToPdf(item.file, {
          scale: p.scale,
          jpegQuality: p.quality,
          onProgress: (i, total) =>
            setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, progress: Math.round((i / total) * 100) } : x))),
        });
      } else {
        // Target mode: iterate over presets until we reach target size
        const order: Preset[] = ['low', 'medium', 'high', 'extreme'];
        blob = await lightCompressPdf(item.file);
        if (blob.size / 1024 > targetKB) {
          for (const tier of order.slice(1)) {
            const p = PRESETS[tier];
            // eslint-disable-next-line no-await-in-loop
            blob = await rasterizeToPdf(item.file, {
              scale: p.scale,
              jpegQuality: p.quality,
              onProgress: (i, total) =>
                setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, progress: Math.round((i / total) * 100) } : x))),
            });
            if (blob.size / 1024 <= targetKB) break;
          }
        }
      }

      const outputName = item.file.name.replace(/\.pdf$/i, '') + '-compressed.pdf';
      return {
        ...item,
        status: 'done',
        outputBlob: blob,
        outputName,
        outputSize: blob.size,
        progress: 100,
      };
    } catch (e: any) {
      return { ...item, status: 'error', error: e?.message || 'Compression failed', progress: 0 };
    }
  }

  async function processAll() {
    if (items.length === 0) return toast.error('Add at least one PDF first');
    setRunning(true);
    setItems((prev) => prev.map((x) => ({ ...x, status: 'processing', progress: 0, outputBlob: undefined })));
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
    if (done.length === 0) return;
    if (done.length === 1) return downloadBlob(done[0].outputBlob!, done[0].outputName!);
    await downloadAsZip(done.map((x) => ({ name: x.outputName!, blob: x.outputBlob! })), 'golusoft-compressed-pdfs.zip');
  }

  const totalOrig = items.reduce((acc, x) => acc + x.file.size, 0);
  const totalOut = items.reduce((acc, x) => acc + (x.outputSize || 0), 0);
  const savings = totalOrig > 0 && totalOut > 0 ? Math.max(0, Math.round((1 - totalOut / totalOrig) * 100)) : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <FileDropzone
          accept="application/pdf"
          onFiles={addFiles}
          label="Drop PDFs here, or click to upload"
          hint="PDF files — up to 200MB per file. All processing happens in your browser."
          maxSize={200 * 1024 * 1024}
        />

        {items.length > 0 && (
          <div className="rounded-xl border border-border/60 bg-card p-4 flex flex-wrap items-center gap-3 justify-between">
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
              <span><FileText className="inline h-4 w-4 mr-1 text-muted-foreground" />{items.length} PDF{items.length === 1 ? '' : 's'}</span>
              <span>Original: <strong>{formatBytes(totalOrig)}</strong></span>
              {totalOut > 0 && (
                <>
                  <span>Compressed: <strong className="text-emerald-600">{formatBytes(totalOut)}</strong></span>
                  <Badge variant="success">−{savings}%</Badge>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={processAll} disabled={running} variant="gradient" size="sm">
                {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                {running ? 'Compressing…' : 'Compress all'}
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
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{it.file.name}</p>
                    {it.status === 'done' && it.outputSize !== undefined && (
                      <Badge variant="success" className="text-[10px]">
                        −{Math.max(0, Math.round((1 - it.outputSize / it.file.size) * 100))}%
                      </Badge>
                    )}
                    {it.status === 'error' && <Badge variant="destructive" className="text-[10px]">Error</Badge>}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {it.pageCount} pages · {formatBytes(it.file.size)}
                    {it.outputSize !== undefined && (
                      <> → <span className="text-emerald-600">{formatBytes(it.outputSize)}</span></>
                    )}
                    {it.error && <span className="text-destructive"> · {it.error}</span>}
                  </p>
                  {(it.status === 'processing' || it.status === 'done') && (
                    <Progress value={it.progress} className="mt-2 h-1.5" />
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

      <aside className="lg:col-span-1">
        <div className="lg:sticky lg:top-20 rounded-xl border border-border/60 bg-card p-5 space-y-5">
          <header className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            <h3 className="font-semibold">Compression settings</h3>
          </header>

          <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preset">Preset</TabsTrigger>
              <TabsTrigger value="target">Target size</TabsTrigger>
            </TabsList>

            <TabsContent value="preset" className="space-y-2 pt-2">
              {(Object.keys(PRESETS) as Preset[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPreset(p)}
                  className={`w-full text-left rounded-lg border px-4 py-3 transition-colors ${preset === p ? 'border-primary bg-primary/5' : 'border-border hover:bg-accent'}`}
                >
                  <div className="font-medium text-sm">{PRESETS[p].label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{PRESETS[p].subtitle}</div>
                </button>
              ))}
            </TabsContent>

            <TabsContent value="target" className="space-y-3 pt-2">
              <div>
                <Label htmlFor="targetKB">Target size (KB)</Label>
                <Input
                  id="targetKB"
                  type="number"
                  min={50}
                  max={50000}
                  step={50}
                  value={targetKB}
                  onChange={(e) => setTargetKB(Math.max(50, Math.min(50000, Number(e.target.value) || 0)))}
                  className="mt-1"
                />
                <div className="mt-2 flex flex-wrap gap-1">
                  {[100, 200, 500, 1000, 2000, 5000].map((kb) => (
                    <button
                      key={kb}
                      onClick={() => setTargetKB(kb)}
                      className={`rounded-full border px-2.5 py-0.5 text-xs ${targetKB === kb ? 'bg-primary text-primary-foreground border-primary' : 'border-border'}`}
                    >
                      {kb < 1000 ? `${kb}KB` : `${kb / 1000}MB`}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  We'll try increasingly aggressive compression until your PDF fits the target. Pages may be rasterized.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="rounded-lg bg-muted/30 p-3 text-xs text-muted-foreground">
            <strong className="text-foreground">How it works:</strong> medium/high/extreme presets render each page to a JPEG image and rebuild the PDF.
            This produces dramatic size reductions but the resulting PDF won't have selectable text. Pick "Low" to keep text searchable.
          </div>

          <Button onClick={() => { setMode('preset'); setPreset('medium'); setTargetKB(500); }} variant="ghost" className="w-full">
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
        </div>
      </aside>
    </div>
  );
}
