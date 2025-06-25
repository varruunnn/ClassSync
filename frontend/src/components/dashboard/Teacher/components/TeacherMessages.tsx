import TeacherDashboard from "@/components/layout/teacher/TeacherDashboardLayout";
import { currentStudent } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Search, Plus, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const TeacherMessages = () => {
  const conversations = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Student",
      lastMessage: "Could you explain the homework problem #5?",
      time: "2 min ago",
      unread: 2,
      avatar: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Principal Wilson",
      role: "Administrator",
      lastMessage: "Faculty meeting scheduled for tomorrow",
      time: "1 hour ago",
      unread: 0,
      avatar: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Mrs. Chen",
      role: "Parent",
      lastMessage: "Thank you for the progress update",
      time: "3 hours ago",
      unread: 1,
      avatar: "/placeholder.svg"
    },
    {
      id: 4,
      name: "Michael Davis",
      role: "Student",
      lastMessage: "When is the next test?",
      time: "1 day ago",
      unread: 0,
      avatar: "/placeholder.svg"
    }
  ];

  const currentChat = {
    name: "Sarah Johnson",
    role: "Student",
    messages: [
      {
        id: 1,
        sender: "Sarah Johnson",
        content: "Hi Prof. Johnson, I'm having trouble with problem #5 from today's homework.",
        time: "10:30 AM",
        isMe: false
      },
      {
        id: 2,
        sender: "You",
        content: "Hi Sarah! I'd be happy to help. Which part specifically are you stuck on?",
        time: "10:32 AM",
        isMe: true
      },
      {
        id: 3,
        sender: "Sarah Johnson",
        content: "Could you explain the homework problem #5?",
        time: "10:35 AM",
        isMe: false
      }
    ]
  };

  return (
    <TeacherDashboard student={currentStudent} title="Messages">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Messages</h1>
            <p className="text-muted-foreground">Communicate with students, parents, and staff</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Message
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Conversations</CardTitle>
                <Button variant="ghost" size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={conversation.avatar} />
                        <AvatarFallback>{conversation.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate">{conversation.name}</p>
                          <Badge variant="outline" className="text-xs">{conversation.role}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{conversation.time}</p>
                      {conversation.unread > 0 && (
                        <Badge className="mt-1 h-5 w-5 p-0 text-xs">{conversation.unread}</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Window */}
          <Card className="lg:col-span-2 flex flex-col">
            <CardHeader className="border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{currentChat.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{currentChat.role}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {currentChat.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isMe
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${message.isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input placeholder="Type your message..." className="flex-1" />
                <Button>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </TeacherDashboard>
  );
};

export default TeacherMessages;
