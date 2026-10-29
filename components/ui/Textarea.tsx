import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest">
            {label}
            {props.required && <span className="text-pink-400 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full bg-black/60 border text-slate-200 placeholder-slate-600 rounded-lg px-3 py-2 text-sm resize-none",
            "transition-all duration-200",
            "focus:outline-none focus:ring-0",
            error
              ? "border-red-500/50"
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
Textarea.displayName = "Textarea";
export default Textarea;
