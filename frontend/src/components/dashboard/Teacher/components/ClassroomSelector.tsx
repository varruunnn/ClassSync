import { useTeacherClassroom } from "@/components/contexts/TeacherClassroomContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap } from "lucide-react";

export const ClassroomSelector = () => {
  const { selectedClassroom, setSelectedClassroom, classrooms } = useTeacherClassroom();

  const handleClassroomChange = (classroomId: string) => {
    const classroom = classrooms.find(c => c.id.toString() === classroomId);
    if (classroom) {
      setSelectedClassroom(classroom);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <GraduationCap className="h-5 w-5 text-gray-600" />
      <Select
        value={selectedClassroom?.id.toString() || ""}
        onValueChange={handleClassroomChange}
      >
        <SelectTrigger className="w-[280px] bg-white border-gray-200">
          <SelectValue placeholder="Select a classroom" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg">
          {classrooms.map((classroom) => (
            <SelectItem 
              key={classroom.id} 
              value={classroom.id.toString()}
              className="hover:bg-gray-50"
            >
              <div className="flex flex-col">
                <span className="font-medium">{classroom.name}</span>
                <span className="text-xs text-gray-500">
                  Room {classroom.room} • {classroom.students} students
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};