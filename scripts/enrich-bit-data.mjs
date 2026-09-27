import fs from 'fs';
import path from 'path';
import { year4Data } from './year4Data.mjs';

const jsonPath = path.resolve('src/data/bitSyllabus.json');
const tsPath = path.resolve('src/data/bitSyllabusData.ts');

const syllabusArray = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

let enrichedCount = 0;
for (const sem of syllabusArray) {
  if (sem.semester === 7 || sem.semester === 8) {
    for (const sub of sem.subjects) {
      const year4 = year4Data[sub.code];
      if (year4) {
        if (year4.syllabusUnits && year4.syllabusUnits.length > 0) {
          sub.syllabusUnits = year4.syllabusUnits;
        }
        if (year4.labWork && year4.labWork.length > 0) {
          sub.labWork = year4.labWork;
        }
        if (year4.referenceBooks && year4.referenceBooks.length > 0) {
          sub.referenceBooks = year4.referenceBooks;
        }
        enrichedCount++;
      }
    }
  }
}

console.log(`Enriched ${enrichedCount} subjects in Year IV (Semesters 7 & 8).`);

// Save updated JSON
fs.writeFileSync(jsonPath, JSON.stringify(syllabusArray, null, 2), 'utf8');
console.log('Saved src/data/bitSyllabus.json');

// Generate TypeScript source
const tsContent = `export interface SubjectInfo {
  code: string;
  name: string;
  credits: number;
  type: "Core" | "Elective" | "Project / Practical";
  description: string;
  keyUnits: string[];
  syllabusUnits?: Array<{ title: string; teachingHours: number; subtopics: string[] }>;
  labWork?: string[];
  referenceBooks?: string[];
}

export interface SemesterSyllabus {
  semester: number;
  totalCredits: number;
  subjects: SubjectInfo[];
}

export const bitSyllabusData: SemesterSyllabus[] = ${JSON.stringify(syllabusArray, null, 2)};
`;

fs.writeFileSync(tsPath, tsContent, 'utf8');
console.log('Saved src/data/bitSyllabusData.ts');
