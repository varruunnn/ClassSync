import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const register = async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    schoolId,
    studentClass,
    studentSection,
    rollNumber,
    parentContact,
    subject,
    phone,
    classAssigned,
  } = req.body;
  if (!name || !email || !password || !role || !schoolId) {
    return res.status(400).json({
      message: "Name, email, password, role, and schoolId are required.",
    });
  }
  if (role === 'student') {
    if (!studentClass || !rollNumber || !parentContact) {
      return res.status(400).json({
        message:
          "For role 'student', you must supply studentClass, rollNumber, and parentContact.",
      });
    }
  }

  if (role === 'teacher') {
    if (!subject || !phone) {
      return res.status(400).json({
        message:
          "For role 'teacher', you must supply subject and phone.",
      });
    }
  }

  try {
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ message: "User with this email already exists." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const newUserData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      role,
      schoolId: Number(schoolId),
    };

    if (role === 'student') {
      newUserData.class = studentClass;
      newUserData.section = studentSection;
      newUserData.rollNumber = rollNumber;
      newUserData.parentContact = parentContact;
    }

    if (role === 'teacher') {
      newUserData.subject = subject;
      newUserData.phone = phone;
      if (classAssigned) {
        newUserData.classAssigned = classAssigned;
      }
    }
    const user = new User(newUserData);
    await user.save();
    const token = jwt.sign(
      { userId: user._id, role: user.role, schoolId: user.schoolId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    return res.status(201).json({
      message: "Registration successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        schoolId: user.schoolId,
        ...(user.role === 'student'
          ? {
              class: user.class,
              section : user.section,
              rollNumber: user.rollNumber,
              parentContact: user.parentContact,
            }
          : {}),
        ...(user.role === 'teacher'
          ? {
              subject: user.subject,
              phone: user.phone,
              classAssigned: user.classAssigned,
            }
          : {}),
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ message: "Server error during registration." });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Both email and password are required." });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role, schoolId: user.schoolId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "lax", 
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({
      message: 'Login successful!',
      name: user.name,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error during login." });
  }
};
export const logout = (req, res) => {
  res
    .cookie('token', '', {
      httpOnly: true,
      secure: true,    
      sameSite: 'none', 
      expires: new Date(0),
    })
    .json({ message: 'Logged out' });
};
export const me = (req, res) => {
  return res.json({
    name: req.user.name,
    role: req.role,
    schoolId: req.schoolId,
    email: req.user.email,
    Id: req.user._id,
    subject: req.user.subject,
    phone:req.user.phone,
    classes: req.user.classes,
    classAssigned: req.user.classAssigned,
  });
};

export const changePassword = async (req,res) =>{
  const {currentPassword,newPassword} = req.body;
  const user = await User.findById(req.user);
  const match = await bcrypt.compare(currentPassword,user.password);
  if(!match) return res.status(400).json({ error: 'Current password incorrect.' });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword,salt);
  await user.save();
  res.json({message:'password changed'})
}

