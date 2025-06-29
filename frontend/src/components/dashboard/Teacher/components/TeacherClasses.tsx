import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Calendar,
  Clock,
  Plus,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import TeacherDashboard from "@/components/layout/teacher/TeacherDashboardLayout";

const API_URL = "http://localhost:3001/api/teacher"; 

interface Classroom {
  _id: string;
  name: string;
  room: string;
  students: number;
  subject: string;
  schedule: string;
  nextClass: string;
  attendance: number;
  averageGrade: number;
}

const TeacherClasses = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await axios.get(`${API_URL}/classes`);
        setClassrooms(response.data);
        setSelectedClassroom(response.data[0]); // Select the first classroom by default
      } catch (error) {
        console.error("Failed to fetch classrooms", error);
      }
    };

    fetchClassrooms();
  }, []);

  return (
    <TeacherDashboard student={{ 
      id: "123",
      name: "Demo Student",
      avatar: "https://i.pravatar.cc/100",
      email: "demo@student.com",
      parentEmail: "parent@demo.com",
      grade: "10",
   }} title="Classroom">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">My Classes</h1>
            <p className="text-muted-foreground">
              Manage your classes and student progress
            </p>
            {selectedClassroom && (
              <p className="text-sm text-blue-600 mt-1">
                Currently viewing: {selectedClassroom.name}
              </p>
            )}
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

        {/* Highlight Selected Classroom */}
        {selectedClassroom && (
          <Card className="border-2 border-blue-500 bg-blue-50">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {selectedClassroom.name}
                    <Badge variant="default" className="bg-blue-600">
                      Currently Selected
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground flex items-center mt-1">
                    <Users className="h-4 w-4 mr-1" />
                    {selectedClassroom.students} students
                  </p>
                </div>
                <Badge variant="outline">Room {selectedClassroom.room}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  {selectedClassroom.schedule}
                </div>

                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-blue-500" />
                  Next: {selectedClassroom.nextClass}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Grade</span>
                    <span className="font-medium">
                      {selectedClassroom.averageGrade}%
                    </span>
                  </div>
                  <Progress
                    value={selectedClassroom.averageGrade}
                    className="h-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Attendance</span>
                    <span className="font-medium">
                      {selectedClassroom.attendance}%
                    </span>
                  </div>
                  <Progress
                    value={selectedClassroom.attendance}
                    className="h-2"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Take Attendance
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map((classItem) => (
            <Card
              key={classItem._id}
              onClick={() => setSelectedClassroom(classItem)}
              className={`hover:shadow-lg transition-shadow cursor-pointer ${
                selectedClassroom?._id === classItem._id ? "opacity-75" : ""
              }`}
            >
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
                      <span className="font-medium">
                        {classItem.averageGrade}%
                      </span>
                    </div>
                    <Progress
                      value={classItem.averageGrade}
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Attendance</span>
                      <span className="font-medium">
                        {classItem.attendance}%
                      </span>
                    </div>
                    <Progress value={classItem.attendance} className="h-2" />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Take Attendance
                    </Button>
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
