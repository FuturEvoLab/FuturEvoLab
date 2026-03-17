"use client";
import { Template } from "@/lib/db";
import { formatNumber } from "@/lib/utils";
import { TrendingUp, Star } from "lucide-react";
import Badge from "@/components/ui/Badge";

interface TemplateCardProps {
  template: Template;
  categoryName?: string;
  onClick?: () => void;
  active?: boolean;
}

export default function TemplateCard({ template, categoryName, onClick, active }: TemplateCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-4 rounded-xl border transition-all duration-200 group
        ${active
          ? "bg-violet-600/20 border-violet-500/60 shadow-lg shadow-violet-500/10"
          : "bg-gray-900/60 border-gray-800 hover:border-gray-600 hover:bg-gray-800/60"
        }
      `}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className={`font-semibold text-sm leading-tight ${active ? "text-violet-200" : "text-gray-200 group-hover:text-white"}`}>
          {template.title}
          {template.featured && (
            <Star size={12} className="inline ml-1.5 text-yellow-400 fill-yellow-400" />
          )}
        </h3>
      </div>

      <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">{template.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex gap-1 flex-wrap">
          {template.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <TrendingUp size={10} />
          {formatNumber(template.usageCount)}
        </div>
      </div>

      {categoryName && (
        <div className="mt-2">
          <Badge variant={template.type === "image" ? "purple" : "blue"} className="text-xs">
            {categoryName}
          </Badge>
        </div>
      )}
    </button>
  );
}
