"use client";

import { useParams } from "next/navigation";
import { technologies, getRelatedTechnologies, getRelationshipsForTechnology } from "@/lib/knowledge-graph";
import { Clock, Signal, TrendingUp, Target, ArrowLeft, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { cn, getCategoryColor } from "@/lib/utils";

export default function ExplorePage() {
  const params = useParams();
  const techId = params.id as string;
  const tech = technologies.find(t => t.id === techId);
  const related = tech ? getRelatedTechnologies(tech.id) : [];
  const rels = tech ? getRelationshipsForTechnology(tech.id) : [];

  if (!tech) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">Technology Not Found</h2>
          <p className="mt-2 text-sm text-atin-muted">The technology you're looking for doesn't exist in our graph yet.</p>
          <Link href="/explorer" className="mt-4 inline-flex items-center gap-2 text-atin-accent hover:underline">
            <ArrowLeft size={16} /> Browse all technologies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-atin-muted hover:text-atin-accent">
        <ArrowLeft size={16} /> Back to Network
      </Link>

      <div className="flex items-start gap-6">
        <div
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl"
          style={{ background: `${tech.color}20` }}
        >
          <span className="text-4xl">{tech.icon}</span>
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white">{tech.name}</h1>
          <span className="text-sm text-atin-muted">{tech.category}</span>
          <p className="mt-3 text-sm leading-relaxed text-atin-text">{tech.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Difficulty", value: tech.difficulty, icon: Signal, color: tech.difficulty === "Beginner" ? "text-atin-green" : tech.difficulty === "Intermediate" ? "text-atin-yellow" : "text-atin-red" },
          { label: "Learning Time", value: tech.learningTime, icon: Clock, color: "text-atin-accent" },
          { label: "Growth Rate", value: `${tech.growthRate}%`, icon: TrendingUp, color: "text-atin-green" },
          { label: "Outlook", value: tech.futureOutlook, icon: Target, color: tech.futureOutlook === "Growing" ? "text-atin-green" : "text-atin-yellow" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-atin-border bg-atin-bg2 p-4">
            <div className="flex items-center gap-2 text-xs text-atin-muted mb-2">
              <s.icon size={14} className={s.color} />
              {s.label}
            </div>
            <span className={cn("text-lg font-bold", s.color)}>{s.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {tech.prerequisites.length > 0 && (
          <div className="rounded-xl border border-atin-border bg-atin-bg2 p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">Prerequisites</h2>
            <div className="space-y-2">
              {tech.prerequisites.map(p => {
                const pTech = technologies.find(t => t.id === p);
                return (
                  <Link key={p} href={`/explorer/${p}`}
                    className="flex items-center gap-3 rounded-lg bg-atin-surface p-3 transition-colors hover:bg-atin-surface2">
                    <span>{pTech?.icon || "📚"}</span>
                    <div>
                      <span className="text-sm text-white">{pTech?.name || p}</span>
                      <span className="block text-xs text-atin-muted">{pTech?.category || "Technology"}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="rounded-xl border border-atin-border bg-atin-bg2 p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">Real-World Applications</h2>
          <div className="flex flex-wrap gap-2">
            {tech.applications.map(a => (
              <span key={a} className="rounded-lg bg-atin-surface px-3 py-2 text-sm text-atin-text">{a}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-atin-border bg-atin-bg2 p-5">
        <h2 className="mb-4 text-sm font-semibold text-white">Companies Using {tech.name}</h2>
        <div className="flex flex-wrap gap-2">
          {tech.companies.map(c => (
            <span key={c} className="rounded-lg border border-atin-border px-3 py-2 text-sm text-atin-muted">{c}</span>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-atin-border bg-atin-bg2 p-5">
        <h2 className="mb-4 text-sm font-semibold text-white">Knowledge Graph Connections ({rels.length})</h2>
        <div className="space-y-2">
          {rels.map((r, i) => {
            const isSource = r.source === tech.id;
            const otherId = isSource ? r.target : r.source;
            const other = technologies.find(t => t.id === otherId);
            if (!other) return null;
            return (
              <Link key={i} href={`/explorer/${other.id}`}
                className="flex items-center gap-3 rounded-lg bg-atin-surface p-3 transition-colors hover:bg-atin-surface2">
                <LinkIcon size={14} className="text-atin-muted" />
                <span className="text-xs text-atin-muted capitalize">{r.type.replace(/-/g, ' ')}</span>
                <div className="ml-auto flex items-center gap-2">
                  <span>{other.icon}</span>
                  <span className="text-sm text-white">{other.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {related.length > 0 && (
        <div className="rounded-xl border border-atin-border bg-atin-bg2 p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">Related Technologies</h2>
          <div className="grid grid-cols-2 gap-3">
            {related.map(r => (
              <Link key={r.id} href={`/explorer/${r.id}`}
                className="flex items-center gap-3 rounded-lg bg-atin-surface p-3 transition-colors hover:bg-atin-surface2">
                <span>{r.icon}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-white">{r.name}</span>
                  <span className="block text-xs text-atin-muted">{r.category}</span>
                </div>
                <span className={cn(
                  "text-[10px] font-medium",
                  r.difficulty === "Beginner" && "text-atin-green",
                  r.difficulty === "Intermediate" && "text-atin-yellow",
                  r.difficulty === "Advanced" && "text-atin-red"
                )}>{r.difficulty}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
