import mongoose from "mongoose";

const discussionSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  schoolId: {
    type: Number,
    required: true,
  },
  className: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  contactInfo: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Discussion", discussionSchema);
