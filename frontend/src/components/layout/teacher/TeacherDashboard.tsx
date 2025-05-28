import type{ Student } from "@/types";

import TeacherNavbar from "./TeacherNavbar";
import TeacherSidebar from "./TeacherSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TeacherClassroomProvider } from "@/components/contexts/TeacherClassroomContext";


interface TeacherDashboardProps {
  children: React.ReactNode;
  student: Student;
  title?: string;
}

export default function TeacherDashboard({ children, student, title }: TeacherDashboardProps) {
  return (
    <TeacherClassroomProvider> 
    <SidebarProvider defaultOpen={true}>
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - Fixed */}
      <TeacherSidebar student={student}/>

      {/* Main Content */}
      <div className="flex flex-col flex-1 h-full">
        {/* Header - Fixed */}
        <TeacherNavbar  student={student} title={title}/>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-100 p-2 relative  ">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
    </SidebarProvider>
    </TeacherClassroomProvider>
  );
}
