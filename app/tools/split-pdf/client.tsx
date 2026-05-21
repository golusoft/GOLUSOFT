'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { PDFDocument } from 'pdf-lib';
import { Loader2, Download, FileText, Scissors } from 'lucide-react';

import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { downloadAsZip } from '@/lib/zip';

type Mode = 'each' | 'ranges' | 'every-n';

/**
 * Parse "1-3,5,7-9,12" into an array of 0-indexed page arrays. Each entry
 * becomes one output PDF.
 */
function parseRanges(input: string, total: number): number[][] {
  const groups: number[][] = [];
  for (const part of input.split(',').map((s) => s.trim()).filter(Boolean)) {
    if (part.includes('-')) {
      const [a, b] = part.split('-').map((s) => parseInt(s.trim(), 10));
      if (!isNaN(a) && !isNaN(b) && a >= 1 && b >= a && b <= total) {
        const arr: number[] = [];
        for (let i = a; i <= b; i++) arr.push(i - 1);
        groups.push(arr);
      }
    } else {
      const n = parseInt(part, 10);
      if (!isNaN(n) && n >= 1 && n <= total) groups.push([n - 1]);
    }
  }
  return groups;
}

export function SplitPdfClient() {
  const [file, setFile] = React.useState<File | null>(null);
  const [pageCount, setPageCount] = React.useState(0);
  const [mode, setMode] = React.useState<Mode>('each');
  const [ranges, setRanges] = React.useState('1-3,4-6');
  const [chunkSize, setChunkSize] = React.useState(1);
  const [running, setRunning] = React.useState(false);

  async function onPick(files: File[]) {
    const f = files[0];
    if (!f) return;
    try {
      const buf = await f.arrayBuffer();
      const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
      setFile(f);
      setPageCount(doc.getPageCount());
      setRanges(`1-${Math.min(3, doc.getPageCount())}`);
    } catch {
      toast.error(`Could not read "${f.name}"`);
    }
  }

  function reset() {
    setFile(null);
    setPageCount(0);
  }

  async function buildSubsets(): Promise<{ name: string; blob: Blob }[]> {
    if (!file) return [];
    const buf = await file.arrayBuffer();
    const src = await PDFDocument.load(buf, { ignoreEncryption: true });
    const total = src.getPageCount();

    let groups: number[][] = [];
    if (mode === 'each') {
      groups = Array.from({ length: total }, (_, i) => [i]);
    } else if (mode === 'ranges') {
      groups = parseRanges(ranges, total);
      if (groups.length === 0) throw new Error('No valid ranges. Example: 1-3,5,7-9');
    } else {
      const n = Math.max(1, Math.min(total, chunkSize));
      groups = [];
      for (let i = 0; i < total; i += n) {
        const arr = [];
        for (let j = i; j < Math.min(total, i + n); j++) arr.push(j);
        groups.push(arr);
      }
    }

    const baseName = file.name.replace(/\.pdf$/i, '');
    const out: { name: string; blob: Blob }[] = [];
    for (const group of groups) {
      // eslint-disable-next-line no-await-in-loop
      const dst = await PDFDocument.create();
      // eslint-disable-next-line no-await-in-loop
      const copied = await dst.copyPages(src, group);
      copied.forEach((p) => dst.addPage(p));
      // eslint-disable-next-line no-await-in-loop
      const bytes = await dst.save({ useObjectStreams: true });
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const range = group.length === 1 ? `p${group[0] + 1}` : `p${group[0] + 1}-${group[group.length - 1] + 1}`;
      out.push({ name: `${baseName}-${range}.pdf`, blob });
    }
    return out;
  }

  async function go() {
    if (!file) return toast.error('Upload a PDF first');
    setRunning(true);
    try {
      const subsets = await buildSubsets();
      if (subsets.length === 0) {
        toast.error('Nothing to split');
      } else if (subsets.length === 1) {
        downloadBlob(subsets[0].blob, subsets[0].name);
      } else {
        await downloadAsZip(subsets, `${file.name.replace(/\.pdf$/i, '')}-split.zip`);
      }
      toast.success(`Split into ${subsets.length} file${subsets.length === 1 ? '' : 's'}`);
    } catch (e: any) {
      toast.error(e?.message || 'Split failed');
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        {!file ? (
          <FileDropzone
            accept="application/pdf"
            multiple={false}
            onFiles={onPick}
            label="Drop a PDF to split, or click to upload"
            hint="Splits one PDF into multiple files based on the rules you set."
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
            <Badge variant="secondary">PDF has {pageCount} pages</Badge>
            <Button onClick={go} disabled={running} variant="gradient">
              {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Scissors className="h-4 w-4" />}
              {running ? 'Splitting…' : 'Split & download'}
            </Button>
          </div>
        )}
      </div>

      <aside>
        <div className="lg:sticky lg:top-20 rounded-xl border border-border/60 bg-card p-5 space-y-4">
          <h3 className="font-semibold">Split mode</h3>
          <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="each">Each page</TabsTrigger>
              <TabsTrigger value="ranges">Ranges</TabsTrigger>
              <TabsTrigger value="every-n">Every N</TabsTrigger>
            </TabsList>

            <TabsContent value="each" className="pt-2">
              <p className="text-sm text-muted-foreground">Outputs one PDF per page. {pageCount > 0 && <strong>{pageCount} files</strong>}</p>
            </TabsContent>

            <TabsContent value="ranges" className="space-y-2 pt-2">
              <Label htmlFor="ranges">Page ranges</Label>
              <Input
                id="ranges"
                value={ranges}
                onChange={(e) => setRanges(e.target.value)}
                placeholder="1-3,5,7-9"
              />
              <p className="text-xs text-muted-foreground">Comma-separated. Use dashes for ranges. Example: 1-3,5,7-9</p>
            </TabsContent>

            <TabsContent value="every-n" className="space-y-2 pt-2">
              <Label htmlFor="chunk">Pages per file</Label>
              <Input
                id="chunk"
                type="number"
                min={1}
                max={Math.max(1, pageCount)}
                value={chunkSize}
                onChange={(e) => setChunkSize(Math.max(1, Number(e.target.value) || 1))}
              />
              <p className="text-xs text-muted-foreground">
                {pageCount > 0 && `Will produce ${Math.ceil(pageCount / Math.max(1, chunkSize))} files.`}
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </aside>
    </div>
  );
}
