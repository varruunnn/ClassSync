import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSidebar } from "../contexts/SidebarContext";
import {
  HomeIcon,
  BookOpenIcon,
  CalendarIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  ChatBubbleBottomCenterTextIcon,
  ChatBubbleOvalLeftEllipsisIcon 
} from "@heroicons/react/24/outline";
const navigation = [
  { name: "Dashboard",       href: "/student",           icon: HomeIcon },
  { name: "Subjects",        href: "/student/subjects",  icon: BookOpenIcon },
  { name: "Assignments",     href: "/student/assessment",icon:  ClipboardDocumentCheckIcon },
  { name: "Discussion",      href: "/student/discussion",     icon: ChatBubbleBottomCenterTextIcon },
  { name: "Parent Portal",   href: "/student/parent",    icon: UserGroupIcon },
  { name: "Notices",         href: "/student/calendar",  icon: CalendarIcon },
  { name: "Chat with PDF",   href: "/student/chat-with-pdf", icon: ChatBubbleOvalLeftEllipsisIcon  },
];
const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { isOpen, isMobile, toggleSidebar } = useSidebar();
  const location = useLocation();

  const [user, setUser] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/students/myinfo", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data.data);
        } else {
          console.error("Failed to fetch user info:", data.message);
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

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
          <div className="flex items-center justify-between h-16 px-4 border-b border-primary-foreground/10">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <span className={cn("text-xl font-bold", collapsed && "hidden")}>
                Classync
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
          <div className="p-4 border-t border-gray-400">
            <div className="flex items-center space-x-3">
              {!collapsed && (
                <div>
                  <p className="text-sm font-medium">
                    {user.name || "Loading..."}
                  </p>
                  <p className="text-sm tracking-tighter break-all text-gray-400">
                    {user.email || ""}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
