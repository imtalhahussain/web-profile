import { NextRequest, NextResponse } from 'next/server';

// ── Config ────────────────────────────────────────────────────────────────────
export const runtime = 'edge'; // Use Edge runtime for lowest latency streaming

const RAG_BACKEND_URL = process.env.RAG_BACKEND_URL; // e.g. https://your-app.onrender.com
const RAG_API_KEY = process.env.RAG_API_KEY;         // shared secret for backend auth

// ── POST /api/rag/query ───────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. Validate env
  if (!RAG_BACKEND_URL) {
    return NextResponse.json(
      { error: 'RAG_BACKEND_URL is not configured. Set it in your Vercel environment variables.' },
      { status: 503 }
    );
  }

  // 2. Parse body
  let body: { query?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.query?.trim()) {
    return NextResponse.json({ error: 'query field is required' }, { status: 400 });
  }

  // 3. Build headers for upstream call
  const upstreamHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (RAG_API_KEY) {
    upstreamHeaders['X-API-KEY'] = RAG_API_KEY;
  }

  // 4. Forward to Python backend
  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(`${RAG_BACKEND_URL}/query`, {
      method: 'POST',
      headers: upstreamHeaders,
      body: JSON.stringify({ query: body.query }),
      // No signal timeout needed — Edge runtime handles this
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Fetch failed';
    return NextResponse.json(
      {
        error: `RAG backend unreachable. It may be sleeping (cold start). Try again in 30s. Detail: ${msg}`,
        code: 'BACKEND_OFFLINE',
      },
      { status: 503 }
    );
  }

  // 5. Surface upstream errors with useful messages
  if (!upstreamRes.ok) {
    let detail = '';
    try { detail = await upstreamRes.text(); } catch { /* ignore */ }

    const statusMap: Record<number, string> = {
      401: 'Invalid X-API-KEY — check RAG_API_KEY env var.',
      403: 'Access forbidden by backend.',
      429: 'Backend rate-limited. Slow down requests.',
      500: 'Backend inference error.',
      503: 'Backend is starting up (cold start). Retry in ~30s.',
    };

    return NextResponse.json(
      { error: statusMap[upstreamRes.status] || `Backend error ${upstreamRes.status}`, detail },
      { status: upstreamRes.status >= 500 ? upstreamRes.status : 502 }
    );
  }

  // 6. Detect streaming vs JSON response and pipe accordingly
  const contentType = upstreamRes.headers.get('content-type') ?? '';

  if (contentType.includes('text/plain') || contentType.includes('text/event-stream')) {
    // ── Streaming: pipe ReadableStream directly to client ──
    const { readable, writable } = new TransformStream();
    upstreamRes.body!.pipeTo(writable);
    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-cache',
        'Transfer-Encoding': 'chunked',
      },
    });
  }

  // ── JSON: parse, validate schema, return ──
  let data: {
    answer: string;
    sources: Array<{ text: string; page: number; score: number }>;
    metrics: { latency: number; tokens_per_sec?: number };
  };

  try {
    data = await upstreamRes.json();
  } catch {
    return NextResponse.json({ error: 'Backend returned malformed JSON' }, { status: 502 });
  }

  // Light schema validation
  if (!data.answer || !Array.isArray(data.sources)) {
    return NextResponse.json(
      { error: 'Backend response missing required fields (answer, sources)' },
      { status: 502 }
    );
  }

  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'no-store' },
  });
}

// ── GET — health check ────────────────────────────────────────────────────────
export async function GET() {
  const configured = Boolean(RAG_BACKEND_URL);
  return NextResponse.json({
    status: configured ? 'ready' : 'misconfigured',
    backend: configured ? RAG_BACKEND_URL : 'RAG_BACKEND_URL not set',
    timestamp: new Date().toISOString(),
  });
}
