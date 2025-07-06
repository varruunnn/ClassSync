import express from "express";
import Message from "../models/Message.js";
import Student from "../models/User.js";
import protect from '../middlewares/auth.js';
const router = express.Router();

router.get(
  "/students",
  protect,
  async (req, res) => {
    try {
      const { class: cls, section } = req.query;
      if (!cls || !section) {
        return res
          .status(400)
          .json({ error: "class & section query params are required" });
      }

      if (req.role !== "teacher") {
        return res.status(403).json({ error: "Forbidden" });
      }

      const students = await Student.find({
        class: cls,
        section,
        schoolId: req.schoolId,
      }).select("name rollNumber _id");

      res.json(students);
    } catch (err) {
      console.error("GET /students error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.post(
  "/messages",
  protect,
  async (req, res) => {
    try {
      if (req.role !== "teacher") {
        return res.status(403).json({ error: "Only teachers can send messages" });
      }

      const teacherId = req.userId;
      const { studentId, content } = req.body;

      if (!studentId || !content) {
        return res
          .status(400)
          .json({ error: "studentId and content are required" });
      }

      const student = await Student.findOne({
        _id: studentId,
        schoolId: req.schoolId,
      });
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      const msg = await Message.create({
        teacherId,
        studentId,
        content,
      });

      res.status(201).json(msg);
    } catch (err) {
      console.error("POST /messages error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.get(
  "/messages",
  protect,
  async (req, res) => {
    try {
      if (req.role !== "student") {
        return res.status(403).json({ error: "Only parents can view messages" });
      }

      const studentId = req.user._id;
      if (!studentId) {
        return res
          .status(400)
          .json({ error: "No linked studentId on parent profile" });
      }

      const messages = await Message.find({ studentId })
        .sort({ createdAt: -1 })
        .populate("teacherId", "name email");

      res.json(messages);
    } catch (err) {
      console.error("GET /messages error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

export default router;
