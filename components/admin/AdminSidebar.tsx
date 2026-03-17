"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, FileText, Layers, FolderOpen,
  Users, Settings, LogOut, Zap, ExternalLink,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard", code: "01" },
  { href: "/admin/templates", icon: FileText, label: "Templates", code: "02" },
  { href: "/admin/categories", icon: FolderOpen, label: "Categories", code: "03" },
  { href: "/admin/prompts", icon: Layers, label: "Saved Prompts", code: "04" },
  { href: "/admin/users", icon: Users, label: "Users", code: "05" },
  { href: "/admin/settings", icon: Settings, label: "Settings", code: "06" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <>
      {/* ── Desktop Sidebar ─────────────────────────────────────────────────── */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-60 bg-[#03030a] border-r border-[#00d4ff0e] flex-col z-40">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

        {/* Logo */}
        <div className="px-5 py-5 border-b border-[#00d4ff0a]">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-fuchsia-600" />
              <Zap size={14} className="relative text-black mx-auto mt-1.5" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-xs font-black text-white tracking-tight">
                Futur<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">Evo</span>Lab
              </div>
              <div className="text-[9px] text-slate-700 font-mono tracking-widest uppercase">Control Panel</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, icon: Icon, label, code }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group relative overflow-hidden",
                  active
                    ? "bg-[#00d4ff0a] text-cyan-300 border border-[#00d4ff20]"
                    : "text-slate-600 hover:text-slate-200 hover:bg-white/4 border border-transparent"
                )}
              >
                {active && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-cyan-400 rounded-r shadow-[0_0_8px_rgba(0,212,255,0.6)]" />
                )}
                <span className="text-[9px] font-mono text-slate-700 w-4 group-hover:text-slate-600 flex-shrink-0">
                  {code}
                </span>
                <Icon size={13} className={active ? "text-cyan-400" : "text-slate-700 group-hover:text-slate-400"} />
                <span className="tracking-wide">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Separator */}
        <div className="mx-4 mb-2 h-px bg-gradient-to-r from-transparent via-[#00d4ff15] to-transparent" />

        {/* Bottom */}
        <div className="px-3 pb-4 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 text-[10px] text-slate-700 hover:text-cyan-400 rounded-lg hover:bg-[#00d4ff08] transition-all font-mono tracking-wider"
          >
            <ExternalLink size={11} />
            VIEW WEBSITE
          </Link>

          {/* User */}
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#00d4ff05] border border-[#00d4ff0a]">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cyan-500/30 to-fuchsia-600/30 border border-[#00d4ff30] flex items-center justify-center text-[10px] font-bold text-cyan-400 flex-shrink-0">
                {session?.user?.name?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-semibold text-slate-300 truncate">{session?.user?.name || "Admin"}</div>
                <div className="text-[9px] text-slate-700 font-mono uppercase tracking-wider">
                  {(session?.user as { role?: string })?.role || "admin"}
                </div>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="text-slate-700 hover:text-red-400 transition-colors p-1 rounded flex-shrink-0"
              title="Sign out"
            >
              <LogOut size={12} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Mobile Top Bar ──────────────────────────────────────────────────── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#03030a] border-b border-[#00d4ff0e] flex items-center justify-between px-4 h-12">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cyan-500 to-fuchsia-600 flex items-center justify-center">
            <Zap size={11} className="text-black" strokeWidth={2.5} />
          </div>
          <span className="text-xs font-black text-white font-mono">ADMIN</span>
        </Link>
        <div className="flex items-center gap-0.5">
          {navItems.slice(0, 4).map(({ href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "p-2 rounded-lg transition-colors",
                pathname === href
                  ? "bg-[#00d4ff0d] text-cyan-400"
                  : "text-slate-600 hover:text-slate-300"
              )}
            >
              <Icon size={14} />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
