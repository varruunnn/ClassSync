import express from 'express';
import protect from '../middlewares/auth.js';
import authorizeTeacher from '../middlewares/authorizeTeacher.js';
import { uploadPDF } from '../middlewares/upload.js';
import {
  createAssignment,
  deleteAssignment,
  getAssignments,
} from '../controllers/assignmentController.js';

const router = express.Router();
router.get("/", protect, getAssignments);

router.post(
  "/",
  protect,
  authorizeTeacher,
  uploadPDF.single("file"),    
  createAssignment
);
router.delete(
  "/:id", 
  protect,
  authorizeTeacher, 
  deleteAssignment
);

export default router;
