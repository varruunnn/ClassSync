import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ArrowLeft } from "lucide-react";
import LoginForm from "../form/LoginForm";

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [gradientPosition, setGradientPosition] = useState({ x: 0, y: 0 });

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const getrole = localStorage.getItem('role');

      if (getrole === "student") {
        navigate("/student");
      }else if (getrole === "teacher"){
         navigate("/teacher");
      }else {
        navigate("/admin");
      }
      
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setGradientPosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white overflow-hidden">
      {/* Animated background */}
      <div
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at ${gradientPosition.x * 100}% ${gradientPosition.y * 100}%, rgba(99, 102, 241, 0.8), transparent 40%)`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <header className="relative z-10 w-full px-6 md:px-10 py-4">
        <div className="container max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-indigo-400" />
              <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                EdConnect
              </h1>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Home</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col md:flex-row py-6 px-4 md:px-10 container max-w-7xl mx-auto">
        {/* Left Side - Welcome Content */}
        <div className="md:w-1/2 flex flex-col justify-center items-start mb-8 md:mb-0 md:pr-10">
          <div className="max-w-lg">
            <h2 className="text-4xl font-bold mb-4">
              Welcome back to{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                EdConnect
              </span>
            </h2>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              Continue your educational journey. Connect with students, parents, and teachers on our comprehensive platform.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                <span className="text-slate-300">Manage assignments and track progress</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-slate-300">View personalized timetables</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                <span className="text-slate-300">Facilitate transparent communication</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="md:w-1/2 flex justify-center items-center">
          <Card className="w-full max-w-md mx-auto bg-slate-900/50 backdrop-blur-md border-slate-700 shadow-2xl">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                Sign In
              </CardTitle>
              <CardDescription className="text-slate-400">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <LoginForm />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 border-t border-slate-700 pt-6">
              <div className="text-sm text-center text-slate-400">
                <p>
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    className="text-indigo-400 hover:text-indigo-300 hover:underline font-medium"
                  >
                    Register here
                  </Link>
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 px-6 border-t border-slate-800">
        <div className="container max-w-7xl mx-auto text-center text-sm text-slate-400">
          <p>© {new Date().getFullYear()} EdConnect. All rights reserved.</p>
        </div>
      </footer>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
    </div>
  );
};

export default Login;