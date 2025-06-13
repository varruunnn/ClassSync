import express from 'express';
import { getMySubjects } from '../controllers/subjectController.js';
import  protect  from '../middlewares/auth.js';

const router = express.Router();
router.get('/me', protect, getMySubjects);

export default router;