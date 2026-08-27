export interface FeedbackPayload {
  path: string;
  locale: string;
  title: string;
  vote: 'helpful' | 'not_helpful';
  comment?: string;
}

export async function forwardFeedback(payload: FeedbackPayload) {
  const endpoint = process.env.FEEDBACK_API_URL;
  if (!endpoint) throw new Error('FEEDBACK_API_URL is not configured');

  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (process.env.FEEDBACK_API_TOKEN) headers.Authorization = `Bearer ${process.env.FEEDBACK_API_TOKEN}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Feedback API returned ${response.status}`);
}
