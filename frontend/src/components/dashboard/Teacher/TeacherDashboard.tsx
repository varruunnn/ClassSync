import { useEffect, useState } from "react";
import TeacherDashboard from "@/components/layout/teacher/TeacherDashboardLayout";
import { currentStudent } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
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
  const [_teacherInfo, setTeacherInfo] = useState<teacherInfo | null>(null);
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
        `${import.meta.env.VITE_API_BASE_URL}/auth/me`,
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
