import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "blue" | "pink" | "purple" | "green" | "red" | "yellow" | "gray";
  className?: string;
}

export default function Badge({ children, variant = "blue", className }: BadgeProps) {
  const variants = {
    blue: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30 shadow-[0_0_8px_rgba(0,212,255,0.1)]",
    pink: "bg-pink-500/10 text-pink-300 border-pink-500/30 shadow-[0_0_8px_rgba(244,114,182,0.1)]",
    purple: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    green: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    red: "bg-red-500/10 text-red-300 border-red-500/30",
    yellow: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30",
    gray: "bg-slate-500/10 text-slate-400 border-slate-500/30",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md border tracking-wide",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
