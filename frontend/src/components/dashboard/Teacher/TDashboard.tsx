import { StatsCard } from "./StatsCard";
import { Button } from "@/components/ui/button";
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
  Plus,
  Target,
  UserCheck,
  BarChart3,
  BookMarked,
  ClipboardList,
  Home,
  Award,
  Bell,
} from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  // Mock data for demonstration
  const recentClasses = [
    {
      id: 1,
      name: "Mathematics Grade 10A",
      students: 28,
      present: 26,
      time: "9:00 AM",
      room: "Room 201",
      type: "Homeroom",
      nextTopic: "Quadratic Equations",
    },
    {
      id: 2,
      name: "Physics Grade 11B",
      students: 25,
      present: 23,
      time: "11:00 AM",
      room: "Lab 3",
      type: "Subject",
      nextTopic: "Wave Motion",
    },
    {
      id: 3,
      name: "Chemistry Grade 12C",
      students: 22,
      present: 21,
      time: "2:00 PM",
      room: "Lab 1",
      type: "Subject",
      nextTopic: "Organic Compounds",
    },
  ];

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

  const upcomingEvents = [
    {
      id: 1,
      title: "Parent-Teacher Conference",
      date: "Dec 15",
      time: "3:00 PM",
      type: "meeting",
    },
    {
      id: 2,
      title: "Science Fair Preparation",
      date: "Dec 18",
      time: "1:00 PM",
      type: "event",
    },
    {
      id: 3,
      title: "Final Exams Begin",
      date: "Dec 22",
      time: "9:00 AM",
      type: "exam",
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

  const curriculumProgress = [
    { subject: "Mathematics", completion: 75, onTrack: true },
    { subject: "Physics", completion: 68, onTrack: true },
    { subject: "Chemistry", completion: 82, onTrack: true },
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
        <Button className="bg-blue-600 shadow-glow hover:shadow-purple transform hover:scale-105 transition-all duration-300">
          <Plus className="w-4 h-4 mr-2" />
          Quick Action
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Present Today"
          value="92%"
          icon={<UserCheck className="h-5 w-5 text-white" />}
          description="144 of 156 students"
          variant="success"
        />
        <StatsCard
          title="Assignments Due"
          value={7}
          icon={<ClipboardList className="h-5 w-5 text-white" />}
          description="This week"
          variant="warning"
        />
        <StatsCard
          title="Curriculum Progress"
          value="76%"
          icon={<Target className="h-5 w-5 text-white" />}
          description="On track for year-end"
         
          variant="cyan"
        />
        <StatsCard
          title="Class Average"
          value="B+"
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
            className="h-16 flex-col space-y-2 bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            <Users className="h-5 w-5" />
            <span className="text-sm">Add Student</span>
          </Button>
          <Button
            variant="outline"
            className="h-16 flex-col space-y-2 bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            <Calendar className="h-5 w-5" />
            <span className="text-sm">Create Assignment</span>
          </Button>
          <Button
            variant="outline"
            className="h-16 flex-col space-y-2 bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            <GraduationCap className="h-5 w-5" />
            <span className="text-sm">Grade Papers</span>
          </Button>
          <Button
            variant="outline"
            className="h-16 flex-col space-y-2 bg-white/10 border-white/30 text-white hover:bg-white/20"
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
                    <span>🕒 {classItem.time}</span>
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
                  <p className="text-white font-medium">
                    Next: {classItem.nextTopic}
                  </p>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full mt-3 bg-blue-300 border-white/30 text-white hover:bg-blue-400"
            >
              View All Classes
            </Button>
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

      {/* Secondary Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Curriculum Progress */}
        <DashboardCard
          title="Curriculum Progress"
          icon={<Target className="h-5 w-5 text-white" />}
          variant="emerald"
        >
          <div className="space-y-4">
            {curriculumProgress.map((subject, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white">
                    {subject.subject}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-white/80">
                      {subject.completion}%
                    </span>
                    {subject.onTrack ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{ width: `${subject.completion}%` }}
                  ></div>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full mt-4 bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <BookMarked className="w-4 h-4 mr-2" />
              Curriculum Planner
            </Button>
          </div>
        </DashboardCard>

        {/* Upcoming Events & Reminders */}
        <DashboardCard
          title="Events & Reminders"
          icon={<Bell className="h-5 w-5 text-white" />}
          variant="rose"
        >
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-start space-x-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <div
                  className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                    event.type === "exam"
                      ? "bg-white"
                      : event.type === "meeting"
                      ? "bg-white/80"
                      : "bg-white/60"
                  }`}
                ></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-white">{event.title}</h4>
                    <Badge
                      variant="outline"
                      className="text-xs bg-white/20 border-white/30 text-white"
                    >
                      {event.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-white/80">
                    📅 {event.date} at {event.time}
                  </p>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full mt-3 bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Full Calendar
            </Button>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default Dashboard;
