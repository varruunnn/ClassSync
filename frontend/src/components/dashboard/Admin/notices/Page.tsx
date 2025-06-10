import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreHorizontal,
  Trash2,
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  Calendar,
} from "lucide-react";

interface Notice {
  id: string; // changed from number to string
  title: string;
  content: string;
  date: string;
  type: "info" | "warning" | "success";
  status: "published" | "draft";
}


// Simple toast implementation
const useToast = () => {
  const [toasts, setToasts] = useState<
    Array<{ id: number; title: string; description: string; variant?: string }>
  >([]);

  const toast = ({
    title,
    description,
    variant,
  }: {
    title: string;
    description: string;
    variant?: string;
  }) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, description, variant }]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return { toast, toasts, setToasts };
};

const Toast = ({
  toast,
  onRemove,
}: {
  toast: { id: number; title: string; description: string; variant?: string };
  onRemove: () => void;
}) => (
  <div
    className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
      toast.variant === "destructive"
        ? "bg-red-500 text-white"
        : "bg-green-500 text-white"
    }`}
  >
    <div className="flex justify-between items-start">
      <div>
        <div className="font-semibold">{toast.title}</div>
        <div className="text-sm">{toast.description}</div>
      </div>
      <button
        onClick={onRemove}
        className="ml-4 text-white hover:text-gray-200"
      >
        ×
      </button>
    </div>
  </div>
);

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const {  schoolId: ctxSchoolId, loading } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newNotice, setNewNotice] = useState<{
    title: string;
    content: string;
    type: "info" | "warning" | "success";
    status: "published" | "draft";
    targetAudience: "all" | "teachers" | "students" | "parents";
  }>({
    title: "",
    content: "",
    type: "info",
    status: "draft",
    targetAudience: "all", // added targetAudience
  });

  const { toast, toasts, setToasts } = useToast();

  // Filter logic
  const filteredNotices = notices.filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || notice.type === filterType;
    const matchesStatus =
      filterStatus === "all" || notice.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // 1) Fetch notices when schoolId is known
  useEffect(() => {
    if (!loading && ctxSchoolId) {
      fetch(`http://localhost:3001/api/notices/${ctxSchoolId}`, {
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to load notices");
          }
          return res.json();
        })
        .then((data) => {
          setNotices(
            data.notices.map((n: any) => ({
              id: n._id,
              title: n.title,
              content: n.content,
              date: new Date(n.publishDate).toISOString().split("T")[0],
              type: n.type,
              status: n.status,
            }))
          );
        })
        .catch((err) => {
          console.error(err);
          toast({
            title: "Error",
            description: err.message,
            variant: "destructive",
          });
        });
    }
  }, [loading, ctxSchoolId]);

  // 2) Create a new notice
  const handleAddNotice = () => {
    if (!newNotice.title || !newNotice.content) {
      toast({
        title: "Error",
        description: "Please fill in title and content.",
        variant: "destructive",
      });
      return;
    }

    fetch("http://localhost:3001/api/notices", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newNotice.title,
        content: newNotice.content,
        type: newNotice.type,
        status: newNotice.status,
        targetAudience: newNotice.targetAudience,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to create notice");
        }
        return res.json();
      })
      .then((data) => {
        const n = data.notice;
        setNotices((prev) => [
          {
            id: n._id,
            title: n.title,
            content: n.content,
            date: new Date(n.publishDate).toISOString().split("T")[0],
            type: n.type,
            status: n.status,
          },
          ...prev,
        ]);
        setNewNotice({
          title: "",
          content: "",
          type: "info",
          status: "draft",
          targetAudience: "all",
        });
        setIsAddDialogOpen(false);
        toast({
          title: "Success",
          description: `Notice "${n.title}" created.`,
        });
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      });
  };

  // 3) Delete a notice
  const handleDeleteNotice = (id: string) => {
    fetch(`http://localhost:3001/api/notices/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to delete notice");
        }
        return res.json();
      })
      .then((data) => {
        setNotices((prev) => prev.filter((n) => n.id !== id));
        toast({
          title: "Success",
          description: data.message,
        });
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      });
  };

  // 4) Toggle status between published/draft
  const handleToggleStatus = (id: string) => {
    const notice = notices.find((n) => n.id === id);
    if (!notice) return;
    const newStatus = notice.status === "published" ? "draft" : "published";

    fetch(`http://localhost:3001/api/notices/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to toggle status");
        }
        return res.json();
      })
      .then(() => {
        setNotices((prev) =>
          prev.map((n) =>
            n.id === id ? { ...n, status: newStatus } : n
          )
        );
        toast({
          title: "Success",
          description: `Notice "${notice.title}" is now ${newStatus}.`,
        });
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      });
  };

  // 5) Helpers for icons/colors
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "warning":
        return "border-l-yellow-500 bg-yellow-50";
      case "success":
        return "border-l-green-500 bg-green-50";
      default:
        return "border-l-blue-500 bg-blue-50";
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "warning":
        return "destructive";
      case "success":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast notifications */}
      {toasts.map((t) => (
        <Toast
          key={t.id}
          toast={t}
          onRemove={() =>
            setToasts((prev) => prev.filter((toast) => toast.id !== t.id))
          }
        />
      ))}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notice Board</h1>
          <p className="text-muted-foreground">
            Create and manage school notices and announcements
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Notice
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create New Notice</DialogTitle>
              <DialogDescription>
                Create a new notice or announcement for the school community.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newNotice.title}
                  onChange={(e) =>
                    setNewNotice({ ...newNotice, title: e.target.value })
                  }
                  placeholder="Enter notice title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newNotice.content}
                  onChange={(e) =>
                    setNewNotice({ ...newNotice, content: e.target.value })
                  }
                  placeholder="Enter notice content"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newNotice.type}
                    onValueChange={(value: "info" | "warning" | "success") =>
                      setNewNotice({ ...newNotice, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Information</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newNotice.status}
                    onValueChange={(value: "published" | "draft") =>
                      setNewNotice({ ...newNotice, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Save as Draft</SelectItem>
                      <SelectItem value="published">Publish Now</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="audience">Target Audience</Label>
                <Select
                  value={newNotice.targetAudience}
                  onValueChange={(
                    value: "all" | "teachers" | "students" | "parents"
                  ) => setNewNotice({ ...newNotice, targetAudience: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="teachers">Teachers</SelectItem>
                    <SelectItem value="students">Students</SelectItem>
                    <SelectItem value="parents">Parents</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddNotice}>
                {newNotice.status === "published"
                  ? "Publish Notice"
                  : "Save Draft"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            All Notices
          </CardTitle>
          <CardDescription>
            Manage school notices and announcements
          </CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="info">Information</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="success">Success</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNotices.map((notice) => (
              <Card
                key={notice.id}
                className={`border-l-4 ${getTypeColor(notice.type)}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">{getTypeIcon(notice.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">
                            {notice.title}
                          </CardTitle>
                          <Badge variant={getBadgeVariant(notice.type) as any}>
                            {notice.type}
                          </Badge>
                          <Badge
                            variant={
                              notice.status === "published"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {notice.status}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-3 w-3" />
                          {new Date(notice.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(notice.id)}
                        >
                          {notice.status === "published"
                            ? "Move to Draft"
                            : "Publish"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteNotice(notice.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {notice.content}
                  </p>
                </CardContent>
              </Card>
            ))}

            {filteredNotices.length === 0 && (
              <div className="text-center py-12">
                <Bell className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  No notices found
                </h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm || filterType !== "all" || filterStatus !== "all"
                    ? "Try adjusting your search or filters"
                    : "Create your first notice to get started"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{notices.length}</p>
                <p className="text-sm text-muted-foreground">Total Notices</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {notices.filter((n) => n.status === "published").length}
                </p>
                <p className="text-sm text-muted-foreground">Published</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Trash2 className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {notices.filter((n) => n.status === "draft").length}
                </p>
                <p className="text-sm text-muted-foreground">Drafts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">
                  {notices.filter((n) => n.type === "warning").length}
                </p>
                <p className="text-sm text-muted-foreground">Urgent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
