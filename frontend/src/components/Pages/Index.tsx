import { useEffect, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  User,
  GraduationCap,
  TrendingUp,
  Award,
  Clock,
  Target,
  BarChart3,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react";

const mockPerformanceHistory = [
  { month: "Jan", score: 85 },
  { month: "Feb", score: 88 },
  { month: "Mar", score: 92 },
  { month: "Apr", score: 87 },
  { month: "May", score: 94 },
  { month: "Jun", score: 91 }
];

const mockRecentTests = [
  { id: 1, subject: "Mathematics", score: 94, date: "2024-06-15", type: "Quiz" },
  { id: 2, subject: "Physics", score: 87, date: "2024-06-12", type: "Test" },
  { id: 3, subject: "Chemistry", score: 91, date: "2024-06-10", type: "Assignment" }
];

// Interfaces
interface ApiSubject {
  _id: string;
  name: string;
  syllabusPdfUrl: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  teacher?: string;
  grade?: string;
  completedAssignments?: number;
  totalAssignments?: number;
  nextTest?: string;
  syllabusPdfUrl?: string;
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

interface PerformanceStats {
  averageScore: number;
  totalTests: number;
  rank: number;
  improvement: number;
}

const StudentDashboard = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(null);
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats | null>(null);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingStudentInfo, setLoadingStudentInfo] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API Functions
  const fetchSubjects = async () => {
    try {
      setLoadingSubjects(true);
      const response = await fetch("http://localhost:3001/api/students/subjects/me", {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      
      if (!response.ok) throw new Error(`Failed to fetch subjects: ${response.status}`);
      
      const data = await response.json();
      const enhancedSubjects = (data.subjects || []).map((apiSubject: ApiSubject, index: number) => ({
        id: apiSubject._id,
        name: apiSubject.name,
        code: `SUB-${String(index + 1).padStart(3, "0")}`,
        syllabusPdfUrl: apiSubject.syllabusPdfUrl,
        completedAssignments: Math.floor(Math.random() * 10) + 5,
        totalAssignments: Math.floor(Math.random() * 5) + 15,
        grade: ["A+", "A", "B+", "B", "C+"][Math.floor(Math.random() * 5)],
        teacher: `Dr. ${["Smith", "Johnson", "Williams", "Brown", "Jones"][Math.floor(Math.random() * 5)]}`,
      }));
      
      setSubjects(enhancedSubjects);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching subjects:", err);
    } finally {
      setLoadingSubjects(false);
    }
  };

  const fetchStudentInfo = async () => {
    try {
      setLoadingStudentInfo(true);
      const response = await fetch("http://localhost:3001/api/students/myinfo", {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      
      if (!response.ok) throw new Error(`Failed to fetch student info: ${response.status}`);
      
      const data = await response.json();
      setStudentInfo(data.data);
    } catch (err: any) {
      console.error("Error fetching student info:", err);
      // Fallback data for demo
      setStudentInfo({
        name: "John Doe",
        class: "12th",
        section: "A",
        rollNumber: "2024001",
        email: "john.doe@school.edu"
      });
    } finally {
      setLoadingStudentInfo(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      setLoadingAttendance(true);
      const response = await fetch("http://localhost:3001/api/students/attendance/me", {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      
      if (response.ok) {
        const data = await response.json();
        setAttendanceData(data.data);
      } else {
        // Fallback data
        setAttendanceData({
          presentDays: 18,
          totalDays: 20,
          attendancePercentage: 90,
          monthlyRecord: Array.from({ length: 20 }, (_, i) => i !== 7 && i !== 14)
        });
      }
    } catch (err: any) {
      console.error("Error fetching attendance:", err);
      // Fallback data
      setAttendanceData({
        presentDays: 18,
        totalDays: 20,
        attendancePercentage: 90,
        monthlyRecord: Array.from({ length: 20 }, (_, i) => i !== 7 && i !== 14)
      });
    } finally {
      setLoadingAttendance(false);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        fetchSubjects(),
        fetchStudentInfo(),
        fetchAttendance()
      ]);
      
      // Set mock performance stats
      setPerformanceStats({
        averageScore: 89.5,
        totalTests: 24,
        rank: 5,
        improvement: 12
      });
    };
    
    initializeData();
  }, []);
  const refreshData = () => {
    fetchSubjects();
    fetchStudentInfo();
    fetchAttendance();
  };

  // Loading Component
  const LoadingCard = ({ message }: { message: string }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
        <span className="text-gray-600">{message}</span>
      </div>
    </div>
  );

  // Error Component
  const ErrorCard = ({ message }: { message: string }) => (
    <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
      <div className="flex items-center space-x-3 text-red-600">
        <AlertCircle className="h-5 w-5" />
        <span>Error: {message}</span>
      </div>
    </div>
  );

  // Student Info Card
  const StudentInfoCard = ({ studentInfo }: { studentInfo: StudentInfo }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <User className="h-6 w-6 text-blue-500" />
        <h2 className="text-xl font-semibold text-gray-900">Student Profile</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Name</p>
          <p className="text-lg font-semibold text-gray-900">{studentInfo.name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Class</p>
          <p className="text-lg font-semibold text-gray-900">{studentInfo.class}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Section</p>
          <p className="text-lg font-semibold text-gray-900">{studentInfo.section}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Roll Number</p>
          <p className="text-lg font-semibold text-gray-900">{studentInfo.rollNumber}</p>
        </div>
      </div>
    </div>
  );

  // Performance Stats Cards
  const PerformanceStatsCards = ({ stats }: { stats: PerformanceStats }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <TrendingUp className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Average Score</p>
            <p className="text-2xl font-bold text-gray-900">{stats.averageScore}%</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Target className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Tests</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalTests}</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Award className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Class Rank</p>
            <p className="text-2xl font-bold text-gray-900">#{stats.rank}</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <BarChart3 className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Improvement</p>
            <p className="text-2xl font-bold text-gray-900">+{stats.improvement}%</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Subject Cards
  const SubjectCards = ({ subjects }: { subjects: Subject[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {subjects.map((subject) => (
        <div key={subject.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{subject.name}</h3>
                <p className="text-sm text-gray-500">{subject.code}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {subject.grade && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Current Grade</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded">
                  {subject.grade}
                </span>
              </div>
            )}
            
            {subject.teacher && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Teacher</span>
                <span className="text-sm text-gray-900">{subject.teacher}</span>
              </div>
            )}
            
            {subject.completedAssignments && subject.totalAssignments && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Assignments</span>
                  <span className="text-sm text-gray-900">
                    {subject.completedAssignments}/{subject.totalAssignments}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(subject.completedAssignments / subject.totalAssignments) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {subject.nextTest && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 bg-yellow-50 p-2 rounded-lg border border-yellow-200">
                <Calendar className="h-4 w-4" />
                <span>{subject.nextTest}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  // Attendance Card
  const AttendanceCard = ({ attendanceData }: { attendanceData: AttendanceData }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Calendar className="h-6 w-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900">Monthly Attendance</h2>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600">
            {attendanceData.presentDays}/{attendanceData.totalDays} days
          </span>
          <span className={`px-2 py-1 text-sm font-semibold rounded ${
            attendanceData.attendancePercentage >= 90 
              ? 'bg-green-100 text-green-800'
              : attendanceData.attendancePercentage >= 75 
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {attendanceData.attendancePercentage}%
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-blue-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${attendanceData.attendancePercentage}%` }}
          ></div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {attendanceData.monthlyRecord.map((isPresent, i) => (
            <div
              key={i}
              className={`w-10 h-10 flex items-center justify-center rounded-lg text-xs font-bold transition-all hover:scale-105 ${
                isPresent
                  ? "bg-green-100 text-green-700 border-2 border-green-200"
                  : "bg-red-100 text-red-700 border-2 border-red-200"
              }`}
            >
              {isPresent ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            </div>
          ))}
        </div>
        
        {attendanceData.attendancePercentage < 75 && (
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center space-x-2 text-sm text-red-800">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">
                ⚠️ Attendance below 75% may affect academic standing
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Performance Chart
  const PerformanceChart = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <BarChart3 className="h-6 w-6 text-blue-500" />
        <h2 className="text-xl font-semibold text-gray-900">Performance Trend</h2>
      </div>
      <div className="h-64 flex items-end justify-between space-x-2">
        {mockPerformanceHistory.map((data, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600"
              style={{ height: `${(data.score / 100) * 200}px` }}
            ></div>
            <span className="text-xs text-gray-600 mt-2">{data.month}</span>
            <span className="text-xs font-semibold text-gray-900">{data.score}%</span>
          </div>
        ))}
      </div>
    </div>
  );

  const RecentTests = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Clock className="h-6 w-6 text-blue-500" />
        <h2 className="text-xl font-semibold text-gray-900">Recent Tests</h2>
      </div>
      <div className="space-y-3">
        {mockRecentTests.map((test) => (
          <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{test.subject}</p>
              <p className="text-sm text-gray-500">{test.type} • {test.date}</p>
            </div>
            <span className={`px-3 py-1 text-sm font-semibold rounded ${
              test.score >= 90 
                ? 'bg-green-100 text-green-800'
                : test.score >= 75 
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {test.score}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back{studentInfo?.name ? `, ${studentInfo.name}` : ""}!
            </h1>
            <p className="text-gray-600 mt-2">
              Here's what's happening with your studies today.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={refreshData}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            <GraduationCap className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        {/* Student Info */}
        {loadingStudentInfo ? (
          <LoadingCard message="Loading student information..." />
        ) : (
          studentInfo && <StudentInfoCard studentInfo={studentInfo} />
        )}

        {/* Performance Stats */}
        {performanceStats && <PerformanceStatsCards stats={performanceStats} />}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Subjects */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <BookOpen className="h-6 w-6 text-blue-500" />
              <h2 className="text-2xl font-semibold text-gray-900">My Subjects</h2>
            </div>
            {loadingSubjects ? (
              <LoadingCard message="Loading subjects..." />
            ) : error ? (
              <ErrorCard message={error} />
            ) : (
              <SubjectCards subjects={subjects} />
            )}
          </div>

          {/* Attendance */}
          <div>
            {loadingAttendance ? (
              <LoadingCard message="Loading attendance data..." />
            ) : (
              attendanceData && <AttendanceCard attendanceData={attendanceData} />
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceChart />
          <RecentTests />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;