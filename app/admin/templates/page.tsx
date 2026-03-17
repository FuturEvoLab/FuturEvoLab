"use client";
import { useEffect, useState } from "react";
import { Template, Category } from "@/lib/db";
import { formatNumber, timeAgo } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { Plus, Edit, Trash2, Search, Star, TrendingUp, Eye, EyeOff } from "lucide-react";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    title: "", description: "", type: "image" as "image" | "music",
    categoryId: "", tags: "", exampleOutput: "",
    status: "active" as "active" | "inactive", featured: false,
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchData(); }, []);

  const fetchData = () => {
    Promise.all([
      fetch("/api/templates?status=active").then(r => r.json()),
      fetch("/api/templates?status=inactive").then(r => r.json()),
      fetch("/api/categories").then(r => r.json()),
    ]).then(([active, inactive, cats]) => {
      setTemplates([...active, ...inactive]);
      setCategories(cats);
      setLoading(false);
    });
  };

  const filtered = templates.filter((t) => {
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || t.type === filterType;
    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const openCreate = () => { setEditTarget(null); setForm(emptyForm); setModalOpen(true); };

  const openEdit = (t: Template) => {
    setEditTarget(t);
    setForm({
      title: t.title, description: t.description, type: t.type,
      categoryId: t.categoryId, tags: t.tags.join(", "),
      exampleOutput: t.exampleOutput, status: t.status, featured: t.featured,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = { ...form, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) };
    if (editTarget) {
      await fetch(`/api/templates/${editTarget.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    } else {
      await fetch("/api/templates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, fields: [] }) });
    }
    setSaving(false);
    setModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this template?")) return;
    await fetch(`/api/templates/${id}`, { method: "DELETE" });
    fetchData();
  };

  const toggleStatus = async (t: Template) => {
    await fetch(`/api/templates/${t.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: t.status === "active" ? "inactive" : "active" }) });
    fetchData();
  };

  const toggleFeatured = async (t: Template) => {
    await fetch(`/api/templates/${t.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ featured: !t.featured }) });
    fetchData();
  };

  return (
    <div className="space-y-5 pt-14 lg:pt-0">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-1">// Content</p>
          <h1 className="text-2xl font-black text-white tracking-tight">Templates</h1>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus size={13} /> New Template
        </Button>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#00d4ff15] to-transparent" />

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-44">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
          <input
            type="text" placeholder="Search..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black border border-[#00d4ff12] text-slate-300 placeholder-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono focus:outline-none focus:border-[#00d4ff35] transition-all"
          />
        </div>
        {["all", "image", "music"].map((v) => (
          <button key={v} onClick={() => setFilterType(v)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider border transition-all capitalize ${filterType === v ? "bg-cyan-500/12 border-cyan-500/35 text-cyan-300" : "bg-black border-[#ffffff0a] text-slate-600 hover:text-slate-300"}`}>
            {v}
          </button>
        ))}
        {["all", "active", "inactive"].map((v) => (
          <button key={v} onClick={() => setFilterStatus(v)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider border transition-all capitalize ${filterStatus === v ? "bg-pink-500/12 border-pink-500/35 text-pink-300" : "bg-black border-[#ffffff0a] text-slate-600 hover:text-slate-300"}`}>
            {v}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#050508] border border-[#00d4ff0d] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#ffffff06]">
                {["Template", "Type", "Category", "Usage", "Status", "Updated", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[9px] font-mono text-slate-600 uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ffffff03]">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="px-4 py-3"><div className="h-5 rounded-md shimmer" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-700 text-xs font-mono">
                    NO TEMPLATES FOUND
                  </td>
                </tr>
              ) : (
                filtered.map((t) => {
                  const cat = categories.find((c) => c.id === t.categoryId);
                  return (
                    <tr key={t.id} className="hover:bg-white/2 transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div>
                            <p className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">
                              {t.title}
                              {t.featured && <Star size={10} className="inline ml-1 text-yellow-400 fill-yellow-400" />}
                            </p>
                            <p className="text-[10px] text-slate-700 truncate max-w-40 font-mono">{t.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={t.type === "image" ? "blue" : "pink"} className="text-[9px]">{t.type}</Badge>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-slate-600">{cat?.name || "—"}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-xs font-mono text-slate-400">
                          <TrendingUp size={10} className="text-slate-600" />
                          {formatNumber(t.usageCount)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={t.status === "active" ? "green" : "gray"} className="text-[9px]">{t.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-[10px] text-slate-700 font-mono">{timeAgo(t.updatedAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => toggleFeatured(t)} className="p-1.5 rounded text-slate-700 hover:text-yellow-400 transition-colors">
                            <Star size={12} className={t.featured ? "fill-yellow-400 text-yellow-400" : ""} />
                          </button>
                          <button onClick={() => toggleStatus(t)} className="p-1.5 rounded text-slate-700 hover:text-cyan-400 transition-colors">
                            {t.status === "active" ? <EyeOff size={12} /> : <Eye size={12} />}
                          </button>
                          <button onClick={() => openEdit(t)} className="p-1.5 rounded text-slate-700 hover:text-cyan-400 transition-colors">
                            <Edit size={12} />
                          </button>
                          <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded text-slate-700 hover:text-red-400 transition-colors">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? "Edit Template" : "New Template"} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
            <Select label="Type" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as "image" | "music" }))}
              options={[{ value: "image", label: "Image" }, { value: "music", label: "Music" }]} />
          </div>
          <Textarea label="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Category" value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
              options={categories.filter((c) => c.type === form.type).map((c) => ({ value: c.id, label: `${c.icon} ${c.name}` }))}
              placeholder="Select category" />
            <Select label="Status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as "active" | "inactive" }))}
              options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]} />
          </div>
          <Input label="Tags (comma-separated)" value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} placeholder="portrait, cinematic, dark" />
          <Textarea label="Example Output" value={form.exampleOutput} onChange={(e) => setForm((f) => ({ ...f, exampleOutput: e.target.value }))} rows={3} placeholder="Example prompt..." />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} className="w-3.5 h-3.5 rounded accent-cyan-500" />
            <span className="text-xs text-slate-400 font-mono">Featured template</span>
          </label>
          <div className="flex gap-2 justify-end pt-2 border-t border-[#00d4ff0a]">
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave} loading={saving}>{editTarget ? "Save Changes" : "Create"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
