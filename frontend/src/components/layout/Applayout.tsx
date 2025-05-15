import { SidebarProvider } from "@/components/ui/sidebar";
import type { Student } from "@/types";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface DashboardProps {
  children: React.ReactNode;
  student: Student;
}

export default function Applayout({ children, student }: DashboardProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar student={student} />

        <div className="flex-1">
          <Navbar student={student} />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}