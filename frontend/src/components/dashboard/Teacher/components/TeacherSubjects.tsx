import TeacherDashboard from "@/components/layout/teacher/TeacherDashboard";
import { currentStudent } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, FileText, Calendar, Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TeacherSubjects = () => {
  const subjects = [
    {
      id: 1,
      name: "Mathematics",
      description: "Advanced algebra, geometry, and calculus",
      grades: ["Grade 9", "Grade 10"],
      totalStudents: 53,
      assignments: 12,
      upcomingTests: 2,
      color: "bg-blue-500"
    },
    {
      id: 2,
      name: "Physics", 
      description: "Classical mechanics and thermodynamics",
      grades: ["Grade 11"],
      totalStudents: 22,
      assignments: 8,
      upcomingTests: 1,
      color: "bg-green-500"
    }
  ];

  const recentActivity = [
    { action: "Created assignment", subject: "Mathematics", time: "2 hours ago" },
    { action: "Graded quiz", subject: "Physics", time: "1 day ago" },
    { action: "Updated syllabus", subject: "Mathematics", time: "3 days ago" }
  ];

  return (
    <TeacherDashboard student={currentStudent} title="Subjects">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">My Subjects</h1>
            <p className="text-muted-foreground">Manage your teaching subjects and curriculum</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Subject
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="grid gap-6">
              {subjects.map((subject) => (
                <Card key={subject.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 ${subject.color} rounded-lg flex items-center justify-center`}>
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle>{subject.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{subject.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {subject.grades.map((grade) => (
                          <Badge key={grade} variant="outline">{grade}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          Students
                        </div>
                        <div className="text-2xl font-bold">{subject.totalStudents}</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          Assignments
                        </div>
                        <div className="text-2xl font-bold">{subject.assignments}</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Tests
                        </div>
                        <div className="text-2xl font-bold">{subject.upcomingTests}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">Manage</Button>
                      <Button size="sm" variant="outline">View Syllabus</Button>
                      <Button size="sm" variant="outline">Resources</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.subject}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TeacherDashboard>
  );
};

export default TeacherSubjects;
