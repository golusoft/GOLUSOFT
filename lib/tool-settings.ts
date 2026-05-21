/**
 * Per-tool UI configuration for the UniversalToolClient.
 * Maps tool slugs to their accept types, settings fields, and labels.
 */
import type { ToolSetting } from '@/components/universal-tool-client';

export interface ToolUIConfig {
  accept: string;
  multiple: boolean;
  settings: ToolSetting[];
  processLabel?: string;
  uploadLabel?: string;
  uploadHint?: string;
  maxSize?: number;
}

const IMG_ACCEPT = 'image/jpeg,image/png,image/webp,image/bmp,image/gif,image/avif,image/svg+xml';
const PDF_ACCEPT = 'application/pdf';
const ALL_ACCEPT = `${IMG_ACCEPT},${PDF_ACCEPT}`;


export const TOOL_UI_CONFIG: Record<string, ToolUIConfig> = {
  // ═══ IMAGE EDITING ═══
  'image-crop': {
    accept: IMG_ACCEPT, multiple: false,
    settings: [
      { key: 'x', label: 'X offset (px)', type: 'number', default: 0, min: 0 },
      { key: 'y', label: 'Y offset (px)', type: 'number', default: 0, min: 0 },
      { key: 'width', label: 'Width (px)', type: 'number', default: 500, min: 1 },
      { key: 'height', label: 'Height (px)', type: 'number', default: 500, min: 1 },
    ],
    processLabel: 'Crop',
  },
  'rotate-flip': {
    accept: IMG_ACCEPT, multiple: true,
    settings: [
      { key: 'angle', label: 'Rotation angle', type: 'select', default: '90', options: [
        { value: '90', label: '90° clockwise' }, { value: '180', label: '180°' },
        { value: '270', label: '270° clockwise' }, { value: '-90', label: '90° counter-clockwise' },
      ]},
      { key: 'flip', label: 'Flip instead?', type: 'select', default: '', options: [
        { value: '', label: 'No flip (rotate only)' },
        { value: 'horizontal', label: 'Flip horizontal' },
        { value: 'vertical', label: 'Flip vertical' },
      ]},
    ],
    processLabel: 'Rotate / Flip',
  },
  'watermark-image': {
    accept: IMG_ACCEPT, multiple: true,
    settings: [
      { key: 'text', label: 'Watermark text', type: 'text', default: 'GOLUSOFT' },
      { key: 'position', label: 'Position', type: 'select', default: 'center', options: [
        { value: 'center', label: 'Center' }, { value: 'tile', label: 'Tile (repeat)' },
        { value: 'bottom-right', label: 'Bottom-right' }, { value: 'top-left', label: 'Top-left' },
      ]},
      { key: 'opacity', label: 'Opacity', type: 'slider', default: 50, min: 10, max: 100 },
      { key: 'fontSize', label: 'Font size', type: 'number', default: 40, min: 10, max: 200 },
      { key: 'color', label: 'Color', type: 'color', default: '#ffffff' },
      { key: 'rotation', label: 'Rotation (degrees)', type: 'number', default: 0, min: -180, max: 180 },
    ],
    processLabel: 'Apply watermark',
  },
  'blur-sharpen': {
    accept: IMG_ACCEPT, multiple: true,
    settings: [
      { key: 'mode', label: 'Mode', type: 'select', default: 'blur', options: [
        { value: 'blur', label: 'Blur' }, { value: 'sharpen', label: 'Sharpen' },
      ]},
      { key: 'radius', label: 'Blur radius (px)', type: 'slider', default: 5, min: 1, max: 30, hint: 'For blur mode' },
      { key: 'amount', label: 'Sharpen amount', type: 'slider', default: 1, min: 1, max: 5, step: 0.5, hint: 'For sharpen mode' },
    ],
    processLabel: 'Apply',
  },
  'merge-images': {
    accept: IMG_ACCEPT, multiple: true,
    settings: [
      { key: 'direction', label: 'Direction', type: 'select', default: 'horizontal', options: [
        { value: 'horizontal', label: 'Horizontal (side by side)' },
        { value: 'vertical', label: 'Vertical (stacked)' },
      ]},
      { key: 'gap', label: 'Gap between images (px)', type: 'number', default: 0, min: 0, max: 100 },
      { key: 'bgColor', label: 'Background color', type: 'color', default: '#ffffff' },
    ],
    processLabel: 'Merge',
    uploadLabel: 'Drop images to merge (2 or more)',
  },
  'split-image': {
    accept: IMG_ACCEPT, multiple: false,
    settings: [
      { key: 'rows', label: 'Rows', type: 'number', default: 2, min: 1, max: 10 },
      { key: 'cols', label: 'Columns', type: 'number', default: 2, min: 1, max: 10 },
    ],
    processLabel: 'Split',
  },
  'collage-maker': {
    accept: IMG_ACCEPT, multiple: true,
    settings: [
      { key: 'cols', label: 'Columns', type: 'number', default: 3, min: 1, max: 6 },
      { key: 'tileSize', label: 'Tile size (px)', type: 'number', default: 300, min: 100, max: 1000 },
      { key: 'gap', label: 'Gap (px)', type: 'number', default: 4, min: 0, max: 20 },
      { key: 'bgColor', label: 'Background', type: 'color', default: '#ffffff' },
    ],
    processLabel: 'Create collage',
    uploadLabel: 'Drop images for the collage',
  },


  'background-color-changer': {
    accept: IMG_ACCEPT, multiple: true,
    settings: [
      { key: 'color', label: 'New background color', type: 'color', default: '#ffffff' },
      { key: 'tolerance', label: 'Tolerance', type: 'slider', default: 30, min: 5, max: 80, hint: 'Higher = more pixels replaced' },
    ],
    processLabel: 'Change background',
  },
  'image-border': {
    accept: IMG_ACCEPT, multiple: true,
    settings: [
      { key: 'width', label: 'Border width (px)', type: 'slider', default: 20, min: 1, max: 100 },
      { key: 'color', label: 'Border color', type: 'color', default: '#000000' },
    ],
    processLabel: 'Add border',
  },
  'rounded-corners': {
    accept: IMG_ACCEPT, multiple: true,
    settings: [
      { key: 'radius', label: 'Corner radius (px)', type: 'slider', default: 30, min: 1, max: 200 },
    ],
    processLabel: 'Round corners',
  },
  'image-grayscale': { accept: IMG_ACCEPT, multiple: true, settings: [], processLabel: 'Convert to grayscale' },
  'black-white-converter': {
    accept: IMG_ACCEPT, multiple: true,
    settings: [
      { key: 'threshold', label: 'Threshold', type: 'slider', default: 128, min: 0, max: 255, hint: 'Pixels above = white, below = black' },
    ],
    processLabel: 'Convert to B&W',
  },
  'sepia-filter': {
    accept: IMG_ACCEPT, multiple: true,
    settings: [
      { key: 'amount', label: 'Sepia intensity (%)', type: 'slider', default: 100, min: 10, max: 100 },
    ],
    processLabel: 'Apply sepia',
  },
  'image-brightness': {
    accept: IMG_ACCEPT, multiple: true,
    settings: [
      { key: 'amount', label: 'Brightness (%)', type: 'slider', default: 120, min: 0, max: 300, hint: '100 = original' },
    ],
    processLabel: 'Adjust brightness',
  },
  'image-contrast': {
    accept: IMG_ACCEPT, multiple: true,
    settings: [
      { key: 'amount', label: 'Contrast (%)', type: 'slider', default: 130, min: 0, max: 300, hint: '100 = original' },
    ],
    processLabel: 'Adjust contrast',
  },
  'image-saturation': {
    accept: IMG_ACCEPT, multiple: true,
    settings: [
      { key: 'amount', label: 'Saturation (%)', type: 'slider', default: 150, min: 0, max: 300, hint: '100 = original, 0 = grayscale' },
    ],
    processLabel: 'Adjust saturation',
  },
  'image-opacity': {
    accept: IMG_ACCEPT, multiple: true,
    settings: [
      { key: 'amount', label: 'Opacity (%)', type: 'slider', default: 50, min: 1, max: 100 },
    ],
    processLabel: 'Set opacity',
  },
  'image-overlay': {
    accept: IMG_ACCEPT, multiple: true,
    settings: [
      { key: 'x', label: 'Overlay X position', type: 'number', default: 0, min: 0 },
      { key: 'y', label: 'Overlay Y position', type: 'number', default: 0, min: 0 },
      { key: 'opacity', label: 'Overlay opacity (%)', type: 'slider', default: 80, min: 10, max: 100 },
    ],
    processLabel: 'Overlay',
    uploadLabel: 'Upload base image first, then overlay image',
    uploadHint: 'First file = base, second file = overlay on top.',
  },
  'image-text-editor': {
    accept: IMG_ACCEPT, multiple: true,
    settings: [
      { key: 'text', label: 'Text to add', type: 'text', default: 'Hello World' },
      { key: 'x', label: 'X position', type: 'number', default: 50, min: 0 },
      { key: 'y', label: 'Y position', type: 'number', default: 50, min: 0 },
      { key: 'fontSize', label: 'Font size', type: 'number', default: 48, min: 8, max: 200 },
      { key: 'fontFamily', label: 'Font', type: 'select', default: 'Arial', options: [
        { value: 'Arial', label: 'Arial' }, { value: 'Impact', label: 'Impact' },
        { value: 'Georgia', label: 'Georgia' }, { value: 'Courier New', label: 'Courier New' },
        { value: 'Times New Roman', label: 'Times New Roman' },
      ]},
      { key: 'color', label: 'Text color', type: 'color', default: '#ffffff' },
      { key: 'bold', label: 'Bold', type: 'switch', default: true },
    ],
    processLabel: 'Add text',
  },


  'gif-maker': {
    accept: IMG_ACCEPT, multiple: true,
    settings: [
      { key: 'width', label: 'Frame width', type: 'number', default: 400, min: 50, max: 1920 },
      { key: 'height', label: 'Frame height', type: 'number', default: 400, min: 50, max: 1080 },
      { key: 'delay', label: 'Frame delay (ms)', type: 'number', default: 200, min: 50, max: 2000 },
    ],
    processLabel: 'Create animation',
    uploadLabel: 'Drop image frames in order',
  },
  'gif-compressor': { accept: 'image/gif,image/webp,' + IMG_ACCEPT, multiple: true,
    settings: [{ key: 'quality', label: 'Quality (%)', type: 'slider', default: 60, min: 10, max: 100 }],
    processLabel: 'Compress GIF',
  },
  'meme-generator': {
    accept: IMG_ACCEPT, multiple: false,
    settings: [
      { key: 'topText', label: 'Top text', type: 'text', default: '' },
      { key: 'bottomText', label: 'Bottom text', type: 'text', default: '' },
    ],
    processLabel: 'Generate meme',
  },
  'photo-frame': {
    accept: IMG_ACCEPT, multiple: true,
    settings: [
      { key: 'width', label: 'Frame width (px)', type: 'slider', default: 40, min: 5, max: 100 },
      { key: 'color', label: 'Frame color', type: 'color', default: '#8B4513' },
    ],
    processLabel: 'Add frame',
  },
  'canvas-editor': {
    accept: IMG_ACCEPT, multiple: false,
    settings: [
      { key: 'brightness', label: 'Brightness (%)', type: 'slider', default: 100, min: 0, max: 300 },
      { key: 'contrast', label: 'Contrast (%)', type: 'slider', default: 100, min: 0, max: 300 },
      { key: 'saturation', label: 'Saturation (%)', type: 'slider', default: 100, min: 0, max: 300 },
    ],
    processLabel: 'Apply edits',
  },

  // ═══ IMAGE UTILITIES ═══
  'image-dpi-converter': {
    accept: IMG_ACCEPT, multiple: true,
    settings: [
      { key: 'currentDpi', label: 'Current DPI', type: 'number', default: 72, min: 1 },
      { key: 'targetDpi', label: 'Target DPI', type: 'number', default: 300, min: 1 },
    ],
    processLabel: 'Convert DPI',
  },
  'image-metadata-viewer': { accept: IMG_ACCEPT, multiple: true, settings: [], processLabel: 'Extract metadata' },
  'color-picker': {
    accept: IMG_ACCEPT, multiple: false,
    settings: [
      { key: 'x', label: 'X pixel', type: 'number', default: 100, min: 0 },
      { key: 'y', label: 'Y pixel', type: 'number', default: 100, min: 0 },
    ],
    processLabel: 'Pick color', uploadHint: 'Upload an image then specify coordinates.',
  },
  'orientation-fixer': { accept: IMG_ACCEPT, multiple: true, settings: [], processLabel: 'Fix orientation' },
  'image-resolution-changer': {
    accept: IMG_ACCEPT, multiple: true,
    settings: [
      { key: 'currentDpi', label: 'Current DPI', type: 'number', default: 72 },
      { key: 'targetDpi', label: 'Target DPI', type: 'number', default: 150 },
    ],
    processLabel: 'Change resolution',
  },
  'cm-to-pixel': {
    accept: '', multiple: false,
    settings: [
      { key: 'cm', label: 'Centimeters', type: 'number', default: 10, min: 0.1, step: 0.1 },
      { key: 'dpi', label: 'DPI', type: 'number', default: 300, min: 1 },
    ],
    processLabel: 'Convert', uploadLabel: 'No file needed', uploadHint: 'Just enter values and click Convert.',
  },
  'pixel-to-cm': {
    accept: '', multiple: false,
    settings: [
      { key: 'px', label: 'Pixels', type: 'number', default: 300, min: 1 },
      { key: 'dpi', label: 'DPI', type: 'number', default: 300, min: 1 },
    ],
    processLabel: 'Convert', uploadLabel: 'No file needed', uploadHint: 'Just enter values and click Convert.',
  },
  'image-ratio': {
    accept: IMG_ACCEPT, multiple: true,
    settings: [
      { key: 'ratio', label: 'Aspect ratio', type: 'select', default: '1:1', options: [
        { value: '1:1', label: '1:1 (Square)' }, { value: '4:3', label: '4:3' },
        { value: '16:9', label: '16:9 (Widescreen)' }, { value: '9:16', label: '9:16 (Portrait)' },
        { value: '3:2', label: '3:2' }, { value: '2:3', label: '2:3' },
      ]},
    ],
    processLabel: 'Crop to ratio',
  },
  'duplicate-finder': { accept: IMG_ACCEPT, multiple: true, settings: [], processLabel: 'Find duplicates',
    uploadLabel: 'Drop multiple images to compare', uploadHint: 'We compare file size and dimensions to detect duplicates.' },
  'image-rename': {
    accept: IMG_ACCEPT, multiple: true,
    settings: [
      { key: 'pattern', label: 'Name pattern', type: 'text', default: 'image-{n}', hint: 'Use {n} for number, {name} for original name' },
    ],
    processLabel: 'Rename & download',
  },
  'image-zip-export': { accept: IMG_ACCEPT, multiple: true, settings: [], processLabel: 'Export as ZIP' },
  'batch-watermark': {
    accept: IMG_ACCEPT, multiple: true,
    settings: [
      { key: 'text', label: 'Watermark text', type: 'text', default: 'WATERMARK' },
      { key: 'opacity', label: 'Opacity (%)', type: 'slider', default: 40, min: 10, max: 100 },
      { key: 'position', label: 'Position', type: 'select', default: 'tile', options: [
        { value: 'tile', label: 'Tile (repeat)' }, { value: 'center', label: 'Center' },
        { value: 'bottom-right', label: 'Bottom right' },
      ]},
    ],
    processLabel: 'Watermark all',
  },
  'batch-rename': {
    accept: `${IMG_ACCEPT},${PDF_ACCEPT}`, multiple: true,
    settings: [
      { key: 'prefix', label: 'Prefix', type: 'text', default: '' },
      { key: 'suffix', label: 'Suffix', type: 'text', default: '-edited' },
    ],
    processLabel: 'Rename all',
  },


  // ═══ IMAGE RESIZE VARIANTS ═══
  'passport-photo-maker': {
    accept: IMG_ACCEPT, multiple: true,
    settings: [
      { key: 'width', label: 'Width (px)', type: 'number', default: 413, hint: '35mm @ 300dpi = 413px' },
      { key: 'height', label: 'Height (px)', type: 'number', default: 531, hint: '45mm @ 300dpi = 531px' },
    ],
    processLabel: 'Create passport photo',
  },
  'signature-resizer': {
    accept: IMG_ACCEPT, multiple: true,
    settings: [
      { key: 'width', label: 'Width (px)', type: 'number', default: 300, min: 50 },
      { key: 'height', label: 'Height (px)', type: 'number', default: 80, min: 20 },
    ],
    processLabel: 'Resize signature',
  },
  'bulk-image-compressor': {
    accept: IMG_ACCEPT, multiple: true,
    settings: [
      { key: 'quality', label: 'Quality', type: 'slider', default: 75, min: 10, max: 100 },
      { key: 'targetKB', label: 'Target size (KB, 0 = auto)', type: 'number', default: 0, min: 0 },
      { key: 'maxDimension', label: 'Max dimension (px, 0 = keep)', type: 'number', default: 0, min: 0 },
    ],
    processLabel: 'Compress all',
  },
  'bulk-image-resizer': {
    accept: IMG_ACCEPT, multiple: true,
    settings: [
      { key: 'width', label: 'Width (px)', type: 'number', default: 800, min: 1 },
      { key: 'height', label: 'Height (px)', type: 'number', default: 600, min: 1 },
    ],
    processLabel: 'Resize all',
  },
  'bulk-image-converter': {
    accept: IMG_ACCEPT, multiple: true,
    settings: [
      { key: 'format', label: 'Output format', type: 'select', default: 'webp', options: [
        { value: 'webp', label: 'WebP' }, { value: 'jpg', label: 'JPEG' },
        { value: 'png', label: 'PNG' }, { value: 'bmp', label: 'BMP' },
      ]},
      { key: 'quality', label: 'Quality (%)', type: 'slider', default: 90, min: 10, max: 100 },
    ],
    processLabel: 'Convert all',
  },
  'thumbnail-creator': {
    accept: IMG_ACCEPT, multiple: true,
    settings: [
      { key: 'width', label: 'Thumb width', type: 'number', default: 320, min: 32 },
      { key: 'height', label: 'Thumb height', type: 'number', default: 180, min: 32 },
    ],
    processLabel: 'Create thumbnails',
  },
  'screenshot-to-pdf': {
    accept: IMG_ACCEPT, multiple: true,
    settings: [],
    processLabel: 'Build PDF', uploadLabel: 'Drop screenshots to combine into PDF',
  },

  // ═══ PDF TOOLS ═══
  'pdf-resizer': {
    accept: PDF_ACCEPT, multiple: true,
    settings: [
      { key: 'size', label: 'Page size', type: 'select', default: 'A4', options: [
        { value: 'A4', label: 'A4' }, { value: 'Letter', label: 'Letter' },
        { value: 'Legal', label: 'Legal' }, { value: 'A3', label: 'A3' }, { value: 'A5', label: 'A5' },
      ]},
      { key: 'orientation', label: 'Orientation', type: 'select', default: 'portrait', options: [
        { value: 'portrait', label: 'Portrait' }, { value: 'landscape', label: 'Landscape' },
      ]},
    ],
    processLabel: 'Resize pages',
  },
  'rotate-pdf': {
    accept: PDF_ACCEPT, multiple: true,
    settings: [
      { key: 'angle', label: 'Rotation', type: 'select', default: '90', options: [
        { value: '90', label: '90° clockwise' }, { value: '180', label: '180°' }, { value: '270', label: '270° clockwise' },
      ]},
    ],
    processLabel: 'Rotate',
  },
  'delete-pdf-pages': {
    accept: PDF_ACCEPT, multiple: false,
    settings: [
      { key: 'pages', label: 'Pages to delete (comma-separated)', type: 'text', default: '1', hint: 'e.g. 1,3,5' },
    ],
    processLabel: 'Delete pages',
  },
  'extract-pdf-pages': {
    accept: PDF_ACCEPT, multiple: false,
    settings: [
      { key: 'pages', label: 'Pages to extract (comma-separated)', type: 'text', default: '1,2,3', hint: 'e.g. 1,2,5' },
    ],
    processLabel: 'Extract',
  },
  'organize-pdf': {
    accept: PDF_ACCEPT, multiple: false,
    settings: [
      { key: 'order', label: 'New page order (comma-separated)', type: 'text', default: '', hint: 'e.g. 3,1,2,4 — leave empty to keep original' },
    ],
    processLabel: 'Reorganize',
  },


  'watermark-pdf': {
    accept: PDF_ACCEPT, multiple: true,
    settings: [
      { key: 'text', label: 'Watermark text', type: 'text', default: 'CONFIDENTIAL' },
      { key: 'opacity', label: 'Opacity (%)', type: 'slider', default: 30, min: 5, max: 80 },
      { key: 'fontSize', label: 'Font size', type: 'number', default: 50, min: 10, max: 150 },
      { key: 'rotation', label: 'Rotation (deg)', type: 'number', default: 45, min: 0, max: 90 },
    ],
    processLabel: 'Add watermark',
  },
  'pdf-page-numbering': {
    accept: PDF_ACCEPT, multiple: true,
    settings: [
      { key: 'position', label: 'Position', type: 'select', default: 'bottom-center', options: [
        { value: 'bottom-center', label: 'Bottom center' }, { value: 'bottom-right', label: 'Bottom right' },
        { value: 'bottom-left', label: 'Bottom left' }, { value: 'top-center', label: 'Top center' },
        { value: 'top-right', label: 'Top right' },
      ]},
      { key: 'format', label: 'Format', type: 'select', default: 'Page X', options: [
        { value: 'Page X', label: 'Page 1' }, { value: 'X / Y', label: '1 / 10' }, { value: 'X', label: '1' },
      ]},
      { key: 'startFrom', label: 'Start from', type: 'number', default: 1, min: 0 },
    ],
    processLabel: 'Add numbers',
  },
  'pdf-metadata-editor': {
    accept: PDF_ACCEPT, multiple: false,
    settings: [
      { key: 'title', label: 'Title', type: 'text', default: '' },
      { key: 'author', label: 'Author', type: 'text', default: '' },
      { key: 'subject', label: 'Subject', type: 'text', default: '' },
      { key: 'keywords', label: 'Keywords', type: 'text', default: '' },
      { key: 'creator', label: 'Creator', type: 'text', default: '' },
    ],
    processLabel: 'Save metadata',
  },
  'pdf-crop': {
    accept: PDF_ACCEPT, multiple: true,
    settings: [
      { key: 'margin', label: 'Margin to remove (px at 2x scale)', type: 'slider', default: 50, min: 10, max: 200 },
    ],
    processLabel: 'Crop PDF',
  },
  'pdf-thumbnail': {
    accept: PDF_ACCEPT, multiple: true,
    settings: [
      { key: 'dpi', label: 'Resolution (DPI)', type: 'slider', default: 72, min: 36, max: 300 },
    ],
    processLabel: 'Generate thumbnails',
  },
  'pdf-bw-converter': {
    accept: PDF_ACCEPT, multiple: true,
    settings: [
      { key: 'dpi', label: 'DPI', type: 'slider', default: 150, min: 72, max: 300 },
    ],
    processLabel: 'Convert to B&W',
  },
  'pdf-flatten': {
    accept: PDF_ACCEPT, multiple: true,
    settings: [
      { key: 'dpi', label: 'DPI', type: 'slider', default: 150, min: 72, max: 300, hint: 'Higher = better quality, larger file' },
    ],
    processLabel: 'Flatten',
  },
  'pdf-compare': {
    accept: PDF_ACCEPT, multiple: true,
    settings: [],
    processLabel: 'Compare', uploadLabel: 'Drop two PDFs to compare',
    uploadHint: 'First pages will be rendered side-by-side.',
  },
  'pdf-zip-export': { accept: PDF_ACCEPT, multiple: true, settings: [], processLabel: 'Export as ZIP' },
  'unlock-pdf': { accept: PDF_ACCEPT, multiple: true, settings: [], processLabel: 'Unlock' },
  'protect-pdf': {
    accept: PDF_ACCEPT, multiple: true,
    settings: [
      { key: 'password', label: 'Password', type: 'text', default: '', hint: 'Set a password for the PDF' },
    ],
    processLabel: 'Protect',
  },
  'batch-merge-pdf': { accept: PDF_ACCEPT, multiple: true, settings: [], processLabel: 'Merge all',
    uploadLabel: 'Drop multiple PDFs to merge into one' },
  'batch-compress-pdf': {
    accept: PDF_ACCEPT, multiple: true,
    settings: [
      { key: 'quality', label: 'JPEG quality', type: 'slider', default: 0.7, min: 0.3, max: 0.95, step: 0.05 },
      { key: 'scale', label: 'Scale factor', type: 'slider', default: 1.2, min: 0.5, max: 2, step: 0.1 },
    ],
    processLabel: 'Compress all',
  },
  'pdf-page-extractor': {
    accept: PDF_ACCEPT, multiple: false,
    settings: [
      { key: 'pages', label: 'Pages to extract', type: 'text', default: '1,2', hint: 'Comma-separated page numbers' },
    ],
    processLabel: 'Extract',
  },


  'split-pdf-by-range': {
    accept: PDF_ACCEPT, multiple: false,
    settings: [
      { key: 'ranges', label: 'Ranges', type: 'text', default: '1-3,4-6', hint: 'Each range becomes a separate PDF' },
    ],
    processLabel: 'Split by range',
  },
  'split-pdf-by-size': {
    accept: PDF_ACCEPT, multiple: false,
    settings: [
      { key: 'pagesPerChunk', label: 'Pages per file', type: 'number', default: 5, min: 1 },
    ],
    processLabel: 'Split',
  },
  'split-pdf-by-pages': { accept: PDF_ACCEPT, multiple: true, settings: [], processLabel: 'Split each page',
    uploadHint: 'Each page becomes its own PDF file.' },
  'pdf-rearrange': {
    accept: PDF_ACCEPT, multiple: false,
    settings: [
      { key: 'order', label: 'New order (comma-separated page numbers)', type: 'text', default: '', hint: 'e.g. 3,1,2,5,4' },
    ],
    processLabel: 'Rearrange',
  },
  'pdf-orientation': {
    accept: PDF_ACCEPT, multiple: true,
    settings: [
      { key: 'orientation', label: 'Set orientation', type: 'select', default: 'landscape', options: [
        { value: 'landscape', label: 'Landscape (90°)' }, { value: 'portrait', label: 'Portrait (0°)' },
      ]},
    ],
    processLabel: 'Set orientation',
  },
  'pdf-signature': {
    accept: PDF_ACCEPT, multiple: false,
    settings: [
      { key: 'signatureDataUrl', label: 'Signature (paste a data URL or draw)', type: 'text', default: '', hint: 'Draw a signature and paste its data URL here' },
      { key: 'pageIndex', label: 'Page number (0-indexed)', type: 'number', default: 0, min: 0 },
      { key: 'x', label: 'X position', type: 'number', default: 100 },
      { key: 'y', label: 'Y position', type: 'number', default: 100 },
      { key: 'width', label: 'Signature width', type: 'number', default: 200 },
      { key: 'height', label: 'Signature height', type: 'number', default: 80 },
    ],
    processLabel: 'Add signature',
  },
  'fill-pdf-form': { accept: PDF_ACCEPT, multiple: true, settings: [
    { key: 'dpi', label: 'Output quality (DPI)', type: 'slider', default: 150, min: 72, max: 300 },
  ], processLabel: 'Flatten form' },

  // ═══ PDF CONVERSION ═══
  'pdf-to-png': {
    accept: PDF_ACCEPT, multiple: true,
    settings: [
      { key: 'dpi', label: 'DPI', type: 'slider', default: 150, min: 72, max: 300 },
    ],
    processLabel: 'Convert to PNG',
  },
  'png-to-pdf': { accept: IMG_ACCEPT, multiple: true, settings: [], processLabel: 'Build PDF' },
  'scan-to-pdf': { accept: IMG_ACCEPT, multiple: true, settings: [], processLabel: 'Create scanned PDF',
    uploadLabel: 'Drop scanned images / photos of documents' },
  'html-to-pdf': {
    accept: '', multiple: false,
    settings: [
      { key: 'html', label: 'HTML content', type: 'textarea', default: '<h1>Hello</h1><p>Paste your HTML here...</p>' },
    ],
    processLabel: 'Generate PDF', uploadLabel: 'No file needed',
    uploadHint: 'Enter HTML in the settings panel and click Generate PDF.',
  },
  'tiff-to-pdf': { accept: 'image/tiff,.tif,.tiff,' + IMG_ACCEPT, multiple: true, settings: [], processLabel: 'Convert to PDF' },
  'pdf-to-text': { accept: PDF_ACCEPT, multiple: true, settings: [], processLabel: 'Extract text' },
  'pdf-to-svg': { accept: PDF_ACCEPT, multiple: true, settings: [], processLabel: 'Convert to SVG' },
  'svg-to-pdf': { accept: 'image/svg+xml,.svg', multiple: true, settings: [], processLabel: 'Convert to PDF' },

  // ═══ PDF UTILITY ═══
  'pdf-size-reducer': { accept: PDF_ACCEPT, multiple: true, settings: [], processLabel: 'Reduce size' },
  'mobile-pdf-compressor': { accept: PDF_ACCEPT, multiple: true, settings: [], processLabel: 'Optimize for mobile' },
  'bulk-pdf-processor': { accept: PDF_ACCEPT, multiple: true, settings: [], processLabel: 'Process all' },
  'secure-pdf-sharing': {
    accept: PDF_ACCEPT, multiple: true,
    settings: [
      { key: 'password', label: 'Share password', type: 'text', default: 'share123' },
    ],
    processLabel: 'Secure & download',
  },
  'pdf-preview': {
    accept: PDF_ACCEPT, multiple: true,
    settings: [
      { key: 'pageIndex', label: 'Page to preview (0-indexed)', type: 'number', default: 0, min: 0 },
      { key: 'dpi', label: 'DPI', type: 'slider', default: 150, min: 72, max: 300 },
    ],
    processLabel: 'Generate preview',
  },
  'pdf-repair': { accept: PDF_ACCEPT, multiple: true, settings: [], processLabel: 'Repair PDF' },
  'pdf-print-optimizer': { accept: PDF_ACCEPT, multiple: true, settings: [], processLabel: 'Optimize for print' },
  'pdf-quality-optimizer': { accept: PDF_ACCEPT, multiple: true, settings: [], processLabel: 'Optimize quality' },
  'pdf-zip-downloader': { accept: PDF_ACCEPT, multiple: true, settings: [], processLabel: 'Bundle as ZIP' },
  'pdf-text-extractor': { accept: PDF_ACCEPT, multiple: true, settings: [], processLabel: 'Extract text' },
  'pdf-image-extractor': {
    accept: PDF_ACCEPT, multiple: true,
    settings: [
      { key: 'dpi', label: 'Extraction DPI', type: 'slider', default: 150, min: 72, max: 300 },
      { key: 'format', label: 'Image format', type: 'select', default: 'jpg', options: [
        { value: 'jpg', label: 'JPG' }, { value: 'png', label: 'PNG' },
      ]},
    ],
    processLabel: 'Extract images',
  },

  // ═══ GENERATORS ═══
  'barcode-generator': {
    accept: '', multiple: false,
    settings: [
      { key: 'text', label: 'Barcode data', type: 'text', default: '123456789012' },
    ],
    processLabel: 'Generate barcode', uploadLabel: 'No file needed',
    uploadHint: 'Enter data in settings and click Generate.',
  },
};

/** Get config for a tool or return a sensible default */
export function getToolUIConfig(slug: string): ToolUIConfig {
  return TOOL_UI_CONFIG[slug] || {
    accept: IMG_ACCEPT + ',' + PDF_ACCEPT,
    multiple: true,
    settings: [],
    processLabel: 'Process',
  };
}
