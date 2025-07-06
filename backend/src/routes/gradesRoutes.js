import express from 'express';
const { Router } = express;

import User from "../models/User.js";
import { body, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import protect from '../middlewares/auth.js';
import authorizeTeacher from '../middlewares/authorizeTeacher.js';

const router = Router();

router.put(
  '/bulk-update',
  protect,
  authorizeTeacher,
  [
    body('class')
      .isString().withMessage('Class name is required and must be a string.')
      .notEmpty().withMessage('Class name cannot be empty.'),
    body('grades')
      .isArray({ min: 1 }).withMessage('Grades must be a non-empty array of student grade objects.'),
    body('grades.*.studentId')
      .isMongoId().withMessage('Each student ID in the grades array must be a valid MongoDB ObjectId.'),
    body('grades.*.unitTestAvg')
      .isNumeric().withMessage('Unit Test Average must be a number.')
      .toFloat()
      .custom(value => value >= 0 && value <= 100).withMessage('Unit Test Average must be between 0 and 100.'),
    body('grades.*.halfYearlyAvg')
      .isNumeric().withMessage('Half-Yearly Average must be a number.')
      .toFloat()
      .custom(value => value >= 0 && value <= 100).withMessage('Half-Yearly Average must be between 0 and 100.'),
    body('grades.*.yearlyAvg')
      .isNumeric().withMessage('Yearly Average must be a number.')
      .toFloat()
      .custom(value => value >= 0 && value <= 100).withMessage('Yearly Average must be between 0 and 100.'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { class: className, grades } = req.body;

    const ops = grades.map((g) => ({
      updateOne: {
        filter: {
          _id: g.studentId,
          role: 'student',
          class: className,
        },
        update: {
          $set: {
            unitTestAvg: g.unitTestAvg,
            halfYearlyAvg: g.halfYearlyAvg,
            yearlyAvg: g.yearlyAvg,
          },
        },
      },
    }));

    const result = await User.bulkWrite(ops, { ordered: false });

    let message = `Bulk grade update process completed.`;
    if (result.modifiedCount > 0) {
      message = `Successfully updated grades for ${result.modifiedCount} student(s).`;
    } else if (result.matchedCount > 0) {
      message = `Matched ${result.matchedCount} student(s), but no grades were changed (they might already be up-to-date).`;
    } else {
      message = `No students found matching the criteria or no grades were updated. Please check student IDs and class name.`;
    }

    res.json({
      message,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount,
    });
  })
);

export default router;
