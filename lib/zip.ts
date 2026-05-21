'use client';

import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export async function downloadAsZip(
  items: { name: string; blob: Blob }[],
  zipName: string
): Promise<void> {
  if (items.length === 0) return;
  const zip = new JSZip();
  const seen = new Map<string, number>();
  for (const item of items) {
    let name = item.name;
    if (seen.has(name)) {
      const n = (seen.get(name) || 0) + 1;
      seen.set(name, n);
      const dot = name.lastIndexOf('.');
      name = dot > 0 ? `${name.slice(0, dot)}-${n}${name.slice(dot)}` : `${name}-${n}`;
    } else {
      seen.set(name, 1);
    }
    zip.file(name, item.blob);
  }
  const content = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
  saveAs(content, zipName);
}
