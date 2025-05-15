import type { Student } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Users, 
  Calendar, 
  Settings,
  LogOut
} from "lucide-react";
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

interface SidebarComponentProps {
  student: Student;
}

export default function SidebarComponent({ student }: SidebarComponentProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {/* <div className="flex items-center space-x-2 px-2">
          <h2 className="text-xl font-bold">EduSRM</h2>
        </div> */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                  <a href="/" className="flex items-center">
                    <LayoutDashboard className="w-5 h-5 mr-2" />
                    <span>Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Subjects">
                  <a href="#" className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    <span>Subjects</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Assessments">
                  <a href="#" className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    <span>Assessments</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Calendar">
                  <a href="#" className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>Calendar</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Parent Portal">
                  <a href="#" className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    <span>Parent Portal</span>
                  </a>
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
                  <a href="#" className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    <span>Settings</span>
                  </a>
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
              <span className="text-sm font-medium">{student.name}</span>
              <span className="text-xs text-muted-foreground">{student.grade}</span>
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
