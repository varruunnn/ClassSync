import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    required: true,
  },
  topics:{
    type:Array,
  },
  sec:{
    type:String,
  },
  description: String,
  fileUrl: String,
  dueDate: Date,
  schoolId: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.model('Assignment', assignmentSchema);
