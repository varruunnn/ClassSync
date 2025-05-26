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
import AdminDashboardPage from "./components/dashboard/Admin/AdminDashboard";
 
import TeacherClasses from "./components/dashboard/Teacher/components/TeacherClasses";
import TeacherSubjects from "./components/dashboard/Teacher/components/TeacherSubjects";
import TeacherAssignments from "./components/dashboard/Teacher/components/TeacherAssignments";
import TeacherGradebook from "./components/dashboard/Teacher/components/TeacherGradebook";
import TeacherAnalytics from "./components/dashboard/Teacher/components/TeacherAnalytics";
import TeacherMessages from "./components/dashboard/Teacher/components/TeacherMessages";
import TeacherCalendar from "./components/dashboard/Teacher/components/TeacherCalendar";
import TeacherSettings from "./components/dashboard/Teacher/components/TeacherSettings";
 
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SidebarProvider>    
      <BrowserRouter>
        <Routes>

          {/* Student Dashboard */}
          <Route element={<AppLayoutWrapper/>}> 
          <Route path="/" element={<Index />} />
           <Route path="/subjects" element={<Subjects/>} />
           <Route path="/assessment" element={<Assessments/>} />
           <Route path="/calendar" element={<Calendar/>} />
           <Route path="/parent" element={<ParentPortal/>} />
          </Route>

          {/* Teacher Dashboard */}
          <Route path="/teacher" element={<TeacherDashboardPage />} />
          <Route path="/teacher/classes" element={<TeacherClasses />} />
          <Route path="/teacher/subjects" element={<TeacherSubjects />} />
          <Route path="/teacher/assignments" element={<TeacherAssignments />} />
          <Route path="/teacher/gradebook" element={<TeacherGradebook />} />
          <Route path="/teacher/analytics" element={<TeacherAnalytics />} />
          <Route path="/teacher/messages" element={<TeacherMessages />} />
          <Route path="/teacher/calendar" element={<TeacherCalendar />} />
          <Route path="/teacher/settings" element={<TeacherSettings />} />

          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminDashboardPage />} />

          <Route path="/index" element={<LandingPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          <Route path="/test" element={<Test/>} />
         
          

          {/* Authentication Page */}
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
        </Routes>
      </BrowserRouter>
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


// This wraps child routes with AppLayout and lets <Outlet /> render them inside it
const AppLayoutWrapper = () => (
  <AppLayout>
    <Outlet />
  </AppLayout>
);