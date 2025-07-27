import { GoogleGenerativeAI } from "@google/generative-ai";
import crypto from "crypto";
import { createRequire } from "module";
import { redis } from "../utils/redisClient.js";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const DOCUMENT_TTL_SECONDS = 3 * 60;
export const uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No PDF file uploaded" });
    }

    const file = req.file;
    if (file.mimetype !== "application/pdf") {
      return res
        .status(400)
        .json({ success: false, message: "Only PDF files are allowed" });
    }
    if (file.size > 10 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "File size too large. Maximum is 10MB",
      });
    }

    let pdfData;
    try {
      pdfData = await pdf(file.buffer);
    } catch {
      return res
        .status(400)
        .json({ success: false, message: "Failed to parse PDF." });
    }

    const textContent = pdfData.text.trim();
    if (!textContent) {
      return res
        .status(400)
        .json({ success: false, message: "Empty PDF text." });
    }

    const docId = crypto.randomUUID();
    const payload = {
      content: textContent,
      filename: file.originalname,
      size: file.size,
      pages: pdfData.numpages,
      uploadTime: Date.now(),
    };
    await redis.set(`pdf:${docId}`, JSON.stringify(payload), {
      ex: DOCUMENT_TTL_SECONDS,
    });

    return res.json({
      success: true,
      data: {
        docId,
        filename: payload.filename,
        size: payload.size,
        pages: payload.pages,
        textLength: textContent.length,
      },
    });
  } catch (error) {
    console.error("uploadPdf error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process PDF",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const chatWithPdf = async (req, res) => {
  try {
    const { docId, message } = req.body;
    if (!docId || !message) {
      return res
        .status(400)
        .json({ success: false, message: "docId and message required" });
    }

    const raw = await redis.get(`pdf:${docId}`);
    if (!raw) {
      return res
        .status(404)
        .json({ success: false, message: "Document expired or not found" });
    }

    const document = typeof raw === "string" ? JSON.parse(raw) : raw;
    const context = `
You are an AI assistant. The PDF content is below:
Filename: "${document.filename}"
Content:
${document.content}

User Question: ${message}

Instructions:
- Answer based only on the document content.
- If not present, say you don’t know.
- Be concise and accurate.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(context);
    const response = await result.response;
    const answer = response.text();

    return res.json({
      success: true,
      data: {
        message: answer,
        docInfo: { filename: document.filename, pages: document.pages },
      },
    });
  } catch (error) {
    console.error("chatWithPdf error:", error);
    if (error.message?.includes("API key")) {
      return res
        .status(500)
        .json({ success: false, message: "AI service configuration error" });
    }
    if (error.message?.match(/quota|limit/)) {
      return res.status(429).json({
        success: false,
        message:
          "AI service quota exceeded. Please try again in 30-45 seconds.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to generate response",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getDocumentInfo = async (req, res) => {
  try {
    const { docId } = req.params;
    const raw = await redis.get(`pdf:${docId}`);
    if (!raw) {
      return res
        .status(404)
        .json({ success: false, message: "Document expired or not found" });
    }

    const doc = typeof raw === "string" ? JSON.parse(raw) : raw;
    return res.json({
      success: true,
      data: {
        filename: doc.filename,
        size: doc.size,
        pages: doc.pages,
        textLength: doc.content.length,
        uploadTime: new Date(doc.uploadTime).toISOString(),
      },
    });
  } catch (error) {
    console.error("getDocumentInfo error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to get document info" });
  }
};
