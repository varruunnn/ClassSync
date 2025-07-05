// src/routes/teacherRoutes.js
import express from 'express';
import {
  getTeachersBySchool,
  assignTeacher,
  unassignTeacher,
  assignTeachingClasses,
  unassignTeachingClass
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
router.post(
  '/:schoolId/teachers/:teacherId/teaching-classes',
    protect,
  isAdmin,
  assignTeachingClasses
);

router.delete(
  '/:schoolId/teachers/:teacherId/teaching-classes',
    protect,
  isAdmin,
  unassignTeachingClass
);
export default router;
