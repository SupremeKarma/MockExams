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
    // Verified against the official Purbanchal University BIT Semester I
    // course syllabus (current/new course, codes BIT101CO-106CO) —
    // see bulk-imports/syllabus-sources/ for the source document.
    semester: 1,
    totalCredits: 17,
    subjects: [
      {
        code: "BIT101CO",
        name: "Fundamentals of Information Technology",
        credits: 3,
        type: "Core",
        description: "Computer components and history, hardware and storage, software and databases, networks and the internet, and emerging IT trends.",
        keyUnits: ["Introduction to Computer", "Basic Computer Organization and Computer Peripherals", "Computer Storage", "Computer Software", "Introduction to Database", "Networks and Internet", "Information Security", "Computer Hardware", "Technological trends in Information Technology"]
      },
      {
        code: "BIT102HS",
        name: "Mathematics-I",
        credits: 3,
        type: "Core",
        description: "Matrix algebra, coordinate systems and geometry, vectors and solid geometry, and applications of differentiation.",
        keyUnits: ["Matrix Algebra", "Coordinate Systems", "Elementary Coordinate Geometry", "Vectors and Solid Geometry", "Applications of Differentiation", "Applications of the Definite Integral", "Functions of Several Variables"]
      },
      {
        code: "BIT103HS",
        name: "Technical Communication",
        credits: 3,
        type: "Core",
        description: "Oral presentation skills, intensive and extensive reading, and professional business/technical writing.",
        keyUnits: ["Oral Communication", "Reading: Intensive and Extensive", "Writing"]
      },
      {
        code: "BIT104HS",
        name: "Society and Ethics in IT",
        credits: 3,
        type: "Core",
        description: "Sociology fundamentals, social and cultural change, Nepali society, professional ethics in IT, and emotional intelligence.",
        keyUnits: ["Introduction", "Social and Cultural Change", "Understanding Development", "Process of Transformation", "Historical Characteristics of Nepali Society and Culture", "Ethical issues in IT", "Introduction to Emotional Intelligence", "Social Management and Responsibility"]
      },
      {
        code: "BIT105CO",
        name: "Computer Programming in C",
        credits: 3,
        type: "Core",
        description: "Procedural programming fundamentals in C — control flow, arrays, functions, pointers, structures, and file handling.",
        keyUnits: ["Problem Solving with Computer", "Elements of C", "Input and Output", "Operators and Expression", "Control Statements", "Arrays", "Functions", "Pointers", "Structure and Union", "Files and File Handling in C", "Introduction to Graphics"]
      },
      {
        code: "BIT106CO",
        name: "Project-I",
        credits: 2,
        type: "Project / Practical",
        description: "Group software project (2-3 students) built in C, covering requirement gathering through implementation and oral defense — 45 lab hours.",
        keyUnits: ["Information Gathering & Requirements", "Algorithms & Flowcharts", "Coding & Implementation", "Documentation & Final Presentation"]
      }
    ]
  },
  {
    // Verified against the official Purbanchal University BIT Semester II
    // (current/new course) syllabus — codes BIT151HS-156CO — see
    // bulk-imports/syllabus-sources/ for the source document.
    semester: 2,
    totalCredits: 17,
    subjects: [
      {
        code: "BIT151HS",
        name: "Mathematics-II",
        credits: 3,
        type: "Core",
        description: "Multiple integrals, differential equations, Fourier series, and functions of a complex variable.",
        keyUnits: ["Multiple Integrals", "Differential Equations of the First Order", "Linear Differential Equations", "Fourier Series and Integrals", "Functions of a Complex Variable", "Complex Series, Residues and Poles"]
      },
      {
        code: "BIT152CO",
        name: "Digital Logic",
        credits: 3,
        type: "Core",
        description: "Number systems, Boolean algebra, combinational and sequential circuit design, registers and counters.",
        keyUnits: ["Number Systems", "Boolean Algebra and Logic Gates", "Simplification of Boolean Functions", "Combinational Logic", "Sequential Logic", "Registers and Counters"]
      },
      {
        code: "BIT153HS",
        name: "Discrete Structure",
        credits: 3,
        type: "Core",
        description: "Set theory, counting, logic, relations, graphs and trees, order relations, and automata theory.",
        keyUnits: ["Set Theory and Matrices", "Function and Counting", "Logic", "Relation and Digraphs", "Graph and Tree", "Order Relation and Structure", "Automata, Language and Grammar"]
      },
      {
        code: "BIT154CO",
        name: "Object-Oriented Programming in C++",
        credits: 3,
        type: "Core",
        description: "C++ OOP fundamentals — classes, constructors, operator overloading, inheritance, polymorphism, templates, and file handling.",
        keyUnits: ["Introduction to Object Oriented Programming", "C++ Programming Concept", "Functions Used in C++", "Classes and Objects", "Constructor & Destructor", "Operator Overloading", "Inheritance", "Virtual Functions and Polymorphism", "File Handling", "Templates and Namespaces", "Exception Handling"]
      },
      {
        code: "BIT155MS",
        name: "Financial Management and Accounting",
        credits: 3,
        type: "Core",
        description: "Financial management fundamentals, capital budgeting and structure, and core accounting processes and statements.",
        keyUnits: ["Nature of Financial Management", "Time Value of Money", "Capital Budgeting", "Working Capital", "Capital Structure", "Dividends", "Nature of Accounting", "Accounting Process", "Financial Statement", "Financial Analysis", "Cash Flow Statement - Direct Method"]
      },
      {
        code: "BIT156CO",
        name: "Project-II",
        credits: 2,
        type: "Project / Practical",
        description: "Group software project (2-3 students) built using Object-Oriented Programming in C++ — 45 lab hours.",
        keyUnits: ["Topic Selection & Information Gathering", "System Requirements & Specifications", "Coding & Implementation", "Documentation & Final Presentation"]
      }
    ]
  },
  {
    // Verified against the official Purbanchal University BIT Semester III
    // (current/new course) syllabus — codes BIT201HS-206CO — see
    // bulk-imports/syllabus-sources/ for the source document.
    semester: 3,
    totalCredits: 17,
    subjects: [
      {
        code: "BIT201HS",
        name: "Numerical Methods",
        credits: 3,
        type: "Core",
        description: "Numerical solutions to nonlinear equations, interpolation, linear systems, differentiation/integration, and ODEs.",
        keyUnits: ["Errors in Numerical Computation", "Solution of Nonlinear Equations (Bisection, Newton-Raphson)", "Interpolation & Least Square Methods", "System of Linear Equations (Direct & Indirect Methods)", "Numerical Differentiation & Integration", "Numerical Solution of ODEs (Euler, Runge-Kutta)"]
      },
      {
        code: "BIT202CO",
        name: "Microcontroller",
        credits: 3,
        type: "Core",
        description: "8051 microcontroller architecture, instruction set, I/O and timer programming, interrupts, and peripheral interfacing.",
        keyUnits: ["Introduction to Microcontroller & 8051 Architecture", "Instruction Set & Addressing Modes", "Stack, I/O Port Interfacing & Programming", "Timers and Serial Port", "Interrupts and Interfacing Applications"]
      },
      {
        code: "BIT203CO",
        name: "Data Structure and Algorithm",
        credits: 3,
        type: "Core",
        description: "Core data structures — stacks, queues, lists, trees, graphs — plus sorting, searching, and algorithm efficiency.",
        keyUnits: ["Introduction & Algorithm Efficiency", "Stack & Queue", "List and Linked List", "Recursion", "Trees (BST, AVL, Huffman)", "Sorting (Quick, Merge, Heap)", "Searching, Hashing & Graphs (DFS, BFS, Dijkstra)"]
      },
      {
        code: "BIT204CO",
        name: "Computer Network and Data Communication",
        credits: 3,
        type: "Core",
        description: "Networking fundamentals, the OSI/TCP-IP layered model, data link/network/transport layers, and network security.",
        keyUnits: ["Introduction to Networking & Data Communication", "Layered Network Architecture (OSI, TCP/IP)", "Data Transmission & Physical Layer", "Data Link Control (Error Detection, HDLC)", "Network Layer (IP Addressing, Subnetting, Routing)", "Transport & Application Layer", "Network Security (Cryptography, SSL/TLS, Firewall)"]
      },
      {
        code: "BIT205CO",
        name: "System Analysis and Design",
        credits: 3,
        type: "Core",
        description: "SDLC models, process/conceptual modeling with DFDs and ERDs, systems analysis and design, and object-oriented analysis with UML.",
        keyUnits: ["Overview of Systems Analysis & Design (SDLC Models)", "Process & Conceptual Modeling (DFD, ERD)", "Logic Modeling (Decision Table/Tree)", "Systems Analysis (Requirements, Feasibility)", "Systems Design & Implementation", "Object-Oriented Analysis & Design (UML)"]
      },
      {
        code: "BIT206CO",
        name: "Project-III",
        credits: 2,
        type: "Project / Practical",
        description: "Group project (2-3 students) developing a microcontroller (BIT202CO)-based system — 45 lab hours.",
        keyUnits: ["Title Identification & Proposal Writing", "Mid-Term Presentation", "Pre-Final Submission & Final Presentation"]
      }
    ]
  },
  {
    // Verified against the official Purbanchal University BIT Semester IV
    // (current/new course) syllabus — codes BIT251HS-256CO — see
    // bulk-imports/syllabus-sources/ for the source document.
    semester: 4,
    totalCredits: 17,
    subjects: [
      {
        code: "BIT251HS",
        name: "Probability and Statistics",
        credits: 3,
        type: "Core",
        description: "Descriptive statistics, probability theory, theoretical distributions, estimation, hypothesis testing, and correlation/regression.",
        keyUnits: ["Nature and scope of statistics", "Data and its collection", "Classification and tabulation of data", "Diagrammatic and graphic presentation", "Measures of central tendency", "Measures of dispersion", "Probability", "Theoretical distribution (Binomial, Poisson, Normal, Hyper-geometric)", "Estimation theory and testing of hypothesis", "Chi-Square distribution", "Correlation and regression analysis"]
      },
      {
        code: "BIT252CO",
        name: "Computer Organization and Architecture",
        credits: 3,
        type: "Core",
        description: "Computer instruction sets, control unit design, CPU architecture, pipelining, memory organization, and multiprocessors.",
        keyUnits: ["Introduction", "Computer organization and design", "Control unit design", "Central processing unit", "Pipeline and vector processing", "Computer arithmetic", "Input and output organization", "Memory organization", "Multiprocessor"]
      },
      {
        code: "BIT253CO",
        name: "Operating System",
        credits: 3,
        type: "Core",
        description: "Process/thread management, memory management, file systems, I/O, deadlocks, and distributed systems.",
        keyUnits: ["Introduction", "Processes and Threads", "Memory Management", "File Systems", "Input/Output", "Deadlocks", "Real Time System", "Distributed System", "Case study (UNIX/LINUX/Windows/Android/iOS)"]
      },
      {
        code: "BIT254CO",
        name: "Database Management System",
        credits: 3,
        type: "Core",
        description: "DBMS architecture, relational model, SQL, normalization, database security, and transaction/query processing.",
        keyUnits: ["Introduction", "Database System Concepts and Architecture (E-R model)", "Relational Model", "SQL (incl. PL/SQL)", "Integrity Constraints", "Normalization (1NF-5NF, BCNF)", "Database Security", "Transaction and Query Processing (ACID, concurrency, WAL)", "Backup and Recovery"]
      },
      {
        code: "BIT255CO",
        name: "Programming in JAVA",
        credits: 3,
        type: "Core",
        description: "Core Java OOP, GUI programming, file I/O, JDBC, socket programming, and Servlet/JSP.",
        keyUnits: ["Introduction to Java", "Applet Programming", "GUI Programming (AWT/Swing)", "Java IO", "JDBC", "Socket Programming", "Distributed Application (RMI)", "Overview of Servlet and JSP"]
      },
      {
        code: "BIT256CO",
        name: "Project-IV",
        credits: 2,
        type: "Project / Practical",
        description: "Group application software project (up to 3 students) developed in Java, with proposal, mid-term, and final presentation.",
        keyUnits: ["Title Identification & Proposal Writing", "Mid-Term Presentation", "Pre-Final Submission & Final Presentation"]
      }
    ]
  },
  {

    // Verified against the official Purbanchal University BIT course cycle
    // (Year III / Semester I table) in
    // BIT-1year-I-II-Sem-with-all-course-cycle.pdf — codes BIT301HS-306CO,
    // 17 credits.
    //
    // This block previously held INVENTED codes (BIT501-BIT506) and three
    // subjects that do not exist in the PU curriculum at all: "Advanced Web
    // Technology", "Organization Behavior & HR Management", and "Computer
    // Graphics & Web Lab" — while Internet of Things and Project-V were
    // missing entirely. Students on semester 5 were reading a syllabus that
    // does not exist.
    //
    // keyUnits: kept only where the subject itself was already correct
    // (Computer Graphics, Cryptography & Network Security, Research
    // Methodology). Left EMPTY for BIT304CO, BIT305CO and BIT306CO rather
    // than guessed — the course-cycle table gives codes, credits and hours
    // but not unit contents, and inventing units would poison the tagging
    // vocabulary that examai-ingest maps questions onto. Fill these in from
    // the official Semester V syllabus PDF when it arrives.
    semester: 5,
    totalCredits: 17,
    subjects: [
      {
        code: "BIT301HS",
        name: "Research Methodology",
        credits: 3,
        type: "Core",
        description: "Scientific inquiry, quantitative and qualitative research designs, hypothesis formulation, and technical writing.",
        keyUnits: ["Foundations of Scientific Research", "Literature Review & Research Gap", "Research Design & Sampling Strategies", "Hypothesis Formulation & Testing", "Data Analysis & Interpretation", "Report Writing & Publication Ethics"]
      },
      {
        code: "BIT302CO",
        name: "Computer Graphics",
        credits: 3,
        type: "Core",
        description: "Rasterization algorithms, 2D/3D transformations, clipping, illumination, and shading.",
        keyUnits: ["Display Devices & Raster Graphics", "Line & Circle Drawing Algorithms", "2D Transformations & Clipping", "3D Transformations & Projections", "Visible Surface Detection (Z-Buffer)", "Illumination & Shading Models"]
      },
      {
        code: "BIT303CO",
        name: "Cryptography and Network Security",
        credits: 3,
        type: "Core",
        description: "Classical and modern ciphers, public key cryptosystems, digital signatures, hash functions, and network security protocols.",
        keyUnits: ["Security Concepts & Attacks", "Classical Encryption Techniques", "Symmetric Ciphers (DES, AES)", "Public Key Cryptography (RSA, ECC)", "Hash Functions & Digital Signatures", "Network Security Protocols (TLS, IPSec)"]
      },
      {
        code: "BIT304CO",
        name: "Web Technology",
        credits: 3,
        type: "Core",
        description: "Web technology fundamentals. Unit contents pending the official Semester V syllabus PDF — the previous entry described a React/Next.js course that is not the PU syllabus.",
        keyUnits: []
      },
      {
        code: "BIT305CO",
        name: "Internet of Things",
        credits: 3,
        type: "Core",
        description: "IoT fundamentals. Unit contents pending the official Semester V syllabus PDF; this subject was missing from the data entirely.",
        keyUnits: []
      },
      {
        code: "BIT306CO",
        name: "Project-V",
        credits: 2,
        type: "Project / Practical",
        description: "Group project carrying the semester's practical assessment. Evaluation criteria pending the official Semester V syllabus PDF.",
        keyUnits: []
      }
    ]
  },
  {
    // Verified against the official Purbanchal University BIT VI Semester
    // course syllabus (BIT351CO/352CO/353CO/354CO/355CO/356CO, New Course)
    // — see bulk-imports/ for the source document and converted papers.
    semester: 6,
    totalCredits: 17,
    subjects: [
      {
        code: "BIT351CO",
        name: "Artificial Intelligence",
        credits: 3,
        type: "Core",
        description: "AI foundations from agents and search through knowledge representation, learning, reasoning, expert systems, neural networks, and NLP.",
        keyUnits: ["Introduction & Applications of AI", "Agents: PEAS, Rationality & Agent Types", "Uninformed & Informed Search (BFS, DFS, A*, Hill Climbing)", "Adversarial Search & Constraint Satisfaction (Minimax, Alpha-Beta, CSP)", "Knowledge Representation (Logic, Semantic Nets, FOPL)", "Learning Systems (Decision Trees, Reinforcement Learning)", "Reasoning (Monotonic, Bayesian, Case-Based)", "Expert Systems (Inference Engine, Forward/Backward Chaining)", "Artificial Neural Networks (Perceptron, Backpropagation)", "Natural Language Processing"]
      },
      {
        code: "BIT352CO",
        name: "Management Information System (MIS)",
        credits: 3,
        type: "Core",
        description: "Information systems in global business, IT infrastructure, decision support and executive systems, and the strategic/security role of MIS.",
        keyUnits: ["Information Systems in Global Business Today", "Global E-Business & Collaboration", "Information Systems Organization & Strategy (Value Chain)", "IT Infrastructure & Platform Trends", "Business Intelligence Foundations", "Decision Support Systems (DSS) & Executive Information Systems (EIS)", "Business Information Systems (Marketing, Manufacturing, Finance)", "Security of Information Systems", "Enterprise Systems, SCM & CRM", "Strategic Information Systems & SISP"]
      },
      {
        code: "BIT353CO",
        name: "Data Warehousing and Mining",
        credits: 3,
        type: "Core",
        description: "Data warehouse architecture and OLAP, plus core data mining techniques — association rule mining, classification, and cluster analysis.",
        keyUnits: ["Introduction to Data Mining & Data Warehousing", "Data Warehouse & OLAP Technology, KDD", "Mining Association Rules (Apriori, Market Basket Analysis)", "Multidimensional & Multilevel Association Rules", "Classification & Prediction (Decision Trees, Bayesian, k-NN)", "Cluster Analysis (k-Means, k-Medoids, Hierarchical Methods)"]
      },
      {
        code: "BIT354CO",
        name: "Simulation and Modeling",
        credits: 3,
        type: "Core",
        description: "Simulation concepts and system types, the Monte Carlo method, random number generation and randomness testing, and analyzing simulation output.",
        keyUnits: ["Concepts of Simulation (Types, Advantages, Limitations)", "Monte Carlo Method", "Simulation of Continuous Systems (Queuing, Markov Chains)", "Random Numbers: Generation & Testing (Chi-Square, Poker Test)", "Analysis of Simulation Output & Replication of Runs", "Simulation Languages & Discrete/Continuous Modeling"]
      },
      {
        code: "BIT355CO",
        name: "Software Engineering",
        credits: 3,
        type: "Core",
        description: "The software engineering lifecycle — process models, project management, requirements, design, testing, and quality metrics.",
        keyUnits: ["Introduction to Software Engineering", "Process Models (Waterfall, Prototyping, RAD, Spiral, Agile)", "Software Project Management (4Ps, COCOMO, Risk, Scheduling)", "Software Requirements & Specification", "Software Design (Principles, Architecture Types)", "Software Testing (Black-Box, White-Box, V&V)", "Metrics for Process & Product Quality (ISO 9000)", "SE Trends: Agile, XP, Cloud Computing, SOA"]
      },
      {
        code: "BIT356CO",
        name: "Project-VI",
        credits: 2,
        type: "Project / Practical",
        description: "Group web-based application project (up to 3 students) built with server-side scripting, on a topic related to Artificial Intelligence or Data Mining — 45 lab hours, evaluated across title, mid-term, and pre-final presentations.",
        keyUnits: ["Title Presentation", "Mid-Term Presentation", "Server-Side Web Application Development", "AI or Data Mining-Related Project Topic", "Pre-Final Submission & Presentation"]
      }
    ]
  },
  {
    // Verified against the official Purbanchal University BIT Semester VII
    // (current/new course) syllabus — codes BIT401CO-403CO plus one of three
    // specialization tracks — see bulk-imports/syllabus-sources/ for source.
    semester: 7,
    totalCredits: 15,
    subjects: [
      {
        code: "BIT401CO",
        name: "Network Programming",
        credits: 3,
        type: "Core",
        description: "Client-server socket programming — TCP/UDP sockets, I/O multiplexing, broadcast/multicast, and raw sockets in C/Unix.",
        keyUnits: [
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
        ]
      },
      {
        code: "BIT402CO",
        name: "Digital Governance",
        credits: 3,
        type: "Core",
        description: "e-Government implementation and policy, ICT infrastructure, security, digital democracy, and case studies including Nepal's GIDC.",
        keyUnits: [
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
        ]
      },
      {
        code: "BIT421CO",
        name: "Machine Learning (Track A)",
        credits: 3,
        type: "Elective",
        description: "Theoretical concepts and practical implementations of supervised regression/classification, decision trees, model tuning, text mining, and deep neural networks in Python.",
        keyUnits: [
          "Introduction to Machine Learning (Components & Frameworks)",
          "Supervised Learning: Regression, Classification, Decision Trees",
          "Unsupervised Learning (k-means, k-modes)",
          "Model Diagnosis and Tuning (Bias/Variance, Cross-Validation)",
          "Text Mining (Preprocessing, TF-IDF, Exploration)",
          "Deep Learning (Feedforward, CNNs, RNNs)"
        ]
      },
      {
        code: "BIT422CO",
        name: "Business Intelligence and Data Science (Track A)",
        credits: 3,
        type: "Elective",
        description: "Foundations of business intelligence, data warehousing, visual analytics with Tableau/Power BI, WEKA data mining, text/web analytics, and big data architectures.",
        keyUnits: [
          "Overview of Business Intelligence & Decision Support",
          "Data Warehousing (Architectures, ETL Processes, Real-Time DW)",
          "Business Reporting & Visual Analytics (Tableau, Power BI)",
          "Data Mining Concepts & Applications (WEKA)",
          "Text and Web Analytics (NLP, Sentiment Analysis)",
          "Big Data Analytics & Stream Processing",
          "Business Analytics Emerging Trends and Ethics"
        ]
      },
      {
        code: "BIT423CO",
        name: "Deep Learning (Track A)",
        credits: 3,
        type: "Elective",
        description: "Neural network architectures — multilayer perceptrons, deep CNNs, RNNs, LSTMs, generative belief nets, and TensorFlow vision/speech applications.",
        keyUnits: [
          "Basics of Artificial Neural Networks (ANN Models)",
          "Feedforward Neural Networks & Backpropagation Learning",
          "Deep Neural Networks (Optimization: Adam, Regularization)",
          "Convolutional Neural Networks (LeNet, AlexNet, VGG)",
          "Recurrent Neural Networks (LSTM, GRU, Sequence Modeling)",
          "Generative Models (RBMs, Deep Belief Nets)",
          "Applications in Vision, Speech and NLP"
        ]
      },
      {
        code: "BIT428CO",
        name: "Digital Commerce (Track B)",
        credits: 3,
        type: "Elective",
        description: "Electronic commerce architectures, mercantile retailing models, mobile commerce (3G/4G), digital marketing SEO, WordPress CMS, and AI chatbots.",
        keyUnits: [
          "E-Commerce Foundations (Business Models, Security, Payments)",
          "Electronic Retailing (Consumer Mercantile Models)",
          "Introduction to Digital Commerce Trends",
          "Fundamentals of Mobile Commerce (M-Commerce, GSM/GPRS)",
          "Digital Marketing (SEO, Google Ads, Social Media)",
          "Web Content Management Systems (WordPress Development)",
          "Application of Artificial Intelligence in Commerce"
        ]
      },
      {
        code: "BIT429CO",
        name: "Multimedia and Application (Track B)",
        credits: 3,
        type: "Elective",
        description: "Multimedia data representations — audio/MIDI, image processing, video encoding, compression (JPEG/MPEG), real-time OS scheduling, and network streaming.",
        keyUnits: [
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
        ]
      },
      {
        code: "BIT435CO",
        name: "GIS (Track C)",
        credits: 3,
        type: "Elective",
        description: "Geographic Information Systems — spatial/attribute data, raster vs vector structures, map projections (UTM), spatial querying, and Nepal GIS applications.",
        keyUnits: [
          "Basic Concepts & Components of GIS",
          "GIS Data & Databases (Raster & Vector Structures)",
          "GIS Data Input (Digitization, GPS & Remote Sensing)",
          "GIS Mapping & Map Projections (UTM)",
          "Data Editing in GIS (Error Correction, Rubber Sheeting)",
          "Spatial Analysis (Buffering, Overlay, Network Connectivity)",
          "Spatial Data Infrastructure (SDI & NSDI Standards)",
          "GIS in Nepal (Current Situation & Major Activities)"
        ]
      },
      {
        code: "BIT436CO",
        name: "Remote Sensing (Track C)",
        credits: 3,
        type: "Elective",
        description: "Electromagnetic radiation spectrum, sensor platforms and satellite orbits, Landsat/Sentinel imagery, digital image processing, and GIS-RS integration.",
        keyUnits: [
          "Concept and Scope of Remote Sensing Systems",
          "Electromagnetic Radiation (EMR Spectrum & Signatures)",
          "Sensor Characteristics (Whiskbroom, Pushbroom, Resolutions)",
          "Remote Sensor Platforms and Satellite Orbits (Sun-Synchronous)",
          "Space Imaging Satellites (IRS, Landsat, SPOT, High-Res)",
          "Integration of GIS and Remote Sensing",
          "Applications of Remote Sensing"
        ]
      },
      {
        code: "BIT437CO",
        name: "Data Center and Disaster Recovery Centers (Track C)",
        credits: 3,
        type: "Elective",
        description: "Modern data center design, power redundancy, fire protection, cooling optimization, cloud data centers, and enterprise disaster recovery planning.",
        keyUnits: [
          "Introduction to Data Center Types and Architecture",
          "The Role and Objectives of Data Centers (Standards & Tiers)",
          "Design Overview (Cooling, Power Redundancy, Cabling)",
          "Managing the Data Center (Processes, Decommissioning, Security)",
          "Data Center Industry Market and Trends",
          "Cloud Data Centers",
          "Disaster Recovery Center Formulation and DR Plans"
        ]
      },
      {
        code: "BIT403CO",
        name: "Internship",
        credits: 3,
        type: "Project / Practical",
        description: "45-hour supervised internship at a partner organization (bank, hospital, software company, telecom, or government IT unit), evaluated via proposal defense, mid-term, and end-term report.",
        keyUnits: [
          "Proposal Defense & Organization Placement (10%)",
          "Mid-Term Progress Review & System Design (30%)",
          "System Analysis, Implementation & Testing",
          "Final Internship Report (APA Format) & Viva (60%)"
        ]
      }
    ]
  },
  {
    // Verified against the official Purbanchal University BIT Semester VIII
    // (current/new course) syllabus — codes BIT451MS-453CO plus specialization tracks.
    semester: 8,
    totalCredits: 15,
    subjects: [
      {
        code: "BIT451MS",
        name: "Principles of Management and Entrepreneurship in IT",
        credits: 3,
        type: "Core",
        description: "Management fundamentals, organization design, entrepreneurship, business planning, and IT product marketing/technology transfer.",
        keyUnits: [
          "Introduction to Management Principles and Functions",
          "Organization Design and Decentralization",
          "The Foundation of Entrepreneurship",
          "Feasibility Analysis and Crafting Winning Business Plans",
          "Forms of Business Ownership and Franchising",
          "Building a Powerful Marketing Plan (Guerrilla Marketing)",
          "Location Selection and Layout Optimization",
          "E-Commerce and the Entrepreneur",
          "Entrepreneur of IT (Technology Transfer & Innovation)"
        ]
      },
      {
        code: "BIT452CO",
        name: "Distributed and Cloud Computing",
        credits: 3,
        type: "Core",
        description: "Distributed systems fundamentals and cloud computing service/deployment models, virtualization, and cloud security.",
        keyUnits: [
          "Distributed Systems Fundamentals (RPC, RMI, Consistency)",
          "Cloud Computing Service Models (IaaS, PaaS, SaaS, Serverless)",
          "Virtualization Technologies (Hypervisors, Containers, K8s)",
          "Cloud Storage and Big Data Architectures",
          "Cloud Security, IAM and Shared Responsibility"
        ]
      },
      {
        code: "BIT471CO",
        name: "Natural Language Processing (Track A)",
        credits: 3,
        type: "Elective",
        description: "Speech and language processing, morphological parsing with FSTs, N-grams, HMM POS tagging, feature unification, WordNet lexical semantics, and discourse pragmatics.",
        keyUnits: [
          "Introduction to NLP (Linguistic Organization, CFG Parsing)",
          "Morphology & Phonology (Parsing with FSTs, Phonological Rules)",
          "Pronunciation, Spelling and N-grams (Smoothing, Language Models)",
          "Syntax: POS Tagging (HMM Tagger, Transformation-based)",
          "Sentence Level Construction & Unification Semantics",
          "Lexical Semantics (WordNet, Homonymy, WSD)",
          "Pragmatics and Discourse Structure"
        ]
      },
      {
        code: "BIT472MS",
        name: "Supply Chain Analytics (Track A)",
        credits: 3,
        type: "Elective",
        description: "Data analytics and machine learning applied to supply chain management — data preparation in Python, Seaborn visualization, customer RFM segmentation, supplier risk, and demand forecasting.",
        keyUnits: [
          "Introduction to Supply Chain Analytics & SMART Goals",
          "Data-Driven Supply Chains (Python Setup)",
          "Data Manipulation & Indexing in Python",
          "Data Visualization (Seaborn, Geospatial Mapping)",
          "Customer Management (Cohort & RFM Analysis, Clustering)",
          "Supply Management & Supplier Risk Regression",
          "Warehouse and Inventory Optimization",
          "Demand Forecasting (Time Series Methods)",
          "Logistics Management & Route Optimization"
        ]
      },
      {
        code: "BIT478CO",
        name: "Big Data (Track B)",
        credits: 3,
        type: "Elective",
        description: "Big data paradigms in business intelligence — MapReduce workflow anatomy, NoSQL databases (HBase, Cassandra, MongoDB), HDFS storage, and Hadoop HiveQL tools.",
        keyUnits: [
          "Introduction to Big Data (Distributed Systems, Trends)",
          "MapReduce Applications (Workflows, Optimization, Locality)",
          "Data Management & Taxonomy of NoSQL Implementations",
          "Fundamentals of Hadoop (HDFS, Streaming, Pipes, I/O)",
          "Hadoop Tools: HBase, Cassandra, Pig Latin, Hive & HiveQL"
        ]
      },
      {
        code: "BIT479CO",
        name: "Mobile App Development (Track B)",
        credits: 3,
        type: "Elective",
        description: "Mobile application development on Android — UI layouts, activity lifecycles, intents, SQLite databases, REST API consumption, location services, and Google Play Store deployment.",
        keyUnits: [
          "Introduction to Mobile Devices & Architectures",
          "Mobile Platforms & Wireless Communication Constraints",
          "Introduction to Android Platform (ART, Tools, Manifest)",
          "Android Application Design Essentials (Layouts, Recycler View)",
          "Writing Basic Applications (Context, Activities, Intents)",
          "Data Handling in Android (SQLite, Preferences, Content Providers)",
          "Developing Real-Time Applications (Telephony, RESTful APIs)",
          "Debugging, Testing & Deployment (Play Store Distribution)",
          "Recent Concepts: App Monetization, Location Kit, ML Kit"
        ]
      },
      {
        code: "BIT485CO",
        name: "Incident Response and Management System (Track C)",
        credits: 3,
        type: "Elective",
        description: "Incident command systems (NEOC/DEOC), early warning alert systems, multi-agency response, disaster recovery portals, and cyber threats to critical infrastructure.",
        keyUnits: [
          "Introduction to Incident Response Systems (NEOC/DEOC)",
          "Functioning of IRS (Chain of Command, Unified Command)",
          "Resources and Infrastructure Management (Incident Action Plan)",
          "Incident Decision System and Reporting (Early Warning, Media)",
          "Disaster Recovery Portals (DRR Portals, Real-Time Data)",
          "Phases of Disaster Management (Mitigation, Response, Recovery)",
          "Cyber Threats and Disaster Management (DR Sites, Fake News)"
        ]
      },
      {
        code: "BIT486CO",
        name: "Climate Change Risk Management (Track C)",
        credits: 3,
        type: "Elective",
        description: "Climate change science, greenhouse warming physics, climate impacts in Nepal, indicators, extreme weather adaptation, ICT for green growth, and CIRA risk analysis.",
        keyUnits: [
          "Overview of Climate Change Science",
          "Causes of Climate Change (Greenhouse Effect, Earth Radiative Budget)",
          "Future of Climate Change (GHG Projections, Ocean Acidification)",
          "Climate Change Impacts (Nepal Sectoral Impacts)",
          "Climate Change Indicators (Glacial Lake Outbursts, Phenology)",
          "Climate Change and Extreme Weather Adaptation",
          "ICT for Climate Change and Green Growth",
          "Climate Change Impacts and Risk Analysis (CIRA Framework)"
        ]
      },
      {
        code: "BIT487CO",
        name: "Disaster Governance (Track C)",
        credits: 3,
        type: "Elective",
        description: "Digital governance models for disaster risk reduction — knowledge repositories, Sendai Framework, disaster mitigation planning, and emergency response mobilization.",
        keyUnits: [
          "Overview of Digital Governance in Disaster Management",
          "Knowledge Management in Digital Governance",
          "Overview of Disasters & Sendai Framework",
          "Disaster Governance Effectiveness and SDGs",
          "Governance in Disaster Mitigation (Infrastructure Planning)",
          "Governance in Disaster Preparedness (NSDRM Nepal, Evacuation)",
          "Governance in Disaster Response (Resource Deployment)",
          "Governance in Disaster Recovery (Critical Infrastructure Restoration)"
        ]
      },
      {
        code: "BIT453CO",
        name: "Apprentice Project",
        credits: 3,
        type: "Project / Practical",
        description: "45-hour capstone project developing a 2-tier/3-tier/n-tier application with client-side and server-side scripting on any RDBMS.",
        keyUnits: [
          "Title Identification & Proposal Writing (10 Marks)",
          "Mid-Term Architecture & DB Design Presentation (20 Marks)",
          "Pre-Final Application Submission & Demo (30 Marks)",
          "Final Documentation (APA Format: 20 Marks), Presentation (10) & Viva (10)"
        ]
      }
    ]
  }
];
