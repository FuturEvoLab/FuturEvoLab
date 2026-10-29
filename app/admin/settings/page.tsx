"use client";
import { useEffect, useState } from "react";
import { SiteSettings } from "@/lib/db";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import Breadcrumb from "@/components/admin/Breadcrumb";
import { Save, CheckCircle, AlertTriangle, Terminal } from "lucide-react";

export default function SettingsPage() {
  const { success, error: toastError } = useToast();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings").then(r => r.json()).then(data => { setSettings(data); setLoading(false); });
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
    setSaving(false);
    setSaved(true);
    success("Settings saved successfully");
    setTimeout(() => setSaved(false), 3000);
  };

  const handleClearPrompts = async () => {
    setClearing(true);
    const res = await fetch("/api/prompts/clear", { method: "DELETE" });
    setClearing(false);
    if (res.ok) {
      success("All saved prompts cleared");
    } else {
      toastError("Failed to clear prompts");
    }
  };

  if (loading || !settings) {
    return (
      <div className="pt-14 lg:pt-0 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 rounded-xl shimmer" />)}
      </div>
    );
  }

  const toggleClass = (enabled: boolean) =>
    `relative w-10 h-5 rounded-full transition-all cursor-pointer ${enabled ? "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_10px_rgba(0,212,255,0.3)]" : "bg-[#ffffff0d] border border-[#ffffff12]"}`;

  return (
    <div className="space-y-5 pt-14 lg:pt-0">
      <Breadcrumb />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-1">// Configuration</p>
          <h1 className="text-2xl font-black text-white tracking-tight">Site Settings</h1>
        </div>
        <Button onClick={handleSave} loading={saving} size="sm">
          {saved ? <CheckCircle size={13} className="text-emerald-400" /> : <Save size={13} />}
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#00d4ff15] to-transparent" />

      {saved && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/8 border border-emerald-500/25 rounded-xl text-xs text-emerald-400 font-mono">
          <CheckCircle size={13} /> SETTINGS SAVED SUCCESSFULLY
        </div>
      )}

      <div className="grid gap-4">
        {/* General */}
        <div className="bg-[#050508] border border-[#00d4ff0d] rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Terminal size={12} className="text-cyan-600" />
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">General Configuration</span>
          </div>
          <Input label="Site Name" value={settings.siteName} onChange={(e) => setSettings(s => s ? { ...s, siteName: e.target.value } : s)} />
          <Textarea label="Site Description" value={settings.siteDescription} onChange={(e) => setSettings(s => s ? { ...s, siteDescription: e.target.value } : s)} rows={2} />
          <Input label="Admin Email" type="email" value={settings.adminEmail} onChange={(e) => setSettings(s => s ? { ...s, adminEmail: e.target.value } : s)} />
        </div>

        {/* Behavior */}
        <div className="bg-[#050508] border border-[#00d4ff0d] rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Terminal size={12} className="text-cyan-600" />
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Behavior</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Max Prompts Per Session" type="number" value={settings.maxPromptsPerSession} onChange={(e) => setSettings(s => s ? { ...s, maxPromptsPerSession: parseInt(e.target.value) } : s)} />
            <Input label="Featured Templates Count" type="number" value={settings.featuredTemplatesCount} onChange={(e) => setSettings(s => s ? { ...s, featuredTemplatesCount: parseInt(e.target.value) } : s)} />
          </div>

          <div className="space-y-3 pt-1">
            {[
              { key: "allowPublicSave", label: "Allow Public Prompt Saving", desc: "Let visitors save prompts without login" },
              { key: "analyticsEnabled", label: "Enable Analytics", desc: "Track usage counts and statistics" },
            ].map(({ key, label, desc }) => (
              <label key={key} className="flex items-center justify-between gap-4 cursor-pointer group">
                <div>
                  <p className="text-sm text-slate-300 group-hover:text-white transition-colors">{label}</p>
                  <p className="text-[10px] text-slate-600 font-mono">{desc}</p>
                </div>
                <div
                  className={toggleClass(settings[key as keyof SiteSettings] as boolean)}
                  onClick={() => setSettings(s => s ? { ...s, [key]: !s[key as keyof SiteSettings] } : s)}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${(settings[key as keyof SiteSettings] as boolean) ? "left-5" : "left-0.5"}`} />
                </div>
              </label>
            ))}

            {/* Maintenance mode — dangerous */}
            <label className="flex items-center justify-between gap-4 cursor-pointer group px-3 py-2 rounded-lg bg-red-500/5 border border-red-500/15">
              <div>
                <p className="text-sm text-red-300">Maintenance Mode</p>
                <p className="text-[10px] text-slate-600 font-mono">Show maintenance page to public visitors</p>
              </div>
              <div
                className={`relative w-10 h-5 rounded-full transition-all cursor-pointer ${settings.maintenanceMode ? "bg-gradient-to-r from-red-600 to-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]" : "bg-[#ffffff0d] border border-[#ffffff12]"}`}
                onClick={() => setSettings(s => s ? { ...s, maintenanceMode: !s.maintenanceMode } : s)}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${settings.maintenanceMode ? "left-5" : "left-0.5"}`} />
              </div>
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-950/15 border border-red-900/30 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={13} className="text-red-500" />
            <span className="text-[10px] font-mono text-red-700 uppercase tracking-widest">Danger Zone</span>
          </div>
          <p className="text-xs text-red-900 font-mono mb-4">Irreversible actions. Proceed with extreme caution.</p>
          <Button variant="danger" size="sm" loading={clearing} onClick={handleClearPrompts}>
            Clear All Saved Prompts
          </Button>
        </div>
      </div>
    </div>
  );
}
