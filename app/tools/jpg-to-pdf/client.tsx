'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { PDFDocument, PageSizes } from 'pdf-lib';
import { ArrowDown, ArrowUp, Trash2, Loader2, Download, FilePlus } from 'lucide-react';

import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { downloadBlob, formatBytes } from '@/lib/utils';

type PageSize = 'A4' | 'Letter' | 'Legal' | 'A3' | 'A5' | 'Fit';
type Orientation = 'portrait' | 'landscape' | 'auto';

const SIZES: Record<Exclude<PageSize, 'Fit'>, [number, number]> = {
  A4: PageSizes.A4 as [number, number],
  Letter: PageSizes.Letter as [number, number],
  Legal: PageSizes.Legal as [number, number],
  A3: PageSizes.A3 as [number, number],
  A5: PageSizes.A5 as [number, number],
};

interface Item {
  id: string;
  file: File;
  previewUrl: string;
}

export function JpgToPdfClient() {
  const [items, setItems] = React.useState<Item[]>([]);
  const [pageSize, setPageSize] = React.useState<PageSize>('A4');
  const [orientation, setOrientation] = React.useState<Orientation>('auto');
  const [marginPct, setMarginPct] = React.useState<number>(5);
  const [running, setRunning] = React.useState(false);

  React.useEffect(() => {
    return () => {
      items.forEach((it) => URL.revokeObjectURL(it.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function add(files: File[]) {
    const next: Item[] = files
      .filter((f) => f.type.startsWith('image/'))
      .map((f) => ({ id: crypto.randomUUID(), file: f, previewUrl: URL.createObjectURL(f) }));
    setItems((p) => [...p, ...next]);
  }

  function move(id: string, dir: -1 | 1) {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.id === id);
      if (i < 0) return prev;
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const out = [...prev];
      [out[i], out[j]] = [out[j], out[i]];
      return out;
    });
  }

  function remove(id: string) {
    setItems((prev) => {
      const t = prev.find((p) => p.id === id);
      if (t) URL.revokeObjectURL(t.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  }

  async function build() {
    if (items.length === 0) return toast.error('Add at least one image');
    setRunning(true);
    try {
      const pdf = await PDFDocument.create();
      for (const it of items) {
        // eslint-disable-next-line no-await-in-loop
        const bytes = new Uint8Array(await it.file.arrayBuffer());
        const isPng = it.file.type.includes('png') || it.file.name.toLowerCase().endsWith('.png');
        // eslint-disable-next-line no-await-in-loop
        const img = isPng ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);

        // Determine page dimensions
        let pageW: number, pageH: number;
        if (pageSize === 'Fit') {
          pageW = img.width;
          pageH = img.height;
        } else {
          const [w, h] = SIZES[pageSize];
          const isLandscape =
            orientation === 'landscape' ||
            (orientation === 'auto' && img.width > img.height);
          pageW = isLandscape ? Math.max(w, h) : Math.min(w, h);
          pageH = isLandscape ? Math.min(w, h) : Math.max(w, h);
        }

        const page = pdf.addPage([pageW, pageH]);
        const margin = (Math.min(pageW, pageH) * marginPct) / 100;
        const availW = pageW - margin * 2;
        const availH = pageH - margin * 2;
        const scale = Math.min(availW / img.width, availH / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        page.drawImage(img, {
          x: (pageW - w) / 2,
          y: (pageH - h) / 2,
          width: w,
          height: h,
        });
      }
      const out = await pdf.save({ useObjectStreams: true });
      const blob = new Blob([out], { type: 'application/pdf' });
      downloadBlob(blob, 'images-to-pdf.pdf');
      toast.success('PDF created');
    } catch (e: any) {
      toast.error(e?.message || 'Failed to build PDF');
    } finally {
      setRunning(false);
    }
  }

  const totalSize = items.reduce((acc, x) => acc + x.file.size, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <FileDropzone
          accept="image/jpeg,image/png"
          onFiles={add}
          label="Drop JPG or PNG images here"
          hint="They'll be combined into a single PDF. Drag the arrows to reorder."
          maxSize={50 * 1024 * 1024}
        />

        {items.length > 0 && (
          <div className="rounded-xl border border-border/60 bg-card p-4 flex flex-wrap items-center gap-3 justify-between">
            <div className="text-sm text-muted-foreground">
              <strong className="text-foreground">{items.length}</strong> images · {formatBytes(totalSize)}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={build} disabled={running} variant="gradient" size="sm">
                {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <FilePlus className="h-4 w-4" />}
                {running ? 'Building…' : 'Build PDF'}
              </Button>
              <Button onClick={() => { items.forEach((it) => URL.revokeObjectURL(it.previewUrl)); setItems([]); }} variant="ghost" size="sm" disabled={running}>
                <Trash2 className="h-4 w-4" /> Clear
              </Button>
            </div>
          </div>
        )}

        {items.length > 0 && (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {items.map((it, i) => (
              <li key={it.id} className="group relative rounded-xl border border-border/60 bg-card p-2">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.previewUrl} alt={it.file.name} className="h-full w-full object-cover" loading="lazy" />
                  <Badge variant="secondary" className="absolute left-1.5 top-1.5">{i + 1}</Badge>
                </div>
                <p className="mt-2 text-xs truncate" title={it.file.name}>{it.file.name}</p>
                <div className="mt-1 flex items-center justify-between gap-1">
                  <Button size="icon" variant="ghost" className="h-7 w-7" aria-label="Move up" onClick={() => move(it.id, -1)} disabled={i === 0 || running}>
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" aria-label="Move down" onClick={() => move(it.id, 1)} disabled={i === items.length - 1 || running}>
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" aria-label="Remove" onClick={() => remove(it.id)} disabled={running}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <aside>
        <div className="lg:sticky lg:top-20 rounded-xl border border-border/60 bg-card p-5 space-y-4">
          <h3 className="font-semibold">PDF settings</h3>
          <div>
            <Label>Page size</Label>
            <Select value={pageSize} onValueChange={(v) => setPageSize(v as PageSize)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="A4">A4</SelectItem>
                <SelectItem value="Letter">Letter</SelectItem>
                <SelectItem value="Legal">Legal</SelectItem>
                <SelectItem value="A3">A3</SelectItem>
                <SelectItem value="A5">A5</SelectItem>
                <SelectItem value="Fit">Fit to image</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Orientation</Label>
            <Select value={orientation} onValueChange={(v) => setOrientation(v as Orientation)} disabled={pageSize === 'Fit'}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto (per image)</SelectItem>
                <SelectItem value="portrait">Portrait</SelectItem>
                <SelectItem value="landscape">Landscape</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label>Margin</Label>
              <span className="text-sm font-medium">{marginPct}%</span>
            </div>
            <Slider value={[marginPct]} min={0} max={20} step={1} onValueChange={(v) => setMarginPct(v[0])} className="mt-2" />
          </div>
        </div>
      </aside>
    </div>
  );
}
