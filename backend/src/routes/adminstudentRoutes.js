import express from 'express';
import { getStudentsBySchool, deleteStudent } from '../controllers/adminstudentController.js';
import protect from '../middlewares/auth.js';
import isAdmin from '../middlewares/isAdmin.js';

const router = express.Router();

router.get('/:schoolId/students', protect, isAdmin, getStudentsBySchool);

router.delete('/:schoolId/students/:id', protect, isAdmin, deleteStudent);

export default router;
