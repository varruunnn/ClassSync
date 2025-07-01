import express from 'express';
import { 
  getAllQuestions, 
  postQuestion, 
  deleteQuestion 
} from '../controllers/discussionController.js';
import protect from '../middlewares/auth.js';

const router = express.Router();

router
  .route('/discussions')
  .get(protect, getAllQuestions)
  .post(protect, postQuestion);

router
  .route('/discussions/:id')
  .delete(protect, deleteQuestion);

export default router;
