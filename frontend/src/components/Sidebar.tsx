"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Radar, BookOpen, Brain, Route, Globe, Briefcase,
  BarChart3, Search, Shield, GitCompare, FileText, LogIn, User
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Technology Network", icon: Globe },
  { href: "/radar", label: "Technology Radar", icon: Radar },
  { href: "/explorer", label: "Explorer", icon: BookOpen },
  { href: "/mentor", label: "AI Mentor", icon: Brain },
  { href: "/learning-path", label: "Learning Paths", icon: Route },
  { href: "/career", label: "Career Intelligence", icon: Briefcase },
  { href: "/compare", label: "Compare", icon: GitCompare },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/research", label: "Research Papers", icon: FileText },
  { href: "/search", label: "Search", icon: Search },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-atin-border bg-atin-bg2">
      <Link href="/" className="flex items-center gap-3 border-b border-atin-border px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-atin-accent to-atin-accent2">
          <span className="text-sm font-bold text-white">A</span>
        </div>
        <div>
          <span className="text-sm font-bold text-white">ATIN</span>
          <span className="block text-[10px] text-atin-muted">Intelligence Network</span>
        </div>
      </Link>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                isActive
                  ? "bg-atin-accent/10 text-atin-accent"
                  : "text-atin-muted hover:bg-atin-surface hover:text-atin-text"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-atin-border p-4 space-y-2">
        {user ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3 rounded-lg bg-atin-surface p-3">
              <User size={16} className="text-atin-accent" />
              <div className="min-w-0 flex-1">
                <span className="block text-xs text-white truncate">{user.username}</span>
                <span className="block text-[10px] text-atin-muted truncate">{user.email}</span>
              </div>
            </div>
            <button onClick={logout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs text-atin-muted hover:bg-atin-surface hover:text-atin-text transition-all">
              <LogIn size={14} className="rotate-180" />
              Sign out
            </button>
          </div>
        ) : (
          <Link href="/login"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-atin-muted hover:bg-atin-surface hover:text-atin-text transition-all">
            <LogIn size={18} />
            Sign in
          </Link>
        )}
      </div>
    </aside>
  );
}
