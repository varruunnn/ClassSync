import mongoose from "mongoose";
const StudentPerformanceSchema = new mongoose.Schema({
    name: String,
    subject: String,
    grade: Number,
    improvement: String,
    classroomId: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom" },
  });
  
  export default mongoose.model("StudentPerformance", StudentPerformanceSchema);
  