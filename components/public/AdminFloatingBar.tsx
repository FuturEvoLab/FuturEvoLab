"use client";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Shield, LayoutDashboard, FileText, FolderOpen, Layers, X, ChevronUp, Settings } from "lucide-react";

const quickLinks = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/templates", icon: FileText, label: "Templates" },
  { href: "/admin/categories", icon: FolderOpen, label: "Categories" },
  { href: "/admin/prompts", icon: Layers, label: "Prompts" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminFloatingBar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Only show on public pages, not admin pages
  if (!session || pathname.startsWith("/admin") || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-2">
      {/* Expanded panel */}
      {open && (
        <div className="bg-[#050510] border border-[#00d4ff25] rounded-xl p-3 shadow-[0_0_30px_rgba(0,212,255,0.1)] animate-slide-up min-w-44">
          {/* Top glow line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent rounded-t-xl" />

          <div className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mb-2 px-1">
            Admin Quick Access
          </div>
          <div className="space-y-0.5">
            {quickLinks.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-slate-400 hover:text-cyan-300 hover:bg-[#00d4ff08] transition-all"
              >
                <Icon size={12} className="text-cyan-600" />
                {label}
              </Link>
            ))}
          </div>

          {/* Current page edit shortcut */}
          {(pathname === "/image" || pathname === "/music") && (
            <>
              <div className="h-px bg-[#00d4ff0f] my-2" />
              <Link
                href={`/admin/templates`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-pink-400 hover:text-pink-300 hover:bg-[#f472b608] transition-all"
              >
                <FileText size={12} />
                Edit {pathname === "/image" ? "Image" : "Music"} Templates
              </Link>
            </>
          )}
        </div>
      )}

      {/* Toggle button */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#050510] border border-[#00d4ff25] rounded-xl text-xs font-mono text-cyan-500 hover:text-cyan-300 hover:border-[#00d4ff45] transition-all shadow-[0_0_15px_rgba(0,212,255,0.08)] hover:shadow-[0_0_20px_rgba(0,212,255,0.15)]"
        >
          <Shield size={11} />
          ADMIN
          <ChevronUp size={11} className={`transition-transform ${open ? "" : "rotate-180"}`} />
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="p-1.5 bg-[#050510] border border-[#ffffff08] rounded-lg text-slate-700 hover:text-slate-400 transition-colors"
        >
          <X size={10} />
        </button>
      </div>
    </div>
  );
}
