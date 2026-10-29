"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const labels: Record<string, string> = {
  admin: "Admin",
  dashboard: "Dashboard",
  templates: "Templates",
  categories: "Categories",
  prompts: "Prompts",
  collections: "Collections",
  users: "Users",
  settings: "Settings",
  login: "Login",
};

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean); // e.g. ["admin","templates"]

  const crumbs = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const label = labels[seg] ?? seg;
    const isLast = i === segments.length - 1;
    return { href, label, isLast };
  });

  if (crumbs.length <= 1) return null; // Don't show on /admin root

  return (
    <nav className="flex items-center gap-1.5 text-[10px] font-mono mb-4">
      <Link href="/admin/dashboard" className="text-slate-700 hover:text-slate-400 transition-colors">
        <Home size={10} />
      </Link>
      {crumbs.map(({ href, label, isLast }) => (
        <span key={href} className="flex items-center gap-1.5">
          <ChevronRight size={9} className="text-slate-800" />
          {isLast ? (
            <span className="text-slate-400 uppercase tracking-widest">{label}</span>
          ) : (
            <Link href={href} className="text-slate-600 hover:text-slate-300 uppercase tracking-widest transition-colors">
              {label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
