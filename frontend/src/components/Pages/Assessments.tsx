import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Calendar, Clock, AlertCircle, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Assignment = {
  _id: string;
  title: string;
  subject: string;
  className?: string;
  description?: string;
  fileUrl?:string;
  dueDate: string;
  topics?: string[];
};

const Assignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:3001/api/assignments", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setAssignments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const getSubjectColor = (subject: string) => {
    const colors = {
      math: "border-blue-500",
      mathematics: "border-blue-500",
      english: "border-green-500",
      science: "border-purple-500",
      physics: "border-red-500",
      chemistry: "border-yellow-500",
      biology: "border-teal-500",
      history: "border-orange-500",
      geography: "border-indigo-500",
      default: "border-gray-500",
    };
    return (
      colors[subject?.toLowerCase() as keyof typeof colors] || colors.default
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const timeDiff = due.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  if (loading) {
    return (
      <div className="px-8 space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading assignments...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-8 space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Assignments</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assignments.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No assignments found</h3>
            <p className="text-muted-foreground">
              Your assignments will appear here
            </p>
          </div>
        ) : (
          assignments.map((assignment) => {
            const daysUntilDue = getDaysUntilDue(assignment.dueDate);
            const overdue = isOverdue(assignment.dueDate);

            return (
              <Card
                key={assignment._id}
                className={`border-l-4 ${getSubjectColor(assignment.subject)}`}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-2">
                        {assignment.title}
                      </h3>
                      <Badge className="mb-2 capitalize">
                        {assignment.subject}
                      </Badge>
                      {assignment.className && (
                        <Badge variant="outline" className="ml-2">
                          Class {assignment.className}
                        </Badge>
                      )}
                    </div>
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>

                  {assignment.description && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground">
                        {assignment.description}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Due: {formatDate(assignment.dueDate)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span
                        className={`text-sm ${
                          overdue
                            ? "text-red-500 font-medium"
                            : daysUntilDue <= 3
                            ? "text-orange-500 font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        {overdue
                          ? `Overdue by ${Math.abs(daysUntilDue)} day${
                              Math.abs(daysUntilDue) !== 1 ? "s" : ""
                            }`
                          : daysUntilDue === 0
                          ? "Due today"
                          : `${daysUntilDue} day${
                              daysUntilDue !== 1 ? "s" : ""
                            } left`}
                      </span>
                    </div>

                    {overdue && (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-500 font-medium">
                          Overdue
                        </span>
                      </div>
                    )}
                  </div>

                  {assignment.topics && assignment.topics.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Topics:</p>
                      <div className="flex flex-wrap gap-2">
                        {assignment.topics.map((topic, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                {assignment.fileUrl && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                      <span className="text-sm font-medium">Assignment File</span>
                      <a
                        href={`http://localhost:3001${assignment.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm ml-auto"
                      >
                        View PDF
                      </a>
                    </div>
                  </div>
                )}
                  <div className="flex gap-2">
                    <Button
                      variant={overdue ? "destructive" : "default"}
                      className="flex-1"
                      size="sm"
                    >
                      {overdue ? "Submit Late" : "Submit"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Assignments;
