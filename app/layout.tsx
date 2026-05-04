import type { Metadata } from "next";
import "./global.css";

export const metadata: Metadata = {
  title: "Talha Hussain · Neural Command Center",
  description:
    "AI Engineer & RAG Specialist. Production LLM pipelines, agentic systems, and LLM infrastructure.",
  keywords: [
    "AI Engineer",
    "RAG",
    "LangChain",
    "LangGraph",
    "Pinecone",
    "LLM",
    "Agentic Systems",
  ],
  authors: [{ name: "Talha Hussain" }],
  openGraph: {
    title: "Talha Hussain · Neural Command Center",
    description: "Senior AI Engineer & RAG Specialist",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}