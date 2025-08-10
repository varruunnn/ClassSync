import { useEffect, useState, type ChangeEvent } from "react";
import TeacherDashboard from "@/components/layout/teacher/TeacherDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TeacherProfile {
  name: string;
  role: string;
  schoolId: number;
  classAssigned: string;
}
interface ExamSubject {
  _id: string;
  name: string;
}
interface Student {
  _id: string;
  name: string;
  rollNumber: string;
  email: string;
  unitTestAvg?: number;
  halfYearlyAvg?: number;
  yearlyAvg?: number;
}
interface ExamEntry {
  studentId: string;
  studentEmail: string;
  marks: { subjectId: string; marks: number }[];
}

export default function TeacherGradebook() {
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [examMarks, setExamMarks] = useState<Record<string, Record<string, number>>>({});
  const [grades, setGrades] = useState<
    Record<
      string,
      { unitTestAvg: number; halfYearlyAvg: number; yearlyAvg: number }
    >
  >({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingExam, setSavingExam] = useState(false);
  const [subjects, setSubjects] = useState<ExamSubject[]>([]);
  useEffect(() => {
    async function loadAll() {
      try {
        const meRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, { credentials: "include" });
        const meData: TeacherProfile = await meRes.json();
        setProfile(meData);
        const stuRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/admin/${meData.schoolId}/students?class=${meData.classAssigned}`,
          { credentials: "include" }
        );
        const stuJson = await stuRes.json();
        const stuList: Student[] = stuJson.students || [];
        setStudents(stuList);
        setSubjects(stuJson.subjects || []);
        const initGrades: typeof grades = {};
        stuList.forEach((s) => {
          initGrades[s._id] = {
            unitTestAvg: s.unitTestAvg || 0,
            halfYearlyAvg: s.halfYearlyAvg || 0,
            yearlyAvg: s.yearlyAvg || 0,
          };
        });
        setGrades(initGrades);
        const examRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/exams/latest?class=${meData.classAssigned}&section=A&examType=classTest`,
          { credentials: "include" }
        );
        const examJson = await examRes.json();
        if (examJson.success) {
          const grid: Record<string, Record<string, number>> = {};
          examJson.data.forEach((entry: any) => {
            grid[entry.studentId] = {};
            entry.marks.forEach((m: any) => {
              grid[entry.studentId][m.subjectId] = m.marks;
            });
          });
          setExamMarks(grid);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  const handleChange = (
    studentId: string,
    field: keyof (typeof grades)[string],
    value: number
  ) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value },
    }));
  };
  const saveExamMarks = async () => {
    if (!profile) return;
    setSavingExam(true);
    try {
      const entries: ExamEntry[] = students.map((s) => ({
        studentId: s._id,
        studentEmail: s.email,
        marks: subjects.map((sub) => ({
          subjectId: sub._id,
          marks: examMarks[s._id]?.[sub._id] || 0,
        })),
      }));
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/exams/latest`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          class: profile?.classAssigned,
          section: "A",
          examType: "classTest",
          entries,
        }),
      });
      alert("Exam marks saved successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to save exam marks");
    } finally {
      setSavingExam(false);
    }
  };
    const handleExamChange = (studentId: string, subjectId: string, value: number) => {
    setExamMarks((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [subjectId]: value }
    }));
  };
  const saveGrades = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const payload = Object.entries(grades).map(([studentId, vals]) => ({
        studentId,
        ...vals,
      }));
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/grades/bulk-update`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          class: profile.classAssigned,
          grades: payload,
        }),
      });
      alert("Grades updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to save grades");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <TeacherDashboard student={null as any} title="Gradebook">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 text-lg">Loading gradebook...</p>
          </div>
        </div>
      </TeacherDashboard>
    );
  }

  return (
    <TeacherDashboard student={null as any} title="Gradebook">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg p-6 text-white">
              <h1 className="text-3xl font-bold mb-2">
                📚 Gradebook Management
              </h1>
              <p className="text-blue-100 text-lg">
                Class {profile?.classAssigned} • {students.length} Students
              </p>
            </div>
          </div>

          {/* Main Content Card */}
          <Card className="shadow-xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">📊</span>
                </div>
                Enter Student Grades
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Table Header */}
              <div className="bg-gray-800 text-white px-6 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">👤</span>
                    <span>Student Information</span>
                  </div>
                  <div className="text-center flex items-center justify-center gap-2">
                    <span className="text-blue-300">📝</span>
                    <span>Unit Test %</span>
                  </div>
                  <div className="text-center flex items-center justify-center gap-2">
                    <span className="text-green-300">📋</span>
                    <span>Half-Yearly %</span>
                  </div>
                  <div className="text-center flex items-center justify-center gap-2">
                    <span className="text-purple-300">🎯</span>
                    <span>Yearly %</span>
                  </div>
                </div>
              </div>

              {/* Student Rows */}
              <div className="divide-y divide-gray-200">
                {students.map((student, index) => (
                  <div
                    key={student._id}
                    className={`px-6 py-4 hover:bg-gray-50 transition-colors duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                      {/* Student Info */}
                      <div className="space-y-1">
                        <div className="font-semibold text-gray-900 text-lg">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                            Roll #{student.rollNumber}
                          </span>
                        </div>
                      </div>

                      {/* Unit Test Input */}
                      <div className="space-y-1">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={grades[student._id]?.unitTestAvg || ""}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleChange(
                              student._id,
                              "unitTestAvg",
                              Number(e.target.value)
                            )
                          }
                          className="text-center font-medium border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="0-100"
                        />
                      </div>

                      {/* Half-Yearly Input */}
                      <div className="space-y-1">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={grades[student._id]?.halfYearlyAvg || ""}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleChange(
                              student._id,
                              "halfYearlyAvg",
                              Number(e.target.value)
                            )
                          }
                          className="text-center font-medium border-green-200 focus:border-green-500 focus:ring-green-500"
                          placeholder="0-100"
                        />
                      </div>

                      {/* Yearly Input */}
                      <div className="space-y-1">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={grades[student._id]?.yearlyAvg || ""}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleChange(
                              student._id,
                              "yearlyAvg",
                              Number(e.target.value)
                            )
                          }
                          className="text-center font-medium border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                          placeholder="0-100"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Save Button Section */}
              <div className="bg-gray-50 px-6 py-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="text-sm text-gray-600">
                    📝 {students.length} students • Remember to save your
                    changes
                  </div>
                  <Button
                    onClick={saveGrades}
                    disabled={saving}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {saving ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>💾</span>
                        <span>Save All Grades</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <div>
            <h2 className="text-2xl font-bold mb-4">
              📋 Class Test Marks Entry(%)
            </h2>
            <Card>
              <CardHeader className="bg-gray-100">
                <CardTitle>Enter Class Test Marks (0-100)</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2">Student</th>
                      {subjects.map((sub) => (
                        <th key={sub._id} className="border p-2 text-center">
                          {sub.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s._id} className="hover:bg-gray-50">
                        <td className="border p-2">
                          {s.name} (#{s.rollNumber})
                        </td>
                        {subjects.map((sub) => (
                          <td key={sub._id} className="border p-1">
                            <Input
                              type="number"
                              min={0}
                              max={100}
                              value={examMarks[s._id]?.[sub._id] ?? ""}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleExamChange(
                                  s._id,
                                  sub._id,
                                  Number(e.target.value)
                                )
                              }
                              className="w-full text-center"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-4 border-t flex justify-end">
                  <Button onClick={saveExamMarks} disabled={savingExam}>
                    {savingExam ? "Saving..." : "Save Class Test Marks"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </TeacherDashboard>
  );
}
