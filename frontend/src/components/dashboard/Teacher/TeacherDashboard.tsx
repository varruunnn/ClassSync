import { useEffect, useState } from "react";
import TeacherDashboard from "@/components/layout/teacher/TeacherDashboardLayout";
import { currentStudent } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  BookOpen,
  FileText,
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Star,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";
import { useTeacherClassroom } from "@/components/contexts/TeacherClassroomContext";
import { useNavigate } from "react-router-dom";
import Index from "./TDashboard";
import Dashboard from "./TDashboard";

interface teacherInfo {
  name: string;
  classAssigned: string;
  schoolId: Number;
  email: string;
  role:string;
  id:string;
  subject:string;
}

const TeacherDashboardPage = () => {
  const { selectedClassroom } = useTeacherClassroom();
  const [teacherInfo, setTeacherInfo] = useState<teacherInfo | null>(null);
  const [_loadingTeacherInfo, setLoadingTeacherInfo] = useState(true);
  const navigate = useNavigate();
  const {
    isAuthenticated,
    userRole,
    schoolId: _ctxSchoolId,
    loading,
  } = useAuth();
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate("/login");
      }
    }
  }, [isAuthenticated, userRole, loading, navigate]);

  const fetchTeacherInfo = async () => {
    try {
      setLoadingTeacherInfo(true);
      const response = await fetch(
        "http://localhost:3001/api/auth/me",
        {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok)
        throw new Error(`Failed to fetch student info: ${response.status}`);

      const data = await response.json();
      setTeacherInfo(data);
    } catch (err: any) {
      console.error("Error fetching student info:", err);
    } finally {
      setLoadingTeacherInfo(false);
    }
  };
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        fetchTeacherInfo(),
      ]);
    };
    initializeData();
  }, []);

  return (
    <TeacherDashboard student={currentStudent} title="Teacher Dashboard">
      <Dashboard/>
    </TeacherDashboard>
  );
};

export default TeacherDashboardPage;
