import type React from "react"
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
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  BarChart3,
  Users,
  GraduationCap,
  UserCheck,
  Bell,
  School,
  Settings,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react"
import { Link, useLocation } from "react-router-dom" // ✅ useLocation instead of usePathname

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
      { title: "Assign Teacher", href: "/admin/assign", icon: UserCheck },
    ],
  },
  {
    title: "Communication",
    items: [{ title: "Notice Board", href: "/admin/notices", icon: Bell }],
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const pathname = location.pathname // ✅ get path from React Router

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
                <span className="text-lg font-semibold">EduConnect</span>
                <span className="text-xs text-muted-foreground">School Management</span>
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
                      const Icon = item.icon
                      const isActive = pathname === item.href
                      return (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton asChild isActive={isActive}>
                            <Link to={item.href} className="flex items-center gap-3">
                              <Icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>

          <SidebarFooter className="border-t mx-[-20px]">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" className="w-full justify-start gap-3 px-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-sm">
                    <span className="font-medium">Admin User</span>
                    <span className="text-xs text-muted-foreground">admin@school.edu</span>
                  </div>
                  <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
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
                  <span className="capitalize">{pathname.split("/").pop()}</span>
                </>
              )}
            </div>
          </header>

          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
