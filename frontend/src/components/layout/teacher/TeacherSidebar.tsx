import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  FilePlus2,
  Calendar,
  UserCircle,
  BellRing,
  Settings,
  School,
} from "lucide-react";
import { useSidebar } from "@/components/contexts/SidebarContext";
interface User {
  name?: string;
  email?: string;
}

const navigation = [
  { name: "Dashboard", href: "/teacher", icon: LayoutDashboard },
  { name: "My Class", href: "/teacher/classes", icon: School },
  { name: "Subjects", href: "/teacher/subjects", icon: FileText },
  { name: "Assignments", href: "/teacher/assignments", icon: FilePlus2 },
  { name: "GradeBook", href: "/teacher/gradebook", icon: UserCircle },
  { name: "Message", href: "/teacher/messages", icon: Calendar },
  { name: "Calender", href: "/teacher/calendar", icon: BellRing },
  { name: "Settings", href: "/teacher/settings", icon: Settings },
];

const TeacherSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { isOpen, isMobile, toggleSidebar } = useSidebar();
  const [showLogout, setShowLogout] = useState(false);
  const [user, setUser] = useState<User>({});
  const location = useLocation();
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
    const fetchUserInfo = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/auth/me", {
          credentials: "include",
        });
        const data: User = await res.json();

        if (res.ok) {
          setUser(data);
        } else {
          console.error(
            "Failed to fetch user info:",
            (data as any).message || "Unknown error"
          );
          setUser({});
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
        setUser({});
      }
    };

    fetchUserInfo();
  }, []);
  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-white text-black transition-all duration-300 ease-in-out",
          collapsed ? "w-20" : "w-50",
          isMobile
            ? isOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0",
          "md:relative"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-primary-foreground/10">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <span className={cn("text-xl font-bold", collapsed && "hidden")}>
                logo
              </span>
            </Link>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-md hover:bg-primary-foreground/10 hidden md:block"
            >
              {collapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => isMobile && toggleSidebar()}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-gray-200 text-primary-foreground"
                      : "text-primary-foreground/70 hover:bg-slate-200 hover:text-primary-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-7 h-7 text-blue-900 transition-all duration-300",
                      !collapsed && "mr-3"
                    )}
                  />
                  <span
                    className={cn(
                      "text-black font-normal transition-all duration-300 overflow-hidden whitespace-nowrap",
                      collapsed
                        ? "opacity-0 max-w-0"
                        : "opacity-100 max-w-[200px]"
                    )}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-gray-400 relative">
            <div
              className="flex items-center justify-between space-x-3 cursor-pointer"
              onClick={() => setShowLogout((prev) => !prev)}
            >
              {!collapsed && (
                <>
                  <div>
                    <p className="text-sm font-medium">
                      {user.name || "Loading..."}
                    </p>
                    <p className="text-sm tracking-tighter break-all text-gray-400">
                      {user.email || ""}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 top-[-10px] relative h-4 transform transition-transform duration-200 ${
                      showLogout ? "rotate-180" : ""
                    }`}
                  />
                </>
              )}
            </div>

            {showLogout && !collapsed && (
              <div className="absolute -top-10 right-4 z-50">
                <button
                  onClick={handleLogout}
                  className="px-1 py-1 text-sm text-red-600 bg-red-100 hover:bg-red-200 rounded-md shadow"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherSidebar;
