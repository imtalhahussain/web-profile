export default function SectionHeader({
  num,
  title,
  accent,
}: {
  num: string;
  title: string;
  accent: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 16,
        marginBottom: 48,
      }}
    >
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: 11,
          color: "var(--text-muted)",
        }}
      >
        {num}
      </span>
      <h2
        style={{
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: "-0.02em",
        }}
      >
        {title}{" "}
        <span style={{ color: "var(--cyber-lime)" }}>{accent}</span>
      </h2>
      <div
        style={{ flex: 1, height: 1, background: "var(--border)" }}
      />
    </div>
  );
}