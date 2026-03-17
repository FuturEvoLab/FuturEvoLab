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

  const emptyForm = {
    name: "", slug: "", description: "", type: "image" as "image" | "music",
    icon: "📁", color: "#7c3aed",
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchData(); }, []);

  const fetchData = () => {
    fetch("/api/categories").then(r => r.json()).then(data => {
      setCategories(data);
      setLoading(false);
    });
  };

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditTarget(c);
    setForm({ name: c.name, slug: c.slug, description: c.description, type: c.type, icon: c.icon, color: c.color });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = { ...form, slug: form.slug || slugify(form.name) };
    if (editTarget) {
      await fetch(`/api/categories/${editTarget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setSaving(false);
    setModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Templates using it will keep the ID.")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    fetchData();
  };

  const imageCategories = categories.filter((c) => c.type === "image");
  const musicCategories = categories.filter((c) => c.type === "music");

  return (
    <div className="space-y-6 pt-10 lg:pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">{categories.length} categories</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} /> New Category
        </Button>
      </div>

      {/* Image categories */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-800">
          <h2 className="text-sm font-semibold text-gray-300">
            🖼️ Image Categories ({imageCategories.length})
          </h2>
        </div>
        <CategoryTable
          categories={imageCategories}
          loading={loading}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Music categories */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-800">
          <h2 className="text-sm font-semibold text-gray-300">
            🎵 Music Categories ({musicCategories.length})
          </h2>
        </div>
        <CategoryTable
          categories={musicCategories}
          loading={loading}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? "Edit Category" : "New Category"}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))}
              required
            />
            <Input
              label="Slug"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              hint="URL-friendly identifier"
            />
          </div>
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={2}
          />
          <div className="grid grid-cols-3 gap-4">
            <Select
              label="Type"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as "image" | "music" }))}
              options={[{ value: "image", label: "Image" }, { value: "music", label: "Music" }]}
            />
            <Input
              label="Icon (emoji)"
              value={form.icon}
              onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
              placeholder="📁"
            />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300">Color</label>
              <input
                type="color"
                value={form.color}
                onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                className="w-full h-9 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t border-gray-800">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>
              {editTarget ? "Save Changes" : "Create Category"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function CategoryTable({
  categories, loading, onEdit, onDelete,
}: {
  categories: Category[];
  loading: boolean;
  onEdit: (c: Category) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Updated</th>
            <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/60">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <tr key={i}><td colSpan={5} className="px-5 py-4"><div className="h-5 rounded shimmer" /></td></tr>
            ))
          ) : categories.length === 0 ? (
            <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-600 text-sm">No categories yet</td></tr>
          ) : (
            categories.map((c) => (
              <tr key={c.id} className="hover:bg-gray-800/30 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{c.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-200">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <code className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{c.slug}</code>
                </td>
                <td className="px-5 py-3">
                  <Badge variant={c.type === "image" ? "purple" : "blue"}>{c.type}</Badge>
                </td>
                <td className="px-5 py-3 text-xs text-gray-500">{timeAgo(c.updatedAt)}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => onEdit(c)} className="p-1.5 rounded text-gray-500 hover:text-violet-400 transition-colors">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => onDelete(c.id)} className="p-1.5 rounded text-gray-500 hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
