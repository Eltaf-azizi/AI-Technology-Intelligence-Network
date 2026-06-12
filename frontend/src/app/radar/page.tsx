"use client";

import { trends } from "@/lib/knowledge-graph";
import { Radar, TrendingUp, TrendingDown, Activity, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const stageColors: Record<string, string> = {
  "Emerging": "text-purple-400 bg-purple-400/10",
  "Growing": "text-green-400 bg-green-400/10",
  "Mature": "text-blue-400 bg-blue-400/10",
  "Declining": "text-red-400 bg-red-400/10",
};

export default function RadarPage() {
  const sortedByGrowth = [...trends].sort((a, b) => b.growth - a.growth);
  const sortedByMomentum = [...trends].sort((a, b) => b.momentum - a.momentum);
  const emerging = trends.filter(t => t.stage === "Emerging");
  const growing = trends.filter(t => t.stage === "Growing");
  const declining = trends.filter(t => t.stage === "Declining");

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center gap-3">
        <Radar size={24} className="text-atin-accent" />
        <div>
          <h1 className="text-xl font-bold text-white">Technology Radar</h1>
          <p className="text-sm text-atin-muted">Real-time technology intelligence and trend analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Technologies Tracked", value: trends.length, icon: Activity, color: "text-atin-accent" },
          { label: "Emerging Technologies", value: emerging.length, icon: Zap, color: "text-purple-400" },
          { label: "Declining Technologies", value: declining.length, icon: TrendingDown, color: "text-red-400" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-atin-border bg-atin-bg2 p-4">
            <div className="flex items-center gap-2 text-xs text-atin-muted mb-2">
              <s.icon size={14} className={s.color} />
              {s.label}
            </div>
            <span className={cn("text-2xl font-bold", s.color)}>{s.value}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-atin-border bg-atin-bg2 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
            <TrendingUp size={16} className="text-atin-green" />
            Fastest Growing
          </h2>
          <div className="space-y-2">
            {sortedByGrowth.slice(0, 8).map(t => (
              <div key={t.name} className="flex items-center justify-between rounded-lg bg-atin-surface p-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-white">{t.name}</span>
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px]", stageColors[t.stage])}>{t.stage}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-20 overflow-hidden rounded-full bg-atin-bg">
                    <div className="h-full rounded-full bg-atin-green" style={{ width: `${t.growth}%` }} />
                  </div>
                  <span className="text-xs font-medium text-atin-green">+{t.growth}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-atin-border bg-atin-bg2 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
            <Activity size={16} className="text-atin-yellow" />
            Highest Momentum
          </h2>
          <div className="space-y-2">
            {sortedByMomentum.slice(0, 8).map(t => (
              <div key={t.name} className="flex items-center justify-between rounded-lg bg-atin-surface p-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-white">{t.name}</span>
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px]", stageColors[t.stage])}>{t.stage}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-20 overflow-hidden rounded-full bg-atin-bg">
                    <div className="h-full rounded-full bg-atin-yellow" style={{ width: `${t.momentum}%` }} />
                  </div>
                  <span className="text-xs font-medium text-atin-yellow">{t.momentum}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-atin-border bg-atin-bg2 p-5">
          <h2 className="mb-4 text-sm font-semibold text-purple-400">Emerging</h2>
          <div className="space-y-2">
            {emerging.map(t => (
              <div key={t.name} className="rounded-lg bg-atin-surface p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">{t.name}</span>
                  <span className="text-xs text-atin-green">+{t.growth}%</span>
                </div>
                <span className="text-xs text-atin-muted">{t.category}</span>
              </div>
            ))}
            {emerging.length === 0 && <p className="text-sm text-atin-muted">No emerging technologies</p>}
          </div>
        </div>
        <div className="rounded-xl border border-atin-border bg-atin-bg2 p-5">
          <h2 className="mb-4 text-sm font-semibold text-atin-green">Growing</h2>
          <div className="space-y-2">
            {growing.map(t => (
              <div key={t.name} className="rounded-lg bg-atin-surface p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">{t.name}</span>
                  <span className="text-xs text-atin-green">+{t.growth}%</span>
                </div>
                <span className="text-xs text-atin-muted">{t.category}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-atin-border bg-atin-bg2 p-5">
          <h2 className="mb-4 text-sm font-semibold text-atin-red">Declining</h2>
          <div className="space-y-2">
            {declining.map(t => (
              <div key={t.name} className="rounded-lg bg-atin-surface p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">{t.name}</span>
                  <span className="text-xs text-atin-red">{t.growth}%</span>
                </div>
                <span className="text-xs text-atin-muted">{t.category}</span>
              </div>
            ))}
            {declining.length === 0 && <p className="text-sm text-atin-muted">No declining technologies</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
