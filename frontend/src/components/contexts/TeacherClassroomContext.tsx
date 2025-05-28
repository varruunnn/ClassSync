import React, { createContext, useContext, useState, type ReactNode} from 'react';

interface Classroom {
  id: number;
  name: string;
  students: number;
  room: string;
  schedule: string;
  averageGrade: number;
  attendance: number;
  nextClass: string;
  subject: string;
  grade: string;
}

interface TeacherClassroomContextType {
  selectedClassroom: Classroom | null;
  setSelectedClassroom: (classroom: Classroom) => void;
  classrooms: Classroom[];
}

const TeacherClassroomContext = createContext<TeacherClassroomContextType | undefined>(undefined);

export const useTeacherClassroom = () => {
  const context = useContext(TeacherClassroomContext);
  if (context === undefined) {
    throw new Error('useTeacherClassroom must be used within a TeacherClassroomProvider');
  }
  return context;
};

const mockClassrooms: Classroom[] = [
  {
    id: 1,
    name: "Mathematics Grade 10",
    students: 25,
    room: "101",
    schedule: "Mon, Wed, Fri - 9:00 AM",
    averageGrade: 85,
    attendance: 92,
    nextClass: "Today 9:00 AM",
    subject: "Mathematics",
    grade: "Grade 10"
  },
  {
    id: 2,
    name: "Physics Grade 11", 
    students: 22,
    room: "Lab 1",
    schedule: "Tue, Thu - 11:00 AM",
    averageGrade: 78,
    attendance: 88,
    nextClass: "Tomorrow 11:00 AM",
    subject: "Physics",
    grade: "Grade 11"
  },
  {
    id: 3,
    name: "Mathematics Grade 9",
    students: 28,
    room: "102", 
    schedule: "Mon, Wed, Fri - 2:00 PM",
    averageGrade: 90,
    attendance: 95,
    nextClass: "Today 2:00 PM",
    subject: "Mathematics",
    grade: "Grade 9"
  }
];

interface TeacherClassroomProviderProps {
  children: ReactNode;
}

export const TeacherClassroomProvider: React.FC<TeacherClassroomProviderProps> = ({ children }) => {
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(mockClassrooms[0]);
  
  return (
    <TeacherClassroomContext.Provider 
      value={{ 
        selectedClassroom, 
        setSelectedClassroom, 
        classrooms: mockClassrooms 
      }}
    >
      {children}
    </TeacherClassroomContext.Provider>
  );
};