"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle, AlertCircle, Info, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  toast: (type: ToastType, title: string, message?: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev.slice(-3), { id, type, title, message }]);
    setTimeout(() => dismiss(id), type === "error" ? 5000 : 3000);
  }, [dismiss]);

  const success = useCallback((title: string, msg?: string) => toast("success", title, msg), [toast]);
  const error = useCallback((title: string, msg?: string) => toast("error", title, msg), [toast]);
  const info = useCallback((title: string, msg?: string) => toast("info", title, msg), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: Zap,
};

const styles = {
  success: {
    border: "border-emerald-500/30",
    icon: "text-emerald-400",
    glow: "shadow-[0_0_20px_rgba(52,211,153,0.12)]",
    bar: "bg-emerald-400",
  },
  error: {
    border: "border-red-500/30",
    icon: "text-red-400",
    glow: "shadow-[0_0_20px_rgba(239,68,68,0.15)]",
    bar: "bg-red-400",
  },
  info: {
    border: "border-cyan-500/30",
    icon: "text-cyan-400",
    glow: "shadow-[0_0_20px_rgba(0,212,255,0.12)]",
    bar: "bg-cyan-400",
  },
  warning: {
    border: "border-yellow-500/30",
    icon: "text-yellow-400",
    glow: "shadow-[0_0_20px_rgba(250,204,21,0.12)]",
    bar: "bg-yellow-400",
  },
};

function ToastItem({ toast: t, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const Icon = icons[t.type];
  const s = styles[t.type];

  return (
    <div
      className={cn(
        "pointer-events-auto relative w-72 bg-[#050510] border rounded-xl overflow-hidden animate-slide-up",
        s.border, s.glow
      )}
    >
      {/* Top line */}
      <div className={`absolute top-0 left-0 right-0 h-px opacity-60 ${s.bar}`} />

      <div className="flex items-start gap-3 p-3.5">
        <Icon size={15} className={cn("flex-shrink-0 mt-0.5", s.icon)} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white leading-snug">{t.title}</p>
          {t.message && <p className="text-[11px] text-slate-500 mt-0.5 font-mono leading-relaxed">{t.message}</p>}
        </div>
        <button
          onClick={() => onDismiss(t.id)}
          className="text-slate-600 hover:text-slate-300 transition-colors flex-shrink-0"
        >
          <X size={13} />
        </button>
      </div>

      {/* Progress bar */}
      <div className={cn("absolute bottom-0 left-0 h-0.5 opacity-40", s.bar)}
        style={{ animation: `shrink ${t.type === "error" ? 5 : 3}s linear forwards` }}
      />

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
