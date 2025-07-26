import React, { useState, useEffect } from "react";

interface Discussion {
  _id: string;
  author: { name: string };
  question: string;
  subject: string;
  createdAt: string;
  contactInfo?: string;
}

interface Subject {
  _id: string;
  name: string;
}

const StudentsDiscussionPage: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [question, setQuestion] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResponses, setAiResponses] = useState<{ [key: string]: string }>({});
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedResponses, setExpandedResponses] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/students/subjects/me`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data: { subjects: Subject[] }) => {
        setSubjects(data.subjects || []);
        if (data.subjects?.length) {
          setSelectedSubject(data.subjects[0].name);
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!selectedSubject) return;
    setLoading(true);
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/students/discussions?subject=${encodeURIComponent(
        selectedSubject
      )}`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((list: Discussion[]) => {
        setDiscussions(list);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedSubject]);

  const submit = async () => {
    if (!question.trim()) {
      setError("Please type a question.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/students/discussions`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question,
            subject: selectedSubject,
            contactInfo: contact,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to post");
      const newItem: Discussion = await res.json();
      setDiscussions((prev) => [newItem, ...prev]);
      setQuestion("");
      setContact("");
      setError(null);
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteDiscussion = async (discussionId: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/students/discussions/${discussionId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to delete");
      setDiscussions((prev) => prev.filter((d) => d._id !== discussionId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const askAIAboutQuestion = async (id: string, question: string) => {
    setAiLoading(id);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/ai/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      if (data.answer) {
        setAiResponses((prev) => ({ ...prev, [id]: data.answer }));
      }
    } catch (err) {
      setAiResponses((prev) => ({
        ...prev,
        [id]: "⚠️ Failed to get AI response. Please try again.",
      }));
    } finally {
      setAiLoading(null);
    }
  };

  const toggleResponseExpansion = (id: string) => {
    setExpandedResponses(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

const formatAIResponse = (response: string) => {
  const processedResponse = response
    .replace(/\$\$(.*?)\$\$/g, '<div class="math-display">$1</div>') 
    .replace(/\$(.*?)\$/g, '<span class="math-inline">$1</span>');
  const paragraphs = processedResponse.split('\n\n').filter(p => p.trim());
  
  return paragraphs.map((paragraph, index) => {
    if (paragraph.includes('•') || paragraph.match(/^\d+\./)) {
      const items = paragraph.split(/\n(?=•|\d+\.)/);
      return (
        <ul key={index} className="list-disc list-inside space-y-1 mb-3">
          {items.map((item, itemIndex) => (
            <li key={itemIndex} className="text-gray-700" 
                dangerouslySetInnerHTML={{ 
                  __html: item.replace(/^•\s*/, '').replace(/^\d+\.\s*/, '') 
                }} />
          ))}
        </ul>
      );
    }
    return (
      <p key={index} className="text-gray-700 mb-3 leading-relaxed"
         dangerouslySetInnerHTML={{ __html: paragraph }} />
    );
  });
};

  const clearAIResponse = (id: string) => {
    setAiResponses(prev => {
      const newResponses = { ...prev };
      delete newResponses[id];
      return newResponses;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <span className="text-4xl">💬</span>
              Discussion Hub
            </h1>
            <p className="text-blue-100 text-lg">
              Ask questions, share knowledge, and connect with classmates
            </p>
          </div>
        </div>

        {/* Subject Selector Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-xl">📚</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Select Subject
            </h2>
          </div>
          <select
            className="w-full border-2 border-gray-300 rounded-lg p-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            {subjects.map((s) => (
              <option key={s._id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* New Question Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xl">✏️</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Ask a Question
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Question
              </label>
              <textarea
                className="w-full border-2 border-gray-300 rounded-lg p-4 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"
                rows={4}
                placeholder="What would you like to ask about this subject?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Information (Optional)
              </label>
              <input
                className="w-full border-2 border-gray-300 rounded-lg p-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                placeholder="Email, phone, or any way classmates can reach you"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <button
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                onClick={submit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    <span>Post Question</span>
                  </>
                )}
              </button>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                  <span className="text-red-500 text-sm">⚠️</span>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Discussion List Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-xl">🗣️</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Recent Questions
                  {selectedSubject && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      in {selectedSubject}
                    </span>
                  )}
                </h2>
              </div>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {discussions.length}{" "}
                {discussions.length === 1 ? "question" : "questions"}
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600">Loading discussions...</p>
                </div>
              </div>
            )}

            {!loading && discussions.length === 0 && (
              <div className="text-center py-12 space-y-3">
                <div className="text-6xl">🤔</div>
                <h3 className="text-lg font-medium text-gray-700">
                  No discussions yet
                </h3>
                <p className="text-gray-500">
                  Be the first to ask a question in this subject!
                </p>
              </div>
            )}

            {!loading && discussions.length > 0 && (
              <div className="space-y-4">
                {discussions.map((d, _index) => (
                  <div
                    key={d._id}
                    className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-sm">
                          {d.author.name.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-800">
                            {d.author.name}
                          </h4>
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                            {new Date(d.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        <p className="text-gray-700 leading-relaxed mb-3">
                          {d.question}
                        </p>

                        {d.contactInfo && (
                          <div className="flex items-center gap-2 text-sm mb-3">
                            <span className="text-gray-500">📧</span>
                            <span className="text-gray-600 bg-white px-2 py-1 rounded border">
                              {d.contactInfo}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => askAIAboutQuestion(d._id, d.question)}
                              disabled={aiLoading === d._id}
                              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                              {aiLoading === d._id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                  <span>Asking AI...</span>
                                </>
                              ) : (
                                <>
                                  <span>🤖</span>
                                  <span>Ask AI</span>
                                </>
                              )}
                            </button>
                          </div>
                          
                          <button
                            onClick={() => deleteDiscussion(d._id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-all duration-200"
                            title="Delete discussion"
                          >
                            <span className="text-lg">🗑️</span>
                          </button>
                        </div>

                        {/* AI Response Section */}
                        {aiResponses[d._id] && (
                          <div className="mt-4 border-t border-gray-200 pt-4">
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 overflow-hidden">
                              <div className="flex items-center justify-between bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-blue-600">🤖</span>
                                  <span className="font-semibold text-blue-800">AI Assistant</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => toggleResponseExpansion(d._id)}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                                  >
                                    {expandedResponses[d._id] ? "Collapse" : "Expand"}
                                  </button>
                                  <button
                                    onClick={() => clearAIResponse(d._id)}
                                    className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                                  >
                                    Clear
                                  </button>
                                </div>
                              </div>
                              
                              <div className="p-4">
                                <div className={`overflow-hidden transition-all duration-300 ${
                                  expandedResponses[d._id] ? 'max-h-none' : 'max-h-32'
                                }`}>
                                  <div className="text-sm">
                                    {formatAIResponse(aiResponses[d._id])}
                                  </div>
                                </div>
                                
                                {!expandedResponses[d._id] && aiResponses[d._id].length > 200 && (
                                  <div className="bg-gradient-to-t from-blue-50 to-transparent h-8 -mt-8 relative">
                                    <button
                                      onClick={() => toggleResponseExpansion(d._id)}
                                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium transition-colors"
                                    >
                                      Show more
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            💡 Tip: Use clear, specific questions to get better responses from
            your classmates and AI assistant
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentsDiscussionPage;