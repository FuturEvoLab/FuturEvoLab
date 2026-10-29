"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/public/Navbar";
import PromptGenerator from "@/components/public/PromptGenerator";
import TemplateCard from "@/components/public/TemplateCard";
import { useToast } from "@/components/ui/Toast";
import { Template, Category } from "@/lib/db";
import { Music, Search, X } from "lucide-react";

function MusicPageContent() {
  const { success } = useToast();
  const searchParams = useSearchParams();
  const initialTemplateId = searchParams.get("template");

  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/templates?type=music").then((r) => r.json()),
      fetch("/api/categories?type=music").then((r) => r.json()),
    ]).then(([t, c]) => {
      setTemplates(t);
      setCategories(c);
      if (initialTemplateId) {
        const found = t.find((tmpl: Template) => tmpl.id === initialTemplateId);
        if (found) setActiveTemplate(found);
      } else if (t.length > 0) {
        setActiveTemplate(t[0]);
      }
      setLoading(false);
    });
  }, [initialTemplateId]);

  // Sync active template to URL for AdminFloatingBar deep-link
  const selectTemplate = (t: Template) => {
    setActiveTemplate(t);
    const url = new URL(window.location.href);
    url.searchParams.set("template", t.id);
    window.history.replaceState({}, "", url.toString());
  };

  // Count templates per category
  const categoryCounts: Record<string, number> = {};
  for (const t of templates) categoryCounts[t.categoryId] = (categoryCounts[t.categoryId] || 0) + 1;

  const filtered = templates.filter((t) => {
    const matchCat = activeCategory === "all" || t.categoryId === activeCategory;
    const matchSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const handleSave = async (prompt: string) => {
    const sessionId = sessionStorage.getItem("promptSessionId") || crypto.randomUUID();
    sessionStorage.setItem("promptSessionId", sessionId);
    await fetch("/api/prompts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt, title: activeTemplate?.title || "Music Prompt",
        type: "music", templateId: activeTemplate?.id || null,
        tags: activeTemplate?.tags || [], sessionId,
      }),
    });
    success("Prompt saved to your collection!");
  };

  const activeCategory_ = categories.find((c) => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-black grid-bg">
      <Navbar />

      <div className="pt-28 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/25 flex items-center justify-center shadow-[0_0_15px_rgba(244,114,182,0.1)]">
              <Music size={18} className="text-pink-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Music Prompt Generator</h1>
              <p className="text-xs text-slate-600 font-mono tracking-wider">SUNO AI // UDIO // STABLE AUDIO</p>
            </div>
          </div>

          {/* Category tabs row */}
          {!loading && categories.length > 0 && (
            <div className="mb-5 -mx-1 px-1">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                    activeCategory === "all"
                      ? "bg-pink-500/12 border-pink-500/40 text-pink-300 shadow-[0_0_12px_rgba(244,114,182,0.1)]"
                      : "bg-[#050508] border-[#ffffff08] text-slate-500 hover:text-slate-300 hover:border-[#ffffff18]"
                  }`}
                >
                  <span className="text-base leading-none">🎵</span>
                  <span>All</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                    activeCategory === "all"
                      ? "bg-pink-500/20 text-pink-300"
                      : "bg-white/6 text-slate-600"
                  }`}>{templates.length}</span>
                </button>
                {categories.map((cat) => {
                  const count = categoryCounts[cat.id] || 0;
                  const active = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                        active
                          ? "bg-pink-500/12 border-pink-500/40 text-pink-300 shadow-[0_0_12px_rgba(244,114,182,0.1)]"
                          : "bg-[#050508] border-[#ffffff08] text-slate-500 hover:text-slate-300 hover:border-[#ffffff18]"
                      }`}
                    >
                      <span className="text-base leading-none">{cat.icon}</span>
                      <span>{cat.name}</span>
                      {count > 0 && (
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                          active ? "bg-pink-500/20 text-pink-300" : "bg-white/6 text-slate-600"
                        }`}>{count}</span>
                      )}
                    </button>
                  );
                })}
              </div>
              {activeCategory_ && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-px flex-1 bg-[#f472b60a]" />
                  <span className="text-[10px] font-mono text-slate-700 uppercase tracking-widest">{activeCategory_.description}</span>
                  <div className="h-px flex-1 bg-[#f472b60a]" />
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-5">
            {/* Sidebar */}
            <aside className="w-full lg:w-72 flex-shrink-0 space-y-3">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-black border border-[#f472b612] text-slate-300 placeholder-slate-700 rounded-lg pl-9 pr-8 py-2 text-xs font-mono focus:outline-none focus:border-[#f472b635] focus:shadow-[0_0_10px_rgba(244,114,182,0.08)] transition-all"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors">
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Results count */}
              <div className="flex items-center justify-between px-0.5">
                <span className="text-[10px] font-mono text-slate-700 uppercase tracking-widest">
                  {loading ? "Loading…" : `${filtered.length} template${filtered.length !== 1 ? "s" : ""}`}
                </span>
                {(search || activeCategory !== "all") && (
                  <button
                    onClick={() => { setSearch(""); setActiveCategory("all"); }}
                    className="text-[10px] font-mono text-pink-700 hover:text-pink-400 transition-colors flex items-center gap-1"
                  >
                    <X size={9} /> Clear filters
                  </button>
                )}
              </div>

              <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-0.5">
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 rounded-xl shimmer" />)
                  : filtered.length === 0
                  ? <p className="text-center text-slate-700 py-8 text-xs font-mono">NO TEMPLATES FOUND</p>
                  : filtered.map((t) => (
                      <TemplateCard
                        key={t.id}
                        template={t}
                        categoryName={categories.find((c) => c.id === t.categoryId)?.name}
                        categoryIcon={categories.find((c) => c.id === t.categoryId)?.icon}
                        onClick={() => selectTemplate(t)}
                        active={activeTemplate?.id === t.id}
                      />
                    ))
                }
              </div>
            </aside>

            {/* Generator */}
            <main className="flex-1 min-w-0">
              {activeTemplate ? (
                <div className="bg-[#050508] border border-[#f472b615] rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(244,114,182,0.04)]">
                  <div className="px-6 py-4 border-b border-[#f472b60d]">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h2 className="text-base font-bold text-white">{activeTemplate.title}</h2>
                        <p className="text-xs text-slate-600 mt-0.5">{activeTemplate.description}</p>
                      </div>
                      {(() => {
                        const cat = categories.find((c) => c.id === activeTemplate.categoryId);
                        return cat ? (
                          <button
                            onClick={() => setActiveCategory(cat.id)}
                            className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 bg-pink-500/8 border border-pink-500/20 rounded-lg text-[10px] font-mono text-pink-600 hover:text-pink-300 hover:border-pink-500/40 transition-all"
                          >
                            <span>{cat.icon}</span>
                            <span className="uppercase tracking-wider">{cat.name}</span>
                          </button>
                        ) : null;
                      })()}
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {activeTemplate.tags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setSearch(tag)}
                          className="text-[9px] bg-white/4 hover:bg-pink-500/10 hover:text-pink-400 text-slate-600 px-1.5 py-0.5 rounded font-mono transition-colors cursor-pointer"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="p-6">
                    <PromptGenerator template={activeTemplate} onSave={handleSave} />
                  </div>
                </div>
              ) : (
                <div className="bg-[#050508] border border-[#f472b60d] rounded-2xl p-16 text-center">
                  <Music size={40} className="text-slate-800 mx-auto mb-3" />
                  <p className="text-slate-700 text-sm font-mono">SELECT A TEMPLATE TO BEGIN</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MusicPage() {
  return <Suspense><MusicPageContent /></Suspense>;
}
