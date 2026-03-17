"use client";
import { useEffect, useState } from "react";
import { Category } from "@/lib/db";
import { slugify, timeAgo } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = { name: "", slug: "", description: "", type: "image" as "image" | "music", icon: "📁", color: "#00d4ff" };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchData(); }, []);

  const fetchData = () => {
    fetch("/api/categories").then(r => r.json()).then(data => { setCategories(data); setLoading(false); });
  };

  const openCreate = () => { setEditTarget(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (c: Category) => {
    setEditTarget(c);
    setForm({ name: c.name, slug: c.slug, description: c.description, type: c.type, icon: c.icon, color: c.color });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = { ...form, slug: form.slug || slugify(form.name) };
    if (editTarget) {
      await fetch(`/api/categories/${editTarget.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    } else {
      await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    }
    setSaving(false);
    setModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    fetchData();
  };

  const imageCategories = categories.filter((c) => c.type === "image");
  const musicCategories = categories.filter((c) => c.type === "music");

  const CatTable = ({ cats }: { cats: Category[] }) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#ffffff06]">
            {["Category", "Slug", "Type", "Updated", ""].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-[9px] font-mono text-slate-600 uppercase tracking-widest">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#ffffff03]">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <tr key={i}><td colSpan={5} className="px-4 py-3"><div className="h-5 rounded shimmer" /></td></tr>
            ))
          ) : cats.length === 0 ? (
            <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-700 text-xs font-mono">NO CATEGORIES YET</td></tr>
          ) : (
            cats.map((c) => (
              <tr key={c.id} className="hover:bg-white/2 transition-colors group">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{c.icon}</span>
                    <div>
                      <p className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">{c.name}</p>
                      <p className="text-[10px] text-slate-700 font-mono">{c.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <code className="text-[10px] bg-black/60 text-slate-500 border border-[#ffffff08] px-2 py-0.5 rounded font-mono">{c.slug}</code>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={c.type === "image" ? "blue" : "pink"} className="text-[9px]">{c.type}</Badge>
                </td>
                <td className="px-4 py-3 text-[10px] text-slate-700 font-mono">{timeAgo(c.updatedAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(c)} className="p-1.5 rounded text-slate-700 hover:text-cyan-400 transition-colors"><Edit size={12} /></button>
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded text-slate-700 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-5 pt-14 lg:pt-0">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-1">// Content</p>
          <h1 className="text-2xl font-black text-white tracking-tight">Categories</h1>
        </div>
        <Button onClick={openCreate} size="sm"><Plus size={13} /> New Category</Button>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#00d4ff15] to-transparent" />

      <div className="bg-[#050508] border border-[#00d4ff0d] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#ffffff06]">
          <span className="text-[10px] font-mono text-cyan-700 uppercase tracking-widest">// Image Categories ({imageCategories.length})</span>
        </div>
        <CatTable cats={imageCategories} />
      </div>

      <div className="bg-[#050508] border border-[#f472b60d] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#ffffff06]">
          <span className="text-[10px] font-mono text-pink-700 uppercase tracking-widest">// Music Categories ({musicCategories.length})</span>
        </div>
        <CatTable cats={musicCategories} />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? "Edit Category" : "New Category"}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))} required />
            <Input label="Slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} hint="URL-friendly ID" />
          </div>
          <Textarea label="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} />
          <div className="grid grid-cols-3 gap-3">
            <Select label="Type" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as "image" | "music" }))}
              options={[{ value: "image", label: "Image" }, { value: "music", label: "Music" }]} />
            <Input label="Icon (emoji)" value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} placeholder="📁" />
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest">Color</label>
              <input type="color" value={form.color} onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                className="w-full h-9 bg-black border border-[#00d4ff15] rounded-lg cursor-pointer" />
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-2 border-t border-[#00d4ff0a]">
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave} loading={saving}>{editTarget ? "Save Changes" : "Create"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
