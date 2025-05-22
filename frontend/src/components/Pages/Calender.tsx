
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, Calendar as CalendarIcon, Clock } from "lucide-react";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Mock events data
  const events = [
    {
      id: "1",
      title: "Math Test",
      type: "assessment",
      subject: "math",
      date: new Date(2025, 4, 20),
      time: "09:00 AM",
      location: "Room 101"
    },
    {
      id: "2",
      title: "English Essay Due",
      type: "assignment",
      subject: "english",
      date: new Date(2025, 4, 22),
      time: "11:59 PM",
      location: "Online"
    },
    {
      id: "3",
      title: "Science Lab",
      type: "class",
      subject: "science",
      date: new Date(2025, 4, 18),
      time: "10:30 AM",
      location: "Lab 3"
    },
    {
      id: "4",
      title: "History Presentation",
      type: "assessment",
      subject: "history",
      date: new Date(2025, 4, 25),
      time: "02:00 PM",
      location: "Room 204"
    },
    {
      id: "5",
      title: "Parent-Teacher Meeting",
      type: "event",
      subject: "general",
      date: new Date(2025, 4, 26),
      time: "04:00 PM",
      location: "Main Auditorium"
    }
  ];

  // Events for the selected date
  const selectedDateEvents = events.filter(
    (event) => date && event.date.toDateString() === date.toDateString()
  );

  // Function to generate calendar day modifier classes
//   const getDayClassName = (day: Date) => {
//     const hasEvent = events.some(event => event.date.toDateString() === day.toDateString());
//     if (hasEvent) {
//       return "bg-blue-50 text-blue-800 font-medium border border-blue-200";
//     }
//     return "";
//   };

  // Function to get event type icon
  const getEventIcon = (type: string) => {
    switch (type) {
      case "assessment":
        return <FileText className="h-4 w-4" />;
      case "assignment":
        return <BookOpen className="h-4 w-4" />;
      case "class":
        return <CalendarIcon className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
 
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Academic Calendar</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  modifiers={{
                    hasEvent: (day) => events.some(event => 
                      event.date.toDateString() === day.toDateString()
                    )
                  }}
                  modifiersClassNames={{
                    hasEvent: "bg-blue-50 text-blue-800 font-medium border border-blue-200"
                  }}
                />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>
                  {date ? date.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 'Select a date'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDateEvents.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDateEvents.map((event) => (
                      <div 
                        key={event.id} 
                        className={`p-3 rounded-md border-l-4 border-${event.subject} bg-gray-50`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{event.title}</h3>
                            <p className="text-sm text-muted-foreground">{event.time} - {event.location}</p>
                          </div>
                          <div className={`p-1 rounded-full bg-${event.subject}-100`}>
                            {getEventIcon(event.type)}
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className="mt-2 capitalize"
                        >
                          {event.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No events scheduled for this day
                  </p>
                )}
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events
                    .filter(event => event.date >= new Date())
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .slice(0, 3)
                    .map(event => (
                      <div key={event.id} className="flex items-center gap-3">
                        <div className={`p-2 rounded-full bg-${event.subject}-100`}>
                          {getEventIcon(event.type)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{event.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {event.date.toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })} - {event.time}
                          </p>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
   
  );
};

export default Calendar;
