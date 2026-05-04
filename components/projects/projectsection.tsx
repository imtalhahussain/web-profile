import { projects } from "@/lib/data";
import SectionHeader from "@/components/shared/sectionheader";
import ProjectCard from "./projectcard";

export default function ProjectsSection() {
  return (
    <section id="projects" style={{ padding: "80px 60px" }}>
      <SectionHeader num="01" title="Architecture" accent="Gallery" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}
      >
        {projects.map((p, i) => (
          <ProjectCard key={i} project={p} />
        ))}
      </div>
    </section>
  );
}