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
  },

  // ── Semester 7 ──
  {
    id: "sem7-netprog-2025",
    semester: 7,
    subject: "Network Programming",
    subjectCode: "BIT401CO",
    year: 2025,
    totalMarks: 80,
    passMarks: 32,
    timeHours: 3,
    questions: [
      {
        id: "np-25-1",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Illustrate the TCP State Transition Diagram with special emphasis on TIME_WAIT state. Explain why 2MSL wait time is mandatory before socket closure.",
        orQuestionText: "Differentiate between Iterative and Concurrent servers. Write a complete C socket program implementing a concurrent TCP echo server using fork().",
        solutionSummary: "TIME_WAIT ensures trailing FIN/ACK segments are received and old duplicate segments expire in the network. fork() allows parent to listen while child processes client descriptor.",
        chapterRef: "Unit 1 & 3: Introduction & TCP/UDP Protocols"
      },
      {
        id: "np-25-2",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Explain I/O Multiplexing. Compare select(), poll(), and epoll() in terms of algorithmic complexity, file descriptor limits, and kernel buffer overhead.",
        solutionSummary: "select() is O(N) with FD_SETSIZE limit (1024); poll() is O(N) without fixed limit; epoll() uses event-driven epoll_ctl and epoll_wait for O(1) ready notification.",
        chapterRef: "Unit 6: I/O Multiplexing"
      },
      {
        id: "np-25-3",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Explain socket address structures: sockaddr_in (IPv4) versus sockaddr_in6 (IPv6). How does sockaddr provide generic polymorphism in C?",
        solutionSummary: "sockaddr defines generic sa_family_t and 14 bytes char; sockaddr_in casts to sockaddr using sin_family, sin_port, sin_addr.",
        chapterRef: "Unit 4: Elementary Socket Calls"
      },
      {
        id: "np-25-4",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "What are socket options? Explain SO_REUSEADDR, SO_KEEPALIVE, and TCP_NODELAY (Nagle's Algorithm disable).",
        solutionSummary: "SO_REUSEADDR allows instant server restart on ports in TIME_WAIT. TCP_NODELAY disables Nagle's algorithm for interactive real-time payloads.",
        chapterRef: "Unit 7: Socket Options"
      },
      {
        id: "np-25-5",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Explain Unix Domain Sockets (AF_UNIX). Why are they faster than standard loopback TCP (AF_INET 127.0.0.1)?",
        solutionSummary: "AF_UNIX bypasses network stack checksumming, IP header generation, and packet segmentation, passing memory buffers directly in kernel space.",
        chapterRef: "Unit 9: Unix Domain Protocol"
      }
    ]
  },
  {
    id: "sem7-gov-2025",
    semester: 7,
    subject: "Digital Governance",
    subjectCode: "BIT402CO",
    year: 2025,
    totalMarks: 80,
    passMarks: 32,
    timeHours: 3,
    questions: [
      {
        id: "dg-25-1",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Explain the architectural layers of an e-Governance system. Analyze Nepal's Digital Nepal Framework (DNF) across its eight key sectors.",
        solutionSummary: "DNF covers Digital Foundation, Agriculture, Health, Education, Energy, Tourism, Finance, and Urban Infrastructure with enterprise government architecture.",
        chapterRef: "Unit 1: Overview of E-Governance & DNF"
      },
      {
        id: "dg-25-2",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Discuss G2C, G2B, G2G, and G2E service delivery models. How has the Nagarik App transformed citizen service delivery and interoperability?",
        solutionSummary: "Nagarik App integrates PAN, Citizenships, Voter ID, Land ownership, and Vehicle tax via RESTful microservices and National Data Center API gateway.",
        chapterRef: "Unit 2: Models of E-Governance"
      },
      {
        id: "dg-25-3",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Explain Public Key Infrastructure (PKI) and Digital Signatures in the context of Nepal's Electronic Transactions Act (ETA 2063).",
        solutionSummary: "ETA 2063 legalizes asymmetric cryptography (RSA/ECC) with Controller of Certifying Authorities (CCA) issuing root trust certificates.",
        chapterRef: "Unit 5: Legal & Security Frameworks"
      }
    ]
  },
  {
    id: "sem7-ml-2025",
    semester: 7,
    subject: "Machine Learning (Track A)",
    subjectCode: "BIT421CO",
    year: 2025,
    totalMarks: 80,
    passMarks: 32,
    timeHours: 3,
    questions: [
      {
        id: "ml-25-1",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Derive the Cost Function for Linear Regression with Gradient Descent updates. Explain the Bias-Variance Tradeoff with learning curves.",
        solutionSummary: "J(w,b) = 1/(2m) sum(y_hat - y)^2. High bias = underfitting (high train & val error); high variance = overfitting (large train/val gap).",
        chapterRef: "Unit 2: Supervised Learning & Regression"
      },
      {
        id: "ml-25-2",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Explain Support Vector Machines (SVM). How does the Kernel Trick (RBF / Polynomial) enable classification in non-linearly separable spaces?",
        solutionSummary: "SVM maximizes the margin 2/||w||. Kernel functions K(x, z) = phi(x)^T phi(z) compute inner products in infinite-dimensional Hilbert spaces without explicit mapping.",
        chapterRef: "Unit 3: Classification Algorithms"
      },
      {
        id: "ml-25-3",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Differentiate between Bagging (Random Forest) and Boosting (AdaBoost / XGBoost). When is each preferred?",
        solutionSummary: "Bagging trains parallel independent trees on bootstrap samples to reduce variance. Boosting trains sequential trees focusing on residual errors to reduce bias.",
        chapterRef: "Unit 4: Ensemble Learning"
      }
    ]
  }
];

