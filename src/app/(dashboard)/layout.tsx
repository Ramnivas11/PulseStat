import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Fixed sidebar — desktop only */}
      <div className="hidden md:flex md:w-64 lg:w-72 shrink-0 flex-col border-r">
        <Sidebar />
      </div>

      <div className="flex flex-1 flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
