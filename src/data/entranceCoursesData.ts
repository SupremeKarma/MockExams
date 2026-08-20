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
  colorTheme: "orange" | "blue" | "green" | "purple";
  lectureCount: number;
  mcqCount: number;
  lectures: LectureItem[];
}

export interface EntranceCourseProgram {
  id: string;
  title: string;
  slug: string;
  badge: string;
  shortDesc: string;
  fullDesc: string;
  subjectsCount: number;
  totalLectures: number;
  totalQuestions: number;
  subjects: EntranceSubjectModule[];
}

export const entranceCoursesData: EntranceCourseProgram[] = [
  {
    id: "course-bit-entrance",
    title: "BIT Entrance Preparation Masterclass",
    slug: "bit-entrance",
    badge: "Most Popular Entrance",
    shortDesc: "Complete structured entrance preparation program with subject-wise video lectures, formula sheets, and live timed mock test simulators.",
    fullDesc: "Designed in alignment with Purbanchal University, Tribhuvan University, and Pokhara University entrance examination patterns. Covers comprehensive syllabus units across English, Mathematics, Computer/IT Fundamentals, and General Knowledge.",
    subjectsCount: 4,
    totalLectures: 65,
    totalQuestions: 2500,
    subjects: [
      {
        subjectId: "sub-english",
        subjectTitle: "English Language & Verbal Reasoning",
        iconName: "BookOpen",
        colorTheme: "orange",
        lectureCount: 9,
        mcqCount: 450,
        lectures: [
          {
            id: "eng-1",
            title: "Sentence Connectives & Conjunctions",
            duration: "24m",
            hasVideo: true,
            isLocked: false,
            summary: "Mastering coordinating, subordinating, and correlative conjunctions in sentence synthesis.",
            keyConcepts: ["Coordinating conjunctions (FANBOYS)", "Subordinating causal and temporal connectives", "Correlative pairs (neither..nor, not only..but also)"]
          },
          {
            id: "eng-2",
            title: "Prepositions & Phrasal Idioms",
            duration: "32m",
            hasVideo: true,
            isLocked: false,
            summary: "Essential rules of time, place, direction prepositions and frequent phrasal verbs in entrance exams.",
            keyConcepts: ["Prepositions of place (at, in, on)", "Prepositions of time vs duration (since, for)", "Dependent prepositions after verbs and adjectives"]
          },
          {
            id: "eng-3",
            title: "Subject-Verb Agreement Rules",
            duration: "28m",
            hasVideo: true,
            isLocked: false,
            summary: "Crucial grammatical concordance rules, collective nouns, and compound subjects.",
            keyConcepts: ["Singular indefinite pronouns (each, every, neither)", "Intervening phrases (along with, as well as)", "Inverted sentence structures"]
          },
          {
            id: "eng-4",
            title: "Tenses & Conditional Clauses",
            duration: "30m",
            hasVideo: true,
            isLocked: false,
            summary: "Verb aspects and zero, first, second, third, and mixed conditional structures.",
            keyConcepts: ["Present perfect vs Past simple distinctions", "Hypothetical unreal past (If + had + V3, would have + V3)", "Sequence of tenses in reported speech"]
          },
          {
            id: "eng-5",
            title: "Synonyms, Antonyms & Contextual Vocabulary",
            duration: "35m",
            hasVideo: true,
            isLocked: false,
            summary: "High-frequency entrance exam vocabulary with Greek/Latin root word analysis.",
            keyConcepts: ["Root words, prefixes and suffixes", "Contextual clue decoding", "Elimination strategies in MCQ vocabulary"]
          }
        ]
      },
      {
        subjectId: "sub-it-comp",
        subjectTitle: "IT & Computer Fundamentals",
        iconName: "Cpu",
        colorTheme: "blue",
        lectureCount: 10,
        mcqCount: 600,
        lectures: [
          {
            id: "it-1",
            title: "Computer Generations & Microprocessor Architecture",
            duration: "26m",
            hasVideo: true,
            isLocked: false,
            summary: "Evolution of vacuum tubes, transistors, ICs, VLSI, and modern multi-core CPUs.",
            keyConcepts: ["Moore's Law and silicon scaling", "Von Neumann vs Harvard architecture", "ALU, Control Unit, and Instruction Cycle"]
          },
          {
            id: "it-2",
            title: "Number Systems & Binary Logic Arithmetic",
            duration: "34m",
            hasVideo: true,
            isLocked: false,
            summary: "Conversion between decimal, binary, octal, hex, and 1's/2's complement calculations.",
            keyConcepts: ["Base conversions with fractional values", "2's complement subtraction & overflow detection", "ASCII and Unicode encoding schemes"]
          },
          {
            id: "it-3",
            title: "Computer Networks, Topologies & OSI Layers",
            duration: "38m",
            hasVideo: true,
            isLocked: false,
            summary: "7 layers of OSI model, IPv4 classes, subnetting, TCP/IP vs UDP protocols.",
            keyConcepts: ["Packet encapsulation across OSI layers", "MAC address vs IP address", "Routing protocols and port numbers"]
          },
          {
            id: "it-4",
            title: "Database Management & SQL Fundamentals",
            duration: "31m",
            hasVideo: true,
            isLocked: false,
            summary: "Relational database concepts, primary keys, foreign keys, normalization, and basic SQL.",
            keyConcepts: ["Entity-Relationship (ER) model", "DDL vs DML statements", "ACID transaction guarantees"]
          },
          {
            id: "it-5",
            title: "Operating Systems, Process & Memory Management",
            duration: "29m",
            hasVideo: true,
            isLocked: false,
            summary: "Process scheduling, context switching, paging, and virtual memory.",
            keyConcepts: ["Process vs Thread", "Deadlock conditions and prevention", "Cache memory hierarchy"]
          }
        ]
      },
      {
        subjectId: "sub-maths",
        subjectTitle: "Mathematics & Quantitative Aptitude",
        iconName: "Calculator",
        colorTheme: "purple",
        lectureCount: 13,
        mcqCount: 850,
        lectures: [
          {
            id: "math-1",
            title: "Matrices, Determinants & System of Equations",
            duration: "40m",
            hasVideo: true,
            isLocked: false,
            summary: "Matrix multiplication properties, adjoint, inverse, and Cramer's rule shortcuts.",
            keyConcepts: ["Properties of determinants without expansion", "Matrix invertibility criteria (|A| != 0)", "Rank of matrix and homogeneous systems"]
          },
          {
            id: "math-2",
            title: "Trigonometric Functions & Inverses",
            duration: "36m",
            hasVideo: true,
            isLocked: false,
            summary: "Trigonometric identities, transformation formulas, and principal value branches of inverse functions.",
            keyConcepts: ["Compound angle and multiple angle formulas", "Inverse trigonometric domain & range limits", "General solutions of trigonometric equations"]
          },
          {
            id: "math-3",
            title: "Complex Numbers & De Moivre's Theorem",
            duration: "30m",
            hasVideo: true,
            isLocked: false,
            summary: "Modulus, argument, polar representation, Euler's formula, and roots of unity.",
            keyConcepts: ["Argand plane representation", "Cube roots of unity (1, ω, ω²)", "Triangle inequality for complex moduli"]
          },
          {
            id: "math-4",
            title: "Differential Calculus & Rate of Change",
            duration: "45m",
            hasVideo: true,
            isLocked: false,
            summary: "Standard derivatives, product/quotient/chain rules, tangent/normal, and maxima/minima.",
            keyConcepts: ["L'Hôpital's rule for indeterminate limits", "First and second derivative tests", "Rolle's and Lagrange's Mean Value Theorems"]
          },
          {
            id: "math-5",
            title: "Integral Calculus & Definite Integrals",
            duration: "48m",
            hasVideo: true,
            isLocked: false,
            summary: "Substitution techniques, integration by parts, definite integral symmetry properties, and area bounded by curves.",
            keyConcepts: ["Definite integral property ∫₀ᵃ f(x)dx = ∫₀ᵃ f(a-x)dx", "Integration by parts formula", "Area enclosed between parabolas and lines"]
          }
        ]
      },
      {
        subjectId: "sub-physics",
        subjectTitle: "Physics & Analytical Aptitude",
        iconName: "Zap",
        colorTheme: "green",
        lectureCount: 12,
        mcqCount: 600,
        lectures: [
          {
            id: "phy-1",
            title: "Mechanics, Vectors & Kinematics",
            duration: "35m",
            hasVideo: true,
            isLocked: false,
            summary: "Equations of motion, projectile motion formulas, dot/cross products, and Newton's laws.",
            keyConcepts: ["Trajectory, maximum height, and horizontal range of projectile", "Conservation of linear momentum", "Frictional forces and banking of roads"]
          },
          {
            id: "phy-2",
            title: "Work, Energy, Power & Circular Motion",
            duration: "32m",
            hasVideo: true,
            isLocked: false,
            summary: "Work-Energy theorem, conservative forces, centripetal acceleration, and vertical circle motion.",
            keyConcepts: ["Work done by variable forces", "Kinetic energy and potential energy transitions", "Tension in vertical circular loop"]
          },
          {
            id: "phy-3",
            title: "Electrostatics, Capacitors & Current Electricity",
            duration: "42m",
            hasVideo: true,
            isLocked: false,
            summary: "Coulomb's law, electric flux, Gauss's theorem, capacitor dielectric combinations, and Kirchhoff's circuit laws.",
            keyConcepts: ["Electric potential vs Electric field intensity", "Energy stored in charged capacitor (1/2 CV²)", "Wheatstone bridge balanced condition"]
          }
        ]
      }
    ]
  }
];
