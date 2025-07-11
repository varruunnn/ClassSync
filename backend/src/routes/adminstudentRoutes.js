import express from 'express';
import { getStudentsBySchool, deleteStudent, getStudentsByID } from '../controllers/adminstudentController.js';
import protect from '../middlewares/auth.js';
import authorizeTeacher from '../middlewares/authorizeTeacher.js'; 

const router = express.Router();
router.get('/:schoolId/students', protect, authorizeTeacher, getStudentsBySchool);
router.get('/:schoolId/students/:studentId', protect, authorizeTeacher, getStudentsByID);
router.delete('/:schoolId/students/:id', protect, authorizeTeacher, deleteStudent);

export default router;