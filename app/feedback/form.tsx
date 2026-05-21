'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Send, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function FeedbackForm() {
  const [type, setType] = React.useState('feature');
  const [submitting, setSubmitting] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      type,
      email: String(fd.get('email') || ''),
      message: String(fd.get('message') || ''),
      source: 'feedback-form',
      ts: new Date().toISOString(),
    };
    // No backend wired up yet — fall back to mailto with prefilled body
    try {
      // If a custom endpoint is configured, POST to it
      const url = '/api/feedback';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => null);
      if (res && res.ok) {
        toast.success('Thanks for the feedback!');
        (e.target as HTMLFormElement).reset();
        return;
      }
    } catch {}

    // Fallback: open mail client
    const body = `Type: ${payload.type}\n\n${payload.message}\n\n— sent from golusoft.com/feedback`;
    window.location.href = `mailto:hello@golusoft.com?subject=GOLUSOFT%20Feedback&body=${encodeURIComponent(body)}`;
    toast.info('Opening your mail app…');
    setSubmitting(false);
  }

  return (
    <form className="space-y-4 rounded-xl border border-border/60 bg-card p-5" onSubmit={onSubmit}>
      <div>
        <Label>What kind of feedback?</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="feature">Feature request</SelectItem>
            <SelectItem value="bug">Bug report</SelectItem>
            <SelectItem value="praise">Praise / love letter</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="email">Your email (optional)</Label>
        <Input id="email" name="email" type="email" placeholder="you@example.com" className="mt-1" />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Tell us what is on your mind…"
          className="mt-1 flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>
      <Button type="submit" disabled={submitting} variant="gradient">
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send feedback
      </Button>
    </form>
  );
}
