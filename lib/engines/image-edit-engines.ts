/**
 * Image editing tool engines.
 * Each export is a ToolEngine function.
 */
import type { ProcessResult } from '../tool-engines';

export async function cropEngine(files: File[], s: Record<string, any>): Promise<ProcessResult[]> {
  const { cropImage } = await import('../image-effects');
  const results: ProcessResult[] = [];
  for (const f of files) {
    const blob = await cropImage(f, { x: s.x || 0, y: s.y || 0, width: s.width || 100, height: s.height || 100 });
    results.push({ name: f.name.replace(/\.[^.]+$/, '-cropped.png'), blob });
  }
  return results;
}
