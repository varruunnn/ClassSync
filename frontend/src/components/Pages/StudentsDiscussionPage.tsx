import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  Send,
  BookOpen,
  User,
  Clock,
  AlertCircle,
  Loader2,
  Search,
  Filter,
  ChevronDown,
  Plus,
} from "lucide-react";

interface Discussion {
  _id: string;
  author: { name: string };
  question: string;
  subject: string;
  createdAt: string;
  contactInfo?: string;
}

const StudentsDiscussionPage: React.FC = () => {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubject, setSubject] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [list, setList] = useState<Discussion[]>([]);
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/api/students/subjects/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setSubjects(data.subjects || []);
        if (data.subjects?.length) {
          setSubject(data.subjects[0]);
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!selectedSubject) return;
    setLoading(true);
    fetch(
      `http://localhost:3001/api/students/discussions?subject=${encodeURIComponent(
        selectedSubject
      )}`,
      {
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then(setList)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedSubject]);

  const submit = async () => {
    if (!question.trim()) {
      setError("Please type your question");
      return;
    }

    const res = await fetch("http://localhost:3001/api/students/discussions", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        subject: selectedSubject,
        contactInfo: contact,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error || "Post failed");
      return;
    }
    const newItem: Discussion = await res.json();
    setList([newItem, ...list]);
    setQuestion("");
    setShowForm(false);
    setError("");
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;
    try {
      setDeletingId(id);
      const res = await fetch(
        `http://localhost:3001/api/students/discussions/${id}`,
        {
          credentials: "include",
          method: "Delete",
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `Delete failed (${res.status})`);
      }
      setList((prev) => prev.filter((item) => item._id !== id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };
  const filteredList = list.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return `${Math.floor(diffInMs / (1000 * 60))}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Student Discussion Hub
            </h1>
          </div>
          <p className="text-gray-600">Connect, learn, and grow together</p>
        </div>

        {/* Subject Selector & Controls */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 min-w-0">
              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-700">Subject</span>
                </div>
                <div className="relative">
                  <select
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
                    value={selectedSubject}
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    {subjects.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </label>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              Ask Question
            </button>
          </div>
        </div>

        {/* Question Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6 transform transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              Post Your Question
            </h3>

            <div className="space-y-4">
              <div className="relative">
                <textarea
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  rows={4}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What's your doubt? Be specific to get better answers..."
                />
                <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                  {question.length}/500
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Contact Info
                </label>
                <input
                  type="text"
                  className="w-full border rounded-xl p-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="WhatsApp / Telegram / Email…"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="flex gap-3">
                  <button
                    onClick={submit}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                    Post Question
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search discussions..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Discussions Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            Discussions in "{selectedSubject}"
          </h3>
          <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {filteredList.length} discussion
            {filteredList.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Discussions List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-gray-600">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span>Loading discussions...</span>
              </div>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-100">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No discussions yet
              </h3>
              <p className="text-gray-500">
                Be the first to ask a question in this subject!
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredList.map((item, index) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "fadeInUp 0.6s ease-out forwards",
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-800">
                          {item.author.name}
                        </span>
                        <p className="mt-[0.7px] text-sm text-gray-600">
                          <strong>Contact:</strong> {item.contactInfo}
                        </p>
                        <span className="text-gray-400">•</span>
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                          <Clock className="w-4 h-4" />
                          {formatDate(item.createdAt)}
                        </div>
                      </div>

                      <p className="text-gray-700 leading-relaxed">
                        {item.question}
                      </p>

                      <div className="mt-4 flex items-center gap-2">
                        <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {item.subject}
                        </div>
                        <button
                          onClick={() => handleDelete(item._id)}
                          disabled={deletingId === item._id}
                          className="absolute top-2 right-2 cursor-pointer text-sm text-red-600 hover:underline disabled:opacity-50"
                        >
                          {deletingId === item._id ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default StudentsDiscussionPage;
