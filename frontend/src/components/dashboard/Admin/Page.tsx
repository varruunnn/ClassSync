import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  GraduationCap,
  BookOpen,
  Bell,
  Calendar,
  TrendingUp,
  UserCheck,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const recentActivities = [
  {
    id: 1,
    title: "New exam schedule published",
    description: "Final exams scheduled for June 2025",
    time: "2 hours ago",
    icon: Calendar,
    type: "info",
  },
  {
    id: 2,
    title: "Teacher assignment updated",
    description: "Sarah Johnson assigned to Class 5A",
    time: "5 hours ago",
    icon: UserCheck,
    type: "success",
  },
  {
    id: 3,
    title: "New notice published",
    description: "Sports day announcement posted",
    time: "1 day ago",
    icon: Bell,
    type: "info",
  },
  {
    id: 4,
    title: "Student enrollment",
    description: "5 new students enrolled in Class 6B",
    time: "2 days ago",
    icon: GraduationCap,
    type: "success",
  },
];

const quickActions = [
  {
    title: "Manage Teachers",
    description: "Add, edit, or remove teaching staff",
    href: "/admin/teachers",
    icon: Users,
    color: "bg-blue-50 hover:bg-blue-100 text-blue-700",
  },
  {
    title: "Manage Students",
    description: "View and manage student records",
    href: "/admin/students",
    icon: GraduationCap,
    color: "bg-green-50 hover:bg-green-100 text-green-700",
  },
  {
    title: "Assign Teachers",
    description: "Assign teachers to classes",
    href: "/admin/assign",
    icon: UserCheck,
    color: "bg-purple-50 hover:bg-purple-100 text-purple-700",
  },
  {
    title: "Notice Board",
    description: "Create and manage notices",
    href: "/admin/notices",
    icon: Bell,
    color: "bg-orange-50 hover:bg-orange-100 text-orange-700",
  },
];

export default function AdminDashboard() {
   const { isAuthenticated, userRole, schoolId: ctxSchoolId, loading } = useAuth();
  const [stats, setStats] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
    useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || userRole !== "admin") {
        navigate("/login");
      }
    }
  }, [isAuthenticated, userRole, loading, navigate]);
  useEffect(() => {
    const fetchStats = async () => {
      const storedSchoolId = localStorage.getItem("schoolId");
      if (!storedSchoolId) {
        setError("Missing schoolId");
        setLoadingStats(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3001/api/admin/${storedSchoolId}/stats`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const json = await response.json();
          throw new Error(json.error || "Failed to fetch stats");
        }

        const data: {
          totalTeachers: number;
          totalStudents: number;
          activeClasses?: number;
          pendingNotices?: number;
        } = await response.json();

        setStats([
          {
            title: "Total Teachers",
            value: data.totalTeachers ?? 0,
            description: "Active teaching staff",
            icon: Users,
            trend: `+${(data.totalTeachers ?? 0) % 10} this month`,
            color: "text-blue-600",
          },
          {
            title: "Total Students",
            value: data.totalStudents ?? 0,
            description: "Enrolled students",
            icon: GraduationCap,
            trend: `+${(data.totalStudents ?? 0) % 20} this month`,
            color: "text-green-600",
          },
          {
            title: "Active Classes",
            value: data.activeClasses ?? 0,
            description: "Running classes",
            icon: BookOpen,
            trend: "No change",
            color: "text-purple-600",
          },
          {
            title: "Pending Notices",
            value: data.pendingNotices ?? 0,
            description: "Awaiting approval",
            icon: Bell,
            trend: "-2 from last week",
            color: "text-orange-600",
          },
        ]);
      } catch (err: any) {
        console.error("Error fetching stats:", err);
        setError(err.message);
      } finally {
        setLoadingStats(false);
      }
    };
    if (!loading && isAuthenticated && userRole === "admin") {
      fetchStats();
    }
  }, [isAuthenticated, userRole, loading]);

  if (loading || loadingStats) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p>Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening at your school today.
        </p>
      </div>
      {loading && (
        <p className="text-sm text-muted-foreground">Loading stats...</p>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <div className="mt-2 flex items-center text-xs">
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-600">{stat.trend}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest updates and changes in your school
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div
                    className={`rounded-full p-2 ${
                      activity.type === "success"
                        ? "bg-green-100"
                        : "bg-blue-100"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        activity.type === "success"
                          ? "text-green-600"
                          : "text-blue-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {activity.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Frequently used administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.title} to={action.href}>
                  <div
                    className={`rounded-lg border p-4 transition-colors hover:bg-accent ${action.color}`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5" />
                      <div className="flex-1">
                        <h3 className="font-medium">{action.title}</h3>
                        <p className="text-sm opacity-80">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Class Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Class Overview</CardTitle>
          <CardDescription>
            Current class assignments and teacher allocations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                class: "5A",
                teacher: "Sarah Johnson",
                students: 28,
                subject: "Mathematics",
              },
              {
                class: "6B",
                teacher: "Emily Davis",
                students: 25,
                subject: "Science",
              },
              {
                class: "4C",
                teacher: "Lisa Anderson",
                students: 30,
                subject: "Art",
              },
              {
                class: "3A",
                teacher: "Not Assigned",
                students: 22,
                subject: "-",
              },
              {
                class: "2B",
                teacher: "Not Assigned",
                students: 26,
                subject: "-",
              },
              {
                class: "1A",
                teacher: "Not Assigned",
                students: 24,
                subject: "-",
              },
            ].map((classInfo) => (
              <div key={classInfo.class} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Class {classInfo.class}</h3>
                  <Badge
                    variant={
                      classInfo.teacher === "Not Assigned"
                        ? "secondary"
                        : "default"
                    }
                  >
                    {classInfo.students} students
                  </Badge>
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Teacher: {classInfo.teacher}
                  </p>
                  {classInfo.subject !== "-" && (
                    <p className="text-sm text-muted-foreground">
                      Subject: {classInfo.subject}
                    </p>
                  )}
                </div>
                {classInfo.teacher === "Not Assigned" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3 w-full"
                    asChild
                  >
                    <Link to="/admin/assign">Assign Teacher</Link>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
