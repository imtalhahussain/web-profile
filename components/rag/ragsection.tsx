"use client";
import { ragSteps } from "@/lib/data";
import SectionHeader from "@/components/shared/sectionheader";

export default function RagSection() {
  return (
    <section
      id="rag"
      style={{
        padding: "80px 60px",
        background: "var(--obsidian-2)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <SectionHeader num="02" title="RAG Pipeline ·" accent="Hybrid Retrieval" />

      <p
        style={{
          fontSize: 13,
          color: "var(--text-secondary)",
          maxWidth: 600,
          lineHeight: 1.7,
          marginBottom: 0,
        }}
      >
        Step-by-step anatomy of a production Hybrid Search pipeline combining
        dense vector similarity with sparse BM25 keyword matching, fused via
        Reciprocal Rank Fusion and reranked with Cohere.
      </p>

      {/* Pipeline flow */}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          marginTop: 48,
        }}
      >
        {ragSteps.map((step, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              padding: "24px 20px",
              border: "1px solid var(--border)",
              borderRight: i < ragSteps.length - 1 ? "none" : "1px solid var(--border)",
              position: "relative",
              background: "var(--obsidian)",
              transition: "border-color 0.3s, background 0.3s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "var(--obsidian-3)";
              el.style.borderColor = "rgba(0,245,255,0.3)";
              el.style.zIndex = "2";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "var(--obsidian)";
              el.style.borderColor = "var(--border)";
              el.style.zIndex = "1";
            }}
          >
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                color: "var(--text-muted)",
                marginBottom: 8,
              }}
            >
              {step.num}
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 8,
                color: "var(--electric-cyan)",
              }}
            >
              {step.name}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-secondary)",
                lineHeight: 1.5,
              }}
            >
              {step.desc}
            </div>
            {step.badge && (
              <div
                style={{
                  display: "inline-block",
                  marginTop: 8,
                  fontFamily: "var(--mono)",
                  fontSize: 9,
                  padding: "2px 6px",
                  background: "rgba(0,245,255,0.1)",
                  border: "1px solid rgba(0,245,255,0.3)",
                  borderRadius: 2,
                  color: "var(--electric-cyan)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {step.badge}
              </div>
            )}

            {/* Arrow between steps */}
            {i < ragSteps.length - 1 && (
              <div
                style={{
                  position: "absolute",
                  right: -12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 3,
                  width: 24,
                  height: 24,
                  background: "var(--obsidian-4)",
                  border: "1px solid var(--border)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  color: "var(--electric-cyan)",
                }}
              >
                →
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}