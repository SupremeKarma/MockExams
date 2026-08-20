/**
 * BIT Semester Notes Database
 */

export interface CodeExample {
  language: string;
  title: string;
  code: string;
  explanation: string;
}

export interface Topic {
  id: string;
  name: string;
  importance: 'Very High' | 'High' | 'Medium' | 'Low';
  keyPoints: string[];
  theory: string;
  codeExamples: CodeExample[];
  commonExamQuestions: string[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  creditHours: number;
  topics: Topic[];
}

// Semester 1: C Programming Topics
export const sem1Data = [
  {
    number: 1,
    subjects: [
      {
        id: 'c_prog',
        name: 'C Programming',
        code: 'BIT101',
        creditHours: 3,
        topics: [
          {
            id: 'c_basics',
            name: 'C Fundamentals',
            importance: 'Very High',
            keyPoints: ['Data types', 'Variables', 'Operators', 'I/O', 'Type casting'],
            theory: 'Foundation of C programming',
            codeExamples: [],
            commonExamQuestions: ['What are data types?', 'Operator precedence?']
          }
        ]
      }
    ]
  }
];

export function getAllTopics() {
  return sem1Data;
}
