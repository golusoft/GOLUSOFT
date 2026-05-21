/**
 * Tool engine registry — maps each tool slug to a processing function.
 * This enables the UniversalToolClient to process files for ANY tool.
 * Each engine receives files + settings and returns processed output blobs.
 */

export interface ProcessResult {
  name: string;
  blob: Blob;
  meta?: Record<string, string>;
}

export type ToolEngine = (
  files: File[],
  settings: Record<string, any>
) => Promise<ProcessResult[]>;

const engines: Record<string, () => Promise<ToolEngine>> = {};

/** Register a lazily-loaded engine */
export function registerEngine(slug: string, loader: () => Promise<ToolEngine>) {
  engines[slug] = loader;
}

/** Get engine for a tool slug */
export async function getEngine(slug: string): Promise<ToolEngine | null> {
  const loader = engines[slug];
  if (!loader) return null;
  return loader();
}

export function hasEngine(slug: string): boolean {
  return slug in engines;
}
