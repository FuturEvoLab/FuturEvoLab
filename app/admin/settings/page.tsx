"use client";
import { useEffect, useState } from "react";
import { SiteSettings } from "@/lib/db";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { Save, AlertTriangle, CheckCircle } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings").then(r => r.json()).then(data => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading || !settings) {
    return (
      <div className="pt-10 lg:pt-0 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl shimmer" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-10 lg:pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Site Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure your prompt studio</p>
        </div>
        <Button onClick={handleSave} loading={saving}>
          {saved ? <CheckCircle size={16} className="text-green-400" /> : <Save size={16} />}
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      {saved && (
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-sm text-emerald-300">
          <CheckCircle size={16} />
          Settings saved successfully!
        </div>
      )}

      <div className="grid gap-6">
        {/* General */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">General</h2>
          <div className="grid gap-4">
            <Input
              label="Site Name"
              value={settings.siteName}
              onChange={(e) => setSettings((s) => s ? { ...s, siteName: e.target.value } : s)}
            />
            <Textarea
              label="Site Description"
              value={settings.siteDescription}
              onChange={(e) => setSettings((s) => s ? { ...s, siteDescription: e.target.value } : s)}
              rows={2}
            />
            <Input
              label="Admin Email"
              type="email"
              value={settings.adminEmail}
              onChange={(e) => setSettings((s) => s ? { ...s, adminEmail: e.target.value } : s)}
            />
          </div>
        </div>

        {/* Behavior */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Behavior</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Max Prompts Per Session"
              type="number"
              value={settings.maxPromptsPerSession}
              onChange={(e) => setSettings((s) => s ? { ...s, maxPromptsPerSession: parseInt(e.target.value) } : s)}
            />
            <Input
              label="Featured Templates Count"
              type="number"
              value={settings.featuredTemplatesCount}
              onChange={(e) => setSettings((s) => s ? { ...s, featuredTemplatesCount: parseInt(e.target.value) } : s)}
            />
          </div>

          <div className="space-y-3">
            {[
              { key: "allowPublicSave", label: "Allow Public Prompt Saving", desc: "Let visitors save prompts without login" },
              { key: "analyticsEnabled", label: "Enable Analytics", desc: "Track usage counts and statistics" },
              { key: "maintenanceMode", label: "Maintenance Mode", desc: "Show maintenance page to public visitors", danger: true },
            ].map(({ key, label, desc, danger }) => (
              <label key={key} className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={settings[key as keyof SiteSettings] as boolean}
                  onChange={(e) => setSettings((s) => s ? { ...s, [key]: e.target.checked } : s)}
                  className="mt-0.5 w-4 h-4 rounded accent-violet-600 cursor-pointer"
                />
                <div>
                  <p className={`text-sm font-medium ${danger ? "text-red-300" : "text-gray-200"}`}>{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-red-400" />
            <h2 className="text-sm font-semibold text-red-300">Danger Zone</h2>
          </div>
          <p className="text-xs text-red-400/70 mb-4">
            These actions are irreversible. Proceed with caution.
          </p>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              if (confirm("Are you sure you want to delete ALL saved prompts? This cannot be undone.")) {
                // Would need a dedicated endpoint; skip for now
                alert("This feature requires a dedicated API endpoint. Implement as needed.");
              }
            }}
          >
            Clear All Saved Prompts
          </Button>
        </div>
      </div>
    </div>
  );
}
