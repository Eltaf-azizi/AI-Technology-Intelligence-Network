"use client";

import { useState } from "react";
import { technologies } from "@/lib/knowledge-graph";
import { MentorMessage } from "@/lib/types";
import { Brain, Send, Bot, User, Sparkles } from "lucide-react";
import Link from "next/link";

const suggestions = [
  "What should I learn after Python?",
  "Explain Kubernetes like I'm a beginner",
  "What technologies do I need to become an AI Engineer?",
  "What's the difference between SQL and NoSQL?",
  "How do I become a Cloud Engineer?",
  "What is the best path to learn Machine Learning?",
];

const mentorResponses: Record<string, string> = {
  "python": `Great question! After Python, your next step depends on your goal:

**For AI/ML:** Study Mathematics → Statistics → Machine Learning → Deep Learning
**For Web:** Learn JavaScript → TypeScript → React
**For Data Science:** SQL → Statistics → Data Science
**For Automation:** Docker → Linux → Cloud

I'd recommend starting with **Mathematics** and **SQL** as they're foundational for most paths.`,
  "kubernetes": `Think of Kubernetes as a hotel manager for your apps:

- **Docker** creates the "guests" (containers)
- **Kubernetes** decides which room (server) each guest stays in
- If a guest leaves, it finds a new room
- If too many guests arrive, it books more rooms
- It keeps the hotel running 24/7

Prerequisites: Linux, Networking, Docker, Cloud Fundamentals`,
  "ai engineer": `Here's your personalized learning plan to become an AI Engineer:

**Phase 1 - Foundations (3-4 months)**
• Python - Master it
• Mathematics (Linear Algebra, Calculus)
• Statistics & Probability

**Phase 2 - Core ML (4-5 months)**
• Machine Learning algorithms
• Deep Learning with neural networks
• Natural Language Processing

**Phase 3 - Engineering (3-4 months)**
• MLOps for deploying models
• Docker & Cloud platforms
• RAG systems & LLMs

**Phase 4 - Specialize (ongoing)**
• Pick a domain (CV, NLP, or Robotics)
• Build a portfolio of projects
• Contribute to open source`,
};

export default function MentorPage() {
  const [messages, setMessages] = useState<MentorMessage[]>([
    { role: "assistant", content: "Welcome to the AI Mentor. I'm here to guide you through your technology learning journey. Ask me anything about what to learn, how technologies connect, or career paths." }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: "user", content: text }]);
    const lower = text.toLowerCase();
    let response = "That's a great question! I'm analyzing the technology graph to find the best answer for you. Based on current industry trends and knowledge graph relationships, ";

    if (lower.includes("python") && (lower.includes("after") || lower.includes("next"))) {
      response = mentorResponses["python"];
    } else if (lower.includes("kubernetes") && lower.includes("beginner")) {
      response = mentorResponses["kubernetes"];
    } else if (lower.includes("ai engineer") || (lower.includes("become") && lower.includes("ai"))) {
      response = mentorResponses["ai engineer"];
    } else if (lower.includes("sql") && lower.includes("nosql")) {
      response = "**SQL vs NoSQL - Quick Comparison:**\n\n**SQL** (PostgreSQL, MySQL): Structured data, strict schemas, ACID compliance. Best for: financial systems, CRM, apps with clear relationships.\n\n**NoSQL** (MongoDB, Redis): Flexible schemas, horizontal scaling. Best for: real-time apps, IoT, big data, content management.\n\n**When to choose:** Use SQL when data integrity is critical. Use NoSQL when scaling horizontally and flexibility matter more.";
    } else if (lower.includes("cloud engineer")) {
      response = "**Cloud Engineer Roadmap:**\n\n1. **Networking** - TCP/IP, DNS, HTTP\n2. **Linux** - Command line, shell scripting\n3. **Cloud Platform** - AWS/Azure/GCP basics\n4. **Docker** - Containerization\n5. **Kubernetes** - Container orchestration\n6. **CI/CD** - Automated pipelines\n7. **Infrastructure as Code** - Terraform, CloudFormation\n\n**Estimated time:** 8-14 months with consistent study.";
    } else if (lower.includes("machine learning") || lower.includes("ml") && lower.includes("path")) {
      response = "**Machine Learning Learning Path:**\n\n1. **Python** (2-3 months)\n2. **Mathematics** - Linear Algebra, Calculus (2-3 months)\n3. **Statistics** (1-2 months)\n4. **Machine Learning Basics** - Scikit-learn, algorithms (3-4 months)\n5. **Deep Learning** - Neural networks, TensorFlow/PyTorch (3-4 months)\n6. **MLOps** - Model deployment, monitoring (2-3 months)\n\n**Total:** ~14-18 months to job-ready.";
    } else {
      response += "I recommend starting with the fundamentals: Python programming, understanding basic networking and Linux. From there, follow your interests - whether it's AI, cloud, security, or data science. Each path has its own unique learning journey, and ATIN's knowledge graph can help you visualize the connections. Check out the **Learning Paths** page for structured roadmaps!";
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    }, 800);
    setInput("");
  };

  return (
    <div className="mx-auto flex h-full max-w-4xl flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-atin-accent to-atin-accent2">
          <Brain size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">AI Technology Mentor</h1>
          <p className="text-sm text-atin-muted">Your personal AI guide for technology learning</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-atin-border bg-atin-bg2">
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-atin-accent/10">
                  <Bot size={16} className="text-atin-accent" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-atin-accent/10 text-atin-text"
                  : "bg-atin-surface text-atin-text"
              }`}>
                <div className="text-sm whitespace-pre-line leading-relaxed [&_strong]:text-atin-accent">
                  {msg.content}
                </div>
              </div>
              {msg.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-atin-surface">
                  <User size={16} className="text-atin-muted" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-atin-border p-3">
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="rounded-full bg-atin-surface px-3 py-1 text-xs text-atin-muted hover:bg-atin-surface2 hover:text-atin-accent transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend(input)}
              placeholder="Ask the AI Mentor anything..."
              className="flex-1 rounded-lg border border-atin-border bg-atin-surface px-4 py-2.5 text-sm text-atin-text placeholder:text-atin-muted focus:border-atin-accent focus:outline-none"
            />
            <button
              onClick={() => handleSend(input)}
              className="flex items-center gap-2 rounded-lg bg-atin-accent/10 px-4 py-2.5 text-sm text-atin-accent hover:bg-atin-accent/20 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
