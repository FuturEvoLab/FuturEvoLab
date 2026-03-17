import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "purple" | "green" | "blue" | "red" | "yellow" | "gray";
  className?: string;
}

export default function Badge({ children, variant = "purple", className }: BadgeProps) {
  const variants = {
    purple: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    green: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    red: "bg-red-500/20 text-red-300 border-red-500/30",
    yellow: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    gray: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
