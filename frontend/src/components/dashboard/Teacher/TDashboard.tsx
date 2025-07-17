import { StatsCard } from "./StatsCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  GraduationCap,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Target,
  UserCheck,
  BarChart3,
  ClipboardList,
  Home,
  Award,
} from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface RecentClass {
  id: number;
  name: string;
  students: number;
  present: number;
  time: string;
  room: string;
  type: string;
  nextClass: string;
}
interface Notice {
  _id: string;
  title: string;
  content: string;
  type: string;
  status: string;
  publishDate: string;
  targetAudience: string;
}
interface StudentExamData {
  studentId: string;
  email: string;
  marks: Array<{
    subjectId: string;
    marks: number;
  }>;
}
const Dashboard = () => {
  const [recentClasses, setRecentClasses] = useState<RecentClass[]>([]);
  const [assignmentCount, setAssignmentCount] = useState<number>(0);
  const [noticesCount, setNoticesCount] = useState<number>(0);
  const [noticesDescription, setNoticesDescription] = useState<string>("");
  const [classAssigned, setclassAssigned] = useState<string>("");
  const [classAverage, setClassAverage] = useState<number | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/teacher/classes"
        );

        const mapped: RecentClass[] = response.data.map(
          (item: any, index: number) => {
            return {
              id: index + 1,
              name: item.name,
              students: item.students,
              present: Math.floor((item.attendance / 100) * item.students),
              time: item.schedule,
              room: `Room ${item.room}`,
              type: "Subject",
              nextClass: item.nextClass,
            };
          }
        );

        setRecentClasses(mapped);
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      }
    };
    const fetchAssignments = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/assignments", {
          withCredentials: true,
        });
        const data = await res.data;
        setAssignmentCount(Array.isArray(data) ? data.length : 0);
      } catch (error) {
        console.error("Error loading assignments:", error);
        setAssignmentCount(0);
      }
    };
    const fetchNotices = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/notices/1", {
          withCredentials: true,
        });
        const data = await res.data;
        const filtered = (data.notices as Notice[]).filter(
          (n) => n.status === "published" && n.targetAudience === "teachers"
        );
        setNoticesCount(filtered.length);

        if (filtered.length > 0) {
          setNoticesDescription(filtered[0].title);
        } else {
          setNoticesDescription("No current notices");
        }
      } catch (error) {
        console.error("Error loading notices:", error);
        setNoticesCount(0);
        setNoticesDescription("Error loading");
      }
    };
    const fetchMyclass = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/auth/me", {
          withCredentials: true,
        });
        const data = await res.data;
        const filtered = data.classAssigned;
        setclassAssigned(filtered);
      } catch (error) {
        console.error("Error loading notices:", error);
        setNoticesCount(0);
        setNoticesDescription("Error loading");
      }
    };
    const fetchClassTestAverages = async () => {
      try {
        const res = await fetch(
          "http://localhost:3001/api/exams/latest/1?class=10&section=A&examType=classTest",
          { credentials: "include" }
        );
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const allMarks: number[] = json.data.flatMap(
            (entry: StudentExamData) =>
              entry.marks.map((markObj) => markObj.marks)
          );

          if (allMarks.length > 0) {
            const total = allMarks.reduce(
              (sum: number, mark: number) => sum + mark,
              0
            );
            const avg = total / allMarks.length;
            setClassAverage(avg);
          } else {
            setClassAverage(null);
          }
        }
      } catch (error) {
        console.error("Failed to fetch class test averages:", error);
        setClassAverage(null);
      }
    };

    fetchClasses();
    fetchAssignments();
    fetchNotices();
    fetchMyclass();
    fetchClassTestAverages();
  }, []);

  const recentAssignments = [
    {
      id: 1,
      title: "Algebra Quiz",
      subject: "Mathematics",
      dueDate: "Tomorrow",
      status: "pending",
      submitted: 18,
      total: 28,
      avgScore: null,
    },
    {
      id: 2,
      title: "Lab Report",
      subject: "Physics",
      dueDate: "Dec 20",
      status: "grading",
      submitted: 25,
      total: 25,
      avgScore: 78,
    },
    {
      id: 3,
      title: "Chemical Equations",
      subject: "Chemistry",
      dueDate: "Dec 18",
      status: "completed",
      submitted: 22,
      total: 22,
      avgScore: 85,
    },
  ];

  const studentInsights = [
    {
      name: "Emily Chen",
      class: "10A",
      concern: "Math struggling",
      priority: "high",
    },
    {
      name: "James Wilson",
      class: "11B",
      concern: "Excellent progress",
      priority: "low",
    },
    {
      name: "Sarah Davis",
      class: "12C",
      concern: "Attendance issues",
      priority: "medium",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-blue-600 ">
            Welcome back, Professor!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your classes today.
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Notices"
          value={noticesCount}
          icon={<UserCheck className="h-5 w-5 text-white" />}
          description={noticesDescription}
          variant="success"
        />
        <StatsCard
          title="Assignments Due"
          value={assignmentCount}
          icon={<ClipboardList className="h-5 w-5 text-white" />}
          description="This week"
          variant="warning"
        />
        <StatsCard
          title="My Class"
          value={classAssigned}
          icon={<Target className="h-5 w-5 text-white" />}
          description="On track for year-end"
          variant="cyan"
        />
        <StatsCard
          title="Class Average"
          value={
            classAverage !== null ? `${classAverage.toFixed(1)}%` : "Loading..."
          }
          icon={<Award className="h-5 w-5 text-white" />}
          variant="purple"
        />
      </div>

      {/* Quick Actions */}
      <DashboardCard
        title="Quick Actions"
        icon={<TrendingUp className="h-5 w-5 text-white" />}
        variant="cyan"
        className="col-span-full hover:scale-100 hover:shadow-none"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-16 cursor-pointer flex-col space-y-2 bg-white/10 border-white/30 text-white hover:bg-white/20"
            onClick={() => navigate("/teacher/notices")}
          >
            <Users className="h-5 w-5" />
            <span className="text-sm">Notices</span>
          </Button>
          <Button
            variant="outline"
            className="h-16 cursor-pointer flex-col space-y-2 bg-white/10 border-white/30 text-white hover:bg-white/20"
            onClick={() => navigate("/teacher/assignments")}
          >
            <Calendar className="h-5 w-5" />
            <span className="text-sm">Create Assignment</span>
          </Button>
          <Button
            variant="outline"
            className="h-16 cursor-pointer flex-col space-y-2 bg-white/10 border-white/30 text-white hover:bg-white/20"
            onClick={() => navigate("/teacher/gradebook")}
          >
            <GraduationCap className="h-5 w-5" />
            <span className="text-sm">Grade Papers</span>
          </Button>
          <Button
            variant="outline"
            className="h-16 cursor-pointer flex-col space-y-2 bg-white/10 border-white/30 text-white hover:bg-white/20"
            onClick={()=>navigate('/teacher/messages')}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-sm">Send Message</span>
          </Button>
        </div>
      </DashboardCard>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Today's Classes with Enhanced Details */}
        <DashboardCard
          className="bg-blue-200"
          title="Today's Classes"
          icon={<Home className="h-5 w-5 text-blue-600" />}
          variant="warning"
        >
          <div className="space-y-3">
            {recentClasses.map((classItem) => (
              <div
                key={classItem.id}
                className="p-3 bg-blue-300 rounded-lg hover:bg-blue-400 transition-colors border-l-4 border-l-white/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">{classItem.name}</h4>
                  <Badge
                    variant={
                      classItem.type === "Homeroom" ? "secondary" : "outline"
                    }
                    className="bg-white/20 text-white border-white/30"
                  >
                    {classItem.type}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-white/80">
                  <div className="flex justify-between">
                    <span> {classItem.room}</span>
                    <span>{classItem.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      {classItem.present}/{classItem.students} present
                    </span>
                    <span className="text-white font-semibold">
                      ✅{" "}
                      {Math.round(
                        (classItem.present / classItem.students) * 100
                      )}
                      %
                    </span>
                  </div>
                  <p className="text-white ">
                    Next Class: {classItem.nextClass}
                  </p>
                </div>
              </div>
            ))}
            <Link to="/teacher/classes">
              <Button
                variant="outline"
                className="w-full mt-3 bg-blue-300 border-white/30 text-white hover:bg-blue-400"
              >
                View All Classes
              </Button>
            </Link>
          </div>
        </DashboardCard>

        {/* Assignment Tracking */}
        <DashboardCard
          title="Assignment Tracking"
          icon={<ClipboardList className="h-5 w-5 text-white" />}
          variant="warning"
        >
          <div className="space-y-3">
            {recentAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="p-3 bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">{assignment.title}</h4>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs bg-white/20 border-white/30",
                      assignment.status === "completed"
                        ? "text-white"
                        : assignment.status === "grading"
                        ? "text-white"
                        : "text-white"
                    )}
                  >
                    {assignment.status === "completed" ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : assignment.status === "grading" ? (
                      <Clock className="w-3 h-3 mr-1" />
                    ) : (
                      <AlertCircle className="w-3 h-4 mr-1" />
                    )}
                    {assignment.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-white/80">
                  <p>
                    {assignment.subject} • Due {assignment.dueDate}
                  </p>
                  <div className="flex justify-between">
                    <span>
                      📝 {assignment.submitted}/{assignment.total} submitted
                    </span>
                    {assignment.avgScore && (
                      <span className="text-white font-semibold">
                        📊 Avg: {assignment.avgScore}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full mt-3 bg-yellow-500 border-white/30 text-white hover:bg-white/20"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Assignment Center
            </Button>
          </div>
        </DashboardCard>

        {/* Student Insights */}
        <DashboardCard
          title="Student Insights"
          icon={<Users className="h-5 w-5 text-white" />}
          variant="purple"
        >
          <div className="space-y-3">
            {studentInsights.map((student, index) => (
              <div
                key={index}
                className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-white">{student.name}</h4>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs bg-white/20 border-white/30 text-white"
                    )}
                  >
                    {student.priority === "high" ? (
                      <AlertCircle className="w-3 h-3 mr-1" />
                    ) : student.priority === "medium" ? (
                      <Clock className="w-3 h-3 mr-1" />
                    ) : (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    )}
                    {student.priority}
                  </Badge>
                </div>
                <p className="text-sm text-white/80">Class {student.class}</p>
                <p className="text-sm text-white">{student.concern}</p>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full mt-3 bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Student Reports
            </Button>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default Dashboard;
