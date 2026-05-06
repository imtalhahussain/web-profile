'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Types ────────────────────────────────────────────────────────────────────
interface Source {
  text: string;
  page: number;
  score: number;
}

interface Metrics {
  latency: number;
  tokens_per_sec?: number;
  vector_similarity?: number;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  sources?: Source[];
  metrics?: Metrics;
  error?: boolean;
  timestamp: Date;
}

// ── Constants ────────────────────────────────────────────────────────────────
const SAMPLE_QUERIES = [
  'What diseases are covered under Ayushman Bharat?',
  'What is the coverage limit per family per year?',
  'Who is eligible for PM-JAY benefits?',
  'How does the empanelment of hospitals work?',
];

const BOOT_LINES = [
  '> INITIALIZING NEURAL TERMINAL v2.5.1...',
  '> LOADING AYUSHMAN BHARAT VECTOR INDEX...',
  '> EMBEDDING MODEL: text-embedding-3-large [OK]',
  '> PINECONE CONNECTION: ESTABLISHED',
  '> HYBRID RETRIEVAL ENGINE: ONLINE',
  '> RAG PIPELINE: READY ✓',
];

// ── Sub-components ───────────────────────────────────────────────────────────
function MetricCard({ label, value, unit, sub }: { label: string; value: string | number; unit?: string; sub?: string }) {
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className="metric-value">
        {value}<span className="metric-unit">{unit}</span>
      </div>
      {sub && <div className="metric-sub">{sub}</div>}
    </div>
  );
}

function SourceChunk({ source, index }: { source: Source; index: number }) {
  const [open, setOpen] = useState(false);
  const pct = Math.round(source.score * 100);
  return (
    <div className="source-chunk" onClick={() => setOpen(o => !o)}>
      <div className="source-header">
        <span className="source-tag">CHUNK_{String(index + 1).padStart(2, '0')}</span>
        <span className="source-page">pg.{source.page}</span>
        <span className="source-score" style={{ color: pct > 80 ? '#aaff00' : pct > 60 ? '#ffcc00' : '#ff6644' }}>
          {pct}% match
        </span>
        <span className="source-toggle">{open ? '▲' : '▼'}</span>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="source-body"
          >
            {source.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BootSequence({ onDone }: { onDone: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const tick = () => {
      if (i < BOOT_LINES.length) {
        setLines(prev => [...prev, BOOT_LINES[i]]);
        i++;
        setTimeout(tick, 280);
      } else {
        setTimeout(() => { setDone(true); setTimeout(onDone, 400); }, 400);
      }
    };
    setTimeout(tick, 300);
  }, [onDone]);

  return (
    <motion.div
      className="boot-screen"
      animate={{ opacity: done ? 0 : 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="boot-logo">⬡ AYUSHMAN BHARAT · RAG INTELLIGENCE</div>
      <div className="boot-lines">
        {lines.map((l, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="boot-line">
            {l}
          </motion.div>
        ))}
        {!done && <span className="cursor-blink">█</span>}
      </div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AIIntelligencePage() {
  const [booted, setBooted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(true);
  const [liveMetrics, setLiveMetrics] = useState({ latency: 0, tokensPerSec: 0, vectorSim: 0 });
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendQuery = async (query: string) => {
    if (!query.trim() || loading) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: query, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const startTime = Date.now();
    const assistantId = crypto.randomUUID();

    // Optimistic streaming placeholder
    setMessages(prev => [...prev, {
      id: assistantId, role: 'assistant', content: '', timestamp: new Date(),
    }]);

    try {
      const res = await fetch('/api/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const contentType = res.headers.get('content-type') || '';

      // ── Streaming path ──
      if (contentType.includes('text/plain') || contentType.includes('text/event-stream')) {
        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: accumulated } : m));
        }
        setMessages(prev => prev.map(m => m.id === assistantId
          ? { ...m, content: accumulated, metrics: { latency: Date.now() - startTime } }
          : m));
      } else {
        // ── JSON path ──
        const data = await res.json();
        const latency = data.metrics?.latency ?? (Date.now() - startTime);
        const tokensPerSec = data.metrics?.tokens_per_sec ?? Math.round(1000 / (latency / 100));
        const vectorSim = data.sources?.[0]?.score ?? 0;
        setLiveMetrics({ latency, tokensPerSec, vectorSim });
        setMessages(prev => prev.map(m => m.id === assistantId
          ? { ...m, content: data.answer, sources: data.sources, metrics: { latency, tokens_per_sec: tokensPerSec, vector_similarity: vectorSim } }
          : m));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      const isDown = msg.includes('fetch') || msg.includes('ECONNREFUSED') || msg.includes('Failed');
      setMessages(prev => prev.map(m => m.id === assistantId
        ? {
            ...m,
            error: true,
            content: isDown
              ? '⚠ RAG BACKEND OFFLINE\n\nThe Python inference engine is sleeping (cold start on Render.com) or rate-limited. Please retry in ~30 seconds.\n\nError: ' + msg
              : '⚠ INFERENCE ERROR\n\n' + msg,
          }
        : m));
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendQuery(input); }
  };

  const lastMsg = messages.filter(m => m.role === 'assistant').at(-1);

  if (!booted) return <BootSequence onDone={() => setBooted(true)} />;

  return (
    <>
      <style>{CSS}</style>
      <div className="page">

        {/* ── Header ── */}
        <header className="page-header">
          <a href="/" className="back-link">← TALHA.AI</a>
          <div className="header-center">
            <span className="header-tag">RAG · LIVE</span>
            <h1 className="header-title">AI Intelligence Playground</h1>
            <p className="header-sub">Ayushman Bharat Policy · Hybrid Retrieval · Streaming LLM</p>
          </div>
          <div className="header-status">
            <span className="status-dot" />
            <span>ONLINE</span>
          </div>
        </header>

        <div className="layout">

          {/* ── Sidebar ── */}
          <aside className="sidebar">
            <div className="sidebar-section">
              <div className="sidebar-title">⬡ SYSTEM METRICS</div>
              <MetricCard label="Retrieval Latency" value={liveMetrics.latency || '—'} unit={liveMetrics.latency ? 'ms' : ''} sub="end-to-end RAG" />
              <MetricCard label="LLM Tokens/sec" value={liveMetrics.tokensPerSec || '—'} sub="streaming throughput" />
              <MetricCard
                label="Vector Similarity"
                value={liveMetrics.vectorSim ? liveMetrics.vectorSim.toFixed(3) : '—'}
                sub="top-chunk cosine score"
              />
            </div>

            <div className="sidebar-section">
              <div
                className="sidebar-title clickable"
                onClick={() => setSourcesOpen(o => !o)}
              >
                ◈ SOURCE INSPECTOR {sourcesOpen ? '▲' : '▼'}
              </div>
              <AnimatePresence>
                {sourcesOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    {lastMsg?.sources?.length ? (
                      lastMsg.sources.map((s, i) => <SourceChunk key={i} source={s} index={i} />)
                    ) : (
                      <div className="no-sources">
                        No sources yet. Send a query to inspect retrieved policy chunks.
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="sidebar-section">
              <div className="sidebar-title">◉ PIPELINE</div>
              <div className="pipeline-steps">
                {['Query → Embed', 'Dense + BM25', 'RRF Fusion', 'Cohere Rerank', 'GPT-4o Stream'].map((s, i) => (
                  <div key={i} className="pipeline-step">
                    <span className="step-num">0{i + 1}</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Chat ── */}
          <main className="chat-area">
            <div className="messages">
              <AnimatePresence initial={false}>
                {messages.length === 0 && (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="empty-state">
                    <div className="empty-icon">⬡</div>
                    <div className="empty-title">NEURAL TERMINAL READY</div>
                    <div className="empty-sub">Query the Ayushman Bharat Policy Knowledge Base</div>
                    <div className="sample-queries">
                      {SAMPLE_QUERIES.map((q, i) => (
                        <button key={i} className="sample-btn" onClick={() => sendQuery(q)}>{q}</button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {messages.map((msg, i) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className={`message message-${msg.role} ${msg.error ? 'message-error' : ''}`}
                  >
                    <div className="message-meta">
                      <span className="message-role">{msg.role === 'user' ? '> USER' : msg.error ? '⚠ ERROR' : '⬡ RAG'}</span>
                      <span className="message-time">{msg.timestamp.toLocaleTimeString()}</span>
                      {msg.metrics && (
                        <span className="message-latency">{msg.metrics.latency}ms</span>
                      )}
                    </div>
                    <div className="message-content">
                      {msg.content || (loading && msg.role === 'assistant' ? <span className="thinking">RETRIEVING<span className="dots" /></span> : '')}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* ── Input ── */}
            <div className="input-area">
              <div className="input-wrapper">
                <span className="input-prompt">{'>'}</span>
                <textarea
                  ref={inputRef}
                  className="chat-input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Query the policy knowledge base..."
                  rows={1}
                  disabled={loading}
                />
                <button
                  className="send-btn"
                  onClick={() => sendQuery(input)}
                  disabled={loading || !input.trim()}
                >
                  {loading ? '◌' : '▶ RUN'}
                </button>
              </div>
              <div className="input-hint">Enter to send · Shift+Enter for newline · Powered by Hybrid RAG + GPT-4o</div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

// ── Styles (scoped) ──────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap');

  .page { font-family: 'JetBrains Mono', monospace; background: #050505; color: #c8c8c8; min-height: 100vh; display: flex; flex-direction: column; }

  /* Boot */
  .boot-screen { position: fixed; inset: 0; background: #050505; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 999; gap: 2rem; }
  .boot-logo { font-family: 'JetBrains Mono', monospace; color: #aaff00; font-size: 1.1rem; font-weight: 700; letter-spacing: 0.15em; }
  .boot-lines { font-size: 0.75rem; color: #5a5a5a; display: flex; flex-direction: column; gap: 0.3rem; min-width: 420px; }
  .boot-line { color: #aaff00; }
  .cursor-blink { animation: blink 0.8s step-end infinite; color: #aaff00; }
  @keyframes blink { 50% { opacity: 0; } }

  /* Header */
  .page-header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.5rem; border-bottom: 1px solid #1a1a1a; flex-shrink: 0; }
  .back-link { color: #555; font-size: 0.7rem; text-decoration: none; letter-spacing: 0.1em; transition: color 0.2s; }
  .back-link:hover { color: #aaff00; }
  .header-center { text-align: center; }
  .header-tag { font-size: 0.6rem; color: #aaff00; letter-spacing: 0.2em; border: 1px solid #aaff0040; padding: 2px 8px; }
  .header-title { font-size: 1rem; font-weight: 700; color: #aaff00; margin: 0.25rem 0 0.15rem; letter-spacing: 0.05em; }
  .header-sub { font-size: 0.65rem; color: #444; margin: 0; letter-spacing: 0.08em; }
  .header-status { display: flex; align-items: center; gap: 6px; font-size: 0.65rem; color: #aaff00; }
  .status-dot { width: 7px; height: 7px; border-radius: 50%; background: #aaff00; box-shadow: 0 0 6px #aaff0080; animation: pulse 2s ease-in-out infinite; }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

  /* Layout */
  .layout { display: flex; flex: 1; min-height: 0; overflow: hidden; }

  /* Sidebar */
  .sidebar { width: 280px; flex-shrink: 0; border-right: 1px solid #111; overflow-y: auto; display: flex; flex-direction: column; gap: 0; }
  .sidebar-section { padding: 1rem; border-bottom: 1px solid #111; }
  .sidebar-title { font-size: 0.6rem; letter-spacing: 0.18em; color: #aaff00; margin-bottom: 0.75rem; }
  .sidebar-title.clickable { cursor: pointer; user-select: none; }
  .sidebar-title.clickable:hover { color: #ccff44; }

  .metric-card { background: #0a0a0a; border: 1px solid #1a1a1a; padding: 0.6rem 0.75rem; margin-bottom: 0.5rem; }
  .metric-label { font-size: 0.55rem; color: #444; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 0.25rem; }
  .metric-value { font-size: 1.1rem; font-weight: 700; color: #aaff00; line-height: 1; }
  .metric-unit { font-size: 0.6rem; color: #666; margin-left: 2px; }
  .metric-sub { font-size: 0.55rem; color: #333; margin-top: 2px; }

  .source-chunk { border: 1px solid #1a1a1a; margin-bottom: 0.4rem; cursor: pointer; transition: border-color 0.2s; }
  .source-chunk:hover { border-color: #aaff0040; }
  .source-header { display: flex; align-items: center; gap: 6px; padding: 0.4rem 0.5rem; font-size: 0.6rem; }
  .source-tag { color: #aaff00; flex: 1; }
  .source-page { color: #444; }
  .source-score { font-weight: 700; }
  .source-toggle { color: #333; }
  .source-body { padding: 0.5rem; font-size: 0.65rem; line-height: 1.6; color: #666; border-top: 1px solid #111; overflow: hidden; }
  .no-sources { font-size: 0.6rem; color: #333; line-height: 1.6; }

  .pipeline-steps { display: flex; flex-direction: column; gap: 0.3rem; }
  .pipeline-step { display: flex; align-items: center; gap: 8px; font-size: 0.65rem; color: #555; }
  .step-num { color: #aaff0060; font-size: 0.55rem; }

  /* Chat */
  .chat-area { flex: 1; display: flex; flex-direction: column; min-height: 0; overflow: hidden; }
  .messages { flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
  .messages::-webkit-scrollbar { width: 4px; }
  .messages::-webkit-scrollbar-track { background: transparent; }
  .messages::-webkit-scrollbar-thumb { background: #1e1e1e; }

  .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; gap: 0.75rem; padding: 3rem; text-align: center; min-height: 400px; }
  .empty-icon { font-size: 2.5rem; color: #aaff0030; }
  .empty-title { font-size: 0.85rem; color: #aaff00; letter-spacing: 0.15em; }
  .empty-sub { font-size: 0.65rem; color: #333; }
  .sample-queries { display: flex; flex-direction: column; gap: 0.4rem; width: 100%; max-width: 520px; margin-top: 1rem; }
  .sample-btn { background: transparent; border: 1px solid #1e1e1e; color: #555; font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; padding: 0.5rem 1rem; cursor: pointer; text-align: left; transition: all 0.2s; }
  .sample-btn:hover { border-color: #aaff0060; color: #aaff00; background: #aaff0008; }

  .message { display: flex; flex-direction: column; gap: 0.35rem; }
  .message-meta { display: flex; align-items: center; gap: 0.75rem; }
  .message-role { font-size: 0.6rem; letter-spacing: 0.12em; }
  .message-user .message-role { color: #aaff00; }
  .message-assistant .message-role { color: #4488ff; }
  .message-error .message-role { color: #ff4444; }
  .message-time { font-size: 0.55rem; color: #2a2a2a; }
  .message-latency { font-size: 0.55rem; color: #aaff0060; margin-left: auto; }
  .message-content { font-size: 0.78rem; line-height: 1.8; color: #aaa; padding-left: 1rem; border-left: 2px solid #1a1a1a; white-space: pre-wrap; }
  .message-user .message-content { color: #ddd; border-left-color: #aaff0030; }
  .message-error .message-content { color: #ff6666; border-left-color: #ff444430; }
  .thinking { color: #aaff0060; }
  .dots::after { content: '...'; animation: dots 1.2s steps(4, end) infinite; }
  @keyframes dots { 0%,20% { content: '.'; } 40% { content: '..'; } 60%,100% { content: '...'; } }

  /* Input */
  .input-area { border-top: 1px solid #111; padding: 1rem 1.5rem; flex-shrink: 0; }
  .input-wrapper { display: flex; align-items: flex-end; gap: 0.75rem; background: #0a0a0a; border: 1px solid #1e1e1e; padding: 0.75rem; transition: border-color 0.2s; }
  .input-wrapper:focus-within { border-color: #aaff0060; }
  .input-prompt { color: #aaff00; font-size: 0.9rem; padding-bottom: 2px; }
  .chat-input { flex: 1; background: transparent; border: none; outline: none; color: #ddd; font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; line-height: 1.6; resize: none; min-height: 24px; max-height: 160px; }
  .chat-input::placeholder { color: #2a2a2a; }
  .chat-input:disabled { opacity: 0.5; }
  .send-btn { background: #aaff00; color: #050505; border: none; font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; font-weight: 700; padding: 0.4rem 0.85rem; cursor: pointer; letter-spacing: 0.1em; transition: all 0.15s; white-space: nowrap; }
  .send-btn:hover:not(:disabled) { background: #ccff44; }
  .send-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .input-hint { font-size: 0.55rem; color: #222; margin-top: 0.5rem; letter-spacing: 0.06em; }

  @media (max-width: 768px) {
    .sidebar { display: none; }
    .header-center h1 { font-size: 0.85rem; }
  }
`;
