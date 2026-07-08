"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Shield, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-atin-accent to-atin-accent2">
            <Shield size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Welcome back</h1>
          <p className="text-sm text-atin-muted">Sign in to your ATIN account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-atin-muted">Username</label>
            <input value={username} onChange={e => setUsername(e.target.value)}
              className="w-full rounded-lg border border-atin-border bg-atin-surface px-4 py-2.5 text-sm text-atin-text focus:border-atin-accent focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-atin-muted">Password</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                className="w-full rounded-lg border border-atin-border bg-atin-surface px-4 py-2.5 pr-10 text-sm text-atin-text focus:border-atin-accent focus:outline-none" />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-atin-muted hover:text-atin-text">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-atin-red">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full rounded-lg bg-atin-accent/10 py-2.5 text-sm font-medium text-atin-accent hover:bg-atin-accent/20 transition-colors disabled:opacity-50">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-atin-muted">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-atin-accent hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
