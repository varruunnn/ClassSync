import express from 'express';
import { createNotice,deleteNotice,listNoticesBySchool } from '../controllers/noticeController.js';
import protect from '../middlewares/auth.js';
import isAdmin from '../middlewares/isAdmin.js'

const router = express.Router();


router.get('/:schoolId',protect,listNoticesBySchool);

router.post('/',protect,isAdmin,createNotice);

router.delete('/:id',protect,isAdmin,deleteNotice);

export default router;
