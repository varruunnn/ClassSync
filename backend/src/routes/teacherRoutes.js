import express from 'express';
import { getAllTeachers } from '../controllers/teacherController.js';
import protect from '../middlewares/auth.js';
import isAdmin from '../middlewares/isAdmin.js';

const router = express.Router();

router.get('/:schoolId/teachers', protect, isAdmin, getAllTeachers);

export default router;
