"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Zap, ImageIcon, Music, BookOpen, Settings } from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: Zap },
  { href: "/image", label: "Image", icon: ImageIcon },
  { href: "/music", label: "Music", icon: Music },
  { href: "/explore", label: "Explore", icon: BookOpen },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-b border-[#00d4ff15]">
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-fuchsia-600 opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-fuchsia-600 blur-sm opacity-50 scale-150" />
              <Zap size={15} className="relative text-black font-bold" strokeWidth={2.5} />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-white text-sm tracking-tight">
                Futur<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">Evo</span>Lab
              </span>
              <span className="hidden sm:block text-[10px] text-slate-600 font-mono tracking-wider uppercase">// Prompt Studio</span>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center">
            {links.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg",
                    active
                      ? "text-cyan-300"
                      : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
                  )}
                >
                  <Icon size={13} className={active ? "text-cyan-400" : ""} />
                  {label}
                  {active && (
                    <span className="ml-0.5 w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(0,212,255,0.8)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Admin */}
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-600 hover:text-slate-300 transition-colors rounded-lg border border-transparent hover:border-[#00d4ff20] hover:bg-[#00d4ff08]"
          >
            <Settings size={12} />
            <span className="hidden sm:block tracking-wider">ADMIN</span>
          </Link>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t border-[#00d4ff0a] px-3 py-1.5 flex gap-0.5 overflow-x-auto">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs whitespace-nowrap transition-all",
                active
                  ? "text-cyan-300 bg-[#00d4ff0d]"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
              )}
            >
              <Icon size={11} />
              {label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
