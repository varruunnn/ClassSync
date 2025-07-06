import type{ Student } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, MessageSquare, Plus } from "lucide-react";
import { ClassroomSelector } from "@/components/dashboard/Teacher/components/ClassroomSelector";

interface TeacherNavbarProps {
  student: Student;
  title?: string;
}

export default function TeacherNavbar({ student, title = "Teacher Dashboard" }: TeacherNavbarProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  return (
    <header className="border-b bg-white py-4 px-10 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
      <ClassroomSelector />
      </div>
    </header>
  );
}
