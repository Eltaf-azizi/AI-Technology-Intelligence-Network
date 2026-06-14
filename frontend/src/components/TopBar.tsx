"use client";

import { Search, Menu } from "lucide-react";
import Link from "next/link";

export function TopBar() {
  return (
    <header className="flex h-14 items-center gap-4 border-b border-atin-border bg-atin-bg2/80 px-6 backdrop-blur-sm">
      <button className="lg:hidden text-atin-muted hover:text-atin-text">
        <Menu size={20} />
      </button>

      <div className="flex flex-1 items-center gap-2">
        <span className="text-xs text-atin-muted">ATIN v1.0</span>
        <span className="text-atin-muted">•</span>
        <span className="text-xs text-atin-green">System Online</span>
      </div>

      <Link
        href="/search"
        className="flex items-center gap-2 rounded-lg border border-atin-border bg-atin-surface px-4 py-1.5 text-sm text-atin-muted transition-colors hover:border-atin-accent/30 hover:text-atin-text"
      >
        <Search size={14} />
        <span>Search technologies...</span>
        <kbd className="ml-4 rounded border border-atin-border px-1.5 py-0.5 text-[10px]">Ctrl+K</kbd>
      </Link>
    </header>
  );
}
