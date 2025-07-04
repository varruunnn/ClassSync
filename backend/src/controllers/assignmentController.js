import asyncHandler from 'express-async-handler';
import Assignment from '../models/Assignment.js';
export const createAssignment = asyncHandler(async (req, res) => {
  const { title, subject, className, description, dueDate ,sec } = req.body;
  if (!title || !subject || !className) {
    res.status(400);
    throw new Error('Title, subject, and className are required');
  }

  const assignment = await Assignment.create({
    title,
    subject,
    className,
    description,
    sec,
    dueDate: dueDate ? new Date(dueDate) : undefined,
    fileUrl: req.file ? `/uploads/assignments/${req.file.filename}` : undefined,
    schoolId: req.user.schoolId,
    createdBy: req.user._id
  });

  res.status(201).json(assignment);
});
export const getAssignments = asyncHandler(async (req, res) => {
  const { schoolId, role, _id: userId } = req.user;

  const filter = { schoolId };

  if (role === 'student') {
    const studentClass =
      req.user.class      
      ?? req.user.className   
      ?? req.user.classAssigned 
      ;
    if (!studentClass) {
      return res
        .status(500)
        .json({ error: 'Student class not found on req.user' });
    }
    filter.className = studentClass;
  } else if (role === 'teacher') {
    filter.createdBy = userId;
  }

  const list = await Assignment.find(filter).sort('-createdAt');
  res.json(list);
});
