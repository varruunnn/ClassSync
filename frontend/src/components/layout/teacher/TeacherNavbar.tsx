import type { Student } from "@/types";

import { ClassroomSelector } from "@/components/dashboard/Teacher/components/ClassroomSelector";

interface TeacherNavbarProps {
  student: Student;
  title?: string;
}

export default function TeacherNavbar({
  title = "Teacher Dashboard",
}: TeacherNavbarProps) {
  return (
    <header className="border-b bg-white py-4 px-10 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-700 ">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-4  max-[468px]:hidden">
        <ClassroomSelector />
      </div>
    </header>
  );
}
