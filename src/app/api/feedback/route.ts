import { NextResponse } from 'next/server';
import { forwardFeedback, type FeedbackPayload } from '@/lib/feedback';

export async function POST(request: Request) {
  let payload: FeedbackPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!payload || typeof payload.path !== 'string' || typeof payload.locale !== 'string' || typeof payload.title !== 'string' || !['helpful', 'not_helpful'].includes(payload.vote)) {
    return NextResponse.json({ error: 'Invalid feedback payload' }, { status: 400 });
  }

  try {
    await forwardFeedback(payload);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to forward feedback', error);
    return NextResponse.json({ error: 'Feedback service unavailable' }, { status: 502 });
  }
}
