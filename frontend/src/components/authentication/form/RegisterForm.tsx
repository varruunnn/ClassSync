import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  Mail,
  User,
  Lock,
  Phone,
  BookOpen,
  School,
  Users,
  Hash,
  UserCheck,
  GraduationCap,
  Shield,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface RegisterResponse {
  message: string;
}

const RegisterForm: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [schoolId, setSchoolId] = useState("");
  const [studentClass, setStudentClass] = useState<number>();
  const [section, setSection] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [parentContact, setParentContact] = useState("");
  const [subject, setSubject] = useState("");
  const [phone, setPhone] = useState("");
  const [classAssigned, setClassAssigned] = useState<number>();
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  type PasswordRequirements = {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };

  type PasswordStrength = {
    requirements: PasswordRequirements;
    score: number;
    isStrong: boolean;
  };
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    },
    score: 0,
    isStrong: false,
  });

  const validatePasswordStrength = (password: string): PasswordStrength => {
    const requirements: PasswordRequirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(requirements).filter(Boolean).length;
    const isStrong = score >= 4 && requirements.length;

    return { requirements, score, isStrong };
  };

  const navigate = useNavigate();

  const validate = () => {
    const errs: Record<string, string> = {};
    let valid = true;

    if (!fullName.trim()) {
      errs.fullName = "Full name is required";
      valid = false;
    }
    if (!email) {
      errs.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = "Email is invalid";
      valid = false;
    }
    if (!password) {
      errs.password = "Password is required";
      valid = false;
    }
    if (password !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
      valid = false;
    }
    if (!agreeToTerms) {
      errs.terms = "You must agree to the terms";
      valid = false;
    }
    if (!schoolId.trim()) {
      errs.schoolId = "School ID is required";
      valid = false;
    }

    if (role === "student") {
      if (!studentClass) {
        errs.studentClass = "Class is required";
        valid = false;
      }
      if (!section.trim()) {
        errs.section = "Section is required";
        valid = false;
      }
      if (!rollNumber.trim()) {
        errs.rollNumber = "Roll number is required";
        valid = false;
      }
      if (!parentContact.trim()) {
        errs.parentContact = "Parent contact is required";
        valid = false;
      }
    }

    if (role === "teacher") {
      if (!subject.trim()) {
        errs.subject = "Subject is required";
        valid = false;
      }
      if (!phone.trim()) {
        errs.phone = "Phone is required";
        valid = false;
      }
      if (!classAssigned) {
        errs.classAssigned = "Assigned class is required";
        valid = false;
      }
    }

    setErrors(errs);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    const payload: any = {
      name: fullName,
      email,
      password,
      role,
      schoolId,
    };

    if (role === "student") {
      payload.studentClass = studentClass;
      payload.studentSection = section;
      payload.rollNumber = rollNumber;
      payload.parentContact = parentContact;
    } else {
      payload.subject = subject;
      payload.phone = phone;
      payload.classAssigned = classAssigned;
    }

    try {
      const res = await axios.post<RegisterResponse>(
        "http://localhost:3001/api/auth/register",
        payload,
        { withCredentials: true }
      );
      toast.success(res.data.message);
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <User className="h-5 w-5" /> Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading}
                className={`pl-10 ${errors.fullName ? "border-red-500" : ""}`}
                placeholder="Enter your full name"
              />
            </div>
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="schoolId">School ID</Label>
          <div className="relative mt-1">
            <School className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="schoolId"
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              disabled={isLoading}
              className={`pl-10 ${errors.schoolId ? "border-red-500" : ""}`}
              placeholder="Enter your school ID"
            />
          </div>
          {errors.schoolId && (
            <p className="text-red-500 text-xs mt-1">{errors.schoolId}</p>
          )}
        </div>
      </div>

      {/* Role Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <UserCheck className="h-5 w-5" /> Role Selection
        </h3>
        <div>
          <Label htmlFor="role">I am a</Label>
          <Select
            value={role}
            onValueChange={(val) => setRole(val as "student" | "teacher")}
            disabled={isLoading}
          >
            <SelectTrigger
              id="role"
              className={`mt-1 ${errors.role ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" /> Student
                </div>
              </SelectItem>
              <SelectItem value="teacher">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" /> Teacher
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Student Info */}
      {role === "student" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <GraduationCap className="h-5 w-5" /> Student Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="studentClass">Class</Label>
              <Select
                value={studentClass?.toString() || ""}
                onValueChange={(v) => setStudentClass(Number(v))}
                disabled={isLoading}
              >
                <SelectTrigger
                  id="studentClass"
                  className={`mt-1 ${
                    errors.studentClass ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      Class {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.studentClass && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.studentClass}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="section">Section</Label>
              <div className="relative mt-1">
                <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="section"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  disabled={isLoading}
                  className={`pl-10 ${errors.section ? "border-red-500" : ""}`}
                  placeholder="e.g., A, B, C"
                />
              </div>
              {errors.section && (
                <p className="text-red-500 text-xs mt-1">{errors.section}</p>
              )}
            </div>

            <div>
              <Label htmlFor="rollNumber">Roll Number</Label>
              <div className="relative mt-1">
                <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="rollNumber"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  disabled={isLoading}
                  className={`pl-10 ${
                    errors.rollNumber ? "border-red-500" : ""
                  }`}
                  placeholder="Enter roll number"
                />
              </div>
              {errors.rollNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.rollNumber}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="parentContact">Parent Contact</Label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="parentContact"
                value={parentContact}
                onChange={(e) => setParentContact(e.target.value)}
                disabled={isLoading}
                className={`pl-10 ${
                  errors.parentContact ? "border-red-500" : ""
                }`}
                placeholder="Enter parent's contact"
              />
            </div>
            {errors.parentContact && (
              <p className="text-red-500 text-xs mt-1">
                {errors.parentContact}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Teacher Info */}
      {role === "teacher" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5" /> Teacher Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <div className="relative mt-1">
                <BookOpen className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={isLoading}
                  className={`pl-10 ${errors.subject ? "border-red-500" : ""}`}
                  placeholder="Enter your subject"
                />
              </div>
              {errors.subject && (
                <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isLoading}
                  className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                  placeholder="Enter your phone"
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="classAssigned">Assigned Class</Label>
            <Select
              value={classAssigned?.toString() || ""}
              onValueChange={(v) => setClassAssigned(Number(v))}
              disabled={isLoading}
            >
              <SelectTrigger
                id="classAssigned"
                className={`mt-1 ${
                  errors.classAssigned ? "border-red-500" : ""
                }`}
              >
                <SelectValue placeholder="Select assigned class" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    Class {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.classAssigned && (
              <p className="text-red-500 text-xs mt-1">
                {errors.classAssigned}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Security */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5" /> Security
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  const newPassword = e.target.value;
                  setPassword(newPassword);
                  setPasswordStrength(validatePasswordStrength(newPassword));
                }}
                disabled={isLoading}
                className={`pl-10 pr-10 ${
                  errors.password ? "border-red-500" : ""
                }`}
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
             {password && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          passwordStrength.score <= 2 ? 'bg-red-500' : 
                          passwordStrength.score === 3 ? 'bg-yellow-500' : 
                          passwordStrength.score === 4 ? 'bg-blue-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${
                      passwordStrength.score <= 2 ? 'text-red-600' : 
                      passwordStrength.score === 3 ? 'text-yellow-600' : 
                      passwordStrength.score === 4 ? 'text-blue-600' : 'text-green-600'
                    }`}>
                      {passwordStrength.score <= 2 ? 'Weak' : 
                       passwordStrength.score === 3 ? 'Fair' : 
                       passwordStrength.score === 4 ? 'Good' : 'Strong'}
                    </span>
                  </div>
                  
                  <div className="text-xs space-y-1">
                    <div className={`flex items-center gap-1 ${passwordStrength.requirements.length === true ? 'text-green-600' : 'text-red-600'}`}>
                      <span className="w-2 h-2 rounded-full bg-current"></span>
                      At least 8 characters
                    </div>
                    <div className={`flex items-center gap-1 ${passwordStrength.requirements.uppercase ? 'text-green-600' : 'text-red-600'}`}>
                      <span className="w-2 h-2 rounded-full bg-current"></span>
                      One uppercase letter
                    </div>
                    <div className={`flex items-center gap-1 ${passwordStrength.requirements.lowercase ? 'text-green-600' : 'text-red-600'}`}>
                      <span className="w-2 h-2 rounded-full bg-current"></span>
                      One lowercase letter
                    </div>
                    <div className={`flex items-center gap-1 ${passwordStrength.requirements.number ? 'text-green-600' : 'text-red-600'}`}>
                      <span className="w-2 h-2 rounded-full bg-current"></span>
                      One number
                    </div>
                    <div className={`flex items-center gap-1 ${passwordStrength.requirements.special ? 'text-green-600' : 'text-red-600'}`}>
                      <span className="w-2 h-2 rounded-full bg-current"></span>
                      One special character
                    </div>
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className={`pl-10 pr-10 ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="flex items-center space-x-2">
        <input
          id="terms"
          type="checkbox"
          checked={agreeToTerms}
          onChange={(e) => setAgreeToTerms(e.target.checked)}
          disabled={isLoading}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <Label htmlFor="terms" className="text-sm text-gray-700">
          I agree to the Terms of Service and Privacy Policy
        </Label>
      </div>
      {errors.terms && <p className="text-red-500 text-xs">{errors.terms}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
};

export default RegisterForm;
