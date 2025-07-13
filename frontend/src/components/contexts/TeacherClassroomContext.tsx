import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

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

const TeacherClassroomContext = createContext<
  TeacherClassroomContextType | undefined
>(undefined);

export const useTeacherClassroom = () => {
  const context = useContext(TeacherClassroomContext);
  if (context === undefined) {
    throw new Error(
      "useTeacherClassroom must be used within a TeacherClassroomProvider"
    );
  }
  return context;
};

interface TeacherClassroomProviderProps {
  children: ReactNode;
}

export const TeacherClassroomProvider: React.FC<
  TeacherClassroomProviderProps
> = ({ children }) => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selected, setSelected] = useState<Classroom | null>(null);
  const [_loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchMe = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3001/api/auth/me", {
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = (await res.json()) as {
          classAssigned?: string;
          classes?: string[];
        };
        const head = data.classAssigned ? [data.classAssigned] : [];
        const teach = Array.isArray(data.classes) ? data.classes : [];
        const combined = Array.from(new Set([...head, ...teach]));

        const list = combined.map((cls, idx) => ({
          id: Number(cls) || idx,
          name: `Class ${cls}`,
          students: 0,
          room: "",
          schedule: "",
          averageGrade: 0,
          attendance: 0,
          nextClass: "",
          subject: "",
          grade: "",
        }));

        setClassrooms(list);
        setSelected(list[0] || null);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  return (
    <TeacherClassroomContext.Provider
      value={{ classrooms, selectedClassroom: selected, setSelectedClassroom: setSelected }}
    >
      {children}
    </TeacherClassroomContext.Provider>
  );
};
