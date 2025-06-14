import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Subjects = () => {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch(
          "http://localhost:3001/api/students/subjects/me",
          {
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        const data: { subjects: string[] } = await res.json();
        setSubjects(data.subjects || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const subjectColors = [
    'from-blue-500 to-purple-600',
    'from-green-500 to-teal-600',
    'from-orange-500 to-red-600',
    'from-purple-500 to-pink-600',
    'from-teal-500 to-cyan-600',
    'from-indigo-500 to-blue-600',
    'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-600',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="px-8 py-12 space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Subjects
            </h1>
            <p className="text-slate-600 text-lg">Manage your academic journey</p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
              <span className="text-sm font-medium text-slate-700">
                {subjects.length} {subjects.length === 1 ? 'Subject' : 'Subjects'}
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
              <p className="mt-4 text-slate-600 font-medium">Loading subjects...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-red-800">Error loading subjects</h3>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg p-1">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 font-medium px-6 py-2 rounded-lg transition-all duration-200"
              >
                All Subjects
              </TabsTrigger>
              <TabsTrigger 
                value="schedule" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 font-medium px-6 py-2 rounded-lg transition-all duration-200"
              >
                Schedule
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {subjects.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">No subjects found</h3>
                  <p className="text-slate-500">You haven't enrolled in any subjects yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {subjects.map((name, index) => (
                    <Card 
                      key={name} 
                      className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${subjectColors[index % subjectColors.length]} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${subjectColors[index % subjectColors.length]}`} />
                      
                      <CardContent className="relative p-8 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subjectColors[index % subjectColors.length]} flex items-center justify-center shadow-lg`}>
                            <span className="text-white font-bold text-lg">
                              {name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-bold text-xl text-slate-800 group-hover:text-slate-900 transition-colors duration-200">
                            {name}
                          </h3>
                          <p className="text-slate-500 text-sm mt-1">Click to view details</p>
                        </div>
                        
                        <div className="flex items-center space-x-4 pt-2">
                          <div className="flex items-center space-x-1 text-xs text-slate-500">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>Active</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="schedule" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <CardTitle className="text-2xl font-bold flex items-center space-x-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Weekly Schedule</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => (
                      <div key={day} className="space-y-4">
                        <div className="text-center">
                          <h3 className="font-bold text-lg text-slate-800 mb-1">{day}</h3>
                          <div className="w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                        </div>
                        
                        <div className="space-y-3">
                          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 hover:shadow-md transition-all duration-300">
                            <CardContent className="p-4 text-center">
                              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-2">
                                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <p className="font-medium text-slate-600 text-sm">No classes</p>
                              <p className="text-xs text-slate-500 mt-1">scheduled</p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">Schedule coming soon</h4>
                        <p className="text-slate-600 text-sm">Your class schedule will appear here once it's available.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Subjects;