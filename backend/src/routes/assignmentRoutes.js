// src/routes/assignmentRoutes.js
import express from 'express';
import protect from '../middlewares/auth.js';
import authorizeTeacher from '../middlewares/authorizeTeacher.js';
import { uploadPDF } from '../middlewares/upload.js';
import {
  createAssignment,
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

export default router;
