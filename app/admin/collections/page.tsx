"use client";
import { useEffect, useState } from "react";
import { PromptCollection } from "@/lib/db";
import { slugify, timeAgo } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Breadcrumb from "@/components/admin/Breadcrumb";
import { useToast } from "@/components/ui/Toast";
import { Plus, Edit, Trash2, Layers, Zap, ExternalLink } from "lucide-react";
import Link from "next/link";

interface CollectionWithCount extends PromptCollection { count: number; }

export default function CollectionsPage() {
  const { success, error: toastError } = useToast();
  const [collections, setCollections] = useState<CollectionWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<CollectionWithCount | null>(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = { name: "", description: "", icon: "📁", color: "#00d4ff", type: "manual" as "manual" | "smart", query: "" };
  const [form, setForm] = useState(emptyForm);

  const fetchData = () => {
    fetch("/api/collections").then(r => r.json()).then(data => { setCollections(data); setLoading(false); });
  };
  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditTarget(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (c: CollectionWithCount) => {
    setEditTarget(c);
    setForm({ name: c.name, description: c.description, icon: c.icon, color: c.color, type: c.type, query: c.query });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toastError("Name required"); return; }
    setSaving(true);
    if (editTarget) {
      await fetch(`/api/collections/${editTarget.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      success("Collection updated");
    } else {
      await fetch("/api/collections", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      success("Collection created");
    }
    setSaving(false);
    setModalOpen(false);
    fetchData();
  };

  const handleDelete = async (col: CollectionWithCount) => {
    await fetch(`/api/collections/${col.id}`, { method: "DELETE" });
    success(`"${col.name}" deleted`);
    fetchData();
  };

  const smartQueryExamples = [
    { label: "Starred", value: "starred" },
    { label: "Image type", value: "type:image" },
    { label: "Music type", value: "type:music" },
    { label: "Tag: portrait", value: "tag:portrait" },
    { label: "Tag: cinematic", value: "tag:cinematic" },
  ];

  return (
    <div className="space-y-5 pt-14 lg:pt-0">
      <Breadcrumb />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-1">// Prompt Library</p>
          <h1 className="text-2xl font-black text-white tracking-tight">Collections</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/explore" target="_blank">
            <Button variant="secondary" size="sm"><ExternalLink size={12} /> View on Site</Button>
          </Link>
          <Button onClick={openCreate} size="sm"><Plus size={13} /> New Collection</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total", value: collections.length, accent: "gray" },
          { label: "Smart", value: collections.filter(c => c.type === "smart").length, accent: "cyan" },
          { label: "Manual", value: collections.filter(c => c.type === "manual").length, accent: "pink" },
        ].map(({ label, value, accent }) => (
          <div key={label} className={`bg-[#050508] rounded-xl p-3 border ${accent === "cyan" ? "border-[#00d4ff12]" : accent === "pink" ? "border-[#f472b612]" : "border-[#ffffff08]"}`}>
            <div className={`text-xl font-black ${accent === "cyan" ? "text-cyan-400" : accent === "pink" ? "text-pink-400" : "text-white"}`}>{value}</div>
            <div className="text-[9px] font-mono text-slate-600 uppercase tracking-wider mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#00d4ff15] to-transparent" />

      {/* Collections table */}
      <div className="bg-[#050508] border border-[#00d4ff0d] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#ffffff06]">
          <span className="text-[10px] font-mono text-cyan-700 uppercase tracking-widest">// All Collections ({collections.length})</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#ffffff06]">
                {["Collection", "Type", "Query / Items", "Prompts", "Updated", ""].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[9px] font-mono text-slate-600 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ffffff03]">
              {loading ? Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-5 rounded shimmer" /></td></tr>
              )) : collections.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-700 text-xs font-mono">NO COLLECTIONS YET</td></tr>
              ) : collections.map(col => (
                <tr key={col.id} className="hover:bg-white/2 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{col.icon}</span>
                      <div>
                        <p className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">{col.name}</p>
                        <p className="text-[10px] text-slate-700 font-mono">{col.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={col.type === "smart" ? "blue" : "purple"} className="text-[9px] flex items-center gap-1">
                      {col.type === "smart" ? <Zap size={8} /> : <Layers size={8} />}
                      {col.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {col.type === "smart" ? (
                      <code className="text-[10px] bg-black/60 text-cyan-600 border border-[#00d4ff15] px-2 py-0.5 rounded font-mono">{col.query}</code>
                    ) : (
                      <span className="text-[10px] text-slate-600 font-mono">{col.promptIds.length} items</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-bold text-white">{col.count}</span>
                  </td>
                  <td className="px-4 py-3 text-[10px] text-slate-700 font-mono">{timeAgo(col.updatedAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(col)} className="p-1.5 rounded text-slate-700 hover:text-cyan-400 transition-colors"><Edit size={12} /></button>
                      <button onClick={() => handleDelete(col)} className="p-1.5 rounded text-slate-700 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Smart query reference */}
      <div className="bg-[#050508] border border-[#00d4ff08] rounded-xl p-4">
        <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-3">// Smart Query Reference</p>
        <div className="flex flex-wrap gap-2">
          {smartQueryExamples.map(({ label, value }) => (
            <div key={value} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black border border-[#ffffff08] rounded-lg">
              <span className="text-[10px] text-slate-500">{label}:</span>
              <code className="text-[10px] text-cyan-600 font-mono">{value}</code>
            </div>
          ))}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? "Edit Collection" : "New Collection"}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            <div className="grid grid-cols-2 gap-2">
              <Input label="Icon (emoji)" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="📁" />
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest">Color</label>
                <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  className="w-full h-9 bg-black border border-[#00d4ff15] rounded-lg cursor-pointer" />
              </div>
            </div>
          </div>
          <Textarea label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
          <Select label="Type" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as "manual" | "smart" }))}
            options={[{ value: "manual", label: "Manual — add prompts explicitly" }, { value: "smart", label: "Smart — auto-filter by query" }]} />
          {form.type === "smart" && (
            <div className="space-y-2">
              <Input label="Query" value={form.query} onChange={e => setForm(f => ({ ...f, query: e.target.value }))}
                placeholder="e.g. starred, type:image, tag:portrait" hint="Auto-filters prompts matching this rule" />
              <div className="flex flex-wrap gap-1.5">
                {smartQueryExamples.map(({ label, value }) => (
                  <button key={value} onClick={() => setForm(f => ({ ...f, query: value }))}
                    className="px-2 py-1 bg-black border border-[#00d4ff15] rounded text-[9px] font-mono text-cyan-700 hover:text-cyan-400 hover:border-[#00d4ff35] transition-all">
                    {value}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-2 justify-end pt-2 border-t border-[#00d4ff0a]">
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave} loading={saving}>{editTarget ? "Save Changes" : "Create"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
