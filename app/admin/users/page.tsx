"use client";
import { useEffect, useState } from "react";
import { timeAgo } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Plus, Edit, Trash2, Shield, User, Crown } from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  lastLoginAt: string | null;
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminUser | null>(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = { name: "", email: "", password: "", role: "editor" };
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => { fetchData(); }, []);

  const fetchData = () => {
    fetch("/api/admin/users").then(r => r.json()).then(data => {
      setUsers(data);
      setLoading(false);
    });
  };

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (u: AdminUser) => {
    setEditTarget(u);
    setForm({ name: u.name, email: u.email, password: "", role: u.role });
    setError("");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.email) { setError("Name and email are required"); return; }
    if (!editTarget && !form.password) { setError("Password is required for new users"); return; }
    setSaving(true);
    setError("");

    const payload: Record<string, string> = { name: form.name, email: form.email, role: form.role };
    if (form.password) payload.password = form.password;

    const url = editTarget ? `/api/admin/users/${editTarget.id}` : "/api/admin/users";
    const method = editTarget ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to save");
      setSaving(false);
      return;
    }
    setSaving(false);
    setModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this admin user?")) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error);
      return;
    }
    fetchData();
  };

  const roleIcon = (role: string) => {
    if (role === "super_admin") return <Crown size={12} className="text-yellow-400" />;
    if (role === "admin") return <Shield size={12} className="text-violet-400" />;
    return <User size={12} className="text-gray-400" />;
  };

  const roleBadge = (role: string) => {
    if (role === "super_admin") return <Badge variant="yellow">Super Admin</Badge>;
    if (role === "admin") return <Badge variant="purple">Admin</Badge>;
    return <Badge variant="gray">Editor</Badge>;
  };

  return (
    <div className="space-y-6 pt-10 lg:pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Users</h1>
          <p className="text-sm text-gray-500 mt-1">{users.length} users</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} /> Add User
        </Button>
      </div>

      <div className="bg-gray-900/80 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}><td colSpan={5} className="px-5 py-4"><div className="h-5 rounded shimmer" /></td></tr>
                ))
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-sm font-bold text-violet-300">
                          {u.name[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-200">{u.name}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        {roleIcon(u.role)}
                        {roleBadge(u.role)}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-500">
                      {u.lastLoginAt ? timeAgo(u.lastLoginAt) : "Never"}
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-500">{timeAgo(u.createdAt)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(u)} className="p-1.5 rounded text-gray-500 hover:text-violet-400 transition-colors">
                          <Edit size={14} />
                        </button>
                        <button onClick={() => handleDelete(u.id)} className="p-1.5 rounded text-gray-500 hover:text-red-400 transition-colors">
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
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? "Edit Admin User" : "Add Admin User"}
      >
        <div className="space-y-4">
          {error && (
            <div className="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label={editTarget ? "New Password (leave empty to keep)" : "Password"}
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required={!editTarget}
              placeholder="••••••••"
            />
            <Select
              label="Role"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              options={[
                { value: "super_admin", label: "Super Admin" },
                { value: "admin", label: "Admin" },
                { value: "editor", label: "Editor" },
              ]}
            />
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t border-gray-800">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>
              {editTarget ? "Save Changes" : "Create User"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
