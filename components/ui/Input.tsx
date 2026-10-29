import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest">
            {label}
            {props.required && <span className="text-pink-400 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full bg-black/60 border text-slate-200 placeholder-slate-600 rounded-lg px-3 py-2 text-sm",
            "transition-all duration-200",
            "focus:outline-none focus:ring-0",
            error
              ? "border-red-500/50 focus:border-red-400 focus:shadow-[0_0_12px_rgba(239,68,68,0.15)]"
              : "border-[#00d4ff1a] focus:border-[#00d4ff55] focus:shadow-[0_0_12px_rgba(0,212,255,0.12)]",
            className
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-slate-600">{hint}</p>}
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
export default Input;
