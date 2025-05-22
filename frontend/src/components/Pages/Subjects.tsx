import {  subjects } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText } from "lucide-react";

const Subjects = () => {
  const subjectsByType = subjects.reduce((acc, subject) => {
    const type = subject.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(subject);
    return acc;
  }, {} as Record<string, typeof subjects>);

  const groupedSubjects = Object.entries(subjectsByType);

  return (
   
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Subjects</h1>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Subjects</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <div className="grid grid-cols-1 gap-6 mt-4">
              {groupedSubjects.map(([type, subjectsOfType]) => (
                <Card key={type} className={`border-l-4 border-${type}`}>
                  <CardHeader>
                    <CardTitle className="capitalize">{type}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {subjectsOfType.map(subject => (
                        <Card key={subject.id} className="hover:shadow-md transition-all duration-300">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium text-lg">{subject.name}</h3>
                                <p className="text-sm text-muted-foreground">Teacher: {subject.teacher}</p>
                              </div>
                              <Badge variant="outline" className="capitalize">{subject.type}</Badge>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">18 lessons</span>
                              <FileText className="h-4 w-4 text-muted-foreground ml-2" />
                              <span className="text-sm text-muted-foreground">4 assignments</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="schedule">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-4">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                    <div key={day} className="space-y-4">
                      <h3 className="font-medium text-center">{day}</h3>
                      {day === 'Monday' && (
                        <>
                          <Card className="border-l-4 border-math p-3">
                            <p className="font-medium">Math</p>
                            <p className="text-xs text-muted-foreground">8:00 - 9:30</p>
                          </Card>
                          <Card className="border-l-4 border-science p-3">
                            <p className="font-medium">Science</p>
                            <p className="text-xs text-muted-foreground">10:00 - 11:30</p>
                          </Card>
                        </>
                      )}
                      {day === 'Tuesday' && (
                        <>
                          <Card className="border-l-4 border-english p-3">
                            <p className="font-medium">English</p>
                            <p className="text-xs text-muted-foreground">8:00 - 9:30</p>
                          </Card>
                          <Card className="border-l-4 border-history p-3">
                            <p className="font-medium">History</p>
                            <p className="text-xs text-muted-foreground">10:00 - 11:30</p>
                          </Card>
                        </>
                      )}
                      {day === 'Wednesday' && (
                        <>
                          <Card className="border-l-4 border-math p-3">
                            <p className="font-medium">Math</p>
                            <p className="text-xs text-muted-foreground">8:00 - 9:30</p>
                          </Card>
                          <Card className="border-l-4 border-art p-3">
                            <p className="font-medium">Art</p>
                            <p className="text-xs text-muted-foreground">10:00 - 11:30</p>
                          </Card>
                        </>
                      )}
                      {day === 'Thursday' && (
                        <>
                          <Card className="border-l-4 border-english p-3">
                            <p className="font-medium">English</p>
                            <p className="text-xs text-muted-foreground">8:00 - 9:30</p>
                          </Card>
                          <Card className="border-l-4 border-science p-3">
                            <p className="font-medium">Science</p>
                            <p className="text-xs text-muted-foreground">10:00 - 11:30</p>
                          </Card>
                        </>
                      )}
                      {day === 'Friday' && (
                        <>
                          <Card className="border-l-4 border-math p-3">
                            <p className="font-medium">Math</p>
                            <p className="text-xs text-muted-foreground">8:00 - 9:30</p>
                          </Card>
                          <Card className="border-l-4 border-history p-3">
                            <p className="font-medium">History</p>
                            <p className="text-xs text-muted-foreground">10:00 - 11:30</p>
                          </Card>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  
  );
};

export default Subjects;
