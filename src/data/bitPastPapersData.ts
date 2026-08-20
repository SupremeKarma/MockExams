export interface PastPaperQuestion {
  id: string;
  group: string;
  marks: number;
  questionText: string;
  orQuestionText?: string;
  solutionSummary: string;
  chapterRef: string;
}

export interface FullPastPaper {
  id: string;
  semester: number;
  subject: string;
  subjectCode: string;
  year: number;
  totalMarks: number;
  passMarks: number;
  timeHours: number;
  questions: PastPaperQuestion[];
}

export const bitPastPapersData: FullPastPaper[] = [
  // ── Semester 1 ──
  {
    id: "sem1-c-2024",
    semester: 1,
    subject: "Programming in C",
    subjectCode: "BIT105",
    year: 2024,
    totalMarks: 80,
    passMarks: 32,
    timeHours: 3,
    questions: [
      {
        id: "c-24-1",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "What is dynamic memory allocation? Differentiate between malloc(), calloc(), realloc(), and free() with memory layout diagrams and code snippets.",
        orQuestionText: "Explain pointers and pointer arithmetic in C. Write a program to sort an array of integers using pointers.",
        solutionSummary: "malloc allocates uninitialized heap memory; calloc zero-initializes contiguous blocks. realloc resizes existing allocations. free returns memory to avoid leaks.",
        chapterRef: "Unit 6: Pointers & Dynamic Memory"
      },
      {
        id: "c-24-2",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Explain recursion with an example. Write a recursive C program to solve the Tower of Hanoi problem for N disks.",
        solutionSummary: "Recursive base condition halts stack execution. Time complexity T(n) = 2^n - 1 moves.",
        chapterRef: "Unit 5: Functions & Recursion"
      },
      {
        id: "c-24-3",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Differentiate between Structures and Unions with memory alignment examples.",
        solutionSummary: "Structures allocate distinct memory for all members. Unions share a single memory block sized to the largest member.",
        chapterRef: "Unit 7: Structures & Unions"
      },
      {
        id: "c-24-4",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Explain file handling modes 'r', 'w', 'a', 'rb', and 'wb' in C with error handling using feof() and ferror().",
        solutionSummary: "fopen() returns FILE pointer; fopen fails return NULL; fclose flushes buffer.",
        chapterRef: "Unit 8: File Management"
      }
    ]
  },
  {
    id: "sem1-fit-2024",
    semester: 1,
    subject: "Fundamentals of IT",
    subjectCode: "BIT101",
    year: 2024,
    totalMarks: 80,
    passMarks: 32,
    timeHours: 3,
    questions: [
      {
        id: "fit-24-1",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Describe the Von Neumann computer architecture. Explain the role of ALU, Control Unit, and the Fetch-Decode-Execute instruction cycle.",
        solutionSummary: "Stored-program concept where instructions and data share unified memory bus. CPU registers PC, MAR, MDR, IR govern execution.",
        chapterRef: "Unit 1: Computer Architecture & Organization"
      },
      {
        id: "fit-24-2",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Perform number conversions: (a) (347.625)10 to Octal (b) (AF2.C)16 to Binary and Decimal.",
        solutionSummary: "Successive division/multiplication by 8 for decimal-to-octal. 4-bit nibble grouping for hexadecimal-to-binary.",
        chapterRef: "Unit 2: Number Systems & Boolean Logic"
      },
      {
        id: "fit-24-3",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "What is an Operating System? Differentiate between Preemptive and Non-Preemptive CPU scheduling algorithms.",
        solutionSummary: "OS manages hardware resources. Preemptive (Round Robin, SRTF) interrupts running processes; Non-preemptive (FCFS, SJF) executes until completion.",
        chapterRef: "Unit 3: Operating Systems Fundamentals"
      }
    ]
  },
  {
    id: "sem1-math-2024",
    semester: 1,
    subject: "Mathematics-I",
    subjectCode: "BIT102",
    year: 2024,
    totalMarks: 80,
    passMarks: 32,
    timeHours: 3,
    questions: [
      {
        id: "m1-24-1",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "State and prove Rolle's Theorem and Lagrange's Mean Value Theorem. Verify LMVT for f(x) = x^3 - 5x^2 - 3x in [1, 3].",
        solutionSummary: "Continuous on [a,b], differentiable on (a,b). There exists c in (a,b) where f'(c) = [f(b)-f(a)]/(b-a).",
        chapterRef: "Unit 2: Differential Calculus & Theorems"
      },
      {
        id: "m1-24-2",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Evaluate the indeterminate limit: lim(x->0) (e^x - e^(-x) - 2x) / (x - sin x) using L'Hopital's Rule.",
        solutionSummary: "Applying L'Hopital's rule twice yields 2.",
        chapterRef: "Unit 1: Limits & Continuity"
      }
    ]
  },
  {
    id: "sem1-techcomm-2024",
    semester: 1,
    subject: "Technical Communication",
    subjectCode: "BIT103",
    year: 2024,
    totalMarks: 80,
    passMarks: 32,
    timeHours: 3,
    questions: [
      {
        id: "tc-24-1",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Draft a formal technical proposal for implementing an AI-Powered Spaced Repetition Mock Exam System for Purbanchal University colleges.",
        solutionSummary: "Includes Executive Summary, Problem Statement, Technical Architecture, Milestones, Budget, and Deliverables.",
        chapterRef: "Unit 4: Formal Proposals & Reports"
      }
    ]
  },
  {
    id: "sem1-ethics-2024",
    semester: 1,
    subject: "Society and Ethics in IT",
    subjectCode: "BIT104",
    year: 2024,
    totalMarks: 80,
    passMarks: 32,
    timeHours: 3,
    questions: [
      {
        id: "se-24-1",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Analyze Nepal's Electronic Transactions Act (ETA 2063). Discuss cyber crimes, digital signatures, and intellectual property rights.",
        solutionSummary: "Legal recognition of electronic records, cyber crime penalties under Sections 44-59.",
        chapterRef: "Unit 3: Cyber Law & ETA 2063"
      }
    ]
  },

  // ── Semester 2 ──
  {
    id: "sem2-dsa-2024",
    semester: 2,
    subject: "Data Structures & Algorithms",
    subjectCode: "BIT201",
    year: 2024,
    totalMarks: 80,
    passMarks: 32,
    timeHours: 3,
    questions: [
      {
        id: "dsa-24-1",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "What is an AVL Tree? Explain balance factors and demonstrate LL, RR, LR, and RL rotation cases with step-by-step tree insertion diagrams.",
        solutionSummary: "Self-balancing BST where height difference of subtrees is at most 1. Guarantees O(log n) lookup, insert, and delete.",
        chapterRef: "Unit 4: Trees & Balanced Search Trees"
      },
      {
        id: "dsa-24-2",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Explain Dijkstra's Single Source Shortest Path algorithm. Trace the algorithm on a weighted directed graph of 6 vertices.",
        solutionSummary: "Greedy algorithm using min-priority queue. Time complexity O((V + E) log V).",
        chapterRef: "Unit 6: Graph Algorithms"
      },
      {
        id: "dsa-24-3",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Write a complete C implementation of Circular Queue with enqueue() and dequeue() operations handling full and empty conditions.",
        solutionSummary: "Circular queue utilizes modulo arithmetic (rear + 1) % MAX to prevent memory wastage.",
        chapterRef: "Unit 2: Linear Data Structures"
      }
    ]
  },
  {
    id: "sem2-oop-2024",
    semester: 2,
    subject: "Object Oriented Programming in C++",
    subjectCode: "BIT202",
    year: 2024,
    totalMarks: 80,
    passMarks: 32,
    timeHours: 3,
    questions: [
      {
        id: "oop-24-1",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Explain runtime polymorphism in C++ using virtual functions and pure virtual functions (abstract classes). Draw the vtable structure.",
        solutionSummary: "Virtual function table (vptr/vtable) enables dynamic dispatch at runtime.",
        chapterRef: "Unit 5: Polymorphism & Virtual Tables"
      }
    ]
  },

  // ── Semester 3 ──
  {
    id: "sem3-dbms-2024",
    semester: 3,
    subject: "Database Management Systems",
    subjectCode: "BIT301",
    year: 2024,
    totalMarks: 80,
    passMarks: 32,
    timeHours: 3,
    questions: [
      {
        id: "dbms-24-1",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Explain Normalization. Differentiate between 1NF, 2NF, 3NF, and BCNF with functional dependency examples and decomposition rules.",
        solutionSummary: "1NF eliminates repeating groups; 2NF eliminates partial dependencies; 3NF eliminates transitive dependencies; BCNF requires determinants to be superkeys.",
        chapterRef: "Unit 4: Relational Database Design & Normalization"
      },
      {
        id: "dbms-24-2",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Explain ACID properties of transactions. Discuss concurrency control protocols: Two-Phase Locking (2PL) and Strict 2PL.",
        solutionSummary: "Atomicity, Consistency, Isolation, Durability. 2PL growing phase acquires locks; shrinking phase releases locks.",
        chapterRef: "Unit 6: Transaction Management & Concurrency"
      }
    ]
  },

  // ── Semester 4 ──
  {
    id: "sem4-os-2024",
    semester: 4,
    subject: "Operating Systems",
    subjectCode: "BIT401",
    year: 2024,
    totalMarks: 80,
    passMarks: 32,
    timeHours: 3,
    questions: [
      {
        id: "os-24-1",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Explain Deadlocks. Detail the 4 necessary Coffman conditions and demonstrate Banker's Algorithm for deadlock avoidance with an allocation matrix.",
        solutionSummary: "Mutual exclusion, hold and wait, no preemption, circular wait. Banker's checks if available resources satisfy Need <= Available.",
        chapterRef: "Unit 4: Deadlocks & Resource Allocation"
      }
    ]
  },

  // ── Semester 5 ──
  {
    id: "sem5-ai-2024",
    semester: 5,
    subject: "Artificial Intelligence",
    subjectCode: "BIT501",
    year: 2024,
    totalMarks: 80,
    passMarks: 32,
    timeHours: 3,
    questions: [
      {
        id: "ai-24-1",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Explain A* Search Algorithm. Prove that A* is admissible when heuristic h(n) is admissible (underestimates actual cost).",
        solutionSummary: "Evaluation function f(n) = g(n) + h(n). Admissibility h(n) <= h*(n) guarantees optimal path.",
        chapterRef: "Unit 2: Heuristic Search Strategies"
      }
    ]
  },

  // ── Semester 6 ──
  {
    id: "sem6-cn-2024",
    semester: 6,
    subject: "Computer Networks",
    subjectCode: "BIT601",
    year: 2024,
    totalMarks: 80,
    passMarks: 32,
    timeHours: 3,
    questions: [
      {
        id: "cn-24-1",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Compare OSI 7 Layer reference model with TCP/IP protocol suite. Detail TCP 3-Way Handshake, Flow Control (Sliding Window), and Congestion Control.",
        solutionSummary: "SYN -> SYN-ACK -> ACK. Sliding window optimizes throughput. AIMD (Additive Increase Multiplicative Decrease) handles congestion.",
        chapterRef: "Unit 4: Transport Layer & TCP Mechanisms"
      }
    ]
  }
];
