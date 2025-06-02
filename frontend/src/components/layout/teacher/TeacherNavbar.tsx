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
          <p className="text-sm text-gray-500">Welcome back, Prof. Johnson</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
      <ClassroomSelector />
        <div className="hidden md:flex items-center gap-2">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Assignment
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <MessageSquare className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-green-500">
              3
            </Badge>
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500">
              5
            </Badge>
          </Button>
        </div>
        
        <Avatar className="h-8 w-8">
          <AvatarImage src={student.avatar} />
          <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
