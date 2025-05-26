import type{ Student } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  FileText, 
  Calendar, 
  GraduationCap,
  ClipboardList,
  BarChart3,
  MessageSquare,
  Settings,
  LogOut
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

interface TeacherSidebarProps {
  student: Student;
}

export default function TeacherSidebar({ student }: TeacherSidebarProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center space-x-2 px-2">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <h2 className="text-xl font-bold text-blue-600">Logo</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Teaching</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                  <Link to="/teacher" className="flex items-center">
                    <LayoutDashboard className="w-8 h-8 mr-2" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="My Classes">
                  <Link to="/teacher/classes" className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    <span>My Classes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Subjects">
                  <Link to="/teacher/subjects" className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    <span>Subjects</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Assignments">
                  <Link to="/teacher/assignments" className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    <span>Assignments</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Gradebook">
                  <Link to="/teacher/gradebook" className="flex items-center">
                    <ClipboardList className="w-5 h-5 mr-2" />
                    <span>Gradebook</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Analytics">
                  <Link to="/teacher/analytics" className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    <span>Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Communication</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Messages">
                  <Link to="/teacher/messages" className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    <span>Messages</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Calendar">
                  <Link to="/teacher/calendar" className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>Calendar</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <Link to="/teacher/settings" className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center px-4 py-2">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={student.avatar} />
              <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Prof. Johnson</span>
              <span className="text-xs text-muted-foreground">Mathematics Dept.</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
