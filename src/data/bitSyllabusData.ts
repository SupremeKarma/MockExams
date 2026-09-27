export interface SubjectInfo {
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

export const bitSyllabusData: SemesterSyllabus[] = [
  {
    "semester": 1,
    "totalCredits": 17,
    "subjects": [
      {
        "code": "BIT101CO",
        "name": "Fundamentals of Information Technology",
        "credits": 3,
        "type": "Core",
        "description": "Computer components and history, hardware and storage, software and databases, networks and the internet, and emerging IT trends.",
        "keyUnits": [
          "Introduction to Computer",
          "Basic Computer Organization and Computer Peripherals",
          "Computer Storage",
          "Computer Software",
          "Introduction to Database",
          "Networks and Internet",
          "Information Security",
          "Computer Hardware",
          "Technological trends in Information Technology"
        ]
      },
      {
        "code": "BIT102HS",
        "name": "Mathematics-I",
        "credits": 3,
        "type": "Core",
        "description": "Matrix algebra, coordinate systems and geometry, vectors and solid geometry, and applications of differentiation.",
        "keyUnits": [
          "Matrix Algebra",
          "Coordinate Systems",
          "Elementary Coordinate Geometry",
          "Vectors and Solid Geometry",
          "Applications of Differentiation",
          "Applications of the Definite Integral",
          "Functions of Several Variables"
        ]
      },
      {
        "code": "BIT103HS",
        "name": "Technical Communication",
        "credits": 3,
        "type": "Core",
        "description": "Oral presentation skills, intensive and extensive reading, and professional business/technical writing.",
        "keyUnits": [
          "Oral Communication",
          "Reading: Intensive and Extensive",
          "Writing"
        ]
      },
      {
        "code": "BIT104HS",
        "name": "Society and Ethics in IT",
        "credits": 3,
        "type": "Core",
        "description": "Sociology fundamentals, social and cultural change, Nepali society, professional ethics in IT, and emotional intelligence.",
        "keyUnits": [
          "Introduction",
          "Social and Cultural Change",
          "Understanding Development",
          "Process of Transformation",
          "Historical Characteristics of Nepali Society and Culture",
          "Ethical issues in IT",
          "Introduction to Emotional Intelligence",
          "Social Management and Responsibility"
        ]
      },
      {
        "code": "BIT105CO",
        "name": "Computer Programming in C",
        "credits": 3,
        "type": "Core",
        "description": "Procedural programming fundamentals in C — control flow, arrays, functions, pointers, structures, and file handling.",
        "keyUnits": [
          "Problem Solving with Computer",
          "Elements of C",
          "Input and Output",
          "Operators and Expression",
          "Control Statements",
          "Arrays",
          "Functions",
          "Pointers",
          "Structure and Union",
          "Files and File Handling in C",
          "Introduction to Graphics"
        ]
      },
      {
        "code": "BIT106CO",
        "name": "Project-I",
        "credits": 2,
        "type": "Project / Practical",
        "description": "Group software project (2-3 students) built in C, covering requirement gathering through implementation and oral defense — 45 lab hours.",
        "keyUnits": [
          "Information Gathering & Requirements",
          "Algorithms & Flowcharts",
          "Coding & Implementation",
          "Documentation & Final Presentation"
        ]
      }
    ]
  },
  {
    "semester": 2,
    "totalCredits": 17,
    "subjects": [
      {
        "code": "BIT151HS",
        "name": "Mathematics-II",
        "credits": 3,
        "type": "Core",
        "description": "Multiple integrals, differential equations, Fourier series, and functions of a complex variable.",
        "keyUnits": [
          "Multiple Integrals",
          "Differential Equations of the First Order",
          "Linear Differential Equations",
          "Fourier Series and Integrals",
          "Functions of a Complex Variable",
          "Complex Series, Residues and Poles"
        ]
      },
      {
        "code": "BIT152CO",
        "name": "Digital Logic",
        "credits": 3,
        "type": "Core",
        "description": "Number systems, Boolean algebra, combinational and sequential circuit design, registers and counters.",
        "keyUnits": [
          "Number Systems",
          "Boolean Algebra and Logic Gates",
          "Simplification of Boolean Functions",
          "Combinational Logic",
          "Sequential Logic",
          "Registers and Counters"
        ]
      },
      {
        "code": "BIT153HS",
        "name": "Discrete Structure",
        "credits": 3,
        "type": "Core",
        "description": "Set theory, counting, logic, relations, graphs and trees, order relations, and automata theory.",
        "keyUnits": [
          "Set Theory and Matrices",
          "Function and Counting",
          "Logic",
          "Relation and Digraphs",
          "Graph and Tree",
          "Order Relation and Structure",
          "Automata, Language and Grammar"
        ]
      },
      {
        "code": "BIT154CO",
        "name": "Object-Oriented Programming in C++",
        "credits": 3,
        "type": "Core",
        "description": "C++ OOP fundamentals — classes, constructors, operator overloading, inheritance, polymorphism, templates, and file handling.",
        "keyUnits": [
          "Introduction to Object Oriented Programming",
          "C++ Programming Concept",
          "Functions Used in C++",
          "Classes and Objects",
          "Constructor & Destructor",
          "Operator Overloading",
          "Inheritance",
          "Virtual Functions and Polymorphism",
          "File Handling",
          "Templates and Namespaces",
          "Exception Handling"
        ]
      },
      {
        "code": "BIT155MS",
        "name": "Financial Management and Accounting",
        "credits": 3,
        "type": "Core",
        "description": "Financial management fundamentals, capital budgeting and structure, and core accounting processes and statements.",
        "keyUnits": [
          "Nature of Financial Management",
          "Time Value of Money",
          "Capital Budgeting",
          "Working Capital",
          "Capital Structure",
          "Dividends",
          "Nature of Accounting",
          "Accounting Process",
          "Financial Statement",
          "Financial Analysis",
          "Cash Flow Statement - Direct Method"
        ]
      },
      {
        "code": "BIT156CO",
        "name": "Project-II",
        "credits": 2,
        "type": "Project / Practical",
        "description": "Group software project (2-3 students) built using Object-Oriented Programming in C++ — 45 lab hours.",
        "keyUnits": [
          "Topic Selection & Information Gathering",
          "System Requirements & Specifications",
          "Coding & Implementation",
          "Documentation & Final Presentation"
        ]
      }
    ]
  },
  {
    "semester": 3,
    "totalCredits": 17,
    "subjects": [
      {
        "code": "BIT201HS",
        "name": "Numerical Methods",
        "credits": 3,
        "type": "Core",
        "description": "Numerical solutions to nonlinear equations, interpolation, linear systems, differentiation/integration, and ODEs.",
        "keyUnits": [
          "Errors in Numerical Computation",
          "Solution of Nonlinear Equations (Bisection, Newton-Raphson)",
          "Interpolation & Least Square Methods",
          "System of Linear Equations (Direct & Indirect Methods)",
          "Numerical Differentiation & Integration",
          "Numerical Solution of ODEs (Euler, Runge-Kutta)"
        ]
      },
      {
        "code": "BIT202CO",
        "name": "Microcontroller",
        "credits": 3,
        "type": "Core",
        "description": "8051 microcontroller architecture, instruction set, I/O and timer programming, interrupts, and peripheral interfacing.",
        "keyUnits": [
          "Introduction to Microcontroller & 8051 Architecture",
          "Instruction Set & Addressing Modes",
          "Stack, I/O Port Interfacing & Programming",
          "Timers and Serial Port",
          "Interrupts and Interfacing Applications"
        ]
      },
      {
        "code": "BIT203CO",
        "name": "Data Structure and Algorithm",
        "credits": 3,
        "type": "Core",
        "description": "Core data structures — stacks, queues, lists, trees, graphs — plus sorting, searching, and algorithm efficiency.",
        "keyUnits": [
          "Introduction & Algorithm Efficiency",
          "Stack & Queue",
          "List and Linked List",
          "Recursion",
          "Trees (BST, AVL, Huffman)",
          "Sorting (Quick, Merge, Heap)",
          "Searching, Hashing & Graphs (DFS, BFS, Dijkstra)"
        ]
      },
      {
        "code": "BIT204CO",
        "name": "Computer Network and Data Communication",
        "credits": 3,
        "type": "Core",
        "description": "Networking fundamentals, the OSI/TCP-IP layered model, data link/network/transport layers, and network security.",
        "keyUnits": [
          "Introduction to Networking & Data Communication",
          "Layered Network Architecture (OSI, TCP/IP)",
          "Data Transmission & Physical Layer",
          "Data Link Control (Error Detection, HDLC)",
          "Network Layer (IP Addressing, Subnetting, Routing)",
          "Transport & Application Layer",
          "Network Security (Cryptography, SSL/TLS, Firewall)"
        ]
      },
      {
        "code": "BIT205CO",
        "name": "System Analysis and Design",
        "credits": 3,
        "type": "Core",
        "description": "SDLC models, process/conceptual modeling with DFDs and ERDs, systems analysis and design, and object-oriented analysis with UML.",
        "keyUnits": [
          "Overview of Systems Analysis & Design (SDLC Models)",
          "Process & Conceptual Modeling (DFD, ERD)",
          "Logic Modeling (Decision Table/Tree)",
          "Systems Analysis (Requirements, Feasibility)",
          "Systems Design & Implementation",
          "Object-Oriented Analysis & Design (UML)"
        ]
      },
      {
        "code": "BIT206CO",
        "name": "Project-III",
        "credits": 2,
        "type": "Project / Practical",
        "description": "Group project (2-3 students) developing a microcontroller (BIT202CO)-based system — 45 lab hours.",
        "keyUnits": [
          "Title Identification & Proposal Writing",
          "Mid-Term Presentation",
          "Pre-Final Submission & Final Presentation"
        ]
      }
    ]
  },
  {
    "semester": 4,
    "totalCredits": 17,
    "subjects": [
      {
        "code": "BIT251HS",
        "name": "Probability and Statistics",
        "credits": 3,
        "type": "Core",
        "description": "Descriptive statistics, probability theory, theoretical distributions, estimation, hypothesis testing, and correlation/regression.",
        "keyUnits": [
          "Nature and scope of statistics",
          "Data and its collection",
          "Classification and tabulation of data",
          "Diagrammatic and graphic presentation",
          "Measures of central tendency",
          "Measures of dispersion",
          "Probability",
          "Theoretical distribution (Binomial, Poisson, Normal, Hyper-geometric)",
          "Estimation theory and testing of hypothesis",
          "Chi-Square distribution",
          "Correlation and regression analysis"
        ]
      },
      {
        "code": "BIT252CO",
        "name": "Computer Organization and Architecture",
        "credits": 3,
        "type": "Core",
        "description": "Computer instruction sets, control unit design, CPU architecture, pipelining, memory organization, and multiprocessors.",
        "keyUnits": [
          "Introduction",
          "Computer organization and design",
          "Control unit design",
          "Central processing unit",
          "Pipeline and vector processing",
          "Computer arithmetic",
          "Input and output organization",
          "Memory organization",
          "Multiprocessor"
        ]
      },
      {
        "code": "BIT253CO",
        "name": "Operating System",
        "credits": 3,
        "type": "Core",
        "description": "Process/thread management, memory management, file systems, I/O, deadlocks, and distributed systems.",
        "keyUnits": [
          "Introduction",
          "Processes and Threads",
          "Memory Management",
          "File Systems",
          "Input/Output",
          "Deadlocks",
          "Real Time System",
          "Distributed System",
          "Case study (UNIX/LINUX/Windows/Android/iOS)"
        ]
      },
      {
        "code": "BIT254CO",
        "name": "Database Management System",
        "credits": 3,
        "type": "Core",
        "description": "DBMS architecture, relational model, SQL, normalization, database security, and transaction/query processing.",
        "keyUnits": [
          "Introduction",
          "Database System Concepts and Architecture (E-R model)",
          "Relational Model",
          "SQL (incl. PL/SQL)",
          "Integrity Constraints",
          "Normalization (1NF-5NF, BCNF)",
          "Database Security",
          "Transaction and Query Processing (ACID, concurrency, WAL)",
          "Backup and Recovery"
        ]
      },
      {
        "code": "BIT255CO",
        "name": "Programming in JAVA",
        "credits": 3,
        "type": "Core",
        "description": "Core Java OOP, GUI programming, file I/O, JDBC, socket programming, and Servlet/JSP.",
        "keyUnits": [
          "Introduction to Java",
          "Applet Programming",
          "GUI Programming (AWT/Swing)",
          "Java IO",
          "JDBC",
          "Socket Programming",
          "Distributed Application (RMI)",
          "Overview of Servlet and JSP"
        ]
      },
      {
        "code": "BIT256CO",
        "name": "Project-IV",
        "credits": 2,
        "type": "Project / Practical",
        "description": "Group application software project (up to 3 students) developed in Java, with proposal, mid-term, and final presentation.",
        "keyUnits": [
          "Title Identification & Proposal Writing",
          "Mid-Term Presentation",
          "Pre-Final Submission & Final Presentation"
        ]
      }
    ]
  },
  {
    "semester": 5,
    "totalCredits": 17,
    "subjects": [
      {
        "code": "BIT301HS",
        "name": "Research Methodology",
        "credits": 3,
        "type": "Core",
        "description": "Scientific inquiry, quantitative and qualitative research designs, hypothesis formulation, and technical writing.",
        "keyUnits": [
          "Foundations of Scientific Research",
          "Literature Review & Research Gap",
          "Research Design & Sampling Strategies",
          "Hypothesis Formulation & Testing",
          "Data Analysis & Interpretation",
          "Report Writing & Publication Ethics"
        ]
      },
      {
        "code": "BIT302CO",
        "name": "Computer Graphics",
        "credits": 3,
        "type": "Core",
        "description": "Rasterization algorithms, 2D/3D transformations, clipping, illumination, and shading.",
        "keyUnits": [
          "Display Devices & Raster Graphics",
          "Line & Circle Drawing Algorithms",
          "2D Transformations & Clipping",
          "3D Transformations & Projections",
          "Visible Surface Detection (Z-Buffer)",
          "Illumination & Shading Models"
        ]
      },
      {
        "code": "BIT303CO",
        "name": "Cryptography and Network Security",
        "credits": 3,
        "type": "Core",
        "description": "Classical and modern ciphers, public key cryptosystems, digital signatures, hash functions, and network security protocols.",
        "keyUnits": [
          "Security Concepts & Attacks",
          "Classical Encryption Techniques",
          "Symmetric Ciphers (DES, AES)",
          "Public Key Cryptography (RSA, ECC)",
          "Hash Functions & Digital Signatures",
          "Network Security Protocols (TLS, IPSec)"
        ]
      },
      {
        "code": "BIT304CO",
        "name": "Web Technology",
        "credits": 3,
        "type": "Core",
        "description": "Web technology fundamentals. Unit contents pending the official Semester V syllabus PDF — the previous entry described a React/Next.js course that is not the PU syllabus.",
        "keyUnits": []
      },
      {
        "code": "BIT305CO",
        "name": "Internet of Things",
        "credits": 3,
        "type": "Core",
        "description": "IoT fundamentals. Unit contents pending the official Semester V syllabus PDF; this subject was missing from the data entirely.",
        "keyUnits": []
      },
      {
        "code": "BIT306CO",
        "name": "Project-V",
        "credits": 2,
        "type": "Project / Practical",
        "description": "Group project carrying the semester's practical assessment. Evaluation criteria pending the official Semester V syllabus PDF.",
        "keyUnits": []
      }
    ]
  },
  {
    "semester": 6,
    "totalCredits": 17,
    "subjects": [
      {
        "code": "BIT351CO",
        "name": "Artificial Intelligence",
        "credits": 3,
        "type": "Core",
        "description": "AI foundations from agents and search through knowledge representation, learning, reasoning, expert systems, neural networks, and NLP.",
        "keyUnits": [
          "Introduction & Applications of AI",
          "Agents: PEAS, Rationality & Agent Types",
          "Uninformed & Informed Search (BFS, DFS, A*, Hill Climbing)",
          "Adversarial Search & Constraint Satisfaction (Minimax, Alpha-Beta, CSP)",
          "Knowledge Representation (Logic, Semantic Nets, FOPL)",
          "Learning Systems (Decision Trees, Reinforcement Learning)",
          "Reasoning (Monotonic, Bayesian, Case-Based)",
          "Expert Systems (Inference Engine, Forward/Backward Chaining)",
          "Artificial Neural Networks (Perceptron, Backpropagation)",
          "Natural Language Processing"
        ]
      },
      {
        "code": "BIT352CO",
        "name": "Management Information System (MIS)",
        "credits": 3,
        "type": "Core",
        "description": "Information systems in global business, IT infrastructure, decision support and executive systems, and the strategic/security role of MIS.",
        "keyUnits": [
          "Information Systems in Global Business Today",
          "Global E-Business & Collaboration",
          "Information Systems Organization & Strategy (Value Chain)",
          "IT Infrastructure & Platform Trends",
          "Business Intelligence Foundations",
          "Decision Support Systems (DSS) & Executive Information Systems (EIS)",
          "Business Information Systems (Marketing, Manufacturing, Finance)",
          "Security of Information Systems",
          "Enterprise Systems, SCM & CRM",
          "Strategic Information Systems & SISP"
        ]
      },
      {
        "code": "BIT353CO",
        "name": "Data Warehousing and Mining",
        "credits": 3,
        "type": "Core",
        "description": "Data warehouse architecture and OLAP, plus core data mining techniques — association rule mining, classification, and cluster analysis.",
        "keyUnits": [
          "Introduction to Data Mining & Data Warehousing",
          "Data Warehouse & OLAP Technology, KDD",
          "Mining Association Rules (Apriori, Market Basket Analysis)",
          "Multidimensional & Multilevel Association Rules",
          "Classification & Prediction (Decision Trees, Bayesian, k-NN)",
          "Cluster Analysis (k-Means, k-Medoids, Hierarchical Methods)"
        ]
      },
      {
        "code": "BIT354CO",
        "name": "Simulation and Modeling",
        "credits": 3,
        "type": "Core",
        "description": "Simulation concepts and system types, the Monte Carlo method, random number generation and randomness testing, and analyzing simulation output.",
        "keyUnits": [
          "Concepts of Simulation (Types, Advantages, Limitations)",
          "Monte Carlo Method",
          "Simulation of Continuous Systems (Queuing, Markov Chains)",
          "Random Numbers: Generation & Testing (Chi-Square, Poker Test)",
          "Analysis of Simulation Output & Replication of Runs",
          "Simulation Languages & Discrete/Continuous Modeling"
        ]
      },
      {
        "code": "BIT355CO",
        "name": "Software Engineering",
        "credits": 3,
        "type": "Core",
        "description": "The software engineering lifecycle — process models, project management, requirements, design, testing, and quality metrics.",
        "keyUnits": [
          "Introduction to Software Engineering",
          "Process Models (Waterfall, Prototyping, RAD, Spiral, Agile)",
          "Software Project Management (4Ps, COCOMO, Risk, Scheduling)",
          "Software Requirements & Specification",
          "Software Design (Principles, Architecture Types)",
          "Software Testing (Black-Box, White-Box, V&V)",
          "Metrics for Process & Product Quality (ISO 9000)",
          "SE Trends: Agile, XP, Cloud Computing, SOA"
        ]
      },
      {
        "code": "BIT356CO",
        "name": "Project-VI",
        "credits": 2,
        "type": "Project / Practical",
        "description": "Group web-based application project (up to 3 students) built with server-side scripting, on a topic related to Artificial Intelligence or Data Mining — 45 lab hours, evaluated across title, mid-term, and pre-final presentations.",
        "keyUnits": [
          "Title Presentation",
          "Mid-Term Presentation",
          "Server-Side Web Application Development",
          "AI or Data Mining-Related Project Topic",
          "Pre-Final Submission & Presentation"
        ]
      }
    ]
  },
  {
    "semester": 7,
    "totalCredits": 15,
    "subjects": [
      {
        "code": "BIT401CO",
        "name": "Network Programming",
        "credits": 3,
        "type": "Core",
        "description": "Client-server socket programming — TCP/UDP sockets, I/O multiplexing, broadcast/multicast, and raw sockets in C/Unix.",
        "keyUnits": [
          "Introduction to Network Programming (Client/Server Model)",
          "Elementary Operating System Calls (fork, exec, wait, IPC)",
          "TCP/UDP Transport Layer Protocols",
          "Elementary Socket Calls (socket, bind, connect, accept)",
          "Elementary TCP-UDP Socket Calls (sendto, recvfrom)",
          "I/O Multiplexing (select, poll, shutdown)",
          "Socket Options (getsockopt, setsockopt, SO_REUSEADDR)",
          "Name and Address Conversion (DNS, gethostbyname, getaddrinfo)",
          "Unix Domain Protocols (socketpair, stream/datagram)",
          "Daemon Processes and inetd Superserver",
          "Broadcast and Multicast",
          "IP Layers and Raw Sockets (ping implementation)"
        ],
        "syllabusUnits": [
          {
            "title": "Introduction to Network Programming",
            "teachingHours": 5,
            "subtopics": [
              "Introduction to computer network: client/server model",
              "Protocol Suite (ISO/OSI, TCP/IP)",
              "Unix Standards (POSIX, OpenGroup, IETF)",
              "Network Utilities (telnet, route, ipconfig, ifconfig, ping, netstat, and ftp)",
              "Introduction to programming: wrapper functions, header files, libraries and ports numbers, IP address",
              "Iterative server, concurrent server, networked servers"
            ]
          },
          {
            "title": "Elementary Operating System Calls",
            "teachingHours": 6,
            "subtopics": [
              "System call, program, thread, process, Kernel",
              "fork(), exec() and its family, waitpid(), wait()",
              "pipe(), Fifo(), signals (SIGCHLD, SIGINT, SIGIO)",
              "IPC Names, creating and opening IPC channels, IPC permissions"
            ]
          },
          {
            "title": "TCP/UDP Transport Layer Protocols",
            "teachingHours": 4,
            "subtopics": [
              "TCP (Transmission Control Protocol): features, connection establishment and termination, states in communication (LISTEN, TIME_WAIT, ESTABLISHED, BLOCKED)",
              "UDP (User Datagram Protocol): features, uses, comparison with TCP",
              "TCP and UDP buffer sizes and limitations",
              "SCTP overview"
            ]
          },
          {
            "title": "Elementary Socket Calls",
            "teachingHours": 5,
            "subtopics": [
              "Socket address structure: for IPV4, IPV6, UNIX domain socket and generic socket address structure, value-result argument",
              "Byte ordering and manipulating function: htonl(), htons(), ntohl(), ntohs(), inet_addr(), inet_aton(), inet_ntoa(), inet_pton()"
            ]
          },
          {
            "title": "Elementary TCP-UDP Socket",
            "teachingHours": 6,
            "subtopics": [
              "Socket(), connect(), bind(), listen(), accept(), read(), write(), close()",
              "sendto(), recvfrom()"
            ]
          },
          {
            "title": "I/O Multiplexing",
            "teachingHours": 4,
            "subtopics": [
              "Introduction, I/O models: blocking I/O, non-blocking I/O, I/O multiplexing, signal driven I/O (SIGIO) and asynchronous I/O model",
              "Select(), poll(), shutdown()"
            ]
          },
          {
            "title": "Socket Options",
            "teachingHours": 2,
            "subtopics": [
              "Getsockopt() and setsockopt() functions",
              "IPV4, IPV6, TCP socket options (SO_REUSEADDR, TCP_NODELAY)"
            ]
          },
          {
            "title": "Name and Address Conversion",
            "teachingHours": 2,
            "subtopics": [
              "Domain Name System, gethostbyname(), gethostbyaddr(), uname(), getservbyname() and getservbyport()",
              "gethostname() functions, socket timeouts"
            ]
          },
          {
            "title": "Unix Domain Protocol",
            "teachingHours": 3,
            "subtopics": [
              "Introduction, Unix domain socket address structure",
              "socketpair function",
              "Unix domain stream client-server, UNIX domain datagram client/server"
            ]
          },
          {
            "title": "Daemon Processes, Inetd Superservers",
            "teachingHours": 2,
            "subtopics": [
              "Introduction, Syslog facility (syslog function)",
              "daemon_init function",
              "inetd daemon configuration"
            ]
          },
          {
            "title": "Broadcast and Multicast",
            "teachingHours": 3,
            "subtopics": [
              "Introduction, Broadcast and multicast addresses",
              "Comparison between broadcast, unicast and multicast socket options",
              "Unicast versus Broadcast, multicast versus broadcast on LAN"
            ]
          },
          {
            "title": "IP Layers and Raw Socket",
            "teachingHours": 3,
            "subtopics": [
              "Introduction, raw socket creation",
              "Input and output packet processing (ping example implementation)"
            ]
          }
        ],
        "labWork": [
          "Linux command line utilities and shell programming",
          "IPC mechanisms: Pipe(), Fifo(), MessageQueue",
          "TCP, UDP and Unix Domain socket client server programs",
          "TCP echo server and client program",
          "Fork() system call process management",
          "Wait() and waitpid() system call handling",
          "Uname(), gethostbyaddr(), gethostbyname(), gethostname() system calls",
          "Shell programming for network diagnostics"
        ],
        "referenceBooks": [
          "Stevens, W. R., Unix Network Programming, Vol 1: Networking APIs - Sockets and XTI, Prentice Hall.",
          "Stevens, W. R., Unix Network Programming, Vol 2: Interprocess Communications, Prentice Hall.",
          "Comer, Douglas E., Internetworking with TCP/IP: Principles, Protocols, and Architecture, Vol 3, Prentice Hall."
        ]
      },
      {
        "code": "BIT402CO",
        "name": "Digital Governance",
        "credits": 3,
        "type": "Core",
        "description": "e-Government implementation and policy, ICT infrastructure, security, digital democracy, and case studies including Nepal's GIDC.",
        "keyUnits": [
          "Introduction to e-Government and e-Governance",
          "Public-Private Partnership for e-Government (PPP Models)",
          "ICT Infrastructure for e-Government (GIDC & Cloud)",
          "e-Government Readiness Framework",
          "Security for e-Government (Security Standards)",
          "Implementing e-Government (System Life Cycle)",
          "From Representative to Digital Democracy",
          "Citizen-Centric Remote Online Digital Governance (CRM)",
          "Applying Artificial Intelligence to Improve Performance",
          "Case Studies: Nepal (GIDC, Cyber Law), India, and Global Systems"
        ],
        "syllabusUnits": [
          {
            "title": "Introduction to e-Government and e-Governance",
            "teachingHours": 3,
            "subtopics": [
              "1.1. e-Government and e-Governance concepts and distinctions",
              "1.2. e-Government as information system",
              "1.3. Benefits of e-Government",
              "1.4. e-Government stages of development",
              "1.5. Online service delivery and electronic service delivery"
            ]
          },
          {
            "title": "Public-Private Partnership for e-Government",
            "teachingHours": 4,
            "subtopics": [
              "2.1. G2C Project models",
              "2.2. G2B Project models",
              "2.3. PPP Forms: JV Model, BOO Model, BOOT model, ASP model",
              "2.4. Issues in PPP for e-Government",
              "2.5. Citizen-centric approach to e-Government"
            ]
          },
          {
            "title": "ICT Infrastructure for e-Government",
            "teachingHours": 3,
            "subtopics": [
              "3.1. Network infrastructure",
              "3.2. Computing Infrastructure",
              "3.3. Government Data centers",
              "3.4. E-Government enterprise architecture",
              "3.5. Interoperability framework"
            ]
          },
          {
            "title": "e-Government Readiness",
            "teachingHours": 4,
            "subtopics": [
              "4.1. e-Readiness framework",
              "4.2. Steps to e-Government readiness",
              "4.3. Issues and barriers in e-Government readiness"
            ]
          },
          {
            "title": "Security for e-Government",
            "teachingHours": 5,
            "subtopics": [
              "5.1. Challenges of e-government security",
              "5.2. An approach to security for e-Government",
              "5.3. Security management model",
              "5.4. e-Government security architecture",
              "5.5. Security standards and compliance"
            ]
          },
          {
            "title": "Implementing e-Government",
            "teachingHours": 5,
            "subtopics": [
              "6.1. e-Government system life cycle and project assessment",
              "6.2. Analysis of current reality and gap analysis",
              "6.3. Design of new e-Government system",
              "6.4. e-Government risk assessment and mitigation",
              "6.5. e-Government system construction",
              "6.6. Implementation and beyond",
              "6.7. Developing e-Government hybrids"
            ]
          },
          {
            "title": "From Representative to Digital Democracy",
            "teachingHours": 3,
            "subtopics": [
              "7.1. Using Internet to increase Political Participation",
              "7.2. Online Participation and Political Organization",
              "7.3. Electronic voting and elections",
              "7.4. Protecting democratic institutions"
            ]
          },
          {
            "title": "Citizen-Centric Remote Online Digital Governance",
            "teachingHours": 3,
            "subtopics": [
              "8.1. Citizen Relationship Management (CRM) and Digital Governance",
              "8.2. Responding to citizens online",
              "8.3. From Electronic communication to Modernizing Government"
            ]
          },
          {
            "title": "Applying Artificial Intelligence to Improve Performance and Results",
            "teachingHours": 4,
            "subtopics": [
              "9.1. Assessing the Impact of Artificial Intelligence on Public Sector Performance",
              "9.2. Artificial Intelligence, Bias, Facial, and Voice recognition in public service"
            ]
          },
          {
            "title": "Case Studies and Applications of e-Government System",
            "teachingHours": 10,
            "subtopics": [
              "10.1. Nepal: Cyber Laws, ICT development project, Government Integrated Data Center (GIDC), e-Government master plan, Human resource management software",
              "10.2. India: Community information centers, e-Procurement in the government of Andhra Pradesh, e-Seva / e-Suvida",
              "10.3. Other Countries: E-Government development in South Korea, China, Brazil, Sri Lanka, Singapore, and USA"
            ]
          }
        ],
        "referenceBooks": [
          "Heeks, Richard, Implementing & Managing e-Government: An International Text, SAGE Publications.",
          "Prabhu, C. S. R., e-Governance: Concepts & Case Studies, Prentice Hall of India.",
          "Satyanarayana, J., e-Government: Technology and Management, Prentice Hall of India.",
          "Milakovich, Michael E., Digital Governance: Applying Advanced Technologies to Improve Public Services, Routledge Taylor & Francis Group."
        ]
      },
      {
        "code": "BIT421CO",
        "name": "Machine Learning (Track A)",
        "credits": 3,
        "type": "Elective",
        "description": "Theoretical concepts and practical implementations of supervised regression/classification, decision trees, model tuning, text mining, and deep neural networks in Python.",
        "keyUnits": [
          "Introduction to Machine Learning (Components & Frameworks)",
          "Supervised Learning: Regression, Classification, Decision Trees",
          "Unsupervised Learning (k-means, k-modes)",
          "Model Diagnosis and Tuning (Bias/Variance, Cross-Validation)",
          "Text Mining (Preprocessing, TF-IDF, Exploration)",
          "Deep Learning (Feedforward, CNNs, RNNs)"
        ],
        "syllabusUnits": [
          {
            "title": "Introduction to Machine Learning",
            "teachingHours": 5,
            "subtopics": [
              "Components of learning, Learning Models: Geometric, Probabilistic, Logical models",
              "Introduction to machine learning frameworks: Supervised, Unsupervised, Reinforcement Learning"
            ]
          },
          {
            "title": "Supervised Learning",
            "teachingHours": 12,
            "subtopics": [
              "Linear regression, Polynomial regression",
              "Logistic regression, Support Vector Machines (SVM)",
              "k-NN (k-Nearest Neighbors)",
              "Decision tree: Representation, ID3, C4.5, Inductive bias"
            ]
          },
          {
            "title": "Unsupervised Learning",
            "teachingHours": 4,
            "subtopics": [
              "Clustering fundamentals and similarity metrics",
              "k-means clustering algorithm and variants",
              "k-modes algorithm for categorical data"
            ]
          },
          {
            "title": "Model Diagnosis and Tuning",
            "teachingHours": 7,
            "subtopics": [
              "Evaluating a hypothesis: Bias-variance tradeoff",
              "Model selection: k-fold Cross-validation",
              "Ensemble methods: Random forests and bagging"
            ]
          },
          {
            "title": "Text Mining",
            "teachingHours": 6,
            "subtopics": [
              "Text preprocessing: Tokenization, Stopwords removal, Stemming, Lemmatization",
              "Feature representation: Bag of Words, TF-IDF",
              "Text exploration and classification"
            ]
          },
          {
            "title": "Deep Learning",
            "teachingHours": 11,
            "subtopics": [
              "Feedforward neural networks, Perceptron and Multilayer Perceptron",
              "Cost functions, Gradient descent and Backpropagation training",
              "Convolutional Neural Networks (CNNs)",
              "Recurrent Neural Networks (RNNs)"
            ]
          }
        ],
        "labWork": [
          "Data preprocessing, transformation, and exploration using Python (NumPy, Pandas, Matplotlib, Seaborn)",
          "Implementation of Linear and Polynomial Regression with Scikit-Learn",
          "Binary and multiclass Logistic Regression classification",
          "Decision Tree implementation using ID3/C4.5 and Scikit-Learn",
          "Support Vector Machine (SVM) classification with kernel tuning",
          "k-Nearest Neighbor (k-NN) classification and hyperparameter tuning",
          "k-means and hierarchical clustering algorithms implementation",
          "Text classification using TF-IDF and Naive Bayes",
          "Model evaluation using k-fold cross validation, precision, recall, and ROC-AUC metrics",
          "Building a multi-layer feedforward neural network with Backpropagation in Python / PyTorch / TensorFlow"
        ],
        "referenceBooks": [
          "Mitchell, Tom M., Machine Learning, McGraw-Hill Education.",
          "Alpaydin, Ethem, Introduction to Machine Learning, MIT Press.",
          "Goodfellow, Ian, Yoshua Bengio, and Aaron Courville, Deep Learning, MIT Press.",
          "Muller, Andreas C. and Sarah Guido, Introduction to Machine Learning with Python: A Guide for Data Scientists, O'Reilly Media."
        ]
      },
      {
        "code": "BIT422CO",
        "name": "Business Intelligence and Data Science (Track A)",
        "credits": 3,
        "type": "Elective",
        "description": "Foundations of business intelligence, data warehousing, visual analytics with Tableau/Power BI, WEKA data mining, text/web analytics, and big data architectures.",
        "keyUnits": [
          "Overview of Business Intelligence & Decision Support",
          "Data Warehousing (Architectures, ETL Processes, Real-Time DW)",
          "Business Reporting & Visual Analytics (Tableau, Power BI)",
          "Data Mining Concepts & Applications (WEKA)",
          "Text and Web Analytics (NLP, Sentiment Analysis)",
          "Big Data Analytics & Stream Processing",
          "Business Analytics Emerging Trends and Ethics"
        ],
        "syllabusUnits": [
          {
            "title": "Overview of Business Intelligence & Decision Support",
            "teachingHours": 6,
            "subtopics": [
              "Decision support systems (DSS) concept and evolution",
              "Business intelligence definitions, frameworks, and architecture",
              "OLTP vs OLAP transaction vs analytical processing models",
              "Business analytics overview: descriptive, predictive, prescriptive"
            ]
          },
          {
            "title": "Data Warehousing and ETL Processes",
            "teachingHours": 6,
            "subtopics": [
              "Data warehousing definitions, characteristics, and architectures",
              "Multidimensional data modeling: Star, Snowflake, and Fact Constellation schemas",
              "Data extraction, transformation, and loading (ETL) pipeline architecture",
              "Real-time data warehousing and operational data stores (ODS)"
            ]
          },
          {
            "title": "Business Reporting & Visual Analytics",
            "teachingHours": 6,
            "subtopics": [
              "Business reporting definitions, metrics, and report types",
              "Information visualization and visual analytics principles",
              "Performance dashboards, scorecards, and Balanced Scorecard methodology",
              "Visual analytics tools: Tableau, Microsoft Power BI, and interactive dashboards"
            ]
          },
          {
            "title": "Data Mining Concepts & Applications",
            "teachingHours": 9,
            "subtopics": [
              "Data mining definitions, process models (CRISP-DM), and taxonomy",
              "Association rule mining: Apriori algorithm and FP-Growth",
              "Classification and clustering methods in data mining",
              "Data mining software and open source toolkits: WEKA, RapidMiner"
            ]
          },
          {
            "title": "Text and Web Analytics",
            "teachingHours": 6,
            "subtopics": [
              "Text analytics and Natural Language Processing for business insights",
              "Sentiment analysis and opinion mining architectures",
              "Web mining taxonomy: Web content mining, Web structure mining, and Web usage mining",
              "Social media analytics and network metrics"
            ]
          },
          {
            "title": "Big Data Analytics & Stream Processing",
            "teachingHours": 5,
            "subtopics": [
              "Big Data definition, V-characteristics (Volume, Velocity, Variety, Veracity, Value)",
              "Hadoop ecosystem and MapReduce processing framework",
              "NoSQL database architectures for analytical workloads",
              "Real-time stream analytics and in-memory computing architectures"
            ]
          },
          {
            "title": "Business Analytics Emerging Trends and Ethics",
            "teachingHours": 7,
            "subtopics": [
              "Location-based analytics and geospatial business intelligence",
              "Automated decision making and recommendation systems",
              "Data governance, privacy laws (GDPR), and ethical considerations in analytics",
              "Cloud-based BI and analytics service models"
            ]
          }
        ],
        "labWork": [
          "Multidimensional schema design (Star and Snowflake) using SQL in PostgreSQL / MySQL",
          "ETL pipeline construction for heterogeneous data sources",
          "Building interactive executive dashboards using Tableau / Power BI",
          "Association rule mining experiments in WEKA using Apriori algorithm",
          "Classification experiments (J48 Decision Trees, Naive Bayes) using WEKA",
          "Text preprocessing and sentiment analysis using Python NLP libraries",
          "Web scraping and log file analysis for web usage mining"
        ],
        "referenceBooks": [
          "Sharda, Ramesh, Dursun Delen, and Efraim Turban, Business Intelligence, Analytics, and Data Science: A Managerial Perspective, Pearson.",
          "Inmon, W. H., Building the Data Warehouse, John Wiley & Sons.",
          "Han, Jiawei, Micheline Kamber, and Jian Pei, Data Mining: Concepts and Techniques, Morgan Kaufmann.",
          "Kimball, Ralph and Margy Ross, The Data Warehouse Toolkit: The Definitive Guide to Dimensional Modeling, Wiley."
        ]
      },
      {
        "code": "BIT423CO",
        "name": "Deep Learning (Track A)",
        "credits": 3,
        "type": "Elective",
        "description": "Neural network architectures — multilayer perceptrons, deep CNNs, RNNs, LSTMs, generative belief nets, and TensorFlow vision/speech applications.",
        "keyUnits": [
          "Basics of Artificial Neural Networks (ANN Models)",
          "Feedforward Neural Networks & Backpropagation Learning",
          "Deep Neural Networks (Optimization: Adam, Regularization)",
          "Convolutional Neural Networks (LeNet, AlexNet, VGG)",
          "Recurrent Neural Networks (LSTM, GRU, Sequence Modeling)",
          "Generative Models (RBMs, Deep Belief Nets)",
          "Applications in Vision, Speech and NLP"
        ],
        "syllabusUnits": [
          {
            "title": "Basics of Artificial Neural Networks",
            "teachingHours": 4,
            "subtopics": [
              "Biological neuron inspiration and artificial neuron models",
              "Perceptron model and perceptron learning algorithm",
              "Linear separability and the XOR problem",
              "Activation functions: Sigmoid, Tanh, ReLU, Leaky ReLU, Softmax"
            ]
          },
          {
            "title": "Feedforward Neural Networks and Backpropagation",
            "teachingHours": 5,
            "subtopics": [
              "Multi-layer perceptron (MLP) architecture",
              "Forward propagation matrix formulations",
              "Loss functions: Mean Squared Error, Cross-Entropy loss",
              "Backpropagation algorithm, chain rule derivations, and gradient descent optimization"
            ]
          },
          {
            "title": "Deep Neural Networks and Optimization",
            "teachingHours": 8,
            "subtopics": [
              "Vanishing and exploding gradient problems",
              "Optimization algorithms: Momentum, RMSProp, Adam, AdaGrad",
              "Regularization techniques: L1/L2 weight decay, Dropout, Early Stopping",
              "Batch Normalization, Layer Normalization, and hyperparameter tuning"
            ]
          },
          {
            "title": "Convolutional Neural Networks (CNNs)",
            "teachingHours": 8,
            "subtopics": [
              "Convolution operation, kernels, stride, padding, and feature maps",
              "Pooling layers: Max pooling, Average pooling",
              "CNN architectures: LeNet-5, AlexNet, VGGNet, ResNet, Inception",
              "Transfer learning and fine-tuning pretrained CNNs for image classification"
            ]
          },
          {
            "title": "Recurrent Neural Networks (RNNs)",
            "teachingHours": 7,
            "subtopics": [
              "Sequential data modeling and recurrent neuron architecture",
              "Backpropagation Through Time (BPTT)",
              "Long Short-Term Memory (LSTM) cell architecture and gates",
              "Gated Recurrent Unit (GRU) architecture",
              "Bidirectional RNNs and sequence-to-sequence architectures"
            ]
          },
          {
            "title": "Generative Models",
            "teachingHours": 7,
            "subtopics": [
              "Energy-based models and Restricted Boltzmann Machines (RBM)",
              "Deep Belief Networks (DBN) training and contrastive divergence",
              "Autoencoders and Variational Autoencoders (VAE)",
              "Generative Adversarial Networks (GAN) generator and discriminator dynamics"
            ]
          },
          {
            "title": "Applications in Vision, Speech and NLP",
            "teachingHours": 6,
            "subtopics": [
              "Object detection and image segmentation (YOLO, Mask R-CNN concepts)",
              "Acoustic modeling and speech recognition overview",
              "Word embeddings (Word2Vec, GloVe) and Transformer attention mechanisms in NLP"
            ]
          }
        ],
        "labWork": [
          "Environment setup with Python, PyTorch / TensorFlow, and CUDA GPU acceleration",
          "Building a custom MLP from scratch using NumPy with backpropagation",
          "Training deep feedforward networks with PyTorch/Keras on MNIST / CIFAR-10",
          "Implementing CNN architectures for image classification and feature visualization",
          "Applying Transfer Learning using pretrained ResNet/VGG on custom image datasets",
          "Implementing LSTM and GRU networks for sequence classification / time series forecasting",
          "Implementing an Autoencoder for image denoising and dimensionality reduction",
          "Training a simple Generative Adversarial Network (GAN) on MNIST digits"
        ],
        "referenceBooks": [
          "Goodfellow, Ian, Yoshua Bengio, and Aaron Courville, Deep Learning, MIT Press.",
          "Geron, Aurelien, Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow, O'Reilly Media.",
          "Chollet, Francois, Deep Learning with Python, Manning Publications.",
          "Zhang, Aston, Zachary C. Lipton, Mu Li, and Alexander J. Smola, Dive into Deep Learning, Cambridge University Press."
        ]
      },
      {
        "code": "BIT428CO",
        "name": "Digital Commerce (Track B)",
        "credits": 3,
        "type": "Elective",
        "description": "Electronic commerce architectures, mercantile retailing models, mobile commerce (3G/4G), digital marketing SEO, WordPress CMS, and AI chatbots.",
        "keyUnits": [
          "E-Commerce Foundations (Business Models, Security, Payments)",
          "Electronic Retailing (Consumer Mercantile Models)",
          "Introduction to Digital Commerce Trends",
          "Fundamentals of Mobile Commerce (M-Commerce, GSM/GPRS)",
          "Digital Marketing (SEO, Google Ads, Social Media)",
          "Web Content Management Systems (WordPress Development)",
          "Application of Artificial Intelligence in Commerce"
        ],
        "syllabusUnits": [
          {
            "title": "E-Commerce Foundations",
            "teachingHours": 11,
            "subtopics": [
              "Introduction to Electronic Commerce: definitions, history, and framework",
              "E-Commerce business models: B2B, B2C, C2C, C2B, G2C, and m-Commerce",
              "Electronic payment systems: digital credit cards, debit cards, smart cards, e-wallets, token-based payment",
              "Security protocols for e-commerce: SSL/TLS, SET, digital signatures, certificates, and PKI",
              "Legal, regulatory, and taxation issues in global e-commerce"
            ]
          },
          {
            "title": "Electronic Retailing",
            "teachingHours": 2,
            "subtopics": [
              "Consumer mercantile models and the consumer purchasing decision cycle",
              "Electronic store models, online catalogs, search engines, and shopping carts"
            ]
          },
          {
            "title": "Introduction to Digital Commerce Trends",
            "teachingHours": 3,
            "subtopics": [
              "Omnichannel retail strategies and social commerce",
              "Subscription business models and hyper-personalization",
              "Cross-border digital commerce logistics and supply integration"
            ]
          },
          {
            "title": "Fundamentals of Mobile Commerce",
            "teachingHours": 8,
            "subtopics": [
              "M-Commerce concepts, drivers, and architectural frameworks",
              "Mobile networks: GSM, GPRS, 3G, 4G, and 5G infrastructure constraints",
              "Mobile payment systems, contactless NFC, QR-code payment, and digital wallets",
              "Location-based services (LBS) and proximity marketing"
            ]
          },
          {
            "title": "Digital Marketing",
            "teachingHours": 8,
            "subtopics": [
              "Search Engine Optimization (SEO): on-page and off-page optimization",
              "Pay-per-click advertising: Google Ads, keyword research, and bidding strategies",
              "Social media marketing (SMM) and content marketing strategies",
              "Email marketing campaigns, conversion rate optimization (CRO), and analytics"
            ]
          },
          {
            "title": "Web Content Management Systems",
            "teachingHours": 7,
            "subtopics": [
              "Content Management System (CMS) architecture and selection criteria",
              "WordPress architecture, theme development, and plugin ecosystem",
              "E-commerce CMS implementation using WooCommerce / Shopify",
              "Product catalog configuration, payment gateway integration, and shipping calculators"
            ]
          },
          {
            "title": "Application of Artificial Intelligence in Commerce",
            "teachingHours": 6,
            "subtopics": [
              "Conversational AI: customer support chatbots and virtual assistants",
              "Personalized product recommendation algorithms (collaborative vs content-based filtering)",
              "Dynamic pricing algorithms and predictive inventory management",
              "AI-driven fraud detection in online financial transactions"
            ]
          }
        ],
        "labWork": [
          "Setting up a local web server (LAMP/XAMPP) and installing WordPress CMS",
          "Configuring an online storefront using WooCommerce with custom catalog structure",
          "Integrating sandbox payment gateways (e.g. PayPal, Stripe, local digital wallets)",
          "Conducting on-page SEO audits, keyword research, and meta tag optimization",
          "Setting up and analyzing web traffic using Google Analytics / Search Console",
          "Building an automated customer support chatbot using modern conversational AI APIs",
          "Designing a social media marketing campaign strategy and tracking conversion funnels"
        ],
        "referenceBooks": [
          "Laudon, Kenneth C. and Carol Guercio Traver, E-Commerce: Business, Technology, Society, Pearson.",
          "Turban, Efraim, David King, Jae Kyu Lee, Ting-Peng Liang, and Deborrah C. Turban, Electronic Commerce: A Managerial and Social Networks Perspective, Springer.",
          "Chaffey, Dave and Fiona Ellis-Chadwick, Digital Marketing: Strategy, Implementation and Practice, Pearson.",
          "Sabater, Sabater, WordPress for Beginners: Visual Guide to Building Websites."
        ]
      },
      {
        "code": "BIT429CO",
        "name": "Multimedia and Application (Track B)",
        "credits": 3,
        "type": "Elective",
        "description": "Multimedia data representations — audio/MIDI, image processing, video encoding, compression (JPEG/MPEG), real-time OS scheduling, and network streaming.",
        "keyUnits": [
          "Multimedia Systems (Aspects, Elements, Data Streams)",
          "Sound and Audio (Sampling, MIDI, Speech Synthesis)",
          "Images and Graphics (Formats, Image Processing)",
          "Video and Animation (Signal Representation, Formats)",
          "Data Compression (Huffman, JPEG, MPEG, H.261)",
          "Optical Storage Media (CD, DVD, Blu-Ray)",
          "Multimedia Operating Systems (Real-Time Scheduling: EDF, RM)",
          "Multimedia Communication Systems (QoS, Streaming)",
          "Documentation, Hypertext and MHEG",
          "Synchronization (Reference Models & Specifications)",
          "Abstraction of Programming & Toolkits",
          "Multimedia Applications (VOD, Video Conferencing)"
        ],
        "syllabusUnits": [
          {
            "title": "Multimedia Systems",
            "teachingHours": 3,
            "subtopics": [
              "Multimedia aspects and definitions, key elements of multimedia systems",
              "Continuous vs discrete media streams, characterization of multimedia systems"
            ]
          },
          {
            "title": "Sound and Audio",
            "teachingHours": 4,
            "subtopics": [
              "Physics of sound, sampling rate, quantization, and signal-to-quantization-noise ratio (SQNR)",
              "Audio file formats: WAV, MP3, AAC, FLAC",
              "MIDI protocol: messages, devices, synthesizers, and comparison with digital audio",
              "Speech processing: speech synthesis and recognition principles"
            ]
          },
          {
            "title": "Images and Graphics",
            "teachingHours": 4,
            "subtopics": [
              "Raster vs vector graphics representations",
              "Color models: RGB, CMYK, HSV, YUV, and color palettes",
              "Image file formats: BMP, GIF, PNG, TIFF, JPEG",
              "Basic image processing: spatial filtering, enhancement, and histogram equalization"
            ]
          },
          {
            "title": "Video and Animation",
            "teachingHours": 4,
            "subtopics": [
              "Television and video signals: Component, Composite, S-Video",
              "Analog broadcast standards (NTSC, PAL, SECAM) and digital video standards (HDTV, 4K)",
              "Principles of computer animation: keyframing, kinematics, morphing, and rendering"
            ]
          },
          {
            "title": "Data Compression",
            "teachingHours": 6,
            "subtopics": [
              "Lossless vs lossy compression fundamentals",
              "Entropy encoding: Run-length encoding (RLE), Huffman coding, Arithmetic coding, LZW",
              "Image compression: JPEG standard (DCT, quantization, entropy coding)",
              "Video compression: MPEG standards (I, P, B frames, motion estimation) and H.261/H.264"
            ]
          },
          {
            "title": "Optical Storage Media",
            "teachingHours": 4,
            "subtopics": [
              "Optical recording technology and track geometry",
              "CD-ROM, CD-R, CD-RW standards and logical formats (ISO 9660)",
              "DVD technology, DVD-Video, and Blu-Ray disc physical and logical specifications"
            ]
          },
          {
            "title": "Multimedia Operating Systems",
            "teachingHours": 4,
            "subtopics": [
              "Real-time processing requirements for continuous media",
              "Real-time scheduling algorithms: Earliest Deadline First (EDF) and Rate Monotonic (RM)",
              "Resource management, buffer management, and memory allocation in multimedia OS"
            ]
          },
          {
            "title": "Multimedia Communication Systems",
            "teachingHours": 4,
            "subtopics": [
              "Quality of Service (QoS) parameters: bandwidth, latency, jitter, packet loss rate",
              "Protocols for real-time transport: RTP, RTCP, RTSP, and RSVP",
              "Streaming media architectures, adaptive bitrate streaming (HLS, DASH), and CDN distribution"
            ]
          },
          {
            "title": "Documentation, Hypertext and MHEG",
            "teachingHours": 4,
            "subtopics": [
              "Hypertext and hypermedia concepts, nodes and links",
              "Document architecture standards: SGML, ODA (Open Document Architecture)",
              "MHEG (Multimedia and Hypermedia Information Coding Expert Group) standards"
            ]
          },
          {
            "title": "Synchronization",
            "teachingHours": 4,
            "subtopics": [
              "Notion of synchronization: intra-media vs inter-media synchronization",
              "Lip-sync synchronization requirements and skew limits",
              "Synchronization reference models and specification methods (interval-based, timeline-based)"
            ]
          },
          {
            "title": "Abstraction of Programming & Toolkits",
            "teachingHours": 2,
            "subtopics": [
              "Higher-level programming abstractions for multimedia objects",
              "Media frameworks and toolkits (DirectShow, GStreamer, QuickTime, WebRTC APIs)"
            ]
          },
          {
            "title": "Multimedia Applications",
            "teachingHours": 2,
            "subtopics": [
              "Video on Demand (VoD) system architectures and server scheduling",
              "Interactive video conferencing architectures and collaborative virtual environments"
            ]
          }
        ],
        "labWork": [
          "Audio editing and recording using Audacity (noise removal, equalizing, multi-track mixing)",
          "Raster and vector graphics manipulation using Adobe Photoshop / GIMP / Inkscape",
          "Digital video editing and compositing using Premiere Pro / DaVinci Resolve",
          "Implementation of Huffman coding and Run-Length Encoding in C/C++ or Python",
          "Implementation of basic 2D keyframe animation using HTML5 Canvas / CSS / Blender",
          "Benchmarking video compression codecs (H.264 vs H.265) on file size and PSNR quality",
          "Setting up a real-time media streaming server using RTSP / RTMP with OBS and VLC"
        ],
        "referenceBooks": [
          "Steinmetz, Ralf and Klara Nahrstedt, Multimedia: Computing, Communications & Applications, Pearson Education.",
          "Li, Ze-Nian, Mark S. Drew, and Jiangchuan Liu, Fundamentals of Multimedia, Springer.",
          "Buford, John F. Koegel, Multimedia Systems, Addison-Wesley.",
          "Vaughan, Tay, Multimedia: Making It Work, McGraw-Hill Education."
        ]
      },
      {
        "code": "BIT435CO",
        "name": "GIS (Track C)",
        "credits": 3,
        "type": "Elective",
        "description": "Geographic Information Systems — spatial/attribute data, raster vs vector structures, map projections (UTM), spatial querying, and Nepal GIS applications.",
        "keyUnits": [
          "Basic Concepts & Components of GIS",
          "GIS Data & Databases (Raster & Vector Structures)",
          "GIS Data Input (Digitization, GPS & Remote Sensing)",
          "GIS Mapping & Map Projections (UTM)",
          "Data Editing in GIS (Error Correction, Rubber Sheeting)",
          "Spatial Analysis (Buffering, Overlay, Network Connectivity)",
          "Spatial Data Infrastructure (SDI & NSDI Standards)",
          "GIS in Nepal (Current Situation & Major Activities)"
        ],
        "syllabusUnits": [
          {
            "title": "Basic Concepts & Components of GIS",
            "teachingHours": 4,
            "subtopics": [
              "Definition and components of GIS (Hardware, Software, Data, People, Methods)",
              "Functionality of GIS",
              "Areas of GIS application",
              "Advantages and limitations of GIS"
            ]
          },
          {
            "title": "GIS Data & Database",
            "teachingHours": 8,
            "subtopics": [
              "Spatial and attribute data concepts",
              "Spatial data handling",
              "Data representations: points, lines, polygons",
              "Information organization and data structures: Raster and Vector data structures, Tessellations",
              "File organization and formats",
              "Geo-database concepts and GIS software packages"
            ]
          },
          {
            "title": "GIS Data Input",
            "teachingHours": 6,
            "subtopics": [
              "Nature and source of spatial data",
              "Methods of spatial data capture: Primary and Secondary sources",
              "Digitization and scanning methods, techniques and procedures for digitizing, errors of digitization",
              "Attribute data capture",
              "GPS and Remote Sensing integration for data collection"
            ]
          },
          {
            "title": "GIS Mapping and Map Projections",
            "teachingHours": 8,
            "subtopics": [
              "Defining maps, categories of maps, map contents and map scales",
              "Georeferencing principles and coordinate systems",
              "Projection systems: types and aspects (cylindrical, conical, azimuthal)",
              "Universal Transverse Mercator (UTM) coordinate system"
            ]
          },
          {
            "title": "Data Editing in GIS",
            "teachingHours": 4,
            "subtopics": [
              "Detecting and correcting topological errors",
              "Re-projection, coordinate transformation, and map generalization",
              "Edge matching and rubber sheeting",
              "Conversion from other digital sources and CAD formats"
            ]
          },
          {
            "title": "Spatial Analysis",
            "teachingHours": 7,
            "subtopics": [
              "Types of spatial analysis and measurements in GIS",
              "Query by attributes and spatial queries (point-in-polygon, line-in-polygon)",
              "Attribute-based operations",
              "Neighborhood analysis and buffering",
              "Connectivity analysis and network routing",
              "Overlay operations (union, intersect, identity) and coverage rebuilding"
            ]
          },
          {
            "title": "Data Sharing and Spatial Data Infrastructure",
            "teachingHours": 6,
            "subtopics": [
              "Concept of Geospatial Infrastructure",
              "Components of Spatial Data Infrastructure (SDI): Standards, Metadata, Data Sharing Clearinghouse",
              "National Spatial Data Infrastructure (NSDI) frameworks"
            ]
          },
          {
            "title": "GIS in Nepal",
            "teachingHours": 2,
            "subtopics": [
              "Present situation of GIS in Nepal",
              "Major GIS activities and national geospatial initiatives",
              "Prospects and challenges of GIS implementation in Nepal"
            ]
          }
        ],
        "labWork": [
          "Introduction to QGIS / ArcGIS interface, tools, and plugins",
          "Georeferencing scanned toposheets using ground control points (GCPs)",
          "Vectorization and digitization: creating shapefiles for points, lines, and polygons",
          "Attribute table creation, editing, joins, and spatial queries",
          "Thematic map production: symbology, labeling, layout preparation, scale, and north arrow",
          "Vector spatial analysis: Buffering, Clip, Intersect, and Union operations",
          "Raster spatial analysis: Digital Elevation Model (DEM) slope, aspect, and hillshade generation",
          "Creating a complete GIS project map report for a selected region in Nepal"
        ],
        "referenceBooks": [
          "Burrough, P. A. and R. A. McDonnell, Principles of Geographical Information Systems, Oxford University Press.",
          "Star, J. and J. Estes, Geographic Information Systems: An Introduction, Prentice Hall.",
          "Chang, Kang-Tsung, Introduction to Geographic Information Systems, Tata McGraw-Hill.",
          "Lo, C. P. and Albert K. W. Yeung, Concepts and Techniques of Geographic Information Systems, Prentice Hall of India.",
          "Heywood, Ian, Sarah Cornelius, Steve Carver, and Srinivasa Raju, An Introduction to Geographical Information Systems, Pearson Education.",
          "Bhatta, Basudeb, Remote Sensing and GIS, Oxford University Press.",
          "Lee, J. and D. W. S. Wong, Statistical Analysis with ArcView GIS, John Wiley & Sons."
        ]
      },
      {
        "code": "BIT436CO",
        "name": "Remote Sensing (Track C)",
        "credits": 3,
        "type": "Elective",
        "description": "Electromagnetic radiation spectrum, sensor platforms and satellite orbits, Landsat/Sentinel imagery, digital image processing, and GIS-RS integration.",
        "keyUnits": [
          "Concept and Scope of Remote Sensing Systems",
          "Electromagnetic Radiation (EMR Spectrum & Signatures)",
          "Sensor Characteristics (Whiskbroom, Pushbroom, Resolutions)",
          "Remote Sensor Platforms and Satellite Orbits (Sun-Synchronous)",
          "Space Imaging Satellites (IRS, Landsat, SPOT, High-Res)",
          "Integration of GIS and Remote Sensing",
          "Applications of Remote Sensing"
        ],
        "syllabusUnits": [
          {
            "title": "Concept and Scope of Remote Sensing",
            "teachingHours": 8,
            "subtopics": [
              "Definitions, process, and characteristics of Remote Sensing systems",
              "Types and components of Remote Sensing",
              "Advantages and limitations of satellite remote sensing"
            ]
          },
          {
            "title": "Concept of Electromagnetic Radiation (EMR)",
            "teachingHours": 8,
            "subtopics": [
              "Wavelength-frequency-energy relationship of EMR",
              "EMR spectrum and its properties across visible, infrared, and microwave bands",
              "EMR wavelength regions and their specific applications",
              "Atmospheric windows and atmospheric scattering (Rayleigh, Mie, Non-selective)",
              "Interactions of EMR with matter, energy interaction in the atmosphere, energy interactions with Earth surface features",
              "Spectral signatures of vegetation, soil, and water"
            ]
          },
          {
            "title": "Types and Characteristics of Sensor",
            "teachingHours": 10,
            "subtopics": [
              "Sensor materials and detector arrays",
              "Sensor systems: Framing and Scanning systems (Whiskbroom scanner, Push-broom scanner, Side-looking scanner)",
              "Imaging and non-imaging sensors; Active and passive sensors",
              "Resolutions of sensors: Spectral, Spatial, Radiometric, and Temporal resolution",
              "Scale, mapping unit, multi-band concepts, and False Color Composites (FCC)"
            ]
          },
          {
            "title": "Remote Sensor Platforms and Satellite Orbits",
            "teachingHours": 8,
            "subtopics": [
              "Ground, Airborne, and Space-borne platforms",
              "Orbital characteristics: Coverage, Passes, Pointing accuracy",
              "Geostationary orbits, Sun-synchronous orbits, Shuttle orbits, Semisynchronous orbits (Molniya orbit), and Quasi-zenith satellite orbits"
            ]
          },
          {
            "title": "Space Imaging Satellites",
            "teachingHours": 7,
            "subtopics": [
              "Early history of space imaging systems",
              "Multispectral and Hyperspectral sensors; RADAR and LiDAR systems",
              "Specifications of popular Earth resource satellites: IRS, LANDSAT, and SPOT series",
              "High resolution satellites: IKONOS, Cartosat, QuickBird, OrbView, WorldView",
              "Recent Earth observation satellite constellations (Sentinel, PlanetScope)"
            ]
          },
          {
            "title": "Integration of GIS and Remote Sensing",
            "teachingHours": 2,
            "subtopics": [
              "Mechanisms of integrating satellite imagery with GIS layers",
              "Data interchange formats and coordinate alignment",
              "Updating GIS databases using remote sensing imagery"
            ]
          },
          {
            "title": "Applications of Remote Sensing",
            "teachingHours": 2,
            "subtopics": [
              "Agricultural monitoring and crop yield estimation",
              "Forestry and land use / land cover (LULC) change detection",
              "Water resources, flood mapping, and glacial lake monitoring",
              "Urban planning and disaster impact assessment in Nepal"
            ]
          }
        ],
        "labWork": [
          "Downloading satellite imagery (Landsat 8/9, Sentinel-2) from USGS EarthExplorer / Copernicus Open Access Hub",
          "Displaying satellite bands and creating True Color and False Color Composites (FCC) in QGIS / ERDAS",
          "Radiometric and atmospheric correction of raw satellite data",
          "Geometric correction and image-to-image registration",
          "Calculating vegetation indices: Normalized Difference Vegetation Index (NDVI) and NDWI",
          "Supervised image classification using Maximum Likelihood / Random Forest",
          "Unsupervised image classification using k-means / ISODATA",
          "Accuracy assessment: confusion matrix, overall accuracy, and Kappa coefficient calculation"
        ],
        "referenceBooks": [
          "Joseph, George, Fundamentals of Remote Sensing, Universities Press.",
          "Gupta, Ravi P., Remote Sensing Geology, Springer.",
          "Bhatta, Basudeb, Remote Sensing and GIS, Oxford University Press.",
          "Levin, Noam, Fundamental of Remote Sensing, Research Press.",
          "Sabins, Floyd F., Remote Sensing: Principles and Interpretation, W. H. Freeman & Co.",
          "Lillesand, Thomas M., Ralph W. Kiefer, and Jonathan W. Chipman, Remote Sensing and Image Interpretation, John Wiley & Sons."
        ]
      },
      {
        "code": "BIT437CO",
        "name": "Data Center and Disaster Recovery Centers (Track C)",
        "credits": 3,
        "type": "Elective",
        "description": "Modern data center design, power redundancy, fire protection, cooling optimization, cloud data centers, and enterprise disaster recovery planning.",
        "keyUnits": [
          "Introduction to Data Center Types and Architecture",
          "The Role and Objectives of Data Centers (Standards & Tiers)",
          "Design Overview (Cooling, Power Redundancy, Cabling)",
          "Managing the Data Center (Processes, Decommissioning, Security)",
          "Data Center Industry Market and Trends",
          "Cloud Data Centers",
          "Disaster Recovery Center Formulation and DR Plans"
        ],
        "syllabusUnits": [
          {
            "title": "Introduction to Data Centre",
            "teachingHours": 5,
            "subtopics": [
              "Defining a modern enterprise data centre",
              "Identifying the main data centre types: Enterprise, Colocation, Managed, and Cloud",
              "Business service delivery options and SLAs",
              "Emerging delivery models and future computing demands"
            ]
          },
          {
            "title": "The Role and Objectives of a Data Centre",
            "teachingHours": 7,
            "subtopics": [
              "Driving factors and business value for establishing a data centre",
              "Data centre standards (ANSI/TIA-942, Uptime Institute Tier Standards I-IV)",
              "Data centre availability models and uptime considerations",
              "Location selection, civil building, and geophysical hazard considerations",
              "Analyzing reliability, MTBF, and MTTR in the data center",
              "Data center energy efficiency metrics: PUE (Power Usage Effectiveness) and DCiE",
              "Data center system capacity planning"
            ]
          },
          {
            "title": "Design Overview and Infrastructure",
            "teachingHours": 10,
            "subtopics": [
              "Criticality and availability considerations",
              "Fire protection methods in the data center: gaseous suppression (FM-200, Novec 1230), pre-action sprinklers",
              "Structured cabling strategies (horizontal, backbone, fiber vs copper, cable trays)",
              "Thermal management: maintaining humidity, hot/cold aisle containment, CRAC/CRAH units",
              "Physical security: biometric access, perimeter security, surveillance cameras",
              "Power management: utility feeds, diesel backup generators, UPS topologies (N, N+1, 2N), and PDUs",
              "Physical infrastructure: server rack fundamentals (42U), floor loading, row vs room-based cooling",
              "The four key constraints (4C's): Power, Cooling, IT Infrastructure, and Space"
            ]
          },
          {
            "title": "Managing the Data Centre",
            "teachingHours": 6,
            "subtopics": [
              "Regulations, best practices, and operational processes (ITIL, ISO 27001)",
              "Moves, adds, and changes (MAC) processes and change management",
              "Efficient energy management and thermal audit techniques",
              "Asset lifecycle and secure decommissioning processes",
              "Logical, IT, and network perimeter security integration"
            ]
          },
          {
            "title": "The Data Centre Industry and Market",
            "teachingHours": 5,
            "subtopics": [
              "Global and regional market size and economic drivers",
              "Hyperscale data center trends and edge computing",
              "Powering the Internet: green energy adoption, carbon neutrality, and renewable power",
              "Case studies of modern hyperscale facilities (Google, Microsoft, AWS)"
            ]
          },
          {
            "title": "Cloud Data Center",
            "teachingHours": 4,
            "subtopics": [
              "Cloud data center architecture and software-defined infrastructure (SDDC)",
              "Virtualization layers: compute, storage (SAN/NAS), and software-defined networking (SDN)",
              "Multi-tenant isolation and cloud workload orchestration"
            ]
          },
          {
            "title": "Disaster Recovery Center Formulation and DR Plans",
            "teachingHours": 8,
            "subtopics": [
              "Disaster Recovery Plan (DRP) formulation steps",
              "Business continuity planning (BCP) vs disaster recovery: RTO and RPO metrics",
              "Data backup strategies: Full, Incremental, Differential, and continuous replication",
              "Cloud-based disaster recovery (DRaaS) architectures",
              "Disaster recovery site tiers: Cold site, Warm site, and Hot site architectures"
            ]
          }
        ],
        "labWork": [
          "Formulation and presentation of a comprehensive Disaster Recovery Center Planning Document for an enterprise (compulsory for 20 internal practical marks)",
          "Calculation of PUE (Power Usage Effectiveness) and cooling loads for a simulated 50-rack server room",
          "Designing hot/cold aisle containment layout using data center modeling software / CAD",
          "Designing redundant power distribution topology (dual UPS feeds, ATS, and standby generator sizing)",
          "Configuring automated database backup and remote snapshot replication to a DR site",
          "Simulating disaster failover and calculating achieved Recovery Time Objective (RTO) and Recovery Point Objective (RPO)"
        ],
        "referenceBooks": [
          "Lowe, Scott D., James Green, and David Davis, Building a Modern Data Center: Principles and Strategies of Design, ActualTech Media, New York.",
          "Arregoces, Mauricio and Maurizio Portolani, Data Center Fundamentals, Cisco Press.",
          "Khan, Samee Ullah and Albert Y. Zomaya, Handbook on Data Centers, Springer.",
          "Rothstein, Philip Jan, IT Disaster Recovery Planning For Dummies, Wiley Publishing Inc.",
          "Snevely, Robert, Enterprise Data Center Design and Methodology, Prentice Hall."
        ]
      },
      {
        "code": "BIT403CO",
        "name": "Internship",
        "credits": 3,
        "type": "Project / Practical",
        "description": "45-hour supervised internship at a partner organization (bank, hospital, software company, telecom, or government IT unit), evaluated via proposal defense, mid-term, and end-term report.",
        "keyUnits": [
          "Proposal Defense & Organization Placement (10%)",
          "Mid-Term Progress Review & System Design (30%)",
          "System Analysis, Implementation & Testing",
          "Final Internship Report (APA Format) & Viva (60%)"
        ],
        "syllabusUnits": [
          {
            "title": "Proposal Defense & Organization Placement",
            "teachingHours": 10,
            "subtopics": [
              "Partner organization identification (Bank, Hospital, Software Company, Telecom, or Government IT Unit)",
              "Problem identification, scope definition, and internship plan preparation (first 2 weeks)",
              "Proposal defense presentation (10% weight: 5% topic selection, 5% presentation) evaluated by supervisor and mentor"
            ]
          },
          {
            "title": "Mid-Term Progress Review & System Design",
            "teachingHours": 15,
            "subtopics": [
              "System requirements specification (SRS) and architecture modeling",
              "Database design, ER diagrams, and normalized schema",
              "Mid-term progress presentation and prototype demo (30% weight: 10% program design, 10% demo, 10% viva) after 2 months"
            ]
          },
          {
            "title": "System Implementation & Quality Testing",
            "teachingHours": 10,
            "subtopics": [
              "Module implementation, database connectivity, and backend API integration",
              "System testing: Unit testing, integration testing, and bug fixing",
              "Evaluation of professional code quality, security, and documentation"
            ]
          },
          {
            "title": "Final Internship Report & University Viva",
            "teachingHours": 10,
            "subtopics": [
              "Technical report writing according to APA format (Abstract, Intro, System Analysis, System Design, Implementation, Testing, Future Enhancements, References)",
              "Preparation of individual project portfolios (max 3 students per group)",
              "End-term final defense (60% weight: 15% depth of work, 25% report, 10% presentation, 10% external viva) before Purbanchal University external examiner"
            ]
          }
        ],
        "labWork": [
          "Duration: 3 Credits (minimum 45 contact lab/industry hours) at approved partner organization (Bank, Hospital, Software Company, Telecom, or Government IT Unit).",
          "Internship Plan: Formal submission of objectives, problem statement, and milestone schedule within the first two weeks under assigned advisor.",
          "Group Size: Maximum 3 students per team, with individual document and portfolio preparation.",
          "Proposal Defense (10% weight): Topic selection with proposal (5%) and presentation (5%) evaluated by Supervisor and Mentor.",
          "Mid-Term Review (30% weight, after 2 months): Program design (10%), prototype demo presentation (10%), and oral viva (10%).",
          "End-Term Defense (60% weight): Depth of work (15%), formal internship report in APA 7th Edition format (25%), external viva (10%), and final presentation (10%) evaluated with external examiner from Purbanchal University."
        ],
        "referenceBooks": [
          "American Psychological Association, Publication Manual of the American Psychological Association (7th ed.), 2020.",
          "Purbanchal University, Faculty of Science & Technology, Guidelines for Undergraduate Internship and Project Works."
        ]
      }
    ]
  },
  {
    "semester": 8,
    "totalCredits": 15,
    "subjects": [
      {
        "code": "BIT451MS",
        "name": "Principles of Management and Entrepreneurship in IT",
        "credits": 3,
        "type": "Core",
        "description": "Management fundamentals, organization design, entrepreneurship, business planning, and IT product marketing/technology transfer.",
        "keyUnits": [
          "Introduction to Management Principles and Functions",
          "Organization Design and Decentralization",
          "The Foundation of Entrepreneurship",
          "Feasibility Analysis and Crafting Winning Business Plans",
          "Forms of Business Ownership and Franchising",
          "Building a Powerful Marketing Plan (Guerrilla Marketing)",
          "Location Selection and Layout Optimization",
          "E-Commerce and the Entrepreneur",
          "Entrepreneur of IT (Technology Transfer & Innovation)"
        ],
        "syllabusUnits": [
          {
            "title": "Introduction to Management Principles and Functions",
            "teachingHours": 3,
            "subtopics": [
              "Concept and scope of management",
              "Levels, principles, and functions of management",
              "Roles and skills of managers",
              "Women in organizational hierarchy and leadership"
            ]
          },
          {
            "title": "Organization Design and Decentralization",
            "teachingHours": 3,
            "subtopics": [
              "Concept, principles, and benefits of organizing",
              "Approaches to organization structure and design",
              "Departmentation methods",
              "Formal and informal organizations",
              "Authority, responsibility, and delegation",
              "Decentralization of authority"
            ]
          },
          {
            "title": "The Foundation of Entrepreneurship",
            "teachingHours": 5,
            "subtopics": [
              "The world of the entrepreneur: definition and entrepreneurial mindset",
              "Benefits and potential drawbacks of entrepreneurship",
              "Behind the boom: factors driving the entrepreneurial fire",
              "Cultural diversity of entrepreneurship",
              "The ten deadly mistakes of entrepreneurship and how to avoid the pitfalls"
            ]
          },
          {
            "title": "Feasibility Analysis and Crafting Winning Business Plans",
            "teachingHours": 5,
            "subtopics": [
              "Conducting a comprehensive feasibility analysis (Product/Service, Financial, Industry)",
              "Why develop a business plan: strategic and funding imperatives",
              "Elements and structural outline of a professional business plan",
              "Making the business plan pitch and executive presentation",
              "Standard business plan formatting guidelines"
            ]
          },
          {
            "title": "Forms of Business Ownership and Franchising",
            "teachingHours": 4,
            "subtopics": [
              "Sole proprietorship, partnership, and corporation structures",
              "Other forms of ownership (LLCs, Joint Ventures)",
              "Types of franchising",
              "Benefits and drawbacks of buying a franchise",
              "The right way to evaluate and acquire a franchise"
            ]
          },
          {
            "title": "Building a Powerful Marketing Plan",
            "teachingHours": 4,
            "subtopics": [
              "Building a guerrilla marketing plan",
              "Pinpointing the target market and market segmentation",
              "Determining customer needs and wants through market research",
              "Plotting guerrilla marketing strategies on a bootstrap budget",
              "Marketing on the World Wide Web and the modern marketing mix (4Ps/4Cs)"
            ]
          },
          {
            "title": "Choosing the Right Location and Layout",
            "teachingHours": 4,
            "subtopics": [
              "Location as a source of competitive advantage",
              "Location criteria and options for service, retail, and manufacturing businesses",
              "Layout optimization: maximizing revenues, increasing operational efficiency, and reducing costs"
            ]
          },
          {
            "title": "E-Commerce and the Entrepreneur",
            "teachingHours": 5,
            "subtopics": [
              "Benefits of selling on the Web for startups",
              "Factors to consider before launching into e-commerce",
              "Twelve myths of e-commerce",
              "Strategies for successful e-commerce execution",
              "Designing a high-converting web storefront",
              "Tracking web results and web analytics",
              "Ensuring customer privacy and transaction security"
            ]
          },
          {
            "title": "Entrepreneur of IT and Technology Transfer",
            "teachingHours": 8,
            "subtopics": [
              "Marketing Information Technology products",
              "Technological life cycle and adoption curves",
              "Classification of buyers in the IT market",
              "Technological SWOT analysis and techno-ready marketing",
              "How and why customers adopt information technology innovations",
              "Issues in technology management and intellectual property protection",
              "Mechanisms and modes of international technology transfer to developing nations",
              "Information technology as the wealth of nations",
              "Case study and student presentations based on Chapters 8 & 9 [4 Hrs]"
            ]
          }
        ],
        "referenceBooks": [
          "Koontz, Harold and Heinz Weihrich, Essentials of Management, Tata McGraw-Hill.",
          "Zimmerer, Thomas W. and Norman M. Scarborough, Essentials of Entrepreneurship and Small Business Management, Prentice Hall.",
          "Kotler, Philip and Gary Armstrong, Principles of Marketing, Pearson Education Asia.",
          "Hisrich, Robert D., Michael P. Peters, and Dean A. Shepherd, Entrepreneurship, McGraw-Hill."
        ]
      },
      {
        "code": "BIT452CO",
        "name": "Distributed and Cloud Computing",
        "credits": 3,
        "type": "Core",
        "description": "Distributed systems fundamentals and cloud computing service/deployment models, virtualization, and cloud security.",
        "keyUnits": [
          "Distributed Systems Fundamentals (RPC, RMI, Consistency)",
          "Cloud Computing Service Models (IaaS, PaaS, SaaS, Serverless)",
          "Virtualization Technologies (Hypervisors, Containers, K8s)",
          "Cloud Storage and Big Data Architectures",
          "Cloud Security, IAM and Shared Responsibility"
        ],
        "referenceBooks": [
          "Tanenbaum, Andrew S. and Maarten van Steen, Distributed Systems: Principles and Paradigms, Prentice Hall.",
          "Buyya, Rajkumar, Christian Vecchiola, and S. Thamarai Selvi, Mastering Cloud Computing: Foundations and Applications Programming, Morgan Kaufmann / McGraw Hill.",
          "Coulouris, George, Jean Dollimore, Tim Kindberg, and Gordon Blair, Distributed Systems: Concepts and Design, Addison-Wesley.",
          "Hwang, Kai, Jack Dongarra, and Geoffrey C. Fox, Distributed and Cloud Computing: From Parallel Processing to the Internet of Things, Morgan Kaufmann."
        ]
      },
      {
        "code": "BIT471CO",
        "name": "Natural Language Processing (Track A)",
        "credits": 3,
        "type": "Elective",
        "description": "Speech and language processing, morphological parsing with FSTs, N-grams, HMM POS tagging, feature unification, WordNet lexical semantics, and discourse pragmatics.",
        "keyUnits": [
          "Introduction to NLP (Linguistic Organization, CFG Parsing)",
          "Morphology & Phonology (Parsing with FSTs, Phonological Rules)",
          "Pronunciation, Spelling and N-grams (Smoothing, Language Models)",
          "Syntax: POS Tagging (HMM Tagger, Transformation-based)",
          "Sentence Level Construction & Unification Semantics",
          "Lexical Semantics (WordNet, Homonymy, WSD)",
          "Pragmatics and Discourse Structure"
        ],
        "syllabusUnits": [
          {
            "title": "Introduction to NLP",
            "teachingHours": 6,
            "subtopics": [
              "Definition, issues, and strategies in speech and language processing",
              "Application domains and software tools for NLP",
              "Linguistic organization of NLP, Natural Language Processing vs Programming Language Processing",
              "Word classes, review of Regular Expressions, Context-Free Grammars (CFG), and parsing techniques"
            ]
          },
          {
            "title": "Morphology and Phonology",
            "teachingHours": 7,
            "subtopics": [
              "Inflectional and derivational morphology",
              "Morphological parsing with Finite State Transducers (FSTs) and combinational rules",
              "Phonology: Speech sounds, phonetic transcription (IPA), phoneme definitions and phonological rules",
              "Optimality theory and machine learning of phonological rules",
              "Phonological aspects of prosody and speech synthesis (TTS)"
            ]
          },
          {
            "title": "Pronunciation, Spelling and N-grams",
            "teachingHours": 7,
            "subtopics": [
              "Spelling error detection and correction using probabilistic noisy channel models",
              "Pronunciation variation: lexical, allophonic, and dialectal variations",
              "Decision tree models for pronunciation",
              "Counting words in corpora and simple N-gram language models",
              "Smoothing techniques: Add-One (Laplace), Witten-Bell, Good-Turing discounting",
              "N-grams for spelling correction and pronunciation modeling"
            ]
          },
          {
            "title": "Syntax and Part-of-Speech Tagging",
            "teachingHours": 6,
            "subtopics": [
              "Penn Treebank tagsets and word categories",
              "Concept of Hidden Markov Model (HMM) taggers",
              "Rule-based vs stochastic POS tagging",
              "Viterbi algorithm for HMM decoding and tagging",
              "Transformation-Based Learning (Brill) tagger"
            ]
          },
          {
            "title": "Sentence Level Construction & Unification Semantics",
            "teachingHours": 7,
            "subtopics": [
              "Noun phrase structures, co-ordination, and sub-categorization",
              "Concept of feature structures and unification",
              "Representing Meaning: Unambiguous representation, canonical form, expressiveness, meaning structure of language",
              "Basics of First-Order Predicate Calculus (FOPC) in semantic interpretation",
              "Syntax-driven semantic analysis, attachment, integration, and robustness"
            ]
          },
          {
            "title": "Lexical Semantics",
            "teachingHours": 6,
            "subtopics": [
              "Lexemes and semantic relationships: homonymy, polysemy, synonymy, hyponymy",
              "WordNet taxonomy and relational database structure",
              "Internal structure of words, metaphors, and metonymy with computational approaches",
              "Word Sense Disambiguation (WSD): Selectional restriction-based, machine learning-based, and dictionary-based (Lesk algorithm) approaches"
            ]
          },
          {
            "title": "Pragmatics and Discourse Structure",
            "teachingHours": 6,
            "subtopics": [
              "Discourse reference resolution and referential phenomena",
              "Syntactic and semantic constraints on co-reference",
              "Pronoun resolution algorithms (Hobbs algorithm, centering theory)",
              "Text coherence and discourse rhetorical structure",
              "Dialogues: Turns and utterances, grounding, dialogue acts and conversational structures",
              "Natural Language Generation (NLG): introduction to language generation architecture and discourse planning"
            ]
          }
        ],
        "labWork": [
          "Text processing using Python NLTK and spaCy (tokenization, stopword removal, lemmatization)",
          "Building a morphological analyzer using Finite State Transducers (FST)",
          "Implementing an N-gram language model with Laplace and Good-Turing smoothing",
          "Implementing the Viterbi algorithm for Hidden Markov Model (HMM) POS tagging",
          "Rule-based and stochastic chunking and Named Entity Recognition (NER)",
          "Synset extraction, semantic similarity calculation, and sense disambiguation using WordNet",
          "Building a rule-based or probabilistic chatbot demonstrating dialogue state tracking"
        ],
        "referenceBooks": [
          "Jurafsky, Daniel and James H. Martin, Speech and Language Processing: An Introduction to Natural Language Processing, Computational Linguistics, and Speech Recognition, Pearson Education.",
          "Allen, James, Natural Language Understanding, Benjamin/Cummings.",
          "Bharati, Akshar, Vineet Chaitanya, and Rajeev Sangal, Natural Language Processing: A Paninian Perspective, Prentice Hall of India.",
          "Charniak, Eugene, Statistical Language Learning, MIT Press.",
          "Manning, Christopher D. and Hinrich Schutze, Foundations of Statistical Natural Language Processing, MIT Press."
        ]
      },
      {
        "code": "BIT472MS",
        "name": "Supply Chain Analytics (Track A)",
        "credits": 3,
        "type": "Elective",
        "description": "Data analytics and machine learning applied to supply chain management — data preparation in Python, Seaborn visualization, customer RFM segmentation, supplier risk, and demand forecasting.",
        "keyUnits": [
          "Introduction to Supply Chain Analytics & SMART Goals",
          "Data-Driven Supply Chains (Python Setup)",
          "Data Manipulation & Indexing in Python",
          "Data Visualization (Seaborn, Geospatial Mapping)",
          "Customer Management (Cohort & RFM Analysis, Clustering)",
          "Supply Management & Supplier Risk Regression",
          "Warehouse and Inventory Optimization",
          "Demand Forecasting (Time Series Methods)",
          "Logistics Management & Route Optimization"
        ],
        "syllabusUnits": [
          {
            "title": "Introduction to Supply Chain Analytics",
            "teachingHours": 4,
            "subtopics": [
              "Definition of Supply Chain and need for supply chain management",
              "Structure of supply chains, processes, flows, and strategic decision making",
              "Supply chain analytics definitions, value proposition, and role of AI",
              "Defining SMART goals and KPIs for supply chain optimization"
            ]
          },
          {
            "title": "Data-Driven Supply Chains with Python",
            "teachingHours": 5,
            "subtopics": [
              "Data-driven decision making in supply chain environments",
              "Setting up the Python analytics runtime environment (Jupyter, NumPy, Pandas)",
              "Structure of tabular data, variables, and series data types",
              "Data cleaning, outlier treatment, and missing value imputation in supply datasets"
            ]
          },
          {
            "title": "Data Manipulation & Indexing in Python",
            "teachingHours": 5,
            "subtopics": [
              "Pandas data manipulation: indexing, slicing, filtering, and grouping",
              "Data aggregation, pivoting, and merging disparate logistical datasets",
              "Feature engineering for delivery performance and transit time calculations"
            ]
          },
          {
            "title": "Data Visualization & Geospatial Analysis",
            "teachingHours": 5,
            "subtopics": [
              "Exploratory data visualization using Seaborn and Matplotlib",
              "Distribution plots, correlation heatmaps, and trend analysis",
              "Geospatial visualization of supplier locations, transport corridors, and delivery zones"
            ]
          },
          {
            "title": "Customer Management & RFM Segmentation",
            "teachingHours": 6,
            "subtopics": [
              "Customer relationship analytics in supply chain operations",
              "Customer cohort analysis and churn prediction",
              "Recency, Frequency, Monetary (RFM) customer segmentation",
              "k-means clustering for behavioral customer categorization"
            ]
          },
          {
            "title": "Supply Management & Supplier Risk Analysis",
            "teachingHours": 5,
            "subtopics": [
              "Procurement analytics and supplier performance scorecarding",
              "Assessing supplier delivery risk using multiple linear regression and logistic regression",
              "Lead time variability analysis and supplier reliability benchmarking"
            ]
          },
          {
            "title": "Warehouse and Inventory Optimization",
            "teachingHours": 5,
            "subtopics": [
              "Inventory management metrics: Economic Order Quantity (EOQ), Reorder Point (ROP), Safety Stock",
              "ABC and XYZ inventory classifications",
              "Warehouse slotting optimization and picking path efficiency"
            ]
          },
          {
            "title": "Demand Forecasting",
            "teachingHours": 5,
            "subtopics": [
              "Importance of demand forecasting in mitigating the Bullwhip Effect",
              "Quantitative time series methods: Moving Averages, Exponential Smoothing (Holt-Winters)",
              "Evaluating forecast accuracy: MAD, MSE, RMSE, and MAPE metrics"
            ]
          },
          {
            "title": "Logistics Management & Route Optimization",
            "teachingHours": 5,
            "subtopics": [
              "Transportation modes, freight logistics, and carrier selection",
              "Logistics network design and facility location decisions",
              "Route optimization fundamentals and Vehicle Routing Problem (VRP) solving with Python"
            ]
          }
        ],
        "labWork": [
          "There shall be laboratory classes on data visualization as applied to supply chain analytics using Python:",
          "1. Importing, cleaning, and preprocessing multi-source supply chain transaction datasets using Pandas",
          "2. Visualizing order volumes, delivery delays, and supplier lead times using Seaborn heatmaps and histograms",
          "3. Implementing RFM (Recency, Frequency, Monetary) segmentation with Scikit-Learn k-means on customer shipment data",
          "4. Building a regression model in Python to predict supplier delivery delays based on distance and order size",
          "5. Implementing EOQ and safety stock simulation algorithms in Python",
          "6. Forecasting product demand using Holt-Winters exponential smoothing and evaluating MAPE errors",
          "7. Solving a transportation route optimization problem using Linear Programming (PuLP / SciPy)"
        ],
        "referenceBooks": [
          "Liu, Kurt Y., Supply Chain Analytics: Concepts, Techniques and Applications, Palgrave Macmillan.",
          "Tipi, Nicoleta, Supply Chain Analytics and Modelling: Quantitative Tools and Applications, Kogan Page Ltd.",
          "Chopra, Sunil and Peter Meindl, Supply Chain Management: Strategy, Planning, and Operation, Pearson.",
          "Feigin, Gerald, Supply Chain Planning and Analytics: The Right Product in the Right Place at the Right Time, Business Expert Press."
        ]
      },
      {
        "code": "BIT478CO",
        "name": "Big Data (Track B)",
        "credits": 3,
        "type": "Elective",
        "description": "Big data paradigms in business intelligence — MapReduce workflow anatomy, NoSQL databases (HBase, Cassandra, MongoDB), HDFS storage, and Hadoop HiveQL tools.",
        "keyUnits": [
          "Introduction to Big Data (Distributed Systems, Trends)",
          "MapReduce Applications (Workflows, Optimization, Locality)",
          "Data Management & Taxonomy of NoSQL Implementations",
          "Fundamentals of Hadoop (HDFS, Streaming, Pipes, I/O)",
          "Hadoop Tools: HBase, Cassandra, Pig Latin, Hive & HiveQL"
        ],
        "syllabusUnits": [
          {
            "title": "Introduction to Big Data",
            "teachingHours": 5,
            "subtopics": [
              "Overview of Big Data and comparison with traditional database architectures",
              "Background of Data Analytics and emergence of distributed systems",
              "Big Data usage in distributed systems and cloud platforms",
              "Development history and milestones of Big Data technologies",
              "Current trends in Big Data Analytics",
              "Benefits and real-world applications of Big Data (telecom, healthcare, e-commerce, banking)"
            ]
          },
          {
            "title": "MapReduce Applications",
            "teachingHours": 8,
            "subtopics": [
              "MapReduce fundamentals and programming model",
              "MapReduce workflows, mappers, reducers, partitioners, and combiners",
              "Anatomy of a MapReduce job execution run",
              "Fault tolerance, node failures, and speculative execution",
              "Real-world problems solved via MapReduce",
              "Scalability goals, optimization techniques, and data locality exploitation",
              "Parallel efficiency and performance bottlenecks of MapReduce"
            ]
          },
          {
            "title": "Data Management & Taxonomy of NoSQL Implementations",
            "teachingHours": 12,
            "subtopics": [
              "Structured, semi-structured, and unstructured data management",
              "Taxonomy of NoSQL implementations: Key-Value, Document, Column-Family, and Graph stores",
              "Schemaless database designs and CAP theorem implications (Consistency, Availability, Partition tolerance)",
              "Basic architecture, data models, and query mechanisms of Apache HBase, Apache Cassandra, and MongoDB",
              "Partitioning, sharding, replication, and composing analytical calculations over NoSQL datastores"
            ]
          },
          {
            "title": "Fundamentals of HADOOP",
            "teachingHours": 10,
            "subtopics": [
              "Analyzing data at scale with Apache Hadoop",
              "Hadoop Distributed File System (HDFS): NameNode, DataNode, Secondary NameNode, blocks, and replication topology",
              "HDFS command line interface and file operations",
              "Hadoop Streaming and Hadoop Pipes for multi-language execution",
              "Hadoop I/O: Data integrity, compression codecs, serialization formats (Avro, Parquet, SequenceFiles)"
            ]
          },
          {
            "title": "Hadoop Tools: HBase, Cassandra, Pig, and Hive",
            "teachingHours": 10,
            "subtopics": [
              "Apache HBase architecture: RegionServers, ZooKeeper coordination, and column-family storage",
              "Apache Cassandra peer-to-peer gossip protocol and CQL operations",
              "Apache Pig: Architecture, Pig Latin execution environment, data types, and relational operations",
              "Apache Hive: Hive architecture, HiveQL queries, metastore configurations, managed vs external tables, and partitioning"
            ]
          }
        ],
        "labWork": [
          "Setting up a single-node and pseudo-distributed Apache Hadoop cluster in Linux",
          "Performing HDFS file system operations (uploading, retrieving, block status verification)",
          "Writing, compiling, and executing a WordCount MapReduce job in Java / Python Streaming",
          "Installing and executing CRUD operations in MongoDB and Apache Cassandra",
          "Writing and executing Pig Latin scripts for data filtering, grouping, and joining large datasets",
          "Creating Hive databases, schemas, and executing HiveQL queries against external datasets",
          "Executing analytical queries using Apache HBase and integrating with Hadoop"
        ],
        "referenceBooks": [
          "White, Tom, Hadoop: The Definitive Guide (3rd/4th ed.), O'Reilly Media.",
          "Minelli, Michael, Michelle Chambers, and Ambiga Dhiraj, Big Data, Big Analytics: Emerging Business Intelligence and Analytic Trends for Today's Businesses, Wiley.",
          "Sadalage, Pramod J. and Martin Fowler, NoSQL Distilled: A Brief Guide to the Emerging World of Polyglot Persistence, Addison-Wesley Professional.",
          "Sammer, Eric, Hadoop Operations, O'Reilly Media.",
          "George, Lars, HBase: The Definitive Guide, O'Reilly Media."
        ]
      },
      {
        "code": "BIT479CO",
        "name": "Mobile App Development (Track B)",
        "credits": 3,
        "type": "Elective",
        "description": "Mobile application development on Android — UI layouts, activity lifecycles, intents, SQLite databases, REST API consumption, location services, and Google Play Store deployment.",
        "keyUnits": [
          "Introduction to Mobile Devices & Architectures",
          "Mobile Platforms & Wireless Communication Constraints",
          "Introduction to Android Platform (ART, Tools, Manifest)",
          "Android Application Design Essentials (Layouts, Recycler View)",
          "Writing Basic Applications (Context, Activities, Intents)",
          "Data Handling in Android (SQLite, Preferences, Content Providers)",
          "Developing Real-Time Applications (Telephony, RESTful APIs)",
          "Debugging, Testing & Deployment (Play Store Distribution)",
          "Recent Concepts: App Monetization, Location Kit, ML Kit"
        ],
        "syllabusUnits": [
          {
            "title": "Introduction to Mobile Devices & Architectures",
            "teachingHours": 5,
            "subtopics": [
              "History of mobile devices and mobile computing evolution",
              "Modern mobile operating systems: Android, iOS architecture comparison",
              "Hardware architecture of smartphones: SoC, ARM processors, power constraints, sensors, and wireless radios"
            ]
          },
          {
            "title": "Mobile Platforms & Wireless Communication Constraints",
            "teachingHours": 4,
            "subtopics": [
              "Wireless network standards: Wi-Fi, Bluetooth BLE, Cellular (3G/4G/5G)",
              "Mobile communication constraints: intermittent connectivity, latency, battery consumption, and bandwidth throttling",
              "Offline-first mobile application design principles and data synchronization strategies"
            ]
          },
          {
            "title": "Introduction to Android Platform",
            "teachingHours": 5,
            "subtopics": [
              "Android OS architecture: Linux Kernel, Hardware Abstraction Layer (HAL), Android Runtime (ART/Dalvik), Native C/C++ libraries, and Application Framework",
              "Android development tooling: Android Studio, Gradle build system, Android SDK, and ADB",
              "Android Project Anatomy: AndroidManifest.xml, java/kotlin sources, res directory, and Gradle scripts"
            ]
          },
          {
            "title": "Android Application Design Essentials",
            "teachingHours": 6,
            "subtopics": [
              "UI layout components: LinearLayout, RelativeLayout, ConstraintLayout, and FrameLayout",
              "Core UI widgets: TextView, EditText, Button, ImageView, CheckBox, RadioButton, and Spinner",
              "Lists and dynamic collections: RecyclerView, LayoutManagers, ViewHolders, and Custom Adapters",
              "Material Design components, themes, styles, and responsive layout guidelines"
            ]
          },
          {
            "title": "Writing Basic Applications & Core Components",
            "teachingHours": 6,
            "subtopics": [
              "Android core components: Activity, Service, BroadcastReceiver, ContentProvider",
              "Activity lifecycle: onCreate(), onStart(), onResume(), onPause(), onStop(), onDestroy()",
              "Intents and Intent Filters: Explicit vs Implicit Intents, passing bundle data, starting activities for results",
              "Fragments: lifecycle, fragment manager, and tablet/phone adaptive layouts"
            ]
          },
          {
            "title": "Data Handling in Android",
            "teachingHours": 6,
            "subtopics": [
              "Internal and external file storage",
              "SharedPreferences for key-value settings storage",
              "Local structured databases: SQLite database helpers and Android Room ORM library",
              "Content Providers: sharing data between applications and querying system contacts/media"
            ]
          },
          {
            "title": "Developing Real-Time Applications & Networking",
            "teachingHours": 6,
            "subtopics": [
              "Background processing: Threads, Coroutines, WorkManager, and Services",
              "Consuming RESTful APIs using HTTP libraries (Retrofit, OkHttp, Volley) and JSON parsing",
              "Telephony and SMS APIs in Android",
              "Push notifications using Firebase Cloud Messaging (FCM)"
            ]
          },
          {
            "title": "Debugging, Testing & Deployment",
            "teachingHours": 4,
            "subtopics": [
              "Android debugging with Logcat, breakpoints, and Android Profiler (CPU, Memory, Network)",
              "Unit testing with JUnit and UI testing with Espresso",
              "Generating signed APKs and Android App Bundles (AAB)",
              "Google Play Store publishing guidelines, permissions, and app privacy compliance"
            ]
          },
          {
            "title": "Recent Concepts & Advanced Android APIs",
            "teachingHours": 3,
            "subtopics": [
              "Location-based services: Google Maps API, Fused Location Provider, geofencing",
              "On-device machine learning with Google ML Kit",
              "App monetization models: in-app purchases, Google AdMob banner/interstitial ads, and subscriptions"
            ]
          }
        ],
        "labWork": [
          "Setting up Android Studio, configuring virtual devices (AVD), and running a 'Hello World' app",
          "Designing complex responsive UI layouts using ConstraintLayout and Material Design",
          "Implementing multi-screen navigation using Activities, Fragments, and Explicit/Implicit Intents with bundle parameters",
          "Building a dynamic list feed using RecyclerView with custom adapters and item click listeners",
          "Persisting user preferences and application settings using SharedPreferences",
          "Implementing full CRUD operations on a local SQLite / Room database",
          "Consuming a third-party REST API asynchronously using Retrofit, displaying data, and handling loading/error states",
          "Integrating Google Maps API to display user location with custom map markers",
          "Building and testing a complete end-to-end Android application and generating a release APK"
        ],
        "referenceBooks": [
          "Phillips, Bill, Chris Stewart, and Kristin Marsicano, Android Programming: The Big Nerd Ranch Guide (4th ed.), Big Nerd Ranch Guides.",
          "Talukder, Asoke K. and Roopa R. Yavagal, Mobile Computing: Technology, Applications, and Service Creation, McGraw-Hill Communications Engineering.",
          "Collins, Charlie, Michael Galpin, and Matthias Kaeppler, Android in Practice, Manning Publications.",
          "Smyth, Neil, Android Studio Development Essentials, Payload Media."
        ]
      },
      {
        "code": "BIT485CO",
        "name": "Incident Response and Management System (Track C)",
        "credits": 3,
        "type": "Elective",
        "description": "Incident command systems (NEOC/DEOC), early warning alert systems, multi-agency response, disaster recovery portals, and cyber threats to critical infrastructure.",
        "keyUnits": [
          "Introduction to Incident Response Systems (NEOC/DEOC)",
          "Functioning of IRS (Chain of Command, Unified Command)",
          "Resources and Infrastructure Management (Incident Action Plan)",
          "Incident Decision System and Reporting (Early Warning, Media)",
          "Disaster Recovery Portals (DRR Portals, Real-Time Data)",
          "Phases of Disaster Management (Mitigation, Response, Recovery)",
          "Cyber Threats and Disaster Management (DR Sites, Fake News)"
        ],
        "syllabusUnits": [
          {
            "title": "Introduction to Incident Response System",
            "teachingHours": 5,
            "subtopics": [
              "Introduction to Incident Response Systems and Incident Command System (ICS) origins",
              "Incident Response System (IRS) terminology, principles, and characteristics",
              "Organization of National Emergency Operation Centers (NEOC), Provincial Emergency Operation Centers (PEOC), and District Emergency Operation Centers (DEOC) in Nepal"
            ]
          },
          {
            "title": "Functioning of Incident Response System",
            "teachingHours": 6,
            "subtopics": [
              "Chain of command and unity of command principles",
              "Unified Command across multi-agency disaster operations",
              "Management by objectives and operational period planning",
              "Incident action planning (IAP) process and documentation",
              "Span of control management and resource typing"
            ]
          },
          {
            "title": "Resources and Infrastructure Management",
            "teachingHours": 6,
            "subtopics": [
              "Resource management: ordering, mobilizing, tracking, and demobilizing physical and human resources",
              "Incident facility setup: Incident Command Post (ICP), Staging Areas, Bases, Camps, and Helispots",
              "Interoperable communications: frequency coordination, communication plans, and public safety radio networks"
            ]
          },
          {
            "title": "Incident Decision System and Reporting",
            "teachingHours": 6,
            "subtopics": [
              "Incident assessment, situation awareness, and decision support tools",
              "Early Warning Systems (EWS) integration and siren/broadcast network triggers",
              "Multi-agency coordination systems (MACS) and Emergency Support Functions (ESFs)",
              "Public information officer (PIO) role, media briefings, and rumor control during emergencies"
            ]
          },
          {
            "title": "Disaster Recovery Portals & Information Systems",
            "teachingHours": 6,
            "subtopics": [
              "Disaster Risk Reduction (DRR) portals and emergency information repositories in Nepal (Bipad Portal, Sahana)",
              "Real-time sensor data feeds: hydrological river gauges, seismological alerts, weather radar",
              "Crowdsourcing and volunteer-generated data in disaster response",
              "Geographic Information Systems (GIS) for real-time situational mapping"
            ]
          },
          {
            "title": "Phases of Disaster Management",
            "teachingHours": 8,
            "subtopics": [
              "Disaster management cycle: Mitigation, Preparedness, Response, and Recovery",
              "Mitigation strategies: structural and non-structural interventions",
              "Preparedness planning: standard operating procedures (SOPs), simulations, and drills",
              "Emergency search, rescue, triage, and relief distribution operations",
              "Post-disaster needs assessment (PDNA), build-back-better recovery, and critical infrastructure rehabilitation"
            ]
          },
          {
            "title": "Cyber Threats and Disaster Management",
            "teachingHours": 8,
            "subtopics": [
              "Critical information infrastructure (CII) protection during national crises",
              "Cyberattacks targeting emergency services, hospitals, power grids, and telecommunication switches",
              "Disaster recovery sites for emergency operation centers and communication redundancy",
              "Combating fake news, misinformation, and panic on social media during disaster situations"
            ]
          }
        ],
        "referenceBooks": [
          "Faggiano, Vincent, John McNall, and Thomas T. Gillespie, Critical Incident Management: A Complete Response Guide (2nd ed.), CRC Press, New York.",
          "Molino, Louis N. Sr., Emergency Incident Management Systems: Fundamentals and Applications, John Wiley & Sons.",
          "Schnepp, Rob, Ron Vidal, and Chris Hawley, Incident Management for Operations, O'Reilly Media.",
          "Rothstein, Philip Jan, Disaster Recovery Handbook, Amacom, New York.",
          "Government of Nepal, Ministry of Home Affairs, National Emergency Operation Center (NEOC) Standard Operating Procedures."
        ]
      },
      {
        "code": "BIT486CO",
        "name": "Climate Change Risk Management (Track C)",
        "credits": 3,
        "type": "Elective",
        "description": "Climate change science, greenhouse warming physics, climate impacts in Nepal, indicators, extreme weather adaptation, ICT for green growth, and CIRA risk analysis.",
        "keyUnits": [
          "Overview of Climate Change Science",
          "Causes of Climate Change (Greenhouse Effect, Earth Radiative Budget)",
          "Future of Climate Change (GHG Projections, Ocean Acidification)",
          "Climate Change Impacts (Nepal Sectoral Impacts)",
          "Climate Change Indicators (Glacial Lake Outbursts, Phenology)",
          "Climate Change and Extreme Weather Adaptation",
          "ICT for Climate Change and Green Growth",
          "Climate Change Impacts and Risk Analysis (CIRA Framework)"
        ],
        "syllabusUnits": [
          {
            "title": "Overview of Climate Change Science",
            "teachingHours": 5,
            "subtopics": [
              "Weather vs climate, climate system components (Atmosphere, Hydrosphere, Cryosphere, Lithosphere, Biosphere)",
              "Historical climate variability, ice age cycles, and modern anthropogenic warming trends",
              "Intergovernmental Panel on Climate Change (IPCC) assessment reports and global climate treaties (UNFCCC, Paris Agreement)"
            ]
          },
          {
            "title": "Causes of Climate Change",
            "teachingHours": 6,
            "subtopics": [
              "Greenhouse effect physics and Earth's radiative equilibrium budget",
              "Greenhouse gases: Carbon dioxide (CO2), Methane (CH4), Nitrous oxide (N2O), Fluorinated gases, and global warming potential (GWP)",
              "Natural radiative forcing (volcanic aerosols, solar cycles) vs anthropogenic forcing (fossil fuel emissions, deforestation, industrial agriculture)"
            ]
          },
          {
            "title": "Future of Climate Change & Projections",
            "teachingHours": 5,
            "subtopics": [
              "Global Climate Models (GCMs) and Regional Climate Models (RCMs)",
              "IPCC Representative Concentration Pathways (RCPs) and Shared Socioeconomic Pathways (SSPs)",
              "Global temperature rise projections, sea level rise, and ocean acidification"
            ]
          },
          {
            "title": "Climate Change Impacts in Nepal",
            "teachingHours": 6,
            "subtopics": [
              "Himalayan vulnerability: Third Pole warming amplification and snowpack retreat",
              "Impacts on water resources: glacial retreat, streamflow volatility, and hydroelectricity vulnerability",
              "Agricultural impacts: crop yield fluctuations, shifts in agro-ecological zones, and food security",
              "Forestry and biodiversity: species migration, habitat disruption, and forest fires",
              "Public health impacts: vector-borne disease expansion and heat stress"
            ]
          },
          {
            "title": "Climate Change Indicators & Extreme Events",
            "teachingHours": 5,
            "subtopics": [
              "Glacial Lake Outburst Floods (GLOFs) in Nepal: risk factors, monitoring, and early warning drainage",
              "Extreme weather phenomena: erratic monsoons, cloudbursts, intense flash flooding, and prolonged droughts",
              "Phenological shifts in flora and fauna as climate indicators"
            ]
          },
          {
            "title": "Climate Change Adaptation and Disaster Risk Management",
            "teachingHours": 6,
            "subtopics": [
              "Climate change mitigation vs adaptation strategies",
              "Community-Based Adaptation (CBA) and Ecosystem-Based Adaptation (EbA)",
              "Nepal's National Adaptation Plan (NAP) and Local Adaptation Plans for Action (LAPA)",
              "Climate finance mechanisms: Green Climate Fund (GCF), clean development mechanisms, and carbon trading"
            ]
          },
          {
            "title": "ICT for Climate Change and Green Growth",
            "teachingHours": 6,
            "subtopics": [
              "Role of Information and Communication Technology in climate monitoring and green growth",
              "Remote sensing satellite imagery and IoT weather sensor networks for environmental monitoring",
              "Green IT concepts: reducing data center carbon footprint, energy-efficient algorithms, and e-waste management",
              "Smart grids, precision agriculture, and ICT-enabled carbon accounting"
            ]
          },
          {
            "title": "Climate Change Impacts and Risk Analysis (CIRA Framework)",
            "teachingHours": 6,
            "subtopics": [
              "Climate Change Impacts and Risk Analysis (CIRA) framework methodology",
              "Quantitative hazard, vulnerability, and exposure risk assessment models",
              "Cost-benefit analysis of climate adaptation interventions and resilience building"
            ]
          }
        ],
        "referenceBooks": [
          "Houghton, John, Global Warming: The Complete Briefing (5th ed.), Cambridge University Press.",
          "IPCC, Climate Change 2021: The Physical Science Basis. Contribution of Working Group I to the Sixth Assessment Report of the Intergovernmental Panel on Climate Change, Cambridge University Press.",
          "Feenstra, Jan F., Ian Burton, Joel B. Smith, and Richard S. J. Tol, Handbook on Methods for Climate Change Impact Assessment and Adaptation Strategies, UNEP.",
          "O'Neill, M., Green IT for Sustainable Business Practice, British Computer Society.",
          "Kuehr, R. and E. Williams (eds.), Computers and the Environment: Understanding and Managing Their Impacts, Kluwer Academic Publishers."
        ]
      },
      {
        "code": "BIT487CO",
        "name": "Disaster Governance (Track C)",
        "credits": 3,
        "type": "Elective",
        "description": "Digital governance models for disaster risk reduction — knowledge repositories, Sendai Framework, disaster mitigation planning, and emergency response mobilization.",
        "keyUnits": [
          "Overview of Digital Governance in Disaster Management",
          "Knowledge Management in Digital Governance",
          "Overview of Disasters & Sendai Framework",
          "Disaster Governance Effectiveness and SDGs",
          "Governance in Disaster Mitigation (Infrastructure Planning)",
          "Governance in Disaster Preparedness (NSDRM Nepal, Evacuation)",
          "Governance in Disaster Response (Resource Deployment)",
          "Governance in Disaster Recovery (Critical Infrastructure Restoration)"
        ],
        "syllabusUnits": [
          {
            "title": "Overview of Digital Governance in Disaster Management",
            "teachingHours": 5,
            "subtopics": [
              "Definitions and conceptual foundations of disaster governance",
              "Electronic and digital governance models applied to Disaster Risk Reduction (DRR)",
              "Institutional mechanisms: role of central, provincial, and local governments in emergency governance",
              "Public-private partnerships and civic society involvement in disaster resilience"
            ]
          },
          {
            "title": "Knowledge Management in Digital Governance",
            "teachingHours": 5,
            "subtopics": [
              "Knowledge management definitions, cycles, and organizational memory in disaster contexts",
              "Establishing disaster knowledge repositories and open data portals (e.g. Nepal DRR portal)",
              "Information sharing protocols, taxonomies, and cross-agency data standardisation",
              "Lessons-learned mechanisms and post-incident review knowledge transfer"
            ]
          },
          {
            "title": "Overview of Disasters & Sendai Framework",
            "teachingHours": 6,
            "subtopics": [
              "Disaster taxonomy: natural, technological, and complex humanitarian emergencies",
              "The Sendai Framework for Disaster Risk Reduction (2015-2030): four priorities for action and global targets",
              "Hyogo Framework for Action review and progress transition",
              "Aligning national disaster policies with the Sendai Framework"
            ]
          },
          {
            "title": "Disaster Governance Effectiveness and SDGs",
            "teachingHours": 5,
            "subtopics": [
              "Metrics and indicators for evaluating disaster governance effectiveness",
              "Interlinkages between Disaster Risk Reduction and the Sustainable Development Goals (SDGs)",
              "Governance challenges: political will, bureaucratic coordination, resource constraints, and corruption risks in relief funding"
            ]
          },
          {
            "title": "Governance in Disaster Mitigation",
            "teachingHours": 6,
            "subtopics": [
              "Legal and regulatory frameworks for hazard mitigation (building codes, land-use zoning)",
              "Critical infrastructure protection policies and structural resilience regulations",
              "Enforcing disaster safety compliance across private and public sectors",
              "Mainstreaming disaster risk reduction into national economic and development planning"
            ]
          },
          {
            "title": "Governance in Disaster Preparedness",
            "teachingHours": 6,
            "subtopics": [
              "National Strategy for Disaster Risk Management (NSDRM) of Nepal and Disaster Risk Reduction and Management (DRRM) Act 2017",
              "Early warning governance: institutional command, alert dissemination, and SOP protocols",
              "Evacuation planning, emergency stockpiling, and institutional readiness audits",
              "Civil society, community, and volunteer mobilization governance"
            ]
          },
          {
            "title": "Governance in Disaster Response",
            "teachingHours": 6,
            "subtopics": [
              "Command and control governance during emergency operations",
              "Multi-agency coordination: military, police, civil administration, Red Cross, and NGOs",
              "Emergency resource deployment, supply chain oversight, and customs facilitation for international humanitarian aid",
              "Public emergency communications, media briefings, and citizen transparency during crises"
            ]
          },
          {
            "title": "Governance in Disaster Recovery and Reconstruction",
            "teachingHours": 6,
            "subtopics": [
              "Post-Disaster Needs Assessment (PDNA) governance and reconstruction authorities (e.g. National Reconstruction Authority - NRA Nepal)",
              "Build Back Better principles in physical reconstruction and livelihood restoration",
              "Accountability, financial auditing, and anti-corruption safeguards in recovery grants and reconstruction funds",
              "Restoring critical governmental IT infrastructure and public service continuity"
            ]
          }
        ],
        "referenceBooks": [
          "Subramanian, R., Disaster Management, Vikas Publishing House, India.",
          "Bumgarner, Jeffrey B., Emergency Management: A Reference Handbook, ABC-CLIO.",
          "Cahill, Kevin M., More with Less: Disasters in an Era of Diminishing Resources, Fordham University Press.",
          "Birkland, Thomas A., Lessons of Disaster: Policy Change after Catastrophic Events, Georgetown University Press.",
          "Government of Nepal, Disaster Risk Reduction and Management (DRRM) Act, 2017."
        ]
      },
      {
        "code": "BIT453CO",
        "name": "Apprentice Project",
        "credits": 3,
        "type": "Project / Practical",
        "description": "45-hour capstone project developing a 2-tier/3-tier/n-tier application with client-side and server-side scripting on any RDBMS.",
        "keyUnits": [
          "Title Identification & Proposal Writing (10 Marks)",
          "Mid-Term Architecture & DB Design Presentation (20 Marks)",
          "Pre-Final Application Submission & Demo (30 Marks)",
          "Final Documentation (APA Format: 20 Marks), Presentation (10) & Viva (10)"
        ],
        "labWork": [
          "Duration: 45 Lab Hours dedicated capstone project development assigned to every student.",
          "Technology Scope: Complete 2-tier, 3-tier, or n-tier application using client-side scripting, server-side scripting, and any modern RDBMS / SQL database.",
          "Internal Assessment (60 Marks total):",
          "1. Title identification and formal Proposal Writing (10 Marks)",
          "2. Mid-term presentation, architectural design, and database schema demo (20 Marks)",
          "3. Pre-final application submission, code demonstration, and internal presentation (30 Marks)",
          "External Assessment (40 Marks total):",
          "1. Final Project Documentation in APA Format (20 Marks)",
          "2. Final Presentation before University External Examiner (10 Marks)",
          "3. Oral Viva Voce examination (10 Marks)"
        ],
        "referenceBooks": [
          "American Psychological Association, Publication Manual of the American Psychological Association (7th ed.), 2020.",
          "Pressman, Roger S. and Bruce R. Maxim, Software Engineering: A Practitioner's Approach, McGraw-Hill.",
          "Purbanchal University, Faculty of Science & Technology, Guidelines for Apprentice Capstone Project Documentation."
        ]
      }
    ]
  }
];
