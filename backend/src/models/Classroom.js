// models/Classroom.js
import mongoose from "mongoose";

const ClassroomSchema = new mongoose.Schema({
  name: String,
  room: String,
  students: Number,
  subject: String,
  schedule: String,
  nextClass: String,
  attendance: Number,
  averageGrade: Number,
});

export default mongoose.model("Classroom", ClassroomSchema);
