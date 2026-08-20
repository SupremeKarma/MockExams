export type NodeType = 
  | "country"
  | "board_or_university"
  | "institution"
  | "program"
  | "academic_period"
  | "subject"
  | "topic";

export interface AcademicNode {
  id: string;
  parentId: string | null;
  path: string; // e.g. "nepal.pu.cite.bit"
  nodeType: NodeType;
  code?: string;
  title: string;
  shortTitle: string;
  flag?: string;
  description: string;
  metadata?: Record<string, any>;
  childrenCount?: number;
}

export const academicTaxonomyData: AcademicNode[] = [
  // 1. Countries
  {
    id: "country-np",
    parentId: null,
    path: "nepal",
    nodeType: "country",
    code: "NP",
    title: "Nepal",
    shortTitle: "Nepal",
    flag: "🇳🇵",
    description: "National Universities & High School Boards across Nepal"
  },
  {
    id: "country-in",
    parentId: null,
    path: "india",
    nodeType: "country",
    code: "IN",
    title: "India",
    shortTitle: "India",
    flag: "🇮🇳",
    description: "CBSE, ICSE, JEE, NEET and Central Universities across India"
  },
  {
    id: "country-intl",
    parentId: null,
    path: "international",
    nodeType: "country",
    code: "INTL",
    title: "International / Global",
    shortTitle: "Global",
    flag: "🌍",
    description: "Cambridge CIE, AP CollegeBoard, IB and International Standardized Tests"
  },

  // 2. Universities & Boards in Nepal
  {
    id: "univ-pu",
    parentId: "country-np",
    path: "nepal.pu",
    nodeType: "board_or_university",
    code: "PU",
    title: "Purbanchal University",
    shortTitle: "PU",
    description: "Faculty of Science & Technology, Management and Medical Sciences",
    metadata: { location: "Biratnagar / Kathmandu", website: "puexam.edu.np" }
  },
  {
    id: "univ-tu",
    parentId: "country-np",
    path: "nepal.tu",
    nodeType: "board_or_university",
    code: "TU",
    title: "Tribhuvan University (IOE / IOST)",
    shortTitle: "TU",
    description: "Institute of Engineering (Pulchowk) & Institute of Science and Technology",
    metadata: { location: "Kirtipur / Pulchowk", website: "tu.edu.np" }
  },
  {
    id: "univ-ku",
    parentId: "country-np",
    path: "nepal.ku",
    nodeType: "board_or_university",
    code: "KU",
    title: "Kathmandu University",
    shortTitle: "KU",
    description: "School of Engineering & School of Science",
    metadata: { location: "Dhulikhel", website: "ku.edu.np" }
  },

  // 3. Affiliated Colleges / Campuses (PU)
  {
    id: "inst-cite",
    parentId: "univ-pu",
    path: "nepal.pu.cite",
    nodeType: "institution",
    code: "CITE",
    title: "College of Information Technology & Engineering",
    shortTitle: "CITE",
    description: "Affiliated to Purbanchal University, Tinkune Kathmandu",
    metadata: { campus: "Kathmandu" }
  },
  {
    id: "inst-kcc",
    parentId: "univ-pu",
    path: "nepal.pu.kcc",
    nodeType: "institution",
    code: "KCC",
    title: "Kantipur City College",
    shortTitle: "KCC",
    description: "Affiliated to Purbanchal University, Putalisadak Kathmandu",
    metadata: { campus: "Kathmandu" }
  },

  // 4. Programs / Degrees (PU BIT)
  {
    id: "prog-bit",
    parentId: "univ-pu",
    path: "nepal.pu.bit",
    nodeType: "program",
    code: "BIT",
    title: "Bachelor of Information Technology",
    shortTitle: "BIT",
    description: "4-Year / 8-Semester undergraduate program with 138 credits",
    metadata: { totalSemesters: 8, totalCredits: 138, degreeType: "Undergraduate" }
  },
  {
    id: "prog-csit",
    parentId: "univ-tu",
    path: "nepal.tu.csit",
    nodeType: "program",
    code: "BSc.CSIT",
    title: "B.Sc. Computer Science and Information Technology",
    shortTitle: "BSc.CSIT",
    description: "4-Year / 8-Semester TU IOST degree program",
    metadata: { totalSemesters: 8, totalCredits: 126 }
  },
  {
    id: "prog-cbse12",
    parentId: "country-in",
    path: "india.cbse.grade12",
    nodeType: "program",
    code: "CBSE-12",
    title: "CBSE Class 12 Science Board",
    shortTitle: "Class 12",
    description: "Central Board of Secondary Education Class 12 Physics, Chemistry, Maths & CS",
    metadata: { board: "CBSE" }
  },
  {
    id: "prog-alevels",
    parentId: "country-intl",
    path: "international.cambridge.alevels",
    nodeType: "program",
    code: "A-LEVELS",
    title: "Cambridge International AS & A Levels",
    shortTitle: "A-Levels",
    description: "Cambridge Assessment International Education (CIE) STEM subjects",
    metadata: { board: "Cambridge" }
  }
];

export function getNodeBreadcrumb(nodePath: string): AcademicNode[] {
  const parts = nodePath.split(".");
  const breadcrumbs: AcademicNode[] = [];
  let currentPath = "";

  for (const part of parts) {
    currentPath = currentPath ? `${currentPath}.${part}` : part;
    const found = academicTaxonomyData.find(n => n.path === currentPath);
    if (found) breadcrumbs.push(found);
  }
  return breadcrumbs;
}
