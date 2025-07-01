import { useEffect, useState } from "react";
import {
  recentTests,
  performanceStats,
  performanceHistory,
} from "@/data/mockData";
import PerformanceOverview from "@/components/dashboard/Students/PerformanceOverview";
import RecentTests from "@/components/dashboard/Students/RecentTests";
import PerformanceChart from "@/components/dashboard/Students/PerformanceChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  User,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface Subject {
  id: string;
  name: string;
  code: string;
  teacher: string;
  grade?: string;
  completedAssignments?: number;
  totalAssignments?: number;
  nextTest?: string;
  color?: string;
}

interface StudentInfo {
  name: string;
  class: string;
  section: string;
  rollNumber: string;
  email: string;
}

interface AttendanceData {
  presentDays: number;
  totalDays: number;
  attendancePercentage: number;
  monthlyRecord: boolean[];
}

const Index = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(true);
  const [loadingStudentInfo, setLoadingStudentInfo] = useState(true);

  const {
    isAuthenticated,
    userRole,
    schoolId: ctxSchoolId,
    loading,
  } = useAuth();
  const [subjectError, setSubjectError] = useState<string | null>(null);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(
    null
  );
  const navigate = useNavigate();

  const subjectColors = [
    "bg-blue-50 border-blue-200 text-blue-800",
    "bg-green-50 border-green-200 text-green-800",
    "bg-purple-50 border-purple-200 text-purple-800",
    "bg-orange-50 border-orange-200 text-orange-800",
    "bg-pink-50 border-pink-200 text-pink-800",
    "bg-indigo-50 border-indigo-200 text-indigo-800",
    "bg-yellow-50 border-yellow-200 text-yellow-800",
    "bg-red-50 border-red-200 text-red-800",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingSubjects(true);
        setLoadingStudentInfo(true);
        setLoadingAttendance(true);
        const res1 = await fetch(
          "http://localhost:3001/api/students/subjects/me",
          {
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!res1.ok) throw new Error(`Subjects error ${res1.status}`);
        const subjectsData = await res1.json();
        const enhancedSubjects = (subjectsData.subjects || []).map(
          (subjectName: string, index: number) => ({
            id: `subject-${index}`,
            name: subjectName,
            code: `SUB-${String(index + 1).padStart(3, "0")}`,
            color: subjectColors[index % subjectColors.length],
            completedAssignments: Math.floor(Math.random() * 10) + 5,
            totalAssignments: Math.floor(Math.random() * 5) + 15,
            grade: ["A+", "A", "B+", "B", "C+"][Math.floor(Math.random() * 5)],
            nextTest:
              Math.random() > 0.5
                ? `Test on ${new Date(
                    Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString()}`
                : null,
          })
        );

        setSubjects(enhancedSubjects);
        setLoadingSubjects(false);
        const res2 = await fetch("http://localhost:3001/api/students/myinfo", {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!res2.ok) throw new Error(`Info error ${res2.status}`);
        const infoData = await res2.json();
        setStudentInfo(infoData.data);
        setLoadingStudentInfo(false);

        try {
          const res3 = await fetch(
            "http://localhost:3001/api/students/attendance/me",
            {
              credentials: "include",
              headers: { "Content-Type": "application/json" },
            }
          );

          if (res3.ok) {
            const attendanceResult = await res3.json();
            setAttendanceData(attendanceResult.data);
          } else {
            setAttendanceData({
              presentDays: 18,
              totalDays: 20,
              attendancePercentage: 90,
              monthlyRecord: Array.from(
                { length: 20 },
                (_, i) => i !== 7 && i !== 14
              ),
            });
          }
        } catch (attendanceError) {
          setAttendanceData({
            presentDays: 18,
            totalDays: 20,
            attendancePercentage: 90,
            monthlyRecord: Array.from(
              { length: 20 },
              (_, i) => i !== 7 && i !== 14
            ),
          });
        }
        setLoadingAttendance(false);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setSubjectError(err.message);
        setLoadingSubjects(false);
        setLoadingStudentInfo(false);
        setLoadingAttendance(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || userRole !== "student") {
        navigate("/login");
      }
    }
  }, [isAuthenticated, userRole, loading]);

  const EnhancedSubjectCards = ({ subjects }: { subjects: Subject[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {subjects.map((subject, index) => (
        <Card
          key={subject.id || index}
          className="hover:shadow-md transition-shadow duration-200 cursor-pointer group"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg ${
                    subject.color || subjectColors[index % subjectColors.length]
                  }`}
                >
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">
                    {subject.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {subject.code || `SUB-${index + 1}`}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {subject.grade && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Current Grade</span>
                  <Badge variant="secondary" className="font-semibold">
                    {subject.grade}
                  </Badge>
                </div>
              )}

              {subject.completedAssignments && subject.totalAssignments && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Assignments</span>
                    <span className="text-sm text-muted-foreground">
                      {subject.completedAssignments}/{subject.totalAssignments}
                    </span>
                  </div>
                  <Progress
                    value={
                      (subject.completedAssignments /
                        subject.totalAssignments) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              )}

              {subject.nextTest && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-yellow-50 p-2 rounded-md">
                  <Calendar className="h-4 w-4" />
                  <span>{subject.nextTest}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const StudentInfoCard = ({ studentInfo }: { studentInfo: StudentInfo }) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Student Profile</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Class</p>
            <p className="font-semibold">{studentInfo.class || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Section</p>
            <p className="font-semibold">{studentInfo.section || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Roll Number
            </p>
            <p className="font-semibold">{studentInfo.rollNumber || "N/A"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p className="font-semibold">{studentInfo.email || "N/A"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="px-8 space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back{studentInfo?.name ? `, ${studentInfo.name}` : ""}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your studies today.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-primary" />
        </div>
      </div>

      {/* Student Info Card */}
      {loadingStudentInfo ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span>Loading student information...</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        studentInfo && <StudentInfoCard studentInfo={studentInfo} />
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3">
          <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <span>My Subjects</span>
          </h2>

          {loadingSubjects ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span>Loading subjects...</span>
                </div>
              </CardContent>
            </Card>
          ) : subjectError ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>Error: {subjectError}</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <EnhancedSubjectCards subjects={subjects} />
          )}
        </div>

        <div className="lg:w-1/3">
          <PerformanceOverview stats={performanceStats} />
        </div>
      </div>

      {/* Enhanced Attendance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Monthly Attendance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingAttendance ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span>Loading attendance data...</span>
            </div>
          ) : attendanceData ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Present Days</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    {attendanceData.presentDays}/{attendanceData.totalDays} days
                  </span>
                  <Badge
                    variant={
                      attendanceData.attendancePercentage >= 90
                        ? "default"
                        : attendanceData.attendancePercentage >= 75
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {attendanceData.attendancePercentage}%
                  </Badge>
                </div>
              </div>
              <Progress
                value={attendanceData.attendancePercentage}
                className="h-3"
              />

              <div className="flex flex-wrap gap-2 mt-4">
                {attendanceData.monthlyRecord.map((isPresent, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg text-xs font-bold transition-all hover:scale-105 ${
                      isPresent
                        ? "bg-green-100 text-green-700 border-2 border-green-200 shadow-sm"
                        : "bg-red-100 text-red-700 border-2 border-red-200 shadow-sm"
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 text-sm text-orange-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">
                    {attendanceData.totalDays - attendanceData.presentDays}{" "}
                    absences this month
                  </span>
                </div>
                {attendanceData.attendancePercentage < 75 && (
                  <p className="text-xs text-orange-700 mt-1">
                    ⚠️ Attendance below 75% may affect academic standing
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              No attendance data available
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceChart performanceData={performanceHistory} />
        </div>
      </div>

      <RecentTests tests={recentTests} />
    </div>
  );
};

export default Index;
