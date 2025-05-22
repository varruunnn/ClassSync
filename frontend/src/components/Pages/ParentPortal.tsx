
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Mail, MessageSquare, Phone, Calendar, FileText, AlertCircle } from "lucide-react";

const ParentPortal = () => {
  // Mock data for parent communications
  const communications = [
    {
      id: "1",
      from: "Ms. Johnson",
      subject: "Math Performance Update",
      message: "Your child has shown great improvement in algebra this month. We're focusing on geometry next.",
      date: "2025-05-15T14:30:00",
      read: true
    },
    {
      id: "2",
      from: "Principal Williams",
      subject: "Upcoming Parent-Teacher Conference",
      message: "Please join us for the quarterly parent-teacher conference scheduled for May 26th.",
      date: "2025-05-12T09:15:00",
      read: false
    },
    {
      id: "3",
      from: "Coach Davis",
      subject: "Sports Day Participation",
      message: "We encourage all students to participate in the upcoming Sports Day event on June 5th.",
      date: "2025-05-10T16:45:00",
      read: true
    }
  ];

  // Mock data for approved parent contacts
  const parentContacts = [
    { name: "Mrs. Smith", role: "Math Teacher", email: "smith@example.edu", phone: "123-456-7890" },
    { name: "Mr. Johnson", role: "Science Teacher", email: "johnson@example.edu", phone: "123-456-7891" },
    { name: "Dr. Williams", role: "Principal", email: "williams@example.edu", phone: "123-456-7892" },
    { name: "Ms. Davis", role: "Guidance Counselor", email: "davis@example.edu", phone: "123-456-7893" },
  ];

  return (

      <div className=" px-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Parent Portal</h1>
            <p className="text-muted-foreground">Stay connected with your child's education</p>
          </div>
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Guardian Access</Badge>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
            <TabsTrigger value="contacts">School Contacts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Student Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/image" alt="student" />
                      <AvatarFallback>ST</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-lg">name</h3>
                      <p className="text-sm text-muted-foreground"> Grade</p>
                      <p className="text-sm text-muted-foreground">Email</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Parent/Guardian:</span>
                      <span>John & Mary Smith</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Contact Email:</span>
                      <span>Parent Email</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Emergency Phone:</span>
                      <span>(555) 123-4567</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Address:</span>
                      <span>123 Address New Delhi India</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Latest events and notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-md">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      <span className="font-medium">Upcoming Parent-Teacher Meeting</span>
                    </div>
                    <p className="text-sm mt-1">Thursday, May 26th, 4:00 PM - Main Auditorium</p>
                  </div>
                  
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-r-md">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Term Progress Report Available</span>
                    </div>
                    <p className="text-sm mt-1">You can now view and download the latest progress report</p>
                  </div>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-md">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Summer Term Registration</span>
                    </div>
                    <p className="text-sm mt-1">Registration for summer term courses is now open</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Academic Progress Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-gray-50 rounded-md text-center">
                        <h4 className="text-2xl font-bold text-blue-600">92%</h4>
                        <p className="text-sm text-muted-foreground">Average Score</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-md text-center">
                        <h4 className="text-2xl font-bold text-green-600">4</h4>
                        <p className="text-sm text-muted-foreground">GPA</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-md text-center">
                        <h4 className="text-2xl font-bold text-amber-600">3</h4>
                        <p className="text-sm text-muted-foreground">Pending Assignments</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-md text-center">
                        <h4 className="text-2xl font-bold text-purple-600">90%</h4>
                        <p className="text-sm text-muted-foreground">Attendance Rate</p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Subject Performance</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Mathematics</span>
                            <span className="text-sm">95%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full">
                            <div className="h-2 bg-blue-500 rounded-full" style={{ width: "95%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Science</span>
                            <span className="text-sm">88%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full">
                            <div className="h-2 bg-green-500 rounded-full" style={{ width: "88%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">English</span>
                            <span className="text-sm">92%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full">
                            <div className="h-2 bg-amber-500 rounded-full" style={{ width: "92%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">History</span>
                            <span className="text-sm">85%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full">
                            <div className="h-2 bg-red-500 rounded-full" style={{ width: "85%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="communications">
            <div className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Messages</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {communications.map((comm) => (
                      <Card key={comm.id} className={`${!comm.read ? 'bg-blue-50' : ''}`}>
                        <CardContent className="p-4">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{comm.subject}</h3>
                            <Badge variant={comm.read ? "outline" : "default"}>
                              {comm.read ? "Read" : "New"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">From: {comm.from}</p>
                          <p className="text-sm mt-2">{comm.message}</p>
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-xs text-muted-foreground">
                              {new Date(comm.date).toLocaleString()}
                            </span>
                            <Button variant="outline" size="sm">Reply</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Send Message</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Recipient</label>
                        <select className="w-full rounded-md border mt-1 p-2">
                          <option value="">Select recipient...</option>
                          {parentContacts.map((contact) => (
                            <option key={contact.email} value={contact.email}>
                              {contact.name} ({contact.role})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Subject</label>
                        <input 
                          type="text" 
                          className="w-full rounded-md border mt-1 p-2" 
                          placeholder="Message subject"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Message</label>
                        <Textarea 
                          placeholder="Type your message here..." 
                          className="mt-1"
                        />
                      </div>
                      <Button>Send Message</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="contacts">
            <div className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span>School Contacts</span>
                  </CardTitle>
                  <CardDescription>
                    Important contacts for your child's education
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {parentContacts.map((contact) => (
                      <Card key={contact.email}>
                        <CardContent className="p-4">
                          <h3 className="font-medium">{contact.name}</h3>
                          <p className="text-sm text-muted-foreground">{contact.role}</p>
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <a href={`mailto:${contact.email}`} className="text-sm hover:underline">
                                {contact.email}
                              </a>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <a href={`tel:${contact.phone}`} className="text-sm hover:underline">
                                {contact.phone}
                              </a>
                            </div>
                          </div>
                          <div className="mt-4 flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Mail className="h-4 w-4 mr-1" />
                              Email
                            </Button>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Message
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
  );
};

export default ParentPortal;
