"use client";
import { useSession } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, Suspense, useEffect } from "react";
import { Shield, LayoutDashboard, FileText, FolderOpen, Layers, X, ChevronUp, Settings, Pencil, ExternalLink } from "lucide-react";

const quickLinks = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/templates", icon: FileText, label: "Templates" },
  { href: "/admin/categories", icon: FolderOpen, label: "Categories" },
  { href: "/admin/prompts", icon: Layers, label: "Prompts" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

function AdminFloatingBarContent() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [templateTitle, setTemplateTitle] = useState<string | null>(null);

  const templateId = searchParams.get("template");
  const isImagePage = pathname === "/image";
  const isMusicPage = pathname === "/music";
  const isGeneratorPage = isImagePage || isMusicPage;

  // Fetch template title when ID changes in URL
  useEffect(() => {
    if (!templateId || !session) { setTemplateTitle(null); return; }
    fetch(`/api/templates/${templateId}`)
      .then(r => r.ok ? r.json() : null)
      .then(t => setTemplateTitle(t?.title ?? null))
      .catch(() => setTemplateTitle(null));
  }, [templateId, session]);

  if (!session || pathname.startsWith("/admin") || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-2">
      {/* Expanded panel */}
      {open && (
        <div className="relative bg-[#050510] border border-[#00d4ff25] rounded-xl p-3 shadow-[0_0_30px_rgba(0,212,255,0.1)] min-w-48">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent rounded-t-xl" />

          <div className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mb-2 px-1">
            Admin Quick Access
          </div>

          {/* Current template edit shortcut — shown when ?template=ID is in URL */}
          {isGeneratorPage && templateId && templateTitle && (
            <>
              <div className="mb-2 px-2 py-2 rounded-lg bg-[#00d4ff06] border border-[#00d4ff15]">
                <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mb-1.5">Current Template</p>
                <p className="text-[11px] text-slate-300 font-medium truncate mb-2">{templateTitle}</p>
                <div className="flex gap-1.5">
                  <Link
                    href={`/admin/templates?edit=${templateId}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-mono bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 hover:bg-cyan-500/20 transition-all"
                  >
                    <Pencil size={9} /> Edit
                  </Link>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setOpen(false);
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-mono bg-white/4 border border-[#ffffff12] text-slate-500 hover:text-slate-300 transition-all"
                  >
                    <ExternalLink size={9} /> Copy Link
                  </button>
                </div>
              </div>
              <div className="h-px bg-[#00d4ff0f] mb-2" />
            </>
          )}

          <div className="space-y-0.5">
            {quickLinks.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-slate-400 hover:text-cyan-300 hover:bg-[#00d4ff08] transition-all"
              >
                <Icon size={12} className="text-cyan-700" />
                {label}
              </Link>
            ))}
          </div>

          {/* Page-specific shortcut */}
          {isGeneratorPage && (
            <>
              <div className="h-px bg-[#00d4ff0f] my-2" />
              <Link
                href={`/admin/templates?type=${isImagePage ? "image" : "music"}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-pink-500 hover:text-pink-300 hover:bg-[#f472b608] transition-all"
              >
                <FileText size={12} />
                Manage {isImagePage ? "Image" : "Music"} Templates
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
          {isGeneratorPage && templateTitle && (
            <span className="text-[9px] text-cyan-700 font-normal truncate max-w-[80px]">· {templateTitle}</span>
          )}
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

export default function AdminFloatingBar() {
  return (
    <Suspense>
      <AdminFloatingBarContent />
    </Suspense>
  );
}
