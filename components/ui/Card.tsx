import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: "blue" | "pink" | boolean;
}

export default function Card({ children, className, glow }: CardProps) {
  return (
    <div
      className={cn(
        "bg-[#0a0a14] border border-[#00d4ff15] rounded-xl backdrop-blur-sm",
        "transition-all duration-200",
        glow === "pink"
          ? "hover:border-[#f472b640] hover:shadow-[0_0_20px_rgba(244,114,182,0.08)]"
          : glow
          ? "hover:border-[#00d4ff40] hover:shadow-[0_0_20px_rgba(0,212,255,0.08)]"
          : "",
        className
      )}
    >
      {children}
    </div>
  );
}
