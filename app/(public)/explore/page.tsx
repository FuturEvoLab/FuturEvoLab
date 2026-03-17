"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/public/Navbar";
import Badge from "@/components/ui/Badge";
import { SavedPrompt } from "@/lib/db";
import { Copy, Heart, Image, Music, BookOpen } from "lucide-react";
import { timeAgo } from "@/lib/utils";

export default function ExplorePage() {
  const [prompts, setPrompts] = useState<SavedPrompt[]>([]);
  const [filter, setFilter] = useState<"all" | "image" | "music">("all");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const type = filter === "all" ? "" : `&type=${filter}`;
    fetch(`/api/prompts?limit=50${type}`)
      .then((r) => r.json())
      .then(({ prompts }) => {
        setPrompts(prompts);
        setLoading(false);
      });
  }, [filter]);

  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleLike = async (id: string) => {
    await fetch(`/api/prompts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ like: true }),
    });
    setPrompts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  return (
    <div className="min-h-screen grid-bg">
      <Navbar />

      <div className="pt-28 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
              <BookOpen size={18} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Explore Prompts</h1>
              <p className="text-sm text-gray-500">Community saved prompts</p>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            {(["all", "image", "music"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                  filter === f
                    ? "bg-violet-600/30 border border-violet-500/60 text-violet-200"
                    : "bg-gray-800 border border-gray-700 text-gray-400 hover:text-gray-200"
                }`}
              >
                {f === "image" && <Image size={12} className="inline mr-1.5" />}
                {f === "music" && <Music size={12} className="inline mr-1.5" />}
                {f}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-28 rounded-xl shimmer" />
              ))}
            </div>
          ) : prompts.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen size={48} className="text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500">No saved prompts yet.</p>
              <p className="text-sm text-gray-600 mt-1">Generate prompts and save them to see them here.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {prompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={prompt.type === "image" ? "purple" : "blue"}>
                          {prompt.type === "image" ? "Image" : "Music"}
                        </Badge>
                        <span className="text-xs text-gray-600">{timeAgo(prompt.createdAt)}</span>
                        {prompt.tags.map((tag) => (
                          <span key={tag} className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-300 font-medium mb-1">{prompt.title}</p>
                      <p className="text-xs text-gray-500 font-mono leading-relaxed line-clamp-2">
                        {prompt.prompt}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleLike(prompt.id)}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Heart size={14} />
                        {prompt.likes}
                      </button>
                      <button
                        onClick={() => handleCopy(prompt.id, prompt.prompt)}
                        className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                      >
                        <Copy size={14} className={copied === prompt.id ? "text-green-400" : ""} />
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
