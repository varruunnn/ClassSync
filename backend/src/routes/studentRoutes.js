import express from 'express';
import { getMyInfo, getMySubjects } from '../controllers/studentController.js';
import  protect  from '../middlewares/auth.js';

const router = express.Router();
router.get('/me', protect, getMySubjects);
router.get('/myinfo',protect,getMyInfo);


export default router;