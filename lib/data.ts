// ── Knowledge base for terminal agent simulation ──────────────────────────────
export const terminalLines = [
  { type: "response", text: "> Searching talha.kb (1,248 chunks)..." },
  { type: "response", text: "> Top-3 contexts retrieved. Reranking." },
  { type: "key-val", key: "name:", val: " Talha Hussain" },
  { type: "key-val", key: "role:", val: " AI Engineer · RAG Specialist" },
  { type: "key-val", key: "exp:", val: " 2+ years LLM/AI systems in production" },
  { type: "key-val", key: "stack:", val: " LangGraph, Pinecone, FastAPI, GPT-4o" },
  { type: "key-val", key: "impact:", val: " 1M+ records indexed, 40% latency ↓" },
  { type: "key-val", key: "status:", val: " OPEN TO OPPORTUNITIES" },
  {
    type: "highlight",
    text: "> Context confidence: 0.97 ✓ Streaming complete.",
  },
] as const;

// ── Impact metrics ─────────────────────────────────────────────────────────────
export const impactMetrics = [
  {
    number: "1M",
    unit: "+",
    desc: "Property records indexed across distributed vector stores",
  },
  {
    number: "40",
    unit: "%",
    desc: "P99 latency reduction via hybrid retrieval pipeline",
  },
  {
    number: "35",
    unit: "%",
    desc: "Human oversight reduction through agentic automation",
  },
  {
    number: "92",
    unit: "%",
    desc: "Answer accuracy on production RAG evaluations",
  },
] as const;

// ── System health metrics ──────────────────────────────────────────────────────
export const healthMetrics = [
  { key: "P99 LATENCY", val: "1.2s", trend: "↓ 40% vs baseline", live: true },
  { key: "TOKENS/REQ", val: "2,841", trend: "avg token usage" },
  { key: "ACCURACY", val: "92%", trend: "LLM-as-judge eval" },
  { key: "VECTORS", val: "1.2M", trend: "indexed embeddings" },
  { key: "UPTIME", val: "99.9%", trend: "30-day rolling avg" },
  { key: "AGENTS", val: "7", trend: "active workflows" },
] as const;

// ── Projects ───────────────────────────────────────────────────────────────────
export interface Telemetry {
  label: string;
  val: string;
  good?: boolean;
}

export interface Project {
  type: string;
  name: string;
  desc: string;
  stack: string[];
  telemetry: Telemetry[];
}

export const projects: Project[] = [
  {
    type: "SYSTEM DIAGRAM · RAG",
    name: "Real Estate Intelligence Platform",
    desc: "Production RAG pipeline indexing 1M+ property records with hybrid vector-BM25 retrieval, adaptive chunking, and sub-second query resolution.",
    stack: ["FastAPI", "LangGraph", "Pinecone", "GPT-4o", "BM25"],
    telemetry: [
      { label: "P99 LATENCY", val: "1.2s" },
      { label: "ACCURACY", val: "92%", good: true },
      { label: "RECORDS", val: "1M+", good: true },
      { label: "UPTIME", val: "99.9%", good: true },
    ],
  },
  {
    type: "SYSTEM DIAGRAM · AGENTIC",
    name: "Multi-Agent Travel Itinerary Engine",
    desc: "LangGraph-powered multi-agent system with cycle management, tool orchestration, and memory persistence for personalized travel planning.",
    stack: ["LangGraph", "React Flow", "Redis", "FastAPI", "Milvus"],
    telemetry: [
      { label: "P99 LATENCY", val: "2.1s" },
      { label: "TASK COMPL.", val: "88%", good: true },
      { label: "AGENTS", val: "7", good: true },
      { label: "OVERSIGHT ↓", val: "35%", good: true },
    ],
  },
  {
    type: "SYSTEM DIAGRAM · GUARDRAILS",
    name: "Secure Enterprise Chatbot w/ NeMo Guardrails",
    desc: "PII-aware enterprise assistant with NeMo Guardrails, real-time content filtering, and audit logging for regulated industries.",
    stack: ["NeMo", "LangChain", "Weaviate", "Azure OpenAI", "Presidio"],
    telemetry: [
      { label: "P99 LATENCY", val: "0.8s" },
      { label: "PII BLOCK RATE", val: "100%", good: true },
      { label: "FALSE POS.", val: "0.3%", good: true },
      { label: "COMPLIANCE", val: "SOC2", good: true },
    ],
  },
];

// ── RAG pipeline steps ─────────────────────────────────────────────────────────
export interface RagStep {
  num: string;
  name: string;
  desc: string;
  badge?: string;
}

export const ragSteps: RagStep[] = [
  {
    num: "01 ─ INGRESS",
    name: "Query Intake",
    desc: "Raw user query received. Language detection & preprocessing. Query classification determines retrieval strategy.",
  },
  {
    num: "02 ─ ENCODE",
    name: "Dual Encoding",
    desc: "Parallel embedding generation via text-embedding-3-large for dense vectors. BM25 sparse encoding for keyword matching.",
    badge: "HYBRID",
  },
  {
    num: "03 ─ RETRIEVE",
    name: "Vector + BM25 Search",
    desc: "Top-K retrieval from Pinecone (ANN) merged with BM25 sparse results. Reciprocal Rank Fusion blends score lists.",
    badge: "RRF FUSION",
  },
  {
    num: "04 ─ RERANK",
    name: "Cross-Encoder Rerank",
    desc: "Cohere rerank-v3 cross-encoder scores each candidate against query in full attention. Top-5 selected for context window.",
    badge: "COHERE",
  },
  {
    num: "05 ─ GENERATE",
    name: "LLM Generation",
    desc: "GPT-4o receives structured context with citations. Response streamed with source attribution and confidence scoring.",
  },
];

// ── Tech stack ─────────────────────────────────────────────────────────────────
export interface SkillItem {
  name: string;
  level: number; // 0–100
}

export interface StackGroup {
  label: string;
  skills: SkillItem[];
}

export const techStack: StackGroup[] = [
  {
    label: "// inference & orchestration",
    skills: [
      { name: "LangChain", level: 95 },
      { name: "LangGraph", level: 92 },
      { name: "LlamaIndex", level: 88 },
      { name: "OpenAI API", level: 98 },
      { name: "Anthropic API", level: 85 },
      { name: "NeMo Guardrails", level: 80 },
      { name: "Cohere Rerank", level: 87 },
    ],
  },
  {
    label: "// storage · vector & document",
    skills: [
      { name: "Pinecone", level: 94 },
      { name: "Milvus", level: 88 },
      { name: "Weaviate", level: 82 },
      { name: "PostgreSQL/pgvector", level: 90 },
      { name: "Redis", level: 85 },
      { name: "MongoDB Atlas", level: 78 },
      { name: "ElasticSearch", level: 83 },
    ],
  },
  {
    label: "// compute · cloud & serving",
    skills: [
      { name: "AWS (SageMaker/ECS)", level: 88 },
      { name: "Azure OpenAI", level: 85 },
      { name: "FastAPI", level: 96 },
      { name: "Docker / K8s", level: 80 },
      { name: "Python 3.11+", level: 98 },
      { name: "vLLM / TGI", level: 75 },
      { name: "Terraform", level: 72 },
    ],
  },
];