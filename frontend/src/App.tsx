import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Index from "./components/Pages/Index";
import NotFound from "./components/Pages/NotFound";
import LandingPage from "./components/Pages/LandingPage";
import Test from "./test/Test";
import { SidebarProvider } from "./components/contexts/SidebarContext";
import AppLayout from "./components/layout/Applayout";
import Login from "./components/authentication/AuthPage/Login";
import Register from "./components/authentication/AuthPage/Register";
import Subjects from "./components/Pages/Subjects";
import Assessments from "./components/Pages/Assessments";
import Calendar from "./components/Pages/Calender";
import ParentPortal from "./components/Pages/ParentPortal";
import TeacherDashboardPage from "./components/dashboard/Teacher/TeacherDashboard";

import TeacherClasses from "./components/dashboard/Teacher/components/TeacherClasses";
import TeacherSubjects from "./components/dashboard/Teacher/components/TeacherSubjects";
import TeacherAssignments from "./components/dashboard/Teacher/components/TeacherAssignments";
import TeacherGradebook from "./components/dashboard/Teacher/components/TeacherGradebook";
import TeacherAnalytics from "./components/dashboard/Teacher/components/TeacherAnalytics";
import TeacherMessages from "./components/dashboard/Teacher/components/TeacherMessages";
import TeacherCalendar from "./components/dashboard/Teacher/components/TeacherCalendar";
import TeacherSettings from "./components/dashboard/Teacher/components/TeacherSettings";
import { TeacherClassroomProvider } from "./components/contexts/TeacherClassroomContext";

import AdminLayout from "./components/dashboard/Admin/Layout";
import AdminDashboard from "./components/dashboard/Admin/Page";
import TeachersPage from "./components/dashboard/Admin/teachers/Page";
import StudentsPage from "./components/dashboard/Admin/students/Page";
import AssignTeacherPage from "./components/dashboard/Admin/assign/Page";
import NoticesPage from "./components/dashboard/Admin/notices/Page";
import ChatPdf from "./components/Pages/ChatPdf";
import StudentsTestPage from "./components/Pages/StudentsDiscussionPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SidebarProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayoutWrapper />}>
              <Route path="/student" element={<Index />} />
              <Route path="/student/subjects" element={<Subjects />} />
              <Route path="/student/assessment" element={<Assessments />} />
              <Route path="/student/calendar" element={<Calendar />} />
              <Route path="/student/parent" element={<ParentPortal />} />
              <Route path="/student/chat-with-pdf" element={<ChatPdf />} />
              <Route path="/student/tests" element={<StudentsTestPage />} />
            </Route>
            <Route
              path="/teacher"
              element={
                <TeacherClassroomProvider>
                  <Outlet />
                </TeacherClassroomProvider>
              }
            >
              <Route index element={<TeacherDashboardPage />} />
              <Route path="classes" element={<TeacherClasses />} />
              <Route path="subjects" element={<TeacherSubjects />} />
              <Route path="assignments" element={<TeacherAssignments />} />
              <Route path="gradebook" element={<TeacherGradebook />} />
              <Route path="analytics" element={<TeacherAnalytics />} />
              <Route path="messages" element={<TeacherMessages />} />
              <Route path="calendar" element={<TeacherCalendar />} />
              <Route path="settings" element={<TeacherSettings />} />
            </Route>
            <Route path="/" element={<LandingPage />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/test" element={<Test />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/admin"
              element={
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/teachers"
              element={
                <AdminLayout>
                  <TeachersPage />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/students"
              element={
                <AdminLayout>
                  <StudentsPage />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/assign"
              element={
                <AdminLayout>
                  <AssignTeacherPage />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/notices"
              element={
                <AdminLayout>
                  <NoticesPage />
                </AdminLayout>
              }
            />
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);
export default App;

const AppLayoutWrapper = () => (
  <AppLayout>
    <Outlet />
  </AppLayout>
);
