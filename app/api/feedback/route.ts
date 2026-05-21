import { NextResponse } from 'next/server';

/**
 * Feedback ingestion endpoint.
 * Currently stores nothing — wire up your preferred destination
 * (email, Slack webhook, database) here. Returns 202 so the client
 * can show success without exposing whether storage actually succeeded.
 */

export const runtime = 'edge';

interface FeedbackPayload {
  type: string;
  email?: string;
  message: string;
  source?: string;
  ts?: string;
}

const MAX_LEN = 5000;

export async function POST(req: Request) {
  let body: FeedbackPayload;
  try {
    body = (await req.json()) as FeedbackPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body || typeof body.message !== 'string' || body.message.trim().length === 0) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }
  if (body.message.length > MAX_LEN) {
    return NextResponse.json({ error: 'Message too long' }, { status: 413 });
  }

  // TODO: Forward to email/Slack/DB.
  // For now we just acknowledge.
  console.log('[feedback]', {
    type: body.type,
    email: body.email,
    message: body.message.slice(0, 200),
    ts: body.ts,
  });

  return NextResponse.json({ ok: true }, { status: 202 });
}

export async function GET() {
  return NextResponse.json({ status: 'feedback endpoint ok' });
}
