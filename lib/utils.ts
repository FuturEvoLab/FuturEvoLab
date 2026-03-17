import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildPrompt(
  fields: Record<string, string | string[]>,
  template: {
    type: string;
    fields: { key: string; label: string; type: string }[];
    exampleOutput: string;
  }
): string {
  const parts: string[] = [];

  for (const field of template.fields) {
    const value = fields[field.key];
    if (!value || (Array.isArray(value) && value.length === 0)) continue;
    if (Array.isArray(value)) {
      parts.push(value.join(", "));
    } else {
      parts.push(value);
    }
  }

  if (template.type === "image") {
    parts.push("highly detailed", "4k resolution", "masterpiece quality");
  } else {
    parts.push("high fidelity audio", "professional quality");
  }

  return parts.filter(Boolean).join(", ");
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString();
}
