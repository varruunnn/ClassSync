import mongoose from 'mongoose';
import User from '../models/User.js';
export const getTeachersBySchool = async (req, res) => {
  try {
    const paramSid = Number(req.params.schoolId);
    if (isNaN(paramSid)) {
      return res.status(400).json({ error: 'Invalid schoolId parameter.' });
    }
    if (req.schoolId !== paramSid) {
      return res.status(403).json({ error: 'Forbidden: wrong school.' });
    }
    const teachers = await User.find({ role: 'teacher', schoolId: paramSid });
    const formatted = teachers.map(t => ({
      id: t._id,
      name: t.name,
      subject: t.subject || '',
      email: t.email,
      phone: t.phone || '',
      classAssigned: t.classAssigned || null,
      status: 'active', 
    }));

    return res.json({ teachers: formatted });
  } catch (err) {
    console.error('getTeachersBySchool error:', err);
    return res.status(500).json({ error: 'Server error while fetching teachers.' });
  }
};
export const assignTeacher = async (req, res) => {
  try {
    const paramSid = Number(req.params.schoolId);
    if (isNaN(paramSid)) {
      return res.status(400).json({ error: 'Invalid schoolId parameter.' });
    }
    if (req.schoolId !== paramSid) {
      return res.status(403).json({ error: 'Forbidden: wrong school.' });
    }

    const teacherId = req.params.teacherId;
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ error: 'Invalid teacher ID.' });
    }

    const { className } = req.body;
    if (!className || typeof className !== 'string') {
      return res.status(400).json({ error: 'className is required.' });
    }
    const teacher = await User.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found.' });
    }
    if (teacher.role !== 'teacher' || teacher.schoolId !== paramSid) {
      return res.status(403).json({ error: 'Forbidden: not a teacher in this school.' });
    }
    teacher.classAssigned = className;
    await teacher.save();

    return res.json({
      message: `Assigned ${teacher.name} to class ${className}.`,
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
    console.error('assignTeacher error:', err);
    return res.status(500).json({ error: 'Server error while assigning teacher.' });
  }
};

export const unassignTeacher = async (req, res) => {
  try {
    const paramSid = Number(req.params.schoolId);
    if (isNaN(paramSid)) {
      return res.status(400).json({ error: 'Invalid schoolId parameter.' });
    }
    if (req.schoolId !== paramSid) {
      return res.status(403).json({ error: 'Forbidden: wrong school.' });
    }

    const teacherId = req.params.teacherId;
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ error: 'Invalid teacher ID.' });
    }
    const teacher = await User.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found.' });
    }
    if (teacher.role !== 'teacher' || teacher.schoolId !== paramSid) {
      return res.status(403).json({ error: 'Forbidden: not a teacher in this school.' });
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
    console.error('unassignTeacher error:', err);
    return res.status(500).json({ error: 'Server error while unassigning teacher.' });
  }
};
