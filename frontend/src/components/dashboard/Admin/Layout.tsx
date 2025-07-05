import type React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  Users,
  GraduationCap,
  UserCheck,
  Bell,
  School,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const navigation = [
  {
    title: "Overview",
    items: [{ title: "Dashboard", href: "/admin", icon: BarChart3 }],
  },
  {
    title: "Management",
    items: [
      { title: "Teachers", href: "/admin/teachers", icon: Users },
      { title: "Students", href: "/admin/students", icon: GraduationCap },
      { title: "Assign Class Teacher", href: "/admin/assignct", icon: UserCheck },
      { title: "Assign Teacher", href: "/admin/assign", icon: UserCheck },
    ],
  },
  {
    title: "Communication",
    items: [{ title: "Notice Board", href: "/admin/notices", icon: Bell }],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  type UserData = {
    name?: string;
    email?: string;
  };
  const [userdata, setuserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
   const { isAuthenticated, userRole, schoolId: ctxSchoolId } = useAuth();
  const [error, setError] = useState<unknown>(null);
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || userRole !== "admin") {
        navigate("/login");
      }
    }
  }, [isAuthenticated, userRole, loading, navigate]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3001/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/auth/me", {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error(`Profile Fetching Failed ${res.status}`);
        }
        const data = await res.json();
        setuserData(data);
      } catch (err) {
        setError(err);
        alert(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <School className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold">Classync</span>
                <span className="text-xs text-muted-foreground">
                  School Management
                </span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-4 py-4">
            {navigation.map((group) => (
              <SidebarGroup key={group.title}>
                <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {group.title}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton asChild isActive={isActive}>
                            <Link
                              to={item.href}
                              className="flex items-center gap-3"
                            >
                              <Icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
          {loading ? (
            "loading....."
          ) : (
            <SidebarFooter className="mx-[-20px]">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 px-3"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-sm">
                      <span className="font-medium">
                        {userdata?.name ?? ""}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {userdata?.email ?? ""}
                      </span>
                    </div>
                    <ChevronDown className="ml-auto h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarFooter>
          )}
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center text-sm">
              <span className="font-medium">Admin</span>
              {pathname && pathname !== "/admin" && (
                <>
                  <span className="mx-2 text-muted-foreground">/</span>
                  <span className="capitalize">
                    {pathname.split("/").pop()}
                  </span>
                </>
              )}
            </div>
          </header>

          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
