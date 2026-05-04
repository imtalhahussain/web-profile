"use client";

import { useEffect, useState } from "react";

const navLinks = [
  { href: "#projects", label: "ARCH" },
  { href: "#rag", label: "RAG" },
  { href: "#agents", label: "AGENTS" },
  { href: "#stack", label: "STACK" },
  { href: "#contact", label: "CONTACT" },
];

export default function Navbar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const t = new Date().toISOString().split("T")[1].split(".")[0];
      setTime("UTC " + t);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 40px",
        background: "rgba(5,5,5,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Logo */}
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: 13,
          color: "var(--cyber-lime)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
      >
        TALHA.AI v2.5.1
      </span>

      {/* Status */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          fontFamily: "var(--mono)",
          fontSize: 11,
          color: "var(--text-secondary)",
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--cyber-lime)",
            boxShadow: "0 0 8px var(--cyber-lime)",
            display: "inline-block",
            animation: "pulse 2s ease-in-out infinite",
          }}
        />
        <span>SYSTEM ONLINE</span>
        <span style={{ color: "var(--text-muted)" }}>|</span>
        <span>{time}</span>
      </div>

      {/* Links */}
      <ul style={{ display: "flex", gap: 32, listStyle: "none" }}>
        {navLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              style={{
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontSize: 12,
                fontFamily: "var(--mono)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--cyber-lime)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-secondary)")
              }
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}