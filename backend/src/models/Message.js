import mongoose from "mongoose"; 
const { Schema } = mongoose;

const messageSchema = new Schema({
  teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  content: { type: String, required: true },
}, {
  timestamps: true
});

export default mongoose.model("Message", messageSchema); 