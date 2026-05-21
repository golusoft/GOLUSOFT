'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { PDFDocument } from 'pdf-lib';
import { Trash2, Download, Loader2, ArrowDown, ArrowUp, FileText, Combine } from 'lucide-react';

import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { getPdfPageCount } from '@/lib/pdf';

interface Item {
  id: string;
  file: File;
  pageCount: number;
}

export function MergePdfClient() {
  const [items, setItems] = React.useState<Item[]>([]);
  const [running, setRunning] = React.useState(false);

  async function addFiles(files: File[]) {
    const next: Item[] = [];
    for (const f of files) {
      try {
        const pages = await getPdfPageCount(f);
        next.push({ id: crypto.randomUUID(), file: f, pageCount: pages });
      } catch {
        toast.error(`Could not read "${f.name}"`);
      }
    }
    setItems((prev) => [...prev, ...next]);
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

  function removeItem(id: string) {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  function clearAll() {
    setItems([]);
  }

  async function merge() {
    if (items.length < 2) return toast.error('Add at least 2 PDFs to merge');
    setRunning(true);
    try {
      const out = await PDFDocument.create();
      for (const it of items) {
        // eslint-disable-next-line no-await-in-loop
        const buf = await it.file.arrayBuffer();
        // eslint-disable-next-line no-await-in-loop
        const src = await PDFDocument.load(buf, { ignoreEncryption: true });
        // eslint-disable-next-line no-await-in-loop
        const copied = await out.copyPages(src, src.getPageIndices());
        copied.forEach((p) => out.addPage(p));
      }
      const bytes = await out.save({ useObjectStreams: true });
      const blob = new Blob([bytes], { type: 'application/pdf' });
      downloadBlob(blob, 'merged.pdf');
      toast.success('Merged PDF downloaded');
    } catch (e: any) {
      toast.error(e?.message || 'Merge failed');
    } finally {
      setRunning(false);
    }
  }

  const totalPages = items.reduce((acc, x) => acc + x.pageCount, 0);
  const totalSize = items.reduce((acc, x) => acc + x.file.size, 0);

  return (
    <div className="space-y-4">
      <FileDropzone
        accept="application/pdf"
        onFiles={addFiles}
        label="Drop PDFs to merge, or click to upload"
        hint="Files will be merged in the order shown below. Drag arrows to reorder."
        maxSize={200 * 1024 * 1024}
      />

      {items.length > 0 && (
        <div className="rounded-xl border border-border/60 bg-card p-4 flex flex-wrap items-center gap-3 justify-between">
          <div className="text-sm text-muted-foreground">
            <strong className="text-foreground">{items.length}</strong> files · {totalPages} pages · {formatBytes(totalSize)}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={merge} disabled={running || items.length < 2} variant="gradient" size="sm">
              {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Combine className="h-4 w-4" />}
              {running ? 'Merging…' : 'Merge & download'}
            </Button>
            <Button onClick={clearAll} variant="ghost" size="sm" disabled={running}>
              <Trash2 className="h-4 w-4" /> Clear
            </Button>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <ul className="space-y-2">
          {items.map((it, i) => (
            <li key={it.id} className="rounded-xl border border-border/60 bg-card p-3 flex items-center gap-3">
              <Badge variant="secondary" className="shrink-0 font-mono">{i + 1}</Badge>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{it.file.name}</p>
                <p className="text-xs text-muted-foreground">{it.pageCount} pages · {formatBytes(it.file.size)}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" aria-label="Move up" onClick={() => move(it.id, -1)} disabled={i === 0 || running}>
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" aria-label="Move down" onClick={() => move(it.id, 1)} disabled={i === items.length - 1 || running}>
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" aria-label="Remove" onClick={() => removeItem(it.id)} disabled={running}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
