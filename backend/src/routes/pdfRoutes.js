// src/routes/pdfRoutes.js
import express from 'express';
import multer from 'multer';
import protect from '../middlewares/auth.js';
import { uploadPdf, chatWithPdf, getDocumentInfo } from '../controllers/pdfController.js';

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  }
});
router.post('/upload', protect, upload.single('file'), uploadPdf);
router.post('/chat', protect, express.json(), chatWithPdf);
router.get('/document/:docId', protect, getDocumentInfo);

export default router;