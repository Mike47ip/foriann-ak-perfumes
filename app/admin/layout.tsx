import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f2ea]">
      <AdminSidebar />
      <main className="md:ml-64 p-6 pt-16 md:pt-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}