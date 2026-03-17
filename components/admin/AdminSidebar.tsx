"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Layers,
  FolderOpen,
  Users,
  Settings,
  LogOut,
  Zap,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/templates", icon: FileText, label: "Templates" },
  { href: "/admin/categories", icon: FolderOpen, label: "Categories" },
  { href: "/admin/prompts", icon: Layers, label: "Saved Prompts" },
  { href: "/admin/users", icon: Users, label: "Admin Users" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-gray-950 border-r border-gray-800/60 flex-col z-40">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800/60">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">FuturEvoLab</div>
              <div className="text-xs text-gray-500">Admin Panel</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                  active
                    ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                    : "text-gray-500 hover:text-gray-200 hover:bg-gray-800/60"
                )}
              >
                <Icon size={16} className={active ? "text-violet-400" : "text-gray-600 group-hover:text-gray-400"} />
                {label}
                {active && <ChevronRight size={14} className="ml-auto text-violet-500" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-gray-800/60 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ExternalLink size={12} />
            View Website
          </Link>
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-xs font-bold text-violet-300">
                {session?.user?.name?.[0]?.toUpperCase() || "A"}
              </div>
              <div>
                <div className="text-xs font-medium text-gray-300">{session?.user?.name || "Admin"}</div>
                <div className="text-xs text-gray-600">{(session?.user as { role?: string })?.role || "admin"}</div>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="text-gray-600 hover:text-red-400 transition-colors p-1 rounded"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-4 h-14">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center">
            <Zap size={13} className="text-white" />
          </div>
          <span className="text-sm font-bold text-white">Admin</span>
        </Link>
        <div className="flex items-center gap-1 overflow-x-auto">
          {navItems.slice(0, 4).map(({ href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "p-2 rounded-lg transition-colors",
                pathname === href ? "bg-violet-600/20 text-violet-300" : "text-gray-500 hover:text-gray-300"
              )}
            >
              <Icon size={16} />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
