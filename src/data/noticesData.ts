export interface NoticeItem {
  id: string;
  day: string;
  monYear: string;
  title: string;
  venue: string;
  category: "Result" | "Exam Routine" | "Grand Mock" | "Syllabus";
  publishedDate: string;
  hasPdf: boolean;
  badge: string;
  summary: string;
  details: string[];
  topRankers?: {
    rank: number;
    name: string;
    score: string;
    college: string;
  }[];
}

export const noticesData: NoticeItem[] = [
  {
    id: "notice-gmt-21",
    day: "13",
    monYear: "Aug 2026",
    title: "Saral Pathshala Presents BIT & BCA Grand Mock Test- XXI Result (Physical) 2083 Batch",
    venue: "Saral Pathshala, Bagbazar, Kathmandu",
    category: "Grand Mock",
    publishedDate: "13 Aug 2026",
    hasPdf: true,
    badge: "Official Merit List",
    summary: "Mock Test – XXI Result (Physical & Online) | 2083 Batch. Saral Pathshala proudly announces the published merit ranking with question-by-question answer keys and percentile scores.",
    details: [
      "Total Candidates Evaluated: 1,420 aspirants",
      "Highest Score Achieved: 94/100 (B.Sc. CSIT Category)",
      "Class Median Score: 68.5/100",
      "Official Physical Merit Paper published at Bagbazar Reception"
    ],
    topRankers: [
      { rank: 1, name: "Aarav Sharma", score: "94/100 (99.8th %ile)", college: "St. Xavier's College" },
      { rank: 2, name: "Prashant Karki", score: "92/100 (99.4th %ile)", college: "Prasadi Academy" },
      { rank: 3, name: "Shreya Thapa", score: "90/100 (98.9th %ile)", college: "Trinity International" }
    ]
  },
  {
    id: "notice-gmt-20",
    day: "06",
    monYear: "Aug 2026",
    title: "Saral Pathshala Grand Mock Test- XX Result (Physical) 2083 Batch",
    venue: "Mid-Valley International College, Kathmandu",
    category: "Grand Mock",
    publishedDate: "06 Aug 2026",
    hasPdf: true,
    badge: "Official Merit List",
    summary: "Mock Test – XX Result (Physical) | 2083 Batch conducted across IOE Engineering (140 marks) and BIT/BCA full-syllabus patterns.",
    details: [
      "Total Candidates Evaluated: 1,280 aspirants",
      "Highest Score: 131/140 (IOE Pulchowk Model)",
      "Physics & Mathematics section difficulty analysis published"
    ],
    topRankers: [
      { rank: 1, name: "Bibek Poudel", score: "131/140 (99.9th %ile)", college: "KMC Lalitpur" },
      { rank: 2, name: "Rohan Basnet", score: "128/140 (99.6th %ile)", college: "CCRC Koteshwor" }
    ]
  },
  {
    id: "notice-gmt-19",
    day: "02",
    monYear: "Aug 2026",
    title: "Saral Pathshala Presents Mock Test- XIX Result (Physical) 2083 Batch",
    venue: "Model College of Engineering, Law and Management",
    category: "Grand Mock",
    publishedDate: "02 Aug 2026",
    hasPdf: true,
    badge: "Official Merit List",
    summary: "Mock Test – XIX Result (Physical) | 2083 Batch. Complete ranking table with sectional marks for Biology, Chemistry, Physics, and Math.",
    details: [
      "Total Candidates: 1,150 students",
      "CEE Medical and CSIT combined ranking published"
    ]
  },
  {
    id: "notice-gmt-17",
    day: "30",
    monYear: "Jul 2026",
    title: "Saral Pathshala Presents Mock Test- XVII Result (Physical) 2083 Batch",
    venue: "Nepal Kasthmandap College, Kalanki",
    category: "Grand Mock",
    publishedDate: "30 Jul 2026",
    hasPdf: true,
    badge: "Official Merit List",
    summary: "Mock Test – XVII Result (Physical) | 2083 Batch. Saral Pathshala proudly announces top percentile scorers with answer explanations.",
    details: [
      "Total Candidates: 980 students",
      "Mathematics Section Topper Score: 48/50"
    ]
  },
  {
    id: "notice-gmt-16",
    day: "26",
    monYear: "Jul 2026",
    title: "Mock Test- XVI Result (Physical) Published",
    venue: "Xavier College of Interdisciplinary Studies",
    category: "Result",
    publishedDate: "26 Jul 2026",
    hasPdf: true,
    badge: "Official Merit List",
    summary: "Mock Test – XVI Result (Physical) | 2083 Batch. Verification of marks and grievance filing open till 28th July.",
    details: [
      "Evaluation Scheme: Negative marking 0.25 applied",
      "Rank list posted at college notice board and portal"
    ]
  },
  {
    id: "notice-gmt-15",
    day: "22",
    monYear: "Jul 2026",
    title: "Saral Pathshala Presents Mock Test- XV Result (Physical) 2083 Batch",
    venue: "Aryan School of Engineering & Management",
    category: "Grand Mock",
    publishedDate: "22 Jul 2026",
    hasPdf: true,
    badge: "Official Merit List",
    summary: "Mock Test – XV Result (Physical) | 2083 Batch. Full candidate scorecard and individual breakdown available.",
    details: [
      "Total Candidates: 1,020 students",
      "Average Score: 64.2/100"
    ]
  },
  {
    id: "notice-gmt-14",
    day: "18",
    monYear: "Jul 2026",
    title: "Result Published Mock Test XIV (Physical & Online) 2083 Batch",
    venue: "Saral Pathshala Main Hall, Bagbazar",
    category: "Result",
    publishedDate: "18 Jul 2026",
    hasPdf: true,
    badge: "Official Merit List",
    summary: "Saral Pathshala Presents Mock Test- XIV Result (Physical) 2083 Batch across CMAT, BCA, and CSIT categories.",
    details: [
      "Top 10 merit scholarship winners awarded fee waivers",
      "Answer key PDF attachment available for download"
    ]
  }
];
