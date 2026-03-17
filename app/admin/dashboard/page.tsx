import { readDB } from "@/lib/db";
import { formatNumber, timeAgo } from "@/lib/utils";
import { Wand2, ImageIcon, Music, Layers, FolderOpen, TrendingUp, Activity, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";

export const revalidate = 0;

export default async function DashboardPage() {
  const db = readDB();

  const totalUsage = db.templates.reduce((sum, t) => sum + t.usageCount, 0);
  const imageTemplates = db.templates.filter((t) => t.type === "image").length;
  const musicTemplates = db.templates.filter((t) => t.type === "music").length;
  const activeTemplates = db.templates.filter((t) => t.status === "active").length;

  const topTemplates = [...db.templates]
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 6);

  const recentPrompts = [...db.savedPrompts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const maxUsage = topTemplates[0]?.usageCount || 1;

  // Category usage distribution
  const categoryUsage = db.categories.map((cat) => {
    const catTemplates = db.templates.filter((t) => t.categoryId === cat.id);
    const usage = catTemplates.reduce((sum, t) => sum + t.usageCount, 0);
    return { ...cat, usage, templateCount: catTemplates.length };
  }).filter((c) => c.templateCount > 0).sort((a, b) => b.usage - a.usage).slice(0, 6);

  const maxCatUsage = categoryUsage[0]?.usage || 1;

  const stats = [
    { label: "Total Usage", value: formatNumber(totalUsage), icon: Wand2, accent: "cyan", href: "/admin/prompts" },
    { label: "Image Templates", value: imageTemplates, icon: ImageIcon, accent: "cyan", href: "/admin/templates?type=image" },
    { label: "Music Templates", value: musicTemplates, icon: Music, accent: "pink", href: "/admin/templates?type=music" },
    { label: "Active Templates", value: activeTemplates, icon: Activity, accent: "cyan", href: "/admin/templates" },
    { label: "Categories", value: db.categories.length, icon: FolderOpen, accent: "pink", href: "/admin/categories" },
    { label: "Saved Prompts", value: db.savedPrompts.length, icon: Layers, accent: "pink", href: "/admin/prompts" },
  ];

  return (
    <div className="space-y-7 pt-14 lg:pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-1">// Overview</p>
          <h1 className="text-2xl font-black text-white tracking-tight">Dashboard</h1>
        </div>
        <div className="text-[10px] font-mono text-slate-700 border border-[#00d4ff12] px-3 py-1.5 rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-1.5 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
          SYSTEM ONLINE
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#00d4ff20] to-transparent" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {stats.map(({ label, value, icon: Icon, accent, href }) => (
          <Link
            key={label}
            href={href}
            className={`relative bg-[#050508] rounded-xl p-4 overflow-hidden group transition-all hover:-translate-y-0.5 border ${
              accent === "cyan"
                ? "border-[#00d4ff12] hover:border-[#00d4ff30] hover:shadow-[0_0_20px_rgba(0,212,255,0.07)]"
                : "border-[#f472b612] hover:border-[#f472b630] hover:shadow-[0_0_20px_rgba(244,114,182,0.07)]"
            }`}
          >
            <div className={`absolute top-0 left-0 right-0 h-px ${accent === "cyan" ? "bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" : "bg-gradient-to-r from-transparent via-pink-500/30 to-transparent"}`} />
            <div className="flex items-center justify-between mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent === "cyan" ? "bg-cyan-500/10" : "bg-pink-500/10"}`}>
                <Icon size={14} className={accent === "cyan" ? "text-cyan-400" : "text-pink-400"} />
              </div>
              <TrendingUp size={11} className="text-slate-700 group-hover:text-slate-500 transition-colors" />
            </div>
            <div className="text-2xl font-black text-white tracking-tight">{value}</div>
            <div className="text-[10px] text-slate-600 mt-0.5 font-mono uppercase tracking-wider">{label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top Templates with usage bars */}
        <div className="bg-[#050508] border border-[#00d4ff0d] rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#00d4ff0a] flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">// Top Templates</span>
            <Link href="/admin/templates" className="text-[10px] text-cyan-600 hover:text-cyan-400 font-mono flex items-center gap-1 transition-colors">
              VIEW ALL <ArrowRight size={10} />
            </Link>
          </div>
          <div className="divide-y divide-[#ffffff04]">
            {topTemplates.length === 0 ? (
              <div className="p-8 text-center text-slate-700 text-xs font-mono">NO TEMPLATES YET</div>
            ) : topTemplates.map((t, i) => (
              <div key={t.id} className="flex items-center gap-3 px-5 py-2.5 hover:bg-white/2 transition-colors group">
                <span className="text-[10px] font-mono text-slate-700 w-4 flex-shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-300 truncate group-hover:text-white transition-colors">{t.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${t.type === "image" ? "bg-gradient-to-r from-cyan-500 to-blue-500" : "bg-gradient-to-r from-pink-500 to-fuchsia-500"}`}
                        style={{ width: `${Math.max(4, (t.usageCount / maxUsage) * 100)}%` }}
                      />
                    </div>
                    <Badge variant={t.type === "image" ? "blue" : "pink"} className="text-[9px] flex-shrink-0">{t.type}</Badge>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-white">{formatNumber(t.usageCount)}</div>
                  <div className="text-[9px] text-slate-700 font-mono">USES</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Prompts */}
        <div className="bg-[#050508] border border-[#f472b60d] rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#f472b60a] flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">// Recent Prompts</span>
            <Link href="/admin/prompts" className="text-[10px] text-pink-600 hover:text-pink-400 font-mono flex items-center gap-1 transition-colors">
              VIEW ALL <ArrowRight size={10} />
            </Link>
          </div>
          {recentPrompts.length === 0 ? (
            <div className="p-8 text-center text-slate-700 text-xs font-mono">NO PROMPTS SAVED YET</div>
          ) : (
            <div className="divide-y divide-[#ffffff04]">
              {recentPrompts.map((p) => (
                <div key={p.id} className="px-5 py-2.5 hover:bg-white/2 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={p.type === "image" ? "blue" : "pink"} className="text-[9px]">{p.type}</Badge>
                    <span className="text-[9px] text-slate-700 font-mono">{timeAgo(p.createdAt)}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono truncate">{p.prompt}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category usage chart */}
      {categoryUsage.length > 0 && (
        <div className="bg-[#050508] border border-[#00d4ff0d] rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#00d4ff0a] flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
              <Zap size={10} className="inline-block mr-1.5 text-cyan-600" />
              Category Usage Distribution
            </span>
            <Link href="/admin/categories" className="text-[10px] text-cyan-600 hover:text-cyan-400 font-mono flex items-center gap-1 transition-colors">
              MANAGE <ArrowRight size={10} />
            </Link>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryUsage.map((cat) => (
              <Link key={cat.id} href={`/admin/templates?category=${cat.id}`} className="group">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm">{cat.icon}</span>
                  <span className="text-xs text-slate-400 group-hover:text-white transition-colors truncate">{cat.name}</span>
                  <span className={`ml-auto text-[9px] font-mono flex-shrink-0 ${cat.type === "image" ? "text-cyan-700" : "text-pink-700"}`}>
                    {cat.templateCount}t
                  </span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${cat.type === "image" ? "bg-gradient-to-r from-cyan-500/70 to-blue-500/70" : "bg-gradient-to-r from-pink-500/70 to-fuchsia-500/70"}`}
                    style={{ width: `${Math.max(4, (cat.usage / maxCatUsage) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[9px] text-slate-700 font-mono">{formatNumber(cat.usage)} uses</span>
                  <span className="text-[9px] text-slate-700 font-mono">{maxCatUsage > 0 ? Math.round((cat.usage / maxCatUsage) * 100) : 0}%</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-[#050508] border border-[#ffffff08] rounded-xl p-5">
        <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-4">// Quick Actions</p>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/admin/templates", label: "New Template", accent: "cyan" },
            { href: "/admin/categories", label: "New Category", accent: "blue" },
            { href: "/admin/settings", label: "Settings", accent: "gray" },
            { href: "/", label: "View Site ↗", accent: "gray", target: "_blank" },
            { href: "/image", label: "Image Generator ↗", accent: "gray", target: "_blank" },
            { href: "/music", label: "Music Generator ↗", accent: "gray", target: "_blank" },
          ].map(({ href, label, accent, target }) => (
            <Link
              key={label}
              href={href}
              target={target as "_blank" | undefined}
              className={`px-4 py-2 rounded-lg text-xs font-mono tracking-wide transition-all border ${
                accent === "cyan"
                  ? "bg-cyan-500/8 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/15 hover:border-cyan-500/35"
                  : accent === "blue"
                  ? "bg-blue-500/8 border-blue-500/20 text-blue-400 hover:bg-blue-500/15"
                  : "bg-white/4 border-[#ffffff0f] text-slate-400 hover:bg-white/6 hover:text-slate-200"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
