'use client';

import * as React from 'react';
import QRCode from 'qrcode';
import { toast } from 'sonner';
import { Download, RotateCcw, Loader2, Link as LinkIcon, Wifi, Mail, MessageSquare, FileText, Phone } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { downloadBlob } from '@/lib/utils';
import { canvasToBlob } from '@/lib/image';

type Type = 'text' | 'url' | 'wifi' | 'email' | 'sms' | 'phone';
type ECC = 'L' | 'M' | 'Q' | 'H';

const TYPE_META: Record<Type, { label: string; icon: any; placeholder: string }> = {
  text: { label: 'Text', icon: FileText, placeholder: 'Enter any text…' },
  url: { label: 'URL', icon: LinkIcon, placeholder: 'https://example.com' },
  wifi: { label: 'Wi-Fi', icon: Wifi, placeholder: '' },
  email: { label: 'Email', icon: Mail, placeholder: '' },
  sms: { label: 'SMS', icon: MessageSquare, placeholder: '' },
  phone: { label: 'Phone', icon: Phone, placeholder: '+1 555 123 4567' },
};

function buildPayload(type: Type, fields: Record<string, string>): string {
  switch (type) {
    case 'text':
    case 'url':
      return fields.value || '';
    case 'wifi': {
      const ssid = (fields.ssid || '').replace(/([\\;,:"])/g, '\\$1');
      const pwd = (fields.password || '').replace(/([\\;,:"])/g, '\\$1');
      const auth = fields.auth || 'WPA';
      const hidden = fields.hidden === '1' ? 'true' : 'false';
      return `WIFI:T:${auth};S:${ssid};P:${pwd};H:${hidden};;`;
    }
    case 'email':
      return `mailto:${fields.email || ''}?subject=${encodeURIComponent(fields.subject || '')}&body=${encodeURIComponent(fields.body || '')}`;
    case 'sms':
      return `SMSTO:${fields.phone || ''}:${fields.message || ''}`;
    case 'phone':
      return `tel:${fields.phone || ''}`;
  }
}

export function QrCodeClient() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [type, setType] = React.useState<Type>('url');
  const [fields, setFields] = React.useState<Record<string, string>>({ value: 'https://golusoft.com' });
  const [size, setSize] = React.useState(512);
  const [margin, setMargin] = React.useState(2);
  const [ecc, setEcc] = React.useState<ECC>('M');
  const [fg, setFg] = React.useState('#000000');
  const [bg, setBg] = React.useState('#ffffff');
  const [generating, setGenerating] = React.useState(false);

  const payload = buildPayload(type, fields);

  // Live preview
  React.useEffect(() => {
    if (!payload || !canvasRef.current) return;
    let active = true;
    setGenerating(true);
    QRCode.toCanvas(canvasRef.current, payload, {
      width: size,
      margin,
      errorCorrectionLevel: ecc,
      color: { dark: fg, light: bg },
    })
      .catch(() => active && toast.error('QR is too dense for this content. Try shorter text or higher error correction.'))
      .finally(() => active && setGenerating(false));
    return () => { active = false; };
  }, [payload, size, margin, ecc, fg, bg]);

  async function downloadPng() {
    if (!canvasRef.current) return;
    const blob = await canvasToBlob(canvasRef.current, 'image/png');
    downloadBlob(blob, 'golusoft-qrcode.png');
  }
  async function downloadJpg() {
    if (!canvasRef.current) return;
    const blob = await canvasToBlob(canvasRef.current, 'image/jpeg', 0.95);
    downloadBlob(blob, 'golusoft-qrcode.jpg');
  }
  async function downloadSvg() {
    try {
      const svg = await QRCode.toString(payload, {
        type: 'svg',
        margin,
        errorCorrectionLevel: ecc,
        color: { dark: fg, light: bg },
      });
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      downloadBlob(blob, 'golusoft-qrcode.svg');
    } catch {
      toast.error('Failed to export SVG');
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1 lg:order-2">
        <div className="lg:sticky lg:top-20 rounded-xl border border-border/60 bg-card p-5 flex flex-col items-center gap-3">
          <div className="relative">
            <canvas ref={canvasRef} className="rounded-lg border border-border/60 bg-white" />
            {generating && (
              <span className="absolute inset-0 flex items-center justify-center bg-background/40 rounded-lg">
                <Loader2 className="h-6 w-6 animate-spin" />
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground text-center break-all max-w-full">{payload || 'Enter content to generate'}</p>
          <div className="grid grid-cols-3 gap-2 w-full">
            <Button onClick={downloadPng} size="sm"><Download className="h-4 w-4" /> PNG</Button>
            <Button onClick={downloadJpg} variant="outline" size="sm"><Download className="h-4 w-4" /> JPG</Button>
            <Button onClick={downloadSvg} variant="outline" size="sm"><Download className="h-4 w-4" /> SVG</Button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 lg:order-1 space-y-5">
        <Tabs value={type} onValueChange={(v) => { setType(v as Type); setFields({}); }}>
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto">
            {(Object.keys(TYPE_META) as Type[]).map((t) => {
              const M = TYPE_META[t];
              return (
                <TabsTrigger key={t} value={t} className="flex-col gap-1 py-2 text-xs">
                  <M.icon className="h-4 w-4" /> {M.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="text" className="space-y-2 pt-3">
            <Label>Text</Label>
            <Input value={fields.value || ''} onChange={(e) => setFields({ value: e.target.value })} placeholder="Enter any text…" />
          </TabsContent>

          <TabsContent value="url" className="space-y-2 pt-3">
            <Label>URL</Label>
            <Input type="url" value={fields.value || ''} onChange={(e) => setFields({ value: e.target.value })} placeholder="https://example.com" />
          </TabsContent>

          <TabsContent value="wifi" className="space-y-3 pt-3">
            <div>
              <Label>Network name (SSID)</Label>
              <Input value={fields.ssid || ''} onChange={(e) => setFields({ ...fields, ssid: e.target.value })} />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="text" value={fields.password || ''} onChange={(e) => setFields({ ...fields, password: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Encryption</Label>
                <Select value={fields.auth || 'WPA'} onValueChange={(v) => setFields({ ...fields, auth: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WPA">WPA / WPA2</SelectItem>
                    <SelectItem value="WEP">WEP</SelectItem>
                    <SelectItem value="nopass">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Hidden network</Label>
                <Select value={fields.hidden || '0'} onValueChange={(v) => setFields({ ...fields, hidden: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No</SelectItem>
                    <SelectItem value="1">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="email" className="space-y-3 pt-3">
            <div><Label>To</Label><Input type="email" value={fields.email || ''} onChange={(e) => setFields({ ...fields, email: e.target.value })} /></div>
            <div><Label>Subject</Label><Input value={fields.subject || ''} onChange={(e) => setFields({ ...fields, subject: e.target.value })} /></div>
            <div><Label>Body</Label><Input value={fields.body || ''} onChange={(e) => setFields({ ...fields, body: e.target.value })} /></div>
          </TabsContent>

          <TabsContent value="sms" className="space-y-3 pt-3">
            <div><Label>Phone</Label><Input type="tel" value={fields.phone || ''} onChange={(e) => setFields({ ...fields, phone: e.target.value })} /></div>
            <div><Label>Message</Label><Input value={fields.message || ''} onChange={(e) => setFields({ ...fields, message: e.target.value })} /></div>
          </TabsContent>

          <TabsContent value="phone" className="space-y-2 pt-3">
            <Label>Phone</Label>
            <Input type="tel" value={fields.phone || ''} onChange={(e) => setFields({ phone: e.target.value })} placeholder="+1 555 123 4567" />
          </TabsContent>
        </Tabs>

        <div className="rounded-xl border border-border/60 bg-card p-5 space-y-4">
          <h3 className="font-semibold">Style &amp; quality</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Foreground</Label>
              <div className="mt-1 flex items-center gap-2">
                <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-10 w-12 rounded-lg border border-border bg-transparent cursor-pointer" />
                <span className="font-mono text-sm">{fg}</span>
              </div>
            </div>
            <div>
              <Label>Background</Label>
              <div className="mt-1 flex items-center gap-2">
                <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-10 w-12 rounded-lg border border-border bg-transparent cursor-pointer" />
                <span className="font-mono text-sm">{bg}</span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between"><Label>Size (px)</Label><span className="text-sm font-medium">{size}</span></div>
            <Slider value={[size]} min={128} max={2048} step={16} onValueChange={(v) => setSize(v[0])} className="mt-2" />
          </div>
          <div>
            <div className="flex items-center justify-between"><Label>Margin</Label><span className="text-sm font-medium">{margin}</span></div>
            <Slider value={[margin]} min={0} max={8} step={1} onValueChange={(v) => setMargin(v[0])} className="mt-2" />
          </div>
          <div>
            <Label>Error correction</Label>
            <Select value={ecc} onValueChange={(v) => setEcc(v as ECC)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="L">Low — ~7% recovery</SelectItem>
                <SelectItem value="M">Medium — ~15% recovery (default)</SelectItem>
                <SelectItem value="Q">Quartile — ~25% recovery</SelectItem>
                <SelectItem value="H">High — ~30% recovery</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => { setSize(512); setMargin(2); setEcc('M'); setFg('#000000'); setBg('#ffffff'); }} variant="ghost" className="w-full">
            <RotateCcw className="h-4 w-4" /> Reset style
          </Button>
        </div>
      </div>
    </div>
  );
}
