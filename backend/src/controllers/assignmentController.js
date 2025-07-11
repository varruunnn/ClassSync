import asyncHandler from 'express-async-handler';
import Assignment from '../models/Assignment.js';
import mongoose from 'mongoose';
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


export const deleteAssignment = asyncHandler(async (req, res) => {
  const assignmentId = req.params.id;
  if (!assignmentId || !mongoose.Types.ObjectId.isValid(assignmentId)) {
    res.status(400);
    throw new Error('Invalid assignment ID provided.');
  }
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    res.status(404);
    throw new Error('Assignment not found.');
  }
  if (assignment.createdBy.toString() !== req.user._id.toString()) {
    res.status(403); 
    throw new Error('Not authorized to delete this assignment.');
  }
  await assignment.deleteOne(); 

  res.status(200).json({ message: 'Assignment deleted successfully.' });
});