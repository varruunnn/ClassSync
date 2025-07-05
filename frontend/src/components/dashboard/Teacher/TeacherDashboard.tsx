import { useEffect } from "react";
import TeacherDashboard from "@/components/layout/teacher/TeacherDashboardLayout";
import { currentStudent } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  BookOpen,
  FileText,
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Star,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";
import { useTeacherClassroom } from "@/components/contexts/TeacherClassroomContext";
import { useNavigate } from "react-router-dom";

const TeacherDashboardPage = () => {
  const { selectedClassroom } = useTeacherClassroom();
  const navigate = useNavigate()
  const {
    isAuthenticated,
    userRole,
    schoolId: ctxSchoolId,
    loading,
  } = useAuth();
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate("/login");
      }
    }
  }, [isAuthenticated, userRole, loading, navigate]);

  const teacherStats = {
    totalStudents: selectedClassroom?.students || 0,
    activeClasses: 5,
    pendingAssignments: 8,
    upcomingTests: 3,
    averageGrade: selectedClassroom?.averageGrade || 0,
    attendanceRate: selectedClassroom?.attendance || 0,
  };

  const recentClasses = [
    {
      id: 1,
      name: selectedClassroom?.name || "No class selected",
      time: "9:00 AM",
      students: selectedClassroom?.students || 0,
      room: selectedClassroom?.room || "N/A",
      status: "ongoing",
    },
    {
      id: 2,
      name: "Physics Grade 11",
      time: "11:00 AM",
      students: 22,
      room: "Lab 1",
      status: "upcoming",
    },
    {
      id: 3,
      name: "Mathematics Grade 9",
      time: "2:00 PM",
      students: 28,
      room: "102",
      status: "completed",
    },
  ];

  const pendingGrading = [
    {
      id: 1,
      assignment: "Algebra Quiz",
      subject: selectedClassroom?.subject || "Mathematics",
      submissions: 24,
      total: selectedClassroom?.students || 25,
      dueDate: "2025-05-24",
      priority: "high",
    },
    {
      id: 2,
      assignment: "Physics Lab Report",
      subject: "Physics",
      submissions: 20,
      total: 22,
      dueDate: "2025-05-25",
      priority: "medium",
    },
    {
      id: 3,
      assignment: "Geometry Test",
      subject: selectedClassroom?.subject || "Mathematics",
      submissions: 22,
      total: selectedClassroom?.students || 28,
      dueDate: "2025-05-26",
      priority: "low",
    },
  ];

  const topPerformers = [
    {
      name: "Sarah Johnson",
      subject: selectedClassroom?.subject || "Mathematics",
      grade: 98,
      improvement: "+5%",
    },
    { name: "Michael Chen", subject: "Physics", grade: 96, improvement: "+3%" },
    {
      name: "Emma Davis",
      subject: selectedClassroom?.subject || "Mathematics",
      grade: 94,
      improvement: "+7%",
    },
  ];

  const quickActions = [
    {
      title: "Create Assignment",
      icon: FileText,
      color: "bg-blue-500",
      path: "/teacher/assignments/new",
    },
    {
      title: "Schedule Test",
      icon: Calendar,
      color: "bg-green-500",
      path: "/teacher/tests/new",
    },
    {
      title: "Grade Papers",
      icon: CheckCircle,
      color: "bg-orange-500",
      path: "/teacher/grading",
    },
    {
      title: "View Analytics",
      icon: TrendingUp,
      color: "bg-purple-500",
      path: "/teacher/analytics",
    },
  ];

  return (
    <TeacherDashboard student={currentStudent} title="Teacher Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Good Morning, Prof. Johnson! 👋
              </h1>
              <p className="text-blue-100">
                {selectedClassroom
                  ? `Teaching ${selectedClassroom.name} - ${selectedClassroom.students} students in Room ${selectedClassroom.room}`
                  : "Select a classroom to view specific data"}
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <div className="text-2xl font-bold">
                  {teacherStats.averageGrade}%
                </div>
                <div className="text-sm text-blue-100">Class Average</div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Classroom Info */}
        {selectedClassroom && (
          <Card className="border-l-4 border-l-blue-500 bg-blue-50">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Room</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {selectedClassroom.room}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Students</p>
                  <p className="text-2xl font-bold text-green-600">
                    {selectedClassroom.students}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Attendance</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {selectedClassroom.attendance}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Next Class</p>
                  <p className="text-sm font-medium text-gray-800">
                    {selectedClassroom.nextClass}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Card
              key={action.title}
              className="hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <CardContent className="p-4 text-center">
                <div
                  className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
                >
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-medium text-sm">{action.title}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Students
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {teacherStats.totalStudents}
                  </p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Current Class
                  </p>
                </div>
                <Users className="h-12 w-12 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Class Average</p>
                  <p className="text-3xl font-bold text-green-600">
                    {teacherStats.averageGrade}%
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedClassroom?.name || "Select class"}
                  </p>
                </div>
                <BookOpen className="h-12 w-12 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Attendance Rate
                  </p>
                  <p className="text-3xl font-bold text-orange-600">
                    {teacherStats.attendanceRate}%
                  </p>
                  <p className="text-xs text-orange-600">This month</p>
                </div>
                <FileText className="h-12 w-12 text-orange-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentClasses.map((class_) => (
                  <div
                    key={class_.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          class_.status === "ongoing"
                            ? "bg-green-500"
                            : class_.status === "upcoming"
                            ? "bg-blue-500"
                            : "bg-gray-400"
                        }`}
                      />
                      <div>
                        <h4 className="font-medium">{class_.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Room {class_.room} • {class_.students} students
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          class_.status === "ongoing" ? "default" : "outline"
                        }
                      >
                        {class_.time}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Top Performers This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((student) => (
                  <div
                    key={student.name}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full">
                        <Award className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{student.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {student.subject}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        {student.grade}%
                      </div>
                      <div className="text-xs text-green-600">
                        {student.improvement}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Grading - Enhanced */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Pending Grading Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingGrading.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-2 h-12 rounded-full ${
                        item.priority === "high"
                          ? "bg-red-500"
                          : item.priority === "medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    />
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        {item.assignment}
                        {item.priority === "high" && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {item.subject}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="text-xs">
                          <Progress
                            value={(item.submissions / item.total) * 100}
                            className="w-20 h-2"
                          />
                          <span className="text-muted-foreground">
                            {item.submissions}/{item.total} submitted
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Button size="sm" className="mb-2">
                      Grade Now
                    </Button>
                    <div className="text-xs text-muted-foreground">
                      Due {new Date(item.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TeacherDashboard>
  );
};

export default TeacherDashboardPage;
