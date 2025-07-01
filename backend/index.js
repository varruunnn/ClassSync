import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './src/db/index.js'
import authRoutes from './src/routes/auth.js'; 
import dataRoutes from './src/routes/dataRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import noticeRoutes from './src/routes/noticeRoutes.js';
import adminStudentRoutes from './src/routes/adminstudentRoutes.js';
import teacherRoutes from './src/routes/teacherRoutes.js';
import pdfRoutes from './src/routes/pdfRoutes.js';
import subjectRoutes from './src/routes/studentRoutes.js';
import discussionRoutes from './src/routes/discussionRoutes.js';
import teacherDashboardRoutes from "./src/routes/teacherDashboard.js";


const app = express();

// Connect to MongoDB
connectDB();

app.use(
  cors({
    origin: 'http://localhost:5173', 
    credentials: true,               
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/admin', adminStudentRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/admin', teacherRoutes)
app.use('/api/pdf', pdfRoutes);
app.use('/api/students/subjects', subjectRoutes);
app.use('/api/students', subjectRoutes);
app.use('/api/students', discussionRoutes);
app.use("/api/teacher", teacherDashboardRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});