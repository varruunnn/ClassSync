import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ArrowLeft, Users, GraduationCap, BookMarked } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import RegisterForm from '../form/RegisterForm';

const Register = () => {
  const navigate = useNavigate();
  const [gradientPosition, setGradientPosition] = useState({ x: 0, y: 0 });

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
    <div className="min-h-screen bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100  text-black overflow-hidden">
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
            <BookOpen className="h-8 w-8 text-indigo-400" />
            <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Classync 
            </h1>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-black-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Home</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row py-6 px-4 md:px-10 container max-w-7xl mx-auto">
        {/* Left Side - Welcome Content */}
        <div className="lg:w-1/2 flex flex-col justify-center items-start mb-8 lg:mb-0 lg:pr-10">
          <div className="max-w-lg">
            <h2 className="text-4xl font-bold mb-4">
              Join{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                Classync 
              </span>{' '}
              today
            </h2>
            <p className="text-black-300 text-lg mb-8 leading-relaxed">
              Create your account and become part of our comprehensive educational platform. Connect, learn, and grow together.
            </p>
            
            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Connect with Everyone</h3>
                  <p className="text-black-400 text-sm">Join students, teachers, and parents in one unified platform</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <BookMarked className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Manage Assignments</h3>
                  <p className="text-black-400 text-sm">Track progress and stay organized with digital assignment management</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Transform Education</h3>
                  <p className="text-black-400 text-sm">Experience modern, digital education management</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="lg:w-1/2 flex justify-center items-center">
          <Card className="w-full max-w-md mx-auto bg-black-900/50 backdrop-blur-md border-black-700 shadow-2xl">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                Create Account
              </CardTitle>
              <CardDescription className="text-black-400">
                Register to access the platform and start your journey
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <RegisterForm />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 border-t border-black-700 pt-6">
              <div className="text-sm text-center text-black-400">
                <p>
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="text-indigo-400 hover:text-indigo-300 hover:underline font-medium"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 px-6 border-t border-black-800">
        <div className="container max-w-7xl mx-auto text-center text-sm text-black-400">
          <p>© {new Date().getFullYear()} EdConnect. All rights reserved.</p>
        </div>
      </footer>

      {/* Decorative elements */}
      <div className="absolute top-1/3 left-10 w-32 h-32 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/3 right-10 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -tranblack-x-1/2 -tranblack-y-1/2 w-60 h-60 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '3s' }}></div>
    </div>
  );
};

export default Register;