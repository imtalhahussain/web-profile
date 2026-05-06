"""
Ayushman Bharat Policy Intelligence — FastAPI RAG Backend
"""

import os, time, logging
from typing import Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel, Field

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ── Safe env loading (never crashes at import time) ───────────────────────────
OPENAI_API_KEY      = os.environ.get("OPENAI_API_KEY", "")
PINECONE_API_KEY    = os.environ.get("PINECONE_API_KEY", "")
PINECONE_INDEX_NAME = os.environ.get("PINECONE_INDEX_NAME", "ayushman-bharat")
COHERE_API_KEY      = os.environ.get("COHERE_API_KEY", "")
RAG_API_KEY         = os.environ.get("RAG_API_KEY", "")
TOP_K               = 5

ALLOWED_ORIGINS = [
    o.strip()
    for o in os.environ.get("ALLOWED_ORIGINS", "*").split(",")
    if o.strip()
]

# ── RAG state ─────────────────────────────────────────────────────────────────
vectorstore = None
rag_chain   = None
init_error: Optional[str] = None

SYSTEM_PROMPT = """You are an expert assistant for the Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY) health policy.
Answer questions accurately based ONLY on the retrieved policy document chunks below.
If the answer is not in the context, say so clearly — do not hallucinate.
Always cite which page number(s) your answer draws from.

Context:
{context}
"""

def format_docs(docs):
    return "\n\n".join(d.page_content for d in docs)

@asynccontextmanager
async def lifespan(app: FastAPI):
    global vectorstore, rag_chain, init_error

    # Validate required vars before trying to connect
    missing = [k for k in ["OPENAI_API_KEY", "PINECONE_API_KEY"] if not os.environ.get(k)]
    if missing:
        init_error = f"Missing environment variables: {', '.join(missing)}. Set them in Render → Environment tab."
        logger.error(init_error)
        yield
        return

    try:
        from langchain_openai import OpenAIEmbeddings, ChatOpenAI
        from langchain_pinecone import PineconeVectorStore
        from langchain.prompts import ChatPromptTemplate
        from langchain_core.output_parsers import StrOutputParser
        from langchain_core.runnables import RunnablePassthrough

        logger.info("Connecting to Pinecone...")
        embeddings = OpenAIEmbeddings(model="text-embedding-3-large", api_key=OPENAI_API_KEY)
        vectorstore = PineconeVectorStore(
            index_name=PINECONE_INDEX_NAME,
            embedding=embeddings,
            pinecone_api_key=PINECONE_API_KEY,
        )

        retriever = vectorstore.as_retriever(search_kwargs={"k": TOP_K})
        llm = ChatOpenAI(model="gpt-4o", streaming=True, api_key=OPENAI_API_KEY)
        prompt = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT),
            ("human", "{question}"),
        ])
        rag_chain = (
            {"context": retriever | format_docs, "question": RunnablePassthrough()}
            | prompt
            | llm
            | StrOutputParser()
        )
        logger.info("RAG pipeline ready ✓")

    except Exception as e:
        init_error = f"Startup error: {e}"
        logger.error(init_error)

    yield
    logger.info("Shutting down.")

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(title="Ayushman Bharat RAG API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "X-API-KEY"],
)

# ── Auth ──────────────────────────────────────────────────────────────────────
def verify_api_key(request: Request):
    if not RAG_API_KEY:
        return  # Auth disabled (dev mode)
    key = request.headers.get("X-API-KEY", "")
    if key != RAG_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing X-API-KEY")

# ── Schemas ───────────────────────────────────────────────────────────────────
class QueryRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=1000)

class SourceChunk(BaseModel):
    text: str
    page: int
    score: float

class MetricsOut(BaseModel):
    latency: int
    tokens_per_sec: float

class QueryResponse(BaseModel):
    answer: str
    sources: list[SourceChunk]
    metrics: MetricsOut

# ── Endpoints ─────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {
        "status": "ok" if rag_chain else "error",
        "pipeline": "ready" if rag_chain else "failed",
        "error": init_error,
        "config": {
            "openai_key_set": bool(OPENAI_API_KEY),
            "pinecone_key_set": bool(PINECONE_API_KEY),
            "index": PINECONE_INDEX_NAME,
            "auth_enabled": bool(RAG_API_KEY),
            "allowed_origins": ALLOWED_ORIGINS,
        }
    }

@app.post("/query", response_model=QueryResponse, dependencies=[Depends(verify_api_key)])
async def query_rag(req: QueryRequest):
    if init_error:
        raise HTTPException(503, f"RAG pipeline failed to initialize: {init_error}")
    if rag_chain is None:
        raise HTTPException(503, "RAG pipeline still initializing. Retry in ~10s.")

    t0 = time.time()

    docs_with_scores = await vectorstore.asimilarity_search_with_score(req.query, k=TOP_K)
    sources = [
        SourceChunk(
            text=doc.page_content[:500],
            page=int(doc.metadata.get("page", 0)),
            score=float(score),
        )
        for doc, score in docs_with_scores
    ]

    answer = ""
    token_count = 0
    async for chunk in rag_chain.astream(req.query):
        answer += chunk
        token_count += 1

    latency_ms = int((time.time() - t0) * 1000)
    tokens_per_sec = round(token_count / max((time.time() - t0), 0.001), 1)

    return QueryResponse(
        answer=answer,
        sources=sources,
        metrics=MetricsOut(latency=latency_ms, tokens_per_sec=tokens_per_sec),
    )

@app.post("/query/stream", dependencies=[Depends(verify_api_key)])
async def query_rag_stream(req: QueryRequest):
    if rag_chain is None:
        raise HTTPException(503, "RAG pipeline not ready.")

    async def token_generator():
        async for chunk in rag_chain.astream(req.query):
            yield chunk

    return StreamingResponse(token_generator(), media_type="text/plain")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("fastapi_backend:app", host="0.0.0.0", port=8000, reload=True)