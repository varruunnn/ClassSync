// Student types
export interface Student {
    id: string;
    name: string;
    grade: string;
    avatar: string;
    email: string;
    parentEmail: string;
  }
  
  // Subject types
  export type SubjectType = "math" | "science" | "english" | "history" | "art";
  
  export interface Subject {
    id: string;
    name: string;
    type: SubjectType;
    teacher: string;
  }
  
  // Test types
  export interface Test {
    id: string;
    title: string;
    subject: SubjectType;
    date: string;
    maxMarks: number;
    marks: number;
    percentile: number;
    pdfUrl: string;
  }
  
  // Performance types
  export interface SubjectPerformance {
    subject: SubjectType;
    average: number;
    tests: number;
    trend: number; // Positive for improvement, negative for decline
  }
  
  export interface PerformanceStats {
    overall: {
      average: number;
      trend: number;
      rank: number;
    };
    subjects: SubjectPerformance[];
  }
  