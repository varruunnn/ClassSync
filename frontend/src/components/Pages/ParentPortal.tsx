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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";

const ParentPortal = () => {
  const { schoolId, loading: authLoading } = useAuth();
  type StudentData = {
    _id: string;
    name?: string;
    class?: string;
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
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [subjectsError, setSubjectsError] = useState<string | null>(null);

  const performanceData = {
    unitTests: [
      { subject: "Mathematics", score: 85, maxScore: 100, grade: "B+" },
      { subject: "Physics", score: 92, maxScore: 100, grade: "A" },
      { subject: "Chemistry", score: 78, maxScore: 100, grade: "B" },
      { subject: "Biology", score: 88, maxScore: 100, grade: "B+" },
      { subject: "English", score: 94, maxScore: 100, grade: "A" },
      { subject: "History", score: 81, maxScore: 100, grade: "B+" },
    ],
    halfYearly: [
      { subject: "Mathematics", score: 87, maxScore: 100, grade: "B+" },
      { subject: "Physics", score: 89, maxScore: 100, grade: "B+" },
      { subject: "Chemistry", score: 82, maxScore: 100, grade: "B+" },
      { subject: "Biology", score: 91, maxScore: 100, grade: "A" },
      { subject: "English", score: 96, maxScore: 100, grade: "A+" },
      { subject: "History", score: 84, maxScore: 100, grade: "B+" },
    ],
    yearly: [
      { subject: "Mathematics", score: 90, maxScore: 100, grade: "A" },
      { subject: "Physics", score: 93, maxScore: 100, grade: "A" },
      { subject: "Chemistry", score: 85, maxScore: 100, grade: "B+" },
      { subject: "Biology", score: 94, maxScore: 100, grade: "A" },
      { subject: "English", score: 98, maxScore: 100, grade: "A+" },
      { subject: "History", score: 87, maxScore: 100, grade: "B+" },
    ],
  };

  const progressData = studentData
    ? [
        { name: "Unit Tests", average: studentData.unitTestAvg },
        { name: "Half Yearly", average: studentData.halfYearlyAvg },
        { name: "Yearly", average: studentData.yearlyAvg },
      ]
    : [];

  const subjectProgressData = !loadingSubjects && !subjectsError
    ? subjects.map((subj) => ({
        subject: subj.name,
        unit:
          performanceData.unitTests.find((d) => d.subject === subj.name)
            ?.score ?? 0,
        halfYearly:
          performanceData.halfYearly.find((d) => d.subject === subj.name)
            ?.score ?? 0,
        yearly:
          performanceData.yearly.find((d) => d.subject === subj.name)
            ?.score ?? 0,
      }))
    : [];

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
      // 1) fetch student info
      const resInfo = await fetch("http://localhost:3001/api/students/myinfo", {
        credentials: "include",
      });
      if (!resInfo.ok) {
        throw new Error(`Info Error ${resInfo.status}: ${resInfo.statusText}`);
      }
      const infoJson = await resInfo.json();
      if (!infoJson.success) {
        throw new Error("Student info fetch failed");
      }

      // 2) fetch subjects
      const resSubs = await fetch("http://localhost:3001/api/students/subjects/me", {
        credentials: "include",
      });
      if (!resSubs.ok) {
        throw new Error(`Subjects Error ${resSubs.status}: ${resSubs.statusText}`);
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

  type ExamType = "unitTests" | "halfYearly" | "yearly";
  const calculateOverallAverage = (examType: ExamType) => {
    const scores = performanceData[examType].map((subject) => subject.score);
    return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  };

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Performance Progress
        </CardTitle>
        <CardDescription>
          Academic performance across different assessments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          {loadingSubjects ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading subjects…
            </div>
          ) : subjectsError ? (
            <div className="text-center py-8 text-red-600">
              Error loading subjects: {subjectsError}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={subjectProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis domain={[70, 100]} />
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Line
                  type="monotone"
                  dataKey="unit"
                  name="Unit Tests"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="halfYearly"
                  name="Half Yearly"
                  stroke="#10b981"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="yearly"
                  name="Yearly"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                />
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
