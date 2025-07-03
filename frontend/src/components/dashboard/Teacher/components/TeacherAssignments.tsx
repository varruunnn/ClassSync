
import TeacherDashboard from "@/components/layout/teacher/TeacherDashboardLayout";
import { currentStudent } from "@/data/mockData";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  FileText,
  Calendar,
  Users,
  Clock,
  Plus,
  Search,
  Filter,
  Eye
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const TeacherAssignments = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const assignments = [
    {
      id: 1,
      title: "Algebra Quiz Chapter 5",
      subject: "Mathematics",
      class: "Grade 10",
      dueDate: "2025-05-28",
      submissions: 18,
      totalStudents: 25,
      status: "active",
      priority: "high",
      fileUrl: "/Applied-ML.pdf"
    },
    {
      id: 2,
      title: "Physics Lab Report - Momentum",
      subject: "Physics",
      class: "Grade 11",
      dueDate: "2025-05-30",
      submissions: 15,
      totalStudents: 22,
      status: "active",
      priority: "medium",
      fileUrl: "/sample-pdfs/physics-lab.pdf"
    },
    {
      id: 3,
      title: "Geometry Problem Set",
      subject: "Mathematics",
      class: "Grade 9",
      dueDate: "2025-06-02",
      submissions: 22,
      totalStudents: 28,
      status: "draft",
      priority: "low",
      fileUrl: "/sample-pdfs/geometry-problems.pdf"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'draft': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <TeacherDashboard student={currentStudent} title="Assignments">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Assignments</h1>
            <p className="text-muted-foreground">Create and manage student assignments</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Assignment
            </Button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {assignments.map((assignment) => (
            <Card
              key={assignment.id}
              className="hover:shadow-xl hover:scale-[1.01] transition-all duration-200"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {assignment.title}
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(assignment.status)}`} />
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground flex-wrap">
                        <span>{assignment.subject}</span>
                        <span>•</span>
                        <span>{assignment.class}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant={getPriorityColor(assignment.priority)}>{assignment.priority}</Badge>
                    <Badge variant="outline" className="capitalize">{assignment.status}</Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{assignment.totalStudents} students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{Math.max(0, Math.ceil((new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days left</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Submissions</span>
                    <span>{assignment.submissions}/{assignment.totalStudents}</span>
                  </div>
                  <Progress value={(assignment.submissions / assignment.totalStudents) * 100} className="h-2" />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" onClick={() => setSelectedFile(assignment.fileUrl)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View File
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-full max-w-3xl h-[80vh]">
                      <DialogHeader>
                        <DialogTitle>{assignment.title} – File Preview</DialogTitle>
                      </DialogHeader>
                      <iframe
                        src={selectedFile || ""}
                        className="w-full h-full border rounded"
                        title="Assignment File"
                      />
                    </DialogContent>
                  </Dialog>

                  <Button size="sm" variant="outline">Edit</Button>
                  <Button size="sm" variant="outline">Grade</Button>
                  {assignment.status === 'draft' && (
                    <Button size="sm" variant="outline">Publish</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </TeacherDashboard>
  );
};

export default TeacherAssignments;
