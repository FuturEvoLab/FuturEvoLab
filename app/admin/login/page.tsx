"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Zap, Eye, EyeOff, Terminal } from "lucide-react";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      email: form.email, password: form.password, redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("ACCESS DENIED — Invalid credentials");
    } else {
      router.push("/admin/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-black grid-bg-hero flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow orbs */}
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-cyan-500/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-fuchsia-500/6 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="relative w-14 h-14 mx-auto mb-5">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-fuchsia-600 rounded-2xl opacity-20 blur-lg scale-125" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-fuchsia-600 flex items-center justify-center">
              <Zap size={22} className="text-black" strokeWidth={2.5} />
            </div>
          </div>
          <div className="font-mono text-[10px] text-slate-600 tracking-widest uppercase mb-1">
            FuturEvoLab // Control Panel
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Admin <span className="gradient-text">Access</span>
          </h1>
        </div>

        {/* Card */}
        <div className="relative bg-[#05050d] border border-[#00d4ff18] rounded-2xl p-6 shadow-[0_0_40px_rgba(0,212,255,0.06)] overflow-hidden">
          {/* Top glow line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          {/* Bottom glow line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-fuchsia-500/30 to-transparent" />

          {/* Default credentials hint */}
          <div className="flex items-start gap-2 mb-5 px-3 py-2.5 bg-[#00d4ff06] border border-[#00d4ff15] rounded-lg">
            <Terminal size={12} className="text-cyan-600 mt-0.5 flex-shrink-0" />
            <div className="font-mono text-[10px] text-slate-600 leading-relaxed">
              <span className="text-cyan-700">$</span> default credentials<br />
              <span className="text-slate-500">admin@futuroevolab.com</span> / <span className="text-slate-500">admin123456</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                Email <span className="text-cyan-700">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="admin@futuroevolab.com"
                required
                autoComplete="email"
                className="w-full bg-black border border-[#00d4ff15] text-slate-200 placeholder-slate-700 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-[#00d4ff45] focus:shadow-[0_0_15px_rgba(0,212,255,0.12)] transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                Password <span className="text-cyan-700">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-black border border-[#00d4ff15] text-slate-200 placeholder-slate-700 rounded-lg px-3 py-2.5 pr-10 text-sm font-mono focus:outline-none focus:border-[#00d4ff45] focus:shadow-[0_0_15px_rgba(0,212,255,0.12)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-700 hover:text-cyan-400 transition-colors"
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-3 py-2 bg-red-500/8 border border-red-500/25 rounded-lg font-mono text-xs text-red-400">
                ⚠ {error}
              </div>
            )}

            <Button type="submit" className="w-full mt-2" size="lg" loading={loading}>
              <Zap size={14} />
              {loading ? "Authenticating..." : "Sign In"}
            </Button>
          </form>
        </div>

        <p className="text-center text-[10px] text-slate-700 mt-4 font-mono tracking-wider">
          FUTUROEVOLAB // SECURE ADMIN PANEL
        </p>
      </div>
    </div>
  );
}
