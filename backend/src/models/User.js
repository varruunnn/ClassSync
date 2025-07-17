import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      required: true,
      default: "student",
    },
    schoolId: { type: Number, required: true },
    class: {
      type: String,
      required: function () {
        return this.role === "student";
      },
    },
    section: {
      type: String,
      required: function () {
        return this.role === "student";
      },
    },
    rollNumber: {
      type: String,
      required: function () {
        return this.role === "student";
      },
    },
    parentContact: {
      type: String,
      required: function () {
        return this.role === "student";
      },
    },
    // Teacher-specific fields
    subject: {
      type: String,
      required: function () {
        return this.role === "teacher";
      },
    },
    phone: {
      type: String,
      required: function () {
        return this.role === "teacher";
      },
    },
    classAssigned: {
      type: String,
      default: null,
    },
    classAssignedSection: {
      type: String,
      default : null,
    },
    classes: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => Array.isArray(arr),
        message: "classes must be an array of class names",
      },
    },
    attendance: {
      type: Number,
      default: 0,
      required: function () {
        return this.role === "student";
      },
    },
    unitTestAvg: {
      type: Number,
      default: 0,
      required: function () {
        return this.role === "student";
      },
    },
    halfYearlyAvg: {
      type: Number,
      default: 0,
      required: function () {
        return this.role === "student";
      },
    },
    yearlyAvg: {
      type: Number,
      default: 0,
      required: function () {
        return this.role === "student";
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
