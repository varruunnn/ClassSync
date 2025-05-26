import TeacherDashboard from "@/components/layout/teacher/TeacherDashboard";
import { currentStudent } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CalendarDays, Clock, MapPin, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TeacherCalendar = () => {
  const today = new Date();
  const currentMonth = today.toLocaleString('default', { month: 'long', year: 'numeric' });

  const events = [
    {
      id: 1,
      title: "Mathematics Grade 10",
      type: "class",
      time: "9:00 AM - 10:00 AM",
      room: "Room 101",
      date: "2025-05-26",
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "Faculty Meeting",
      type: "meeting",
      time: "3:00 PM - 4:00 PM", 
      room: "Conference Room",
      date: "2025-05-26",
      color: "bg-red-500"
    },
    {
      id: 3,
      title: "Physics Lab Session",
      type: "class",
      time: "11:00 AM - 12:30 PM",
      room: "Lab 1",
      date: "2025-05-27",
      color: "bg-green-500"
    },
    {
      id: 4,
      title: "Parent-Teacher Conference",
      type: "meeting",
      time: "2:00 PM - 3:00 PM",
      room: "Room 102",
      date: "2025-05-28",
      color: "bg-purple-500"
    }
  ];

  const upcomingEvents = events.filter(event => new Date(event.date) >= today).slice(0, 5);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const getEventsForDay = (day: number) => {
    const dateStr = `2025-05-${day.toString().padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const days = getDaysInMonth(today);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <TeacherDashboard student={currentStudent} title="Calendar">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Calendar</h1>
            <p className="text-muted-foreground">Manage your teaching schedule and events</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {currentMonth}
                </CardTitle>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {weekDays.map(day => (
                  <div key={day} className="text-center font-medium text-sm text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => (
                  <div
                    key={index}
                    className={`min-h-[80px] p-1 border rounded-lg ${
                      day === today.getDate() ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                    } ${!day ? 'border-transparent' : ''}`}
                  >
                    {day && (
                      <>
                        <div className="font-medium text-sm mb-1">{day}</div>
                        <div className="space-y-1">
                          {getEventsForDay(day).map(event => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded text-white truncate ${event.color}`}
                            >
                              {event.title}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map(event => (
                    <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-3 h-3 rounded-full ${event.color} mt-1`} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{event.title}</h4>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          {event.time}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {event.room}
                        </div>
                        <Badge variant="outline" className="mt-1 capitalize text-xs">
                          {event.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button className="w-full" size="sm">Schedule Class</Button>
                  <Button className="w-full" variant="outline" size="sm">Book Meeting Room</Button>
                  <Button className="w-full" variant="outline" size="sm">Set Office Hours</Button>
                  <Button className="w-full" variant="outline" size="sm">Create Reminder</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TeacherDashboard>
  );
};

export default TeacherCalendar;
