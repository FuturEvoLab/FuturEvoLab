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
import {
  Plus, Edit, Trash2, Search, Star, TrendingUp,
  ChevronDown, ChevronUp, Eye, EyeOff
} from "lucide-react";

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
    categoryId: "", tags: "", exampleOutput: "", status: "active" as "active" | "inactive",
    featured: false,
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchData();
  }, []);

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

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

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
    const payload = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    if (editTarget) {
      await fetch(`/api/templates/${editTarget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, fields: [] }),
      });
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
    await fetch(`/api/templates/${t.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: t.status === "active" ? "inactive" : "active" }),
    });
    fetchData();
  };

  const toggleFeatured = async (t: Template) => {
    await fetch(`/api/templates/${t.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !t.featured }),
    });
    fetchData();
  };

  return (
    <div className="space-y-6 pt-10 lg:pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Templates</h1>
          <p className="text-sm text-gray-500 mt-1">{templates.length} total templates</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} /> New Template
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 text-gray-300 placeholder-gray-600 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-gray-900 border border-gray-800 text-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="all">All Types</option>
          <option value="image">Image</option>
          <option value="music">Music</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-gray-900 border border-gray-800 text-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="px-5 py-4">
                      <div className="h-6 rounded shimmer" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-600 text-sm">
                    No templates found
                  </td>
                </tr>
              ) : (
                filtered.map((t) => {
                  const cat = categories.find((c) => c.id === t.categoryId);
                  return (
                    <tr key={t.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-sm font-medium text-gray-200">{t.title}</p>
                            <p className="text-xs text-gray-500 truncate max-w-48">{t.description}</p>
                          </div>
                          {t.featured && (
                            <Star size={12} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant={t.type === "image" ? "purple" : "blue"}>{t.type}</Badge>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-400">{cat?.name || "—"}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1 text-sm text-gray-300">
                          <TrendingUp size={12} className="text-gray-500" />
                          {formatNumber(t.usageCount)}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant={t.status === "active" ? "green" : "gray"}>{t.status}</Badge>
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-500">{timeAgo(t.updatedAt)}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => toggleFeatured(t)}
                            className="p-1.5 rounded text-gray-500 hover:text-yellow-400 transition-colors"
                            title={t.featured ? "Unfeature" : "Feature"}
                          >
                            <Star size={14} className={t.featured ? "fill-yellow-400 text-yellow-400" : ""} />
                          </button>
                          <button
                            onClick={() => toggleStatus(t)}
                            className="p-1.5 rounded text-gray-500 hover:text-blue-400 transition-colors"
                            title={t.status === "active" ? "Deactivate" : "Activate"}
                          >
                            {t.status === "active" ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                          <button
                            onClick={() => openEdit(t)}
                            className="p-1.5 rounded text-gray-500 hover:text-violet-400 transition-colors"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="p-1.5 rounded text-gray-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
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

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? "Edit Template" : "New Template"}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
            <Select
              label="Type"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as "image" | "music" }))}
              options={[{ value: "image", label: "Image" }, { value: "music", label: "Music" }]}
            />
          </div>
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={2}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              value={form.categoryId}
              onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
              options={categories
                .filter((c) => c.type === form.type)
                .map((c) => ({ value: c.id, label: `${c.icon} ${c.name}` }))}
              placeholder="Select category"
            />
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as "active" | "inactive" }))}
              options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]}
            />
          </div>
          <Input
            label="Tags (comma-separated)"
            value={form.tags}
            onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
            placeholder="portrait, cinematic, dark"
          />
          <Textarea
            label="Example Output"
            value={form.exampleOutput}
            onChange={(e) => setForm((f) => ({ ...f, exampleOutput: e.target.value }))}
            rows={3}
            placeholder="Example generated prompt..."
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              className="w-4 h-4 rounded accent-violet-600"
            />
            <span className="text-sm text-gray-300">Featured template</span>
          </label>
          <div className="flex gap-3 justify-end pt-2 border-t border-gray-800">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>
              {editTarget ? "Save Changes" : "Create Template"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
