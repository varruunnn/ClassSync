import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, User, Users, GraduationCap } from "lucide-react"

interface Teacher {
  id: number
  name: string
  subject: string
  email: string
  classAssigned?: string
}

interface Assignment {
  id: number
  teacherName: string
  className: string
  subject: string
  assignedDate: string
}

const mockTeachers: Teacher[] = [
  { id: 1, name: "Sarah Johnson", subject: "Mathematics", email: "sarah.j@school.edu", classAssigned: "5A" },
  { id: 2, name: "Michael Brown", subject: "English", email: "michael.b@school.edu" },
  { id: 3, name: "Emily Davis", subject: "Science", email: "emily.d@school.edu", classAssigned: "6B" },
  { id: 4, name: "Robert Wilson", subject: "History", email: "robert.w@school.edu" },
  { id: 5, name: "Lisa Anderson", subject: "Art", email: "lisa.a@school.edu", classAssigned: "4C" },
  { id: 6, name: "David Martinez", subject: "Physical Education", email: "david.m@school.edu" },
  { id: 7, name: "Jennifer Taylor", subject: "Music", email: "jennifer.t@school.edu" },
]

const classes = ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "4C", "5A", "5B", "6A", "6B"]

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

export default function AssignTeacherPage() {
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers)
  const [selectedTeacher, setSelectedTeacher] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: 1, teacherName: "Sarah Johnson", className: "5A", subject: "Mathematics", assignedDate: "2025-01-01" },
    { id: 2, teacherName: "Emily Davis", className: "6B", subject: "Science", assignedDate: "2025-01-02" },
    { id: 3, teacherName: "Lisa Anderson", className: "4C", subject: "Art", assignedDate: "2025-01-03" },
  ])

  const { toast, toasts, setToasts } = useToast()

  const unassignedTeachers = teachers.filter((teacher) => !teacher.classAssigned)
  const assignedClasses = teachers.filter((teacher) => teacher.classAssigned).map((teacher) => teacher.classAssigned)
  const availableClasses = classes.filter((cls) => !assignedClasses.includes(cls))

  const handleAssignment = () => {
    if (!selectedTeacher || !selectedClass) {
      toast({
        title: "Error",
        description: "Please select both a teacher and a class.",
        variant: "destructive",
      })
      return
    }

    const teacher = teachers.find((t) => t.name === selectedTeacher)
    if (!teacher) return

    // Update teacher assignment
    setTeachers(teachers.map((t) => (t.id === teacher.id ? { ...t, classAssigned: selectedClass } : t)))

    // Add to assignments history
    const newAssignment: Assignment = {
      id: assignments.length + 1,
      teacherName: selectedTeacher,
      className: selectedClass,
      subject: teacher.subject,
      assignedDate: new Date().toISOString().split("T")[0],
    }
    setAssignments([newAssignment, ...assignments])

    // Reset form
    setSelectedTeacher("")
    setSelectedClass("")

    toast({
      title: "Success",
      description: `${selectedTeacher} has been assigned to Class ${selectedClass}`,
    })
  }

  const handleUnassign = (teacherId: number) => {
    const teacher = teachers.find((t) => t.id === teacherId)
    if (!teacher) return

    setTeachers(teachers.map((t) => (t.id === teacherId ? { ...t, classAssigned: undefined } : t)))

    setAssignments(assignments.filter((a) => a.teacherName !== teacher.name))

    toast({
      title: "Success",
      description: `${teacher.name} has been unassigned from their class`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Toast notifications */}
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onRemove={() => setToasts(prev => prev.filter(toast => toast.id !== t.id))} />
      ))}

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assign Class Teacher</h1>
        <p className="text-muted-foreground">Assign teachers to classes and manage current assignments</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Assignment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              New Assignment
            </CardTitle>
            <CardDescription>Select a teacher and class to create a new assignment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="teacher">Select Teacher</Label>
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an available teacher..." />
                </SelectTrigger>
                <SelectContent>
                  {unassignedTeachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.name}>
                      <div className="flex items-center justify-between w-full">
                        <span>{teacher.name}</span>
                        <Badge variant="secondary" className="ml-2">
                          {teacher.subject}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {unassignedTeachers.length === 0 && (
                <p className="text-sm text-muted-foreground">No unassigned teachers available</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="class">Select Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an available class..." />
                </SelectTrigger>
                <SelectContent>
                  {availableClasses.map((className) => (
                    <SelectItem key={className} value={className}>
                      Class {className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableClasses.length === 0 && (
                <p className="text-sm text-muted-foreground">No unassigned classes available</p>
              )}
            </div>

            <Button onClick={handleAssignment} className="w-full" disabled={!selectedTeacher || !selectedClass}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Assign Teacher to Class
            </Button>
          </CardContent>
        </Card>

        {/* Current Assignments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Current Assignments
            </CardTitle>
            <CardDescription>Teachers currently assigned to classes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teachers
                .filter((teacher) => teacher.classAssigned)
                .map((teacher) => (
                  <div key={teacher.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <GraduationCap className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{teacher.name}</p>
                        <p className="text-sm text-muted-foreground">{teacher.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge>Class {teacher.classAssigned}</Badge>
                      <Button variant="outline" size="sm" onClick={() => handleUnassign(teacher.id)}>
                        Unassign
                      </Button>
                    </div>
                  </div>
                ))}

              {teachers.filter((teacher) => teacher.classAssigned).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No teachers currently assigned to classes</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignment Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{teachers.filter((t) => t.classAssigned).length}</p>
                <p className="text-sm text-muted-foreground">Assigned Teachers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{availableClasses.length}</p>
                <p className="text-sm text-muted-foreground">Available Classes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{unassignedTeachers.length}</p>
                <p className="text-sm text-muted-foreground">Unassigned Teachers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}