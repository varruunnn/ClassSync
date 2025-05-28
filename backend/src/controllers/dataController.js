import {
  currentStudent,
  subjects,
  recentTests,
  performanceStats,
  performanceHistory,
  activityFeed,
} from "../utils/mockData.js";

export const getCurrentStudent = (req, res) => {
  return res.json({ currentStudent });
};

export const getSubjects = (req, res) => {
  return res.json({ subjects });
};

export const getRecentTests = (req, res) => {
  return res.json({ recentTests });
};

export const getPerformanceStats = (req, res) => {
  return res.json({ performanceStats, performanceHistory });
};

export const getActivityFeed = (req, res) => {
  return res.json({ activityFeed });
};
export const getAllMockData = (req, res) => {
  return res.json({
    currentStudent,
    subjects,
    recentTests,
    performanceStats,
    performanceHistory,
    activityFeed,
  });
};
