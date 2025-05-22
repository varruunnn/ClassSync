import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import RegisterForm from '../form/RegisterForm';

const Register = () => {
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
            <a href="#" className="text-sm text-legal-light hover:text-legal hidden md:inline hover:underline">Need Help?</a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row py-6 px-4 md:px-10 container max-w-7xl mx-auto">
        {/* Left Side with Image */}
        <div className="md:w-1/2 flex justify-center items-center mb-8 md:mb-0 md:pr-10">
          <img
            src="https://img.freepik.com/free-vector/thesis-concept-illustration_114360-7560.jpg?semt=ais_hybrid&w=740"
            alt="Law and justice illustration"
            className="w-full h-auto rounded-xl object-cover"
          />
        </div>

        {/* Right Side with Form */}
        <div className="md:w-1/2 flex justify-center items-center">
          <Card className="w-full max-w-md mx-auto border border-gray-200 shadow-md bg-white">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-blue-800">Create Account</CardTitle>
              <CardDescription>
                Register to access the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RegisterForm />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-muted-foreground">
                <p>
                  Already have an account?{' '}
                  <Link to="/login" className="text-legal hover:underline">Login</Link>
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

export default Register;