"use client";
import { useState, useCallback } from "react";
import { Copy, Check, Save, Wand2, RefreshCw } from "lucide-react";
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

  const buildPrompt = useCallback(() => {
    const parts: string[] = [];

    template.fields.forEach((field) => {
      const value = values[field.key];
      if (!value || (Array.isArray(value) && value.length === 0)) return;
      if (Array.isArray(value)) {
        parts.push(value.join(", "));
      } else {
        parts.push(value);
      }
    });

    if (template.type === "image") {
      parts.push("highly detailed", "masterpiece quality", "8k resolution");
    } else {
      parts.push("high fidelity", "professional quality", "studio production");
    }

    return parts.filter(Boolean).join(", ");
  }, [values, template]);

  const handleGenerate = () => {
    const p = buildPrompt();
    setGenerated(p);
  };

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
    try {
      onSave(generated);
    } finally {
      setSaving(false);
    }
  };

  const handleMultiSelect = (key: string, option: string) => {
    setValues((prev) => {
      const current = (prev[key] as string[]) || [];
      const next = current.includes(option)
        ? current.filter((v) => v !== option)
        : [...current, option];
      return { ...prev, [key]: next };
    });
  };

  return (
    <div className="space-y-5">
      {/* Fields */}
      <div className="grid gap-4">
        {template.fields.map((field: TemplateField) => (
          <FieldRenderer
            key={field.id}
            field={field}
            value={values[field.key]}
            onChange={(v) => setValues((prev) => ({ ...prev, [field.key]: v }))}
            onMultiToggle={(opt) => handleMultiSelect(field.key, opt)}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <Button onClick={handleGenerate} size="lg" className="flex-1 sm:flex-none">
          <Wand2 size={16} />
          Generate Prompt
        </Button>
        <Button variant="secondary" onClick={handleReset} size="lg">
          <RefreshCw size={14} />
          Reset
        </Button>
      </div>

      {/* Output */}
      {generated && (
        <div className="space-y-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-300">Generated Prompt</h4>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy"}
              </Button>
              {onSave && (
                <Button variant="outline" size="sm" onClick={handleSave} loading={saving}>
                  <Save size={14} />
                  Save
                </Button>
              )}
            </div>
          </div>
          <div className="prompt-output select-all cursor-text">{generated}</div>
          <p className="text-xs text-gray-600">
            Click prompt to select all • Use in Midjourney, DALL-E, Stable Diffusion
            {template.type === "music" && " • Or in Suno, Udio, Stable Audio"}
          </p>
        </div>
      )}

      {/* Example */}
      {!generated && template.exampleOutput && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Example Output</p>
          <div className="prompt-output opacity-50 text-xs">{template.exampleOutput}</div>
        </div>
      )}
    </div>
  );
}

function FieldRenderer({
  field,
  value,
  onChange,
  onMultiToggle,
}: {
  field: TemplateField;
  value: string | string[];
  onChange: (v: string | string[]) => void;
  onMultiToggle: (opt: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-300">
        {field.label}
        {field.required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {field.description && <p className="text-xs text-gray-500">{field.description}</p>}

      {field.type === "select" && (
        <select
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-gray-800/60 border border-gray-700 text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        >
          <option value="">— Select —</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt} className="bg-gray-800">
              {opt}
            </option>
          ))}
        </select>
      )}

      {field.type === "multiselect" && (
        <div className="flex flex-wrap gap-2">
          {field.options?.map((opt) => {
            const selected = (value as string[]).includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onMultiToggle(opt)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                  selected
                    ? "bg-violet-600/30 border-violet-500 text-violet-200"
                    : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300"
                )}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {field.type === "text" && (
        <input
          type="text"
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="w-full bg-gray-800/60 border border-gray-700 text-gray-100 placeholder-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        />
      )}

      {field.type === "textarea" && (
        <textarea
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className="w-full bg-gray-800/60 border border-gray-700 text-gray-100 placeholder-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
        />
      )}

      {field.type === "number" && (
        <input
          type="number"
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="w-full bg-gray-800/60 border border-gray-700 text-gray-100 placeholder-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        />
      )}
    </div>
  );
}
