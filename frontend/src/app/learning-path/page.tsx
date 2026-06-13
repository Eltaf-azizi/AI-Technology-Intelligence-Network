"use client";

import { useState } from "react";
import { careers } from "@/lib/knowledge-graph";
import { technologies } from "@/lib/knowledge-graph";
import { LearningStep } from "@/lib/types";
import { Route, Target, Clock, CheckCircle, ArrowRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function LearningPathPage() {
  const [selectedCareer, setSelectedCareer] = useState(careers[0]);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const toggleStep = (id: string) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const progress = selectedCareer ? Math.round((completedSteps.size / selectedCareer.learningOrder.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Route size={24} className="text-atin-accent" />
          <div>
            <h1 className="text-xl font-bold text-white">Learning Path Generator</h1>
            <p className="text-sm text-atin-muted">AI-generated roadmaps for your career goals</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-atin-muted">
          <Target size={14} />
          {selectedCareer.learningOrder.length} steps to {selectedCareer.title}
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {careers.map(c => (
          <button
            key={c.id}
            onClick={() => { setSelectedCareer(c); setCompletedSteps(new Set()); }}
            className={cn(
              "shrink-0 rounded-xl border px-4 py-3 text-left transition-all",
              selectedCareer.id === c.id
                ? "border-atin-accent bg-atin-accent/5"
                : "border-atin-border bg-atin-bg2 hover:border-atin-accent/30"
            )}
          >
            <span className="text-sm font-semibold text-white">{c.title}</span>
            <span className="block text-xs text-atin-muted">{c.demand} Demand • {c.salaryRange}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-atin-border bg-atin-bg2 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Your Learning Path</h2>
              <span className="text-xs text-atin-muted">{progress}% complete</span>
            </div>
            <div className="mb-4 h-2 overflow-hidden rounded-full bg-atin-surface">
              <div
                className="h-full rounded-full bg-gradient-to-r from-atin-accent to-atin-accent2 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="space-y-2">
              {selectedCareer.learningOrder.map((techId, i) => {
                const tech = technologies.find(t => t.id === techId);
                if (!tech) return null;
                const isCompleted = completedSteps.has(techId);
                return (
                  <div
                    key={techId}
                    onClick={() => toggleStep(techId)}
                    className={cn(
                      "flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-all",
                      isCompleted
                        ? "border-atin-green/30 bg-atin-green/5"
                        : "border-atin-border bg-atin-surface hover:border-atin-accent/30"
                    )}
                  >
                    <div className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                      isCompleted ? "bg-atin-green text-white" : "bg-atin-surface2 text-atin-muted"
                    )}>
                      {isCompleted ? <CheckCircle size={16} /> : i + 1}
                    </div>
                    <span className="text-2xl">{tech.icon}</span>
                    <div className="flex-1 min-w-0">
                      <span className={cn("text-sm font-medium", isCompleted ? "text-atin-green line-through" : "text-white")}>
                        {tech.name}
                      </span>
                      <span className="block text-xs text-atin-muted">{tech.description.slice(0, 80)}...</span>
                    </div>
                    <Link
                      href={`/explorer/${techId}`}
                      onClick={e => e.stopPropagation()}
                      className="shrink-0 rounded-lg bg-atin-surface2 p-2 text-atin-muted hover:text-atin-accent"
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
            <h2 className="mb-4 text-sm font-semibold text-white">Career Details</h2>
            <p className="text-sm text-atin-text leading-relaxed">{selectedCareer.description}</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-atin-muted">Demand</span>
                <span className={cn(
                  "font-semibold",
                  selectedCareer.demand === "High" && "text-atin-green",
                  selectedCareer.demand === "Medium" && "text-atin-yellow",
                  selectedCareer.demand === "Low" && "text-atin-red"
                )}>{selectedCareer.demand}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-atin-muted">Salary Range</span>
                <span className="font-semibold text-white">{selectedCareer.salaryRange}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-atin-muted">Growth Rate</span>
                <span className="font-semibold text-atin-green">+{selectedCareer.growth}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-atin-muted">Est. Time</span>
                <span className="font-semibold text-white">
                  <Clock size={14} className="inline mr-1 text-atin-muted" />
                  {selectedCareer.estimatedTime}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-atin-border bg-atin-bg2 p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">Recommended Projects</h2>
            <div className="space-y-2">
              {selectedCareer.projects.map((p, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-atin-muted">
                  <ArrowRight size={14} className="mt-0.5 shrink-0 text-atin-accent" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-atin-border bg-atin-bg2 p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {selectedCareer.skills.map(s => (
                <span key={s} className="rounded-lg bg-atin-surface px-2.5 py-1.5 text-xs text-atin-text">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
