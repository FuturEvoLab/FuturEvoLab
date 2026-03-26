import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminSessionProvider from "@/components/admin/AdminSessionProvider";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <AdminSessionProvider session={session}>
      <div className="min-h-screen bg-[#050510] flex">
        <AdminSidebar />
        <main className="flex-1 min-w-0 lg:ml-64">
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </AdminSessionProvider>
  );
}
