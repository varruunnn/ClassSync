import express from "express";
import protect from "../middlewares/auth.js";
import {
  getCurrentStudent,
  getSubjects,
  getRecentTests,
  getPerformanceStats,
  getActivityFeed,
  getAllMockData,
} from "../controllers/dataController.js";

const router = express.Router();

router.get("/currentStudent", protect, getCurrentStudent);
router.get("/subjects", protect, getSubjects);
router.get("/recentTests", protect, getRecentTests);
router.get("/performance", protect, getPerformanceStats);
router.get("/activity", protect, getActivityFeed);

router.get("/allData", protect, getAllMockData);

export default router;
