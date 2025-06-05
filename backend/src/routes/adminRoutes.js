import express from 'express';
import { getSchoolStats } from '../controllers/statsController.js';
import protect from '../middlewares/auth.js';

const router = express.Router();

router.get(
  '/:schoolId/stats',
  protect,
  (req, res, next) => {
    const tokenSchoolId  = req.schoolId;                  
    const paramSchoolId  = Number(req.params.schoolId);   

    console.log('→ token.schoolId:', tokenSchoolId);
    console.log('→ params.schoolId:', paramSchoolId);

    if (tokenSchoolId !== paramSchoolId) {
      return res
        .status(403)
        .json({ error: 'Forbidden: wrong school.' });
    }
    next();
  },
  getSchoolStats
);

export default router;
