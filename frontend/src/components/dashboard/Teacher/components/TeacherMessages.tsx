import { useEffect, useState } from "react";
import TeacherDashboard from "@/components/layout/teacher/TeacherDashboardLayout";
import { AlertCircle, CheckCircle, Send, Loader2 } from "lucide-react";

interface Student {
  _id: string;
  name: string;
  rollNumber: string;
}

const TeacherMessages = () => {
  const schoolId = 1;
  const classes = Array.from({ length: 12 }, (_, i) => i + 1);
  const sections = ["A", "B", "C", "D"];

  const [cls, setCls] = useState("");
  const [section, setSection] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);
  useEffect(() => {
    if (!cls || !section) {
      setStudents([]);
      setSelectedStudent("");
      return;
    }

    setIsLoading(true);
    setError("");

    fetch(
      `http://localhost:3001/api/admin/${schoolId}/students?class=${cls}&section=${section}`,
      { credentials: "include" }
    )
      .then((r) => r.json())
      .then((data) => {
        setStudents(data.students || []);
        setSelectedStudent("");
      })
      .catch((e) => {
        console.error("Failed to load students:", e);
        setError("Failed to load students. Please try again.");
      })
      .finally(() => setIsLoading(false));
  }, [cls, section]);

  const sendMessage = async () => {
    if (!selectedStudent || !message.trim()) {
      setError("Please select a student and write a message.");
      return;
    }

    if (message.trim().length < 10) {
      setError("Message should be at least 10 characters long.");
      return;
    }

    setIsSending(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:3001/api/messages", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudent,
          content: message.trim(),
        }),
      });

      if (res.ok) {
        setSuccess("Message sent successfully!");
        setMessage("");
        setSelectedStudent("");
      } else {
        const err = await res.json();
        setError(err.error || "Failed to send message");
      }
    } catch (error) {
      setError("Network error. Please check your connection.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <TeacherDashboard student={null as any} title="Send Message">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            New Message to Parent
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Send important updates and feedback to parents
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          {/* Error/Success Messages */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 animate-in fade-in duration-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 animate-in fade-in duration-300">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{success}</span>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Class Select */}
            <div className="space-y-2">
              <label
                htmlFor="class-select"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Class
              </label>
              <select
                id="class-select"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 transition-all duration-200 text-gray-900 dark:text-white"
                value={cls}
                onChange={(e) => setCls(e.target.value)}
              >
                <option value="">— Select class —</option>
                {classes.map((c) => (
                  <option key={c} value={c}>
                    Class {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Section Select */}
            {cls && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <label
                  htmlFor="section-select"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Section
                </label>
                <select
                  id="section-select"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 transition-all duration-200 text-gray-900 dark:text-white"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                >
                  <option value="">— Select section —</option>
                  {sections.map((s) => (
                    <option key={s} value={s}>
                      Section {s}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Student Select */}
            {(isLoading || students.length > 0) && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <label
                  htmlFor="student-select"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Student
                </label>
                <select
                  id="student-select"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 transition-all duration-200 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  disabled={isLoading}
                >
                  <option value="">
                    {isLoading ? "Loading students..." : "— Choose student —"}
                  </option>
                  {students.map((st) => (
                    <option key={st._id} value={st._id}>
                      {st.name} (Roll {st.rollNumber})
                    </option>
                  ))}
                </select>
                {students.length > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {students.length} student{students.length !== 1 ? "s" : ""}{" "}
                    found
                  </p>
                )}
              </div>
            )}

            {/* Message Input */}
            {selectedStudent && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <label
                  htmlFor="message-textarea"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Message
                </label>
                <textarea
                  id="message-textarea"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 transition-all duration-200 text-gray-900 dark:text-white resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  rows={4}
                  placeholder="Write your message to the parent here... (minimum 10 characters)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSending}
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {message.length} characters
                  </p>
                  {message.length > 0 && message.length < 10 && (
                    <p className="text-xs text-red-500 dark:text-red-400">
                      {10 - message.length} more characters needed
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Send Button */}
            <div className="pt-4">
              <button
                onClick={sendMessage}
                disabled={
                  !selectedStudent ||
                  !message.trim() ||
                  message.trim().length < 10 ||
                  isSending
                }
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                {isSending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                {isSending ? "Sending..." : "Send Message"}
              </button>
            </div>
          </div>
        </div>

        {/* Helper Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Messages will be sent directly to the parent's registered contact
            information
          </p>
        </div>
      </div>
    </TeacherDashboard>
  );
};

export default TeacherMessages;
