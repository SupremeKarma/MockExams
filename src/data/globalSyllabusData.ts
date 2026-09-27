/**
 * Global Academic Syllabus Repository & Catalog
 *
 * Grounded curricula benchmarked against:
 *  - Tribhuvan University (TU) Institute of Science and Technology (B.Sc. CSIT)
 *  - Cambridge Assessment International Education (CAIE A-Levels: 9618, 9709, 9702)
 *  - ACM / IEEE-CS / AAAI Joint Computing Curricula (CS2023 & CC2020)
 *  - US College Board Advanced Placement (AP Computer Science A, AP Calculus BC, AP Physics C)
 *  - GATE (Graduate Aptitude Test in Engineering, Computer Science & IT)
 */

export interface GlobalCourseUnit {
  unitId: string;
  title: string;
  teachingHours?: number;
  subtopics: string[];
}

export interface GlobalCourse {
  code: string;
  name: string;
  programId: string;
  programName: string;
  level: "Pre-University" | "Undergraduate" | "Graduate / Competitive";
  category: "Computer Science" | "Mathematics" | "Physics" | "Software Engineering" | "Artificial Intelligence";
  credits: number;
  semester?: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  learningOutcomes: string[];
  prerequisites: string[];
  syllabusUnits: GlobalCourseUnit[];
}

export interface GlobalProgram {
  id: string;
  name: string;
  organization: string;
  country: string;
  flag: string;
  level: string;
  description: string;
  totalCourses: number;
}

export const globalPrograms: GlobalProgram[] = [
  {
    id: "TU_CSIT",
    name: "B.Sc. Computer Science and Information Technology",
    organization: "Tribhuvan University (IOST)",
    country: "Nepal",
    flag: "🇳🇵",
    level: "Undergraduate (4 Years / 8 Semesters)",
    description: "The flagship computer science program in Nepal combining rigorous computing theory, algorithms, systems programming, and modern software development.",
    totalCourses: 16,
  },
  {
    id: "CAMBRIDGE_A_LEVELS",
    name: "Cambridge International AS & A Level",
    organization: "Cambridge Assessment International Education (CAIE)",
    country: "International (UK / Global)",
    flag: "🇬🇧",
    level: "Pre-University / Advanced Secondary",
    description: "The premier global gold standard for university entrance, emphasizing deep analytical problem-solving and rigorous theory across STEM disciplines.",
    totalCourses: 3,
  },
  {
    id: "ACM_CS2023",
    name: "ACM / IEEE-CS Global Standard Computer Science",
    organization: "Association for Computing Machinery & IEEE Computer Society",
    country: "Global Standard",
    flag: "🌍",
    level: "Undergraduate Core Curricula",
    description: "The international benchmark curriculum defining core foundational competencies required of software engineers and computer scientists worldwide.",
    totalCourses: 6,
  },
  {
    id: "US_AP",
    name: "College Board Advanced Placement (AP STEM)",
    organization: "The College Board (USA)",
    country: "United States / Global",
    flag: "🇺🇸",
    level: "High School Advanced / College Equivalent",
    description: "Rigorous college-level curricula and examinations allowing secondary students to earn university placement and credit in STEM fields.",
    totalCourses: 3,
  },
  {
    id: "GATE_CS",
    name: "GATE Computer Science & Information Technology",
    organization: "Indian Institute of Science (IISc) & IITs",
    country: "India",
    flag: "🇮🇳",
    level: "Graduate / Competitive Engineering",
    description: "Comprehensive national examination testing deep theoretical foundations of Computer Science and engineering problem-solving.",
    totalCourses: 5,
  },
];

export const globalSyllabusCourses: GlobalCourse[] = [
  // =========================================================================
  // 1. TRIBHUVAN UNIVERSITY (TU) B.Sc. CSIT
  // =========================================================================
  {
    code: "CSC110",
    name: "Introduction to Information Technology",
    programId: "TU_CSIT",
    programName: "B.Sc. CSIT (Tribhuvan University)",
    level: "Undergraduate",
    category: "Computer Science",
    credits: 3,
    semester: 1,
    difficulty: "Beginner",
    description: "Fundamental introduction to computer hardware architecture, system software, networking protocols, databases, and digital information systems.",
    learningOutcomes: [
      "Understand the internal components and operational cycles of computer systems.",
      "Comprehend base numbering systems, binary arithmetic, and logic gate conversions.",
      "Explain operating system fundamentals and memory management models.",
      "Understand internet architectures, protocol suites, and modern cybersecurity principles.",
    ],
    prerequisites: ["None (Foundational)"],
    syllabusUnits: [
      {
        unitId: "CSC110_U1",
        title: "Computer Fundamentals & Architecture",
        teachingHours: 6,
        subtopics: ["Generation of Computers", "Von Neumann Architecture", "CPU, ALU, Registers & Bus Structures", "Primary and Secondary Storage Technologies"],
      },
      {
        unitId: "CSC110_U2",
        title: "Number Systems & Digital Logic",
        teachingHours: 6,
        subtopics: ["Binary, Octal, Decimal, Hexadecimal Number Systems", "Complements (1's and 2's Complement Arithmetic)", "Binary Codes (BCD, ASCII, Unicode)", "Fundamental Logic Gates and Boolean Operations"],
      },
      {
        unitId: "CSC110_U3",
        title: "System & Application Software",
        teachingHours: 8,
        subtopics: ["Operating System Role and Functions", "Compilers, Assemblers, Interpreters", "File Management & Process Scheduling", "Open Source vs Proprietary Software Paradigms"],
      },
      {
        unitId: "CSC110_U4",
        title: "Data Communications & Networking",
        teachingHours: 8,
        subtopics: ["Transmission Media (Guided and Unguided)", "Network Topologies and Categories (LAN, MAN, WAN)", "OSI 7-Layer Reference Model vs TCP/IP Suite", "Internet Routing, DNS, and Web Protocols (HTTP/HTTPS)"],
      },
      {
        unitId: "CSC110_U5",
        title: "Information Security & Emerging Trends",
        teachingHours: 7,
        subtopics: ["Malware Classification and Defenses", "Basic Cryptographic Concepts", "Cloud Computing, IoT & Big Data Overviews", "Ethical and Legal Issues in Digital Society"],
      },
    ],
  },
  {
    code: "CSC111",
    name: "C Programming",
    programId: "TU_CSIT",
    programName: "B.Sc. CSIT (Tribhuvan University)",
    level: "Undergraduate",
    category: "Computer Science",
    credits: 3,
    semester: 1,
    difficulty: "Beginner",
    description: "Structured procedural programming in C covering data types, control flow, functions, arrays, pointers, dynamic memory allocation, and file I/O.",
    learningOutcomes: [
      "Design algorithms and express logic using procedural structured programming.",
      "Master manual memory management using pointers and dynamic heap allocation.",
      "Work with complex user-defined structures and perform persistent file operations.",
    ],
    prerequisites: ["CSC110 Introduction to IT"],
    syllabusUnits: [
      {
        unitId: "CSC111_U1",
        title: "Elements of C & Control Structures",
        teachingHours: 8,
        subtopics: ["Variables, Data Types, and Operators", "Operator Precedence and Type Casting", "Conditional Branching (if, switch-case)", "Iteration Constructs (for, while, do-while)"],
      },
      {
        unitId: "CSC111_U2",
        title: "Functions & Storage Classes",
        teachingHours: 6,
        subtopics: ["Function Definitions, Prototypes and Signatures", "Call by Value vs Call by Reference", "Recursion Mechanics and Stack Frames", "Storage Classes: auto, register, static, extern"],
      },
      {
        unitId: "CSC111_U3",
        title: "Arrays & String Handling",
        teachingHours: 7,
        subtopics: ["Single and Multidimensional Arrays", "Matrix Arithmetic in C", "Character Arrays and String Manipulation Functions", "String Manipulation Without Standard Library"],
      },
      {
        unitId: "CSC111_U4",
        title: "Pointers & Dynamic Memory Management",
        teachingHours: 9,
        subtopics: ["Pointer Declaration, Dereferencing and Arithmetic", "Pointers and Arrays Equivalence", "Pointers to Pointers and Function Pointers", "Dynamic Memory Allocation: malloc(), calloc(), realloc(), free()"],
      },
      {
        unitId: "CSC111_U5",
        title: "Structures, Unions & File I/O",
        teachingHours: 8,
        subtopics: ["Defining Structures and Accessing Members", "Nested Structures and Arrays of Structures", "Unions and Bit-fields", "Sequential and Random File Processing (fopen, fread, fwrite, fseek)"],
      },
    ],
  },
  {
    code: "CSC211",
    name: "Data Structures and Algorithms",
    programId: "TU_CSIT",
    programName: "B.Sc. CSIT (Tribhuvan University)",
    level: "Undergraduate",
    category: "Computer Science",
    credits: 3,
    semester: 3,
    difficulty: "Intermediate",
    description: "Comprehensive study of abstract data types, linear and non-linear data structures, asymptotic algorithmic complexity, and sorting/searching paradigms.",
    learningOutcomes: [
      "Analyze algorithmic runtime and space efficiency using asymptotic notations.",
      "Implement stacks, queues, linked lists, trees, and graphs from scratch.",
      "Apply greedy, divide-and-conquer, and dynamic programming techniques to real engineering problems.",
    ],
    prerequisites: ["CSC111 C Programming", "CSC160 Discrete Structures"],
    syllabusUnits: [
      {
        unitId: "CSC211_U1",
        title: "Algorithm Analysis & ADTs",
        teachingHours: 5,
        subtopics: ["Abstract Data Types Concept", "Asymptotic Analysis (Big-O, Omega, Theta)", "Time and Space Complexity Recurrence Relations", "Master Theorem for Divide-and-Conquer"],
      },
      {
        unitId: "CSC211_U2",
        title: "Linear Data Structures: Stacks, Queues & Lists",
        teachingHours: 10,
        subtopics: ["Stack Operations & Applications (Infix to Postfix, Recursion)", "Linear, Circular, and Priority Queues", "Singly, Doubly, and Circular Linked Lists", "Dynamic Memory Implementations of Linear Structures"],
      },
      {
        unitId: "CSC211_U3",
        title: "Non-Linear Structures: Trees & Heaps",
        teachingHours: 12,
        subtopics: ["Binary Trees Properties and Traversals (Pre, In, Post-Order)", "Binary Search Trees (Insertion, Deletion, Search Invariants)", "Self-Balancing Trees: AVL Trees and Rotations", "Binary Heaps, Priority Queues, and Heap Sort"],
      },
      {
        unitId: "CSC211_U4",
        title: "Graphs & Network Algorithms",
        teachingHours: 9,
        subtopics: ["Graph Representations (Adjacency Matrix and Adjacency List)", "Breadth-First Search (BFS) and Depth-First Search (DFS)", "Minimum Spanning Trees: Prim's and Kruskal's Algorithms", "Single-Source Shortest Paths: Dijkstra's and Bellman-Ford Algorithms"],
      },
      {
        unitId: "CSC211_U5",
        title: "Sorting, Searching & Hashing",
        teachingHours: 9,
        subtopics: ["Comparison Sorts: Quick Sort, Merge Sort, Heap Sort", "Non-Comparison Sorts: Counting Sort, Radix Sort", "Hash Tables, Hash Functions, and Collision Resolution Strategies", "Separate Chaining vs Open Addressing (Linear, Quadratic Probing)"],
      },
    ],
  },
  {
    code: "CSC260",
    name: "Database Management Systems",
    programId: "TU_CSIT",
    programName: "B.Sc. CSIT (Tribhuvan University)",
    level: "Undergraduate",
    category: "Computer Science",
    credits: 3,
    semester: 4,
    difficulty: "Intermediate",
    description: "Database system architecture, entity-relationship modeling, relational algebra, SQL querying, normalization theory, and ACID transaction processing.",
    learningOutcomes: [
      "Model real-world business domains using Entity-Relationship (ER) diagrams.",
      "Write advanced SQL queries, subqueries, joins, views, and integrity triggers.",
      "Decompose unnormalized schemas into 3NF and BCNF to eliminate anomalies.",
      "Explain concurrency control, locking protocols, and crash recovery mechanisms.",
    ],
    prerequisites: ["CSC211 Data Structures and Algorithms"],
    syllabusUnits: [
      {
        unitId: "CSC260_U1",
        title: "Database System Concepts & ER Modeling",
        teachingHours: 6,
        subtopics: ["Database Architecture: Three-Schema Framework", "Data Independence (Physical and Logical)", "Entity-Relationship (ER) Modeling: Entities, Attributes, Relationships", "Enhanced ER (EER): Specialization, Generalization, Aggregation"],
      },
      {
        unitId: "CSC260_U2",
        title: "Relational Model & Relational Algebra",
        teachingHours: 7,
        subtopics: ["Relational Model Concepts: Domains, Tuples, Relations", "Integrity Constraints: Key, Domain, Entity, Referential Integrity", "Relational Algebra Operations: Select, Project, Join, Set Operations", "Relational Calculus Fundamentals"],
      },
      {
        unitId: "CSC260_U3",
        title: "SQL & Query Processing",
        teachingHours: 10,
        subtopics: ["Data Definition Language (DDL) and Data Manipulation Language (DML)", "Complex Queries: Nested Subqueries, Correlated Subqueries, Aggregations", "Views, Assertions, and Triggers", "Query Execution Plans and Optimization Techniques"],
      },
      {
        unitId: "CSC260_U4",
        title: "Functional Dependencies & Normalization",
        teachingHours: 9,
        subtopics: ["Informal Design Guidelines for Relation Schemas", "Functional Dependencies and Armstrong's Axioms", "First, Second, and Third Normal Forms (1NF, 2NF, 3NF)", "Boyce-Codd Normal Form (BCNF) and Lossless Join Decomposition"],
      },
      {
        unitId: "CSC260_U5",
        title: "Transaction Processing & Concurrency",
        teachingHours: 8,
        subtopics: ["ACID Properties of Transactions", "Schedules and Serializability (Conflict and View Serializability)", "Concurrency Control: Two-Phase Locking (2PL), Deadlock Detection", "Database Recovery Techniques: Write-Ahead Logging (WAL) and Checkpoints"],
      },
    ],
  },
  {
    code: "CSC261",
    name: "Operating Systems",
    programId: "TU_CSIT",
    programName: "B.Sc. CSIT (Tribhuvan University)",
    level: "Undergraduate",
    category: "Computer Science",
    credits: 3,
    semester: 4,
    difficulty: "Intermediate",
    description: "Operating systems internal design including kernel architecture, process synchronization, CPU scheduling, virtual memory paging, and storage subsystems.",
    learningOutcomes: [
      "Understand process states, thread models, and interrupt dispatch mechanisms.",
      "Solve critical-section race conditions using semaphores and mutexes.",
      "Implement page replacement algorithms and analyze virtual memory performance.",
    ],
    prerequisites: ["CSC213 Computer Architecture"],
    syllabusUnits: [
      {
        unitId: "CSC261_U1",
        title: "Operating System Architecture & Processes",
        teachingHours: 6,
        subtopics: ["System Calls, Traps, and Dual-Mode Operation", "Process Concept, Process Control Blocks (PCB), and Context Switching", "Threads: User-Level vs Kernel-Level Threads", "Inter-Process Communication (IPC): Shared Memory vs Message Passing"],
      },
      {
        unitId: "CSC261_U2",
        title: "CPU Scheduling & Concurrency",
        teachingHours: 10,
        subtopics: ["Scheduling Criteria & Preemptive vs Non-Preemptive Scheduling", "Algorithms: FCFS, SJF, Round Robin, Multilevel Feedback Queues", "Critical Section Problem & Peterson's Solution", "Synchronization Primitives: Mutex Locks, Counting Semaphores, Monitors"],
      },
      {
        unitId: "CSC261_U3",
        title: "Deadlocks & Resource Allocation",
        teachingHours: 6,
        subtopics: ["Four Necessary Conditions for Deadlock", "Resource Allocation Graphs (RAG)", "Deadlock Prevention, Avoidance (Banker's Algorithm)", "Deadlock Detection and Recovery Strategies"],
      },
      {
        unitId: "CSC261_U4",
        title: "Memory Management & Virtual Memory",
        teachingHours: 10,
        subtopics: ["Contiguous Memory Allocation and Dynamic Partitioning", "Paging Architecture, Page Tables, and Translation Lookaside Buffer (TLB)", "Virtual Memory, Demand Paging, and Page Fault Handling", "Page Replacement Algorithms: FIFO, Optimal, LRU, Clock Algorithm"],
      },
      {
        unitId: "CSC261_U5",
        title: "File Systems & Mass Storage",
        teachingHours: 8,
        subtopics: ["File Concepts, Directory Structures, and File Protection", "Allocation Methods: Contiguous, Linked, Indexed Allocation (Inodes)", "Disk Scheduling Algorithms: FCFS, SCAN, C-SCAN, LOOK", "RAID Architectures and Fault Tolerance"],
      },
    ],
  },
  {
    code: "CSC315",
    name: "Artificial Intelligence",
    programId: "TU_CSIT",
    programName: "B.Sc. CSIT (Tribhuvan University)",
    level: "Undergraduate",
    category: "Artificial Intelligence",
    credits: 3,
    semester: 5,
    difficulty: "Advanced",
    description: "Foundations of intelligent agents, state-space heuristic search, adversarial game playing, logical inference, probabilistic reasoning, and machine learning models.",
    learningOutcomes: [
      "Formulate real problems as state-space graph search problems.",
      "Implement A* search with admissible heuristics and Minimax with Alpha-Beta pruning.",
      "Represent knowledge using propositional and first-order predicate logic.",
      "Apply probabilistic Bayesian inference and neural network learning algorithms.",
    ],
    prerequisites: ["CSC211 Data Structures and Algorithms", "MTH114 Mathematics I"],
    syllabusUnits: [
      {
        unitId: "CSC315_U1",
        title: "Introduction & Intelligent Agents",
        teachingHours: 5,
        subtopics: ["Turing Test & Definitions of AI", "Rational Agent Model & PEAS Framework", "Agent Environments: Deterministic, Stochastic, Static, Dynamic", "Agent Architectures: Simple Reflex, Goal-Based, Utility-Based Agents"],
      },
      {
        unitId: "CSC315_U2",
        title: "Problem Solving by Search",
        teachingHours: 10,
        subtopics: ["Uninformed Search: BFS, DFS, Uniform Cost Search, Iterative Deepening", "Informed (Heuristic) Search: Greedy Best-First, A* Search", "Admissibility and Consistency of Heuristics", "Adversarial Search: Minimax Algorithm and Alpha-Beta Pruning"],
      },
      {
        unitId: "CSC315_U3",
        title: "Knowledge Representation & Logic",
        teachingHours: 10,
        subtopics: ["Propositional Logic: Syntax, Semantics, and Inference", "First-Order Predicate Logic (FOL) and Quantifiers", "Forward and Backward Chaining Inference Engines", "Unification and Resolution Refutation Proofs"],
      },
      {
        unitId: "CSC315_U4",
        title: "Uncertainty & Probabilistic Reasoning",
        teachingHours: 8,
        subtopics: ["Probability Axioms & Conditional Independence", "Bayes' Rule and Bayesian Belief Networks (BBN)", "Exact Inference in Bayesian Networks", "Markov Decision Processes (MDP) Overview"],
      },
      {
        unitId: "CSC315_U5",
        title: "Machine Learning & Neural Networks",
        teachingHours: 7,
        subtopics: ["Supervised, Unsupervised, and Reinforcement Learning", "Decision Tree Induction and Information Gain", "Artificial Neural Networks: Perceptron and Multi-Layer Perceptron", "Backpropagation Algorithm and Deep Learning Paradigms"],
      },
    ],
  },

  // =========================================================================
  // 2. CAMBRIDGE INTERNATIONAL AS & A LEVEL (CAIE)
  // =========================================================================
  {
    code: "CIE_9618",
    name: "Cambridge International AS & A Level Computer Science",
    programId: "CAMBRIDGE_A_LEVELS",
    programName: "Cambridge International AS & A Level",
    level: "Pre-University",
    category: "Computer Science",
    credits: 4,
    difficulty: "Advanced",
    description: "Rigorous international qualification covering computational thinking, architecture, binary data structures, algorithms, OOP, databases, and cybersecurity.",
    learningOutcomes: [
      "Demonstrate thorough mastery of two's complement, floating-point representation, and normalization.",
      "Design and trace iterative, recursive, and object-oriented algorithms in pseudocode and Python/Java.",
      "Explain processor fetch-decode-execute pipelining, interrupts, and logic circuit synthesis.",
    ],
    prerequisites: ["IGCSE Computer Science or O-Level equivalent"],
    syllabusUnits: [
      {
        unitId: "CIE_9618_P1",
        title: "Theory Fundamentals (Paper 1)",
        teachingHours: 35,
        subtopics: ["Information Representation (Fixed/Floating Point, Two's Complement, Normalized Representation)", "Communication Protocols, Bit Streaming, Packet Switching", "Processor Fundamentals, Assembly Language, Interrupts", "System Software, Operating Systems, Translation Tools"],
      },
      {
        unitId: "CIE_9618_P2",
        title: "Fundamental Problem-Solving & Programming (Paper 2)",
        teachingHours: 35,
        subtopics: ["Algorithm Design, Flowcharts, and Standard Pseudocode Syntax", "Linear and Binary Search, Bubble and Insertion Sorts", "Modular Programming: Functions, Procedures, Parameters by Value/Reference", "File Operations and Exception Handling Strategies"],
      },
      {
        unitId: "CIE_9618_P3",
        title: "Advanced Theory (Paper 3)",
        teachingHours: 35,
        subtopics: ["Data Representation: Floating-Point Rounding Errors and Overflow", "Boolean Algebra: Karnaugh Maps, Half/Full Adders, Flip-Flops", "Processor Architecture: RISC vs CISC, Pipelining, Parallel Processing", "Relational Database Normalization up to 3NF and SQL Statements"],
      },
      {
        unitId: "CIE_9618_P4",
        title: "Practical Programming Skills (Paper 4)",
        teachingHours: 35,
        subtopics: ["Object-Oriented Programming (Classes, Inheritance, Polymorphism, Encapsulation)", "Abstract Data Types: Stacks, Queues, Linked Lists, Binary Trees", "Recursion Implementation and Stack Trace Analysis", "Testing, Defensive Programming, and Debugging in Code"],
      },
    ],
  },
  {
    code: "CIE_9709",
    name: "Cambridge International AS & A Level Mathematics",
    programId: "CAMBRIDGE_A_LEVELS",
    programName: "Cambridge International AS & A Level",
    level: "Pre-University",
    category: "Mathematics",
    credits: 4,
    difficulty: "Advanced",
    description: "Deep mathematical development across Pure Mathematics (Calculus, Trigonometry, Coordinate Geometry), Mechanics, and Probability & Statistics.",
    learningOutcomes: [
      "Differentiate and integrate algebraic, exponential, logarithmic, and trigonometric functions.",
      "Solve first-order differential equations and geometric trajectory models.",
      "Apply Newton's laws of motion, conservation of momentum, and work-energy principles.",
    ],
    prerequisites: ["IGCSE Additional Mathematics or equivalent"],
    syllabusUnits: [
      {
        unitId: "CIE_9709_P1",
        title: "Pure Mathematics 1 (P1)",
        teachingHours: 30,
        subtopics: ["Quadratics, Functions, and Transformations", "Coordinate Geometry and Circles", "Trigonometric Equations and Identities", "Differentiation and Integration Fundamentals"],
      },
      {
        unitId: "CIE_9709_P3",
        title: "Pure Mathematics 3 (P3)",
        teachingHours: 40,
        subtopics: ["Algebra (Partial Fractions, Polynomials)", "Logarithmic and Exponential Functions", "Trigonometry (Compound and Double Angles)", "Advanced Integration: Parts, Substitution, Differential Equations", "Complex Numbers: Argand Diagrams, Modulus-Argument Form", "Vectors in Three Dimensions (Line Equations and Dot Products)"],
      },
      {
        unitId: "CIE_9709_M1",
        title: "Mechanics (M1)",
        teachingHours: 30,
        subtopics: ["Velocity and Acceleration: Constant and Variable Acceleration Models", "Forces and Equilibrium (Friction, Resolving Forces)", "Newton's Laws of Motion for Connected Particles", "Work, Energy, and Power Conservation"],
      },
    ],
  },

  // =========================================================================
  // 3. ACM / IEEE-CS GLOBAL STANDARD COMPUTER SCIENCE (CS2023)
  // =========================================================================
  {
    code: "ACM_CS_ALGO",
    name: "Algorithms, Complexity & Computability",
    programId: "ACM_CS2023",
    programName: "ACM/IEEE-CS Computing Curricula 2023",
    level: "Undergraduate",
    category: "Computer Science",
    credits: 4,
    difficulty: "Advanced",
    description: "International standard knowledge area covering advanced algorithmic paradigms, complexity classes (P, NP, NP-Complete), graph analytics, and computability theory.",
    learningOutcomes: [
      "Rigorous proof techniques: induction, invariants, and reduction.",
      "Design polynomial-time approximation algorithms and randomized algorithms.",
      "Prove NP-completeness through polynomial-time reductions from 3-SAT.",
    ],
    prerequisites: ["Data Structures and Discrete Mathematics"],
    syllabusUnits: [
      {
        unitId: "ACM_ALGO_U1",
        title: "Algorithmic Paradigms & Optimization",
        teachingHours: 12,
        subtopics: ["Divide and Conquer Recurrences", "Dynamic Programming: Optimal Substructure and Memoization", "Greedy Choice Property and Matroid Foundations", "Amortized Analysis (Aggregate, Accounting, Potential Methods)"],
      },
      {
        unitId: "ACM_ALGO_U2",
        title: "Advanced Graph Algorithms",
        teachingHours: 12,
        subtopics: ["Maximum Flow and Min-Cut (Ford-Fulkerson, Edmonds-Karp)", "Bipartite Matching and Hopcroft-Karp Algorithm", "All-Pairs Shortest Paths (Floyd-Warshall)", "Topological Sorting and Strongly Connected Components (Tarjan's)"],
      },
      {
        unitId: "ACM_ALGO_U3",
        title: "Tractable vs Intractable Problems (P vs NP)",
        teachingHours: 10,
        subtopics: ["Turing Machines and Decidability", "Complexity Classes P, NP, co-NP", "NP-Completeness and Cook-Levin Theorem", "Reductions: 3-SAT to Vertex Cover, Hamiltonian Path, Subset Sum"],
      },
      {
        unitId: "ACM_ALGO_U4",
        title: "Approximation & Randomized Algorithms",
        teachingHours: 8,
        subtopics: ["Approximation Ratios and Vertex Cover 2-Approximation", "Traveling Salesperson Metric Approximations", "Randomized QuickSort and Monte Carlo vs Las Vegas Algorithms", "Universal Hashing and Bloom Filters"],
      },
    ],
  },
  {
    code: "ACM_CS_AI",
    name: "Artificial Intelligence & Modern Machine Learning",
    programId: "ACM_CS2023",
    programName: "ACM/IEEE-CS Computing Curricula 2023",
    level: "Undergraduate",
    category: "Artificial Intelligence",
    credits: 4,
    difficulty: "Advanced",
    description: "CS2023 updated core covering foundational machine learning, deep neural network architectures, attention mechanisms, reinforcement learning, and AI ethics.",
    learningOutcomes: [
      "Train and evaluate deep convolutional and recurrent neural networks.",
      "Implement multi-head self-attention mechanisms and transformer blocks.",
      "Formulate sequential decision-making using Markov Decision Processes and Q-learning.",
      "Analyze bias, fairness, transparency, and safety in autonomous AI systems.",
    ],
    prerequisites: ["Linear Algebra", "Calculus", "Probability & Statistics", "Python"],
    syllabusUnits: [
      {
        unitId: "ACM_AI_U1",
        title: "Machine Learning Foundations",
        teachingHours: 10,
        subtopics: ["Linear and Logistic Regression with Gradient Descent", "Regularization (L1 Lasso, L2 Ridge) and Overfitting Prevention", "Support Vector Machines and Kernel Methods", "Ensemble Methods: Random Forests and Gradient Boosted Trees (XGBoost)"],
      },
      {
        unitId: "ACM_AI_U2",
        title: "Deep Learning & Neural Architectures",
        teachingHours: 14,
        subtopics: ["Multi-Layer Perceptrons and Activation Functions (ReLU, GELU)", "Backpropagation and Automatic Differentiation Mechanics", "Convolutional Neural Networks (CNNs) for Computer Vision", "Recurrent Networks, LSTMs, and Sequence Modeling"],
      },
      {
        unitId: "ACM_AI_U3",
        title: "Transformers & Foundation Models",
        teachingHours: 12,
        subtopics: ["Scaled Dot-Product and Multi-Head Self-Attention", "Transformer Architecture (Encoder-Decoder, Positional Encodings)", "Pre-training, Fine-Tuning, and Instruction Tuning (RLHF)", "Retrieval-Augmented Generation (RAG) Architecture"],
      },
      {
        unitId: "ACM_AI_U4",
        title: "Reinforcement Learning & AI Ethics",
        teachingHours: 8,
        subtopics: ["Markov Decision Processes and Bellman Equations", "Value Iteration, Policy Iteration, and Q-Learning", "Algorithmic Bias, Model Interpretability, and Explainability (SHAP)", "AI Governance, Safety Alignment, and Ethical Frameworks"],
      },
    ],
  },

  // =========================================================================
  // 4. US COLLEGE BOARD ADVANCED PLACEMENT (AP)
  // =========================================================================
  {
    code: "AP_CSA",
    name: "AP Computer Science A",
    programId: "US_AP",
    programName: "College Board Advanced Placement (AP)",
    level: "Pre-University",
    category: "Computer Science",
    credits: 3,
    difficulty: "Intermediate",
    description: "College Board certified curriculum covering object-oriented Java programming, primitive types, control statements, arrays, ArrayLists, inheritance, and recursion.",
    learningOutcomes: [
      "Author robust object-oriented programs adhering to AP Java subsets.",
      "Manipulate 1D and 2D arrays and dynamic ArrayList collections.",
      "Trace and construct recursive algorithms and object class hierarchies.",
    ],
    prerequisites: ["Algebra I"],
    syllabusUnits: [
      {
        unitId: "AP_CSA_U1",
        title: "Primitive Types & Using Objects",
        teachingHours: 15,
        subtopics: ["Variables, Data Types, and Arithmetic Expressions", "Calling Object Methods and Constructor Initialization", "String Objects and Standard String Methods (substring, indexOf)"],
      },
      {
        unitId: "AP_CSA_U2",
        title: "Boolean Expressions & Iteration",
        teachingHours: 18,
        subtopics: ["Boolean Expressions and De Morgan's Laws", "if Statements and Two-Way/Multi-Way Selection", "while and for Loops, Nested Iterations, and Algorithm Efficiency"],
      },
      {
        unitId: "AP_CSA_U3",
        title: "Class Writing & Array Collections",
        teachingHours: 25,
        subtopics: ["Anatomy of a Class: Instance Variables, Constructors, Methods", "Scope, Access Modifiers (public, private), and Encapsulation", "1D Arrays: Creation, Traversal, and Standard Algorithms", "ArrayList: Dynamic Resizing, Autoboxing, and Element Mutation"],
      },
      {
        unitId: "AP_CSA_U4",
        title: "2D Arrays, Inheritance & Recursion",
        teachingHours: 22,
        subtopics: ["2D Arrays: Row-Major and Column-Major Traversals", "Class Hierarchies: Superclasses, Subclasses, and 'super' Keyword", "Polymorphism and Method Overriding", "Recursive Functions, Base Cases, and Binary Search Recursive Tracing"],
      },
    ],
  },
  {
    code: "AP_CALC_BC",
    name: "AP Calculus BC",
    programId: "US_AP",
    programName: "College Board Advanced Placement (AP)",
    level: "Pre-University",
    category: "Mathematics",
    credits: 4,
    difficulty: "Advanced",
    description: "Intensive college-level calculus covering single-variable differential and integral calculus, differential equations, parametric equations, polar coordinates, and infinite series.",
    learningOutcomes: [
      "Evaluate limits, continuity, and differentiability rigorously.",
      "Calculate areas, arc lengths, and volumes of revolution in Cartesian and Polar forms.",
      "Determine convergence of infinite series and construct Taylor/Maclaurin series approximations.",
    ],
    prerequisites: ["Pre-Calculus"],
    syllabusUnits: [
      {
        unitId: "AP_CALC_U1",
        title: "Limits, Continuity & Differentiation",
        teachingHours: 20,
        subtopics: ["Formal Limit Definitions and L'Hôpital's Rule", "Chain Rule, Implicit Differentiation, and Related Rates", "Mean Value Theorem and Extreme Value Theorem", "Optimization and Curve Sketching"],
      },
      {
        unitId: "AP_CALC_U2",
        title: "Integration & Accumulation of Change",
        teachingHours: 25,
        subtopics: ["Riemann Sums and Fundamental Theorem of Calculus", "Integration by Parts and Partial Fractions Decomposition", "Improper Integrals and Convergence", "Volumes of Solids of Revolution (Disk, Washer, and Shell Methods)"],
      },
      {
        unitId: "AP_CALC_U3",
        title: "Differential Equations & Parametric/Polar Functions",
        teachingHours: 20,
        subtopics: ["Slope Fields and Euler's Method for Numerical Solutions", "Separable First-Order Differential Equations and Logistic Growth Models", "Parametric Equations, Derivatives, and Arc Length", "Polar Coordinates, Derivatives, and Area Bounded by Polar Curves"],
      },
      {
        unitId: "AP_CALC_U4",
        title: "Infinite Sequences & Power Series",
        teachingHours: 25,
        subtopics: ["Convergence Tests: Ratio, Integral, Comparison, Alternating Series Tests", "Radius and Interval of Convergence for Power Series", "Taylor and Maclaurin Polynomial Approximations", "Lagrange Error Bound Analysis for Taylor Approximations"],
      },
    ],
  },

  // =========================================================================
  // 5. GATE (GRADUATE APTITUDE TEST IN ENGINEERING) COMPUTER SCIENCE
  // =========================================================================
  {
    code: "GATE_TOC_COMP",
    name: "Theory of Computation & Compiler Design",
    programId: "GATE_CS",
    programName: "GATE CS & IT (India)",
    level: "Graduate / Competitive",
    category: "Computer Science",
    credits: 4,
    difficulty: "Advanced",
    description: "Automata theory, regular and context-free languages, Turing decidability, lexical analysis, LL/LR parsing, syntax-directed translation, and compiler code generation.",
    learningOutcomes: [
      "Construct minimal DFAs, regular expressions, and context-free grammars.",
      "Design LL(1), SLR(1), and LR(1) parsing tables and detect grammar conflicts.",
      "Generate intermediate three-address code and perform basic block optimizations.",
    ],
    prerequisites: ["Discrete Mathematics", "Data Structures"],
    syllabusUnits: [
      {
        unitId: "GATE_TOC_U1",
        title: "Finite Automata & Regular Languages",
        teachingHours: 12,
        subtopics: ["DFA, NFA, and Epsilon-NFA Equivalence", "Minimization of Finite Automata using State Equivalence", "Regular Expressions and Arden's Theorem", "Pumping Lemma for Regular Languages and Closure Properties"],
      },
      {
        unitId: "GATE_TOC_U2",
        title: "Context-Free Languages & Pushdown Automata",
        teachingHours: 12,
        subtopics: ["Context-Free Grammars (CFG) and Parse Trees", "Chomsky Normal Form (CNF) and Greibach Normal Form (GNF)", "Deterministic and Non-Deterministic Pushdown Automata (PDA)", "Pumping Lemma for CFLs and Language Decidability Hierarchy"],
      },
      {
        unitId: "GATE_TOC_U3",
        title: "Turing Machines & Undecidability",
        teachingHours: 10,
        subtopics: ["Standard Turing Machine Models and Church-Turing Thesis", "Recursive and Recursively Enumerable Languages", "Halting Problem of Turing Machines and Post Correspondence Problem (PCP)", "Rice's Theorem and Undecidable Properties of Languages"],
      },
      {
        unitId: "GATE_TOC_U4",
        title: "Compiler Design: Parsing & Code Optimization",
        teachingHours: 14,
        subtopics: ["Lexical Analysis and Regular Expression Translation to Lex", "Top-Down Parsing: LL(1) Grammars, First and Follow Sets", "Bottom-Up Parsing: Shift-Reduce, SLR, CLR, and LALR Parsers", "Intermediate Code: Three-Address Code, DAGs, and Register Allocation"],
      },
    ],
  },
];

export const GLOBAL_COURSES = globalSyllabusCourses;
