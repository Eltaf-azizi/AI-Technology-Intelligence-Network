"use client";

import { useState } from "react";
import { technologies } from "@/lib/knowledge-graph";
import { GitCompare, ArrowRight, Zap, Shield, BookOpen, TrendingUp, BarChart3, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const comparisons: Record<string, { strengths: Record<string, string>; weaknesses: Record<string, string>; useCases: Record<string, string>; learningCurve: Record<string, string>; adoption: Record<string, string> }> = {
  "docker-vs-kubernetes": {
    strengths: {
      "Docker": "Lightweight containers, fast startup, simple learning curve, excellent for local development",
      "Kubernetes": "Auto-scaling, self-healing, service discovery, production-grade orchestration"
    },
    weaknesses: {
      "Docker": "Limited orchestration, manual scaling, no built-in load balancing at scale",
      "Kubernetes": "Complex setup, steep learning curve, resource-heavy, overkill for small apps"
    },
    useCases: {
      "Docker": "Local development, CI/CD builds, microservice packaging, single-host deployments",
      "Kubernetes": "Large-scale microservices, cloud-native apps, multi-host orchestration, production workloads"
    },
    learningCurve: {
      "Docker": "Easy - 1-2 months to proficiency",
      "Kubernetes": "Hard - 3-6 months to proficiency"
    },
    adoption: {
      "Docker": "Ubiquitous - 95% adoption among developers",
      "Kubernetes": "Widespread - 85% adoption in enterprises"
    }
  },
  "tensorflow-vs-pytorch": {
    strengths: {
      "TensorFlow": "Production-ready, TensorBoard visualization, TF Serving, strong mobile support",
      "PyTorch": "Pythonic API, dynamic graphs, easier debugging, research-friendly, growing ecosystem"
    },
    weaknesses: {
      "TensorFlow": "Steeper learning curve, verbose API, debugging challenges",
      "PyTorch": "Newer production tooling, smaller mobile ecosystem"
    },
    useCases: {
      "TensorFlow": "Production deployment, mobile/edge inference, large-scale distributed training",
      "PyTorch": "Research prototyping, academic projects, dynamic model architectures"
    },
    learningCurve: {
      "TensorFlow": "Moderate - 2-4 months",
      "PyTorch": "Moderate - 1-3 months"
    },
    adoption: {
      "TensorFlow": "68% market share, strong in industry",
      "PyTorch": "Growing rapidly, 55% of research papers use it"
    }
  },
  "react-vs-angular": {
    strengths: {
      "React": "Flexible, huge ecosystem, excellent performance, great developer experience",
      "Angular": "Full-featured framework, TypeScript-first, strong opinions, enterprise-ready"
    },
    weaknesses: {
      "React": "Not a full framework, requires additional libraries, too many choices",
      "Angular": "Steep learning curve, verbose, opinionated, heavy bundle size"
    },
    useCases: {
      "React": "SPAs, interactive UIs, mobile (React Native), component libraries",
      "Angular": "Enterprise apps, large teams, complex forms, full-featured SPAs"
    },
    learningCurve: {
      "React": "Easy to start - 2-4 months",
      "Angular": "Steep - 3-6 months"
    },
    adoption: {
      "React": "82% developer satisfaction, most popular frontend framework",
      "Angular": "Strong enterprise adoption, 45% developer satisfaction"
    }
  },
  "sql-vs-nosql": {
    strengths: {
      "SQL": "ACID compliance, complex queries, joins, strong consistency, mature ecosystem",
      "NoSQL": "Horizontal scaling, flexible schemas, high performance for simple queries, great for big data"
    },
    weaknesses: {
      "SQL": "Vertical scaling limits, rigid schema, less suited for unstructured data",
      "NoSQL": "No ACID guarantees, limited query capabilities, eventual consistency"
    },
    useCases: {
      "SQL": "Financial systems, CRM, ERP, structured data with relationships",
      "NoSQL": "Real-time apps, IoT, content management, big data analytics"
    },
    learningCurve: {
      "SQL": "Easy - 1-2 months",
      "NoSQL": "Moderate - 2-4 months"
    },
    adoption: {
      "SQL": "Universal - 90% of systems use a relational database",
      "NoSQL": "Growing - 60% of new projects consider NoSQL"
    }
  },
};

const comparisonOptions = [
  { id: "docker-vs-kubernetes", tech1: "Docker", tech2: "Kubernetes", icon1: "🐳", icon2: "☸️" },
  { id: "tensorflow-vs-pytorch", tech1: "TensorFlow", tech2: "PyTorch", icon1: "🧠", icon2: "🔥" },
  { id: "react-vs-angular", tech1: "React", tech2: "Angular", icon1: "⚛️", icon2: "🅰️" },
  { id: "sql-vs-nosql", tech1: "SQL", tech2: "NoSQL", icon1: "🗄️", icon2: "📊" },
];

export default function ComparePage() {
  const [selected, setSelected] = useState(comparisonOptions[0]);
  const data = comparisons[selected.id];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <GitCompare size={24} className="text-atin-accent" />
        <div>
          <h1 className="text-xl font-bold text-white">Technology Comparison</h1>
          <p className="text-sm text-atin-muted">Side-by-side analysis of competing technologies</p>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {comparisonOptions.map(c => (
          <button
            key={c.id}
            onClick={() => setSelected(c)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-xl border px-4 py-3 transition-all",
              selected.id === c.id
                ? "border-atin-accent bg-atin-accent/5"
                : "border-atin-border bg-atin-bg2 hover:border-atin-accent/30"
            )}
          >
            <span>{c.icon1}</span>
            <ArrowRight size={14} className="text-atin-muted" />
            <span>{c.icon2}</span>
            <span className="text-sm text-white ml-1">{c.tech1} vs {c.tech2}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {Object.entries({ Strengths: "strengths", Weaknesses: "weaknesses", "Use Cases": "useCases", "Learning Curve": "learningCurve", Adoption: "adoption" } as const).map(([section, key]) => {
          const items = data[key] as Record<string, string>;
          const Icon = section === "Strengths" ? Zap : section === "Weaknesses" ? Shield : section === "Use Cases" ? BookOpen : section === "Learning Curve" ? TrendingUp : BarChart3;
          return (
            <div key={section} className="rounded-xl border border-atin-border bg-atin-bg2 p-5">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                <Icon size={16} className="text-atin-accent" />
                {section}
              </h2>
              <div className="space-y-3">
                {[selected.icon1, selected.icon2].map((icon, i) => {
                  const techName = i === 0 ? selected.tech1 : selected.tech2;
                  return (
                    <div key={techName} className="rounded-lg bg-atin-surface p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span>{icon}</span>
                        <span className="text-sm font-medium text-white">{techName}</span>
                      </div>
                      <p className="text-xs text-atin-muted leading-relaxed">{items[techName]}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
