export interface LectureItem {
  id: string;
  title: string;
  duration: string;
  hasVideo: boolean;
  isLocked: boolean;
  summary: string;
  keyConcepts: string[];
}

export interface EntranceSubjectModule {
  subjectId: string;
  subjectTitle: string;
  iconName: string;
  colorTheme: "orange" | "blue" | "green" | "purple" | "rose";
  lectureCount: number;
  mcqCount: number;
  lectures: LectureItem[];
}

export interface EntranceCourseProgram {
  id: string;
  title: string;
  slug: string;
  category: "IT & Computing" | "Engineering" | "Medical" | "Management" | "Law";
  badge: string;
  shortDesc: string;
  fullDesc: string;
  subjectsCount: number;
  totalLectures: number;
  totalQuestions: number;
  targetDegrees: string;
  subjects: EntranceSubjectModule[];
}

export const entranceCoursesData: EntranceCourseProgram[] = [
  {
    id: "course-bit-bca",
    title: "BIT & BCA Entrance Masterclass",
    slug: "bit-bca-entrance",
    category: "IT & Computing",
    badge: "Purbanchal & TU Focused",
    shortDesc: "Complete entrance prep program with video lectures, chapter-wise MCQs, and live computer-based test (CBT) simulators.",
    fullDesc: "Tailored for students targeting BIT & BCA admissions across Purbanchal University (PU), Tribhuvan University (TU), and Pokhara University. Covers English, Mathematics, Computer Fundamentals, and General Knowledge.",
    subjectsCount: 4,
    totalLectures: 65,
    totalQuestions: 3500,
    targetDegrees: "BIT · BCA · BE IT",
    subjects: [
      {
        subjectId: "sub-english",
        subjectTitle: "English & Verbal Ability",
        iconName: "BookOpen",
        colorTheme: "orange",
        lectureCount: 9,
        mcqCount: 500,
        lectures: [
          {
            id: "eng-1",
            title: "Sentence Connectives & Conjunctions",
            duration: "24m",
            hasVideo: true,
            isLocked: false,
            summary: "Mastering coordinating, subordinating, and correlative conjunctions in sentence synthesis.",
            keyConcepts: ["Coordinating FANBOYS", "Subordinating Clauses", "Conditional Clauses (Type 0-3)"]
          },
          {
            id: "eng-2",
            title: "Subject-Verb Agreement (Syntax)",
            duration: "32m",
            hasVideo: true,
            isLocked: false,
            summary: "Singular/plural nouns, collective nouns, compound subjects joined by 'either/or' and 'neither/nor'.",
            keyConcepts: ["Rule of Proximity", "Indefinite Pronouns", "Parenthetical Expressions"]
          },
          {
            id: "eng-3",
            title: "Idioms, Phrases & Cloze Test",
            duration: "28m",
            hasVideo: true,
            isLocked: false,
            summary: "High-frequency entrance idioms and contextual paragraph fill-in tests.",
            keyConcepts: ["Root Words & Etymology", "Context Clues", "Prepositional Idioms"]
          }
        ]
      },
      {
        subjectId: "sub-math",
        subjectTitle: "Entrance Mathematics",
        iconName: "Calculator",
        colorTheme: "purple",
        lectureCount: 14,
        mcqCount: 1200,
        lectures: [
          {
            id: "math-1",
            title: "Set Theory & Relations",
            duration: "35m",
            hasVideo: true,
            isLocked: false,
            summary: "Cartesian product, equivalence relations, Venn diagram cardinality formulas.",
            keyConcepts: ["De Morgan's Laws", "Equivalence Classes", "Partition of Sets"]
          },
          {
            id: "math-2",
            title: "Quadratic Equations & Matrices",
            duration: "40m",
            hasVideo: true,
            isLocked: false,
            summary: "Roots of quadratics, discriminant conditions, matrix determinants and Cramers rule.",
            keyConcepts: ["Nature of Roots", "Symmetric Matrix Properties", "Inverse via Adjoint"]
          },
          {
            id: "math-3",
            title: "Limits, Continuity & Derivatives",
            duration: "48m",
            hasVideo: true,
            isLocked: false,
            summary: "L'Hopital's Rule, differentiation formulas, and maxima/minima applications.",
            keyConcepts: ["Standard Limits (sin x / x)", "Chain Rule", "Critical Points"]
          }
        ]
      },
      {
        subjectId: "sub-computer",
        subjectTitle: "Computer & IT Fundamentals",
        iconName: "Cpu",
        colorTheme: "blue",
        lectureCount: 12,
        mcqCount: 950,
        lectures: [
          {
            id: "comp-1",
            title: "Number Systems & Logic Gates",
            duration: "30m",
            hasVideo: true,
            isLocked: false,
            summary: "Binary, octal, hexadecimal conversions, 2's complement arithmetic, Truth tables.",
            keyConcepts: ["Radix Conversions", "Universal NAND/NOR Gates", "Boolean Reduction"]
          },
          {
            id: "comp-2",
            title: "Networking, Web & Cyber Security",
            duration: "38m",
            hasVideo: true,
            isLocked: false,
            summary: "OSI 7 Layers, IP addressing (IPv4 vs IPv6), DNS, SSL/TLS, and encryption.",
            keyConcepts: ["OSI vs TCP/IP", "Subnet Masks", "Public/Private Key Cryptography"]
          }
        ]
      },
      {
        subjectId: "sub-gk",
        subjectTitle: "General Knowledge & Logical IQ",
        iconName: "Zap",
        colorTheme: "green",
        lectureCount: 8,
        mcqCount: 850,
        lectures: [
          {
            id: "gk-1",
            title: "Logical Deductions & Syllogisms",
            duration: "25m",
            hasVideo: true,
            isLocked: false,
            summary: "Statement-conclusion logic, blood relations, direction sense, and series completion.",
            keyConcepts: ["Venn Logic", "Coded Blood Relations", "Alpha-Numeric Sequences"]
          }
        ]
      }
    ]
  },
  {
    id: "course-csit",
    title: "B.Sc. CSIT Entrance Masterclass",
    slug: "bsc-csit-entrance",
    category: "IT & Computing",
    badge: "TU Institute of Science & Tech",
    shortDesc: "Complete TU B.Sc. CSIT preparation with Physics, Chemistry, Mathematics, and English MCQ bank.",
    fullDesc: "Tribhuvan University B.Sc. CSIT Entrance coaching covering 100-mark entrance pattern: Mathematics (25), Physics (25), Chemistry (25), and English (25).",
    subjectsCount: 4,
    totalLectures: 80,
    totalQuestions: 4500,
    targetDegrees: "B.Sc. CSIT · BCA · BIT",
    subjects: [
      {
        subjectId: "csit-physics",
        subjectTitle: "Physics (Mechanics, Optics, Modern Physics)",
        iconName: "Zap",
        colorTheme: "orange",
        lectureCount: 22,
        mcqCount: 1400,
        lectures: [
          {
            id: "phy-1",
            title: "Vectors, Kinematics & Projectile Motion",
            duration: "42m",
            hasVideo: true,
            isLocked: false,
            summary: "Dot and cross products, relative velocity, trajectory equation, and maximum range.",
            keyConcepts: ["Range R = u^2 sin(2θ)/g", "Work-Energy Theorem", "Collision Conservation"]
          }
        ]
      },
      {
        subjectId: "csit-math",
        subjectTitle: "Mathematics (Calculus, Vectors & Coordinate Geometry)",
        iconName: "Calculator",
        colorTheme: "purple",
        lectureCount: 25,
        mcqCount: 1500,
        lectures: [
          {
            id: "cm-1",
            title: "Integration Techniques & Definite Integrals",
            duration: "45m",
            hasVideo: true,
            isLocked: false,
            summary: "Substitution, integration by parts, partial fractions, and definite integral properties.",
            keyConcepts: ["Integration by Parts (ILATE)", "Wallis Formula", "Area Under Curves"]
          }
        ]
      }
    ]
  },
  {
    id: "course-ioe",
    title: "IOE Engineering Entrance Masterclass",
    slug: "ioe-entrance",
    category: "Engineering",
    badge: "IOE Pulchowk Model",
    shortDesc: "Comprehensive coaching for Pulchowk IOE Computer-Based Test (CBT) with 140-mark simulation engine.",
    fullDesc: "Designed for Pulchowk, Thapathali, WRC, and ERC IOE Engineering entrances. Covers 140 marks structure: Math (50), Physics (45), Chemistry (25), English (20).",
    subjectsCount: 4,
    totalLectures: 95,
    totalQuestions: 6000,
    targetDegrees: "B.E. Computer · Civil · Electrical · Electronics",
    subjects: [
      {
        subjectId: "ioe-math",
        subjectTitle: "Engineering Mathematics (50 Marks)",
        iconName: "Calculator",
        colorTheme: "blue",
        lectureCount: 30,
        mcqCount: 2200,
        lectures: [
          {
            id: "im-1",
            title: "Vectors, 3D Geometry & Differential Equations",
            duration: "50m",
            hasVideo: true,
            isLocked: false,
            summary: "Lines in 3D, planes, sphere equations, order/degree of ODEs, and integrating factors.",
            keyConcepts: ["Shortest Distance Between Skew Lines", "Integrating Factor e^∫Pdx", "Direction Cosines"]
          }
        ]
      }
    ]
  },
  {
    id: "course-cee",
    title: "CEE Medical Entrance Masterclass",
    slug: "cee-entrance",
    category: "Medical",
    badge: "MEC Medical 200 Marks",
    shortDesc: "Medical Education Commission (MEC) MBBS, BDS, B.Pharma entrance coaching with 10,000+ MCQs.",
    fullDesc: "Complete coverage of CEE 200-mark syllabus: Zoology (40), Botany (40), Chemistry (50), Physics (50), and Mental Agility Test (MAT 20).",
    subjectsCount: 5,
    totalLectures: 110,
    totalQuestions: 8000,
    targetDegrees: "MBBS · BDS · B.Pharma · B.Sc. Nursing",
    subjects: [
      {
        subjectId: "cee-biology",
        subjectTitle: "Biology (Zoology & Botany 80 Marks)",
        iconName: "BookOpen",
        colorTheme: "rose",
        lectureCount: 45,
        mcqCount: 3500,
        lectures: [
          {
            id: "bio-1",
            title: "Human Physiology & Genetics",
            duration: "48m",
            hasVideo: true,
            isLocked: false,
            summary: "Cardiovascular physiology, neuron transmission, Mendelian inheritance, and DNA replication.",
            keyConcepts: ["Cardiac Cycle Timing", "Resting Membrane Potential", "Dihybrid Cross Ratios (9:3:3:1)"]
          }
        ]
      }
    ]
  },
  {
    id: "course-cmat",
    title: "CMAT & KUUMAT Management Masterclass",
    slug: "cmat-entrance",
    category: "Management",
    badge: "TU BBA / BBS Model",
    shortDesc: "Quantitative Aptitude, Verbal Ability, Logical Reasoning, and General Awareness.",
    fullDesc: "Tribhuvan University CMAT & Kathmandu University KUUMAT entrance coaching for BBA, BIM, BBM, and BBS programs.",
    subjectsCount: 4,
    totalLectures: 50,
    totalQuestions: 3000,
    targetDegrees: "BBA · BIM · BBM · BBS · MBA",
    subjects: [
      {
        subjectId: "cmat-quant",
        subjectTitle: "Quantitative Ability (25 Marks)",
        iconName: "Calculator",
        colorTheme: "green",
        lectureCount: 15,
        mcqCount: 900,
        lectures: [
          {
            id: "cq-1",
            title: "Percentages, Profit & Loss, Simple & Compound Interest",
            duration: "36m",
            hasVideo: true,
            isLocked: false,
            summary: "Speed math techniques, successive percentage changes, and compound interest shortcuts.",
            keyConcepts: ["Fraction to Percentage Conversion", "Effective Discount Formula", "Rule of 72"]
          }
        ]
      }
    ]
  }
];
