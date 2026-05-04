"use client";
import { healthMetrics } from "@/lib/data";
import { useEffect, useState } from "react";

export default function SystemHealthStrip() {
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink((b) => !b);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        padding: "15px 30px",
        background: "var(--obsidian-2)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        overflowX: "auto",
        gap: "40px",
        alignItems: "center",
        fontFamily: "var(--mono)",
        whiteSpace: "nowrap",
        scrollbarWidth: "none",
      }}
    >
      <div style={{ color: "var(--text-secondary)", fontSize: "12px", display: "flex", alignItems: "center", gap: "10px", marginRight: "20px" }}>
        <div style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: blink ? "var(--cyber-lime)" : "var(--obsidian-3)",
          boxShadow: blink ? "0 0 8px var(--cyber-lime)" : "none",
          transition: "all 0.2s ease"
        }} />
        SYSTEM HEALTH
      </div>

      {healthMetrics.map((metric, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ fontSize: "10px", color: "var(--text-secondary)", letterSpacing: "0.1em" }}>
            {metric.key} {'live' in metric && metric.live && <span style={{ color: "var(--electric-cyan)", marginLeft: "4px" }}>[LIVE]</span>}
          </div>
          <div style={{ fontSize: "14px", color: "var(--text)", fontWeight: 500, display: "flex", alignItems: "baseline", gap: "8px" }}>
            {metric.val}
            <span style={{ fontSize: "10px", color: "var(--cyber-lime-dim)" }}>
              {metric.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
