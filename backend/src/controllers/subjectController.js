import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import ClassSubjects from '../models/ClassSubjects.js';

export const getMySubjects = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).select('class role');
  if (!user || user.role !== 'student') {
    res.status(403);
    throw new Error('Not authorized as a student');
  }

  const mapping = await ClassSubjects.findOne({ className: user.class });
  if (!mapping) {
    res.status(404);
    throw new Error(`No subjects configured for class ${user.class}`);
  }

  res.json({ subjects: mapping.subjects });
});