"use client";

import { useState } from "react";
import { careers, technologies } from "@/lib/knowledge-graph";
import { Briefcase, Clock, TrendingUp, DollarSign, CheckCircle, ArrowRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function CareerPage() {
  const [selected, setSelected] = useState(careers[0]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <Briefcase size={24} className="text-atin-accent" />
        <div>
          <h1 className="text-xl font-bold text-white">Career Intelligence</h1>
          <p className="text-sm text-atin-muted">AI-powered career guidance and market insights</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {careers.map(c => (
          <button
            key={c.id}
            onClick={() => setSelected(c)}
            className={cn(
              "rounded-xl border p-4 text-left transition-all",
              selected.id === c.id
                ? "border-atin-accent bg-atin-accent/5"
                : "border-atin-border bg-atin-bg2 hover:border-atin-accent/30"
            )}
          >
            <span className="text-sm font-semibold text-white">{c.title}</span>
            <span className="mt-1 block text-xs text-atin-muted">{c.demand} Demand</span>
            <span className="block text-xs text-atin-green">+{c.growth}% growth</span>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-atin-border bg-atin-bg2 p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">{selected.title} - Career Roadmap</h2>
            <p className="mb-6 text-sm text-atin-text leading-relaxed">{selected.description}</p>
            <div className="space-y-2">
              {selected.learningOrder.map((techId, i) => {
                const tech = technologies.find(t => t.id === techId);
                if (!tech) return null;
                return (
                  <div key={techId} className="flex items-center gap-4 rounded-lg bg-atin-surface p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-atin-surface2 text-sm font-bold text-atin-muted">
                      {i + 1}
                    </div>
                    <span className="text-xl">{tech.icon}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-white">{tech.name}</span>
                      <span className="block text-xs text-atin-muted">{tech.difficulty} • {tech.learningTime}</span>
                    </div>
                    <Link
                      href={`/explorer/${techId}`}
                      className="shrink-0 rounded-lg bg-atin-bg p-2 text-atin-muted hover:text-atin-accent"
                    >
                      <BookOpen size={14} />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-atin-border bg-atin-bg2 p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">Market Data</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-atin-muted">Demand</span>
                <span className={cn(
                  "text-sm font-semibold",
                  selected.demand === "High" && "text-atin-green",
                  selected.demand === "Medium" && "text-atin-yellow",
                  selected.demand === "Low" && "text-atin-red"
                )}>{selected.demand}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-atin-muted">Salary Range</span>
                <span className="text-sm font-semibold text-white">{selected.salaryRange}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-atin-muted">Market Growth</span>
                <span className="text-sm font-semibold text-atin-green">+{selected.growth}%/yr</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-atin-muted">Est. Learning Time</span>
                <span className="text-sm font-semibold text-white">{selected.estimatedTime}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-atin-border bg-atin-bg2 p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {selected.skills.map(s => (
                <span key={s} className="rounded-lg bg-atin-surface px-2.5 py-1.5 text-xs text-atin-text">{s}</span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-atin-border bg-atin-bg2 p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">Recommended Projects</h2>
            <div className="space-y-2">
              {selected.projects.map((p, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-atin-muted">
                  <ArrowRight size={14} className="mt-0.5 shrink-0 text-atin-accent" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
