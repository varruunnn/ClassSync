import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { name, email, password, role, schoolId, class: studentClass } = req.body;

  if (!name || !email || !password || !role || !schoolId || (role === 'student' && !studentClass)) {
    return res
      .status(400)
      .json({
        message: "Name, email, password, role, schoolId, and class (for students) are required.",
      });
  }

  try {
    let existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      role,
      schoolId,
      class: role === 'student' ? studentClass : undefined,
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role, schoolId: user.schoolId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Registration successful!",
      token,
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res
      .status(500)
      .json({ message: "Server error during registration." });
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
    role: req.role,
    schoolId: req.schoolId,
  });
};