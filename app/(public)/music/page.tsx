"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/public/Navbar";
import PromptGenerator from "@/components/public/PromptGenerator";
import TemplateCard from "@/components/public/TemplateCard";
import { Template, Category } from "@/lib/db";
import { Music, Search } from "lucide-react";

function MusicPageContent() {
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
    alert("Prompt saved!");
  };

  return (
    <div className="min-h-screen bg-black grid-bg">
      <Navbar />

      <div className="pt-28 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/25 flex items-center justify-center shadow-[0_0_15px_rgba(244,114,182,0.1)]">
              <Music size={18} className="text-pink-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Music Prompt Generator</h1>
              <p className="text-xs text-slate-600 font-mono tracking-wider">SUNO AI // UDIO // STABLE AUDIO</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-5">
            <aside className="w-full lg:w-72 flex-shrink-0 space-y-3">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-black border border-[#f472b612] text-slate-300 placeholder-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs font-mono focus:outline-none focus:border-[#f472b635] focus:shadow-[0_0_10px_rgba(244,114,182,0.08)] transition-all"
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider transition-all border ${
                    activeCategory === "all"
                      ? "bg-pink-500/15 border-pink-500/40 text-pink-300"
                      : "bg-black border-[#ffffff08] text-slate-600 hover:text-slate-300 hover:border-[#ffffff18]"
                  }`}
                >
                  ALL
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider transition-all border ${
                      activeCategory === cat.id
                        ? "bg-pink-500/15 border-pink-500/40 text-pink-300"
                        : "bg-black border-[#ffffff08] text-slate-600 hover:text-slate-300 hover:border-[#ffffff18]"
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
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
                        onClick={() => setActiveTemplate(t)}
                        active={activeTemplate?.id === t.id}
                      />
                    ))
                }
              </div>
            </aside>

            <main className="flex-1">
              {activeTemplate ? (
                <div className="bg-[#050508] border border-[#f472b615] rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(244,114,182,0.04)]">
                  <div className="px-6 py-4 border-b border-[#f472b60d] flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-base font-bold text-white">{activeTemplate.title}</h2>
                      <p className="text-xs text-slate-600 mt-0.5">{activeTemplate.description}</p>
                    </div>
                    <div className="flex gap-1 flex-wrap justify-end">
                      {activeTemplate.tags.map((tag) => (
                        <span key={tag} className="text-[9px] bg-white/4 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                          #{tag}
                        </span>
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
