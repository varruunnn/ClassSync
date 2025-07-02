import asyncHandler from "express-async-handler";
import Discussion from "../models/Discussion.js";

export const postQuestion = asyncHandler(async (req, res) => {
  const { question, subject, contactInfo } = req.body;
  if (!question?.trim() || !subject || !contactInfo?.trim()) {
    res.status(400);
    throw new Error("Question text and subject are required");
  }

  const discussion = await Discussion.create({
    author: req.user._id,
    schoolId: req.user.schoolId,
    className: req.user.class,
    subject: subject,
    question: question.trim(),
    contactInfo: contactInfo.trim(),
  });

  res.status(201).json(discussion);
});

export const getAllQuestions = asyncHandler(async (req, res) => {
  const { schoolId, class: className } = req.user;
  const filter = { schoolId, className };
  if (req.query.subject) filter.subject = req.query.subject;

  const list = await Discussion.find(filter)
    .populate("author", "name")
    .sort("-createdAt");

  res.json(list);
});

export const deleteQuestion = asyncHandler(async (req, res) => {
  const discussion = await Discussion.findById(req.params.id);
  if (!discussion) {
    res.status(404);
    throw new Error("Discussion not found");
  }
  if (discussion.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this question");
  }
  await discussion.deleteOne();
  res.json({ success: true, message: "Question deleted" });
});
