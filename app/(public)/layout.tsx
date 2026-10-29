import { SessionProvider } from "next-auth/react";
import AdminFloatingBar from "@/components/public/AdminFloatingBar";
import { ToastProvider } from "@/components/ui/Toast";
import PublicSessionWrapper from "@/components/public/PublicSessionWrapper";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <PublicSessionWrapper>
      <ToastProvider>
        {children}
        <AdminFloatingBar />
      </ToastProvider>
    </PublicSessionWrapper>
  );
}
