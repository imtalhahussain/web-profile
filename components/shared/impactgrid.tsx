"use client";
import { impactMetrics } from "@/lib/data";

export default function ImpactGrid() {
  return (
    <div
      style={{
        padding: "60px",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        background: "var(--obsidian-2)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: 10,
          letterSpacing: "0.3em",
          color: "var(--text-secondary)",
          textTransform: "uppercase",
          marginBottom: 30,
        }}
      >
        // senior impact metrics
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1px",
          background: "var(--border)",
        }}
      >
        {impactMetrics.map((m, i) => (
          <ImpactCard key={i} number={m.number} unit={m.unit} desc={m.desc} />
        ))}
      </div>
    </div>
  );
}

function ImpactCard({
  number,
  unit,
  desc,
}: {
  number: string;
  unit: string;
  desc: string;
}) {
  return (
    <div
      style={{
        background: "var(--obsidian)",
        padding: "30px 28px",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        transition: "background 0.3s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "var(--obsidian-3)";
        const bar = e.currentTarget.querySelector(".impact-bar") as HTMLElement;
        if (bar) bar.style.transform = "scaleX(1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "var(--obsidian)";
        const bar = e.currentTarget.querySelector(".impact-bar") as HTMLElement;
        if (bar) bar.style.transform = "scaleX(0)";
      }}
    >
      {/* Animated bottom bar */}
      <div
        className="impact-bar"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "var(--cyber-lime)",
          transform: "scaleX(0)",
          transition: "transform 0.3s",
          transformOrigin: "left",
        }}
      />
      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: 36,
          fontWeight: 700,
          color: "var(--cyber-lime)",
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        {number}
        <span style={{ fontSize: 18, color: "var(--cyber-lime-dim)" }}>
          {unit}
        </span>
      </div>
      <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
        {desc}
      </div>
    </div>
  );
}