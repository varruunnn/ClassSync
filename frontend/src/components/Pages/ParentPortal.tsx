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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Mail,
  MessageSquare,
  Phone,
  Calendar,
  FileText,
  AlertCircle,
  User,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Award,
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
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";

const ParentPortal = () => {
  const communications = [
    {
      id: "1",
      from: "Ms. Johnson",
      subject: "Math Performance Update",
      message:
        "Your child has shown great improvement in algebra this month. We're focusing on geometry next.",
      date: "2025-05-15T14:30:00",
      read: true,
    },
    {
      id: "2",
      from: "Principal Williams",
      subject: "Upcoming Parent-Teacher Conference",
      message:
        "Please join us for the quarterly parent-teacher conference scheduled for May 26th.",
      date: "2025-05-12T09:15:00",
      read: false,
    },
    {
      id: "3",
      from: "Coach Davis",
      subject: "Sports Day Participation",
      message:
        "We encourage all students to participate in the upcoming Sports Day event on June 5th.",
      date: "2025-05-10T16:45:00",
      read: true,
    },
  ];
  const { schoolId, loading: authLoading } = useAuth();
  type StudentData = {
    name?: string;
    class?: string;
    rollNumber?: string | number;
    email?: string;
    schoolId?: string;
    parentContact?: string;
    createdAt?: string;
    // add other fields as needed
  };

  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loadingStudent, setLoadingStudent] = useState(true);
  const [studentError, setStudentError] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Array<any>>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [contactError, setContactError] = useState<string | null>(null);

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

  const progressData = [
    { name: "Unit Tests", average: 86.3 },
    { name: "Half Yearly", average: 88.2 },
    { name: "Yearly", average: 91.2 },
  ];

  const subjectProgressData = [
    { subject: "Math", unit: 85, halfYearly: 87, yearly: 90 },
    { subject: "Physics", unit: 92, halfYearly: 89, yearly: 93 },
    { subject: "Chemistry", unit: 78, halfYearly: 82, yearly: 85 },
    { subject: "Biology", unit: 88, halfYearly: 91, yearly: 94 },
    { subject: "English", unit: 94, halfYearly: 96, yearly: 98 },
    { subject: "History", unit: 81, halfYearly: 84, yearly: 87 },
  ];

  const gradeDistribution = [
    { name: "A+", value: 2, color: "#10b981" },
    { name: "A", value: 3, color: "#3b82f6" },
    { name: "B+", value: 7, color: "#f59e0b" },
    { name: "B", value: 6, color: "#ef4444" },
  ];

  useEffect(() => {
    fetch("http://localhost:3001/api/students/myinfo", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setStudentData(data.data);
        } else {
          throw new Error("Failed to fetch student data");
        }
      })
      .catch((err) => {
        console.error("Failed to load student data:", err);
        setStudentError(err.message);
      })
      .finally(() => setLoadingStudent(false));
  }, []);
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+":
        return "bg-green-100 text-green-800";
      case "A":
        return "bg-blue-100 text-blue-800";
      case "B+":
        return "bg-yellow-100 text-yellow-800";
      case "B":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  type ExamType = "unitTests" | "halfYearly" | "yearly";
  const calculateOverallAverage = (examType: ExamType) => {
    const scores = performanceData[examType].map((subject) => subject.score);
    return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  };
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
          <TabsTrigger value="communications">Communications</TabsTrigger>
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

          {/* Performance Overview */}
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
                  {calculateOverallAverage("unitTests")}%
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
                  {calculateOverallAverage("halfYearly")}%
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
                  {calculateOverallAverage("yearly")}%
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
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={subjectProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis domain={[70, 100]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="unit"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Unit Tests"
                    />
                    <Line
                      type="monotone"
                      dataKey="halfYearly"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Half Yearly"
                    />
                    <Line
                      type="monotone"
                      dataKey="yearly"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      name="Yearly"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Subject-wise Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Latest Exam Results (Yearly)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {performanceData.yearly.map((subject, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                    >
                      <div>
                        <p className="font-medium">{subject.subject}</p>
                        <p className="text-sm text-muted-foreground">
                          {subject.score}/{subject.maxScore}
                        </p>
                      </div>
                      <Badge className={getGradeColor(subject.grade)}>
                        {subject.grade}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={gradeDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {gradeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  {gradeDistribution.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <span className="text-sm">
                        {entry.name}: {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Assessment Comparison</CardTitle>
              <CardDescription>
                Compare performance across different examination types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[80, 95]} />
                    <Tooltip />
                    <Bar
                      dataKey="average"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications">
          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Messages</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {communications.map((comm) => (
                    <Card
                      key={comm.id}
                      className={`${!comm.read ? "bg-blue-50" : ""}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{comm.subject}</h3>
                          <Badge variant={comm.read ? "outline" : "default"}>
                            {comm.read ? "Read" : "New"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          From: {comm.from}
                        </p>
                        <p className="text-sm mt-2">{comm.message}</p>
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-xs text-muted-foreground">
                            {new Date(comm.date).toLocaleString()}
                          </span>
                          <Button variant="outline" size="sm">
                            Reply
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-2">Send Message</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Recipient</label>
                      <select className="w-full rounded-md border mt-1 p-2">
                        <option value="">Select recipient...</option>
                        {Array.isArray(studentData?.parentContact) &&
                          studentData?.parentContact.map((contact) => (
                            <option key={contact.email} value={contact.email}>
                              {contact.name} ({contact.role})
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Subject</label>
                      <input
                        type="text"
                        className="w-full rounded-md border mt-1 p-2"
                        placeholder="Message subject"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Message</label>
                      <Textarea
                        placeholder="Type your message here..."
                        className="mt-1"
                      />
                    </div>
                    <Button>Send Message</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contacts">
          <div className="mt-4">
            {loadingContacts ? (
              <p>Loading contacts...</p>
            ) : contactError ? (
              <p className="text-red-600">{contactError}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contacts.map((contact: any) => (
                  <Card key={contact._id}>
                    <CardContent className="p-4">
                      <h3 className="font-medium">{contact.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {contact.role}
                      </p>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={`mailto:${contact.email}`}
                            className="text-sm hover:underline"
                          >
                            {contact.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={`tel:${contact.phone}`}
                            className="text-sm hover:underline"
                          >
                            {contact.phone}
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParentPortal;
