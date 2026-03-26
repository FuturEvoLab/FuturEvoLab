"use client";
import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Modal({ open, onClose, title, children, size = "md" }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className={cn(
          "relative w-full bg-[#050510] border border-[#00d4ff25] rounded-2xl shadow-2xl animate-slide-up overflow-hidden",
          "shadow-[0_0_40px_rgba(0,212,255,0.08)]",
          sizes[size]
        )}
      >
        {/* Top glow line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#00d4ff12]">
            <h2 className="text-base font-bold text-white tracking-wide">{title}</h2>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-cyan-400 transition-colors rounded-lg p-1 hover:bg-[#00d4ff0d]"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>

        {/* Bottom glow line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />
      </div>
    </div>
  );
}
