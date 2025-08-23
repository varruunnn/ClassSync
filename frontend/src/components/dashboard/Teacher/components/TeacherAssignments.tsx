import TeacherDashboard from "@/components/layout/teacher/TeacherDashboardLayout";
import { currentStudent } from "@/data/mockData";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Calendar,
  Clock,
  Plus,
  Upload,
  X,
  File,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Assignment = {
  _id: string;
  title: string;
  subject: string;
  className: string;
  topics: string[];
  sec?: string;
  description?: string;
  fileUrl?: string;
  dueDate: string;
  schoolId: number;
  createdBy: string;
};

const TeacherAssignments = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewAssignmentDialog, setShowNewAssignmentDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    subject: "",
    className: "",
    sec: "",
    description: "",
    dueDate: "",
    topics: "",
    schoolId: 1,
    createdBy: "6847354b34eb2262bfabd594", 
  });
  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/assignments`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch assignments");
      }
      const data = await response.json();
      setAssignments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  const deleteAssignment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/assignments/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setAssignments(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete error");
    }
  };
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Please select a PDF file only");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      setSelectedFile(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById(
      "assignment-file"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };


const handleCreateAssignment = async () => {
  try {
    setIsCreating(true);

    const { title, subject, className, dueDate } = newAssignment;

    if (!title.trim()) return alert("Title is required");
    if (!subject.trim()) return alert("Subject is required");
    if (!className.trim()) return alert("Class name is required");
    if (!dueDate) return alert("Due date is required");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subject", subject);
    formData.append("className", className);
    formData.append("sec", newAssignment.sec || "");
    formData.append("description", newAssignment.description || "");
    formData.append("dueDate", new Date(dueDate).toISOString());

    const topicsArray = newAssignment.topics
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    topicsArray.forEach((topic) => formData.append("topics", topic));

    if (selectedFile) {
      formData.append("file", selectedFile);
    }
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/assignments`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to create assignment");

    const created = await response.json();
    setAssignments((prev) => [...prev, created]);
    setShowNewAssignmentDialog(false);
    setSelectedFile(null);
    setNewAssignment({
      title: "",
      subject: "",
      className: "",
      sec: "",
      description: "",
      dueDate: "",
      topics: "",
      schoolId: 1,
      createdBy: "6847354b34eb2262bfabd594",
    });
  } catch (err) {
    alert("Error creating assignment: " + (err instanceof Error ? err.message : "Unknown"));
  } finally {
    setIsCreating(false);
  }
};


  const getStatusColor = (assignment: Assignment) => {
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);

    if (dueDate < now) {
      return "bg-red-500"; // overdue
    } else if (dueDate.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return "bg-yellow-500"; // due soon
    } else {
      return "bg-green-500"; // active
    }
  };

  const getStatus = (assignment: Assignment) => {
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);

    if (dueDate < now) {
      return "overdue";
    } else if (dueDate.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return "due soon";
    } else {
      return "active";
    }
  };

  const getPriorityColor = (assignment: Assignment) => {
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    const daysUntilDue = Math.ceil(
      (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilDue < 3) return "destructive";
    if (daysUntilDue < 7) return "default";
    return "secondary";
  };

  const getPriority = (assignment: Assignment) => {
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    const daysUntilDue = Math.ceil(
      (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilDue < 3) return "high";
    if (daysUntilDue < 7) return "medium";
    return "low";
  };

  const calculateDaysLeft = (dueDate: string | Date) => {
    const now = new Date();
    const due = new Date(dueDate);
    const daysLeft = Math.ceil(
      (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return Math.max(0, daysLeft);
  };

  if (loading) {
    return (
      <TeacherDashboard student={currentStudent} title="Assignments">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading assignments...</div>
        </div>
      </TeacherDashboard>
    );
  }

  if (error) {
    return (
      <TeacherDashboard student={currentStudent} title="Assignments">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">Error: {error}</div>
        </div>
      </TeacherDashboard>
    );
  }

  return (
    <TeacherDashboard student={currentStudent} title="Assignments">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Assignments</h1>
            <p className="text-muted-foreground">
              Create and manage student assignments
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Dialog
              open={showNewAssignmentDialog}
              onOpenChange={setShowNewAssignmentDialog}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Assignment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Assignment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={newAssignment.title}
                        onChange={(e) =>
                          setNewAssignment((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="Assignment title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={newAssignment.subject}
                        onChange={(e) =>
                          setNewAssignment((prev) => ({
                            ...prev,
                            subject: e.target.value,
                          }))
                        }
                        placeholder="Subject"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="className">Class *</Label>
                      <Input
                        id="className"
                        value={newAssignment.className}
                        onChange={(e) =>
                          setNewAssignment((prev) => ({
                            ...prev,
                            className: e.target.value,
                          }))
                        }
                        placeholder="Class name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sec">Section</Label>
                      <Input
                        id="sec"
                        value={newAssignment.sec}
                        onChange={(e) =>
                          setNewAssignment((prev) => ({
                            ...prev,
                            sec: e.target.value,
                          }))
                        }
                        placeholder="Section (optional)"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newAssignment.description}
                      onChange={(e) =>
                        setNewAssignment((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Assignment description"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="dueDate">Due Date *</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newAssignment.dueDate}
                      onChange={(e) =>
                        setNewAssignment((prev) => ({
                          ...prev,
                          dueDate: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="topics">Topics (comma-separated)</Label>
                    <Input
                      id="topics"
                      value={newAssignment.topics}
                      onChange={(e) =>
                        setNewAssignment((prev) => ({
                          ...prev,
                          topics: e.target.value,
                        }))
                      }
                      placeholder="Topic1, Topic2, Topic3"
                    />
                  </div>

                  <div>
                    <Label htmlFor="assignment-file">
                      Assignment File (PDF)
                    </Label>
                    <div className="mt-2">
                      {!selectedFile ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600 mb-2">
                            Upload assignment file (PDF only)
                          </p>
                          <Input
                            id="assignment-file"
                            type="file"
                            accept=".pdf"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document
                                .getElementById("assignment-file")
                                ?.click()
                            }
                          >
                            Choose File
                          </Button>
                        </div>
                      ) : (
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <File className="h-8 w-8 text-red-500" />
                              <div>
                                <p className="font-medium text-sm">
                                  {selectedFile.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                                  MB
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={removeSelectedFile}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowNewAssignmentDialog(false);
                        setSelectedFile(null);
                      }}
                      disabled={isCreating}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateAssignment}
                      disabled={isCreating}
                    >
                      {isCreating ? "Creating..." : "Create Assignment"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {assignments.map((assignment) => (
            <Card
              key={assignment._id}
              className="hover:shadow-xl hover:scale-[1.01] transition-all duration-200"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {assignment.title}
                        <div
                          className={`w-2 h-2 rounded-full ${getStatusColor(
                            assignment
                          )}`}
                        />
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground flex-wrap">
                        <span>{assignment.subject}</span>
                        <span>•</span>
                        <span>Class {assignment.className}</span>
                        {assignment.sec && (
                          <>
                            <span>•</span>
                            <span>Sec {assignment.sec}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant={getPriorityColor(assignment)}>
                      {getPriority(assignment)}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {getStatus(assignment)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {calculateDaysLeft(assignment.dueDate)} days left
                    </span>
                  </div>
                </div>

                {assignment.description && (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">
                      {assignment.description}
                    </p>
                  </div>
                )}

                {assignment.fileUrl && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                      <File className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium">
                        Assignment File
                      </span>
                      <a
                        href={`${import.meta.env.VITE_API_BASE}${assignment.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm ml-auto"
                      >
                        View PDF
                      </a>
                    </div>
                  </div>
                )}

                {assignment.topics && assignment.topics.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {assignment.topics.map((topic, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteAssignment(assignment._id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {assignments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No assignments yet</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first assignment
            </p>
            <Button onClick={() => setShowNewAssignmentDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Assignment
            </Button>
          </div>
        )}
      </div>
    </TeacherDashboard>
  );
};

export default TeacherAssignments;
