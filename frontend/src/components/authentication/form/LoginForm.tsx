import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeOffIcon, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface LoginResponse {
  token: string;
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const navigate = useNavigate();
  const auth = useAuth(); // ✅ use auth context

  const validate = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    try {
      const response = await axios.post<LoginResponse>('http://localhost:5000/api/users/login', {
        email,
        password,
      });

      const { token } = response.data;
      if (!token) {
        throw new Error("No token received");
      }

      // ✅ Use context to store and update authentication
      auth?.login(token);

      toast.success('Login successful. Welcome back!');

      // ✅ Navigate after auth state is updated
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium pb-1">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>
        {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium pb-1">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className={`pl-10 ${errors.password ? 'border-destructive' : ''}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password && <p className="text-destructive text-xs mt-1">{errors.password}</p>}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="remember" className="h-4 w-4 rounded border-gray-300 text-legal focus:ring-legal" />
          <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">Remember me</Label>
        </div>
        <a href="#" className="text-sm text-legal hover:underline">Forgot password?</a>
      </div>

      <button
        type="submit"
        className={`bg-blue-400 hover:bg-blue-500 text-white cursor-pointer w-full py-2 rounded-md font-semibold ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? (
          <><span className="mr-2">Signing in</span><span className="animate-pulse">...</span></>
        ) : (
          'Sign In'
        )}
      </button>
    </form>
  );
};

export default LoginForm;