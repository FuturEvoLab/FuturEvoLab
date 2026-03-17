"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Zap, Image, Music, BookOpen, Settings } from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: Zap },
  { href: "/image", label: "Image Prompts", icon: Image },
  { href: "/music", label: "Music Prompts", icon: Music },
  { href: "/explore", label: "Explore", icon: BookOpen },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-white">
              Futur<span className="text-violet-400">Evo</span>Lab
            </span>
            <span className="hidden sm:block text-xs text-gray-500 font-normal">Prompt Studio</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === href
                    ? "bg-violet-600/20 text-violet-300"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                )}
              >
                <Icon size={14} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Admin link */}
          <Link
            href="/admin"
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-800"
          >
            <Settings size={14} />
            <span className="hidden sm:block">Admin</span>
          </Link>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t border-gray-800/50 px-4 py-2 flex gap-1 overflow-x-auto">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors",
              pathname === href
                ? "bg-violet-600/20 text-violet-300"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            )}
          >
            <Icon size={12} />
            {label}
          </Link>
        ))}
      </div>
    </header>
  );
}
