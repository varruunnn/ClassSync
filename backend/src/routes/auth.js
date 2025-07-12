import express from 'express';
import { register, login ,logout,me , changePassword} from '../controllers/authController.js'; 
import protect from '../middlewares/auth.js';
import rateLimit from 'express-rate-limit';
const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, 
  message: {
    message: 'Too many login attempts, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', register);
router.post('/login',loginLimiter, login);
router.post('/logout', logout);
router.get("/me", protect, me);
router.put("/change-password",protect,changePassword);

export default router; 
