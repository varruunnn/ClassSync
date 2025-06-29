// src/seed/teacherDashboard.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Classroom from "../models/Classroom.js";
import ClassAssignment from "../models/ClassAssignment.js";
import StudentPerformance from "../models/StudentPerformance.js";

dotenv.config({ path: "../../.env" });

const MONGODB_URI = process.env.MONGODB_URI;

console.log("MONGODB_URI:", MONGODB_URI);

const seedData = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to DB");

  // Clear existing data
  await Classroom.deleteMany();
  await ClassAssignment.deleteMany();
  await StudentPerformance.deleteMany();

  // Create Classroom
  const classroom = await Classroom.create({
    name: "Mathematics Grade 10",
    room: "204",
    students: 25,
    subject: "Mathematics",
    schedule: "Mon-Fri 9:00 AM",
    nextClass: "2025-06-20 9:00 AM",
    attendance: 92,
    averageGrade: 87,
  },
  {
    name: "Science Grade 9",
    room: "302",
    students: 22,
    subject: "Science",
    schedule: "Mon-Wed-Fri 10:30 AM",
    nextClass: "2025-06-21 10:30 AM",
    attendance: 88,
    averageGrade: 81,
  },
  {
    name: "English Grade 8",
    room: "105",
    students: 30,
    subject: "English",
    schedule: "Tue-Thu 11:00 AM",
    nextClass: "2025-06-22 11:00 AM",
    attendance: 95,
    averageGrade: 90,
  },
  {
    name: "History Grade 10",
    room: "210",
    students: 28,
    subject: "History",
    schedule: "Mon-Fri 1:00 PM",
    nextClass: "2025-06-20 1:00 PM",
    attendance: 85,
    averageGrade: 76,
  },
  {
    name: "Physics Grade 11",
    room: "401",
    students: 20,
    subject: "Physics",
    schedule: "Mon-Wed-Fri 2:30 PM",
    nextClass: "2025-06-21 2:30 PM",
    attendance: 90,
    averageGrade: 83,
  });

  // Create Assignments
  await ClassAssignment.insertMany([
    {
      assignment: "Algebra Quiz",
      subject: "Mathematics",
      submissions: 22,
      total: 25,
      dueDate: "2025-06-19",
      priority: "high",
      classroomId: classroom._id,
    },
    {
      assignment: "Geometry Test",
      subject: "Mathematics",
      submissions: 20,
      total: 25,
      dueDate: "2025-06-22",
      priority: "medium",
      classroomId: classroom._id,
    },
  ]);

  // Create Top Performers
  await StudentPerformance.insertMany([
    {
      name: "Sarah Johnson",
      subject: "Mathematics",
      grade: 98,
      improvement: "+5%",
      classroomId: classroom._id,
    },
    {
      name: "Emma Davis",
      subject: "Mathematics",
      grade: 94,
      improvement: "+7%",
      classroomId: classroom._id,
    },
  ]);

  console.log("Data seeded 🎉");
  mongoose.disconnect();
};

seedData();
