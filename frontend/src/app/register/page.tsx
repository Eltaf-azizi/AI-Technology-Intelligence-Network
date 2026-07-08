"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { UserPlus, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-atin-accent to-atin-accent2">
            <UserPlus size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Create account</h1>
          <p className="text-sm text-atin-muted">Join the ATIN intelligence network</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {["username", "email", "password", "confirm"].map((field) => (
            <div key={field}>
              <label className="mb-1 block text-xs text-atin-muted capitalize">
                {field === "confirm" ? "Confirm Password" : field}
              </label>
              {field === "password" || field === "confirm" ? (
                <div className="relative">
                  <input type={showPw ? "text" : "password"}
                    value={(form as any)[field]}
                    onChange={e => setForm({ ...form, [field]: e.target.value })}
                    className="w-full rounded-lg border border-atin-border bg-atin-surface px-4 py-2.5 pr-10 text-sm text-atin-text focus:border-atin-accent focus:outline-none" />
                  {field === "password" && (
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-atin-muted hover:text-atin-text">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
              ) : (
                <input type={field === "email" ? "email" : "text"}
                  value={(form as any)[field]}
                  onChange={e => setForm({ ...form, [field]: e.target.value })}
                  className="w-full rounded-lg border border-atin-border bg-atin-surface px-4 py-2.5 text-sm text-atin-text focus:border-atin-accent focus:outline-none" />
              )}
            </div>
          ))}

          {error && <p className="text-sm text-atin-red">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full rounded-lg bg-atin-accent/10 py-2.5 text-sm font-medium text-atin-accent hover:bg-atin-accent/20 transition-colors disabled:opacity-50">
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-atin-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-atin-accent hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
