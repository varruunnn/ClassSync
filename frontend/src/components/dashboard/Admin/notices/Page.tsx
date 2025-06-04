import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  Calendar,
} from "lucide-react"

interface Notice {
  id: number
  title: string
  content: string
  date: string
  type: "info" | "warning" | "success"
  status: "published" | "draft"
}

const mockNotices: Notice[] = [
  {
    id: 1,
    title: "Exam Schedule Released",
    content:
      "Final exams will start on June 10, 2025. Students must report 30 minutes early. Please check the detailed schedule on the school portal.",
    date: "2025-06-01",
    type: "warning",
    status: "published",
  },
  {
    id: 2,
    title: "Independence Day Holiday",
    content:
      "School will remain closed on June 15 for Independence Day celebration. Regular classes will resume on June 16.",
    date: "2025-06-02",
    type: "info",
    status: "published",
  },
  {
    id: 3,
    title: "Annual Sports Day",
    content:
      "Annual sports day has been scheduled for June 20, 2025. All students must participate. Parents are invited to attend.",
    date: "2025-06-03",
    type: "success",
    status: "published",
  },
  {
    id: 4,
    title: "Parent-Teacher Meeting",
    content: "Monthly parent-teacher meeting scheduled for June 25, 2025 at 2:00 PM in the school auditorium.",
    date: "2025-06-04",
    type: "info",
    status: "draft",
  },
  {
    id: 5,
    title: "New Library Books",
    content:
      "New collection of science and literature books have been added to the library. Students can check them out starting next week.",
    date: "2025-06-05",
    type: "success",
    status: "published",
  },
]

// Simple toast implementation for React
const useToast = () => {
  const [toasts, setToasts] = useState<Array<{ id: number; title: string; description: string; variant?: string }>>([])

  const toast = ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, title, description, variant }])
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }

  return { toast, toasts, setToasts }
}

// Simple Toast component
const Toast = ({ toast, onRemove }: { toast: any; onRemove: () => void }) => (
  <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
    toast.variant === 'destructive' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
  }`}>
    <div className="flex justify-between items-start">
      <div>
        <div className="font-semibold">{toast.title}</div>
        <div className="text-sm">{toast.description}</div>
      </div>
      <button onClick={onRemove} className="ml-4 text-white hover:text-gray-200">×</button>
    </div>
  </div>
)

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>(mockNotices)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newNotice, setNewNotice] = useState({
    title: "",
    content: "",
    type: "info" as "info" | "warning" | "success",
    status: "draft" as "published" | "draft",
  })

  const { toast, toasts, setToasts } = useToast()

  const filteredNotices = notices.filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || notice.type === filterType
    const matchesStatus = filterStatus === "all" || notice.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const handleAddNotice = () => {
    if (!newNotice.title || !newNotice.content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const notice: Notice = {
      id: Date.now(), // Better ID generation
      ...newNotice,
      date: new Date().toISOString().split("T")[0],
    }
    setNotices([notice, ...notices])
    setNewNotice({ title: "", content: "", type: "info", status: "draft" })
    setIsAddDialogOpen(false)

    toast({
      title: "Success",
      description: `Notice "${notice.title}" has been ${notice.status === "published" ? "published" : "saved as draft"}.`,
    })
  }

  const handleEditNotice = () => {
    if (!editingNotice || !editingNotice.title || !editingNotice.content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setNotices(notices.map(notice => 
      notice.id === editingNotice.id ? editingNotice : notice
    ))
    setIsEditDialogOpen(false)
    setEditingNotice(null)

    toast({
      title: "Success",
      description: `Notice "${editingNotice.title}" has been updated.`,
    })
  }

  const handleDeleteNotice = (id: number) => {
    const notice = notices.find((n) => n.id === id)
    setNotices(notices.filter((notice) => notice.id !== id))

    toast({
      title: "Success",
      description: `Notice "${notice?.title}" has been deleted.`,
    })
  }

  const handleToggleStatus = (id: number) => {
    const notice = notices.find((n) => n.id === id)
    const newStatus = notice?.status === "published" ? "draft" : "published"
    
    setNotices(
      notices.map((notice) =>
        notice.id === id ? { ...notice, status: newStatus } : notice
      )
    )

    toast({
      title: "Success",
      description: `Notice "${notice?.title}" has been ${newStatus === "published" ? "published" : "moved to draft"}.`,
    })
  }

  const openEditDialog = (notice: Notice) => {
    setEditingNotice({ ...notice })
    setIsEditDialogOpen(true)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "success":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "warning":
        return "border-l-yellow-500 bg-yellow-50"
      case "success":
        return "border-l-green-500 bg-green-50"
      default:
        return "border-l-blue-500 bg-blue-50"
    }
  }

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "warning":
        return "destructive"
      case "success":
        return "default"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast notifications */}
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onRemove={() => setToasts(prev => prev.filter(toast => toast.id !== t.id))} />
      ))}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notice Board</h1>
          <p className="text-muted-foreground">Create and manage school notices and announcements</p>
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
              <DialogDescription>Create a new notice or announcement for the school community.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  placeholder="Enter notice title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
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
                    onValueChange={(value: "published" | "draft") => setNewNotice({ ...newNotice, status: value })}
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
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddNotice}>
                {newNotice.status === "published" ? "Publish Notice" : "Save Draft"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Notice</DialogTitle>
            <DialogDescription>Update the notice information.</DialogDescription>
          </DialogHeader>
          {editingNotice && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingNotice.title}
                  onChange={(e) => setEditingNotice({ ...editingNotice, title: e.target.value })}
                  placeholder="Enter notice title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  value={editingNotice.content}
                  onChange={(e) => setEditingNotice({ ...editingNotice, content: e.target.value })}
                  placeholder="Enter notice content"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-type">Type</Label>
                  <Select
                    value={editingNotice.type}
                    onValueChange={(value: "info" | "warning" | "success") =>
                      setEditingNotice({ ...editingNotice, type: value })
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
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editingNotice.status}
                    onValueChange={(value: "published" | "draft") => 
                      setEditingNotice({ ...editingNotice, status: value })
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
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={handleEditNotice}>
              Update Notice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            All Notices
          </CardTitle>
          <CardDescription>Manage school notices and announcements</CardDescription>
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
              <Card key={notice.id} className={`border-l-4 ${getTypeColor(notice.type)}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">{getTypeIcon(notice.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">{notice.title}</CardTitle>
                          <Badge variant={getBadgeVariant(notice.type) as any}>{notice.type}</Badge>
                          <Badge variant={notice.status === "published" ? "default" : "secondary"}>
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
                        <Button variant="ghost" onClick={()=>{console.log("clicked")}} size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          console.log("toggle status clicked for", notice.id);
                          handleToggleStatus(notice.id);
                        }}>
                          {notice.status === "published" ? "Move to Draft" : "Publish"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(notice)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
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
                  <p className="text-sm text-muted-foreground leading-relaxed">{notice.content}</p>
                </CardContent>
              </Card>
            ))}

            {filteredNotices.length === 0 && (
              <div className="text-center py-12">
                <Bell className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No notices found</h3>
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
                <p className="text-2xl font-bold">{notices.filter((n) => n.status === "published").length}</p>
                <p className="text-sm text-muted-foreground">Published</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Edit className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{notices.filter((n) => n.status === "draft").length}</p>
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
                <p className="text-2xl font-bold">{notices.filter((n) => n.type === "warning").length}</p>
                <p className="text-sm text-muted-foreground">Urgent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}