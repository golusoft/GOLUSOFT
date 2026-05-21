'use client';

import * as React from 'react';
import { toast } from 'sonner';
import {
  Trash2, Download, Loader2, Zap, Settings2, RotateCcw,
} from 'lucide-react';

import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

import { getEngine, type ProcessResult } from '@/lib/tool-engines';
import { downloadAsZip } from '@/lib/zip';
import { downloadBlob, formatBytes } from '@/lib/utils';

// Import engine registrations
import '@/lib/engines/register-all';

export interface ToolSetting {
  key: string;
  label: string;
  type: 'number' | 'text' | 'slider' | 'select' | 'switch' | 'color' | 'textarea';
  default: any;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
  hint?: string;
}

interface UniversalToolClientProps {
  slug: string;
  accept?: string;
  multiple?: boolean;
  settings?: ToolSetting[];
  maxSize?: number;
  uploadLabel?: string;
  uploadHint?: string;
  processLabel?: string;
}


export function UniversalToolClient({
  slug,
  accept = 'image/*',
  multiple = true,
  settings = [],
  maxSize = 100 * 1024 * 1024,
  uploadLabel,
  uploadHint,
  processLabel = 'Process',
}: UniversalToolClientProps) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [results, setResults] = React.useState<ProcessResult[]>([]);
  const [running, setRunning] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [settingsState, setSettingsState] = React.useState<Record<string, any>>(() => {
    const init: Record<string, any> = {};
    settings.forEach((s) => { init[s.key] = s.default; });
    return init;
  });

  function addFiles(newFiles: File[]) {
    setFiles((prev) => multiple ? [...prev, ...newFiles] : newFiles);
    setResults([]);
    if (newFiles.length > 0) toast.success(`${newFiles.length} file${newFiles.length > 1 ? 's' : ''} added`);
  }

  function removeFile(idx: number) {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setResults([]);
  }

  function clearAll() {
    setFiles([]);
    setResults([]);
  }

  function updateSetting(key: string, value: any) {
    setSettingsState((prev) => ({ ...prev, [key]: value }));
  }

  function resetSettings() {
    const init: Record<string, any> = {};
    settings.forEach((s) => { init[s.key] = s.default; });
    setSettingsState(init);
  }


  async function process() {
    // Some tools (converters, generators) don't need files
    const needsFiles = accept !== '';
    if (needsFiles && files.length === 0) {
      toast.error('Add at least one file first');
      return;
    }
    setRunning(true);
    setProgress(10);
    try {
      const engine = await getEngine(slug);
      if (!engine) {
        toast.error('Processing engine not available for this tool');
        setRunning(false);
        return;
      }
      setProgress(30);
      const output = await engine(files, settingsState);
      setProgress(90);
      setResults(output);
      toast.success(`Done — ${output.length} file${output.length === 1 ? '' : 's'} ready`);
    } catch (err: any) {
      console.error('[tool-engine]', err);
      toast.error(err?.message || 'Processing failed. Try a different file or settings.');
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
    await downloadAsZip(
      results.map((r) => ({ name: r.name, blob: r.blob })),
      `golusoft-${slug}-output.zip`
    );
  }

  const totalSize = files.reduce((s, f) => s + f.size, 0);


  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main area */}
      <div className="lg:col-span-2 space-y-4">
        {accept ? (
          <FileDropzone
            accept={accept}
            multiple={multiple}
            onFiles={addFiles}
            label={uploadLabel || 'Drop files here, or click to upload'}
            hint={uploadHint || 'All processing happens in your browser. Files never leave your device.'}
            maxSize={maxSize}
          />
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-border/70 bg-muted/20 p-8 text-center">
            <p className="text-base font-semibold">{uploadLabel || 'No file upload needed'}</p>
            <p className="mt-1 text-sm text-muted-foreground">{uploadHint || 'Configure settings in the panel and click Process.'}</p>
          </div>
        )}

        {(files.length > 0 || !accept) && (
          <div className="rounded-xl border border-border/60 bg-card p-4 flex flex-wrap items-center gap-3 justify-between">
            <div className="text-sm text-muted-foreground">
              {files.length > 0 ? (
                <><strong className="text-foreground">{files.length}</strong> file{files.length === 1 ? '' : 's'} · {formatBytes(totalSize)}</>
              ) : (
                <span>Ready to process</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={process} disabled={running} variant="gradient" size="sm">
                {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                {running ? 'Processing…' : processLabel}
              </Button>
              {results.length > 0 && (
                <Button onClick={downloadAll} size="sm">
                  <Download className="h-4 w-4" /> Download {results.length > 1 ? 'ZIP' : ''}
                </Button>
              )}
              <Button onClick={clearAll} variant="ghost" size="sm" disabled={running}>
                <Trash2 className="h-4 w-4" /> Clear
              </Button>
            </div>
          </div>
        )}

        {running && <Progress value={progress} className="h-1.5" />}


        {/* File list */}
        {files.length > 0 && (
          <ul className="space-y-2">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`} className="rounded-xl border border-border/60 bg-card p-3 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
                  {(f.name.split('.').pop() || '?').toUpperCase().slice(0, 4)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{f.name}</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(f.size)}</p>
                </div>
                <Button size="icon" variant="ghost" aria-label="Remove" onClick={() => removeFile(i)} disabled={running}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Badge variant="success">{results.length} output{results.length > 1 ? 's' : ''}</Badge>
              Ready to download
            </h3>
            <ul className="space-y-2">
              {results.map((r, i) => (
                <li key={`${r.name}-${i}`} className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-bold">
                    {(r.name.split('.').pop() || '?').toUpperCase().slice(0, 4)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{formatBytes(r.blob.size)}</p>
                    {r.meta && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {Object.entries(r.meta).slice(0, 4).map(([k, v]) => (
                          <Badge key={k} variant="secondary" className="text-[10px]">{k}: {v}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button size="icon" variant="ghost" aria-label="Download" onClick={() => downloadBlob(r.blob, r.name)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>


      {/* Settings sidebar */}
      <aside className="lg:col-span-1">
        <div className="lg:sticky lg:top-20 rounded-xl border border-border/60 bg-card p-5 space-y-5">
          <header className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            <h3 className="font-semibold">Settings</h3>
          </header>

          {settings.length === 0 && (
            <p className="text-sm text-muted-foreground">No additional settings needed. Upload files and click process.</p>
          )}

          {settings.map((s) => (
            <div key={s.key}>
              {s.type === 'number' && (
                <div>
                  <Label htmlFor={s.key}>{s.label}</Label>
                  <Input
                    id={s.key}
                    type="number"
                    min={s.min}
                    max={s.max}
                    step={s.step || 1}
                    value={settingsState[s.key] ?? s.default}
                    onChange={(e) => updateSetting(s.key, Number(e.target.value))}
                    className="mt-1"
                  />
                  {s.hint && <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>}
                </div>
              )}

              {s.type === 'text' && (
                <div>
                  <Label htmlFor={s.key}>{s.label}</Label>
                  <Input
                    id={s.key}
                    type="text"
                    value={settingsState[s.key] ?? s.default}
                    onChange={(e) => updateSetting(s.key, e.target.value)}
                    className="mt-1"
                  />
                  {s.hint && <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>}
                </div>
              )}

              {s.type === 'textarea' && (
                <div>
                  <Label htmlFor={s.key}>{s.label}</Label>
                  <textarea
                    id={s.key}
                    rows={4}
                    value={settingsState[s.key] ?? s.default}
                    onChange={(e) => updateSetting(s.key, e.target.value)}
                    className="mt-1 flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  />
                  {s.hint && <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>}
                </div>
              )}

              {s.type === 'slider' && (
                <div>
                  <div className="flex items-center justify-between">
                    <Label>{s.label}</Label>
                    <span className="text-sm font-medium">{settingsState[s.key] ?? s.default}</span>
                  </div>
                  <Slider
                    value={[settingsState[s.key] ?? s.default]}
                    min={s.min ?? 0}
                    max={s.max ?? 100}
                    step={s.step ?? 1}
                    onValueChange={(v) => updateSetting(s.key, v[0])}
                    className="mt-2"
                  />
                  {s.hint && <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>}
                </div>
              )}


              {s.type === 'select' && (
                <div>
                  <Label>{s.label}</Label>
                  <Select value={settingsState[s.key] ?? s.default} onValueChange={(v) => updateSetting(s.key, v)}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(s.options || []).map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {s.hint && <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>}
                </div>
              )}

              {s.type === 'switch' && (
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{s.label}</Label>
                    {s.hint && <p className="text-xs text-muted-foreground">{s.hint}</p>}
                  </div>
                  <Switch
                    checked={settingsState[s.key] ?? s.default}
                    onCheckedChange={(v) => updateSetting(s.key, v)}
                  />
                </div>
              )}

              {s.type === 'color' && (
                <div>
                  <Label>{s.label}</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="color"
                      value={settingsState[s.key] ?? s.default}
                      onChange={(e) => updateSetting(s.key, e.target.value)}
                      className="h-10 w-12 rounded-lg border border-border bg-transparent cursor-pointer"
                    />
                    <span className="font-mono text-sm">{settingsState[s.key] ?? s.default}</span>
                  </div>
                  {s.hint && <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>}
                </div>
              )}
            </div>
          ))}

          {settings.length > 0 && (
            <Button onClick={resetSettings} variant="ghost" className="w-full">
              <RotateCcw className="h-4 w-4" /> Reset defaults
            </Button>
          )}
        </div>
      </aside>
    </div>
  );
}
