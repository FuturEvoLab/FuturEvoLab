"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/public/Navbar";
import Badge from "@/components/ui/Badge";
import { SavedPrompt } from "@/lib/db";
import { Copy, Heart, ImageIcon, Music, BookOpen, Check } from "lucide-react";
import { timeAgo } from "@/lib/utils";

export default function ExplorePage() {
  const [prompts, setPrompts] = useState<SavedPrompt[]>([]);
  const [filter, setFilter] = useState<"all" | "image" | "music">("all");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const type = filter === "all" ? "" : `&type=${filter}`;
    fetch(`/api/prompts?limit=50${type}`)
      .then(r => r.json())
      .then(({ prompts }) => { setPrompts(prompts); setLoading(false); });
  }, [filter]);

  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleLike = async (id: string) => {
    await fetch(`/api/prompts/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ like: true }) });
    setPrompts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  return (
    <div className="min-h-screen bg-black grid-bg">
      <Navbar />

      <div className="pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center">
              <BookOpen size={17} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Explore Prompts</h1>
              <p className="text-xs text-slate-600 font-mono tracking-wider">COMMUNITY SAVED PROMPTS</p>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            {(["all", "image", "music"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider border transition-all capitalize ${
                  filter === f
                    ? f === "music"
                      ? "bg-pink-500/12 border-pink-500/35 text-pink-300"
                      : "bg-cyan-500/12 border-cyan-500/35 text-cyan-300"
                    : "bg-black border-[#ffffff0a] text-slate-600 hover:text-slate-300 hover:border-[#ffffff15]"
                }`}>
                {f === "image" && <ImageIcon size={11} />}
                {f === "music" && <Music size={11} />}
                {f}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-24 rounded-xl shimmer" />)}
            </div>
          ) : prompts.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen size={40} className="text-slate-800 mx-auto mb-3" />
              <p className="text-slate-700 text-sm font-mono">NO PROMPTS SAVED YET</p>
              <p className="text-xs text-slate-800 mt-1 font-mono">Generate and save prompts to see them here.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {prompts.map((prompt) => (
                <div key={prompt.id}
                  className={`group relative bg-[#050508] rounded-xl p-4 border transition-all hover:-translate-y-px overflow-hidden ${
                    prompt.type === "image"
                      ? "border-[#00d4ff0d] hover:border-[#00d4ff25]"
                      : "border-[#f472b60d] hover:border-[#f472b625]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Badge variant={prompt.type === "image" ? "blue" : "pink"} className="text-[9px]">
                          {prompt.type}
                        </Badge>
                        <span className="text-[9px] text-slate-700 font-mono">{timeAgo(prompt.createdAt)}</span>
                        {prompt.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[9px] text-slate-700 bg-white/4 px-1.5 py-0.5 rounded font-mono">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-slate-300 font-medium mb-1">{prompt.title}</p>
                      <p className="text-[11px] text-slate-600 font-mono leading-relaxed line-clamp-2">
                        {prompt.prompt}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => handleLike(prompt.id)}
                        className="flex items-center gap-1 text-[10px] font-mono text-slate-600 hover:text-pink-400 transition-colors">
                        <Heart size={12} />
                        {prompt.likes}
                      </button>
                      <button onClick={() => handleCopy(prompt.id, prompt.prompt)}
                        className="p-1.5 rounded-lg bg-black/60 border border-[#ffffff0a] hover:border-[#00d4ff30] text-slate-500 hover:text-cyan-400 transition-all">
                        {copied === prompt.id ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
