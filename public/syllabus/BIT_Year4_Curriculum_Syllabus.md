# Purbanchal University — Faculty of Science & Technology
## Bachelor in Information Technology (BIT)
### Year IV Curriculum & Detailed Course Syllabus (Semesters VII & VIII)

---

## 1. Year IV Course Structure Overview

### Semester VII (Year IV, Semester I)

| Course Code | Course Title | Credits | Lecture (Hrs) | Tutorial (Hrs) | Practical (Hrs) | Total (Hrs) | Internal Theory | Internal Practical | Final Theory | Final Practical | Total Marks |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **BIT401CO** | Network Programming | 3 | 3 | 1 | 2 | 6 | 20 | 50 | 80 | - | 150 |
| **BIT402CO** | Digital Governance | 3 | 3 | 1 | - | 4 | 20 | - | 80 | - | 100 |
| **BIT4**\*\* | Specialization 1 | 3 | 3 | 1 | 2 | 6 | 20 | 50/20 | 80/60 | - | 150/100 |
| **BIT4**\*\* | Specialization 2 | 3 | 3 | 1 | 2 | 6 | 20 | 50/20 | 80/60 | - | 150/100 |
| **BIT403CO** | Internship | 3 | - | - | - | 45 | - | - | - | - | 100 |
| **Total** | | **15** | | | | | | | | | **650** |

---

### Semester VIII (Year IV, Semester II)

| Course Code | Course Title | Credits | Lecture (Hrs) | Tutorial (Hrs) | Practical (Hrs) | Total (Hrs) | Internal Theory | Internal Practical | Final Theory | Final Practical | Total Marks |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **BIT451MS** | Principles of Management & Entrepreneurship in IT | 3 | 3 | 1 | 0 | 4 | 20 | - | 80 | - | 100 |
| **BIT452CO** | Distributed and Cloud Computing | 3 | 3 | 1 | 2 | 6 | 20 | 50 | 80 | - | 150 |
| **BIT4**\*\* | Specialization 3 | 3 | 3 | 1 | 2 | 6 | 20 | 50/20 | 80/60 | - | 150/100 |
| **BIT4**\*\* | Specialization 4 | 3 | 3 | 1 | 2 | 6 | 20 | 50/20 | 80/60 | - | 150/100 |
| **BIT453CO** | Apprentice Project | 3 | - | - | 3 | 6 | - | 60 | - | 40 | 100 |
| **Total** | | **15** | | | | | | | | | **600** |

---

## 2. Specialization Tracks

Students select one specialization area (taking 2 courses in Semester VII and 2 courses in Semester VIII):

### Track A: Intelligent Systems and Business Analytics
- **Semester VII (Specialization 1 & 2)**:
  - `BIT421CO`: Machine Learning (3 Credits, 150 Marks)
  - `BIT422CO`: Business Intelligence and Data Science (3 Credits, 150 Marks)
  - `BIT423CO`: Deep Learning (3 Credits, 150 Marks)
- **Semester VIII (Specialization 3 & 4)**:
  - `BIT471CO`: Natural Language Processing (3 Credits, 150 Marks)
  - `BIT472MS`: Supply Chain Analytics (3 Credits, 150 Marks)

### Track B: Digital Commerce and Mobile Application Development
- **Semester VII (Specialization 1 & 2)**:
  - `BIT428CO`: Digital Commerce (3 Credits, 100 Marks)
  - `BIT429CO`: Multimedia and Application (3 Credits, 100 Marks)
- **Semester VIII (Specialization 3 & 4)**:
  - `BIT478CO`: Big Data (3 Credits, 150 Marks)
  - `BIT479CO`: Mobile App Development (3 Credits, 100 Marks)

### Track C: Climate Change Management
- **Semester VII (Specialization 1 & 2)**:
  - `BIT435CO`: GIS (3 Credits, 150 Marks)
  - `BIT436CO`: Remote Sensing (3 Credits, 150 Marks)
  - `BIT437CO`: Data Center and Disaster Recovery Centers (3 Credits, 100 Marks)
- **Semester VIII (Specialization 3 & 4)**:
  - `BIT485CO`: Incident Response and Management System (3 Credits, 100 Marks)
  - `BIT486CO`: Climate Change Risk Management (3 Credits, 100 Marks)
  - `BIT487CO`: Disaster Governance (3 Credits, 100 Marks)

---

## 3. Semester VII Core Courses

### Network Programming (BIT401CO)
- **Year**: IV | **Semester**: I
- **Teaching Schedule**: Theory: 3 Hrs/Week, Tutorial: 1 Hr/Week, Practical: 2 Hrs/Week (Total: 6 Hrs/Week)
- **Examination Scheme**: Internal Theory: 20, Internal Practical: 50, Final Theory: 80 (Total: 150 Marks)
- **Course Objectives**: Design and implement robust network client-server applications using Unix socket architectures.

#### Course Contents:
1. **Unit 1: Introduction to Network Programming [5 Hrs]**
   - Client/server model, ISO/OSI & TCP/IP protocol suites, Unix standards (POSIX, OpenGroup, IETF).
   - Network utilities: `telnet`, `route`, `ipconfig`, `ifconfig`, `ping`, `netstat`, `ftp`.
   - Programming basics: wrapper functions, header files, libraries, port numbers, IP addresses.
   - Iterative servers, concurrent servers, and networked servers.
2. **Unit 2: Elementary Operating System Calls [6 Hrs]**
   - System calls, programs, threads, processes, Kernel architecture.
   - Process control: `fork()`, `exec()` family, `waitpid()`, `wait()`.
   - IPC primitives: pipes (`pipe()`), FIFOs (`Fifo()`), signals (`SIGCHLD`, `SIGINT`, `SIGIO`).
   - IPC names, channel creation, opening IPC channels, permissions.
3. **Unit 3: TCP/UDP Transport Layer Protocols [4 Hrs]**
   - TCP: features, connection establishment (three-way handshake) and termination, states (`LISTEN`, `TIME_WAIT`, `ESTABLISHED`, `CLOSED`).
   - UDP: features, uses, comparison with TCP, buffer sizes and socket limitations, SCTP overview.
4. **Unit 4: Elementary Socket Calls [5 Hrs]**
   - Socket address structures: IPv4 (`sockaddr_in`), IPv6 (`sockaddr_in6`), Unix domain (`sockaddr_un`), generic (`sockaddr`).
   - Value-result arguments, byte ordering and manipulation: `htonl()`, `htons()`, `ntohl()`, `ntohs()`.
   - Address conversions: `inet_addr()`, `inet_aton()`, `inet_ntoa()`, `inet_pton()`, `inet_ntop()`.
5. **Unit 5: Elementary TCP-UDP Sockets [6 Hrs]**
   - Socket functions: `socket()`, `connect()`, `bind()`, `listen()`, `accept()`, `read()`, `write()`, `close()`.
   - UDP sockets: `sendto()`, `recvfrom()`.
6. **Unit 6: I/O Multiplexing [4 Hrs]**
   - I/O models: blocking, non-blocking, I/O multiplexing, signal-driven I/O (`SIGIO`), asynchronous I/O.
   - Multiplexing system calls: `select()`, `poll()`, `shutdown()`.
7. **Unit 7: Socket Options [2 Hrs]**
   - `getsockopt()` and `setsockopt()` functions, IPv4, IPv6, and TCP socket options (`SO_REUSEADDR`, `TCP_NODELAY`).
8. **Unit 8: Name and Address Conversion [2 Hrs]**
   - Domain Name System (DNS), `gethostbyname()`, `gethostbyaddr()`, `uname()`, `getservbyname()`, `getservbyport()`, `gethostname()`, socket timeouts.
9. **Unit 9: Unix Domain Protocols [3 Hrs]**
   - Unix domain socket address structure, `socketpair()` function, Unix domain stream and datagram client/server.
10. **Unit 10: Daemon Processes & Inetd Superserver [2 Hrs]**
    - Syslog facility (`syslog()`), `daemon_init()` function, `inetd` superserver configuration.
11. **Unit 11: Broadcast and Multicast [3 Hrs]**
    - Broadcast and multicast addresses, socket options comparison, unicast vs. broadcast/multicast on LANs.
12. **Unit 12: IP Layers and Raw Sockets [3 Hrs]**
    - Raw socket creation, input and output packet processing (ping example implementation).

#### Laboratory Work:
Strictly implemented in C / C++ / Java under Linux:
- Linux command line utilities and shell programming.
- IPC mechanisms (`pipe()`, `fifo()`, message queues).
- TCP, UDP, and Unix domain socket client-server architectures.
- Concurrent TCP echo server and client implementation.
- Process management with `fork()`, `wait()`, and `waitpid()`.
- System calls: `uname()`, `gethostbyname()`, `gethostbyaddr()`, `gethostname()`.

#### Reference Books:
1. Stevens, W. R., *Unix Network Programming, Vol 1: Networking APIs - Sockets and XTI*, Prentice Hall.
2. Stevens, W. R., *Unix Network Programming, Vol 2: Interprocess Communications*, Prentice Hall.
3. Comer, Douglas E., *Internetworking with TCP/IP: Principles, Protocols, and Architecture*, Vol 3.

---

### Digital Governance (BIT402CO)
- **Year**: IV | **Semester**: I
- **Teaching Schedule**: Theory: 3 Hrs/Week, Tutorial: 1 Hr/Week (Total: 4 Hrs/Week)
- **Examination Scheme**: Internal Theory: 20, Final Theory: 80 (Total: 100 Marks)
- **Course Objectives**: Understand electronic government policies, technical data flows, public-private partnerships, digital democracy, AI applications, and international case studies.

#### Course Contents:
1. **Unit 1: Introduction [3 Hrs]**: e-Government vs e-Governance, e-Government as information system, benefits, development stages, online and electronic service delivery.
2. **Unit 2: Public-Private Partnership for e-Government [4 Hrs]**: G2C and G2B projects, PPP models (JV, BOO, BOOT, ASP), governance issues, citizen-centric approach.
3. **Unit 3: ICT Infrastructure for e-Government [3 Hrs]**: Network infrastructure, computing platforms, Government Data Centers, interoperability frameworks.
4. **Unit 4: e-Government Readiness [4 Hrs]**: e-Readiness frameworks, national readiness stages, implementation barriers.
5. **Unit 5: Security for e-Government [5 Hrs]**: Cybersecurity challenges, security architecture, management models, ISO/IEC standards.
6. **Unit 6: Implementing e-Government [5 Hrs]**: System development life cycle, current reality gap analysis, risk mitigation, hybrid e-government models.
7. **Unit 7: From Representative to Digital Democracy [3 Hrs]**: Internet participation, online civic organization, electronic voting, preserving democratic institutions.
8. **Unit 8: Citizen-Centric Remote Online Digital Governance [3 Hrs]**: Citizen Relationship Management (CRM), responsive government, modernizing administrative communication.
9. **Unit 9: Applying Artificial Intelligence to Improve Performance & Results [4 Hrs]**: Impact of AI in public administration, bias mitigation, facial and voice recognition applications.
10. **Unit 10: Case Studies and Applications [10 Hrs]**:
    - **Nepal**: Cyber Laws, ICT Development Project, Government Integrated Data Center (GIDC), e-Government Master Plan, civil HR management.
    - **India**: Community Information Centers, Andhra Pradesh e-Procurement, e-Seva.
    - **Global**: South Korea, China, Brazil, Sri Lanka, Singapore, USA.

#### Reference Books:
1. Heeks, Richard, *Implementing and Managing eGovernment: An International Text*, SAGE Publications.
2. Prabhu, C.S.R., *e-Governance: Concepts and Case Studies*, Prentice Hall of India.
3. Satyanarayana, J., *Managing Transformation: Objectives to Outcomes*, Prentice Hall of India.
4. Milakovich, Michael E., *Digital Governance: Applying Advanced Technologies to Improve Public Services*, Routledge.

---

### Internship (BIT403CO)
- **Year**: IV | **Semester**: I
- **Duration**: 3 Credits (45 Contact Lab Hours minimum) | **Total Marks**: 100
- **Goal**: Facilitate industry immersion and practical problem solving in enterprise computing environments.
- **Eligible Domains**: Commercial Banks, Healthcare IT, Software Engineering Firms, Telecom Providers (NTC, Ncell), Government IT Centers.
- **Group Size**: Maximum 3 students per team (with individual documentation).
- **Report Format**: APA (American Psychological Association) 7th Edition style.
- **Evaluation Criteria**:
  - Proposal Defense: 10% (Title selection, problem statement, schedule)
  - Mid-Term Review: 30% (Software architecture design, prototype demo, viva)
  - End-Term Defense: 60% (Depth of work: 15%, Final Report: 25%, Viva: 10%, Final Presentation: 10%)

---

## 4. Semester VII Specialization Courses

### Machine Learning (BIT421CO) — Track A
- **Year**: IV | **Semester**: I | **Credits**: 3 (3L, 1T, 2P) | **Total Marks**: 150
- **Course Contents**:
  - **Unit 1: Introduction to Machine Learning [5 Hrs]**: Learning components, geometric/probabilistic/logic models, supervised vs unsupervised vs reinforcement frameworks.
  - **Unit 2: Supervised Learning [12 Hrs]**: Linear/polynomial regression, logistic regression, SVM, k-NN, decision tree ID3/C4.5 representation and inductive bias.
  - **Unit 3: Unsupervised Learning [4 Hrs]**: Clustering fundamentals, k-means, k-modes.
  - **Unit 4: Model Diagnosis & Tuning [7 Hrs]**: Bias-variance tradeoff, k-fold cross-validation, ensemble random forests.
  - **Unit 5: Text Mining [6 Hrs]**: Text preprocessing, tokenization, stemming, TF-IDF feature extraction.
  - **Unit 6: Deep Learning [11 Hrs]**: Artificial neural networks, multi-layer feedforward networks with backpropagation, CNNs, RNNs.
- **Lab Work**: Python (NumPy, Pandas, Matplotlib, Scikit-Learn, WEKA).

### Business Intelligence & Data Science (BIT422CO) — Track A
- **Year**: IV | **Semester**: I | **Credits**: 3 (3L, 1T, 2P) | **Total Marks**: 150
- **Course Contents**:
  - **Unit 1: Overview of BI & Analytics [6 Hrs]**: DSS, BI frameworks, OLTP vs OLAP.
  - **Unit 2: Data Warehousing [6 Hrs]**: DW architectures, star/snowflake schemas, ETL pipelines, real-time DW.
  - **Unit 3: Reporting & Visual Analytics [6 Hrs]**: Performance dashboards, Balanced Scorecard, Tableau & Power BI.
  - **Unit 4: Data Mining [9 Hrs]**: Association rules (Apriori), classification, WEKA tools.
  - **Unit 5: Text & Web Analytics [6 Hrs]**: Sentiment analysis, web scraping, search engine indexing.
  - **Unit 6: Big Data Analytics [5 Hrs]**: MapReduce, stream analytics architectures.
  - **Unit 7: Emerging Trends & Privacy [7 Hrs]**: Recommendation engines, location analytics, AI ethics.

### Deep Learning (BIT423CO) — Track A
- **Year**: IV | **Semester**: I | **Credits**: 3 (3L, 1T, 2P) | **Total Marks**: 150
- **Course Contents**:
  - **Unit 1: Basics of ANN [4 Hrs]**: Artificial neuron models, perceptron learning rule.
  - **Unit 2: Feedforward Networks [5 Hrs]**: Backpropagation, activation functions, empirical risk minimization.
  - **Unit 3: Deep Neural Networks [8 Hrs]**: Optimizers (Adam, RMSProp, AdaGrad), regularization (Dropout, Batch Normalization).
  - **Unit 4: Convolutional Neural Networks [8 Hrs]**: Convolution, pooling, LeNet, AlexNet, VGG architectures.
  - **Unit 5: Recurrent Neural Networks [7 Hrs]**: BPTT, LSTM cells, GRU architectures.
  - **Unit 6: Generative Models [7 Hrs]**: Restricted Boltzmann Machines (RBM), Deep Belief Networks.
  - **Unit 7: Applications [6 Hrs]**: Computer vision, speech recognition, NLP.
- **Lab Work**: TensorFlow / PyTorch exercises for CNN and RNN sequence modeling.

### Digital Commerce (BIT428CO) — Track B
- **Year**: IV | **Semester**: I | **Credits**: 3 (3L, 1T, 2P) | **Total Marks**: 100
- **Course Contents**:
  - **Unit 1: E-Commerce Foundations [11 Hrs]**: B2B, B2C, C2C business models, token-based payments, SSL/TLS security.
  - **Unit 2: Electronic Retailing [2 Hrs]**: Consumer mercantile models, purchase cycle.
  - **Unit 3: Digital Commerce Trends [3 Hrs]**: Omnichannel retail, personalization challenges.
  - **Unit 4: Mobile Commerce [8 Hrs]**: GSM, 3G, 4G, mobile wallets, location-based retail.
  - **Unit 5: Digital Marketing [8 Hrs]**: SEO, Google Ads, display marketing, social media campaigns.
  - **Unit 6: Web Content Management [7 Hrs]**: WordPress architecture, theme development, dynamic catalogs.
  - **Unit 7: AI in Commerce [6 Hrs]**: Conversational chatbots, recommendation algorithms.

### Multimedia and Application (BIT429CO) — Track B
- **Year**: IV | **Semester**: I | **Credits**: 3 (3L, 1T, 2P) | **Total Marks**: 100
- **Course Contents**:
  - **Unit 1: Multimedia Systems [3 Hrs]**: Elements, continuous vs discrete media streams.
  - **Unit 2: Sound and Audio [4 Hrs]**: Sampling, quantization, MIDI devices, speech synthesis.
  - **Unit 3: Images and Graphics [4 Hrs]**: Raster vs vector graphics, color palettes, filtering.
  - **Unit 4: Video and Animation [4 Hrs]**: Frame rates, analog/digital video signals, keyframing.
  - **Unit 5: Data Compression [6 Hrs]**: Run-length, Huffman, JPEG, MPEG encoding.
  - **Unit 6: Optical Media [4 Hrs]**: CD, DVD, Blu-Ray recording physics.
  - **Unit 7: Multimedia OS [4 Hrs]**: Real-time scheduling (Earliest Deadline First, Rate Monotonic).
  - **Unit 8: Multimedia Communications [4 Hrs]**: QoS parameters, jitter buffers, RTSP/RTP.
  - **Unit 9: Hypertext & MHEG [4 Hrs]**: SGML, ODA, MHEG standards.
  - **Unit 10: Synchronization [4 Hrs]**: Lip sync, temporal reference models.
  - **Unit 11: Programming Abstraction [2 Hrs]**: Higher level multimedia toolkits.
  - **Unit 12: Multimedia Applications [2 Hrs]**: Video on Demand, interactive conferencing.

### GIS & Remote Sensing (BIT435CO & BIT436CO) — Track C
- **BIT435CO: GIS**: Spatial data structures (Raster vs Vector), map projections (UTM), spatial querying, topological overlay, Spatial Data Infrastructure (SDI), Nepal GIS applications.
- **BIT436CO: Remote Sensing**: EMR spectrum, atmospheric windows, sensor resolutions, satellite platforms (Landsat, SPOT, Sentinel), image classification, GIS-RS integration.
- **BIT437CO: Data Center & Disaster Recovery**: Data center Tier 1–4 standards, power redundancy, hot/cold aisle cooling, DR sites, business continuity planning.

---

## 5. Semester VIII Core Courses

### Principles of Management and Entrepreneurship in IT (BIT451MS)
- **Year**: IV | **Semester**: II | **Credits**: 3 (3L, 1T) | **Total Marks**: 100
- **Course Contents**:
  - **Unit 1: Introduction to Management [3 Hrs]**: Functions, managerial roles, organizational hierarchies.
  - **Unit 2: Organization Design [3 Hrs]**: Departmentation, delegation, decentralization of authority.
  - **Unit 3: The Foundation of Entrepreneurship [5 Hrs]**: Entrepreneurial mindset, pitfall mitigation.
  - **Unit 4: Feasibility Analysis & Business Plans [5 Hrs]**: Market feasibility, financial pro forma, pitching.
  - **Unit 5: Business Ownership & Franchising [4 Hrs]**: Sole proprietorship, LLCs, franchising models.
  - **Unit 6: Building a Marketing Plan [4 Hrs]**: Guerrilla marketing, online marketing mix.
  - **Unit 7: Location & Layout [4 Hrs]**: Facility selection, cost reduction.
  - **Unit 8: E-Commerce for Entrepreneurs [5 Hrs]**: Online sales funnels, privacy compliance.
  - **Unit 9: IT Entrepreneurship [8 Hrs]**: Technology life cycle, SWOT, international tech transfer.

### Distributed and Cloud Computing (BIT452CO)
- **Year**: IV | **Semester**: II | **Credits**: 3 (3L, 1T, 2P) | **Total Marks**: 150
- **Course Contents**:
  - **Unit 1: Distributed Systems Principles [8 Hrs]**: RPC, RMI, distributed consensus, clock synchronization.
  - **Unit 2: Cloud Computing Service Models [8 Hrs]**: IaaS, PaaS, SaaS, serverless architectures.
  - **Unit 3: Virtualization Technologies [10 Hrs]**: Hypervisors (Type 1 & 2), containerization (Docker, Kubernetes).
  - **Unit 4: Cloud Storage & Big Data Infrastructure [10 Hrs]**: Distributed object storage (S3), NoSQL persistence.
  - **Unit 5: Cloud Security & Governance [9 Hrs]**: Identity & Access Management (IAM), shared responsibility model.

### Apprentice Project (BIT453CO)
- **Year**: IV | **Semester**: II | **Credits**: 3 (6 Lab Hrs/Week) | **Total Marks**: 100
- **Course Objective**: Develop complete 2-tier or 3-tier enterprise applications with relational databases.
- **Evaluation Criteria**:
  - Internal Assessment (60 Marks): Proposal (10), Mid-Term Demo (20), Pre-Final Submission (30).
  - External Assessment (40 Marks): Documentation (20), Final Presentation (10), Oral Viva (10).

---

## 6. Semester VIII Specialization Courses

### Natural Language Processing (BIT471CO) — Track A
- **Units**: Introduction to NLP, Morphology & FSTs, N-Grams & Probabilistic Smoothing, POS Tagging (HMM), Syntax & Feature Unification, Lexical Semantics (WordNet), Pragmatics & Discourse.

### Supply Chain Analytics (BIT472MS) — Track A
- **Units**: SCM Structure & Metrics, Data-driven SCM with Python, Data Indexing & Manipulation, Seaborn & Geospatial Visualization, Customer RFM Segmentation, Supplier Risk Management, Warehouse & Inventory Optimization, Demand Forecasting (Time Series), Route Optimization.

### Big Data (BIT478CO) — Track B
- **Units**: Big Data Characteristics (5Vs), MapReduce Paradigms & Anatomy, NoSQL Architecture (HBase, Cassandra, MongoDB), Hadoop Distributed File System (HDFS), Hadoop Ecosystem (Pig, Hive, HiveQL).

### Mobile App Development (BIT479CO) — Track B
- **Units**: Mobile Architectures, Platform Constraints, Android Activity Lifecycle & Intents, Layouts & Recycler Views, SQLite & SharedPreferences, REST API Integration, Location Services & Maps, Google Play Deployment & Monetization.

### Climate & Disaster Governance (BIT485CO, BIT486CO, BIT487CO) — Track C
- **BIT485CO**: Incident Command System (NEOC/DEOC), Multi-agency coordination, early warning systems, cyber-physical disaster threats.
- **BIT486CO**: Greenhouse effect physics, regional climate modeling in Nepal, extreme weather events, CIRA risk analysis frameworks.
- **BIT487CO**: Digital governance in disaster mitigation, Sendai Framework alignment, volunteer mobilization, public emergency communications.
