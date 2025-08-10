import { useEffect, useState } from "react";
import TeacherDashboard from "@/components/layout/teacher/TeacherDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, UserCheck, Mail, Phone, Hash, User, GraduationCap } from "lucide-react";

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

interface StudentSummary {
  _id: string;
  name: string;
  rollNumber: string;
}

interface StudentDetail {
  _id: string;
  name: string;
  email: string;
  class: string;
  section: string;
  rollNumber: string;
  parentContact: string;
}

export default function TeacherClasses() {
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [allClasses, setAllClasses] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [sections] = useState<string[]>(["A", "B", "C", "D"]);
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, { credentials: "include" })
      .then(res => res.json())
      .then((data: TeacherProfile) => {
        setProfile(data);
        const classes = Array.from(new Set([...(data.classes || []), data.classAssigned]));
        setAllClasses(classes);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedClass || !selectedSection || !profile) return;
    setSelectedStudent(null);
    setIsLoading(true);
    const schoolId = profile.schoolId;
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/admin/${schoolId}/students?class=${selectedClass}&section=${selectedSection}`,
      { credentials: "include" }
    )
      .then(res => res.json())
      .then((data) => {
        setStudents(data.students || []);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [selectedClass, selectedSection, profile]);

  const handleStudentClick = (studentId: string) => {
    if (!profile) return;
    setIsLoadingDetail(true);
    const schoolId = profile.schoolId;
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/admin/${schoolId}/students/${studentId}`,
      { credentials: "include" }
    )
      .then(res => res.json())
      .then((data) => {
        setSelectedStudent(data.student);
      })
      .catch(console.error)
      .finally(() => setIsLoadingDetail(false));
  };

  if (isLoading && !profile) {
    return (
      <TeacherDashboard student={null as any} title="Student Details">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </TeacherDashboard>
    );
  }

  return (
    <TeacherDashboard student={null as any} title="Student Details">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          {/* Enhanced Header */}
          <div className="text-center space-y-6 py-8">
            <div className="flex items-center justify-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 rounded-full blur-xl opacity-20"></div>
                <div className="relative p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg">
                  <UserCheck className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Class Management
                </h1>
                <p className="text-xl text-gray-600 mt-2">
                  Welcome back, <span className="font-semibold text-blue-600">{profile?.name}</span>!
                </p>
              </div>
            </div>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Select a class and section to view and manage your students efficiently
            </p>
          </div>

          {/* Class Selection with improved design */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <BookOpen className="h-6 w-6" />
                Select Class
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {allClasses.map((cls) => (
                  <Button
                    key={cls}
                    variant={cls === selectedClass ? "default" : "outline"}
                    onClick={() => {
                      setSelectedClass(cls);
                      setSelectedSection("");
                    }}
                    className={`h-12 text-lg font-medium transition-all duration-200 ${
                      cls === selectedClass 
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105" 
                        : "hover:bg-blue-50 hover:border-blue-300 hover:scale-102"
                    }`}
                  >
                    Class {cls}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Section Selection with improved design */}
          {selectedClass && (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Users className="h-6 w-6" />
                  Select Section
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {sections.map((sec) => (
                    <Button
                      key={sec}
                      variant={sec === selectedSection ? "default" : "outline"}
                      onClick={() => setSelectedSection(sec)}
                      className={`h-12 text-lg font-medium transition-all duration-200 ${
                        sec === selectedSection 
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105" 
                          : "hover:bg-indigo-50 hover:border-indigo-300 hover:scale-102"
                      }`}
                    >
                      Section {sec}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Content Grid */}
          {selectedSection && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Student List */}
              <div className="lg:col-span-2">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                    <CardTitle className="text-xl">
                      Students in Class {selectedClass} Section {selectedSection}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-16">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                          <p className="text-gray-500">Loading students...</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {students.map((stu) => (
                          <div
                            key={stu._id}
                            className="group p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:from-blue-50 hover:to-indigo-50 cursor-pointer border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-lg hover:scale-102"
                            onClick={() => handleStudentClick(stu._id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                                  <User className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {stu.name}
                                  </p>
                                  <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <Hash className="h-3 w-3" />
                                    Roll No: {stu.rollNumber}
                                  </p>
                                </div>
                              </div>
                              <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <GraduationCap className="h-5 w-5" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Student Detail Card */}
              <div className="lg:col-span-1">
                {isLoadingDetail && (
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                    <CardContent className="p-8">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                        <p className="text-gray-500">Loading student details...</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {selectedStudent && (
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 sticky top-6">
                    <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
                      <CardTitle className="text-xl">Student Details</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                          <User className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <User className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-semibold text-gray-900">{selectedStudent.name}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Mail className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-semibold text-gray-900">{selectedStudent.email}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <BookOpen className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-500">Class</p>
                              <p className="font-semibold text-gray-900">{selectedStudent.class}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <Users className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-500">Section</p>
                              <p className="font-semibold text-gray-900">{selectedStudent.section}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Hash className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Roll Number</p>
                            <p className="font-semibold text-gray-900">{selectedStudent.rollNumber}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Phone className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Parent Contact</p>
                            <p className="font-semibold text-gray-900">{selectedStudent.parentContact}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {!selectedStudent && !isLoadingDetail && selectedSection && (
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                    <CardContent className="p-8 text-center">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="h-8 w-8 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-gray-500 text-lg">Select a student</p>
                          <p className="text-sm text-gray-400">Click on any student to view their details</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </TeacherDashboard>
  );
}