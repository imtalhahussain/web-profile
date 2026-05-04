"use client";

import { Project } from "@/lib/data";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div
      style={{
        background: "var(--obsidian-2)",
        border: "1px solid var(--border)",
        borderRadius: 6,
        padding: 24,
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.3s, box-shadow 0.3s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(170,255,0,0.3)";
        el.style.boxShadow = "0 0 30px rgba(170,255,0,0.08)";
        const overlay = el.querySelector(".card-overlay") as HTMLElement;
        if (overlay) overlay.style.opacity = "1";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--border)";
        el.style.boxShadow = "none";
        const overlay = el.querySelector(".card-overlay") as HTMLElement;
        if (overlay) overlay.style.opacity = "0";
      }}
    >
      {/* Hover overlay */}
      <div
        className="card-overlay"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(170,255,0,0.06) 0%, transparent 60%)",
          opacity: 0,
          transition: "opacity 0.3s",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: 9,
          letterSpacing: "0.25em",
          color: "var(--cyber-lime)",
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        {project.type}
      </div>

      <div
        style={{
          fontSize: 16,
          fontWeight: 600,
          marginBottom: 10,
          lineHeight: 1.3,
        }}
      >
        {project.name}
      </div>

      <div
        style={{
          fontSize: 12,
          color: "var(--text-secondary)",
          lineHeight: 1.6,
          marginBottom: 16,
        }}
      >
        {project.desc}
      </div>

      {/* Stack tags */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          marginBottom: 16,
        }}
      >
        {project.stack.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              padding: "3px 8px",
              background: "var(--obsidian-3)",
              border: "1px solid var(--border)",
              borderRadius: 3,
              color: "var(--electric-cyan)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Telemetry */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          paddingTop: 16,
          borderTop: "1px solid var(--border)",
        }}
      >
        {project.telemetry.map((t) => (
          <div key={t.label} style={{ fontFamily: "var(--mono)", fontSize: 10 }}>
            <div style={{ color: "var(--text-muted)", marginBottom: 2 }}>
              {t.label}
            </div>
            <div
              style={{
                color: t.good ? "var(--cyber-lime)" : "var(--amber)",
                fontWeight: 600,
              }}
            >
              {t.val}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}