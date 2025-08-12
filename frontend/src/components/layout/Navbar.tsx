import { User, ChevronDown, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useSidebar } from "../contexts/SidebarContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const Navbar = () => {
  const [user, setUser] = useState<{ name?: string; email?: string }>({});
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const [isChangePwdOpen, setIsChangePwdOpen] = useState(false);
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const handleLogout = async (): Promise<void> => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      navigate("/");
      localStorage.removeItem("schoolId");
      localStorage.removeItem("role");
      window.location.reload();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleChangePassword = async () => {
    if (newPwd !== confirmPwd) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/change-password`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword: currentPwd,
            newPassword: newPwd,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Password changed successfully.");
        setIsChangePwdOpen(false);
        setCurrentPwd("");
        setNewPwd("");
        setConfirmPwd("");
      } else {
        alert(data.message || "Failed to change password.");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      alert("An error occurred.");
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/students/myinfo`, {
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
      <header className="bg-white shadow-lg p-4 flex items-center justify-between border">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium text-gray-700">
            Student Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="flex items-center max-[468px]:mr-[17px] max-[365px]:mr-[80px] gap-2">
                <User size={18} />
                <span>{user.name}</span>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsChangePwdOpen(true)}>
                Change Password
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Change Password Modal */}
      <Dialog open={isChangePwdOpen} onOpenChange={setIsChangePwdOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Current Password
              </label>
              <Input
                type="password"
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                New Password
              </label>
              <Input
                type="password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm New Password
              </label>
              <Input
                type="password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsChangePwdOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangePassword}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;
