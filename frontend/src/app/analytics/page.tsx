"use client";

import { technologies, relationships, careers } from "@/lib/knowledge-graph";
import { BarChart3, Layers, TrendingUp, Activity, Globe, Users, BookOpen } from "lucide-react";
import { cn, getCategoryColor } from "@/lib/utils";

const categories = [...new Set(technologies.map(t => t.category))];

export default function AnalyticsPage() {
  const categoryCounts = categories.map(cat => ({
    name: cat,
    count: technologies.filter(t => t.category === cat).length,
    avgGrowth: Math.round(technologies.filter(t => t.category === cat).reduce((s, t) => s + t.growthRate, 0) / technologies.filter(t => t.category === cat).length),
    avgPopularity: Math.round(technologies.filter(t => t.category === cat).reduce((s, t) => s + t.popularity, 0) / technologies.filter(t => t.category === cat).length),
  }));

  const topTech = [...technologies].sort((a, b) => b.popularity - a.popularity).slice(0, 10);
  const fastestGrowing = [...technologies].sort((a, b) => b.growthRate - a.growthRate).slice(0, 10);

  const difficultyDistribution = {
    Beginner: technologies.filter(t => t.difficulty === "Beginner").length,
    Intermediate: technologies.filter(t => t.difficulty === "Intermediate").length,
    Advanced: technologies.filter(t => t.difficulty === "Advanced").length,
  };

  const outlookDistribution = {
    Growing: technologies.filter(t => t.futureOutlook === "Growing").length,
    Stable: technologies.filter(t => t.futureOutlook === "Stable").length,
    Declining: technologies.filter(t => t.futureOutlook === "Declining").length,
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 size={24} className="text-atin-accent" />
        <div>
          <h1 className="text-xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-sm text-atin-muted">Data-driven insights into the technology ecosystem</p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {[
          { label: "Total Technologies", value: technologies.length, icon: Layers, color: "text-atin-accent", change: "+12 this month" },
          { label: "Connections", value: relationships.length, icon: Activity, color: "text-atin-green", change: "+28 this month" },
          { label: "Categories", value: categories.length, icon: BookOpen, color: "text-atin-accent2", change: "3 added" },
          { label: "Career Paths", value: careers.length, icon: Users, color: "text-atin-yellow", change: "5 active" },
          { label: "Trending", value: `${Math.round(technologies.filter(t => t.growthRate > 85).length / technologies.length * 100)}%`, icon: TrendingUp, color: "text-atin-green", change: "growing fast" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-atin-border bg-atin-bg2 p-4">
            <div className="flex items-center gap-2 text-xs text-atin-muted mb-1">
              <s.icon size={14} className={s.color} />
              {s.label}
            </div>
            <span className={cn("text-2xl font-bold", s.color)}>{s.value}</span>
            <span className="block text-[10px] text-atin-muted mt-1">{s.change}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-atin-border bg-atin-bg2 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
            <TrendingUp size={16} className="text-atin-green" />
            Top 10 by Popularity
          </h2>
          <div className="space-y-2">
            {topTech.map((t, i) => (
              <div key={t.id} className="flex items-center gap-3 rounded-lg bg-atin-surface p-3">
                <span className="w-5 text-xs font-bold text-atin-muted">{i + 1}</span>
                <span>{t.icon}</span>
                <span className="flex-1 text-sm text-white">{t.name}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-atin-bg">
                    <div className="h-full rounded-full bg-atin-accent" style={{ width: `${t.popularity}%` }} />
                  </div>
                  <span className="text-xs text-atin-muted">{t.popularity}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-atin-border bg-atin-bg2 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
            <Globe size={16} className="text-atin-green" />
            Fastest Growing Technologies
          </h2>
          <div className="space-y-2">
            {fastestGrowing.map((t, i) => (
              <div key={t.id} className="flex items-center gap-3 rounded-lg bg-atin-surface p-3">
                <span className="w-5 text-xs font-bold text-atin-muted">{i + 1}</span>
                <span>{t.icon}</span>
                <span className="flex-1 text-sm text-white">{t.name}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-atin-bg">
                    <div className="h-full rounded-full bg-atin-green" style={{ width: `${t.growthRate}%` }} />
                  </div>
                  <span className="text-xs text-atin-green">+{t.growthRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-atin-border bg-atin-bg2 p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">By Category</h2>
          <div className="space-y-2">
            {categoryCounts.map(c => (
              <div key={c.name} className="flex items-center justify-between rounded-lg bg-atin-surface p-3">
                <span className="text-sm text-white">{c.name}</span>
                <span className="text-xs text-atin-muted">{c.count} technologies</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-atin-border bg-atin-bg2 p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">By Difficulty</h2>
          <div className="space-y-3">
            {Object.entries(difficultyDistribution).map(([level, count]) => (
              <div key={level} className="rounded-lg bg-atin-surface p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white">{level}</span>
                  <span className="text-xs text-atin-muted">{count} technologies</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-atin-bg">
                  <div className={cn(
                    "h-full rounded-full transition-all",
                    level === "Beginner" && "bg-atin-green",
                    level === "Intermediate" && "bg-atin-yellow",
                    level === "Advanced" && "bg-atin-red"
                  )} style={{ width: `${(count / technologies.length) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-atin-border bg-atin-bg2 p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">Future Outlook</h2>
          <div className="space-y-3">
            {Object.entries(outlookDistribution).map(([outlook, count]) => (
              <div key={outlook} className="rounded-lg bg-atin-surface p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white">{outlook}</span>
                  <span className="text-xs text-atin-muted">{count} technologies</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-atin-bg">
                  <div className={cn(
                    "h-full rounded-full transition-all",
                    outlook === "Growing" && "bg-atin-green",
                    outlook === "Stable" && "bg-atin-yellow",
                    outlook === "Declining" && "bg-atin-red"
                  )} style={{ width: `${(count / technologies.length) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
