import { GoogleGenerativeAI } from '@google/generative-ai';
import crypto from 'crypto';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const documentStore = new Map();
const CLEANUP_INTERVAL = 30 * 60 * 1000;
const DOCUMENT_TTL = 2 * 60 * 60 * 1000; 

setInterval(() => {
  const now = Date.now();
  for (const [docId, doc] of documentStore.entries()) {
    if (now - doc.uploadTime > DOCUMENT_TTL) {
      documentStore.delete(docId);
    }
  }
}, CLEANUP_INTERVAL);

export const uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No PDF file uploaded'
      });
    }

    const file = req.file;
    if (file.mimetype !== 'application/pdf') {
      return res.status(400).json({
        success: false,
        message: 'Only PDF files are allowed'
      });
    }
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum allowed size is 10MB'
      });
    }
    let pdfData;
    try {
      pdfData = await pdf(file.buffer);
    } catch (pdfError) {
      return res.status(400).json({
        success: false,
        message: 'Failed to parse PDF. The file might be corrupted or password-protected.'
      });
    }

    const textContent = pdfData.text;

    if (!textContent || textContent.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract text from PDF. Please ensure the PDF contains readable text.'
      });
    }
    const docId = crypto.randomUUID();
    documentStore.set(docId, {
      content: textContent,
      filename: file.originalname,
      uploadTime: Date.now(),
      size: file.size,
      pages: pdfData.numpages
    });

    res.json({
      success: true,
      message: 'PDF uploaded and processed successfully',
      data: {
        docId,
        filename: file.originalname,
        size: file.size,
        pages: pdfData.numpages,
        textLength: textContent.length
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to process PDF',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const chatWithPdf = async (req, res) => {
  try {
    const { docId, message } = req.body;

    if (!docId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Document ID and message are required'
      });
    }
    const document = documentStore.get(docId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found or expired. Please upload the PDF again.'
      });
    }
    const context = `You are an AI assistant helping users understand and analyze a PDF document. The document content is provided below. Please answer the user's question based solely on the information in this document.

Document: "${document.filename}"
Content:
${document.content}

User Question: ${message}

Instructions:
- Answer based only on the document content provided
- If the answer cannot be found in the document, clearly state that
- Be helpful, accurate, and concise
- If asked to summarize, provide a structured summary
- For specific questions, quote relevant parts when helpful`;
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(context);
    const response = await result.response;
    const answer = response.text();

    res.json({
      success: true,
      data: {
        message: answer,
        docInfo: {
          filename: document.filename,
          pages: document.pages
        }
      }
    });

  } catch (error) {
    if (error.message?.includes('API key')) {
      return res.status(500).json({
        success: false,
        message: 'AI service configuration error'
      });
    }

    if (error.message?.includes('quota') || error.message?.includes('limit')) {
      return res.status(429).json({
        success: false,
        message: 'AI service quota exceeded. Please try again in 30-45 seconds.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to generate response',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
export const getDocumentInfo = async (req, res) => {
  try {
    const { docId } = req.params;
    
    const document = documentStore.get(docId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found or expired'
      });
    }

    res.json({
      success: true,
      data: {
        filename: document.filename,
        size: document.size,
        pages: document.pages,
        textLength: document.content.length,
        uploadTime: new Date(document.uploadTime).toISOString()
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get document info'
    });
  }
};