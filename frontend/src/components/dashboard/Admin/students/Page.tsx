import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  MoreHorizontal,
  Trash2,
  GraduationCap,
  Mail,
  Phone,
  Bell,
  Grid,
  List,
  Edit,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Student {
  id: string;
  name: string;
  class: string;
  rollNumber: string;
  email: string;
  parentContact: string;
}

export default function StudentsPage() {
  const { schoolId: ctxSchoolId, loading: authLoading } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState<{
    name: string;
    class: string;
    rollNumber: string;
    email: string;
    parentContact: string;
  }>({
    name: "",
    class: "",
    rollNumber: "",
    email: "",
    parentContact: "",
  });

  const classes = ["1", "2", "3", "4", "5", "6"];

  useEffect(() => {
    if (!authLoading && typeof ctxSchoolId === "number") {
      fetchStudents();
    }
  }, [authLoading, ctxSchoolId]);

  const fetchStudents = async () => {
    if (typeof ctxSchoolId !== "number") return;
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/api/admin/${ctxSchoolId}/students`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to load students");
      }
      const data = await response.json();
      setStudents(
        data.students.map((s: any) => ({
          id: s._id,
          name: s.name,
          class: String(s.class).trim(),
          rollNumber: s.rollNumber,
          email: s.email,
          parentContact: s.parentContact,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteStudent = async (id: string) => {
    if (typeof ctxSchoolId !== "number") return;
    try {
      const response = await fetch(
        `http://localhost:3001/api/admin/${ctxSchoolId}/students/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to delete student");
      }
      setStudents((prev) => prev.filter((st) => st.id !== id));
    } catch (error) {
      console.error("Failed to delete student:", error);
    }
  };

  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.class || !newStudent.rollNumber) {
      return;
    }
    const student: Student = {
      id: Date.now().toString(),
      ...newStudent,
    };
    setStudents((prev) => [student, ...prev]);
    setNewStudent({
      name: "",
      class: "",
      rollNumber: "",
      email: "",
      parentContact: "",
    });
    setIsAddDialogOpen(false);
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass =
      selectedClass === "all" || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Students</h1>
            <p className="text-muted-foreground">
              Manage student records and enrollment
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-12">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Loading students...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Add Dialog */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            Manage student records and enrollment
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="h-11">
              <Plus className="mr-2 h-5 w-5" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl">Add New Student</DialogTitle>
              <DialogDescription>
                Enter the student's information below to add them to the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-5 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={newStudent.name}
                  onChange={(e) =>
                    setNewStudent({
                      ...newStudent,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter student's full name"
                  className="h-11"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="class" className="text-sm font-medium">
                  Class *
                </Label>
                <Select
                  onValueChange={(value) =>
                    setNewStudent({
                      ...newStudent,
                      class: value,
                    })
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        Class {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rollNumber" className="text-sm font-medium">
                  Roll Number *
                </Label>
                <Input
                  id="rollNumber"
                  value={newStudent.rollNumber}
                  onChange={(e) =>
                    setNewStudent({
                      ...newStudent,
                      rollNumber: e.target.value,
                    })
                  }
                  placeholder="Enter roll number"
                  className="h-11"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newStudent.email}
                  onChange={(e) =>
                    setNewStudent({
                      ...newStudent,
                      email: e.target.value,
                    })
                  }
                  placeholder="student@school.edu"
                  className="h-11"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="parentContact" className="text-sm font-medium">
                  Parent Contact
                </Label>
                <Input
                  id="parentContact"
                  value={newStudent.parentContact}
                  onChange={(e) =>
                    setNewStudent({
                      ...newStudent,
                      parentContact: e.target.value,
                    })
                  }
                  placeholder="Enter parent's phone number"
                  className="h-11"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddStudent} className="min-w-[100px]">
                Add Student
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Student Directory Table / Grid */}
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Student Directory</CardTitle>
              <CardDescription className="mt-1">
                Comprehensive list of all enrolled students
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4 mr-1" />
                Grid
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
              >
                <List className="h-4 w-4 mr-1" />
                Table
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-4 pt-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, roll number, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[200px] h-11">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    Class {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {viewMode === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-6">
              {filteredStudents.map((student) => (
                <Card
                  key={student.id}
                  className="hover:shadow-lg transition-all duration-200 border-0 shadow-md"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                          <GraduationCap className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg truncate text-gray-900">
                            {student.name}
                          </CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                              Class {student.class}
                            </span>
                            <span className="text-sm text-gray-500">
                              #{student.rollNumber}
                            </span>
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteStudent(student.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
                        <Mail className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <span
                          className="text-sm truncate"
                          title={student.email}
                        >
                          {student.email || "No email provided"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
                        <Phone className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">
                          {student.parentContact || "No contact provided"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b">
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Student
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Class
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Roll Number
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Parent Contact
                    </th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.map((student, index) => (
                    <tr
                      key={student.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-25"
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                            <GraduationCap className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {student.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              Student ID: {student.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {student.class}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-mono text-sm text-gray-700">
                          {student.id}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-600">
                          {student.email || "Not provided"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-600">
                          {student.parentContact || "Not provided"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Student
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteStudent(student.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Student
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredStudents.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Bell className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {students.length === 0
                    ? "No students yet"
                    : "No students found"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {students.length === 0
                    ? "Get started by adding your first student to the system."
                    : searchTerm || selectedClass !== "all"
                    ? "Try adjusting your search terms or class filter to find students."
                    : "Students will appear here once they're added to the system."}
                </p>
                {students.length === 0 && (
                  <Button onClick={() => setIsAddDialogOpen(true)} size="lg">
                    <Plus className="mr-2 h-5 w-5" />
                    Add Your First Student
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
