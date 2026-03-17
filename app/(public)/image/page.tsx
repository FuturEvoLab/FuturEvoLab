"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/public/Navbar";
import PromptGenerator from "@/components/public/PromptGenerator";
import TemplateCard from "@/components/public/TemplateCard";
import { Template, Category } from "@/lib/db";
import { Image, Search, Filter } from "lucide-react";

function ImagePageContent() {
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
      fetch("/api/templates?type=image").then((r) => r.json()),
      fetch("/api/categories?type=image").then((r) => r.json()),
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
        prompt,
        title: activeTemplate?.title || "Image Prompt",
        type: "image",
        templateId: activeTemplate?.id || null,
        tags: activeTemplate?.tags || [],
        sessionId,
      }),
    });
    alert("Prompt saved successfully!");
  };

  return (
    <div className="min-h-screen grid-bg">
      <Navbar />

      <div className="pt-28 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                <Image size={18} className="text-violet-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Image Prompt Generator</h1>
                <p className="text-sm text-gray-500">For Midjourney, DALL-E, Stable Diffusion & more</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <aside className="w-full lg:w-80 flex-shrink-0 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-gray-900/60 border border-gray-800 text-gray-300 placeholder-gray-600 rounded-xl px-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
                <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeCategory === "all"
                      ? "bg-violet-600/30 border border-violet-500/60 text-violet-200"
                      : "bg-gray-800 border border-gray-700 text-gray-400 hover:text-gray-200"
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      activeCategory === cat.id
                        ? "bg-violet-600/30 border border-violet-500/60 text-violet-200"
                        : "bg-gray-800 border border-gray-700 text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>

              {/* Template list */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-24 rounded-xl shimmer" />
                  ))
                ) : filtered.length === 0 ? (
                  <p className="text-center text-gray-600 py-8 text-sm">No templates found</p>
                ) : (
                  filtered.map((t) => (
                    <TemplateCard
                      key={t.id}
                      template={t}
                      categoryName={categories.find((c) => c.id === t.categoryId)?.name}
                      onClick={() => setActiveTemplate(t)}
                      active={activeTemplate?.id === t.id}
                    />
                  ))
                )}
              </div>
            </aside>

            {/* Main generator */}
            <main className="flex-1">
              {activeTemplate ? (
                <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
                  <div className="mb-6 pb-5 border-b border-gray-800">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-white mb-1">{activeTemplate.title}</h2>
                        <p className="text-sm text-gray-500">{activeTemplate.description}</p>
                      </div>
                      <div className="flex gap-2 flex-wrap justify-end">
                        {activeTemplate.tags.map((tag) => (
                          <span key={tag} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <PromptGenerator template={activeTemplate} onSave={handleSave} />
                </div>
              ) : (
                <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-12 text-center">
                  <Image size={48} className="text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500">Select a template to get started</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ImagePage() {
  return (
    <Suspense>
      <ImagePageContent />
    </Suspense>
  );
}
