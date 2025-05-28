import TeacherDashboard from "@/components/layout/teacher/TeacherDashboard";
import { currentStudent } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Clock,  Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const TeacherClasses = () => {
  const classes = [
    {
      id: 1,
      name: "Mathematics Grade 10",
      students: 25,
      room: "101",
      schedule: "Mon, Wed, Fri - 9:00 AM",
      averageGrade: 85,
      attendance: 92,
      nextClass: "Today 9:00 AM"
    },
    {
      id: 2,
      name: "Physics Grade 11", 
      students: 22,
      room: "Lab 1",
      schedule: "Tue, Thu - 11:00 AM",
      averageGrade: 78,
      attendance: 88,
      nextClass: "Tomorrow 11:00 AM"
    },
    {
      id: 3,
      name: "Mathematics Grade 9",
      students: 28,
      room: "102", 
      schedule: "Mon, Wed, Fri - 2:00 PM",
      averageGrade: 90,
      attendance: 95,
      nextClass: "Today 2:00 PM"
    }
  ];

  return (
    <TeacherDashboard student={currentStudent} title="My Classes">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">My Classes</h1>
            <p className="text-muted-foreground">Manage your classes and student progress</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Class
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{classItem.name}</CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                      <Users className="h-4 w-4 mr-1" />
                      {classItem.students} students
                    </p>
                  </div>
                  <Badge variant="outline">Room {classItem.room}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    {classItem.schedule}
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-blue-500" />
                    Next: {classItem.nextClass}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Average Grade</span>
                      <span className="font-medium">{classItem.averageGrade}%</span>
                    </div>
                    <Progress value={classItem.averageGrade} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Attendance</span>
                      <span className="font-medium">{classItem.attendance}%</span>
                    </div>
                    <Progress value={classItem.attendance} className="h-2" />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1">View Details</Button>
                    <Button size="sm" variant="outline" className="flex-1">Take Attendance</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </TeacherDashboard>
  );
};

export default TeacherClasses;
