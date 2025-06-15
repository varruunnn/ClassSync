// src/routes/teacherRoutes.js
import express from 'express';
import {
  getTeachersBySchool,
  assignTeacher,
  unassignTeacher,
} from '../controllers/teacherController.js';
import protect from '../middlewares/auth.js';
import isAdmin from '../middlewares/isAdmin.js';

const router = express.Router();
router.get('/:schoolId/teachers', protect, getTeachersBySchool);
router.post(
  '/:schoolId/teachers/:teacherId/assign',
  protect,
  isAdmin,
  express.json(),
  assignTeacher
);
router.delete(
  '/:schoolId/teachers/:teacherId/assign',
  protect,
  isAdmin,
  unassignTeacher
);

export default router;
