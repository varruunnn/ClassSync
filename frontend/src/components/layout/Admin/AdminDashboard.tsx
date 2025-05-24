
import type{ Student } from "@/types";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

 
 


interface TeacherDashboardProps {
  children: React.ReactNode;
  student: Student;
  title?: string;
}

export default function AdminDashboard({ children }: TeacherDashboardProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - Fixed */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 h-full">
        {/* Header - Fixed */}
        <AdminNavbar />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-100 p-2 relative  ">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
