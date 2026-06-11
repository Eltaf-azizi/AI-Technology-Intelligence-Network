"use client";

import { useState } from "react";
import { FileText, Upload, Search, BookOpen, Zap, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

const samplePapers = [
  { id: "1", title: "Attention Is All You Need", year: "2017", field: "NLP", summary: "Introduced the Transformer architecture, which became the foundation for modern LLMs like GPT and BERT." },
  { id: "2", title: "BERT: Pre-training of Deep Bidirectional Transformers", year: "2018", field: "NLP", summary: "Introduced bidirectional pre-training for language representations, achieving state-of-the-art results on 11 NLP tasks." },
  { id: "3", title: "Generative Adversarial Networks", year: "2014", field: "Computer Vision", summary: "Introduced a framework for training generative models through an adversarial process between a generator and discriminator." },
  { id: "4", title: "Deep Residual Learning for Image Recognition", year: "2015", field: "Computer Vision", summary: "Introduced residual learning to train very deep networks (152 layers), winning ILSVRC 2015." },
  { id: "5", title: "GPT-3: Language Models are Few-Shot Learners", year: "2020", field: "NLP", summary: "Demonstrated that scaling language models to 175B parameters enables few-shot learning across diverse tasks." },
  { id: "6", title: "RLHF: Training Language Models to Follow Instructions", year: "2022", field: "AI Safety", summary: "Showed how reinforcement learning from human feedback can align language models with user intent." },
];

export default function ResearchPage() {
  const [selectedPaper, setSelectedPaper] = useState<typeof samplePapers[0] | null>(null);
  const [dragOver, setDragOver] = useState(false);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <FileText size={24} className="text-atin-accent" />
        <div>
          <h1 className="text-xl font-bold text-white">Research Paper Analyzer</h1>
          <p className="text-sm text-atin-muted">Upload papers to extract technologies, concepts, and connections</p>
        </div>
      </div>

      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); }}
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all",
          dragOver ? "border-atin-accent bg-atin-accent/5" : "border-atin-border bg-atin-bg2"
        )}
      >
        <Upload size={32} className="mb-4 text-atin-muted" />
        <p className="text-sm text-atin-muted mb-1">Drag & drop a research paper here</p>
        <p className="text-xs text-atin-muted mb-4">or</p>
        <button className="rounded-lg bg-atin-accent/10 px-4 py-2 text-sm text-atin-accent hover:bg-atin-accent/20 transition-colors">
          Browse Files
        </button>
        <p className="mt-3 text-[10px] text-atin-muted">Supports PDF, TXT (max 10MB)</p>
      </div>

      <div>
        <h2 className="mb-4 text-sm font-semibold text-white">Sample Papers in Knowledge Graph</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {samplePapers.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPaper(selectedPaper?.id === p.id ? null : p)}
              className={cn(
                "rounded-xl border p-4 text-left transition-all",
                selectedPaper?.id === p.id
                  ? "border-atin-accent bg-atin-accent/5"
                  : "border-atin-border bg-atin-bg2 hover:border-atin-accent/30"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <FileText size={14} className="text-atin-muted" />
                <span className="text-xs text-atin-muted">{p.year} • {p.field}</span>
              </div>
              <span className="text-sm font-semibold text-white">{p.title}</span>
              <p className="mt-2 text-xs text-atin-muted line-clamp-2">{p.summary}</p>
            </button>
          ))}
        </div>
      </div>

      {selectedPaper && (
        <div className="animate-slide-in rounded-xl border border-atin-border bg-atin-bg2 p-6">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-white">{selectedPaper.title}</h2>
            <span className="text-sm text-atin-muted">{selectedPaper.year} • {selectedPaper.field}</span>
          </div>
          <p className="mb-6 text-sm text-atin-text leading-relaxed">{selectedPaper.summary}</p>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-atin-surface p-4">
              <div className="flex items-center gap-2 text-xs text-atin-muted mb-2">
                <Zap size={14} className="text-atin-accent" />
                Key Technologies
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-full bg-atin-bg px-2 py-1 text-xs text-atin-accent">Transformers</span>
                <span className="rounded-full bg-atin-bg px-2 py-1 text-xs text-atin-accent">Attention</span>
                <span className="rounded-full bg-atin-bg px-2 py-1 text-xs text-atin-accent">Deep Learning</span>
              </div>
            </div>
            <div className="rounded-lg bg-atin-surface p-4">
              <div className="flex items-center gap-2 text-xs text-atin-muted mb-2">
                <Brain size={14} className="text-atin-accent2" />
                Key Concepts
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-full bg-atin-bg px-2 py-1 text-xs text-atin-accent2">Self-Attention</span>
                <span className="rounded-full bg-atin-bg px-2 py-1 text-xs text-atin-accent2">Multi-Head</span>
                <span className="rounded-full bg-atin-bg px-2 py-1 text-xs text-atin-accent2">Positional Encoding</span>
              </div>
            </div>
            <div className="rounded-lg bg-atin-surface p-4">
              <div className="flex items-center gap-2 text-xs text-atin-muted mb-2">
                <Search size={14} className="text-atin-green" />
                Related Technologies
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-full bg-atin-bg px-2 py-1 text-xs text-atin-green">LLM Engineering</span>
                <span className="rounded-full bg-atin-bg px-2 py-1 text-xs text-atin-green">NLP</span>
                <span className="rounded-full bg-atin-bg px-2 py-1 text-xs text-atin-green">RAG</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
