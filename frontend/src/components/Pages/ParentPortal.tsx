import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  AlertCircle,
  User,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Award,
  MessageSquare,
  Clock,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";
interface ExamMark {
  subjectId: string;
  marks: number;
}

interface LatestExamEntry {
  studentId: string;
  marks: ExamMark[];
}

const ParentPortal = () => {
  const { schoolId, loading: authLoading } = useAuth();
  type StudentData = {
    _id: string;
    name?: string;
    class?: string;
    section?: string;
    rollNumber?: string | number;
    email?: string;
    schoolId?: string;
    parentContact?: string;
    createdAt?: string;
    unitTestAvg?: number;
    halfYearlyAvg?: number;
    yearlyAvg?: number;
  };

  type Message = {
    _id: string;
    teacherId: {
      _id: string;
      name: string;
      email: string;
    };
    studentId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  type Subject = { name: string; _id: string; syllabusPdfUrl: string };

  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loadingStudent, setLoadingStudent] = useState(true);
  const [studentError, setStudentError] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Array<any>>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [contactError, setContactError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [_loadingSubjects, setLoadingSubjects] = useState(true);
  const [_subjectsError, setSubjectsError] = useState<string | null>(null);
  const [classTestEntry, setClassTestEntry] = useState<LatestExamEntry | null>(
    null
  );
  const [loadingClassTest, setLoadingClassTest] = useState(true);

  const progressData = studentData
    ? [
        { name: "Unit Tests", average: studentData.unitTestAvg },
        { name: "Half Yearly", average: studentData.halfYearlyAvg },
        { name: "Yearly", average: studentData.yearlyAvg },
      ]
    : [];

  const subjectProgressData = subjects.map((subj) => {
    const markObj = classTestEntry?.marks.find((m) => m.subjectId === subj._id);
    const score = markObj?.marks ?? 0;
    return { subject: subj.name, score };
  });

  useEffect(() => {
    if (!studentData) return;

    setLoadingClassTest(true);
    fetch(
      `http://localhost:3001/api/exams/latest?class=${studentData.class}&section=${studentData.section}&examType=classTest`,
      { credentials: "include" }
    )
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data.length) {
          const me = json.data.find(
            (e: LatestExamEntry) => e.studentId === studentData._id
          );
          setClassTestEntry(me || null);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoadingClassTest(false));
  }, [studentData]);

  useEffect(() => {
    fetch("http://localhost:3001/api/students/myinfo", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res: { success: boolean; data: StudentData }) => {
        if (!res.success) throw new Error("Fetch failed");
        setStudentData(res.data);
      });
    // …
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadStudentAndSubjects = async () => {
      try {
        const resInfo = await fetch(
          "http://localhost:3001/api/students/myinfo",
          {
            credentials: "include",
          }
        );
        if (!resInfo.ok) {
          throw new Error(
            `Info Error ${resInfo.status}: ${resInfo.statusText}`
          );
        }
        const infoJson = await resInfo.json();
        if (!infoJson.success) {
          throw new Error("Student info fetch failed");
        }
        const resSubs = await fetch(
          "http://localhost:3001/api/students/subjects/me",
          {
            credentials: "include",
          }
        );
        if (!resSubs.ok) {
          throw new Error(
            `Subjects Error ${resSubs.status}: ${resSubs.statusText}`
          );
        }
        const subsJson = await resSubs.json();
        if (!Array.isArray(subsJson.subjects)) {
          throw new Error("Subjects response malformed");
        }
        if (isMounted) {
          setStudentData(infoJson.data);
          setSubjects(subsJson.subjects);
        }
      } catch (err: any) {
        console.error("Failed to load data:", err);
        if (isMounted) {
          setStudentError(err.message);
          setSubjectsError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoadingStudent(false);
          setLoadingSubjects(false);
        }
      }
    };

    loadStudentAndSubjects();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (authLoading || !schoolId) return;
    fetch(`http://localhost:3001/api/admin/${schoolId}/teachers`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        setContacts(data.teachers || []);
      })
      .catch((err) => {
        console.error("Failed to load contacts:", err);
        setContactError(err.message);
      })
      .finally(() => setLoadingContacts(false));
  }, [authLoading, schoolId]);

  useEffect(() => {
    fetch("http://localhost:3001/api/messages", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        setMessages(data || []);
      })
      .catch((err) => {
        console.error("Failed to load messages:", err);
        setMessageError(err.message);
      })
      .finally(() => setLoadingMessages(false));
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loadingStudent) {
    return (
      <div className="px-8 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Loading student information...
          </p>
        </div>
      </div>
    );
  }

  if (studentError) {
    return (
      <div className="px-8 py-12 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-2">
            Failed to load student information
          </p>
          <p className="text-sm text-muted-foreground">{studentError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Parent Portal</h1>
          <p className="text-muted-foreground">
            Stay connected with your child's education
          </p>
        </div>
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
          Guardian Access
        </Badge>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="contacts">School Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Student Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Student Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-600">
                    {studentData?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "DS"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {studentData?.name}
                    </h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>
                        <span className="font-medium">Class:</span>{" "}
                        {studentData?.class}
                      </p>
                      <p>
                        <span className="font-medium">Roll Number:</span>{" "}
                        {studentData?.rollNumber}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {studentData?.email}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>
                      <span className="font-medium">School ID:</span>{" "}
                      {studentData?.schoolId}
                    </p>
                    <p>
                      <span className="font-medium">Parent Contact:</span>{" "}
                      {studentData?.parentContact}
                    </p>
                    <p>
                      <span className="font-medium">Joined:</span>{" "}
                      {studentData?.createdAt
                        ? new Date(studentData.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Unit Tests Average
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {loadingStudent
                    ? "…"
                    : studentData?.unitTestAvg != null
                    ? `${studentData.unitTestAvg.toFixed(1)}%`
                    : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Latest assessment
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Half Yearly Average
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {loadingStudent
                    ? "…"
                    : studentData?.halfYearlyAvg != null
                    ? `${studentData.halfYearlyAvg.toFixed(1)}%`
                    : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Mid-term performance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Yearly Average
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {loadingStudent
                    ? "…"
                    : studentData?.yearlyAvg != null
                    ? `${studentData.yearlyAvg.toFixed(1)}%`
                    : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Annual performance
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Trends */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <TrendingUp className="h-5 w-5" />
                Performance Progress (Class Test)
              </CardTitle>
              <CardDescription className="text-blue-100">
                Your most recent class test marks by subject
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-80 w-full bg-white rounded-lg shadow-inner p-4">
                {loadingClassTest ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-slate-500 font-medium">
                        Loading class test data…
                      </p>
                    </div>
                  </div>
                ) : !classTestEntry ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium">
                        No class test data available.
                      </p>
                      <p className="text-slate-400 text-sm mt-2">
                        Take a test to see your progress here
                      </p>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={subjectProgressData}
                      margin={{ left: 20, right: 20, top: 20, bottom: 20 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e2e8f0"
                        strokeOpacity={0.6}
                      />
                      <XAxis
                        dataKey="subject"
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        axisLine={{ stroke: "#cbd5e1" }}
                        tickLine={{ stroke: "#cbd5e1" }}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tickFormatter={(v) => `${v}%`}
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        axisLine={{ stroke: "#cbd5e1" }}
                        tickLine={{ stroke: "#cbd5e1" }}
                      />
                      <Tooltip
                        formatter={(val: number) => [`${val}%`, "Score"]}
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "none",
                          borderRadius: "8px",
                          color: "#f1f5f9",
                          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="url(#colorGradient)"
                        strokeWidth={3}
                        dot={{
                          fill: "#3b82f6",
                          strokeWidth: 2,
                          stroke: "#ffffff",
                          r: 6,
                        }}
                        activeDot={{
                          r: 8,
                          fill: "#1d4ed8",
                          stroke: "#ffffff",
                          strokeWidth: 2,
                        }}
                        name="Score"
                      />
                      <defs>
                        <linearGradient
                          id="colorGradient"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="0"
                        >
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                      </defs>
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Assessment Comparison</CardTitle>
              <CardDescription>
                Compare performance across different examination types
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!loadingStudent && progressData.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      {/* you can also let Recharts auto-scale, or do [0, 100] */}
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value: number) => `${value}%`} />
                      <Bar
                        dataKey="average"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                        name="Average %"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {loadingStudent ? "Loading chart…" : "No data available"}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Messages from Teachers
              </CardTitle>
              <CardDescription>
                View important messages and updates from your child's teachers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingMessages ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                  <p className="text-muted-foreground">Loading messages...</p>
                </div>
              ) : messageError ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-red-600 mb-1">Failed to load messages</p>
                  <p className="text-sm text-muted-foreground">
                    {messageError}
                  </p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No messages yet</p>
                  <p className="text-sm text-muted-foreground">
                    Messages from teachers will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                            {message.teacherId.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {message.teacherId.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {message.teacherId.email}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatDate(message.createdAt)}
                            </div>
                          </div>
                          <div className="bg-white border border-gray-100 rounded-md p-3">
                            <p className="text-gray-800 leading-relaxed">
                              {message.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                School Contacts
              </CardTitle>
              <CardDescription>
                Contact information for teachers and staff
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingContacts ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                  <p className="text-muted-foreground">Loading contacts...</p>
                </div>
              ) : contactError ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-red-600 mb-1">Failed to load contacts</p>
                  <p className="text-sm text-muted-foreground">
                    {contactError}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contacts.map((contact: any) => (
                    <Card key={contact._id} className="border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-green-100 text-green-600">
                              {contact.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {contact.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {contact.role}
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <a
                                  href={`mailto:${contact.email}`}
                                  className="text-sm hover:underline text-blue-600"
                                >
                                  {contact.email}
                                </a>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <a
                                  href={`tel:${contact.phone}`}
                                  className="text-sm hover:underline text-blue-600"
                                >
                                  {contact.phone}
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParentPortal;
