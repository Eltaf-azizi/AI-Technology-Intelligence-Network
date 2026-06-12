"use client";

import { technologies } from "@/lib/knowledge-graph";
import { BookOpen, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const categories = [...new Set(technologies.map(t => t.category))];

export default function ExplorerListPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen size={24} className="text-atin-accent" />
        <div>
          <h1 className="text-xl font-bold text-white">Technology Explorer</h1>
          <p className="text-sm text-atin-muted">Browse all technologies in the knowledge graph</p>
        </div>
      </div>

      {categories.map(category => {
        const catTechs = technologies.filter(t => t.category === category);
        return (
          <div key={category} className="space-y-3">
            <h2 className="text-sm font-semibold text-white">{category}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {catTechs.map(t => (
                <Link
                  key={t.id}
                  href={`/explorer/${t.id}`}
                  className="group rounded-xl border border-atin-border bg-atin-bg2 p-4 transition-all hover:border-atin-accent/30"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-atin-surface">
                      <span className="text-lg">{t.icon}</span>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-white">{t.name}</span>
                      <span className="block text-[10px] text-atin-muted">{t.difficulty} • {t.learningTime}</span>
                    </div>
                  </div>
                  <p className="text-xs text-atin-muted line-clamp-2">{t.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] text-atin-green">+{t.growthRate}% growth</span>
                    <ArrowRight size={14} className="text-atin-muted opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
