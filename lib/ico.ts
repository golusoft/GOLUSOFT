/**
 * Minimal PNG-in-ICO encoder.
 *
 * Produces a valid .ico file containing one or more PNG-encoded images.
 * Modern Windows (Vista+), macOS, and all modern browsers accept PNG inside ICO.
 * https://en.wikipedia.org/wiki/ICO_(file_format)
 */

export interface IcoEntry {
  width: number;   // 1..256
  height: number;  // 1..256
  pngBytes: Uint8Array;
}

export function encodeIco(entries: IcoEntry[]): Blob {
  if (entries.length === 0) throw new Error('encodeIco: no entries');
  const ICONDIR_SIZE = 6;
  const ICONDIRENTRY_SIZE = 16;

  let totalBytes = ICONDIR_SIZE + entries.length * ICONDIRENTRY_SIZE;
  for (const e of entries) totalBytes += e.pngBytes.byteLength;

  const buf = new ArrayBuffer(totalBytes);
  const view = new DataView(buf);
  const u8 = new Uint8Array(buf);

  // ICONDIR
  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // type 1 = ICO
  view.setUint16(4, entries.length, true);

  // ICONDIRENTRY[]
  let offset = ICONDIR_SIZE + entries.length * ICONDIRENTRY_SIZE;
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    const headerOff = ICONDIR_SIZE + i * ICONDIRENTRY_SIZE;
    view.setUint8(headerOff + 0, e.width === 256 ? 0 : e.width);
    view.setUint8(headerOff + 1, e.height === 256 ? 0 : e.height);
    view.setUint8(headerOff + 2, 0); // color count (0 = no palette)
    view.setUint8(headerOff + 3, 0); // reserved
    view.setUint16(headerOff + 4, 1, true); // color planes
    view.setUint16(headerOff + 6, 32, true); // bpp
    view.setUint32(headerOff + 8, e.pngBytes.byteLength, true);
    view.setUint32(headerOff + 12, offset, true);

    u8.set(e.pngBytes, offset);
    offset += e.pngBytes.byteLength;
  }

  return new Blob([buf], { type: 'image/x-icon' });
}

export async function blobToUint8(blob: Blob): Promise<Uint8Array> {
  return new Uint8Array(await blob.arrayBuffer());
}
