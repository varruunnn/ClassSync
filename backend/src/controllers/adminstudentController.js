import User from "../models/User.js";
import ClassSubjects from "../models/ClassSubjects.js";
import mongoose from "mongoose";
export const getStudentsBySchool = async (req, res) => {
  try {
    const paramSid = Number(req.params.schoolId);

    if (isNaN(paramSid)) {
      return res
        .status(400)
        .json({ error: "Invalid schoolId parameter." });
    }
    if (req.schoolId !== paramSid) {
      return res.status(403).json({ error: "Forbidden: wrong school." });
    }
    const studentFilter = { schoolId: paramSid, role: "student" };
    const { class: cls, section } = req.query; 

    if (cls) {
      studentFilter.class = cls;
    }
    if (section) {
      studentFilter.section = section;
    }
    const students = await User.find(studentFilter).select(
      "name email class rollNumber parentContact section"
    );
    const subjectFilter = {};
    if (cls) {
      subjectFilter.className = cls; 
    }
    const subjectsMapping = await ClassSubjects.findOne(subjectFilter);
    const subjects = subjectsMapping ? subjectsMapping.subjects : [];
    return res.json({ students, subjects });

  } catch (err) {
    console.error("getStudentsBySchool error:", err);
    return res
      .status(500)
      .json({ error: "Server error while fetching students and subjects." });
  }
};
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const paramSid = Number(req.params.schoolId);
    if (req.schoolId !== paramSid) {
      return res.status(403).json({ error: "Forbidden: wrong school." });
    }
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid student ID." });
    }
    const student = await User.findById(id);
    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }
    if (student.role !== "student" || student.schoolId !== paramSid) {
      return res
        .status(403)
        .json({ error: "Forbidden: cannot delete this user." });
    }
    await User.findByIdAndDelete(id);
    return res.json({ message: "Student deleted." });
  } catch (err) {
    console.error("deleteStudent error:", err);
    return res
      .status(500)
      .json({ error: "Server error while deleting student." });
  }
};
export const getStudentsByID = async (req, res) => {
  try {
    const paramSid = Number(req.params.schoolId);
    const studentIdParam = String(req.params.studentId);
    if (isNaN(paramSid)) {
      return res.status(400).json({ error: "Invalid schoolId parameter." });
    }
    if (!mongoose.Types.ObjectId.isValid(studentIdParam)) {
      return res.status(400).json({ error: "Invalid student ID format." });
    }

    if (req.schoolId !== paramSid) {
      return res.status(403).json({ error: "Forbidden: wrong school." });
    }
    const filter = {
      schoolId: paramSid,
      role: "student",
      _id: new mongoose.Types.ObjectId(studentIdParam),
    };

    const { class: cls, section } = req.query;
    if (cls) filter.class = cls;
    if (section) filter.section = section;
    const student = await User.findOne(filter).select(
      "name email class rollNumber parentContact section"
    );

    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }

    return res.json({ student });
  } catch (err) {
    console.error("getStudentsBySchool error:", err);
    return res
      .status(500)
      .json({ error: "Server error while fetching students." });
  }
};
