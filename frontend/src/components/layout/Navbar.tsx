import type { Student } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface NavbarProps {
  student: Student;
  title?: string;
}

export default function Navbar({ student, title = "Student Dashboard" }: NavbarProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  return (
    <header className="border-b bg-white py-4 px-6 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline">Help</Button>
        <Avatar>
          <AvatarImage src={student.avatar} />
          <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
