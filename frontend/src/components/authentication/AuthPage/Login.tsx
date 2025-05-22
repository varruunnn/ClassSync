import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale } from "lucide-react";
import LoginForm from "../form/LoginForm";

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);


  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full px-6 md:px-10">
        <div className="container max-w-7xl mx-auto flex items-center justify-between pt-4">
          <div className="flex items-center space-x-2">
            <Scale className="h-8 w-8 text-legal" />
            <h1 className="text-xl md:text-2xl font-bold text-legal">Legal Connect</h1>
          </div>
          <div>
            <a href="#" className="text-sm text-legal-light hover:text-legal hidden md:inline hover:underline">
              Need Help?
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row py-6 px-4 md:px-10 container max-w-7xl mx-auto">
        {/* Left Side Image */}
        <div className="md:w-1/2 flex justify-center items-center mb-8 md:mb-0 md:pr-10">
          <img
            src="https://img.freepik.com/free-vector/illustration-people-with-justice-order-icons_53876-77429.jpg"
            alt="Law and justice illustration"
            className="w-full h-auto rounded-xl object-cover"
          />
        </div>

        {/* Right Side Form */}
        <div className="md:w-1/2 flex justify-center items-center">
          <Card className="w-full max-w-md mx-auto auth-card-gradient animate-fade-in py-4">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold text-blue-800">Sign In</CardTitle>
              <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <LoginForm />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-muted-foreground">
                <p>
                  Don't have an account?{" "}
                  <Link to="/register" className="text-legal hover:underline">
                    Register
                  </Link>
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 border-t border-gray-200 bg-white/50">
        <div className="container max-w-7xl mx-auto text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Legal Connect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;