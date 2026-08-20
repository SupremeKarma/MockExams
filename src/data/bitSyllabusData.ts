export interface SubjectInfo {
  code: string;
  name: string;
  credits: number;
  type: "Core" | "Elective" | "Project / Practical";
  description: string;
  keyUnits: string[];
}

export interface SemesterSyllabus {
  semester: number;
  totalCredits: number;
  subjects: SubjectInfo[];
}

export const bitSyllabusData: SemesterSyllabus[] = [
  {
    semester: 1,
    totalCredits: 17,
    subjects: [
      {
        code: "BIT101",
        name: "Programming in C",
        credits: 3,
        type: "Core",
        description: "Fundamental procedural programming concepts, pointers, file structures, and memory management in C.",
        keyUnits: ["Introduction to C & Data Types", "Control Structures & Loops", "Functions & Storage Classes", "Arrays & String Handling", "Pointers & DMA", "Structures & File I/O"]
      },
      {
        code: "BIT102",
        name: "Mathematics-I",
        credits: 3,
        type: "Core",
        description: "Differential and integral calculus, infinite series, matrix algebra, and analytical geometry.",
        keyUnits: ["Derivatives & Mean Value Theorems", "Indefinite & Definite Integrals", "Matrices & Determinants", "Vectors & Analytical 3D Geometry", "Taylor & Maclaurin Expansions"]
      },
      {
        code: "BIT103",
        name: "Digital Logic",
        credits: 3,
        type: "Core",
        description: "Combinational and sequential digital systems, logic gate minimization, and register design.",
        keyUnits: ["Number Systems & Codes", "Boolean Algebra & K-Maps", "Combinational Circuits (Adders, MUX)", "Sequential Circuits & Flip-Flops", "Registers & Counters Design"]
      },
      {
        code: "BIT104",
        name: "Fundamentals of IT",
        credits: 3,
        type: "Core",
        description: "Computer hardware architecture, operating system basics, internet protocols, and software applications.",
        keyUnits: ["Computer Generations & Evolution", "CPU & Memory Hierarchy", "I/O Devices & Bus Architecture", "Operating Systems Overview", "Internet & Web Concepts"]
      },
      {
        code: "BIT105",
        name: "Technical Communication (English)",
        credits: 3,
        type: "Core",
        description: "Professional technical writing, grammar, engineering report formulation, and oral presentations.",
        keyUnits: ["Grammar & Sentence Mechanics", "Technical Report Writing", "Business Correspondence & Email", "Proposal Formulation", "Oral Presentation & Seminars"]
      },
      {
        code: "BIT106",
        name: "C Programming Lab",
        credits: 2,
        type: "Project / Practical",
        description: "Hands-on terminal programming, algorithm implementation, and debugging in C.",
        keyUnits: ["Lab Exercises 1-15", "Mini CLI Project", "Viva-voce Examination"]
      }
    ]
  },
  {
    semester: 2,
    totalCredits: 18,
    subjects: [
      {
        code: "BIT201",
        name: "Object Oriented Programming in C++",
        credits: 3,
        type: "Core",
        description: "Object-oriented paradigm, encapsulation, inheritance, polymorphism, templates, and STL.",
        keyUnits: ["Principles of OOP", "Classes & Objects", "Operator Overloading & Type Conversion", "Inheritance & Virtual Functions", "Templates & Exception Handling", "Streams & File I/O"]
      },
      {
        code: "BIT202",
        name: "Data Structures & Algorithms",
        credits: 3,
        type: "Core",
        description: "Linear and non-linear data structures, trees, graphs, sorting algorithms, and complexity analysis.",
        keyUnits: ["Arrays, Stacks & Queues", "Linked Lists (Singly/Doubly/Circular)", "Trees & Binary Search Trees (BST)", "Graph Algorithms (BFS, DFS)", "Sorting & Searching Complexities"]
      },
      {
        code: "BIT203",
        name: "Mathematics-II (Linear Algebra & Discrete Math)",
        credits: 3,
        type: "Core",
        description: "Set theory, relations, graph theory, propositional logic, and combinatorics.",
        keyUnits: ["Propositional & Predicate Logic", "Sets, Relations & Functions", "Mathematical Induction & Recursion", "Graph Theory & Trees", "Linear Vector Spaces"]
      },
      {
        code: "BIT204",
        name: "Microprocessor & Assembly Language",
        credits: 3,
        type: "Core",
        description: "8085 / 8086 microprocessor internal architecture, instruction sets, addressing modes, and bus interfacing.",
        keyUnits: ["8085 Microprocessor Architecture", "Addressing Modes & Instruction Set", "Assembly Language Programming", "Memory & I/O Interfacing", "Interrupt Processing & Controllers"]
      },
      {
        code: "BIT205",
        name: "Financial Accounting & Management",
        credits: 3,
        type: "Core",
        description: "Accounting principles, journal entries, balance sheets, cash flow analysis, and budget planning.",
        keyUnits: ["Introduction to Financial Accounting", "Double Entry Bookkeeping", "Trial Balance & Financial Statements", "Cost Accounting & Cost-Volume-Profit", "Financial Ratio Analysis"]
      },
      {
        code: "BIT206",
        name: "OOP & DSA Practical Lab",
        credits: 3,
        type: "Project / Practical",
        description: "Implementation of complex tree, graph, and object hierarchies in C++.",
        keyUnits: ["C++ OOP Experiments", "DSA Implementations", "Project Submission & Viva"]
      }
    ]
  },
  {
    semester: 3,
    totalCredits: 18,
    subjects: [
      {
        code: "BIT301",
        name: "Database Management System (DBMS)",
        credits: 3,
        type: "Core",
        description: "Relational database design, normalization, SQL, transaction management, and indexing.",
        keyUnits: ["DBMS Concepts & ER Modeling", "Relational Model & Relational Algebra", "SQL Queries & Views", "Normalization (1NF to BCNF)", "Transaction, ACID & Concurrency Control", "Storage, B-Tree & Indexing"]
      },
      {
        code: "BIT302",
        name: "Computer Networks",
        credits: 3,
        type: "Core",
        description: "OSI and TCP/IP protocol suites, IP addressing, routing algorithms, transport protocols, and DNS.",
        keyUnits: ["Network Topologies & Reference Models", "Data Link Layer & Error Control", "Network Layer & IPv4/IPv6 Routing", "Transport Layer (TCP/UDP, Flow Control)", "Application Layer (HTTP, DNS, SMTP)"]
      },
      {
        code: "BIT303",
        name: "Microcontroller & Embedded Systems",
        credits: 3,
        type: "Core",
        description: "8051 and AVR microcontrollers, timer programming, interrupts, serial communication, and peripheral interfacing.",
        keyUnits: ["8051 Architecture & Pin Configuration", "Assembly & Embedded C Programming", "Timer/Counter & Serial Port (UART)", "Interrupts & External ISR Handling", "Interfacing Sensors, LCD, Motors"]
      },
      {
        code: "BIT304",
        name: "Probability & Statistics",
        credits: 3,
        type: "Core",
        description: "Probability distributions, hypothesis testing, correlation, regression, and statistical inference.",
        keyUnits: ["Descriptive Statistics & Probability", "Discrete & Continuous Distributions", "Sampling & Estimation", "Hypothesis Testing (z, t, Chi-square, ANOVA)", "Correlation & Linear Regression"]
      },
      {
        code: "BIT305",
        name: "System Analysis & Design (SAD)",
        credits: 3,
        type: "Core",
        description: "System development lifecycle, requirement analysis, DFDs, UML diagrams, and software testing.",
        keyUnits: ["SDLC & Feasibility Analysis", "Requirement Gathering & Fact Finding", "Data Flow Diagrams (DFD) & Dictionaries", "UML Modeling (Use Case, Sequence, Class)", "System Testing & Implementation"]
      },
      {
        code: "BIT306",
        name: "DBMS & Network Lab",
        credits: 3,
        type: "Project / Practical",
        description: "SQL database programming, network packet analysis with Wireshark, and socket programming.",
        keyUnits: ["SQL Lab Practical", "Packet Sniffing & Subnetting", "Embedded Systems Lab"]
      }
    ]
  },
  {
    semester: 4,
    totalCredits: 18,
    subjects: [
      {
        code: "BIT401",
        name: "Operating Systems",
        credits: 3,
        type: "Core",
        description: "Process management, CPU scheduling, deadlocks, memory virtualization, and file systems.",
        keyUnits: ["OS Structures & System Calls", "Process & Thread Management", "CPU Scheduling Algorithms", "Deadlock Detection & Avoidance", "Memory Paging & Virtual Memory", "File System & Disk Scheduling"]
      },
      {
        code: "BIT402",
        name: "Java Programming",
        credits: 3,
        type: "Core",
        description: "Core Java, multithreading, collections, JDBC, GUI programming, and exception handling.",
        keyUnits: ["Java Basics & OOP in Java", "Exception Handling & Packages", "Multithreading & Concurrency", "Java Collections Framework", "GUI Programming (Swing/JavaFX)", "Database Connectivity (JDBC)"]
      },
      {
        code: "BIT403",
        name: "Numerical Methods",
        credits: 3,
        type: "Core",
        description: "Numerical root finding, interpolation, numerical integration, and solving ODEs.",
        keyUnits: ["Roots of Non-Linear Equations", "Interpolation & Curve Fitting", "Numerical Differentiation & Integration", "System of Linear Equations (Gauss-Seidel)", "Numerical Solution of ODEs (Euler, RK-4)"]
      },
      {
        code: "BIT404",
        name: "Computer Architecture & Organization",
        credits: 3,
        type: "Core",
        description: "CPU datapath, pipelining, control unit design, cache memory, and I/O organization.",
        keyUnits: ["Register Transfer & Micro-operations", "Basic Computer Organization & Design", "Central Processing Unit & Pipelining", "Computer Arithmetic (Booth's Algorithm)", "Memory Hierarchy & Cache Mapping"]
      },
      {
        code: "BIT405",
        name: "Web Technology-I",
        credits: 3,
        type: "Core",
        description: "HTML5, CSS3, JavaScript, DOM manipulation, responsive UI, and backend scripting in PHP.",
        keyUnits: ["HTML5 Semantic Tags & CSS3", "JavaScript & DOM Manipulation", "Client-side Validation & Events", "PHP Syntax & Control Structures", "MySQL Database Integration via PHP"]
      },
      {
        code: "BIT406",
        name: "Minor Project-I",
        credits: 3,
        type: "Project / Practical",
        description: "Hands-on software application development with full documentation and presentation.",
        keyUnits: ["Topic Selection & Proposal", "Software Implementation", "Final Documentation & Defense"]
      }
    ]
  },
  {
    semester: 5,
    totalCredits: 18,
    subjects: [
      {
        code: "BIT501",
        name: "Computer Graphics",
        credits: 3,
        type: "Core",
        description: "Rasterization algorithms, 2D/3D transformations, clipping, illumination, and OpenGL shaders.",
        keyUnits: ["Display Devices & Raster Graphics", "Line & Circle Drawing Algorithms", "2D Transformations & Clipping", "3D Transformations & Projections", "Visible Surface Detection (Z-Buffer)", "Illumination & Shading Models"]
      },
      {
        code: "BIT502",
        name: "Cryptography & Network Security",
        credits: 3,
        type: "Core",
        description: "Classical and modern ciphers, public key cryptosystems, digital signatures, hash functions, and TLS.",
        keyUnits: ["Security Concepts & Attacks", "Classical Encryption Techniques", "Symmetric Ciphers (DES, AES)", "Public Key Cryptography (RSA, ECC)", "Hash Functions & Digital Signatures", "Network Security Protocols (TLS, IPSec)"]
      },
      {
        code: "BIT503",
        name: "Research Methodology",
        credits: 3,
        type: "Core",
        description: "Scientific inquiry, quantitative and qualitative research designs, hypothesis formulation, and technical writing.",
        keyUnits: ["Foundations of Scientific Research", "Literature Review & Research Gap", "Research Design & Sampling Strategies", "Hypothesis Formulation & Testing", "Data Analysis & Interpretation", "Report Writing & Publication Ethics"]
      },
      {
        code: "BIT504",
        name: "Advanced Web Technology",
        credits: 3,
        type: "Core",
        description: "Modern JavaScript frameworks (React/Next.js), REST APIs, MVC architecture, authentication, and state management.",
        keyUnits: ["Modern ES6+ JavaScript & TypeScript", "React Framework, Hooks & State", "Next.js App Router & SSR", "RESTful API Design & Express.js", "Authentication (JWT, OAuth) & Security"]
      },
      {
        code: "BIT505",
        name: "Organization Behavior & HR Management",
        credits: 3,
        type: "Core",
        description: "Workplace psychology, leadership styles, conflict resolution, motivation theories, and corporate culture.",
        keyUnits: ["Fundamentals of OB", "Individual Behavior & Motivation", "Group Dynamics & Team Building", "Leadership Styles & Power Politics", "Organizational Culture & Change"]
      },
      {
        code: "BIT506",
        name: "Computer Graphics & Web Lab",
        credits: 3,
        type: "Project / Practical",
        description: "OpenGL 2D/3D programming and full-stack web application development.",
        keyUnits: ["Graphics Algorithms Lab in C/C++", "Fullstack Web App Deployment", "Practical Evaluation"]
      }
    ]
  },
  {
    semester: 6,
    totalCredits: 17,
    subjects: [
      {
        code: "BIT601",
        name: "Software Engineering",
        credits: 3,
        type: "Core",
        description: "Agile methodologies, software architecture, design patterns, automated testing, and CI/CD pipelines.",
        keyUnits: ["Agile, Scrum & SDLC Models", "Requirements Engineering (SRS)", "Software Architectural Patterns", "Object-Oriented Design & Patterns", "Software Quality Assurance & Testing", "DevOps & CI/CD Fundamentals"]
      },
      {
        code: "BIT602",
        name: "Artificial Intelligence",
        credits: 3,
        type: "Core",
        description: "State-space search, heuristic algorithms, knowledge representation, logic inference, and neural networks.",
        keyUnits: ["AI Agents & Problem Formulation", "Informed & Uninformed Search (A*, Minimax)", "Knowledge Representation & Logic", "Inference & Resolution in First-Order Logic", "Introduction to Machine Learning & Neural Nets"]
      },
      {
        code: "BIT603",
        name: "Management Information Systems (MIS)",
        credits: 3,
        type: "Core",
        description: "Enterprise systems, ERP, decision support systems (DSS), and strategic information technology planning.",
        keyUnits: ["MIS Concepts & Frameworks", "Enterprise Resource Planning (ERP)", "Customer Relationship Management (CRM)", "Decision Support & Business Intelligence", "Ethical & Social Issues in Information Systems"]
      },
      {
        code: "BIT604",
        name: "E-Commerce & Digital Marketing",
        credits: 3,
        type: "Elective",
        description: "Online business models, payment gateways, search engine optimization (SEO), and digital ad campaigns.",
        keyUnits: ["E-Commerce Business Models", "Payment Gateways & Electronic Wallets", "Security & Encryption in E-Commerce", "Digital Marketing Channels & SEO", "Social Media Marketing & Analytics"]
      },
      {
        code: "BIT605",
        name: "Minor Project-II",
        credits: 5,
        type: "Project / Practical",
        description: "Comprehensive software engineering project with live deployment and university defense.",
        keyUnits: ["Requirement Gathering & SRS", "System Architecture & Coding", "Automated Testing Suite", "Final Defense & Demonstration"]
      }
    ]
  },
  {
    semester: 7,
    totalCredits: 16,
    subjects: [
      {
        code: "BIT701",
        name: "Mobile Application Development",
        credits: 3,
        type: "Core",
        description: "Native and cross-platform mobile app development, state management, sensors, and cloud sync.",
        keyUnits: ["Mobile OS Architecture (Android/iOS)", "UI Design & Layout Components", "Activity Lifecycle & State Management", "Sensors, Camera & Location Services", "REST API Integration & Cloud DBs"]
      },
      {
        code: "BIT702",
        name: "Cloud Computing & Virtualization",
        credits: 3,
        type: "Core",
        description: "Cloud service models (IaaS, PaaS, SaaS), Docker containers, Kubernetes, and AWS/GCP services.",
        keyUnits: ["Cloud Principles & Virtualization", "Service Models (IaaS, PaaS, SaaS)", "Containerization with Docker", "Kubernetes Orchestration & Pods", "Cloud Security, IAM & Cost Optimization"]
      },
      {
        code: "BIT703",
        name: "Data Mining & Data Warehousing",
        credits: 3,
        type: "Core",
        description: "ETL pipelines, star/snowflake schemas, classification algorithms, clustering, and association rule mining.",
        keyUnits: ["Data Warehouse Architecture & OLAP", "ETL Process & Data Cleaning", "Association Rule Mining (Apriori)", "Classification (Decision Trees, Naive Bayes)", "Clustering Algorithms (k-Means, DBSCAN)"]
      },
      {
        code: "BIT704",
        name: "Elective-I (Big Data Analytics / Blockchain)",
        credits: 3,
        type: "Elective",
        description: "Distributed data processing with Hadoop/Spark or smart contract engineering on decentralized ledgers.",
        keyUnits: ["Distributed Computing Fundamentals", "Hadoop Ecosystem & MapReduce", "Spark DataFrame Transformations", "Decentralized Consensus & Smart Contracts"]
      },
      {
        code: "BIT705",
        name: "Internship / Industrial Training",
        credits: 4,
        type: "Project / Practical",
        description: "Professional industrial internship at an IT organization with supervisor evaluation.",
        keyUnits: ["Industry Placement", "Work Diary & Weekly Logs", "Final Internship Report", "Viva-voce"]
      }
    ]
  },
  {
    semester: 8,
    totalCredits: 16,
    subjects: [
      {
        code: "BIT801",
        name: "Network Security & Cyber Law",
        credits: 3,
        type: "Core",
        description: "Penetration testing, digital forensics, incident response, and Nepal Electronic Transactions Act (ETA 2063).",
        keyUnits: ["Threat Modeling & OWASP Top 10", "Network Penetration Testing", "Digital Forensics & Chain of Custody", "Security Auditing & Compliance", "Nepal ETA 2063 & International Cyber Law"]
      },
      {
        code: "BIT802",
        name: "Elective-II (Machine Learning / IoT)",
        credits: 3,
        type: "Elective",
        description: "Supervised and unsupervised statistical machine learning algorithms, deep neural nets, or edge IoT networks.",
        keyUnits: ["Supervised ML (Regression, SVM)", "Unsupervised Learning & PCA", "Deep Learning Fundamentals (CNN, RNN)", "IoT Protocols (MQTT, CoAP)"]
      },
      {
        code: "BIT803",
        name: "Major Capstone Project",
        credits: 10,
        type: "Project / Practical",
        description: "Final comprehensive engineering project culminating in a research paper and public defense.",
        keyUnits: ["Proposal Defense", "Mid-term Progress Review", "Final Product Deployment", "External University Defense"]
      }
    ]
  }
];
