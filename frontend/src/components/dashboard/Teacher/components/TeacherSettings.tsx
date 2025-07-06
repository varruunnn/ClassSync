import { useEffect, useState, type ChangeEvent } from "react";
import TeacherDashboard from "@/components/layout/teacher/TeacherDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface MeResponse {
  name: string;
  role: "teacher";
  schoolId: number;
  email: string;
  Id: string;
  subject: string;
  phone: string;
  classes: string[];
  classAssigned: string;
}

const TeacherSettings = () => {
  const [teacher, setTeacher] = useState<MeResponse | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [phone, setPhone] = useState("");
  const [isChangePwdOpen, setIsChangePwdOpen] = useState(false);
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const handleChangePassword = async () => {
    if (newPwd !== confirmPwd) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const res = await fetch(
        "http://localhost:3001/api/auth/change-password",
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
    fetch("http://localhost:3001/api/auth/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data: MeResponse) => {
        setTeacher(data);
        const parts = data.name.split(" ");
        setFirstName(parts.shift() || "");
        setLastName(parts.join(" "));
        setEmail(data.email);
        setSubject(data.subject);
        setPhone(data.phone);
      })
      .catch(console.error);
  }, []);

  if (!teacher) {
    return (
      <TeacherDashboard student={teacher as any} title="Settings">
        <div className="p-8 text-center text-muted-foreground">
          Loading your profile…
        </div>
      </TeacherDashboard>
    );
  }

  return (
    <>
      <TeacherDashboard student={teacher as any} title="Settings">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account and preferences
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        readOnly
                        value={firstName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setFirstName(e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        readOnly
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      readOnly
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input id="department" value={subject} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" value={phone} readOnly />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security (opens modal) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsChangePwdOpen(true)}
                  >
                    Change Password
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </TeacherDashboard>

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
              <Label htmlFor="currentPwd">Current Password</Label>
              <Input
                id="currentPwd"
                type="password"
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="newPwd">New Password</Label>
              <Input
                id="newPwd"
                type="password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="confirmPwd">Confirm New Password</Label>
              <Input
                id="confirmPwd"
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

export default TeacherSettings;
