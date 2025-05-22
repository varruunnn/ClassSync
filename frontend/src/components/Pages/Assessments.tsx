
import { recentTests } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Calendar, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Assessments = () => {
  // Upcoming assessments mock data
  const upcomingAssessments = [
    {
      id: "1",
      title: "Mathematics Unit Test",
      subject: "math" as const,
      date: "2025-05-25",
      time: "09:00 AM",
      location: "Room 101",
      topics: ["Algebra", "Geometry", "Calculus"]
    },
    {
      id: "2",
      title: "English Essay Submission",
      subject: "english" as const,
      date: "2025-05-22",
      time: "11:59 PM",
      location: "Online",
      topics: ["Literary Analysis", "Critical Thinking"]
    },
    {
      id: "3",
      title: "Science Practical Exam",
      subject: "science" as const,
      date: "2025-05-29",
      time: "10:30 AM",
      location: "Lab 3",
      topics: ["Chemistry", "Physics", "Biology"]
    },
  ];

  return (
    
      <div className="px-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Assessments</h1>
        </div>

        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {upcomingAssessments.map((assessment) => (
                <Card key={assessment.id} className={`border-l-4 border-${assessment.subject}`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{assessment.title}</h3>
                        <Badge className="mt-1 capitalize">{assessment.subject}</Badge>
                      </div>
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(assessment.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{assessment.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{assessment.location}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium">Topics:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {assessment.topics.map((topic) => (
                          <Badge key={topic} variant="outline">{topic}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" className="w-full">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="past">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {recentTests.map((test) => (
                <Card key={test.id} className={`border-l-4 border-${test.subject}`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{test.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(test.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={`${test.marks / test.maxMarks >= 0.7 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'} border-0`}>
                        {test.marks}/{test.maxMarks}
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div
                          className={`h-2 rounded-full ${test.percentile >= 75 ? 'bg-green-500' : 'bg-amber-500'}`}
                          style={{ width: `${(test.marks / test.maxMarks) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span>Score: {Math.round((test.marks / test.maxMarks) * 100)}%</span>
                        <span>Percentile: {test.percentile}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <Button variant="outline" size="sm" className="text-xs">
                        <FileText className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

  );
};

export default Assessments;
