"use client";

import { useEffect, useRef, useState } from "react";
import { techStack, SkillItem } from "@/lib/data";
import SectionHeader from "@/components/shared/sectionheader";

function SkillBar({ skill }: { skill: SkillItem }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setWidth(skill.level);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [skill.level]);

  return (
    <li
      ref={ref}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: "var(--mono)",
        fontSize: 11,
        cursor: "default",
        padding: "6px 8px",
        borderRadius: 3,
        transition: "background 0.2s",
        color: "var(--text-secondary)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "var(--obsidian-4)";
        el.style.color = "var(--text-primary)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "transparent";
        el.style.color = "var(--text-secondary)";
      }}
    >
      <span>{skill.name}</span>
      <div
        style={{
          width: 60,
          height: 3,
          background: "var(--border)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            background: "var(--electric-cyan)",
            borderRadius: 2,
            width: `${width}%`,
            transition: "width 1s ease",
          }}
        />
      </div>
    </li>
  );
}

export default function StackSection() {
  return (
    <section
      id="stack"
      style={{
        padding: "80px 60px",
        borderTop: "1px solid var(--border)",
      }}
    >
      <SectionHeader num="05" title="Tech" accent="Stack" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1px",
          background: "var(--border)",
          border: "1px solid var(--border)",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        {techStack.map((group, i) => (
          <div
            key={i}
            style={{
              background: "var(--obsidian-2)",
              padding: "28px 24px",
            }}
          >
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "0.2em",
                color: "var(--cyber-lime)",
                textTransform: "uppercase",
                marginBottom: 16,
                paddingBottom: 12,
                borderBottom: "1px solid var(--border-accent)",
              }}
            >
              {group.label}
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {group.skills.map((skill) => (
                <SkillBar key={skill.name} skill={skill} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}