import Navbar from "@/components/shared/navbar";
import Hero from "@/components/hero/hero";
import SystemHealthStrip from "@/components/shared/systemhealtstrip";
import ImpactGrid from "@/components/shared/impactgrid";
import ProjectsSection from "@/components/projects/projectsection";
import RagSection from "@/components/rag/ragsection";
import AgentsSection from "@/components/agents/agentssection";
import GuardrailsSection from "@/components/guardrails/guardialssection";
import StackSection from "@/components/stack/stackssection";
import ContactSection from "@/components/shared/contactsection";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ImpactGrid />
      <SystemHealthStrip />
      <ProjectsSection />
      <RagSection />
      <AgentsSection />
      <GuardrailsSection />
      <StackSection />
      <ContactSection />
    </main>
  );
}