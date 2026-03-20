"use client";
import { useEffect, useState } from "react";
import { timeAgo } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import Breadcrumb from "@/components/admin/Breadcrumb";
import { Plus, Edit, Trash2, Crown, Shield, User } from "lucide-react";

interface AdminUser {
  id: string; email: string; name: string;
  role: string; createdAt: string; lastLoginAt: string | null;
}

export default function UsersPage() {
  const { toast, success, error: toastError } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminUser | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const emptyForm = { name: "", email: "", password: "", role: "editor" };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchData(); }, []);

  const fetchData = () => {
    fetch("/api/admin/users").then(r => r.json()).then(data => { setUsers(data); setLoading(false); });
  };

  const openCreate = () => { setEditTarget(null); setForm(emptyForm); setError(""); setModalOpen(true); };
  const openEdit = (u: AdminUser) => {
    setEditTarget(u);
    setForm({ name: u.name, email: u.email, password: "", role: u.role });
    setError("");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.email) { setError("Name and email required"); return; }
    if (!editTarget && !form.password) { setError("Password required for new users"); return; }
    setSaving(true); setError("");
    const payload: Record<string, string> = { name: form.name, email: form.email, role: form.role };
    if (form.password) payload.password = form.password;
    const res = await fetch(editTarget ? `/api/admin/users/${editTarget.id}` : "/api/admin/users", {
      method: editTarget ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Failed"); setSaving(false); return; }
    setSaving(false); setModalOpen(false);
    success(editTarget ? "User updated" : "User created");
    fetchData();
  };

  const handleDelete = async (id: string) => {
    toast("info", "Deleting user…");
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (!res.ok) { const d = await res.json(); toastError(d.error || "Delete failed"); return; }
    success("User deleted");
    fetchData();
  };

  const roleIcon = (role: string) => {
    if (role === "super_admin") return <Crown size={11} className="text-yellow-400" />;
    if (role === "admin") return <Shield size={11} className="text-cyan-400" />;
    return <User size={11} className="text-slate-500" />;
  };

  const roleBadge = (role: string) => {
    if (role === "super_admin") return <Badge variant="yellow" className="text-[9px]">Super Admin</Badge>;
    if (role === "admin") return <Badge variant="blue" className="text-[9px]">Admin</Badge>;
    return <Badge variant="gray" className="text-[9px]">Editor</Badge>;
  };

  return (
    <div className="space-y-5 pt-14 lg:pt-0">
      <Breadcrumb />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-1">// Access Control</p>
          <h1 className="text-2xl font-black text-white tracking-tight">Admin Users</h1>
        </div>
        <Button onClick={openCreate} size="sm"><Plus size={13} /> Add User</Button>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#00d4ff15] to-transparent" />

      <div className="bg-[#050508] border border-[#00d4ff0d] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#ffffff06]">
                {["User", "Role", "Last Login", "Created", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[9px] font-mono text-slate-600 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ffffff03]">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}><td colSpan={5} className="px-4 py-3"><div className="h-5 rounded shimmer" /></td></tr>
                ))
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/2 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500/20 to-fuchsia-600/20 border border-[#00d4ff20] flex items-center justify-center text-xs font-bold text-cyan-400 flex-shrink-0">
                          {u.name[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">{u.name}</p>
                          <p className="text-[10px] text-slate-600 font-mono">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {roleIcon(u.role)}
                        {roleBadge(u.role)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[10px] text-slate-600 font-mono">{u.lastLoginAt ? timeAgo(u.lastLoginAt) : "Never"}</td>
                    <td className="px-4 py-3 text-[10px] text-slate-700 font-mono">{timeAgo(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(u)} className="p-1.5 rounded text-slate-700 hover:text-cyan-400 transition-colors"><Edit size={12} /></button>
                        <button onClick={() => handleDelete(u.id)} className="p-1.5 rounded text-slate-700 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? "Edit User" : "Add Admin User"}>
        <div className="space-y-4">
          {error && <div className="px-3 py-2 bg-red-500/8 border border-red-500/25 rounded-lg text-xs text-red-400 font-mono">⚠ {error}</div>}
          <div className="grid grid-cols-2 gap-3">
            <Input label="Full Name" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label={editTarget ? "New Password (optional)" : "Password"} type="password" value={form.password} onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))} required={!editTarget} placeholder="••••••••" />
            <Select label="Role" value={form.role} onChange={(e) => setForm(f => ({ ...f, role: e.target.value }))}
              options={[{ value: "super_admin", label: "Super Admin" }, { value: "admin", label: "Admin" }, { value: "editor", label: "Editor" }]} />
          </div>
          <div className="flex gap-2 justify-end pt-2 border-t border-[#00d4ff0a]">
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave} loading={saving}>{editTarget ? "Save Changes" : "Create User"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
