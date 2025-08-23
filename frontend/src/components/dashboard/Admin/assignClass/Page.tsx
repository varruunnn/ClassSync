import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

interface Teacher {
  id: string;
  name: string;
  subject: string;
  email: string;
  classAssigned: string | null; 
  classes: string[]; 
}

const allClasses = ["1", "2", "3", "4", "5", "6", "7", "8","9","10"];
const sections = ["A","B","C","D"]

export default function AssignClass() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const { schoolId } = useAuth();

  useEffect(() => {
    fetchTeachers();
  }, []);

  async function fetchTeachers() {
    if (typeof schoolId !== "number") return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/admin/${schoolId}/teachers`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Failed to fetch teachers");
      const { teachers: data } = await res.json();
      const mapped: Teacher[] = (data || []).map((t: any) => ({
        id: t.id,
        name: t.name,
        subject: t.subject,
        email: t.email,
        classAssigned: t.classAssigned ?? null,
        classes: Array.isArray(t.classes) ? t.classes : [],
      }));
      setTeachers(mapped);
    } catch (err) {
      console.error(err);
    }
  }

  function toggleClass(c: string) {
    setSelectedClasses((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  async function handleAssign() {
    if (!selectedTeacherId || selectedClasses.length === 0) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/admin/${schoolId}/teachers/${selectedTeacherId}/teaching-classes`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ classes: selectedClasses }),
        }
      );
      if (!res.ok) throw new Error("Assign failed");
      await fetchTeachers();
      setSelectedTeacherId("");
      setSelectedClasses([]);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Assign Teaching Classes</h2>
        <p className="text-muted-foreground">
          Select a teacher and assign one or more classes they teach.
        </p>
      </div>

      {/* Assignment Form */}
      <Card>
        <CardHeader>
          <CardTitle>New Assignment</CardTitle>
          <CardDescription>Pick teacher & classes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Teacher selector */}
          <div className="space-y-2">
            <Label>Select Teacher</Label>
            <Select
              value={selectedTeacherId}
              onValueChange={setSelectedTeacherId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name} ({t.subject})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Multi‑class buttons */}
          <div className="space-y-2">
            <Label>Select Classes to Teach</Label>
            <div className="flex flex-wrap gap-2">
              {allClasses.map((cls) => (
                <div key={cls} className="flex items-center gap-2">
                  <span className="w-12">Class {cls}</span>
                  {sections.map((sec) => {
                    const combo = `${cls}-${sec}`;
                    return (
                      <Button
                        key={combo}
                        size="sm"
                        variant={
                          selectedClasses.includes(combo)
                            ? "default"
                            : "outline"
                        }
                        onClick={() => toggleClass(combo)}
                      >
                        {sec}
                      </Button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <Button
            className="w-full"
            onClick={handleAssign}
            disabled={!selectedTeacherId || selectedClasses.length === 0}
          >
            Assign Classes
          </Button>
        </CardContent>
      </Card>

      {/* Current Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Current Assignments</CardTitle>
          <CardDescription>Homeroom vs. Teaching Classes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {teachers.map((t) => (
            <div key={t.id} className="border rounded p-4 space-y-2">
              <p className="font-semibold">{t.name}</p>
              <p className="text-sm">
                Head of:{" "}
                {t.classAssigned ? (
                  <Badge>{t.classAssigned}</Badge>
                ) : (
                  <em>None</em>
                )}
              </p>
              <div className="flex gap-2 flex-wrap">
                {t.classes.length > 0 ? (
                  t.classes.map((c) => (
                    <Badge key={c} variant="secondary">
                      Class {c}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No teaching classes assigned
                  </span>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
