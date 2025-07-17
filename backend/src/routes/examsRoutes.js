import express from 'express';
import LatestExam from '../models/LatestExam.js';
import asyncHandler from 'express-async-handler';
import protect from '../middlewares/auth.js';
import authorizeTeacher from '../middlewares/authorizeTeacher.js';

const router = express.Router();

router.post(
  '/latest',
  protect,
  authorizeTeacher,
  asyncHandler(async (req, res) => {
    const { class: className, section, examType, entries } = req.body;
    const ops = entries.map(e => ({
      updateOne: {
        filter: { studentId: e.studentId, examType },
        update: {
          $set: {
            studentEmail: e.studentEmail,
            class: className,
            section,
            marks: e.marks,
            takenAt: new Date()
          }
        },
        upsert: true
      }
    }));
    const result = await LatestExam.bulkWrite(ops, { ordered: false });
    res.json({ success: true, result });
  })
);

router.get(
  '/latest/:schoolId',
  protect,
  asyncHandler(async (req, res) => {
    const { class: className, section, examType } = req.query;
    if (parseInt(req.params.schoolId) !== req.user.schoolId) {
      return res.status(403).json({ message: 'School ID mismatch' });
    }

    const exams = await LatestExam.find({ class: className, section, examType })
      .lean();

    const data = exams.map(ex => ({
      studentId: ex.studentId._id,
      name: ex.studentId.name,
      roll: ex.studentId.rollNumber,
      email: ex.studentEmail,
      marks: ex.marks.map(m => ({
        subjectId: m.subjectId._id,
        subject: m.subjectId.name,
        marks: m.marks
      }))
    }));
    res.json({ success: true, data });
  })
);

export default router;
