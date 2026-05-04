"use client";

import { useEffect, useRef, useState } from "react";
import { terminalLines } from "@/lib/data";

type Line = {
  type: string;
  text?: string;
  key?: string;
  val?: string;
};

export default function Terminal() {
  const [displayedLines, setDisplayedLines] = useState<Line[]>([]);
  const [done, setDone] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let idx = 0;
    const addLine = () => {
      if (idx >= terminalLines.length) {
        setDone(true);
        return;
      }
      const line = terminalLines[idx++];
      setDisplayedLines((prev) => [...prev, line as Line]);
      setTimeout(addLine, idx < 3 ? 400 : 160);
    };
    const timeout = setTimeout(addLine, 800);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [displayedLines]);

  return (
    <div
      style={{
        background: "var(--obsidian-2)",
        border: "1px solid var(--border-accent)",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow:
          "0 0 40px rgba(170,255,0,0.06), inset 0 0 40px rgba(0,0,0,0.5)",
        animation: "glowPulse 3s ease-in-out infinite",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          background: "var(--obsidian-3)",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderBottom: "1px solid var(--border)",
        }}
      >
        {[
          { color: "#ff5f57" },
          { color: "#febc2e" },
          { color: "#28c840" },
        ].map((dot, i) => (
          <span
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: dot.color,
              display: "inline-block",
            }}
          />
        ))}
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            color: "var(--text-muted)",
            marginLeft: 8,
          }}
        >
          rag-agent · talha-kb · prod
        </span>
      </div>

      {/* Body */}
      <div
        ref={bodyRef}
        style={{
          padding: "20px 20px 24px",
          fontFamily: "var(--mono)",
          fontSize: 12,
          lineHeight: 1.8,
          minHeight: 280,
          maxHeight: 320,
          overflowY: "auto",
        }}
      >
        {/* Initial prompt */}
        <div style={{ marginBottom: 2 }}>
          <span style={{ color: "var(--cyber-lime)" }}>▶</span>{" "}
          <span style={{ color: "var(--text-primary)" }}>
            query --context talha.kb &quot;Who is Talha?&quot;
          </span>
        </div>
        <div style={{ color: "var(--text-muted)", marginBottom: 8 }}>
          &nbsp;&nbsp;Embedding query... retrieving chunks... reranking...
        </div>

        {/* Dynamic lines */}
        {displayedLines.map((line, i) => (
          <div key={i} style={{ marginBottom: 2 }}>
            {line.type === "response" && (
              <span style={{ color: "var(--electric-cyan)" }}>{line.text}</span>
            )}
            {line.type === "key-val" && (
              <>
                <span style={{ color: "var(--amber)" }}>&nbsp;&nbsp;{line.key}</span>
                <span style={{ color: "var(--text-secondary)" }}>{line.val}</span>
              </>
            )}
            {line.type === "highlight" && (
              <span style={{ color: "var(--cyber-lime)" }}>{line.text}</span>
            )}
          </div>
        ))}

        {/* Cursor */}
        {done && (
          <div>
            <span style={{ color: "var(--cyber-lime)" }}>▶</span>{" "}
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 14,
                background: "var(--cyber-lime)",
                verticalAlign: "middle",
                animation: "blink 1s step-end infinite",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}