import { useEffect, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  User,
  GraduationCap,
  TrendingUp,
  Target,
  BarChart3,
  RefreshCw,
  CheckCircle,
  Star,
  BookMarked,
  Trophy,
  Activity,
  FileText,
  Medal
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";


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
  _id: string;
  name: string;
  class: string;
  section: string;
  schoolId: number;
  rollNumber: string;
  email: string;
}
interface ExamMark {
  subjectId: string;
  marks: number;
}
interface LatestExamEntry {
  studentId: string;
  marks: ExamMark[];
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
  const [performanceStats, setPerformanceStats] =
    useState<PerformanceStats | null>(null);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingStudentInfo, setLoadingStudentInfo] = useState(true);
  const [latestExam, setLatestExam] = useState<LatestExamEntry | null>(null);
  const [loadingExam, setLoadingExam] = useState(true);
  const {
    isAuthenticated,
    userRole,
    schoolId: ctxSchoolId,
    loading,
  } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchSubjects = async () => {
    try {
      setLoadingSubjects(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/students/subjects/me`,
        {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok)
        throw new Error(`Failed to fetch subjects: ${response.status}`);

      const data = await response.json();
      const enhancedSubjects = (data.subjects || []).map(
        (apiSubject: ApiSubject, index: number) => ({
          id: apiSubject._id,
          name: apiSubject.name,
          code: `SUB-${String(index + 1).padStart(3, "0")}`,
          syllabusPdfUrl: apiSubject.syllabusPdfUrl,
          completedAssignments: Math.floor(Math.random() * 10) + 5,
          totalAssignments: Math.floor(Math.random() * 5) + 15,
          grade: ["A+", "A", "B+", "B", "C+"][Math.floor(Math.random() * 5)],
          teacher: `Dr. ${
            ["Smith", "Johnson", "Williams", "Brown", "Jones"][
              Math.floor(Math.random() * 5)
            ]
          }`,
        })
      );

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
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/students/myinfo`,
        {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok)
        throw new Error(`Failed to fetch student info: ${response.status}`);

      const data = await response.json();
      setStudentInfo(data.data);
    } catch (err: any) {
      console.error("Error fetching student info:", err);
      setStudentInfo({
        _id: "demo-student-id",
        name: "John Doe",
        class: "12th",
        section: "A",
        rollNumber: "2024001",
        schoolId:1,
        email: "john.doe@school.edu",
      });
    } finally {
      setLoadingStudentInfo(false);
    }
  };

  useEffect(() => {
    Promise.all([fetchSubjects(), fetchStudentInfo()]);
  }, []);

  useEffect(() => {
    if (!studentInfo) return;

    setLoadingExam(true);
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/exams/latest/${studentInfo.schoolId}?class=${studentInfo.class}&section=${studentInfo.section}&examType=classTest`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data.length) {
          const myEntry = (json.data as LatestExamEntry[]).find(
            (e) => e.studentId === studentInfo._id
          );
          setLatestExam(myEntry || null);
        }
      })
      .catch((err) => console.error("Failed to load latest exam:", err))
      .finally(() => setLoadingExam(false));
  }, [studentInfo]);

  const refreshData = () => {
    fetchSubjects();
    fetchStudentInfo();
  };
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate("/login");
      }
    }
  }, [isAuthenticated, userRole, loading, navigate]);

  // Loading Component
  const LoadingCard = ({ message }: { message: string }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
        <span className="text-gray-600 font-medium">{message}</span>
      </div>
    </div>
  );

  // Error Component
  const ErrorCard = ({ message }: { message: string }) => (
   <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
      <div className="flex items-center space-x-3 text-red-600">
        <AlertCircle className="h-6 w-6" />
        <span className="font-medium">Error: {message}</span>
      </div>
    </div>
  );
  // Student Info Card
  const StudentInfoCard = ({ studentInfo }: { studentInfo: StudentInfo }) => (
     <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-blue-100 p-8 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back, {studentInfo.name}!</h2>
            <p className="text-blue-600 font-medium">Ready to ace your studies today?</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">Class</p>
              <p className="text-xl font-bold text-gray-900">{studentInfo.class}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">Section</p>
              <p className="text-xl font-bold text-gray-900">{studentInfo.section}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">Roll No.</p>
              <p className="text-xl font-bold text-gray-900">{studentInfo.rollNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Performance Stats Cards
  const PerformanceStatsCards = ({ stats }: { stats: PerformanceStats }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <TrendingUp className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">{stats.averageScore}%</div>
            <div className="text-sm text-gray-500 font-medium">Average Score</div>
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${stats.averageScore}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-green-100 rounded-xl">
            <Target className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">{stats.totalTests}</div>
            <div className="text-sm text-gray-500 font-medium">Tests Taken</div>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm font-medium">All completed</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-purple-100 rounded-xl">
            <Trophy className="h-6 w-6 text-purple-600" />
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">#{stats.rank}</div>
            <div className="text-sm text-gray-500 font-medium">Class Rank</div>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-purple-600">
          <Medal className="h-4 w-4" />
          <span className="text-sm font-medium">Top performer</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-orange-100 rounded-xl">
            <BarChart3 className="h-6 w-6 text-orange-600" />
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">+{stats.improvement}%</div>
            <div className="text-sm text-gray-500 font-medium">Improvement</div>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-orange-600">
          <Activity className="h-4 w-4" />
          <span className="text-sm font-medium">Great progress!</span>
        </div>
      </div>
    </div>
  );


  // Subject Cards
  const SubjectCards = ({ subjects }: { subjects: Subject[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subjects.map((subject) => (
        <div
          key={subject.id}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{subject.name}</h3>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700">Assignments</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Performance Chart
  const PerformanceChart = () => {
     if (loadingExam) return <LoadingCard message="Loading performance data..." />;
    if (!latestExam) return <div className="text-center py-8 text-gray-500">No performance data available.</div>;

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Latest Test Performance</h3>
              <p className="text-sm text-gray-500">Your scores across all subjects</p>
            </div>
          </div>
        </div>
        
        <div className="h-80 flex items-end justify-between space-x-3">
          {subjects.map((subject) => {
            const markObj = latestExam.marks.find((m) => m.subjectId === subject.id);
            const score = markObj?.marks ?? 0;
            const height = (score / 100) * 250;
            
            return (
              <div key={subject.id} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center">
                  <div className="text-xs font-semibold text-gray-900 mb-2">{score}%</div>
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-xl transition-all duration-1000 hover:from-blue-600 hover:to-blue-500"
                    style={{ height: `${height}px`, minHeight: '20px' }}
                  ></div>
                </div>
                <div className="mt-3 text-center">
                  <div className="text-xs font-medium text-gray-900 mb-1">{subject.name}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const RecentTests = () => {
    if (loadingExam) return <LoadingCard message="Loading recent tests..." />;
    if (!latestExam) return <div className="text-center py-8 text-gray-500">No recent test data.</div>;

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-xl">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Recent Test Scores</h3>
              <p className="text-sm text-gray-500">Your latest examination results</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {latestExam.marks.map((mark) => {
            const subject = subjects.find((s) => s.id === mark.subjectId);
            return (
              <div key={mark.subjectId} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <BookMarked className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{subject?.name || mark.subjectId}</div>
                    <div className="text-sm text-gray-500">{subject?.teacher}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{mark.marks}%</div>
                  </div>
                  {mark.marks >= 90 && <Star className="h-5 w-5 text-yellow-500" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-2xl">
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-gray-600 mt-1">Track your academic progress and stay organized</p>
            </div>
          </div>
          <button
            onClick={refreshData}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <RefreshCw className="h-5 w-5" />
            <span className="font-medium">Refresh</span>
          </button>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Subjects */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-7 w-7 text-blue-600" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">My Subjects</h2>
                  <p className="text-gray-500">Track your progress across all subjects</p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {subjects.length} subjects enrolled
              </div>
            </div>
            {loadingSubjects ? (
              <LoadingCard message="Loading subjects..." />
            ) : error ? (
              <ErrorCard message={error} />
            ) : (
              <SubjectCards subjects={subjects} />
            )}
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            <RecentTests />
          </div>
        </div>

        {/* Performance Chart */}
        <div className="mb-8">
          <PerformanceChart />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
