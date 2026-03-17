"use client";
import { useEffect, useState } from "react";
import { SavedPrompt } from "@/lib/db";
import { timeAgo } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Trash2, Copy, Heart, Search, RefreshCw } from "lucide-react";

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<SavedPrompt[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const limit = 20;

  const fetchData = () => {
    const type = filter === "all" ? "" : `&type=${filter}`;
    fetch(`/api/prompts?limit=${limit}&offset=${page * limit}${type}`)
      .then(r => r.json())
      .then(({ prompts, total }) => { setPrompts(prompts); setTotal(total); setLoading(false); });
  };

  useEffect(() => { setPage(0); }, [filter]);
  useEffect(() => { fetchData(); }, [filter, page]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this prompt?")) return;
    await fetch(`/api/prompts/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const filtered = prompts.filter(p =>
    !search || p.prompt.toLowerCase().includes(search.toLowerCase()) || p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 pt-14 lg:pt-0">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-1">// Data</p>
          <h1 className="text-2xl font-black text-white tracking-tight">Saved Prompts
            <span className="ml-2 text-sm font-mono text-slate-600">({total})</span>
          </h1>
        </div>
        <Button variant="secondary" size="sm" onClick={fetchData}><RefreshCw size={12} /> Refresh</Button>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#00d4ff15] to-transparent" />

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-44">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
          <input type="text" placeholder="Search prompts..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black border border-[#00d4ff12] text-slate-300 placeholder-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono focus:outline-none focus:border-[#00d4ff35] transition-all" />
        </div>
        {(["all", "image", "music"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider border transition-all capitalize ${
              filter === f
                ? f === "music" ? "bg-pink-500/12 border-pink-500/35 text-pink-300" : "bg-cyan-500/12 border-cyan-500/35 text-cyan-300"
                : "bg-black border-[#ffffff0a] text-slate-600 hover:text-slate-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-[#050508] border border-[#00d4ff0d] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#ffffff06]">
                {["Prompt", "Type", "Likes", "Saved", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[9px] font-mono text-slate-600 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ffffff03]">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}><td colSpan={5} className="px-4 py-3"><div className="h-5 rounded shimmer" /></td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-700 text-xs font-mono">NO PROMPTS FOUND</td></tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-white/2 transition-colors group">
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors mb-0.5">{p.title}</p>
                      <p className="text-[10px] text-slate-600 font-mono truncate">{p.prompt}</p>
                      {p.tags.length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {p.tags.slice(0, 3).map((t) => (
                            <span key={t} className="text-[9px] bg-white/4 text-slate-600 px-1.5 py-0.5 rounded font-mono">#{t}</span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={p.type === "image" ? "blue" : "pink"} className="text-[9px]">{p.type}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                        <Heart size={10} className="text-pink-500" /> {p.likes}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[10px] text-slate-700 font-mono">{timeAgo(p.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleCopy(p.id, p.prompt)} className="p-1.5 rounded text-slate-700 hover:text-cyan-400 transition-colors">
                          <Copy size={12} className={copied === p.id ? "text-emerald-400" : ""} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded text-slate-700 hover:text-red-400 transition-colors">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {total > limit && (
          <div className="px-4 py-3 border-t border-[#ffffff06] flex items-center justify-between">
            <span className="text-[10px] text-slate-700 font-mono">
              {page * limit + 1}–{Math.min((page + 1) * limit, total)} of {total}
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setPage(p => p - 1)} disabled={page === 0}>← Prev</Button>
              <Button variant="secondary" size="sm" onClick={() => setPage(p => p + 1)} disabled={(page + 1) * limit >= total}>Next →</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
