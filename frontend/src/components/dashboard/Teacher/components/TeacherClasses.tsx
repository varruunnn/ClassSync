import { useEffect, useState } from "react";
import TeacherDashboard from "@/components/layout/teacher/TeacherDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Save, CheckCircle, UserCheck, BookOpen, TrendingUp } from "lucide-react";

interface TeacherProfile {
  name: string;
  role: string;
  schoolId: number;
  email: string;
  Id: string;
  subject: string;
  phone: string;
  classes: string[];
  classAssigned: string;
}

interface Student {
  _id: string;
  name: string;
  rollNumber: string;
}

export default function TeacherClasses() {
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [allClasses, setAllClasses] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [sections] = useState<string[]>(["A", "B", "C", "D"]);
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);
  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:3001/api/auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data: TeacherProfile) => {
        setProfile(data);
        const classes = Array.from(
          new Set([...(data.classes || []), data.classAssigned])
        );
        setAllClasses(classes);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);
  useEffect(() => {
    if (!selectedClass || !selectedSection || !profile) return;

    setIsLoading(true);
    fetch(
      `http://localhost:3001/api/admin/${profile.schoolId}/students?class=${selectedClass}&section=${selectedSection}`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((data) => {
        setStudents(data.students || []);
        const initial: Record<string, boolean> = {};
        (data.students || []).forEach((s: Student) => {
          initial[s._id] = false;
        });
        setAttendance(initial);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [selectedClass, selectedSection, profile]);

  const toggleAttendance = (studentId: string) => {
    setAttendance((prev) => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  const saveAttendance = async () => {
    setIsSaving(true);
    console.log("Saving attendance for class", selectedClass, selectedSection, attendance);
    await new Promise((r) => setTimeout(r, 1000));
    setSuccess("Attendance saved successfully!");
    setIsSaving(false);
  };

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const totalCount = students.length;
  const attendancePercentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  if (isLoading && !profile) {
    return (
      <TeacherDashboard student={null as any} title="Attendance">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </TeacherDashboard>
    );
  }

  return (
    <TeacherDashboard student={null as any} title="Attendance">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-blue-600 rounded-full">
              <UserCheck className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Class Management</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Welcome back, {profile?.name}! Track your class attendance efficiently.
          </p>
        </div>

        {/* Stats Cards */}
        {selectedClass && selectedSection && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Present Today</p>
                    <p className="text-2xl font-bold text-gray-900">{presentCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Attendance Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{attendancePercentage}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Class Selection */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Select Class
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {allClasses.map((cls) => (
                <Button
                  key={cls}
                  variant={cls === selectedClass ? "default" : "outline"}
                  onClick={() => {
                    setSelectedClass(cls);
                    setSelectedSection("");
                    setStudents([]);
                  }}
                  className={`px-6 py-3 text-lg font-medium transition-all duration-200 ${
                    cls === selectedClass
                      ? "bg-blue-600 hover:bg-blue-700 shadow-lg scale-105"
                      : "hover:bg-blue-50 hover:border-blue-300"
                  }`}
                >
                  Class {cls}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section Selection */}
        {selectedClass && (
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Select Section
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {sections.map((sec) => (
                  <Button
                    key={sec}
                    variant={sec === selectedSection ? "default" : "outline"}
                    onClick={() => setSelectedSection(sec)}
                    className={`px-6 py-3 text-lg font-medium transition-all duration-200 ${
                      sec === selectedSection
                        ? "bg-blue-600 hover:bg-blue-700 shadow-lg scale-105"
                        : "hover:bg-blue-50 hover:border-blue-300"
                    }`}
                  >
                    Section {sec}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Attendance List */}
        {selectedSection && (
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Attendance: Class {selectedClass} - Section {selectedSection}
                </div>
                <div className="text-sm text-gray-600">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Loading students...</span>
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No students found for this class and section.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {students.map((stu) => (
                    <div
                      key={stu._id}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                        attendance[stu._id]
                          ? "bg-green-50 border-green-200"
                          : "bg-gray-50 border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => toggleAttendance(stu._id)}
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={attendance[stu._id]}
                          onChange={() => toggleAttendance(stu._id)}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                        />
                        {attendance[stu._id] && (
                          <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {stu.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{stu.name}</p>
                            <p className="text-sm text-gray-500">Roll No: {stu.rollNumber}</p>
                          </div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        attendance[stu._id]
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {attendance[stu._id] ? "Present" : "Absent"}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {students.length > 0 && (
                <div className="mt-8 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {presentCount} of {totalCount} students marked present
                  </div>
                  <div className="flex items-center gap-4">
                    {success && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">{success}</span>
                      </div>
                    )}
                    <Button
                      onClick={saveAttendance}
                      disabled={isSaving}
                      className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Attendance
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </TeacherDashboard>
  );
}