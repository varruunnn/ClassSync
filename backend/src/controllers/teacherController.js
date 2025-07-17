import mongoose from "mongoose";
import User from "../models/User.js";
export const getTeachersBySchool = async (req, res) => {
  try {
    const paramSid = Number(req.params.schoolId);
    if (isNaN(paramSid)) {
      return res.status(400).json({ error: "Invalid schoolId parameter." });
    }
    if (req.schoolId !== paramSid) {
      return res.status(403).json({ error: "Forbidden: wrong school." });
    }
    const teachers = await User.find({ role: "teacher", schoolId: paramSid });
    const formatted = teachers.map((t) => ({
      id: t._id,
      name: t.name,
      subject: t.subject || "",
      email: t.email,
      phone: t.phone || "",
      classAssigned: t.classAssigned || null,
      classes: t.classes,
      status: "active",
    }));

    return res.json({ teachers: formatted });
  } catch (err) {
    console.error("getTeachersBySchool error:", err);
    return res
      .status(500)
      .json({ error: "Server error while fetching teachers." });
  }
};
export const assignTeacher = async (req, res) => {
  try {
    const paramSid = Number(req.params.schoolId);
    if (isNaN(paramSid)) {
      return res.status(400).json({ error: "Invalid schoolId parameter." });
    }
    if (req.schoolId !== paramSid) {
      return res.status(403).json({ error: "Forbidden: wrong school." });
    }

    const teacherId = req.params.teacherId;
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ error: "Invalid teacher ID." });
    }

    const { classes } = req.body;
    if (!Array.isArray(classes)) {
      return res.status(400).json({ error: "Classes must be an array." });
    }

    const teacher = await User.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found." });
    }
    if (teacher.role !== "teacher" || teacher.schoolId !== paramSid) {
      return res.status(403).json({ error: "Not authorized." });
    }

    teacher.classes = classes;
    await teacher.save();

    return res.json({
      message: `Assigned ${teacher.name} to classes.`,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        classes: teacher.classes,
        classAssigned: teacher.classAssigned,
      },
    });
  } catch (err) {
    console.error("assignTeachingClasses error:", err);
    return res.status(500).json({ error: "Server error." });
  }
};


export const unassignTeacher = async (req, res) => {
  try {
    const paramSid = Number(req.params.schoolId);
    if (isNaN(paramSid)) {
      return res.status(400).json({ error: "Invalid schoolId parameter." });
    }
    if (req.schoolId !== paramSid) {
      return res.status(403).json({ error: "Forbidden: wrong school." });
    }

    const teacherId = req.params.teacherId;
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ error: "Invalid teacher ID." });
    }
    const teacher = await User.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found." });
    }
    if (teacher.role !== "teacher" || teacher.schoolId !== paramSid) {
      return res
        .status(403)
        .json({ error: "Forbidden: not a teacher in this school." });
    }
    teacher.classAssigned = null;
    await teacher.save();

    return res.json({
      message: `Unassigned ${teacher.name} from their class.`,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        subject: teacher.subject,
        email: teacher.email,
        phone: teacher.phone,
        classAssigned: teacher.classAssigned,
      },
    });
  } catch (err) {
    console.error("unassignTeacher error:", err);
    return res
      .status(500)
      .json({ error: "Server error while unassigning teacher." });
  }
};

export const assignTeachingClasses = async (req, res) => {
  try {
    const schoolId = Number(req.params.schoolId);
    if (isNaN(schoolId)) return res.status(400).json({ error: 'Invalid schoolId.' });
    if (req.schoolId !== schoolId) return res.status(403).json({ error: 'Forbidden.' });
    const teacherId = req.params.teacherId;
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ error: 'Invalid teacherId.' });
    }

    const { classes } = req.body;
    if (!Array.isArray(classes) || classes.some(c => typeof c !== 'string')) {
      return res.status(400).json({ error: 'classes must be an array of strings.' });
    }

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== 'teacher' || teacher.schoolId !== schoolId) {
      return res.status(404).json({ error: 'Teacher not found in this school.' });
    }

    teacher.classes = Array.from(new Set([...(teacher.classes || []), ...classes]));
    await teacher.save();

    return res.json({
      message: `Assigned classes [${classes.join(', ')}] to ${teacher.name}.`,
      teacher: {
        id: teacher._id,
        classes: teacher.classes
      },
    });
  } catch (err) {
    console.error('assignTeachingClasses error:', err);
    return res.status(500).json({ error: 'Server error.' });
  }
};
export const unassignTeachingClass = async (req, res) => {
  const { className } = req.body; 
  teacher.classes = teacher.classes.filter(c => c !== className);
  await teacher.save();
  return res.json({
    message: `Unassigned class ${className}`,
    teacher: { id: teacher._id, classes: teacher.classes }
  });
};