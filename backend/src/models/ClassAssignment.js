// models/ClassAssignment.js
import mongoose from "mongoose";
const AssignmentSchema = new mongoose.Schema({
    assignment: String,
    subject: String,
    submissions: Number,
    total: Number,
    dueDate: Date,
    priority: String,
    classroomId: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom" },
  });
  
  export default mongoose.model("ClassAssignment", AssignmentSchema);
  