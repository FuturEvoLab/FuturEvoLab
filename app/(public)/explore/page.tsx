"use client";
import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/public/Navbar";
import Badge from "@/components/ui/Badge";
import { SavedPrompt, PromptCollection } from "@/lib/db";
import {
  Copy, Heart, ImageIcon, Music, BookOpen, Check, Star,
  Archive, StickyNote, Search, X, Plus, FolderOpen,
  ChevronRight, Inbox, Tag, Layers
} from "lucide-react";
import { timeAgo } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

interface CollectionWithCount extends PromptCollection { count: number; }

type View = "all" | "starred" | "archived" | string; // string = collection id

export default function ExplorePage() {
  const { success, toast } = useToast();
  const [prompts, setPrompts] = useState<SavedPrompt[]>([]);
  const [collections, setCollections] = useState<CollectionWithCount[]>([]);
  const [view, setView] = useState<View>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "music">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [noteOpen, setNoteOpen] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  const fetchPrompts = useCallback(() => {
    fetch("/api/prompts?limit=200")
      .then(r => r.json())
      .then(({ prompts }) => { setPrompts(prompts || []); setLoading(false); });
  }, []);

  const fetchCollections = useCallback(() => {
    fetch("/api/collections").then(r => r.json()).then(data => setCollections(data || []));
  }, []);

  useEffect(() => { fetchPrompts(); fetchCollections(); }, [fetchPrompts, fetchCollections]);

  // ── Filtering ─────────────────────────────────────────────────────────────
  const visible = prompts.filter(p => {
    if (view === "starred") return p.starred;
    if (view === "archived") return p.archived;
    if (view !== "all") {
      // collection view — resolve inline
      const col = collections.find(c => c.id === view);
      if (col?.type === "smart") {
        if (col.query === "starred") return p.starred && !p.archived;
        if (col.query === "type:image") return p.type === "image" && !p.archived;
        if (col.query === "type:music") return p.type === "music" && !p.archived;
        if (col.query.startsWith("tag:")) return p.tags.includes(col.query.slice(4)) && !p.archived;
      } else if (col?.type === "manual") {
        return col.promptIds.includes(p.id) && !p.archived;
      }
    }
    return !p.archived;
  }).filter(p => {
    if (typeFilter !== "all" && p.type !== typeFilter) return false;
    if (tagFilter && !p.tags.includes(tagFilter)) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.prompt.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q));
    }
    return true;
  });

  // All tags from non-archived prompts
  const tagCloud = Object.entries(
    prompts.filter(p => !p.archived).flatMap(p => p.tags).reduce((acc, t) => {
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]).slice(0, 20);

  // ── Actions ───────────────────────────────────────────────────────────────
  const toggleStar = async (p: SavedPrompt) => {
    await fetch(`/api/prompts/${p.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ starred: !p.starred }) });
    setPrompts(prev => prev.map(x => x.id === p.id ? { ...x, starred: !x.starred } : x));
    toast("success", p.starred ? "Removed from starred" : "Added to starred");
    fetchCollections();
  };

  const toggleArchive = async (p: SavedPrompt) => {
    await fetch(`/api/prompts/${p.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ archived: !p.archived }) });
    setPrompts(prev => prev.map(x => x.id === p.id ? { ...x, archived: !x.archived } : x));
    toast("info", p.archived ? "Unarchived" : "Archived");
  };

  const handleLike = async (p: SavedPrompt) => {
    await fetch(`/api/prompts/${p.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ like: true }) });
    setPrompts(prev => prev.map(x => x.id === p.id ? { ...x, likes: x.likes + 1 } : x));
  };

  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    success("Copied to clipboard");
    setTimeout(() => setCopied(null), 2000);
  };

  const openNote = (p: SavedPrompt) => { setNoteOpen(p.id); setNoteText(p.note || ""); };
  const saveNote = async (id: string) => {
    await fetch(`/api/prompts/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ note: noteText }) });
    setPrompts(prev => prev.map(x => x.id === id ? { ...x, note: noteText } : x));
    setNoteOpen(null);
    success("Note saved");
  };

  const nonArchived = prompts.filter(p => !p.archived);
  const starredCount = prompts.filter(p => p.starred && !p.archived).length;

  // ── Sidebar label ─────────────────────────────────────────────────────────
  const viewLabel = view === "all" ? "All Prompts"
    : view === "starred" ? "Starred"
    : view === "archived" ? "Archived"
    : (collections.find(c => c.id === view)?.name ?? "Collection");

  return (
    <div className="min-h-screen bg-black grid-bg">
      <Navbar />

      <div className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto flex gap-5">

          {/* ── Sidebar ───────────────────────────────────────────────────── */}
          <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 gap-1 pt-8">
            {/* Search */}
            <div className="relative mb-3">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search prompts…"
                className="w-full bg-[#050508] border border-[#00d4ff12] text-slate-300 placeholder-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-[11px] font-mono focus:outline-none focus:border-[#00d4ff35] transition-all" />
              {search && <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300"><X size={11} /></button>}
            </div>

            {/* Views */}
            <p className="text-[9px] font-mono text-slate-700 uppercase tracking-widest px-2 mb-1">// Views</p>
            {[
              { id: "all", icon: Inbox, label: "All Prompts", count: nonArchived.length },
              { id: "starred", icon: Star, label: "Starred", count: starredCount },
            ].map(({ id, icon: Icon, label, count }) => (
              <button key={id} onClick={() => { setView(id as View); setTagFilter(null); }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all ${view === id
                  ? "bg-[#00d4ff0d] text-cyan-300 border border-[#00d4ff20]"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/4"}`}>
                <Icon size={12} className={view === id ? "text-cyan-400" : "text-slate-600"} />
                <span className="flex-1 text-left">{label}</span>
                <span className="text-[10px] font-mono text-slate-700">{count}</span>
              </button>
            ))}

            <button onClick={() => { setView("archived"); setTagFilter(null); }}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all ${view === "archived"
                ? "bg-white/6 text-slate-300 border border-[#ffffff15]"
                : "text-slate-700 hover:text-slate-500 hover:bg-white/2"}`}>
              <Archive size={12} />
              <span className="flex-1 text-left">Archived</span>
              <span className="text-[10px] font-mono text-slate-700">{prompts.filter(p => p.archived).length}</span>
            </button>

            {/* Collections */}
            {collections.length > 0 && (
              <>
                <div className="h-px bg-[#00d4ff08] my-2" />
                <p className="text-[9px] font-mono text-slate-700 uppercase tracking-widest px-2 mb-1">// Collections</p>
                {collections.map(col => (
                  <button key={col.id} onClick={() => { setView(col.id); setTagFilter(null); }}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all ${view === col.id
                      ? "bg-[#00d4ff0d] text-cyan-300 border border-[#00d4ff20]"
                      : "text-slate-500 hover:text-slate-300 hover:bg-white/4"}`}>
                    <span className="text-sm leading-none flex-shrink-0">{col.icon}</span>
                    <span className="flex-1 text-left truncate">{col.name}</span>
                    <span className="text-[10px] font-mono text-slate-700 flex-shrink-0">{col.count}</span>
                  </button>
                ))}
              </>
            )}

            {/* Tag cloud */}
            {tagCloud.length > 0 && (
              <>
                <div className="h-px bg-[#00d4ff08] my-2" />
                <p className="text-[9px] font-mono text-slate-700 uppercase tracking-widest px-2 mb-1.5">// Tags</p>
                <div className="flex flex-wrap gap-1 px-1">
                  {tagCloud.map(([tag, count]) => (
                    <button key={tag} onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
                      className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono transition-all border ${tagFilter === tag
                        ? "bg-cyan-500/15 border-cyan-500/35 text-cyan-300"
                        : "bg-white/4 border-transparent text-slate-600 hover:text-slate-300 hover:border-[#ffffff15]"}`}>
                      #{tag}
                      <span className="text-slate-700">{count}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Type filter */}
            <div className="h-px bg-[#00d4ff08] my-2" />
            <p className="text-[9px] font-mono text-slate-700 uppercase tracking-widest px-2 mb-1">// Type</p>
            <div className="flex gap-1 px-1">
              {(["all", "image", "music"] as const).map(t => (
                <button key={t} onClick={() => setTypeFilter(t)}
                  className={`flex-1 px-1.5 py-1 rounded-md text-[9px] font-mono uppercase tracking-wider border transition-all ${typeFilter === t
                    ? t === "music" ? "bg-pink-500/12 border-pink-500/35 text-pink-300" : "bg-cyan-500/12 border-cyan-500/35 text-cyan-300"
                    : "bg-black border-[#ffffff0a] text-slate-600 hover:text-slate-400"}`}>
                  {t}
                </button>
              ))}
            </div>
          </aside>

          {/* ── Main ──────────────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-5 pt-8">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600 mb-1">
                  {view !== "all" && (
                    <>
                      <button onClick={() => setView("all")} className="hover:text-slate-400 transition-colors">All</button>
                      <ChevronRight size={10} />
                    </>
                  )}
                  <span className="text-slate-400">{viewLabel}</span>
                  {tagFilter && <><ChevronRight size={10} /><span className="text-cyan-500">#{tagFilter}</span></>}
                </div>
                <h1 className="text-xl font-black text-white tracking-tight">
                  {viewLabel}
                  <span className="ml-2 text-sm font-mono font-normal text-slate-600">({visible.length})</span>
                </h1>
              </div>

              {/* Mobile filters */}
              <div className="flex lg:hidden gap-1.5">
                {(["all", "image", "music"] as const).map(t => (
                  <button key={t} onClick={() => setTypeFilter(t)}
                    className={`px-2.5 py-1 rounded-md text-[9px] font-mono uppercase border transition-all ${typeFilter === t
                      ? "bg-cyan-500/12 border-cyan-500/35 text-cyan-300"
                      : "bg-black border-[#ffffff0a] text-slate-600"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Active filters banner */}
            {(tagFilter || search) && (
              <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-[#00d4ff06] border border-[#00d4ff12] rounded-xl text-[11px] font-mono text-slate-400">
                <Tag size={11} className="text-cyan-600" />
                Filtering:
                {tagFilter && <span className="text-cyan-400">#{tagFilter}</span>}
                {search && <span className="text-cyan-400">"{search}"</span>}
                <button onClick={() => { setTagFilter(null); setSearch(""); }} className="ml-auto text-slate-600 hover:text-slate-300 flex items-center gap-1"><X size={10} /> Clear</button>
              </div>
            )}

            {/* Prompt cards */}
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-28 rounded-xl shimmer" />)}
              </div>
            ) : visible.length === 0 ? (
              <div className="text-center py-24 flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-[#00d4ff06] border border-[#00d4ff12] flex items-center justify-center">
                  {view === "starred" ? <Star size={28} className="text-slate-700" /> :
                   view === "archived" ? <Archive size={28} className="text-slate-700" /> :
                   <Layers size={28} className="text-slate-700" />}
                </div>
                <p className="text-slate-700 text-sm font-mono">
                  {view === "starred" ? "NO STARRED PROMPTS YET" :
                   view === "archived" ? "NOTHING ARCHIVED" :
                   "NO PROMPTS HERE YET"}
                </p>
                <p className="text-xs text-slate-800 font-mono">
                  {view === "all" ? "Generate and save prompts from the image or music pages." : ""}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {visible.map((p) => (
                  <div key={p.id}
                    className={`group relative bg-[#050508] rounded-xl border transition-all hover:-translate-y-px overflow-hidden ${
                      p.archived ? "opacity-60 border-[#ffffff08]" :
                      p.type === "image" ? "border-[#00d4ff0d] hover:border-[#00d4ff25]" : "border-[#f472b60d] hover:border-[#f472b625]"
                    }`}
                  >
                    {/* Top accent line */}
                    <div className={`absolute top-0 left-0 right-0 h-px ${p.type === "image" ? "bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" : "bg-gradient-to-r from-transparent via-pink-500/20 to-transparent"}`} />
                    {/* Star indicator left bar */}
                    {p.starred && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-yellow-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />}

                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Meta row */}
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <Badge variant={p.type === "image" ? "blue" : "pink"} className="text-[9px]">
                              {p.type === "image" ? <ImageIcon size={9} className="inline mr-0.5" /> : <Music size={9} className="inline mr-0.5" />}
                              {p.type}
                            </Badge>
                            <span className="text-[9px] text-slate-700 font-mono">{timeAgo(p.createdAt)}</span>
                            {p.starred && <span className="text-[9px] text-yellow-500 font-mono flex items-center gap-0.5"><Star size={8} className="fill-yellow-500" /> starred</span>}
                            {p.archived && <span className="text-[9px] text-slate-600 font-mono flex items-center gap-0.5"><Archive size={8} /> archived</span>}
                            {p.tags.slice(0, 3).map(tag => (
                              <button key={tag} onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
                                className="text-[9px] text-slate-700 bg-white/4 hover:bg-cyan-500/10 hover:text-cyan-500 px-1.5 py-0.5 rounded font-mono transition-colors">
                                #{tag}
                              </button>
                            ))}
                          </div>
                          <p className="text-xs text-slate-300 font-medium mb-1">{p.title}</p>
                          <p className="text-[11px] text-slate-600 font-mono leading-relaxed line-clamp-2">{p.prompt}</p>
                          {/* Note */}
                          {p.note && noteOpen !== p.id && (
                            <div className="mt-2 px-2.5 py-1.5 bg-yellow-500/5 border border-yellow-500/15 rounded-lg flex items-start gap-1.5">
                              <StickyNote size={10} className="text-yellow-500/60 mt-0.5 flex-shrink-0" />
                              <p className="text-[10px] text-yellow-200/60 font-mono line-clamp-1">{p.note}</p>
                            </div>
                          )}
                          {/* Note editor */}
                          {noteOpen === p.id && (
                            <div className="mt-2 space-y-1.5">
                              <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={2}
                                placeholder="Add a note…"
                                className="w-full bg-[#0a0a14] border border-yellow-500/20 text-yellow-200/80 placeholder-slate-700 rounded-lg px-2.5 py-1.5 text-[11px] font-mono resize-none focus:outline-none focus:border-yellow-500/40 transition-all" />
                              <div className="flex gap-1.5">
                                <button onClick={() => saveNote(p.id)} className="px-2.5 py-1 bg-yellow-500/10 border border-yellow-500/25 text-yellow-400 rounded-md text-[10px] font-mono hover:bg-yellow-500/20 transition-all">Save Note</button>
                                <button onClick={() => setNoteOpen(null)} className="px-2.5 py-1 bg-white/4 border border-[#ffffff0a] text-slate-500 rounded-md text-[10px] font-mono hover:text-slate-300 transition-all">Cancel</button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => toggleStar(p)} title={p.starred ? "Unstar" : "Star"}
                            className={`p-1.5 rounded-lg border transition-all ${p.starred ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400" : "bg-black/60 border-[#ffffff0a] text-slate-600 hover:text-yellow-400 hover:border-yellow-500/30"}`}>
                            <Star size={12} className={p.starred ? "fill-yellow-400" : ""} />
                          </button>
                          <button onClick={() => noteOpen === p.id ? setNoteOpen(null) : openNote(p)} title="Note"
                            className={`p-1.5 rounded-lg border transition-all ${p.note ? "bg-yellow-500/8 border-yellow-500/20 text-yellow-500/60" : "bg-black/60 border-[#ffffff0a] text-slate-600 hover:text-yellow-400"}`}>
                            <StickyNote size={12} />
                          </button>
                          <button onClick={() => handleLike(p)} title="Like"
                            className="p-1.5 rounded-lg bg-black/60 border border-[#ffffff0a] text-slate-600 hover:text-pink-400 transition-all flex items-center gap-0.5">
                            <Heart size={12} />
                            <span className="text-[9px] font-mono">{p.likes || 0}</span>
                          </button>
                          <button onClick={() => handleCopy(p.id, p.prompt)} title="Copy"
                            className="p-1.5 rounded-lg bg-black/60 border border-[#ffffff0a] text-slate-600 hover:text-cyan-400 hover:border-[#00d4ff30] transition-all">
                            {copied === p.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                          </button>
                          <button onClick={() => toggleArchive(p)} title={p.archived ? "Unarchive" : "Archive"}
                            className="p-1.5 rounded-lg bg-black/60 border border-[#ffffff0a] text-slate-600 hover:text-slate-300 transition-all">
                            <Archive size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
