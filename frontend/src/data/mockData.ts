import type { PerformanceStats, Student, Subject, Test } from "@/types";

 

// Mock student data
export const currentStudent: Student = {
  id: "1",
  name: "Alex Johnson",
  grade: "10th Grade",
  avatar: "/placeholder.svg",
  email: "alex.johnson@example.com",
  parentEmail: "parent.johnson@example.com"
};

// Mock subjects
export const subjects: Subject[] = [
  {
    id: "sub1",
    name: "Mathematics",
    type: "math",
    teacher: "Dr. Robert Chen"
  },
  {
    id: "sub2",
    name: "Science",
    type: "science",
    teacher: "Mrs. Emily Watson"
  },
  {
    id: "sub3",
    name: "English Literature",
    type: "english",
    teacher: "Mr. James Miller"
  },
  {
    id: "sub4",
    name: "History",
    type: "history",
    teacher: "Ms. Sarah Adams"
  },
  {
    id: "sub5",
    name: "Art & Design",
    type: "art",
    teacher: "Mrs. Lisa Zhang"
  },
  {
    id: "sub6",
    name: "Geography",
    type: "art",
    teacher: "Mr Pankaj "
  },
  {
    id: "sub7",
    name: "Hindi",
    type: "art",
    teacher: "Mrs. Radha Sharma"
  },
  {
    id: "sub7",
    name: "Sanskrit",
    type: "art",
    teacher: "Mrs. Radha Sharma"
  },
  {
    id: "sub7",
    name: "French",
    type: "art",
    teacher: "Mr Levi"
  },
];

// Mock test data
export const recentTests: Test[] = [
  {
    id: "test1",
    title: "Algebra Mid-term",
    subject: "math",
    date: "2025-05-02",
    maxMarks: 100,
    marks: 85,
    percentile: 88,
    pdfUrl: "#"
  },
  {
    id: "test2",
    title: "Chemistry Practical",
    subject: "science",
    date: "2025-04-28",
    maxMarks: 50,
    marks: 42,
    percentile: 92,
    pdfUrl: "#"
  },
  {
    id: "test3",
    title: "Shakespeare Essay",
    subject: "english",
    date: "2025-04-15",
    maxMarks: 50,
    marks: 38,
    percentile: 78,
    pdfUrl: "#"
  },
  {
    id: "test4",
    title: "World War II Quiz",
    subject: "history",
    date: "2025-04-10",
    maxMarks: 30,
    marks: 24,
    percentile: 86,
    pdfUrl: "#"
  }
];

// Mock performance data
export const performanceStats: PerformanceStats = {
  overall: {
    average: 83,
    trend: 5.2,
    rank: 4
  },
  subjects: [
    {
      subject: "math",
      average: 85,
      tests: 3,
      trend: 8
    },
    {
      subject: "science",
      average: 90,
      tests: 2,
      trend: 5
    },
    {
      subject: "english",
      average: 78,
      tests: 3,
      trend: -2
    },
    {
      subject: "history",
      average: 82,
      tests: 2,
      trend: 4
    },
    {
      subject: "art",
      average: 92,
      tests: 1,
      trend: 0
    }
  ]
};

// Mock historical performance data for charts
export const performanceHistory = [
  { month: "Jan", math: 75, science: 82, english: 70, history: 78, art: 88 },
  { month: "Feb", math: 78, science: 85, english: 68, history: 80, art: 90 },
  { month: "Mar", math: 80, science: 88, english: 72, history: 76, art: 92 },
  { month: "Apr", math: 85, science: 90, english: 78, history: 82, art: 92 }
];

// Activity feed
export const activityFeed = [
  {
    id: "act1",
    type: "test_score",
    subject: "math",
    title: "Algebra Mid-term",
    score: 85,
    date: "2025-05-02T10:30:00"
  },
  {
    id: "act2",
    type: "assignment_submission",
    subject: "english",
    title: "Essay on Macbeth",
    date: "2025-05-01T16:45:00"
  },
  {
    id: "act3",
    type: "teacher_comment",
    subject: "science",
    comment: "Great participation in today's lab experiment.",
    teacher: "Mrs. Emily Watson",
    date: "2025-04-30T14:15:00"
  },
  {
    id: "act4",
    type: "attendance",
    status: "absent",
    date: "2025-04-25T08:30:00",
    reason: "Doctor's appointment"
  },
  {
    id: "act5",
    type: "test_score",
    subject: "science",
    title: "Chemistry Practical",
    score: 42,
    date: "2025-04-28T11:20:00"
  }
];
