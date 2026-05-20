'use client';

import * as React from 'react';
import { UploadCloud, FileWarning } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
  accept?: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label?: string;
  hint?: string;
  className?: string;
  /** Max file size in bytes per file. Defaults to 100MB. */
  maxSize?: number;
}

export function FileDropzone({
  accept,
  multiple = true,
  onFiles,
  label = 'Drop files here or click to upload',
  hint = 'Your files stay on your device — nothing is uploaded.',
  className,
  maxSize = 100 * 1024 * 1024,
}: FileDropzoneProps) {
  const [drag, setDrag] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function validate(files: File[]): File[] {
    setError(null);
    const ok: File[] = [];
    for (const f of files) {
      if (f.size > maxSize) {
        setError(`"${f.name}" is too large. Max ${(maxSize / 1024 / 1024).toFixed(0)}MB per file.`);
        continue;
      }
      ok.push(f);
    }
    return ok;
  }

  function handleFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    const files = validate(Array.from(list));
    if (files.length) onFiles(files);
  }

  return (
    <div className={cn('w-full', className)}>
      <label
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'group relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all',
          drag
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-border/70 bg-muted/20 hover:border-primary/60 hover:bg-primary/5'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-md group-hover:scale-105 transition-transform">
          <UploadCloud className="h-7 w-7" />
        </div>
        <p className="mt-4 text-base md:text-lg font-semibold text-balance text-center px-4">{label}</p>
        <p className="mt-1 text-xs md:text-sm text-muted-foreground text-balance text-center px-4">{hint}</p>
      </label>
      {error && (
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-destructive">
          <FileWarning className="h-4 w-4" /> {error}
        </p>
      )}
    </div>
  );
}
