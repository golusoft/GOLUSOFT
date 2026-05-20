'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Loader2, Download, FileText, FileImage, Trash2 } from 'lucide-react';

import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

import { renderAllPages, canvasToJpegBlob, canvasToPngBlob, getPdfPageCount } from '@/lib/pdf';
import { downloadAsZip } from '@/lib/zip';
import { downloadBlob, formatBytes } from '@/lib/utils';

type Format = 'jpg' | 'png';

export function PdfToJpgClient() {
  const [file, setFile] = React.useState<File | null>(null);
  const [pageCount, setPageCount] = React.useState(0);
  const [dpi, setDpi] = React.useState(150);
  const [quality, setQuality] = React.useState(90);
  const [format, setFormat] = React.useState<Format>('jpg');
  const [running, setRunning] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [results, setResults] = React.useState<{ name: string; blob: Blob; url: string }[]>([]);

  React.useEffect(() => {
    return () => {
      results.forEach((r) => URL.revokeObjectURL(r.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onPick(files: File[]) {
    const f = files[0];
    if (!f) return;
    try {
      const pages = await getPdfPageCount(f);
      setFile(f);
      setPageCount(pages);
      results.forEach((r) => URL.revokeObjectURL(r.url));
      setResults([]);
    } catch {
      toast.error(`Could not read "${f.name}"`);
    }
  }

  function reset() {
    results.forEach((r) => URL.revokeObjectURL(r.url));
    setResults([]);
    setFile(null);
    setPageCount(0);
    setProgress(0);
  }

  async function convert() {
    if (!file) return;
    setRunning(true);
    setProgress(0);
    try {
      const scale = dpi / 72;
      const canvases = await renderAllPages(file, scale, (i, total) => {
        setProgress(Math.round((i / total) * 100));
      });
      const baseName = file.name.replace(/\.pdf$/i, '');
      const out: { name: string; blob: Blob; url: string }[] = [];
      for (let i = 0; i < canvases.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        const blob = format === 'jpg'
          ? await canvasToJpegBlob(canvases[i], quality / 100)
          : await canvasToPngBlob(canvases[i]);
        out.push({
          name: `${baseName}-page-${String(i + 1).padStart(3, '0')}.${format}`,
          blob,
          url: URL.createObjectURL(blob),
        });
      }
      results.forEach((r) => URL.revokeObjectURL(r.url));
      setResults(out);
      toast.success(`Converted ${out.length} pages`);
    } catch (e: any) {
      toast.error(e?.message || 'Conversion failed');
    } finally {
      setRunning(false);
      setProgress(100);
    }
  }

  async function downloadAll() {
    if (results.length === 0) return;
    if (results.length === 1) {
      downloadBlob(results[0].blob, results[0].name);
      return;
    }
    await downloadAsZip(results.map((r) => ({ name: r.name, blob: r.blob })), `${file?.name.replace(/\.pdf$/i, '')}-images.zip`);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        {!file ? (
          <FileDropzone
            accept="application/pdf"
            multiple={false}
            onFiles={onPick}
            label="Drop a PDF, or click to upload"
            hint="Each page will be rendered to an image."
            maxSize={200 * 1024 * 1024}
          />
        ) : (
          <div className="rounded-xl border border-border/60 bg-card p-4 flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600">
              <FileText className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{pageCount} pages · {formatBytes(file.size)}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={reset}>Change</Button>
          </div>
        )}

        {file && (
          <div className="rounded-xl border border-border/60 bg-card p-4 flex flex-wrap items-center gap-3 justify-between">
            <Badge variant="secondary">{pageCount} pages → {format.toUpperCase()}</Badge>
            <div className="flex flex-wrap gap-2">
              <Button onClick={convert} disabled={running} variant="gradient" size="sm">
                {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileImage className="h-4 w-4" />}
                {running ? `Rendering ${progress}%…` : 'Convert'}
              </Button>
              {results.length > 0 && (
                <Button onClick={downloadAll} size="sm">
                  <Download className="h-4 w-4" /> Download {results.length > 1 ? 'ZIP' : ''}
                </Button>
              )}
            </div>
          </div>
        )}

        {running && <Progress value={progress} className="h-1.5" />}

        {results.length > 0 && (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {results.map((r, i) => (
              <li key={i} className="rounded-xl border border-border/60 bg-card p-2">
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.url} alt={r.name} className="h-full w-full object-contain" loading="lazy" />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs truncate">Page {i + 1}</span>
                  <Button size="icon" variant="ghost" className="h-7 w-7" aria-label="Download" onClick={() => downloadBlob(r.blob, r.name)}>
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <aside>
        <div className="lg:sticky lg:top-20 rounded-xl border border-border/60 bg-card p-5 space-y-4">
          <h3 className="font-semibold">Output settings</h3>
          <Tabs value={format} onValueChange={(v) => setFormat(v as Format)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="jpg">JPG</TabsTrigger>
              <TabsTrigger value="png">PNG</TabsTrigger>
            </TabsList>
          </Tabs>

          <div>
            <div className="flex items-center justify-between">
              <Label>DPI</Label>
              <span className="text-sm font-medium">{dpi}</span>
            </div>
            <Slider value={[dpi]} min={72} max={300} step={1} onValueChange={(v) => setDpi(v[0])} className="mt-2" />
            <p className="mt-1 text-xs text-muted-foreground">Higher DPI = sharper images, larger files. 150 is a balanced default.</p>
          </div>

          {format === 'jpg' && (
            <div>
              <div className="flex items-center justify-between">
                <Label>Quality</Label>
                <span className="text-sm font-medium">{quality}</span>
              </div>
              <Slider value={[quality]} min={40} max={100} step={1} onValueChange={(v) => setQuality(v[0])} className="mt-2" />
            </div>
          )}

          {results.length > 0 && (
            <Button variant="ghost" size="sm" className="w-full" onClick={() => { results.forEach((r) => URL.revokeObjectURL(r.url)); setResults([]); }}>
              <Trash2 className="h-4 w-4" /> Clear results
            </Button>
          )}
        </div>
      </aside>
    </div>
  );
}
