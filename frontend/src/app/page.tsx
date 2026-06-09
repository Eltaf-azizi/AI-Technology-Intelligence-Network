"use client";

import { useState } from "react";
import { KnowledgeGraph } from "@/components/KnowledgeGraph";
import { TechnologyCard } from "@/components/TechnologyCard";
import { technologies as techData } from "@/lib/knowledge-graph";
import { Technology } from "@/lib/types";
import { BookOpen, TrendingUp, Layers, Bot } from "lucide-react";

const stats = [
  { label: "Technologies", value: techData.length, icon: Layers, color: "text-atin-accent" },
  { label: "Relationships", value: "47+", icon: BookOpen, color: "text-atin-accent2" },
  { label: "Learning Paths", value: "7", icon: TrendingUp, color: "text-atin-green" },
  { label: "AI Agents", value: "5", icon: Bot, color: "text-atin-yellow" },
];

export default function HomePage() {
  const [selectedTech, setSelectedTech] = useState<Technology | null>(null);

  return (
    <div className="flex h-full gap-6">
      <div className="flex flex-1 flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Technology Network</h1>
            <p className="text-sm text-atin-muted">Explore the connected technology ecosystem</p>
          </div>
          <div className="flex gap-2">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="glass flex items-center gap-2 rounded-lg px-3 py-2">
                  <Icon size={14} className={stat.color} />
                  <div>
                    <span className="text-xs font-bold text-white">{stat.value}</span>
                    <span className="ml-1 text-[10px] text-atin-muted">{stat.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative flex-1 overflow-hidden rounded-xl border border-atin-border bg-atin-bg2/50">
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="relative h-full">
            <KnowledgeGraph
              onSelectTechnology={setSelectedTech}
              selectedId={selectedTech?.id}
            />
          </div>
          <div className="absolute bottom-3 left-3 flex gap-2">
            <span className="rounded-full bg-atin-surface/80 px-2.5 py-1 text-[10px] text-atin-muted backdrop-blur-sm">
              Drag to explore • Click a node for details
            </span>
          </div>
          <div className="absolute bottom-3 right-3 flex gap-2">
            <span className="rounded-full bg-atin-surface/80 px-2.5 py-1 text-[10px] text-atin-muted backdrop-blur-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-atin-green mr-1" />
              All systems operational
            </span>
          </div>
        </div>
      </div>

      {selectedTech && (
        <div className="w-96 shrink-0">
          <TechnologyCard
            technology={selectedTech}
            onClose={() => setSelectedTech(null)}
          />
        </div>
      )}
    </div>
  );
}
