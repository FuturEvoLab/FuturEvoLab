"use client";
import { Template } from "@/lib/db";
import { formatNumber } from "@/lib/utils";
import { TrendingUp, Star } from "lucide-react";

interface TemplateCardProps {
  template: Template;
  categoryName?: string;
  onClick?: () => void;
  active?: boolean;
}

export default function TemplateCard({ template, categoryName, onClick, active }: TemplateCardProps) {
  const isImage = template.type === "image";

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 group relative overflow-hidden ${
        active
          ? isImage
            ? "bg-[#00d4ff08] border-[#00d4ff45] shadow-[0_0_20px_rgba(0,212,255,0.1)]"
            : "bg-[#f472b608] border-[#f472b645] shadow-[0_0_20px_rgba(244,114,182,0.1)]"
          : "bg-[#050508] border-[#ffffff08] hover:border-[#ffffff18] hover:bg-[#0a0a14]"
      }`}
    >
      {/* Active indicator */}
      {active && (
        <div className={`absolute left-0 top-0 bottom-0 w-0.5 rounded-r ${isImage ? "bg-cyan-400" : "bg-pink-400"}`} />
      )}

      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h3 className={`font-semibold text-xs leading-snug transition-colors ${
          active
            ? isImage ? "text-cyan-200" : "text-pink-200"
            : "text-slate-300 group-hover:text-white"
        }`}>
          {template.title}
          {template.featured && (
            <Star size={10} className="inline ml-1 text-yellow-400 fill-yellow-400" />
          )}
        </h3>
        <div className="flex items-center gap-0.5 text-[10px] text-slate-600 font-mono flex-shrink-0">
          <TrendingUp size={9} />
          {formatNumber(template.usageCount)}
        </div>
      </div>

      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed mb-2">
        {template.description}
      </p>

      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1 flex-wrap">
          {template.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[9px] bg-white/4 text-slate-600 px-1.5 py-0.5 rounded font-mono">
              #{tag}
            </span>
          ))}
        </div>
        {categoryName && (
          <span className={`text-[9px] font-mono tracking-wider uppercase ${isImage ? "text-cyan-600" : "text-pink-600"}`}>
            {categoryName}
          </span>
        )}
      </div>
    </button>
  );
}
