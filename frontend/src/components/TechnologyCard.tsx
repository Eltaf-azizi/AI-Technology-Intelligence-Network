"use client";

import { Technology } from "@/lib/types";
import { getRelatedTechnologies } from "@/lib/knowledge-graph";
import {
  Clock, Signal, Briefcase, TrendingUp, BookOpen,
  ArrowRight, X, Target, HardDrive
} from "lucide-react";
import Link from "next/link";
import { getCategoryColor, cn } from "@/lib/utils";

interface TechnologyCardProps {
  technology: Technology;
  onClose: () => void;
}

export function TechnologyCard({ technology: t, onClose }: TechnologyCardProps) {
  const related = getRelatedTechnologies(t.id);

  return (
    <div className="animate-slide-in h-full overflow-y-auto rounded-xl border border-atin-border bg-atin-bg2">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-atin-border bg-atin-bg2/90 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ background: `${t.color}20` }}
          >
            <span className="text-lg">{t.icon}</span>
          </div>
          <div>
            <h2 className="font-bold text-white">{t.name}</h2>
            <span className="text-xs text-atin-muted">{t.category}</span>
          </div>
        </div>
        <button onClick={onClose} className="rounded-lg p-1.5 text-atin-muted hover:bg-atin-surface hover:text-white">
          <X size={18} />
        </button>
      </div>

      <div className="space-y-5 p-4">
        <p className="text-sm leading-relaxed text-atin-text">{t.description}</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-atin-surface p-3">
            <div className="flex items-center gap-1.5 text-xs text-atin-muted mb-1">
              <Signal size={12} />
              Difficulty
            </div>
            <span className={cn(
              "text-sm font-semibold",
              t.difficulty === "Beginner" && "text-atin-green",
              t.difficulty === "Intermediate" && "text-atin-yellow",
              t.difficulty === "Advanced" && "text-atin-red"
            )}>{t.difficulty}</span>
          </div>
          <div className="rounded-lg bg-atin-surface p-3">
            <div className="flex items-center gap-1.5 text-xs text-atin-muted mb-1">
              <Clock size={12} />
              Learning Time
            </div>
            <span className="text-sm font-semibold text-white">{t.learningTime}</span>
          </div>
          <div className="rounded-lg bg-atin-surface p-3">
            <div className="flex items-center gap-1.5 text-xs text-atin-muted mb-1">
              <TrendingUp size={12} />
              Growth
            </div>
            <span className="text-sm font-semibold text-atin-green">{t.growthRate}%</span>
          </div>
          <div className="rounded-lg bg-atin-surface p-3">
            <div className="flex items-center gap-1.5 text-xs text-atin-muted mb-1">
              <Target size={12} />
              Outlook
            </div>
            <span className={cn(
              "text-sm font-semibold",
              t.futureOutlook === "Growing" && "text-atin-green",
              t.futureOutlook === "Stable" && "text-atin-yellow",
              t.futureOutlook === "Declining" && "text-atin-red"
            )}>{t.futureOutlook}</span>
          </div>
        </div>

        {t.prerequisites.length > 0 && (
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-atin-muted">Required Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {t.prerequisites.map(p => {
                const prereq = related.find(r => r.id === p);
                return (
                  <Link
                    key={p}
                    href={`/explorer/${p}`}
                    className="rounded-full bg-atin-surface px-2.5 py-1 text-xs text-atin-accent hover:bg-atin-surface2 transition-colors"
                  >
                    {prereq?.name || p}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-atin-muted">Applications</h3>
          <div className="flex flex-wrap gap-1.5">
            {t.applications.map(a => (
              <span key={a} className="rounded-full bg-atin-surface px-2.5 py-1 text-xs text-atin-text">
                {a}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-atin-muted">Companies Using It</h3>
          <div className="flex flex-wrap gap-1.5">
            {t.companies.map(c => (
              <span key={c} className="rounded-lg bg-atin-surface px-2.5 py-1 text-xs text-atin-muted">
                {c}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-atin-muted">Related Technologies</h3>
            <Link
              href={`/explorer/${t.id}`}
              className="flex items-center gap-1 text-xs text-atin-accent hover:underline"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {related.slice(0, 5).map(r => (
              <Link
                key={r.id}
                href={`/explorer/${r.id}`}
                className="flex items-center gap-3 rounded-lg bg-atin-surface p-2.5 transition-colors hover:bg-atin-surface2"
              >
                <span>{r.icon}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-white">{r.name}</span>
                  <span className="block text-[10px] text-atin-muted">{r.category}</span>
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
      </div>
    </div>
  );
}
