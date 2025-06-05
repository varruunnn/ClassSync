import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Mail, Phone, GraduationCap } from "lucide-react"

interface Student {
  id: number
  name: string
  class: string
  rollNumber: string
  email: string
  parentContact: string
  status: "active" | "inactive"
}

const mockStudents: Student[] = [
  {
    id: 1,
    name: "Alex Thompson",
    class: "5A",
    rollNumber: "001",
    email: "alex.t@student.edu",
    parentContact: "+1-234-567-9001",
    status: "active",
  },
  {
    id: 2,
    name: "Emma Rodriguez",
    class: "5A",
    rollNumber: "002",
    email: "emma.r@student.edu",
    parentContact: "+1-234-567-9002",
    status: "active",
  },
  {
    id: 3,
    name: "James Miller",
    class: "6B",
    rollNumber: "003",
    email: "james.m@student.edu",
    parentContact: "+1-234-567-9003",
    status: "active",
  },
  {
    id: 4,
    name: "Sophia Garcia",
    class: "4C",
    rollNumber: "004",
    email: "sophia.g@student.edu",
    parentContact: "+1-234-567-9004",
    status: "active",
  },
  {
    id: 5,
    name: "William Lee",
    class: "6B",
    rollNumber: "005",
    email: "william.l@student.edu",
    parentContact: "+1-234-567-9005",
    status: "inactive",
  },
]

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newStudent, setNewStudent] = useState({
    name: "",
    class: "",
    rollNumber: "",
    email: "",
    parentContact: "",
  })

  const classes = ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "4C", "5A", "5B", "6A", "6B"]

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesClass = selectedClass === "all" || student.class === selectedClass
    return matchesSearch && matchesClass
  })

  const handleAddStudent = () => {
    const student: Student = {
      id: students.length + 1,
      ...newStudent,
      status: "active",
    }
    setStudents([...students, student])
    setNewStudent({ name: "", class: "", rollNumber: "", email: "", parentContact: "" })
    setIsAddDialogOpen(false)
  }

  const handleDeleteStudent = (id: number) => {
    setStudents(students.filter((student) => student.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">Manage student records and enrollment</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>Enter the student's information below.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="class">Class</Label>
                <Select onValueChange={(value) => setNewStudent({ ...newStudent, class: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        Class {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input
                  id="rollNumber"
                  value={newStudent.rollNumber}
                  onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
                  placeholder="Enter roll number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="parentContact">Parent Contact</Label>
                <Input
                  id="parentContact"
                  value={newStudent.parentContact}
                  onChange={(e) => setNewStudent({ ...newStudent, parentContact: e.target.value })}
                  placeholder="Enter parent contact number"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddStudent}>
                Add Student
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Records</CardTitle>
          <CardDescription>View and manage all enrolled students</CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    Class {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{student.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">Roll: {student.rollNumber}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger  >
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteStudent(student.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Class {student.class}</Badge>
                    <Badge variant={student.status === "active" ? "default" : "secondary"}>{student.status}</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Mail className="mr-2 h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{student.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{student.parentContact}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
