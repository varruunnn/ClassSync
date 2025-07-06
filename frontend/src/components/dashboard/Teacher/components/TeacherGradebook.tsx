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

interface Student {
  _id: string;
  name: string;
  rollNumber: string;
  unitTestAvg?: number;
  halfYearlyAvg?: number;
  yearlyAvg?: number;
}

export default function TeacherGradebook() {
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Record<string, { unitTestAvg: number; halfYearlyAvg: number; yearlyAvg: number }>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/api/auth/me", { credentials: "include" })
      .then(res => res.json())
      .then((data: TeacherProfile) => {
        setProfile(data);
        return data;
      })
      .then(data => {
        return fetch(
          `http://localhost:3001/api/admin/${data.schoolId}/students?class=${data.classAssigned}`,
          { credentials: "include" }
        );
      })
      .then(res => res.json())
      .then(data => {
        setStudents(data.students || []);
        // initialize grades state
        const initialGrades: typeof grades = {};
        (data.students || []).forEach((s: Student) => {
          initialGrades[s._id] = {
            unitTestAvg: s.unitTestAvg || 0,
            halfYearlyAvg: s.halfYearlyAvg || 0,
            yearlyAvg: s.yearlyAvg || 0,
          };
        });
        setGrades(initialGrades);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (
    studentId: string,
    field: keyof (typeof grades)[string],
    value: number
  ) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value }
    }));
  };

  const saveGrades = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const payload = Object.entries(grades).map(([studentId, vals]) => ({
        studentId,
        ...vals
      }));
      await fetch("http://localhost:3001/api/grades/bulk-update", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          class: profile.classAssigned,
          grades: payload
        })
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
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
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
                          value={grades[student._id]?.unitTestAvg || ''}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleChange(student._id, "unitTestAvg", Number(e.target.value))
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
                          value={grades[student._id]?.halfYearlyAvg || ''}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleChange(student._id, "halfYearlyAvg", Number(e.target.value))
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
                          value={grades[student._id]?.yearlyAvg || ''}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleChange(student._id, "yearlyAvg", Number(e.target.value))
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
                    📝 {students.length} students • Remember to save your changes
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

          {/* Footer Info */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>💡 Tip: Grades are automatically validated (0-100). Changes are saved to the database when you click "Save All Grades".</p>
          </div>
        </div>
      </div>
    </TeacherDashboard>
  );
}