// /src/components/authentication/form/LoginForm.tsx
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";


interface LoginResponse {
  role: string;
  schoolId: number;
  message: string;
}

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const auth = useAuth();

  const validate = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }
    if (!password) {
      newErrors.password = "Password is required";
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
      const response = await axios.post<LoginResponse>(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      const { role, schoolId } = response.data;
      localStorage.setItem("schoolId", schoolId.toString());
      localStorage.setItem("role", role);

      auth?.login(role, schoolId);

      toast.success("Login successful. Welcome back!");

      if (role === "student") {
        navigate("/student");
      } else if (role === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/admin");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-black-200">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-black-400" />
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            className={`pl-10 bg-black-800/50 border-[1px] border-black text-black placeholder:text-black-400 focus:border-indigo-500 focus:ring-indigo-500/20 ${
              errors.email ? "border-red-500 focus:border-red-500" : ""
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>
        {errors.email && (
          <p className="text-red-400 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-black-200">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-black-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className={`pl-10 pr-10 bg-black-800/50 border-[1px] border-black text-black placeholder:text-black-400 focus:border-indigo-500 focus:ring-indigo-500/20 ${
              errors.password ? "border-red-500 focus:border-red-500" : ""
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-black-400 hover:text-black-200 transition-colors"
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-400 text-xs mt-1">{errors.password}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="remember"
            className="h-4 w-4 rounded border-black-600 bg-black-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-black-900"
          />
          <Label
            htmlFor="remember"
            className="text-sm text-black-300 cursor-pointer"
          >
            Remember me
          </Label>
        </div>
        <a
          href="#"
          className="text-sm text-indigo-400 hover:text-indigo-300 hover:underline"
        >
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        className={`w-full py-3 px-4 rounded-lg font-semibold text-black bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/20 transition-all duration-200 ${
          isLoading
            ? "opacity-70 cursor-not-allowed"
            : "hover:shadow-indigo-600/30 hover:scale-[1.02]"
        }`}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <span className="mr-2">Signing in</span>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          </div>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
};

export default LoginForm;
