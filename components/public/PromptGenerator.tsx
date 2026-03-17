"use client";
import { useState, useCallback } from "react";
import { Copy, Check, Save, Wand2, RefreshCw, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import { Template, TemplateField } from "@/lib/db";
import { cn } from "@/lib/utils";

interface PromptGeneratorProps {
  template: Template;
  onSave?: (prompt: string) => void;
}

export default function PromptGenerator({ template, onSave }: PromptGeneratorProps) {
  const [values, setValues] = useState<Record<string, string | string[]>>(() => {
    const init: Record<string, string | string[]> = {};
    template.fields.forEach((f) => {
      if (f.type === "multiselect") init[f.key] = [];
      else init[f.key] = f.defaultValue || "";
    });
    return init;
  });
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const isImage = template.type === "image";

  const buildPrompt = useCallback(() => {
    const parts: string[] = [];
    template.fields.forEach((field) => {
      const value = values[field.key];
      if (!value || (Array.isArray(value) && value.length === 0)) return;
      if (Array.isArray(value)) parts.push(value.join(", "));
      else parts.push(value);
    });
    if (isImage) parts.push("highly detailed", "masterpiece quality", "8k resolution");
    else parts.push("high fidelity", "professional quality", "studio production");
    return parts.filter(Boolean).join(", ");
  }, [values, template, isImage]);

  const handleGenerate = () => setGenerated(buildPrompt());

  const handleReset = () => {
    const init: Record<string, string | string[]> = {};
    template.fields.forEach((f) => {
      if (f.type === "multiselect") init[f.key] = [];
      else init[f.key] = f.defaultValue || "";
    });
    setValues(init);
    setGenerated("");
  };

  const handleCopy = async () => {
    if (!generated) return;
    await navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!generated || !onSave) return;
    setSaving(true);
    try { onSave(generated); } finally { setSaving(false); }
  };

  const handleMultiSelect = (key: string, option: string) => {
    setValues((prev) => {
      const current = (prev[key] as string[]) || [];
      const next = current.includes(option) ? current.filter((v) => v !== option) : [...current, option];
      return { ...prev, [key]: next };
    });
  };

  const accent = isImage ? "cyan" : "pink";

  return (
    <div className="space-y-5">
      {/* Fields */}
      <div className="grid gap-4">
        {template.fields.map((field: TemplateField) => (
          <FieldRenderer
            key={field.id}
            field={field}
            value={values[field.key]}
            accent={accent}
            onChange={(v) => setValues((prev) => ({ ...prev, [field.key]: v }))}
            onMultiToggle={(opt) => handleMultiSelect(field.key, opt)}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap pt-1">
        <Button
          onClick={handleGenerate}
          size="lg"
          variant={isImage ? "primary" : "pink"}
          className="flex-1 sm:flex-none"
        >
          <Sparkles size={15} />
          Generate Prompt
        </Button>
        <Button variant="secondary" onClick={handleReset} size="lg">
          <RefreshCw size={13} />
          Reset
        </Button>
      </div>

      {/* Output */}
      {generated && (
        <div className="space-y-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-mono tracking-widest uppercase ${isImage ? "text-cyan-500" : "text-pink-500"}`}>
              // Generated Prompt
            </span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleCopy} className={copied ? "text-emerald-400" : ""}>
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? "Copied!" : "Copy"}
              </Button>
              {onSave && (
                <Button variant="outline" size="sm" onClick={handleSave} loading={saving}>
                  <Save size={13} />
                  Save
                </Button>
              )}
            </div>
          </div>
          <div className="prompt-output select-all cursor-text" onClick={handleCopy}>
            {generated}
          </div>
          <p className="text-[10px] text-slate-700 font-mono">
            Click to copy • Use in {isImage ? "Midjourney / DALL-E / Stable Diffusion" : "Suno / Udio / Stable Audio"}
          </p>
        </div>
      )}

      {/* Example output (when nothing generated yet) */}
      {!generated && template.exampleOutput && (
        <div className="space-y-2">
          <p className="text-[10px] text-slate-700 font-mono tracking-widest uppercase">// Example Output</p>
          <div className="prompt-output opacity-40 text-xs pointer-events-none">{template.exampleOutput}</div>
        </div>
      )}
    </div>
  );
}

function FieldRenderer({
  field, value, onChange, onMultiToggle, accent,
}: {
  field: TemplateField;
  value: string | string[];
  accent: "cyan" | "pink";
  onChange: (v: string | string[]) => void;
  onMultiToggle: (opt: string) => void;
}) {
  const focusClass = accent === "cyan"
    ? "focus:border-[#00d4ff50] focus:shadow-[0_0_12px_rgba(0,212,255,0.1)]"
    : "focus:border-[#f472b650] focus:shadow-[0_0_12px_rgba(244,114,182,0.1)]";

  const baseInput = cn(
    "w-full bg-black/50 border border-[#ffffff0d] text-slate-200 placeholder-slate-700 rounded-lg px-3 py-2 text-sm transition-all duration-200 focus:outline-none",
    focusClass
  );

  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
        {field.label}
        {field.required && <span className={`ml-1 ${accent === "cyan" ? "text-cyan-600" : "text-pink-600"}`}>*</span>}
      </label>
      {field.description && <p className="text-[11px] text-slate-700">{field.description}</p>}

      {field.type === "select" && (
        <select value={value as string} onChange={(e) => onChange(e.target.value)}
          className={cn(baseInput, "appearance-none cursor-pointer")}>
          <option value="" className="bg-[#0a0a14]">— Select —</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt} className="bg-[#0a0a14]">{opt}</option>
          ))}
        </select>
      )}

      {field.type === "multiselect" && (
        <div className="flex flex-wrap gap-1.5">
          {field.options?.map((opt) => {
            const selected = (value as string[]).includes(opt);
            return (
              <button key={opt} type="button" onClick={() => onMultiToggle(opt)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium transition-all border",
                  selected
                    ? accent === "cyan"
                      ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-[0_0_8px_rgba(0,212,255,0.1)]"
                      : "bg-pink-500/15 border-pink-500/50 text-pink-300 shadow-[0_0_8px_rgba(244,114,182,0.1)]"
                    : "bg-black/40 border-[#ffffff0a] text-slate-500 hover:border-[#ffffff20] hover:text-slate-300"
                )}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {field.type === "text" && (
        <input type="text" value={value as string} onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder} className={baseInput} />
      )}

      {field.type === "textarea" && (
        <textarea value={value as string} onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder} rows={3} className={cn(baseInput, "resize-none")} />
      )}

      {field.type === "number" && (
        <input type="number" value={value as string} onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder} className={baseInput} />
      )}
    </div>
  );
}
