import mongoose from "mongoose";

const SubjectMarkSchema = new mongoose.Schema({
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  marks: { type: Number, required: true, min: 0, max: 100 },
});

const LatestExamSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentEmail: { type: String, required: true },
    class: { type: String, required: true },
    section: { type: String, required: true },
    examType: {
      type: String,
      enum: ["unitTest", "halfYearly", "yearly"],
      required: true,
    },
    marks: { type: [SubjectMarkSchema], required: true },
    takenAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("LatestExam", LatestExamSchema);
