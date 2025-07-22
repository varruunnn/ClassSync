import { useEffect, useState } from "react";
import axios from "axios";
import TeacherDashboard from "@/components/layout/teacher/TeacherDashboardLayout";
import { currentStudent } from "@/data/mockData";
import {
  Card,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type subjectInfo = {
  id: string;
  name: string;
  description: string;
  grades: string[];
  totalStudents: number;
  assignments: number;
  upcomingTests: number;
  color: string;
};

const TeacherSubjects = () => {
  const [subjects, setSubjects] = useState<subjectInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/auth/me", {
          withCredentials: true 
        });
        const data = res.data;

        const subjectInfo: subjectInfo = {
          id: data.Id,
          name: data.subject.charAt(0).toUpperCase() + data.subject.slice(1),
          description: `Curriculum for Class ${data.classAssigned}`,
          grades: [`Grade ${data.classAssigned}`],
          totalStudents: 45,  // mock
          assignments: 10,    // mock
          upcomingTests: 2,   // mock
          color: "bg-purple-500"
        };

        setSubjects([subjectInfo]);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <TeacherDashboard student={currentStudent} title="Subjects">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">My Subjects</h1>
            <p className="text-muted-foreground">
              Manage your teaching subjects and curriculum
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject: any) => (
            <Card key={subject.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${subject.color} rounded-lg flex items-center justify-center`}>
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle>{subject.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {subject.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {subject.grades.map((grade: string) => (
                      <Badge key={grade} variant="outline">
                        {grade}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </TeacherDashboard>
  );
};

export default TeacherSubjects;
