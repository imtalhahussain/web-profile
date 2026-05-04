"use client";

import { useState } from "react";
import SectionHeader from "@/components/shared/sectionheader";

const outputOn = (
  <>
    <div>
      <span style={{ color: "var(--cyber-lime)" }}>[PII DETECTED · BLOCKED]</span>
    </div>
    <div>
      SSN: <span style={{ color: "var(--cyber-lime)" }}>***-**-****</span>
    </div>
    <div>
      EMAIL: <span style={{ color: "var(--cyber-lime)" }}>[REDACTED]</span>
    </div>
    <div style={{ marginTop: 8 }}>
      <span style={{ color: "var(--cyber-lime)" }}>✓ Safe response generated.</span>
    </div>
    <div style={{ color: "var(--text-secondary)", fontSize: 10 }}>
      Cannot store PII per policy GDPR-04.
    </div>
  </>
);

const outputOff = (
  <>
    <div>
      <span style={{ color: "var(--amber)" }}>⚠ GUARDRAILS OFF</span>
    </div>
    <div style={{ color: "var(--text-secondary)" }}>SSN: 042-88-1234</div>
    <div style={{ color: "var(--text-secondary)" }}>EMAIL: john.doe@gmail.com</div>
    <div style={{ marginTop: 8 }}>
      <span style={{ color: "var(--red-alert)" }}>✗ PII stored in DB — VIOLATION</span>
    </div>
    <div style={{ color: "var(--text-secondary)", fontSize: 10 }}>
      Audit log: COMPLIANCE_BREACH_042
    </div>
  </>
);

export default function GuardrailsSection() {
  const [active, setActive] = useState(true);

  return (
    <section style={{ padding: "0 60px 80px" }}>
      <SectionHeader num="04" title="NeMo" accent="Guardrails · Live Demo" />

      <div
        style={{
          background: "var(--obsidian-2)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            borderBottom: "1px solid var(--border)",
            background: "var(--obsidian-3)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            PII LEAKAGE PREVENTION · REAL-TIME
          </span>

          {/* Toggle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
            }}
            onClick={() => setActive(!active)}
          >
            <div
              style={{
                width: 40,
                height: 22,
                borderRadius: 11,
                background: active ? "var(--cyber-lime)" : "var(--red-alert)",
                position: "relative",
                transition: "background 0.3s",
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "white",
                  position: "absolute",
                  top: 2,
                  left: active ? 20 : 2,
                  transition: "left 0.3s",
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                color: "var(--text-secondary)",
              }}
            >
              {active ? "GUARDRAILS ACTIVE" : "GUARDRAILS DISABLED"}
            </span>
          </div>
        </div>

        {/* Body */}
        <div
          style={{
            padding: 24,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}
        >
          {/* Input */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "0.2em",
                color: "var(--text-muted)",
                textTransform: "uppercase",
              }}
            >
              // input — user query
            </div>
            <div
              style={{
                background: "var(--obsidian)",
                border: "1px solid var(--border)",
                borderRadius: 4,
                padding: 14,
                fontFamily: "var(--mono)",
                fontSize: 11,
                lineHeight: 1.8,
                minHeight: 100,
              }}
            >
              <div>
                user: &quot;My SSN is{" "}
                <span style={{ color: "var(--red-alert)" }}>042-88-1234</span> and
              </div>
              <div>
                email is{" "}
                <span style={{ color: "var(--red-alert)" }}>
                  john.doe@gmail.com
                </span>
                .
              </div>
              <div>Can you store this in my profile?&quot;</div>
            </div>
          </div>

          {/* Output */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "0.2em",
                color: "var(--text-muted)",
                textTransform: "uppercase",
              }}
            >
              // output — with guardrails
            </div>
            <div
              style={{
                background: "var(--obsidian)",
                border: `1px solid ${active ? "rgba(170,255,0,0.2)" : "rgba(255,59,48,0.2)"}`,
                borderRadius: 4,
                padding: 14,
                fontFamily: "var(--mono)",
                fontSize: 11,
                lineHeight: 1.8,
                minHeight: 100,
                transition: "border-color 0.3s",
              }}
            >
              {active ? outputOn : outputOff}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}