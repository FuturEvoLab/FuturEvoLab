import { readDB } from "@/lib/db";
import { formatNumber, timeAgo } from "@/lib/utils";
import { Wand2, Image, Music, Layers, FolderOpen, TrendingUp, Activity } from "lucide-react";
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

  const stats = [
    {
      label: "Total Usage",
      value: formatNumber(totalUsage),
      icon: Wand2,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
    {
      label: "Image Templates",
      value: imageTemplates,
      icon: Image,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: "Music Templates",
      value: musicTemplates,
      icon: Music,
      color: "text-pink-400",
      bg: "bg-pink-500/10",
      border: "border-pink-500/20",
    },
    {
      label: "Active Templates",
      value: activeTemplates,
      icon: Activity,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Categories",
      value: db.categories.length,
      icon: FolderOpen,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
    },
    {
      label: "Saved Prompts",
      value: db.savedPrompts.length,
      icon: Layers,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
    },
  ];

  return (
    <div className="space-y-8 pt-10 lg:pt-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here&apos;s your prompt studio overview.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg, border }) => (
          <div
            key={label}
            className={`bg-gray-900/80 border ${border} rounded-xl p-5 hover:border-opacity-60 transition-colors`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon size={16} className={color} />
              </div>
              <TrendingUp size={14} className="text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Templates */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Top Templates</h2>
            <Link href="/admin/templates" className="text-xs text-violet-400 hover:text-violet-300">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-800/60">
            {topTemplates.map((t, i) => (
              <div key={t.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-800/30 transition-colors">
                <span className="text-xs font-bold text-gray-600 w-5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200 truncate">{t.title}</p>
                  <Badge variant={t.type === "image" ? "purple" : "blue"} className="mt-0.5">
                    {t.type}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-white">{formatNumber(t.usageCount)}</div>
                  <div className="text-xs text-gray-600">uses</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Prompts */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Recent Saved Prompts</h2>
            <Link href="/admin/prompts" className="text-xs text-violet-400 hover:text-violet-300">
              View all
            </Link>
          </div>
          {recentPrompts.length === 0 ? (
            <div className="p-8 text-center text-gray-600 text-sm">No saved prompts yet</div>
          ) : (
            <div className="divide-y divide-gray-800/60">
              {recentPrompts.map((p) => (
                <div key={p.id} className="px-5 py-3 hover:bg-gray-800/30 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={p.type === "image" ? "purple" : "blue"}>{p.type}</Badge>
                        <span className="text-xs text-gray-600">{timeAgo(p.createdAt)}</span>
                      </div>
                      <p className="text-xs text-gray-400 font-mono truncate">{p.prompt}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/templates"
            className="flex items-center gap-2 px-4 py-2 bg-violet-600/20 border border-violet-500/30 text-violet-300 rounded-lg text-sm hover:bg-violet-600/30 transition-colors"
          >
            <Image size={14} />
            Add Template
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded-lg text-sm hover:bg-blue-600/30 transition-colors"
          >
            <FolderOpen size={14} />
            Add Category
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition-colors"
          >
            Site Settings
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition-colors"
          >
            View Site
          </Link>
        </div>
      </div>
    </div>
  );
}
