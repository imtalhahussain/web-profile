"use client";

const contactLinks = [
  { icon: "⬡", label: "GitHub · github.com/imtalhahussain", href: "https://github.com" },
  { icon: "◈", label: "LinkedIn · linkedin.com/in/talha-hussain", href: "https://www.linkedin.com/in/md-talha-hussain/" },
  { icon: "◉", label: "Email · imtalhahussain10@gmail.com", href: "mailto:imtalhahussain10@gmail.com" },
  { icon: "◫", label: "Resume · Download PDF", href: "/TalhaHussain_Resume.pdf" },
];

export default function ContactSection() {
  return (
    <section
      id="contact"
      style={{
        padding: "80px 60px",
        borderTop: "1px solid var(--border)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 60,
        alignItems: "center",
      }}
    >
      <div>
        <h2
          style={{
            fontSize: 42,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}
        >
          Ready to{" "}
          <span style={{ color: "var(--cyber-lime)" }}>deploy</span>
          <br />
          something great?
        </h2>
        <p
          style={{
            fontSize: 14,
            color: "var(--text-secondary)",
            lineHeight: 1.7,
            marginBottom: 32,
          }}
        >
          Senior AI Engineer specializing in production RAG pipelines, agentic
          systems, and LLM infrastructure. Open to founding engineer roles &
          senior positions in AI-native companies.
        </p>
        <a
          href="mailto:imtalhahussain10@gmail.com"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "14px 28px",
            background: "var(--cyber-lime)",
            color: "var(--obsidian)",
            fontFamily: "var(--mono)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            borderRadius: 4,
            textDecoration: "none",
            transition: "box-shadow 0.3s, transform 0.2s",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.boxShadow = "0 0 30px rgba(170,255,0,0.4)";
            el.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.boxShadow = "none";
            el.style.transform = "translateY(0)";
          }}
        >
          INITIATE_CONNECTION →
        </a>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {contactLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontFamily: "var(--mono)",
              fontSize: 12,
              color: "var(--text-secondary)",
              textDecoration: "none",
              padding: "12px 16px",
              border: "1px solid var(--border)",
              borderRadius: 4,
              transition: "border-color 0.3s, color 0.3s, background 0.3s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--cyber-lime)";
              el.style.color = "var(--cyber-lime)";
              el.style.background = "var(--cyber-lime-glow)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--border)";
              el.style.color = "var(--text-secondary)";
              el.style.background = "transparent";
            }}
          >
            <span style={{ fontSize: 14 }}>{link.icon}</span>
            <span>{link.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}