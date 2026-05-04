"use client";
import SectionHeader from "@/components/shared/sectionheader";

const agents = [
  { emoji: "🔍", label: "SEARCH", sub: "Web search · SERP · Tavily", color: "var(--electric-cyan)", borderColor: "rgba(0,245,255,0.3)", bg: "rgba(0,245,255,0.05)" },
  { emoji: "✈", label: "BOOKING", sub: "Flights · Hotels · APIs", color: "var(--electric-cyan)", borderColor: "rgba(0,245,255,0.3)", bg: "rgba(0,245,255,0.05)" },
  { emoji: "🧠", label: "MEMORY", sub: "Redis · User prefs · History", color: "var(--amber)", borderColor: "rgba(255,149,0,0.3)", bg: "rgba(255,149,0,0.05)" },
  { emoji: "🛡", label: "GUARDRAIL", sub: "NeMo · Safety · PII filter", color: "var(--red-alert)", borderColor: "rgba(255,59,48,0.3)", bg: "rgba(255,59,48,0.05)" },
];

function WorkflowNode({
  label,
  sub,
  color,
  borderColor,
  bg,
  emoji,
}: {
  label: string;
  sub: string;
  color: string;
  borderColor: string;
  bg: string;
  emoji?: string;
}) {
  return (
    <div
      style={{
        padding: "14px 16px",
        borderRadius: 6,
        border: `1px solid ${borderColor}`,
        background: bg,
        textAlign: "center",
        cursor: "pointer",
        transition: "box-shadow 0.3s",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.boxShadow =
          "0 0 20px rgba(170,255,0,0.15)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.boxShadow = "none")
      }
    >
      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: 11,
          fontWeight: 600,
          color,
          marginBottom: 4,
        }}
      >
        {emoji} {label}
      </div>
      <div
        style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text-secondary)" }}
      >
        {sub}
      </div>
    </div>
  );
}

export default function AgentsSection() {
  return (
    <section id="agents" style={{ padding: "80px 60px" }}>
      <SectionHeader num="03" title="Agent Workflow ·" accent="Travel Itinerary" />

      <div
        style={{
          background: "var(--obsidian-2)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: 32,
        }}
      >
        {/* Status bar */}
        <div
          style={{
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: "var(--text-muted)",
            }}
          >
            LANGGRAPH · CYCLIC EXECUTION · STATE MACHINE
          </span>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--cyber-lime)",
              boxShadow: "0 0 8px var(--cyber-lime)",
              display: "inline-block",
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
          <span
            style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--cyber-lime)" }}
          >
            RUNNING
          </span>
        </div>

        {/* Orchestrator */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div
            style={{
              display: "inline-block",
              padding: "14px 32px",
              minWidth: 200,
              borderRadius: 6,
              border: "1px solid rgba(170,255,0,0.4)",
              background: "rgba(170,255,0,0.06)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                fontWeight: 600,
                color: "var(--cyber-lime)",
                marginBottom: 4,
              }}
            >
              ⬡ ORCHESTRATOR
            </div>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 9,
                color: "var(--text-secondary)",
              }}
            >
              LangGraph StateGraph · cycle mgmt
            </div>
          </div>
        </div>

        {/* Arrow down */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 12,
            fontFamily: "var(--mono)",
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          ↓ dispatch tasks
        </div>

        {/* Agents row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            marginBottom: 12,
          }}
        >
          {agents.map((a) => (
            <WorkflowNode key={a.label} {...a} />
          ))}
        </div>

        {/* Arrow up + cycle */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 12,
            fontFamily: "var(--mono)",
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          ↑ results · ↻ cycle back if incomplete
        </div>

        {/* Output node */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div
            style={{
              display: "inline-block",
              padding: "14px 32px",
              minWidth: 200,
              borderRadius: 6,
              border: "1px solid rgba(170,255,0,0.4)",
              background: "rgba(170,255,0,0.06)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                fontWeight: 600,
                color: "var(--cyber-lime)",
                marginBottom: 4,
              }}
            >
              📋 ITINERARY OUTPUT
            </div>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 9,
                color: "var(--text-secondary)",
              }}
            >
              Structured JSON · Citations · Costs
            </div>
          </div>
        </div>

        {/* Cycle note */}
        <div
          style={{
            padding: "12px 16px",
            border: "1px dashed rgba(255,149,0,0.3)",
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ color: "var(--amber)", fontSize: 16 }}>↻</span>
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--text-secondary)",
            }}
          >
            Cycle management: if completeness score &lt; 0.85, orchestrator
            re-dispatches targeted sub-agents. Max 3 cycles before graceful
            degradation.
          </span>
        </div>
      </div>
    </section>
  );
}