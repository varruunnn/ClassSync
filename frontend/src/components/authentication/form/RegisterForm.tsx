import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeOffIcon, Mail, User, Lock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface RegisterResponse {
  message: string;
}


const RegisterForm: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: ''
  });

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      userType: ''
    };
    let isValid = true;

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

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
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    if (!userType) {
      newErrors.userType = 'Please select a user type';
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
      const res = await axios.post<RegisterResponse>("http://localhost:5000/api/users/register", {
        name: fullName,
        email,
        password,
        role: userType,
      });
  
      toast.success(res.data.message || "Registration successful!");
  
      // Optional: Auto-login or redirect
      navigate("/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
<form onSubmit={handleSubmit} className="space-y-4">
  {/* Full Name */}
  <div>
    <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
    <div className="relative mt-1">
      <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
      <Input
        id="fullName"
        type="text"
        placeholder="Name"
        className={`pl-10 ${errors.fullName ? 'border-destructive' : ''}`}
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        disabled={isLoading}
      />
    </div>
    {errors.fullName && <p className="text-destructive text-xs mt-1">{errors.fullName}</p>}
  </div>

  {/* Email */}
  <div>
    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
    <div className="relative mt-1">
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

  {/* User Type */}
  <div>
    <Label htmlFor="userType" className="text-sm font-medium">I am a</Label>
    <Select value={userType} onValueChange={setUserType} disabled={isLoading}>
      <SelectTrigger id="userType" className={`mt-1 ${errors.userType ? 'border-destructive' : ''}`}>
        <SelectValue placeholder="Select user type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="user">Client</SelectItem>
        <SelectItem value="lawyer">Lawyer</SelectItem>
      </SelectContent>
    </Select>
    {errors.userType && <p className="text-destructive text-xs mt-1">{errors.userType}</p>}
  </div>

  {/* Password */}
  <div>
    <Label htmlFor="register-password" className="text-sm font-medium">Password</Label>
    <div className="relative mt-1">
      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
      <Input
        id="register-password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Create a password"
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
        {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
      </button>
    </div>
    {errors.password && <p className="text-destructive text-xs mt-1">{errors.password}</p>}
  </div>

  {/* Confirm Password */}
  <div>
    <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</Label>
    <div className="relative mt-1">
      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
      <Input
        id="confirm-password"
        type={showConfirmPassword ? 'text' : 'password'}
        placeholder="Confirm your password"
        className={`pl-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        disabled={isLoading}
      />
      <button
        type="button"
        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
      >
        {showConfirmPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
      </button>
    </div>
    {errors.confirmPassword && <p className="text-destructive text-xs mt-1">{errors.confirmPassword}</p>}
  </div>

  {/* Terms */}
  <div className="flex items-center space-x-2">
    <input type="checkbox" id="terms" className="h-4 w-4 rounded border-gray-300 text-legal focus:ring-legal" />
    <Label htmlFor="terms" className="text-xs text-muted-foreground cursor-pointer">
      I agree to the <a href="#" className="text-legal hover:underline">Terms of Service</a> and <a href="#" className="text-legal hover:underline">Privacy Policy</a>
    </Label>
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    className={`bg-blue-400 hover:bg-blue-500 text-white cursor-pointer w-full py-2 rounded-md font-semibold ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
    disabled={isLoading}
  >
    {isLoading ? (
      <><span className="mr-2">Creating account</span><span className="animate-pulse">...</span></>
    ) : (
      'Create Account'
    )}
  </button>
</form>

  );
};

export default RegisterForm;