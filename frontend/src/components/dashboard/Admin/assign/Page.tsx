import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/contexts/AuthContext"
import { CheckCircle, Users, GraduationCap, User } from "lucide-react"

interface Teacher {
  id: string            
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

const classes = ["1", "2", "3", "4", "5", "6"]

const useToast = () => {
  const [toasts, setToasts] = useState<
    Array<{ id: number; title: string; description: string; variant?: string }>
  >([])

  const toast = ({
    title,
    description,
    variant,
  }: {
    title: string
    description: string
    variant?: string
  }) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, title, description, variant }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }

  return { toast, toasts, setToasts }
}

const Toast = ({
  toast,
  onRemove,
}: {
  toast: any
  onRemove: () => void
}) => (
  <div
    className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
      toast.variant === "destructive" ? "bg-red-500 text-white" : "bg-green-500 text-white"
    }`}
  >
    <div className="flex justify-between items-start">
      <div>
        <div className="font-semibold">{toast.title}</div>
        <div className="text-sm">{toast.description}</div>
      </div>
      <button onClick={onRemove} className="ml-4 text-white hover:text-gray-200">
        ×
      </button>
    </div>
  </div>
)

export default function AssignTeacherPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const { schoolId: ctxSchoolId } = useAuth()

  const [selectedTeacher, setSelectedTeacher] = useState<string>("")
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [assignments, setAssignments] = useState<Assignment[]>([])

  const { toast, toasts, setToasts } = useToast()

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    if (typeof ctxSchoolId !== "number") return

    try {
      const response = await fetch(
        `http://localhost:3001/api/admin/${ctxSchoolId}/teachers`,
        {
          credentials: "include",
        }
      )
      if (!response.ok) {
        throw new Error("Failed to load teachers")
      }
      const data = await response.json()
      setTeachers(data.teachers || [])
    } catch (error) {
      console.error("Failed to fetch teachers:", error)
    }
  }
  const unassignedTeachers = teachers.filter((t) => !t.classAssigned)
  const assignedTeachers = teachers.filter((t) => t.classAssigned)
  const assignedClasses = assignedTeachers.map((t) => t.classAssigned!)
  const availableClasses = classes.filter((c) => !assignedClasses.includes(c))

  const handleAssignment = async () => {
    if (!selectedTeacher || !selectedClass) {
      toast({
        title: "Error",
        description: "Please select both a teacher and a class.",
        variant: "destructive",
      })
      return
    }

    try {
      const res = await fetch(
        `http://localhost:3001/api/admin/${ctxSchoolId}/teachers/${selectedTeacher}/assign`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ className: selectedClass }),
        }
      )
      if (!res.ok) {
        const errPayload = await res.json()
        throw new Error(errPayload.error || "Failed to assign teacher")
      }
      const payload = await res.json()
      setTeachers((prev) =>
        prev.map((t) =>
          t.id === payload.teacher.id
            ? { ...t, classAssigned: payload.teacher.classAssigned }
            : t
        )
      )
      const newAssign: Assignment = {
        id: Date.now(),
        teacherName: payload.teacher.name,
        className: payload.teacher.classAssigned!,
        subject: payload.teacher.subject,
        assignedDate: new Date().toISOString().split("T")[0],
      }
      setAssignments((prev) => [newAssign, ...prev])

      toast({
        title: "Success",
        description: `${payload.teacher.name} assigned to class ${payload.teacher.classAssigned}`,
      })
      setSelectedTeacher("")
      setSelectedClass("")
    } catch (err: any) {
      console.error("Assignment failed:", err)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const handleUnassign = async (teacherId: string) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/admin/${ctxSchoolId}/teachers/${teacherId}/assign`,
        {
          method: "DELETE",
          credentials: "include",
        }
      )
      if (!res.ok) {
        const errPayload = await res.json()
        throw new Error(errPayload.error || "Failed to unassign teacher")
      }
      const payload = await res.json()

      setTeachers((prev) =>
        prev.map((t) =>
          t.id === payload.teacher.id
            ? { ...t, classAssigned: payload.teacher.classAssigned! }
            : t
        )
      )
      setAssignments((prev) =>
        prev.filter((a) => a.teacherName !== payload.teacher.name)
      )

      toast({
        title: "Success",
        description: `${payload.teacher.name} has been unassigned`,
      })
    } catch (err: any) {
      console.error("Unassign failed:", err)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {toasts.map((t) => (
        <Toast
          key={t.id}
          toast={t}
          onRemove={() =>
            setToasts((prev) => prev.filter((toast) => toast.id !== t.id))
          }
        />
      ))}

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Assign Class Teacher
        </h1>
        <p className="text-muted-foreground">
          Assign teachers to classes and manage current assignments
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ─────────────── Assignment Form ─────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              New Assignment
            </CardTitle>
            <CardDescription>
              Select a teacher and class to create a new assignment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="teacher">Select Teacher</Label>
              <Select
                value={selectedTeacher}
                onValueChange={setSelectedTeacher}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an available teacher..." />
                </SelectTrigger>
                <SelectContent>
                  {unassignedTeachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
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
                <p className="text-sm text-muted-foreground">
                  No unassigned teachers available
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="class">Select Class</Label>
              <Select
                value={selectedClass}
                onValueChange={setSelectedClass}
              >
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
                <p className="text-sm text-muted-foreground">
                  No unassigned classes available
                </p>
              )}
            </div>

            <Button
              onClick={handleAssignment}
              className="w-full"
              disabled={!selectedTeacher || !selectedClass}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Assign Teacher to Class
            </Button>
          </CardContent>
        </Card>

        {/* ─────────────── Current Assignments ─────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Current Assignments
            </CardTitle>
            <CardDescription>
              Teachers currently assigned to classes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignedTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <GraduationCap className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{teacher.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {teacher.subject}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge>Class {teacher.classAssigned}</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnassign(teacher.id)}
                    >
                      Unassign
                    </Button>
                  </div>
                </div>
              ))}

              {assignedTeachers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No teachers currently assigned to classes</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─────────────── Assignment Statistics ─────────────── */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">
                  {assignedTeachers.length}
                </p>
                <p className="text-sm text-muted-foreground">
                  Assigned Teachers
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {availableClasses.length}
                </p>
                <p className="text-sm text-muted-foreground">
                  Available Classes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {unassignedTeachers.length}
                </p>
                <p className="text-sm text-muted-foreground">
                  Unassigned Teachers
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
