import Terminal from "./terminal";
import VectorCanvas from "./vectorcanvas";

export default function Hero() {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        paddingTop: 70,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background radials */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 600px 400px at 70% 30%, rgba(0,245,255,0.04) 0%, transparent 70%), radial-gradient(ellipse 400px 300px at 20% 70%, rgba(170,255,0,0.03) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Left: Terminal panel */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 50px 60px 60px",
          position: "relative",
          zIndex: 2,
          opacity: 0,
          animation: "fadeUp 0.6s ease 0.1s forwards",
        }}
      >
        {/* Label */}
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.25em",
            color: "var(--cyber-lime)",
            textTransform: "uppercase",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ display: "block", width: 20, height: 1, background: "var(--cyber-lime)" }} />
          AI AGENT — KNOWLEDGE RETRIEVAL
        </div>

        <Terminal />

        {/* Name + title */}
        <div style={{ marginTop: 32 }}>
          <h1
            style={{
              fontSize: 52,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              marginBottom: 8,
              opacity: 0,
              animation: "fadeUp 0.6s ease 0.3s forwards",
            }}
          >
            Talha{" "}
            <span style={{ color: "var(--cyber-lime)" }}>Hussain</span>
          </h1>
          <p
            style={{
              fontFamily: "var(--mono)",
              fontSize: 13,
              color: "var(--electric-cyan)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              opacity: 0,
              animation: "fadeUp 0.6s ease 0.4s forwards",
            }}
          >
            AI Engineer · RAG Specialist · Agentic Systems
          </p>
        </div>
      </div>

      {/* Right: Vector space */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <VectorCanvas />
      </div>
    </section>
  );
}