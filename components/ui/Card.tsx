import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export default function Card({ children, className, glow }: CardProps) {
  return (
    <div
      className={cn(
        "bg-gray-900/80 border border-gray-800 rounded-xl backdrop-blur-sm",
        glow && "shadow-lg shadow-violet-500/10 hover:shadow-violet-500/20 transition-shadow",
        className
      )}
    >
      {children}
    </div>
  );
}
