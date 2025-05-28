import TeacherDashboard from "@/components/layout/teacher/TeacherDashboard";
import { currentStudent } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Upload, Search, Filter, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TeacherGradebook = () => {
  const students = [
    {
      id: 1,
      name: "Sarah Johnson",
      class: "Grade 10",
      assignments: { quiz1: 95, quiz2: 88, midterm: 92, project: 96 },
      average: 92.8,
      attendance: 98
    },
    {
      id: 2,
      name: "Michael Chen",
      class: "Grade 10", 
      assignments: { quiz1: 87, quiz2: 91, midterm: 85, project: 89 },
      average: 88.0,
      attendance: 95
    },
    {
      id: 3,
      name: "Emma Davis",
      class: "Grade 10",
      assignments: { quiz1: 92, quiz2: 94, midterm: 89, project: 93 },
      average: 92.0,
      attendance: 97
    },
    {
      id: 4,
      name: "James Wilson",
      class: "Grade 10",
      assignments: { quiz1: 78, quiz2: 82, midterm: 76, project: 84 },
      average: 80.0,
      attendance: 92
    }
  ];

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeBadge = (average: number) => {
    if (average >= 90) return { variant: 'default' as const, label: 'A' };
    if (average >= 80) return { variant: 'secondary' as const, label: 'B' };
    if (average >= 70) return { variant: 'outline' as const, label: 'C' };
    return { variant: 'destructive' as const, label: 'D' };
  };

  return (
    <TeacherDashboard student={currentStudent} title="Gradebook">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Gradebook</h1>
            <p className="text-muted-foreground">Track and manage student grades</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mathematics Grade 10 - Gradebook</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Student</th>
                    <th className="text-center p-3 font-medium">Quiz 1</th>
                    <th className="text-center p-3 font-medium">Quiz 2</th>
                    <th className="text-center p-3 font-medium">Midterm</th>
                    <th className="text-center p-3 font-medium">Project</th>
                    <th className="text-center p-3 font-medium">Average</th>
                    <th className="text-center p-3 font-medium">Grade</th>
                    <th className="text-center p-3 font-medium">Attendance</th>
                    <th className="text-center p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const gradeBadge = getGradeBadge(student.average);
                    return (
                      <tr key={student.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-muted-foreground">{student.class}</div>
                          </div>
                        </td>
                        <td className={`text-center p-3 font-medium ${getGradeColor(student.assignments.quiz1)}`}>
                          {student.assignments.quiz1}%
                        </td>
                        <td className={`text-center p-3 font-medium ${getGradeColor(student.assignments.quiz2)}`}>
                          {student.assignments.quiz2}%
                        </td>
                        <td className={`text-center p-3 font-medium ${getGradeColor(student.assignments.midterm)}`}>
                          {student.assignments.midterm}%
                        </td>
                        <td className={`text-center p-3 font-medium ${getGradeColor(student.assignments.project)}`}>
                          {student.assignments.project}%
                        </td>
                        <td className={`text-center p-3 font-bold ${getGradeColor(student.average)}`}>
                          {student.average}%
                        </td>
                        <td className="text-center p-3">
                          <Badge variant={gradeBadge.variant}>{gradeBadge.label}</Badge>
                        </td>
                        <td className="text-center p-3">
                          <span className={student.attendance >= 95 ? 'text-green-600' : student.attendance >= 90 ? 'text-yellow-600' : 'text-red-600'}>
                            {student.attendance}%
                          </span>
                        </td>
                        <td className="text-center p-3">
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Class Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Class Average:</span>
                  <span className="font-bold text-green-600">88.2%</span>
                </div>
                <div className="flex justify-between">
                  <span>Highest Grade:</span>
                  <span className="font-bold">92.8%</span>
                </div>
                <div className="flex justify-between">
                  <span>Lowest Grade:</span>
                  <span className="font-bold">80.0%</span>
                </div>
                <div className="flex justify-between">
                  <span>Passing Rate:</span>
                  <span className="font-bold text-green-600">100%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Grade Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>A (90-100%):</span>
                  <span className="font-bold">2 students</span>
                </div>
                <div className="flex justify-between">
                  <span>B (80-89%):</span>
                  <span className="font-bold">2 students</span>
                </div>
                <div className="flex justify-between">
                  <span>C (70-79%):</span>
                  <span className="font-bold">0 students</span>
                </div>
                <div className="flex justify-between">
                  <span>D (60-69%):</span>
                  <span className="font-bold">0 students</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full" size="sm">Add New Assignment</Button>
                <Button className="w-full" variant="outline" size="sm">Generate Report</Button>
                <Button className="w-full" variant="outline" size="sm">Send Progress Updates</Button>
                <Button className="w-full" variant="outline" size="sm">Schedule Parent Meeting</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TeacherDashboard>
  );
};

export default TeacherGradebook;
