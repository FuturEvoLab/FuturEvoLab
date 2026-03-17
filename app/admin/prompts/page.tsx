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
      .then((r) => r.json())
      .then(({ prompts, total }) => {
        setPrompts(prompts);
        setTotal(total);
        setLoading(false);
      });
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

  const filtered = prompts.filter(
    (p) =>
      !search ||
      p.prompt.toLowerCase().includes(search.toLowerCase()) ||
      p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pt-10 lg:pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Saved Prompts</h1>
          <p className="text-sm text-gray-500 mt-1">{total} total prompts</p>
        </div>
        <Button variant="secondary" onClick={fetchData} size="sm">
          <RefreshCw size={14} /> Refresh
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 text-gray-300 placeholder-gray-600 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        {(["all", "image", "music"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === f
                ? "bg-violet-600/30 border border-violet-500/60 text-violet-200"
                : "bg-gray-800 border border-gray-700 text-gray-400 hover:text-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-gray-900/80 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prompt</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Likes</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}><td colSpan={5} className="px-5 py-4"><div className="h-5 rounded shimmer" /></td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-600 text-sm">No prompts found</td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-3 max-w-sm">
                      <p className="text-sm font-medium text-gray-200 mb-1">{p.title}</p>
                      <p className="text-xs text-gray-500 font-mono truncate">{p.prompt}</p>
                      {p.tags.length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {p.tags.slice(0, 3).map((t) => (
                            <span key={t} className="text-xs bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={p.type === "image" ? "purple" : "blue"}>{p.type}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Heart size={12} className="text-red-400" /> {p.likes}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-500">{timeAgo(p.createdAt)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleCopy(p.id, p.prompt)}
                          className="p-1.5 rounded text-gray-500 hover:text-blue-400 transition-colors"
                        >
                          <Copy size={14} className={copied === p.id ? "text-green-400" : ""} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > limit && (
          <div className="px-5 py-3 border-t border-gray-800 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Showing {page * limit + 1}–{Math.min((page + 1) * limit, total)} of {total}
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setPage((p) => p - 1)} disabled={page === 0}>
                Previous
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setPage((p) => p + 1)} disabled={(page + 1) * limit >= total}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
