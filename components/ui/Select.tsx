import { cn } from "@/lib/utils";
import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: string[] | { value: string; label: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest">
            {label}
            {props.required && <span className="text-pink-400 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            "w-full bg-black/60 border text-slate-200 rounded-lg px-3 py-2 text-sm",
            "transition-all duration-200 appearance-none cursor-pointer",
            "focus:outline-none focus:ring-0",
            error
              ? "border-red-500/50"
              : "border-[#00d4ff1a] focus:border-[#00d4ff55] focus:shadow-[0_0_12px_rgba(0,212,255,0.12)]",
            className
          )}
          {...props}
        >
          {placeholder && <option value="" className="bg-[#0a0a14]">{placeholder}</option>}
          {options.map((opt) => {
            const value = typeof opt === "string" ? opt : opt.value;
            const label = typeof opt === "string" ? opt : opt.label;
            return (
              <option key={value} value={value} className="bg-[#0a0a14] text-slate-200">
                {label}
              </option>
            );
          })}
        </select>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
export default Select;
