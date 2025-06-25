// routes/teacherDashboard.js
import express from "express";
import ClassAssignment from "../models/ClassAssignment.js";
import StudentPerformance from "../models/StudentPerformance.js";
import Classroom from "../models/Classroom.js";

const router = express.Router();

// GET classroom by ID
router.get("/classroom/:id", async (req, res) => {
  const classroom = await Classroom.findById(req.params.id);
  res.json(Classroom);
});

// GET all recent classes (mock for now)
router.get("/classes", async (req, res) => {
  const classes = await Classroom.find().limit(3);
  res.json(classes);
});

// GET pending assignments for a classroom
router.get("/assignments/:classroomId", async (req, res) => {
  const assignments = await ClassAssignment.find({ classroomId: req.params.classroomId });
  res.json(assignments);
});

// GET top performers
router.get("/top-performers/:classroomId", async (req, res) => {
  const performers = await StudentPerformance.find({ classroomId: req.params.classroomId });
  res.json(performers);
});

export default router;
