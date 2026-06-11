"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, ArrowRight } from "lucide-react";
import { searchTechnologies, technologies } from "@/lib/knowledge-graph";
import { Technology } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

const categories = [...new Set(technologies.map(t => t.category))];
const difficulties = ["Beginner", "Intermediate", "Advanced"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Technology[]>(technologies);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");

  const performSearch = useCallback(() => {
    let filtered = query ? searchTechnologies(query) : technologies;
    if (selectedCategory) filtered = filtered.filter(t => t.category === selectedCategory);
    if (selectedDifficulty) filtered = filtered.filter(t => t.difficulty === selectedDifficulty);
    setResults(filtered);
  }, [query, selectedCategory, selectedDifficulty]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Search size={24} className="text-atin-accent" />
        <div>
          <h1 className="text-xl font-bold text-white">Search Technologies</h1>
          <p className="text-sm text-atin-muted">Find any technology in the knowledge graph</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-atin-muted" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, description, category, or application..."
            className="w-full rounded-xl border border-atin-border bg-atin-bg2 py-3 pl-10 pr-4 text-sm text-atin-text placeholder:text-atin-muted focus:border-atin-accent focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory("")}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs transition-all",
            !selectedCategory ? "bg-atin-accent text-white" : "bg-atin-surface text-atin-muted hover:text-atin-text"
          )}
        >
          All Categories
        </button>
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c === selectedCategory ? "" : c)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs transition-all",
              selectedCategory === c ? "bg-atin-accent text-white" : "bg-atin-surface text-atin-muted hover:text-atin-text"
            )}
          >
            {c}
          </button>
        ))}
        <div className="w-px bg-atin-border mx-1" />
        {difficulties.map(d => (
          <button
            key={d}
            onClick={() => setSelectedDifficulty(d === selectedDifficulty ? "" : d)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs transition-all",
              selectedDifficulty === d ? "bg-atin-accent text-white" : "bg-atin-surface text-atin-muted hover:text-atin-text"
            )}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="text-sm text-atin-muted">
        {results.length} result{results.length !== 1 ? "s" : ""}
      </div>

      <div className="grid gap-3">
        {results.map(t => (
          <Link
            key={t.id}
            href={`/explorer/${t.id}`}
            className="group flex items-center gap-4 rounded-xl border border-atin-border bg-atin-bg2 p-4 transition-all hover:border-atin-accent/30"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-atin-surface">
              <span className="text-xl">{t.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">{t.name}</span>
                <span className="text-[10px] text-atin-muted">{t.category}</span>
              </div>
              <p className="mt-0.5 text-xs text-atin-muted line-clamp-1">{t.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn(
                "text-[10px] font-medium",
                t.difficulty === "Beginner" && "text-atin-green",
                t.difficulty === "Intermediate" && "text-atin-yellow",
                t.difficulty === "Advanced" && "text-atin-red"
              )}>{t.difficulty}</span>
              <ArrowRight size={14} className="text-atin-muted opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </Link>
        ))}
        {results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-atin-muted">
            <Search size={48} className="mb-4 opacity-30" />
            <p className="text-lg">No technologies found</p>
            <p className="text-sm">Try a different search term or filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
