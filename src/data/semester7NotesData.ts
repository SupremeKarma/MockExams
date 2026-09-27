import type { SemesterNotesData } from "./bitNotesData";

/**
 * Purbanchal University — Faculty of Science & Technology
 * Bachelor in Information Technology (BIT)
 * Year IV, Semester I (Semester 7) Official Study Notes Database
 * Strictly aligned with the official PU BIT Curriculum syllabus units.
 */
export const semester7NotesData: SemesterNotesData = {
  "Network Programming": {
    subjectName: "Network Programming",
    code: "BIT401CO",
    creditHours: 3,
    topics: [
      {
        id: "np-client-server-sockets",
        name: "TCP/IP Socket Architecture: Iterative vs Concurrent Servers",
        importance: "Very High",
        keyPoints: [
          "Socket abstraction provides an endpoint for communication identified by an IP address and port number.",
          "TCP server lifecycle: socket() -> bind() -> listen(backlog) -> accept() -> read()/write() -> close().",
          "TCP client lifecycle: socket() -> connect() -> write()/read() -> close().",
          "Iterative servers handle one client connection to completion before accepting the next; concurrent servers fork a child process or spawn a thread for each incoming connection.",
          "TCP connection teardown enters TIME_WAIT state (2MSL duration) to ensure late packets drain from the network and the final ACK is acknowledged."
        ],
        theory: "Network programming under POSIX/Unix utilizes the BSD socket API as the standard interprocess communication interface across IP networks. In stream sockets (SOCK_STREAM, TCP), the server establishes a passive listening socket using listen() and waits on accept(), which blocks until a 3-way handshake completes, returning a new connected socket descriptor dedicated to that specific client. In iterative servers, long-running requests starve subsequent clients in the listen backlog queue. Concurrent architectures overcome this by calling fork() immediately following accept(), offloading the connected socket to the child process while the parent resumes listening.",
        code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>

int main() {
    int listen_fd = socket(AF_INET, SOCK_STREAM, 0);
    struct sockaddr_in serv_addr;
    memset(&serv_addr, 0, sizeof(serv_addr));
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_addr.s_addr = htonl(INADDR_ANY);
    serv_addr.sin_port = htons(8080);

    bind(listen_fd, (struct sockaddr *)&serv_addr, sizeof(serv_addr));
    listen(listen_fd, 5);

    while (1) {
        struct sockaddr_in cli_addr;
        socklen_t len = sizeof(cli_addr);
        int conn_fd = accept(listen_fd, (struct sockaddr *)&cli_addr, &len);
        if (fork() == 0) { // Child concurrent process
            close(listen_fd);
            char buf[1024];
            int n = read(conn_fd, buf, sizeof(buf));
            write(conn_fd, buf, n); // Echo back
            close(conn_fd);
            exit(0);
        }
        close(conn_fd); // Parent closes connected descriptor
    }
    return 0;
}`,
        example: "TCP 3-Way Handshake: SYN -> SYN-ACK -> ACK. Socket addresses use sockaddr_in with sin_port converted via htons() to Network Byte Order (Big-Endian).",
        commonExamQuestions: [
          "Explain the complete sequence of socket system calls for both iterative and concurrent TCP servers with state transition diagrams.",
          "What is the purpose of the listen() backlog argument and why is the TIME_WAIT state necessary in TCP connection termination?",
          "Write a complete C program for a concurrent TCP daytime server using the fork() system call."
        ]
      },
      {
        id: "np-io-multiplexing",
        name: "I/O Multiplexing: select(), poll(), and Non-Blocking Sockets",
        importance: "Very High",
        keyPoints: [
          "I/O Multiplexing allows a single process to monitor multiple file and socket descriptors simultaneously without multithreading.",
          "select() monitors read, write, and exception descriptor sets (fd_set) with an optional timeout.",
          "select() is constrained by FD_SETSIZE (typically 1024) and requires O(N) linear scanning of the descriptor set after wakeup.",
          "poll() uses an array of pollfd structures with separate events and revents bitmasks, removing the FD_SETSIZE limit.",
          "shutdown() provides unidirectional connection termination (SHUT_RD, SHUT_WR, SHUT_RDWR) unlike close(), which closes both directions immediately."
        ],
        theory: "In high-performance networking, blocking I/O causes a thread to suspend indefinitely when awaiting data on a descriptor, while non-blocking polling wastes CPU cycles. I/O multiplexing delegates descriptor monitoring to the kernel. When select() returns, it modifies the passed fd_set bitmasks to reflect only those descriptors ready for read/write. The application iterates through the set using FD_ISSET() to process traffic. This architecture powers scalable single-threaded servers, event loops (like Node.js and Nginx), and telnet/chat servers that must multiplex console input with network sockets.",
        code: `fd_set read_fds;
struct timeval tv = {5, 0}; // 5-second timeout
FD_ZERO(&read_fds);
FD_SET(server_fd, &read_fds);
FD_SET(STDIN_FILENO, &read_fds);
int max_fd = (server_fd > STDIN_FILENO ? server_fd : STDIN_FILENO) + 1;

int ready = select(max_fd, &read_fds, NULL, NULL, &tv);
if (ready > 0) {
    if (FD_ISSET(STDIN_FILENO, &read_fds)) {
        // Read console command
    }
    if (FD_ISSET(server_fd, &read_fds)) {
        // Accept incoming network client
    }
}`,
        example: "Comparison of 5 I/O Models: Blocking I/O, Non-blocking I/O, I/O Multiplexing (select/poll), Signal-driven I/O (SIGIO), and Asynchronous I/O (POSIX aio_read).",
        commonExamQuestions: [
          "Compare the five I/O models in Unix with appropriate timing diagrams.",
          "Explain the select() system call, its parameters, fd_set manipulation macros, and limitations compared to poll().",
          "Differentiate between close() and shutdown() system calls in network programming."
        ]
      },
      {
        id: "np-socket-options-raw",
        name: "Socket Options, Raw Sockets & ICMP Ping Implementation",
        importance: "High",
        keyPoints: [
          "Socket options are inspected and modified using getsockopt() and setsockopt() at SOL_SOCKET, IPPROTO_IP, or IPPROTO_TCP levels.",
          "SO_REUSEADDR allows a server to bind to a local port currently in the TIME_WAIT state.",
          "TCP_NODELAY disables Nagle's algorithm to eliminate latency for interactive or packet-sensitive traffic.",
          "Raw sockets (SOCK_RAW) bypass transport layer processing, allowing direct construction and reception of raw IP and ICMP packets.",
          "ICMP Echo Request and Echo Reply packets utilize raw sockets to implement the ping diagnostic utility."
        ],
        theory: "Socket options govern transport behavior. By default, attempting to restart a crashed server immediately yields 'Address already in use' because previous connections remain in TIME_WAIT. Setting SO_REUSEADDR instructs the kernel to permit socket rebinding. Raw sockets (requiring root/superuser privilege) allow applications to bypass TCP/UDP framing. When socket(AF_INET, SOCK_RAW, IPPROTO_ICMP) is called, the kernel passes raw IP packets directly to user space, enabling protocol analyzers, custom routers, traceroute, and ping utilities to verify network reachability.",
        code: `// Enable SO_REUSEADDR
int opt = 1;
setsockopt(sockfd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

// Create raw socket for ICMP Ping (requires root)
int raw_fd = socket(AF_INET, SOCK_RAW, IPPROTO_ICMP);
struct icmp_packet {
    uint8_t type;      // 8 for ICMP Echo Request
    uint8_t code;      // 0
    uint16_t checksum;
    uint16_t id;
    uint16_t seq;
};`,
        example: "ICMP checksum calculation is the 16-bit one's complement sum of all 16-bit words in the ICMP header and payload.",
        commonExamQuestions: [
          "Explain the purpose of getsockopt() and setsockopt(). Discuss SO_REUSEADDR, SO_KEEPALIVE, and TCP_NODELAY.",
          "What is a raw socket? How does it differ from stream and datagram sockets? Explain how ping is implemented using raw sockets.",
          "Write short notes on: Domain Name System (DNS) address conversion functions (getaddrinfo and freeaddrinfo)."
        ]
      }
    ],
    theoryTopics: [
      "Explain Unix domain socket address structure (sockaddr_un) and how socketpair() enables bi-directional IPC.",
      "Describe daemon processes and write the steps involved in daemonizing a process using daemon_init().",
      "Compare Unicast, Broadcast, and Multicast communication with IP address classes and socket option requirements.",
      "Explain Elementary UDP socket functions (sendto, recvfrom) and discuss connected UDP sockets."
    ]
  },

  "Digital Governance": {
    subjectName: "Digital Governance",
    code: "BIT402CO",
    creditHours: 3,
    topics: [
      {
        id: "dg-framework-maturity",
        name: "e-Governance Foundations, G2X Models & Maturity Stages",
        importance: "Very High",
        keyPoints: [
          "e-Government refers to the use of ICT by government agencies to transform relations with citizens, businesses, and government arms.",
          "e-Governance is a broader concept encompassing public participation, political transparency, policymaking, and democratic accountability.",
          "Four primary delivery models: G2C (Government to Citizen), G2B (Government to Business), G2G (Government to Government), and G2E (Government to Employee).",
          "UN e-Government Maturity Stages: Emerging (Web presence), Enhanced (Information download), Interactive (Two-way forms), Transactional (Online fees/payments), and Connected/Seamless (Integrated cross-agency workflows).",
          "UN e-Government Development Index (EGDI) composite index aggregates: Online Service Index (OSI), Telecommunication Infrastructure Index (TII), and Human Capital Index (HCI)."
        ],
        theory: "Digital governance fundamentally shifts public administration from siloed, bureaucratic paper workflows to citizen-centric, automated service ecosystems. G2C implementations (such as online passport renewal, land revenue, and driving license portals) eliminate bureaucratic intermediaries and curtail petty corruption. G2B initiatives (online business registration, e-customs, e-procurement) lower corporate transaction friction. The United Nations EGDI framework benchmarks national readiness, emphasizing that online services cannot succeed without robust telecommunication infrastructure and a digitally literate human population.",
        code: `// UN EGDI Composite Metric:
// EGDI = 1/3 * (OSI_norm + TII_norm + HCI_norm)
// Nepal EGDI Progress: Transitioning from Medium to High EGDI through
// national broadband fiber rollout and mobile-first portals (Nagarik App).`,
        example: "Nagarik App exemplifies integrated G2C/G2G: authenticating citizens against the National Identity Database (NID) and linking citizenship, PAN, voter card, and educational certificates.",
        commonExamQuestions: [
          "Define e-Government and differentiate it from e-Governance. Explain the G2C, G2B, G2G, and G2E models with practical examples.",
          "Describe the five stages of e-Government maturity with the Gartner and UN models.",
          "Explain the components of the UN e-Government Development Index (EGDI) and discuss barriers to e-readiness in developing nations like Nepal."
        ]
      },
      {
        id: "dg-ppp-infrastructure-gidc",
        name: "Public-Private Partnerships (PPP) & Nepal GIDC Infrastructure",
        importance: "Very High",
        keyPoints: [
          "Public-Private Partnerships (PPPs) leverage private capital, technical innovation, and management efficiency to finance public e-governance systems.",
          "PPP Delivery Models: Build-Operate-Transfer (BOT), Build-Own-Operate-Transfer (BOOT), Build-Own-Operate (BOO), and Application Service Provider (ASP).",
          "Government Integrated Data Center (GIDC) located at Singha Durbar, Kathmandu serves as the centralized hosting facility for all government agencies in Nepal.",
          "Disaster Recovery Center (DRC) established at Hetauda ensures business continuity for critical national databases and government cloud (GI-Cloud).",
          "Nepal e-Government Master Plan (e-GMP) and Nepal e-Governance Interoperability Framework (NeGIF) standardize data exchange across disparate ministries."
        ],
        theory: "Financing large-scale public ICT infrastructure is resource-intensive for governments. In a BOOT model, a private consortium designs, finances, builds, and operates an e-governance facility for a concession period (recovering capital via transaction fees), after which ownership transfers to the state. Nepal's digital backbone relies on the Government Integrated Data Center (GIDC) under the Department of Information Technology (DoIT). NeGIF specifies XML/JSON schema standards and Web Services API protocols to break data silos between Ministry of Home Affairs (Citizenship/NID), Inland Revenue Department (PAN), and Department of Transport Management.",
        code: `// BOOT PPP Lifecycle in e-Governance:
// 1. Feasibility Study & RFP Tender
// 2. Private Consortium Build & Deployment
// 3. Concession Operation Period (e.g., 5-10 yrs revenue share)
// 4. Asset Audit, Knowledge Transfer & Full State Handover`,
        example: "E-Procurement portal of Nepal (bolpatra.gov.np) and Nagarik App deployed on GIDC cloud infrastructure.",
        commonExamQuestions: [
          "Explain the various Public-Private Partnership (PPP) models (BOOT, BOO, JV, ASP) for e-Governance projects with advantages and risks.",
          "Discuss the role, architecture, and significance of the Government Integrated Data Center (GIDC) and Disaster Recovery Center (DRC) in Nepal.",
          "What is an Interoperability Framework? Explain the Nepal e-Governance Interoperability Framework (NeGIF)."
        ]
      },
      {
        id: "dg-security-cyberlaw",
        name: "e-Governance Security, PKI, Digital Signatures & Cyber Law",
        importance: "High",
        keyPoints: [
          "Security challenges in e-governance: citizen identity theft, ransomware on public infrastructure, unauthorized database alteration, and data privacy leaks.",
          "Public Key Infrastructure (PKI) provides confidentiality, data integrity, non-repudiation, and authentication for official state transactions.",
          "Digital Signatures use asymmetric cryptography (SHA-256 hash encrypted with the signer's private key) verified via public certificate authorities.",
          "Electronic Transactions Act (ETA) 2063 (2006) of Nepal provides legal recognition to electronic records, digital signatures, and creates IT tribunals for cybercrime prosecution.",
          "ISO/IEC 27001 standard governs Information Security Management Systems (ISMS) across public sector data centers."
        ],
        theory: "For citizens and businesses to trust electronic government transactions, electronic records must hold legal parity with signed paper documents. Nepal's Electronic Transactions Act 2063 established the Controller of Certifying Authorities (CCA) to license Root and Subordinate Certifying Authorities for issuance of cryptographic digital signature certificates. Digital signatures ensure non-repudiation: once a government official digitally approves a gazette, land deed, or budget release with their hardware token (USB cryptographic token), they cannot dispute their authorship.",
        code: `// Digital Signature Verification Equation:
// Signer: Hash = SHA256(Data), Signature = Encrypt(Hash, PrivateKey)
// Receiver: Hash' = SHA256(ReceivedData), DecryptedHash = Decrypt(Signature, PublicKey)
// If Hash' == DecryptedHash => Document is authentic and untampered.`,
        example: "Inland Revenue Department (IRD) digital tax clearance and e-bidding submissions legally mandate digital signature certificates under ETA 2063.",
        commonExamQuestions: [
          "Explain the role of Public Key Infrastructure (PKI) and digital signatures in securing e-Government systems.",
          "Highlight the major provisions, objectives, and legal mechanisms of the Electronic Transactions Act (ETA) 2063 of Nepal.",
          "Explain the concept of Digital Democracy and how ICT enhances citizen political participation and transparency."
        ]
      }
    ],
    theoryTopics: [
      "Explain the System Development Life Cycle (SDLC) for e-Government projects and describe why public ICT projects fail (Design-Reality Gap).",
      "Discuss the application of Artificial Intelligence in governance: predictive policy making, fraud detection in customs/taxation, and bias mitigation.",
      "Analyze the case studies of e-governance in Estonia (X-Road) and India (Aadhaar & UPI) and extract lessons for Nepal.",
      "Explain Citizen Relationship Management (CRM) in digital governance and the role of online grievance redressal systems (Hello Sarkar)."
    ]
  },

  "Machine Learning (Track A)": {
    subjectName: "Machine Learning (Track A)",
    code: "BIT421CO",
    creditHours: 3,
    topics: [
      {
        id: "ml-supervised-learning",
        name: "Supervised Learning: Linear, Logistic Regression & Evaluation Metrics",
        importance: "Very High",
        keyPoints: [
          "Supervised learning trains a predictive model on labeled feature-target pairs (X, y).",
          "Linear regression predicts continuous target variables by minimizing Mean Squared Error (MSE) via Ordinary Least Squares or Gradient Descent.",
          "Logistic regression predicts categorical probabilities using the sigmoid function: sigma(z) = 1 / (1 + e^(-z)) and optimizes Cross-Entropy Loss.",
          "Support Vector Machines (SVM) find the optimal maximum-margin hyperplane separating classes, utilizing kernel tricks for non-linear boundaries.",
          "Evaluation metrics for classification: Confusion Matrix, Accuracy, Precision (TP / (TP + FP)), Recall (TP / (TP + FN)), F1-Score, and ROC-AUC curve."
        ],
        theory: "In linear regression, the hypothesis h_theta(x) = theta^T x is evaluated using the cost function J(theta) = (1/2m) * sum((h(x) - y)^2). Gradient descent updates parameters in the negative gradient direction: theta_j := theta_j - alpha * (1/m) * sum((h(x) - y)*x_j). For binary classification, logistic regression maps real numbers to probabilities [0, 1]. In cases with class imbalance (such as medical diagnosis or fraud detection), raw accuracy is misleading, making Precision, Recall, and the harmonic mean F1-Score the standard benchmarks.",
        code: `from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print(confusion_matrix(y_test, y_pred))
print(classification_report(y_test, y_pred))`,
        example: "Precision measures of all predicted positives, how many were true; Recall measures of all actual positives, how many were captured.",
        commonExamQuestions: [
          "Derive the gradient descent update rule for univariate linear regression with cost function minimization.",
          "Explain logistic regression and show how the sigmoid activation function transforms linear outputs into classification probabilities.",
          "Construct a Confusion Matrix and define Precision, Recall, Specificity, and F1-Score with formulas."
        ]
      },
      {
        id: "ml-decision-trees-random-forest",
        name: "Decision Trees, Information Gain, ID3 Algorithm & Random Forests",
        importance: "Very High",
        keyPoints: [
          "Decision Trees construct hierarchical decision rules by recursively partitioning data at feature split points.",
          "Entropy measures impurity or disorder: Entropy(S) = - sum(p_i * log2(p_i)).",
          "Information Gain calculates the reduction in entropy achieved by partitioning on attribute A: Gain(S, A) = Entropy(S) - sum((|S_v| / |S|) * Entropy(S_v)).",
          "The ID3 algorithm greedily selects the attribute yielding the highest Information Gain at each tree node.",
          "Random Forests apply bagging (bootstrap aggregating) and random feature selection over an ensemble of decision trees to eliminate variance."
        ],
        theory: "Decision tree induction operates in a top-down greedy search through the hypothesis space. When building a classifier, attributes with higher information gain maximize class separation. However, deep trees overfit the training data by memorizing noise. Post-pruning and setting maximum depth constraints mitigate this. Random Forests extend decision trees by training hundreds of de-correlated trees on distinct bootstrap samples of data, selecting a random subset of m = sqrt(p) features at each split, and aggregating votes via majority voting for robust prediction.",
        code: `# Entropy calculation in Python:
import math

def entropy(pos, neg):
    total = pos + neg
    if pos == 0 or neg == 0: return 0.0
    p1 = pos / total
    p2 = neg / total
    return -(p1 * math.log2(p1) + p2 * math.log2(p2))

# Dataset with 9 positive and 5 negative examples:
# Entropy(S) = -(9/14 * log2(9/14) + 5/14 * log2(5/14)) = 0.940 bits`,
        example: "If Entropy(S) = 0.940, and split on 'Windy' leaves S_weak (6+, 2-) and S_strong (3+, 3-), Gain(S, Windy) = 0.940 - [8/14*0.811 + 6/14*1.0] = 0.048.",
        commonExamQuestions: [
          "Explain the ID3 algorithm for decision tree induction. How are Entropy and Information Gain calculated?",
          "Given a training dataset table, calculate the information gain for candidate attributes and identify the root node.",
          "Explain the ensemble learning concept in Random Forests and how bagging reduces model variance."
        ]
      },
      {
        id: "ml-unsupervised-kmeans-tuning",
        name: "Unsupervised K-Means, Bias-Variance Tradeoff & Cross-Validation",
        importance: "Very High",
        keyPoints: [
          "Unsupervised learning groups unlabeled data patterns based on spatial or geometric similarity.",
          "K-Means iteratively: (1) assigns each sample to the nearest cluster centroid (Euclidean distance), (2) recalculates centroids as the arithmetic mean of assigned points.",
          "Optimal number of clusters k is determined using the Elbow Method (Within-Cluster Sum of Squares, WCSS) or Silhouette Coefficient.",
          "Bias-Variance Tradeoff: High bias causes underfitting (oversimplified model); High variance causes overfitting (sensitivity to training noise).",
          "K-Fold Cross-Validation splits data into k equal folds, training on k-1 folds and validating on the remaining fold across k iterations."
        ],
        theory: "K-Means seeks to minimize the objective function J = sum(sum(||x_i - mu_j||^2)). It converges to a local optimum, making multiple random centroid initializations (such as K-Means++) necessary. Model tuning balances the irreducible error, squared bias, and variance. Regularization techniques penalize large weights: L1 Lasso (lambda * sum(|theta|)) drives coefficients to zero performing feature selection, whereas L2 Ridge (lambda * sum(theta^2)) shrinks coefficients evenly, preventing overfitting.",
        code: `from sklearn.cluster import KMeans
from sklearn.model_selection import cross_val_score
from sklearn.linear_model import Ridge

# K-Means clustering
kmeans = KMeans(n_clusters=3, init='k-means++', random_state=42)
clusters = kmeans.fit_predict(X)

# 5-Fold Cross Validation on Ridge Regularized Model
scores = cross_val_score(Ridge(alpha=1.0), X, y, cv=5, scoring='r2')
print("Average CV Score:", scores.mean())`,
        example: "K-Fold: for k=5, 80% is used for training and 20% for testing per iteration, repeated 5 times so every sample is tested once.",
        commonExamQuestions: [
          "Explain the K-Means clustering algorithm step by step. How is the optimal value of K chosen using the Elbow method?",
          "Explain the Bias-Variance tradeoff with a neat graph showing underfitting, optimal fit, and overfitting regions.",
          "Differentiate between L1 Lasso and L2 Ridge regularization with mathematical loss penalty formulations."
        ]
      }
    ],
    theoryTopics: [
      "Explain the text mining pipeline: tokenization, stop-word removal, stemming/lemmatization, and TF-IDF matrix generation.",
      "Compare Supervised, Unsupervised, and Reinforcement Learning paradigms with practical application examples.",
      "Describe K-Nearest Neighbors (KNN) algorithm, distance metrics (Euclidean, Manhattan), and the effect of parameter k on decision boundaries.",
      "Explain the architecture of a Multi-Layer Perceptron (MLP) and how the Backpropagation algorithm computes gradient errors."
    ]
  },

  "Business Intelligence and Data Science (Track A)": {
    subjectName: "Business Intelligence and Data Science (Track A)",
    code: "BIT422CO",
    creditHours: 3,
    topics: [
      {
        id: "bi-dw-star-snowflake",
        name: "Data Warehousing: Star vs Snowflake Schema & ETL Processing",
        importance: "Very High",
        keyPoints: [
          "Data Warehouse (DW) is a subject-oriented, integrated, time-variant, and non-volatile collection of enterprise data supporting decision-making.",
          "Star Schema features a central de-normalized Fact Table surrounded by single-table Dimension tables with direct foreign keys.",
          "Snowflake Schema normalizes dimension tables into sub-dimensions, reducing data redundancy at the cost of complex multi-table joins.",
          "Fact tables store quantitative business measures (sales amount, quantity, profit) and foreign keys; dimension tables store contextual descriptive attributes.",
          "ETL Process (Extraction, Transformation, Loading) extracts data from heterogeneous operational databases, cleanses/validates it, and loads it into the warehouse."
        ],
        theory: "Operational transaction processing systems (OLTP) are optimized for high-throughput single-row ACID writes, whereas Data Warehouses are optimized for analytical aggregations (OLAP) across millions of records. In Star Schema design, dimensions are deliberately de-normalized to optimize read query performance by avoiding expensive joins during slicing and dicing. In Snowflake schemas, dimensions are normalized (e.g., splitting Customer into City and Country tables) to save disk space and guarantee structural third-normal-form consistency. Real-time DW architectures leverage Change Data Capture (CDC) to stream updates instantly.",
        code: `-- Star Schema Fact & Dimension Definitions:
CREATE TABLE Dim_Time (
    TimeKey INT PRIMARY KEY,
    Date DATE, Month VARCHAR(10), Quarter INT, Year INT
);
CREATE TABLE Dim_Product (
    ProductKey INT PRIMARY KEY,
    ProductName VARCHAR(100), Category VARCHAR(50), UnitPrice DECIMAL(10,2)
);
CREATE TABLE Fact_Sales (
    SalesKey INT PRIMARY KEY,
    TimeKey INT REFERENCES Dim_Time(TimeKey),
    ProductKey INT REFERENCES Dim_Product(ProductKey),
    QuantitySold INT,
    TotalRevenue DECIMAL(12,2)
);`,
        example: "Bill Inmon's Enterprise Data Warehouse (top-down corporate warehouse feeding data marts) vs Ralph Kimball's Dimensional Data Mart bus architecture (bottom-up conformed dimensions).",
        commonExamQuestions: [
          "Define Data Warehouse and discuss its key characteristics: subject-oriented, integrated, time-variant, and non-volatile.",
          "Compare Star Schema and Snowflake Schema with architectural diagrams, fact tables, and dimension tables.",
          "Explain the steps and challenges involved in the Extraction, Transformation, and Loading (ETL) pipeline."
        ]
      },
      {
        id: "bi-olap-operations-apriori",
        name: "OLAP Operations, Data Cubes & Apriori Association Rule Mining",
        importance: "Very High",
        keyPoints: [
          "OLAP (Online Analytical Processing) enables multi-dimensional analytical queries using data cubes.",
          "Five core OLAP operations: Roll-up (aggregation/climbing hierarchy), Drill-down (increasing detail), Slice (single dimension filter), Dice (sub-cube selection), and Pivot (rotating axes).",
          "Association Rule Mining discovers co-occurrence relationships between items in large transactional datasets (Market Basket Analysis).",
          "Three core metrics: Support = P(A union B), Confidence = P(B|A) = Support(A union B) / Support(A), Lift = Confidence / P(B).",
          "The Apriori Principle states: If an itemset is frequent, all of its subsets must also be frequent (anti-monotonicity property)."
        ],
        theory: "OLAP engines organize dimensions into multidimensional arrays called cubes (e.g., Sales by Product, Location, and Time). Analysts perform Roll-up (e.g., viewing sales by Year rather than Day) or Drill-down (inspecting sales in a specific store). For data mining, the Apriori algorithm scans transactions to generate frequent 1-itemsets that satisfy a minimum support threshold, then iteratively generates candidate (k+1)-itemsets by joining frequent k-itemsets, pruning those whose subsets fail the minimum support threshold, thereby eliminating exponential search space overhead.",
        code: `// Apriori Rule Evaluation Metrics:
// Given 100 transactions:
// 40 contain Bread, 30 contain Milk, 20 contain both Bread and Milk:
// Support(Bread -> Milk) = 20 / 100 = 20% (0.20)
// Confidence(Bread -> Milk) = Support(Bread and Milk) / Support(Bread) = 20 / 40 = 50%
// Expected P(Milk) = 30 / 100 = 0.30
// Lift(Bread -> Milk) = 0.50 / 0.30 = 1.67 (Positive association > 1)`,
        example: "Lift > 1 indicates that purchasing Bread significantly increases the probability of purchasing Milk, justifying co-locating them on supermarket shelves.",
        commonExamQuestions: [
          "Differentiate between OLTP and OLAP systems in terms of database design, query volume, operations, and users.",
          "Explain the five major OLAP operations on a multi-dimensional data cube with illustrative sketches.",
          "Given a transaction database table, generate frequent itemsets and association rules using the Apriori algorithm at min_sup=30% and min_conf=60%."
        ]
      },
      {
        id: "bi-dashboards-bigdata-analytics",
        name: "Visual Analytics, KPI Dashboards & Big Data Hadoop Architecture",
        importance: "High",
        keyPoints: [
          "Business Performance Management (BPM) translates strategic goals into Key Performance Indicators (KPIs) tracked via executive dashboards.",
          "Balanced Scorecard evaluates performance across 4 balanced perspectives: Financial, Customer, Internal Business Processes, and Learning/Growth.",
          "Big Data 5 V's: Volume (petabyte scale), Velocity (streaming speed), Variety (structured/unstructured), Veracity (data quality), and Value.",
          "Hadoop Distributed File System (HDFS) stores large files across distributed commodity clusters with master NameNode and worker DataNodes (3x replication).",
          "MapReduce framework parallelizes computational jobs across two phases: Map (filtering and sorting key-value pairs) and Reduce (aggregating results)."
        ],
        theory: "Modern visual analytics tools (such as Tableau, Microsoft Power BI, and Qlik) utilize associative in-memory engines to render interactive dashboards displaying sales pipelines, customer churn, and financial margins. When data volume outgrows relational infrastructure, Apache Hadoop provides distributed fault-tolerant processing. HDFS divides files into 128 MB blocks distributed across DataNodes. The NameNode holds directory metadata in RAM. MapReduce brings computation to the data (data locality), eliminating costly network transfers during big data analytics.",
        code: `// MapReduce WordCount logic:
// Map Phase:
void map(String key, String value) {
    for (String word : value.split("\\s+")) {
        emit(word, 1);
    }
}
// Reduce Phase:
void reduce(String word, Iterator<Integer> values) {
    int sum = 0;
    for (int v : values) sum += v;
    emit(word, sum);
}`,
        example: "Six Sigma methodology (DMAIC: Define, Measure, Analyze, Improve, Control) aims for 3.4 defects per million opportunities in business quality.",
        commonExamQuestions: [
          "What is a Balanced Scorecard? Discuss its four perspectives and how it is used as a performance measurement system.",
          "Explain the Hadoop architecture: discuss the roles of NameNode, DataNodes, Secondary NameNode, and HDFS block replication.",
          "Describe the MapReduce programming paradigm and trace the WordCount execution pipeline with an example."
        ]
      }
    ],
    theoryTopics: [
      "Explain the data mining process (CRISP-DM methodology) and discuss WEKA tool capabilities for classification and clustering.",
      "Describe Text and Web Analytics: differentiate between Web Content Mining, Web Structure Mining, and Web Usage Mining.",
      "Discuss ethical and privacy issues in big data analytics, customer profiling, and AI-driven recommendation systems.",
      "Explain Real-Time Data Warehousing, Change Data Capture (CDC), and Lambda/Kappa stream processing architectures."
    ]
  },

  "Deep Learning (Track A)": {
    subjectName: "Deep Learning (Track A)",
    code: "BIT423CO",
    creditHours: 3,
    topics: [
      {
        id: "dl-backprop-optimization",
        name: "Backpropagation, Vanishing Gradients & Modern Optimizers",
        importance: "Very High",
        keyPoints: [
          "Artificial Neural Networks (ANN) compute outputs via stacked linear transformations followed by non-linear activations: a = f(W*x + b).",
          "Backpropagation calculates the gradient of the loss function with respect to every weight using the mathematical chain rule of calculus.",
          "Vanishing gradient problem occurs with saturating activations (Sigmoid, Tanh) in deep layers where gradients approach zero, stalling weight updates.",
          "Non-saturating activations like ReLU (max(0, x)) and Leaky ReLU alleviate vanishing gradients.",
          "Adaptive optimizers: Adam (Adaptive Moment Estimation) combines Momentum (first moment of gradients) with RMSProp (second raw moment / variance)."
        ],
        theory: "In multi-layer feedforward networks, training seeks to minimize empirical risk L(y, y_hat). The error delta for layer l is backpropagated: delta^l = (W^(l+1)^T * delta^(l+1)) * f'(z^l). In deep architectures using sigmoid activation sigma'(z) <= 0.25, multiplying multiple fractional derivatives across layers causes gradients to shrink exponentially toward zero at early layers. Modern deep networks resolve this using ReLU activations, He/Xavier weight initialization, Batch Normalization (which normalizes mini-batch inputs to zero mean and unit variance), and Residual skip connections.",
        code: `import torch
import torch.nn as nn
import torch.optim as optim

class DeepMLP(nn.Module):
    def __init__(self, in_features, hidden, out_features):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_features, hidden),
            nn.BatchNorm1d(hidden),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(hidden, out_features)
        )
    def forward(self, x): return self.net(x)

model = DeepMLP(784, 128, 10)
optimizer = optim.Adam(model.parameters(), lr=0.001, betas=(0.9, 0.999))
criterion = nn.CrossEntropyLoss()`,
        example: "Adam update rule: m_t = beta1*m_{t-1} + (1-beta1)*g_t; v_t = beta2*v_{t-1} + (1-beta2)*g_t^2; theta_t = theta_{t-1} - lr * m_hat / (sqrt(v_hat) + eps).",
        commonExamQuestions: [
          "Derive the Backpropagation learning algorithm for a 3-layer neural network using the chain rule of differentiation.",
          "What is the Vanishing and Exploding Gradient problem in deep networks? How do ReLU, Batch Normalization, and Residual connections solve it?",
          "Compare SGD, Momentum, RMSProp, and Adam optimization algorithms with their mathematical formulas."
        ]
      },
      {
        id: "dl-cnn-architectures",
        name: "Convolutional Neural Networks (CNNs) & Architectures",
        importance: "Very High",
        keyPoints: [
          "CNNs preserve spatial topology in images using convolution operations with learnable filter kernels, sharing weights across the input.",
          "Feature map spatial dimension formula: Output = floor((W - K + 2P) / S) + 1, where W=Input size, K=Kernel size, P=Padding, S=Stride.",
          "Pooling layers (Max Pooling, Average Pooling) downsample spatial dimensions, providing translation invariance and reducing parameter count.",
          "Classic CNN milestone architectures: LeNet-5 (digits), AlexNet (ReLU, Dropout, GPUs), VGG-16 (deep 3x3 filter stacking), and ResNet (Residual skip connections).",
          "ResNet solves the degradation problem in ultra-deep networks (50-152 layers) by learning residual mappings: F(x) = H(x) - x, where H(x) = F(x) + x."
        ],
        theory: "Fully connected networks fail on computer vision tasks because a 1000x1000 RGB image produces millions of input weights per neuron, causing catastrophic overfitting and loss of 2D spatial locality. Convolutional layers apply weight sharing and local receptive fields: a small kernel (e.g., 3x3) slides across the image computing dot products to detect low-level edges, mid-level textures, and high-level object parts in deeper layers. Max pooling retains the most prominent activation in each patch. ResNet introduced identity skip connections that let gradients flow directly backward without attenuation.",
        code: `import torch.nn as nn

class ConvNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.features = nn.Sequential(
            # Input: 1x28x28 (MNIST)
            nn.Conv2d(in_channels=1, out_channels=32, kernel_size=3, padding=1), # -> 32x28x28
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2), # -> 32x14x14
            nn.Conv2d(in_channels=32, out_channels=64, kernel_size=3, padding=1), # -> 64x14x14
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2)  # -> 64x7x7
        )
        self.classifier = nn.Linear(64 * 7 * 7, 10)`,
        example: "Input image 32x32 with 5x5 filter, Stride=1, Padding=0 => Output size = (32 - 5 + 0)/1 + 1 = 28x28.",
        commonExamQuestions: [
          "Explain the building blocks of a Convolutional Neural Network: Convolution, Stride, Padding, Pooling, and Fully Connected layers.",
          "Calculate the output dimension and number of learnable parameters for a given convolutional and pooling layer specification.",
          "Discuss the architecture and innovations of AlexNet, VGG-16, and ResNet. Why are residual skip connections crucial in deep networks?"
        ]
      },
      {
        id: "dl-rnn-lstm-generative",
        name: "Sequential RNNs, LSTMs, GRUs & Generative Models",
        importance: "Very High",
        keyPoints: [
          "Recurrent Neural Networks (RNNs) process sequential temporal data by maintaining an internal hidden state h_t across time steps.",
          "Standard RNNs suffer from vanishing gradients when backpropagating through time (BPTT), failing to capture long-term sequence dependencies.",
          "Long Short-Term Memory (LSTM) networks resolve this using a constant error carousel and three multiplicative gates: Forget Gate, Input Gate, and Output Gate.",
          "Gated Recurrent Units (GRUs) simplify LSTMs by merging hidden and cell states into Reset and Update gates.",
          "Generative Adversarial Networks (GANs) pit two networks against each other: a Generator creating synthetic samples and a Discriminator classifying real vs fake."
        ],
        theory: "In standard RNNs, the hidden state update h_t = tanh(W_hh * h_{t-1} + W_xh * x_t) repeatedly multiplies weight matrices over sequential steps. When unfolded over 50+ time steps during BPTT, gradients either explode or vanish to zero. LSTMs maintain a dedicated cell state C_t governed by: (1) Forget gate f_t = sigma(W_f [h_{t-1}, x_t] + b_f) deciding what information to discard, (2) Input gate i_t and candidate cell state C_tilde_t deciding what new information to store, and (3) Output gate o_t controlling the filtered state emitted as h_t. In generative deep learning, GANs optimize a minimax zero-sum game: min_G max_D V(D, G).",
        code: `// LSTM Gate Equations:
// 1. Forget Gate:   f_t = sigmoid(W_f * [h_{t-1}, x_t] + b_f)
// 2. Input Gate:    i_t = sigmoid(W_i * [h_{t-1}, x_t] + b_i)
// 3. Candidate:     ~C_t = tanh(W_c * [h_{t-1}, x_t] + b_c)
// 4. Update State:  C_t = f_t * C_{t-1} + i_t * ~C_t
// 5. Output Gate:   o_t = sigmoid(W_o * [h_{t-1}, x_t] + b_o)
// 6. Hidden State:  h_t = o_t * tanh(C_t)`,
        example: "Natural Language Processing: LSTMs power sequence-to-sequence machine translation and speech recognition.",
        commonExamQuestions: [
          "Explain the architecture and working of a Long Short-Term Memory (LSTM) cell. Write the mathematical formulas for all gates.",
          "Differentiate between RNN, LSTM, and GRU architectures for sequence modeling.",
          "Explain the concept of Generative Adversarial Networks (GANs). Discuss the objective function and adversarial training between Generator and Discriminator."
        ]
      }
    ],
    theoryTopics: [
      "Explain Regularization techniques in Deep Learning: Dropout, DropConnect, Early Stopping, and Weight Decay.",
      "Describe Deep Belief Networks (DBNs) and Restricted Boltzmann Machines (RBMs) with energy-based learning.",
      "Discuss Deep Learning applications in Computer Vision (Object Detection via YOLO/R-CNN) and Natural Language Processing (Transformers).",
      "Explain Second-Order Optimization methods (Newton's method, Quasi-Newton BFGS) vs First-Order Stochastic Gradient Descent."
    ]
  },

  "Digital Commerce (Track B)": {
    subjectName: "Digital Commerce (Track B)",
    code: "BIT428CO",
    creditHours: 3,
    topics: [
      {
        id: "dc-ecommerce-models-security",
        name: "E-Commerce Business Models, Security Frameworks & Cryptography",
        importance: "Very High",
        keyPoints: [
          "E-Commerce business models categorize transactions: B2B (Alibaba), B2C (Amazon, Daraz), C2C (eBay, Hamrobazaar), C2B, and G2C.",
          "Revenue models include: Direct Sales, Subscription model (Netflix), Advertising model, Affiliate marketing, and Transaction fee models.",
          "Consumer Mercantile Model consists of 3 distinct phases: Prepurchase preparation (search, comparison), Purchase consummation (cart, payment), and Postpurchase interaction (shipping, returns, customer support).",
          "Security requirements in digital transactions: Confidentiality (SSL/TLS), Integrity (Hashing), Authentication (Certificates), and Non-repudiation (Digital Signatures).",
          "PCI-DSS (Payment Card Industry Data Security Standard) mandates encryption of cardholder data at rest and in transit."
        ],
        theory: "Digital Commerce extends traditional electronic commerce by unifying omnichannel mobile apps, web stores, supply chain telemetry, and automated personalized marketing. E-commerce platforms rely on a layered security architecture: HTTPS (TLS 1.3) encrypts the communication channel between customer browser and server; symmetric encryption (AES-256) protects stored database records; and asymmetric cryptography (RSA/ECC) establishes authentic sessions and digital signatures. Firewalls (WAF) inspect incoming HTTP requests to block SQL injection and cross-site scripting (XSS) on shopping carts.",
        code: `// Secure HTTPS Checkout Handshake:
// 1. Client Hello (supported TLS ciphers)
// 2. Server Hello + TLS Certificate (X.509)
// 3. Client validates CA certificate chain
// 4. Client generates pre-master secret, encrypts with Server Public Key
// 5. Both derive symmetric session key for rapid AES-256 payload encryption`,
        example: "Daraz or Amazon checkout flow: SSL/TLS secure session -> Merchant payment gateway API call -> Tokenized card transaction.",
        commonExamQuestions: [
          "Discuss the major business models of E-Commerce (B2B, B2C, C2C) and revenue generation strategies with real-world examples.",
          "Explain the Consumer Mercantile Model and describe its three distinct phases in detail.",
          "What are the major security threats in electronic commerce? Discuss how cryptography, firewalls, and digital certificates mitigate them."
        ]
      },
      {
        id: "dc-mcommerce-digital-payment",
        name: "Mobile Commerce (M-Commerce), Payment Gateways & Digital Wallets",
        importance: "Very High",
        keyPoints: [
          "M-Commerce represents electronic commerce transactions conducted through mobile wireless devices (smartphones, tablets).",
          "Underlying wireless standards: GSM, GPRS, 3G, 4G LTE, and 5G low-latency communications.",
          "Payment gateway acts as a secure intermediary between merchant websites and acquiring banks, tokenizing financial credentials.",
          "Digital wallet systems (eSewa, Khalti, Apple Pay) utilize QR codes, NFC contactless protocols, and two-factor authentication (2FA/OTP).",
          "Location-Based Services (LBS) in M-commerce leverage GPS and cell triangulation for hyper-local geotargeting and dynamic delivery dispatch."
        ],
        theory: "Mobile commerce presents unique advantages over desktop e-commerce, including ubiquity (anywhere, anytime access), personalization, reachability, and localization. However, it operates under constraints: smaller screen viewports, mobile battery life, and intermittent wireless connectivity. Payment gateways encrypt card data, dispatch requests to processing networks (Visa/Mastercard or national switches like NCHL/connectIPS in Nepal), and return authorization codes. Tokenization replaces sensitive 16-digit primary account numbers (PAN) with random cryptographic tokens to neutralize database breach liabilities.",
        code: `// Payment Gateway Verification Pattern (HMAC-SHA256):
const crypto = require('crypto');
function verifyPaymentSignature(secretKey, message, receivedSignature) {
    const computedSignature = crypto
        .createHmac('sha256', secretKey)
        .update(message)
        .digest('base64');
    return computedSignature === receivedSignature;
}`,
        example: "eSewa ePay integration: Merchant submits total_amount, transaction_uuid, product_code; eSewa authenticates user via 2FA and redirects back with signed confirmation.",
        commonExamQuestions: [
          "Define M-Commerce and compare it with traditional E-Commerce. What are the key drivers and technical constraints of mobile commerce?",
          "Explain the architecture and end-to-end working of an online payment gateway with a sequence flow diagram.",
          "Describe digital token-based payment systems and electronic wallets. How does tokenization enhance payment security?"
        ]
      },
      {
        id: "dc-digital-marketing-seo-cms",
        name: "Digital Marketing, SEO, Web CMS (WordPress) & AI in Commerce",
        importance: "High",
        keyPoints: [
          "Search Engine Optimization (SEO): On-page (meta tags, semantic HTML, keywords, page speed) and Off-page (backlinks, domain authority).",
          "Pay-Per-Click (PPC) and Search Engine Marketing (SEM): Google Ads auction, Cost-Per-Click (CPC), Click-Through-Rate (CTR), and Quality Score.",
          "Social Media Marketing (SMM) across Facebook, Instagram, LinkedIn, and TikTok using conversion tracking pixels.",
          "Web Content Management Systems (CMS): WordPress development, WooCommerce architecture, database schema, and custom plugin integration.",
          "Artificial Intelligence in Digital Commerce: Personalized product recommendation engines, Conversational AI chatbots, and dynamic algorithmic pricing."
        ],
        theory: "In digital marketing, acquiring customer traffic requires combining organic SEO and paid performance marketing. Google evaluates on-page factors (title tags, Core Web Vitals, mobile responsiveness) and off-page reputation (PageRank algorithm). When building commercial portals, WordPress and WooCommerce offer rapid deployment through modular hooks, actions, and filters coupled with MySQL relational storage. AI recommendation engines employ Collaborative Filtering (recommending items liked by users with similar purchase histories) and Content-Based Filtering (recommending items matching product attributes).",
        code: `// Collaborative Filtering Matrix Factorization Idea:
// User-Item Rating Matrix R ~ U (User preferences) * V^T (Item features)
// Predict missing rating: r_hat_{u,i} = dot(u_u, v_i)
// Recommendation lists top-K unpurchased items with highest predicted ratings.`,
        example: "Recommendation engines drive 35% of Amazon sales; WordPress powers over 40% of all websites globally.",
        commonExamQuestions: [
          "What is Search Engine Optimization (SEO)? Differentiate between On-page and Off-page SEO techniques.",
          "Explain the Digital Marketing Mix and describe how Pay-Per-Click (PPC) advertising auctions operate.",
          "Discuss the architecture and steps required to build and administrate an online digital commerce store using WordPress and WooCommerce."
        ]
      }
    ],
    theoryTopics: [
      "Explain the impact of Artificial Intelligence on electronic commerce: customer service chatbots, predictive demand forecasting, and visual search.",
      "Describe the legal, regulatory, and taxation issues surrounding cross-border electronic commerce and digital token transactions.",
      "Compare various Web CMS platforms (WordPress/WooCommerce, Shopify, Magento) in terms of scalability, security, and developer control.",
      "Explain consumer behavior online, sales funnels (AIDA model: Attention, Interest, Desire, Action), and Conversion Rate Optimization (CRO)."
    ]
  },

  "Multimedia and Application (Track B)": {
    subjectName: "Multimedia and Application (Track B)",
    code: "BIT429CO",
    creditHours: 3,
    topics: [
      {
        id: "mm-audio-sampling-midi",
        name: "Digital Audio Representation, Nyquist Theorem & MIDI Protocol",
        importance: "Very High",
        keyPoints: [
          "Digital audio conversion involves two stages: Sampling (discretizing time) and Quantization (discretizing amplitude).",
          "Nyquist-Shannon Sampling Theorem: Sampling rate f_s must be at least twice the highest frequency component: f_s >= 2 * f_max to prevent aliasing.",
          "CD-Audio Standard: 44.1 kHz sampling rate, 16-bit linear PCM resolution, stereo 2 channels = 1,411.2 kbps uncompressed bitrate.",
          "Quantization Error produces quantization noise, with Signal-to-Quantization-Noise-Ratio (SQNR): SQNR ~ 6.02 * n + 1.76 dB (where n = bit depth).",
          "Musical Instrument Digital Interface (MIDI) transmits performance event instructions (Note-On, Velocity, Pitch Bend), not raw digitized sound waves."
        ],
        theory: "Sound waves are continuous acoustic pressure vibrations. To represent sound digitally, an Analog-to-Digital Converter (ADC) samples amplitude at regular intervals. If sampling falls below the Nyquist frequency, high frequencies fold back into audible frequencies as harsh distortions called aliasing, which is prevented by an analog anti-aliasing low-pass filter before the ADC. Quantization rounds each sample to one of 2^n discrete voltage steps. In contrast to bulky Pulse Code Modulation (PCM) audio files, MIDI is a compact symbolic communication protocol (typically 31.25 kbaud serial) that sends small multi-byte messages instructing electronic synthesizers what note to play, for how long, and with what velocity.",
        code: `// CD Audio Bitrate Calculation:
// Bitrate = Sampling_Rate * Bit_Depth * Channels
// Bitrate = 44,100 samples/sec * 16 bits/sample * 2 channels = 1,411,200 bps = 1.411 Mbps
// 1 hour uncompressed audio = 1.411 Mbps * 3600 sec / 8 = ~635 MB.

// MIDI Note-On Message (3 bytes):
// Byte 1: Status Byte 0x90 (Note On, Channel 0)
// Byte 2: Note Number 0x3C (Middle C, 60)
// Byte 3: Velocity 0x64 (Volume/intensity 100)`,
        example: "Human hearing range: 20 Hz to 20,000 Hz. Nyquist rate requires sampling at >= 40 kHz; 44.1 kHz leaves an engineered roll-off safety margin.",
        commonExamQuestions: [
          "State and explain the Nyquist-Shannon Sampling Theorem. What is aliasing and how is it prevented in digital audio systems?",
          "Differentiate between raw digital audio (PCM) and MIDI. Explain MIDI message structure, devices, and advantages.",
          "Calculate the storage required for 10 minutes of stereo audio recorded at 48 kHz with 24-bit resolution."
        ]
      },
      {
        id: "mm-compression-jpeg-mpeg",
        name: "Data Compression Standards: Lossless (Huffman, RLE) & Lossy (JPEG, MPEG)",
        importance: "Very High",
        keyPoints: [
          "Data compression reduces redundant bits: Lossless allows exact reconstruction (text, code); Lossy achieves high compression ratios by discarding imperceptible details (images, video).",
          "Run-Length Encoding (RLE) compresses sequential repeating characters; Huffman coding assigns variable-length prefix codes based on character probabilities.",
          "JPEG Image Compression Pipeline: Color space conversion (RGB to YCbCr) -> Chroma subsampling (4:2:0) -> 8x8 Block Discrete Cosine Transform (DCT) -> Quantization (Lossy step) -> Zig-zag scanning -> Entropy coding.",
          "Discrete Cosine Transform (DCT) transforms spatial pixel intensities into frequency coefficients (1 DC coefficient, 63 AC coefficients).",
          "MPEG Video Compression uses inter-frame temporal redundancy with three frame types: I-frames (Intra), P-frames (Predicted via motion vectors), and B-frames (Bidirectional interpolation)."
        ],
        theory: "Uncompressed multimedia demands immense bandwidth and storage. Huffman coding constructs an optimal binary prefix tree where frequent symbols get short bitstrings and rare symbols get longer bitstrings. For natural images, JPEG exploits the human eye's relative insensitivity to high-frequency color variations compared to luminance (Y). Chroma subsampling discards color detail. 8x8 block DCT isolates low-frequency visual energy into the top-left DC coefficient. The quantization matrix divides higher-frequency coefficients by larger values, rounding many to zero. In MPEG video, rather than storing 30 full images every second, motion compensation encodes only the movement vectors and residual differences between frames.",
        code: `// Huffman Coding Example:
// Symbols: A (freq 45%), B (13%), C (12%), D (16%), E (9%), F (5%)
// Priority queue merges smallest frequencies:
// Resulting variable prefix codes:
// A: 0 (1 bit)
// B: 101 (3 bits)
// C: 100 (3 bits)
// D: 111 (3 bits)
// Average code length significantly less than fixed 3 bits per symbol.`,
        example: "MPEG Group of Pictures (GOP) pattern: I-B-B-P-B-B-P-B-B-I. I-frames can be decoded independently; P and B frames require preceding/following reference frames.",
        commonExamQuestions: [
          "Explain the JPEG image compression algorithm step by step with a block diagram. Which step is responsible for data loss?",
          "Construct a Huffman tree and find the optimal prefix codes for a given character frequency distribution table.",
          "Explain the three frame types in MPEG video compression (I, P, and B frames) and describe motion estimation/compensation."
        ]
      },
      {
        id: "mm-rtos-streaming-qos",
        name: "Multimedia OS Scheduling (EDF, RM) & Streaming QoS (RTP, RTSP)",
        importance: "Very High",
        keyPoints: [
          "Continuous media streams (video, audio) impose strict real-time temporal deadlines; late packets are useless.",
          "Rate Monotonic (RM) scheduling is a static-priority algorithm: tasks with shorter periods receive higher priority. Schedulable if utilization U <= n * (2^(1/n) - 1).",
          "Earliest Deadline First (EDF) is a dynamic-priority algorithm: the task with the nearest absolute deadline is executed next. Schedulable up to 100% CPU utilization (U <= 1.0).",
          "Real-Time Transport Protocol (RTP) runs over UDP providing packet timestamps, sequence numbers, and payload type identification.",
          "Real-Time Streaming Protocol (RTSP) provides VCR-like remote playback control (SETUP, PLAY, PAUSE, TEARDOWN) for media servers."
        ],
        theory: "Operating systems handling multimedia must schedule continuous media tasks predictably without audio dropouts or video stutter. Rate Monotonic (RM) assigns fixed priorities inversely proportional to task period T. For n=2 tasks, RM guarantees schedulability if utilization U <= 82.8%; for large n, U <= ln(2) ~ 69.3%. EDF dynamically assigns highest priority to whichever active task is closest to its deadline, achieving optimal 100% theoretical utilization. Over IP networks, streaming media uses RTP/RTCP: RTP carries timestamps to recreate proper playback timing and reorder jumbled UDP packets; RTCP sends periodic QoS telemetry (packet loss, jitter) so the server can adapt bitrate.",
        code: `// Rate Monotonic Schedulability Check:
// Task 1: Period T1 = 20ms, Execution C1 = 5ms  => U1 = 5/20 = 0.25
// Task 2: Period T2 = 50ms, Execution C2 = 15ms => U2 = 15/50 = 0.30
// Total U = 0.25 + 0.30 = 0.55
// Bound for n=2: 2 * (2^(1/2) - 1) = 2 * (1.414 - 1) = 0.828
// Since 0.55 <= 0.828, the tasks are guaranteed schedulable under RM.`,
        example: "Video on Demand (VoD) protocols: RTSP controls the session on TCP port 554, while RTP transports media data over UDP ports.",
        commonExamQuestions: [
          "Compare Rate Monotonic (RM) and Earliest Deadline First (EDF) real-time scheduling algorithms with schedulability condition formulas.",
          "Given a set of periodic real-time tasks with execution times and periods, determine if they are schedulable under RM and construct a Gantt chart.",
          "Explain the roles of RTP, RTCP, and RTSP in multimedia streaming and Quality of Service (QoS) management."
        ]
      }
    ],
    theoryTopics: [
      "Describe multimedia synchronization: define intra-media and inter-media synchronization and explain lip-sync skew tolerances.",
      "Explain optical storage media: compare physical track structure, pit/land geometry, and capacities of CD, DVD, and Blu-ray discs.",
      "Discuss hypermedia document architecture standards: SGML, ODA, and MHEG for interactive multimedia applications.",
      "Explain raster vs vector graphics, color models (RGB, CMYK, YUV), and image processing fundamentals (dithering, spatial filtering)."
    ]
  },

  "GIS (Track C)": {
    subjectName: "GIS (Track C)",
    code: "BIT435CO",
    creditHours: 3,
    topics: [
      {
        id: "gis-components-data-models",
        name: "GIS Architecture, Vector vs Raster Spatial Data Models",
        importance: "Very High",
        keyPoints: [
          "Geographic Information System (GIS) integrates hardware, software, geospatial data, people, and methods to capture, store, manipulate, analyze, and display spatial data.",
          "Vector Data Model represents discrete geographic features using geometric coordinates: Points (0D, trees, wells), Lines/Polylines (1D, roads, rivers), and Polygons (2D, parcels, lakes).",
          "Raster Data Model represents continuous geographic phenomena using a regular grid matrix of cells/pixels, each carrying a value (elevation, satellite temperature, land cover).",
          "Tessellations partition space into regular polygons (squares, triangles, hexagons) or irregular networks (Triangulated Irregular Network - TIN).",
          "Geo-databases store both spatial geometry (coordinates) and non-spatial attribute tables linked by unique feature identifiers (FID/ObjectID)."
        ],
        theory: "A GIS allows users to answer questions of location ('Where is it?'), condition ('What satisfies criteria?'), trends ('What has changed?'), patterns ('What spatial clusters exist?'), and modeling ('What if a flood occurs?'). Vector models excel at representing discrete, human-made infrastructure with precise boundaries, minimal storage footprint, and topological network connectivity (such as road networks or pipe infrastructure). Raster models excel at continuous environmental surfaces (like elevation DEMs, soil moisture, and satellite imagery) and facilitate rapid grid-based map algebra, though they consume greater storage and degrade resolution upon zooming.",
        code: `// Spatial Data Representation:
// Vector Point: (Longitude, Latitude) -> (85.3240, 27.7172) [Kathmandu]
// Vector Line:  [(x1, y1), (x2, y2), (x3, y3)] [Bagmati River segment]
// Vector Polygon: [(x1,y1), (x2,y2), (x3,y3), (x1,y1)] (closed loop)
// Raster Grid: 2D Array matrix where cell[row][col] = Elevation in meters`,
        example: "Shapefiles consist of mandatory files: .shp (geometry), .shx (spatial index), .dbf (dBase attribute table), and .prj (coordinate projection).",
        commonExamQuestions: [
          "Define GIS and discuss its five essential components. Explain the major functionalities of a GIS system.",
          "Compare Vector and Raster spatial data models in detail with respect to representation, data structure, advantages, and limitations.",
          "What is a Geo-database? Explain how spatial and attribute data are linked and stored."
        ]
      },
      {
        id: "gis-projections-utm-nepal",
        name: "Map Projections, Coordinate Systems & UTM in Nepal",
        importance: "Very High",
        keyPoints: [
          "Map projection is the mathematical transformation of Earth's 3D curved ellipsoidal surface onto a 2D flat plane.",
          "Every projection inevitably introduces distortion in at least one property: Shape (Conformal), Area (Equivalent), Distance (Equidistant), or Direction (Azimuthal).",
          "Universal Transverse Mercator (UTM) is a conformal cylindrical projection that divides the Earth into 60 longitudinal zones of 6 degrees each.",
          "Nepal spans across UTM Zone 44N (80°E to 84°E) and UTM Zone 45N (84°E to 88°E).",
          "Modified UTM (MUTM) in Nepal uses 3 narrower 3-degree zones with Central Meridians at 81°E, 84°E, and 87°E and a scale factor of 0.9999 to minimize scale distortion across the country."
        ],
        theory: "Projecting a sphere onto a flat surface cannot be accomplished without stretching or tearing. Conformal projections (like Mercator) preserve local angles and shapes, which is critical for navigation and topographic mapping, but distort area at high latitudes. UTM wraps a cylinder transversally around the globe. To keep scale distortion under 1:1,000, each UTM zone is 6° wide with a central scale factor of 0.9996 and a False Easting of 500,000 m. Because Nepal's east-west elongation falls across two separate standard UTM zones (causing coordinate discontinuities at 84°E), Nepal's Survey Department designed Modified UTM (MUTM) with three 3° zones to ensure high cartographic precision.",
        code: `// UTM Zone Index Formula:
// Zone = floor((Longitude + 180) / 6) + 1
// Example: Kathmandu (85.32° E)
// Zone = floor((85.32 + 180) / 6) + 1 = floor(44.22) + 1 = Zone 45 North
// Nepal coordinates: Northern Hemisphere, False Northing = 0m, False Easting = 500,000m.`,
        example: "Geographic Coordinate System (GCS): latitude/longitude in degrees (WGS84); Projected Coordinate System (PCS): coordinates in meters on flat grid.",
        commonExamQuestions: [
          "What is map projection? Explain the different types of map projections based on projection surface (Cylindrical, Conical, Planar).",
          "Explain the Universal Transverse Mercator (UTM) projection system. Discuss why and how Nepal uses Modified UTM (MUTM).",
          "What is Georeferencing? Explain the role of Ground Control Points (GCPs) and root mean square error (RMSE)."
        ]
      },
      {
        id: "gis-spatial-analysis-sdi",
        name: "Spatial Analysis Operations, Topology & Spatial Data Infrastructure (SDI)",
        importance: "Very High",
        keyPoints: [
          "Topology defines mathematical spatial relationships between features: Contiguity (adjacency), Connectivity (network links), and Containment (co-location).",
          "Digitization errors include: Overshoots, Undershoots, Dangles, Slivers, and Missing labels; corrected via snapping tolerances.",
          "Core Vector Analysis Operations: Buffering (proximity zones), Overlay (Intersect, Union, Identity, Erase), and Network Analysis (Dijkstra shortest path).",
          "Raster Map Algebra executes cell-by-cell mathematical and logical operations across stacked raster layers.",
          "Spatial Data Infrastructure (SDI) coordinates geospatial data sharing via four pillars: Policy, Standards (OGC), Access Network (Clearinghouse/Geoportal), and People."
        ],
        theory: "Topology allows a GIS to understand spatial relationships without recomputing coordinates: it knows which land parcels share boundaries and which road segments connect at intersections. Spatial analysis combines geometric and attribute criteria to solve complex multi-criteria decision-making problems (such as hospital site suitability, landfill allocation, or flood inundation modeling). Buffering creates a catchment zone around a feature (e.g., 500m around a river). Intersect overlay outputs only the shared geographic space of two layers with combined attributes. National Spatial Data Infrastructure (NSDI) prevents costly duplication of geospatial surveys across government ministries.",
        code: `// Vector Overlay Operations:
// 1. Intersect: Layer A AND Layer B (attributes of both, common geometry)
// 2. Union:     Layer A OR Layer B (complete extent, polygon only)
// 3. Clip:      Cookie-cutter boundary cut (geometry of B, attributes of A only)
// 4. Buffer:    Polygon generated at distance d: B(x, d) = {p | dist(p, x) <= d}`,
        example: "Disaster evacuation routing in Kathmandu: Network Analysis uses edge weights (road length / travel speed) to find the shortest path to safety shelters.",
        commonExamQuestions: [
          "Explain the concept of Topology in GIS. Discuss the three fundamental topological relationships: Contiguity, Connectivity, and Containment.",
          "Describe major vector spatial analysis techniques: Buffering, Overlay (Union, Intersect), and Network Analysis with neat diagrams.",
          "What is Spatial Data Infrastructure (SDI)? Explain its components and discuss the current status and challenges of GIS in Nepal."
        ]
      }
    ],
    theoryTopics: [
      "Explain spatial data input methods: manual digitization, scanning, GPS ground surveys, and remote sensing satellite extraction.",
      "Discuss data editing in GIS: rubber sheeting, affine transformation, re-projection, and topological error cleaning.",
      "Explain Digital Elevation Models (DEM), Triangulated Irregular Networks (TIN), and their applications in slope, aspect, and watershed analysis.",
      "Describe the role of Open Geospatial Consortium (OGC) standards: WMS (Web Map Service), WFS (Web Feature Service), and GeoJSON."
    ]
  },

  "Remote Sensing (Track C)": {
    subjectName: "Remote Sensing (Track C)",
    code: "BIT436CO",
    creditHours: 3,
    topics: [
      {
        id: "rs-emr-spectral-signatures",
        name: "Electromagnetic Radiation (EMR), Atmospheric Windows & Spectral Signatures",
        importance: "Very High",
        keyPoints: [
          "Remote sensing is the science of acquiring information about Earth features from a distance without physical contact, measuring reflected or emitted EMR.",
          "EMR spectrum spans: Gamma, X-rays, UV, Visible (0.4-0.7 um: Blue, Green, Red), Near-Infrared (NIR 0.7-1.1 um), Short-Wave Infrared (SWIR), Thermal Infrared, and Microwave.",
          "Atmospheric Windows are wavelength bands where the atmosphere is transparent (gases do not absorb radiation), enabling satellite sensors to view the surface.",
          "Atmospheric scattering types: Rayleigh scattering (particles smaller than wavelength, causes blue sky), Mie scattering (smoke/dust), and Non-selective scattering (water droplets/clouds).",
          "Spectral Signatures graph reflectance vs wavelength: healthy green vegetation exhibits low red reflectance (chlorophyll absorption) and high NIR reflectance (leaf mesophyll scattering)."
        ],
        theory: "Remote sensing sensors capture electromagnetic radiation governed by Planck's radiation law, Stefan-Boltzmann law (E = sigma * T^4), and Wien's displacement law (lambda_max = 2898 / T). When solar radiation travels through the atmosphere, ozone absorbs UV, while water vapor and CO2 absorb mid-infrared. Sensors must operate within atmospheric windows (Visible, NIR, SWIR, Thermal, and Microwave). Every terrestrial material has a distinctive spectral reflectance curve. Healthy vegetation reflects strongly in the Near-Infrared while absorbing red light for photosynthesis. Normalized Difference Vegetation Index (NDVI) exploits this contrast: NDVI = (NIR - Red) / (NIR + Red), yielding values between -1 and +1.",
        code: `// Normalized Difference Vegetation Index (NDVI) Formula:
// NDVI = (NIR - Red) / (NIR + Red)
// Example Sentinel-2 Bands: Band 8 (NIR), Band 4 (Red)
// Healthy Forest: NIR = 0.50, Red = 0.05 => NDVI = (0.50 - 0.05) / (0.50 + 0.05) = 0.45 / 0.55 = +0.81
// Water Body: NIR = 0.01, Red = 0.05 => NDVI = (0.01 - 0.05) / (0.01 + 0.05) = -0.04 / 0.06 = -0.66`,
        example: "False Color Composite (FCC): Mapping NIR to Red, Red to Green, and Green to Blue renders dense vegetation in vivid red, distinguishing forests from barren land.",
        commonExamQuestions: [
          "Define Remote Sensing. Explain the complete process of remote sensing from energy source to data application with a schematic diagram.",
          "Explain the Electromagnetic Spectrum (EMR) and discuss the significance of Atmospheric Windows and scattering in satellite imaging.",
          "What is a Spectral Signature? Sketch and compare the spectral reflectance curves of Healthy Vegetation, Clear Water, and Dry Bare Soil."
        ]
      },
      {
        id: "rs-sensors-resolutions",
        name: "Sensor Systems & The Four Resolutions of Remote Sensing",
        importance: "Very High",
        keyPoints: [
          "Active sensors supply their own illumination source (Radar, Lidar); Passive sensors measure reflected natural solar energy or thermal emission (Landsat, Sentinel).",
          "Sensor scanning mechanisms: Whiskbroom (across-track, oscillating mirror, single detector) and Pushbroom (along-track, linear CCD array, longer dwell time).",
          "Spatial Resolution: Smallest physical ground area represented by a single image pixel (e.g., Landsat 30m, Sentinel-2 10m, WorldView 0.31m).",
          "Spectral Resolution: Number and width of specific electromagnetic bands a sensor records (Multispectral has 4-12 wide bands; Hyperspectral has hundreds of contiguous narrow bands).",
          "Radiometric Resolution: Bit-depth sensitivity to subtle radiance variations (8-bit = 256 gray levels; 12-bit = 4,096; 16-bit = 65,536).",
          "Temporal Resolution: Revisit interval required for the satellite to photograph the exact same ground location twice."
        ],
        theory: "Sensor engineering involves tradeoffs between resolutions: high spatial resolution limits swath width; narrow spectral bands reduce the photon energy reaching each detector, demanding larger spatial pixels or advanced optics. Pushbroom scanners (linear arrays) eliminated moving mirrors, increasing integration dwell time per pixel and improving signal-to-noise ratio. Radiometric resolution governs contrast: a 12-bit sensor can distinguish slight shadow nuances that an 8-bit sensor clips to pure black. Hyperspectral imaging (imaging spectroscopy) measures continuous spectral curves, enabling identification of specific mineral types or crop nitrogen deficiencies.",
        code: `// Sensor Resolution Summary:
// Satellite    Spatial   Spectral   Radiometric   Temporal (Revisit)
// Landsat-8    30m       11 bands   12-bit (16b)  16 days
// Sentinel-2   10-20m    13 bands   12-bit        5 days (constellation)
// MODIS        250-1000m 36 bands   12-bit        1-2 days
// WorldView-3  0.31m     8 bands    14-bit        < 1 day (agile)`,
        example: "Tradeoff rule: A geostationary weather satellite has high temporal resolution (15 minutes) but coarse spatial resolution (1-2 km).",
        commonExamQuestions: [
          "Differentiate between Active and Passive remote sensing systems with examples.",
          "Explain the four fundamental resolutions of remote sensing: Spatial, Spectral, Radiometric, and Temporal resolution.",
          "Compare Across-Track (Whiskbroom) and Along-Track (Pushbroom) scanning systems with neat sketches."
        ]
      },
      {
        id: "rs-orbits-image-processing",
        name: "Satellite Orbits (Sun-Synchronous vs Geostationary) & Image Classification",
        importance: "High",
        keyPoints: [
          "Sun-Synchronous Polar Orbits (LEO, 700-900 km altitude, near 98° inclination) pass over every latitude at the same local solar time, ensuring consistent sun illumination.",
          "Geostationary Orbits (GEO, 35,786 km altitude, 0° inclination over equator) rotate at the exact speed of Earth's rotation, remaining stationary over one spot (weather monitoring).",
          "Digital Image Processing stages: Pre-processing (Radiometric and Geometric correction), Image Enhancement (contrast stretching, spatial filtering), and Classification.",
          "Supervised Classification trains statistical algorithms on user-selected Ground Truth Training Sites (Maximum Likelihood Classifier, Random Forest, Minimum Distance).",
          "Unsupervised Classification clusters spectral pixels mathematically without prior training labels (K-Means, ISODATA algorithms)."
        ],
        theory: "Sun-synchronous orbits cross the equator at approximately 10:30 AM local time worldwide to minimize cloud cover while retaining optimal shadow contrast for terrain interpretation. Raw satellite imagery contains geometric distortions (from Earth rotation, curvature, and sensor altitude variations) corrected by ground control point polynomial transformations, and radiometric errors (atmospheric haze). Supervised classification assigns pixels to classes using training signatures; Maximum Likelihood assumes a multivariate Gaussian probability distribution for each class, assigning pixel x to the class maximizing the posterior probability P(C_i | x).",
        code: `// Maximum Likelihood Decision Rule:
// Assign pixel vector x to class C_i if:
// g_i(x) = -ln|Sigma_i| - (x - mu_i)^T * Sigma_i^(-1) * (x - mu_i) is maximized.
// Where mu_i is the mean vector and Sigma_i is the covariance matrix of training class i.`,
        example: "Land Use Land Cover (LULC) mapping: Classifying satellite imagery into Forest, Water, Urban, Agriculture, and Barren classes.",
        commonExamQuestions: [
          "Compare Sun-Synchronous and Geostationary satellite orbits in terms of altitude, inclination, applications, and coverage.",
          "Explain the steps involved in Digital Image Processing of satellite data: Geometric correction, Radiometric correction, and Enhancement.",
          "Differentiate between Supervised and Unsupervised image classification techniques. Explain the Maximum Likelihood Classification algorithm."
        ]
      }
    ],
    theoryTopics: [
      "Explain the integration of GIS and Remote Sensing for disaster monitoring in Nepal (flood mapping, landslide hazard assessment, GLOF monitoring).",
      "Describe Microwave Remote Sensing: Radar principles, synthetic aperture radar (SAR), backscatter, and cloud penetration capabilities.",
      "Explain False Color Composites (FCC), True Color Composites (TCC), and principal component analysis (PCA) in remote sensing interpretation.",
      "Discuss major Earth observation satellite programs: LANDSAT series, Sentinel series, IRS (Indian Remote Sensing), and high-resolution satellites."
    ]
  },

  "Data Center and Disaster Recovery Centers (Track C)": {
    subjectName: "Data Center and Disaster Recovery Centers (Track C)",
    code: "BIT437CO",
    creditHours: 3,
    topics: [
      {
        id: "dc-tiers-architecture",
        name: "Data Center Architectures & Uptime Institute Tier Standards (I to IV)",
        importance: "Very High",
        keyPoints: [
          "A Data Center is a centralized facility housing IT infrastructure (servers, storage arrays, network switches) with dedicated power, cooling, and security.",
          "Data Center Types: Enterprise (private on-premises), Colocation (shared multi-tenant facility), Hyperscale Cloud (AWS, Microsoft, Google), and Edge Data Centers.",
          "Uptime Institute Tier Classification benchmarks availability and fault tolerance across four tiers.",
          "Tier I (Basic): 99.671% uptime (28.8 hrs downtime/yr), single non-redundant path (N).",
          "Tier II (Redundant components): 99.741% uptime (22.7 hrs downtime/yr), redundant capacity components (N+1).",
          "Tier III (Concurrently Maintainable): 99.982% uptime (1.6 hrs downtime/yr), multiple distribution paths, any component can be removed for maintenance without taking IT offline.",
          "Tier IV (Fault Tolerant): 99.995% uptime (0.4 hrs downtime/yr), completely isolated dual paths (2(N+1)), resilient against unplanned outages and disaster events."
        ],
        theory: "Data center classification evaluates the infrastructure's resilience against failure. In Tier I and II, performing routine transformer maintenance or UPS battery replacement requires an operational shutdown. Tier III introduces concurrent maintainability: every power and cooling distribution path has a redundant bypass, allowing planned maintenance with zero impact on running server workloads. Tier IV achieves autonomous fault tolerance: if a catastrophic cable cut, chiller failure, or electrical fire knocks out one entire side of the facility, the load instantly shifts to the active mirrored infrastructure without dropping a single compute packet.",
        code: `// Data Center Tier Comparison Table:
// Tier   Redundancy Path       Uptime %    Max Downtime/Year   Key Trait
// I      Single (N)            99.671%     28.8 hours          Non-redundant
// II     Single + Redundant C  99.741%     22.7 hours          N+1 components
// III    Active/Passive paths  99.982%     1.6 hours           Concurrently Maintainable
// IV     Active/Active 2(N+1)  99.995%     0.4 hours (26 mins) Fault Tolerant`,
        example: "ANSI/TIA-942 Telecommunications Infrastructure Standard for Data Centers standardizes architectural, electrical, mechanical, and telecommunication design.",
        commonExamQuestions: [
          "Define a modern Data Center and explain the four data center tiers according to Uptime Institute standards with uptime percentages and redundancy models.",
          "Explain the concept of 'Concurrent Maintainability' in Tier III and 'Fault Tolerance' in Tier IV data centers.",
          "Discuss the four key constraints (4Cs) of data center design: Power, Cooling, IT Infrastructure, and Space."
        ]
      },
      {
        id: "dc-power-cooling-pue",
        name: "Thermal Cooling (Hot/Cold Aisle), Power Distribution & PUE Efficiency",
        importance: "Very High",
        keyPoints: [
          "Power Usage Effectiveness (PUE) measures energy efficiency: PUE = Total Facility Energy / IT Equipment Energy. Ideal PUE is 1.0.",
          "Data Center Infrastructure Efficiency (DCiE) is the reciprocal metric: DCiE = (IT Equipment Energy / Total Facility Energy) * 100%.",
          "Hot Aisle / Cold Aisle Containment aligns server racks face-to-face (intake cold air) and back-to-back (exhaust hot air), preventing thermal mixing.",
          "Cooling topologies: Room-based cooling, Row-based cooling (In-Row CRAC), and Rack-based liquid cooling.",
          "Power infrastructure: Dual utility grid feeds, automatic transfer switch (ATS), uninterruptible power supplies (UPS, N+1 or 2N), and diesel standby generators."
        ],
        theory: "Servers convert nearly 100% of consumed electrical energy into heat. If hot exhaust air recirculates into server air intakes, thermal throttling or hardware failure ensues. In traditional data centers, PUE averaged 2.0 (meaning for every 1 Watt powering a CPU, another 1 Watt was spent on chillers, fans, and transformers). Physical hot or cold aisle containment seals the plenum, forcing cold air through server chassis into isolated hot return ducts, driving modern PUEs below 1.2. Electrical topology routes utility AC through double-conversion online UPS units (rectifier -> battery DC bus -> inverter) to condition clean sine-wave power and bridge the 15-30 second gap before diesel generators reach synchronization.",
        code: `// PUE and DCiE Calculation:
// Total Facility Power = 2,000 kW (Cooling: 700kW, Lighting/Power losses: 300kW, IT: 1,000kW)
// IT Equipment Power   = 1,000 kW
// PUE = 2,000 / 1,000 = 2.0
// DCiE = (1,000 / 2,000) * 100% = 50%
// If containment reduces cooling load to 200 kW, Total = 1,300 kW => PUE = 1,300/1,000 = 1.30 (DCiE = 76.9%)`,
        example: "ASHRAE TC 9.9 thermal guidelines recommend cold aisle inlet temperatures between 18°C and 27°C with 40-60% relative humidity to prevent electrostatic discharge (ESD).",
        commonExamQuestions: [
          "Define Power Usage Effectiveness (PUE) and DCiE. Calculate PUE given total facility power and server IT load.",
          "Explain the principle of Hot Aisle and Cold Aisle containment in data center thermal management. Why is mixing hot and cold air detrimental?",
          "Describe the electrical power distribution chain in a data center: Grid feed, Transformers, ATS, UPS redundancy (N, N+1, 2N), and Standby Diesel Generators."
        ]
      },
      {
        id: "dc-drp-bcp-rto-rpo",
        name: "Disaster Recovery Planning (DRP), BCP, RTO, RPO & DR Sites",
        importance: "Very High",
        keyPoints: [
          "Business Continuity Planning (BCP) ensures overall operational enterprise survival during and after a crisis; Disaster Recovery Planning (DRP) focuses specifically on restoring IT infrastructure and data.",
          "Recovery Time Objective (RTO): Maximum allowable duration of downtime before IT systems must be operational.",
          "Recovery Point Objective (RPO): Maximum acceptable data loss measured in time (e.g., up to 15 minutes of transactional data loss).",
          "Disaster Recovery Sites: Cold Site (empty shell, power/HVAC ready, hardware brought in after disaster; RTO days/weeks), Warm Site (hardware present, data restored from backup; RTO hours/days), Hot Site (fully redundant mirrored facility with synchronous/asynchronous replication; RTO minutes/seconds).",
          "Data replication strategies: Synchronous (zero RPO, latency bounded by speed of light, < 100 km) and Asynchronous (low RPO, unlimited distance)."
        ],
        theory: "A disaster recovery plan begins with a Business Impact Analysis (BIA) to identify mission-critical business processes and establish RTO and RPO thresholds. High-criticality banking systems demand RTO near zero and RPO=0. In synchronous data replication, a database transaction is not committed at the primary data center until written to disk at the secondary DR site; network latency restricts synchronous distance to under 100 km. In asynchronous replication, transactions commit locally and replicate in background queues, allowing cross-region or continental DR sites (such as Kathmandu GIDC replicating asynchronously to Hetauda DRC) without penalizing primary application response times.",
        code: `// RTO vs RPO Timeline:
// [Last Backup] -------- RPO --------> [Disaster Event] -------- RTO --------> [System Restored]
// <--- Lost Data (RPO) --->           <--- Operational Downtime (RTO) --->
// Hot Site: RTO ~ minutes, RPO ~ 0
// Warm Site: RTO ~ hours, RPO ~ last nightly backup
// Cold Site: RTO ~ days/weeks, RPO ~ offsite tape backup`,
        example: "Nepal GIDC (Singha Durbar) pairs with Disaster Recovery Center Hetauda over optical fiber to provide disaster resilience against seismic hazards.",
        commonExamQuestions: [
          "Differentiate between Business Continuity Planning (BCP) and Disaster Recovery Planning (DRP).",
          "Explain Recovery Time Objective (RTO) and Recovery Point Objective (RPO) with an illustrative timeline diagram.",
          "Compare Cold Site, Warm Site, and Hot Site disaster recovery facilities in terms of cost, recovery speed, infrastructure, and suitability."
        ]
      }
    ],
    theoryTopics: [
      "Explain fire detection and suppression systems in data centers: VESDA (Very Early Smoke Detection Apparatus), clean agent gaseous suppression (FM-200, Novec 1230), and pre-action sprinklers.",
      "Describe structured cabling standards in data centers: Top-of-Rack (ToR) vs End-of-Row (EoR) architecture and fiber optic backbones.",
      "Discuss Cloud Disaster Recovery (DRaaS: Disaster Recovery as a Service) compared to maintaining an enterprise secondary physical facility.",
      "Explain data center physical security layers: perimeter fencing, biometric access control, mantraps, and 24/7 CCTV surveillance."
    ]
  },

  "Internship": {
    subjectName: "Internship",
    code: "BIT403CO",
    creditHours: 3,
    topics: [
      {
        id: "internship-placement-proposal",
        name: "Industry Placement, Problem Definition & Proposal Defense (10%)",
        importance: "Very High",
        keyPoints: [
          "The BIT 7th Semester Internship carries 3 credits (minimum 45 contact/industry hours) under joint academic and corporate supervision.",
          "Approved domains: Commercial Banks, Telecommunications (NTC, Ncell), Software Development Companies, Hospitals, and Government IT Departments.",
          "Internship groups are limited to a maximum of 3 students, but each student must author an individual documentation portfolio.",
          "The Internship Plan must be formalized within the first two weeks, outlining project background, objective statement, tools, and work breakdown structure (WBS).",
          "Proposal Defense accounts for 10% of total evaluation (5% Topic Selection and Proposal Report, 5% Oral Presentation) evaluated by Supervisor and Mentor."
        ],
        theory: "The internship course bridges theoretical computer science education and corporate software engineering realities. Students enter established IT departments or software houses to tackle real enterprise problems (e.g., database performance optimization, API middleware construction, automated testing pipelines, or secure web application engineering). Proposal defense ensures that the student has identified a problem of appropriate academic and technical rigor, verified organizational access to data, and established clear milestone deliverables tracked with Gantt charts.",
        code: `// Internship Proposal Structure (Purbanchal University Standard):
// 1. Title Page & Certificate of Approval
// 2. Introduction & Organizational Profile
// 3. Problem Statement & Research Questions
// 4. Project Objectives (General & Specific)
// 5. Methodology & Tools (Tech Stack: Node.js, Python, PostgreSQL, etc.)
// 6. Feasibility Study (Technical, Operational, Economic)
// 7. Work Breakdown Structure (Gantt Chart schedule over 8-12 weeks)`,
        example: "A team of 2 students placed at an IT department: Student A builds the RESTful Microservice API and Database schema; Student B builds the Frontend Dashboard and Integration Tests.",
        commonExamQuestions: [
          "Describe the objectives, scope, and operational guidelines of the undergraduate BIT internship program.",
          "Explain the required structure and key components of an Internship Proposal document.",
          "Discuss the role and mutual responsibilities of the Student, Industry Mentor, and University Academic Advisor."
        ]
      },
      {
        id: "internship-midterm-system-design",
        name: "Mid-Term Review, Software Requirements & System Design (30%)",
        importance: "Very High",
        keyPoints: [
          "Mid-Term Review occurs after 2 months of industry placement and carries 30% of total evaluation (10% Program Design, 10% Prototype Demo, 10% Viva).",
          "Software Requirements Specification (SRS) details Functional Requirements, Non-Functional Requirements, and system constraints.",
          "Architectural Modeling requires standard UML diagrams: Use Case Diagrams, Class Diagrams, Sequence Diagrams, and Activity Diagrams.",
          "Database Architecture requires Conceptual, Logical, and Physical modeling with normalized (3NF) Entity-Relationship (ER) diagrams.",
          "Demonstration of working prototype code confirms tangible technical progress and active development."
        ],
        theory: "During the mid-term milestone, students transition from requirements gathering to architectural execution. Evaluators assess the fidelity of software engineering artifacts: whether the system follows clean architecture (Separation of Concerns: Controller, Service, Repository layers), whether database schemas enforce primary/foreign key constraints and indexing, and whether API endpoints return normalized JSON payloads. The live demo must exhibit core CRUD workflows, user authentication (JWT/OAuth), and error handling.",
        code: `// Typical Mid-Term UML & Architecture Deliverables:
// - Use Case Diagram: Actors, <<include>>, <<extend>> relationships
// - ER Diagram: Entities, Cardinalities (1:1, 1:N, M:N), Foreign Keys
// - Sequence Diagram: Actor -> Router -> Controller -> Service -> Database -> Response
// - Working Prototype: Functional prototype demonstrating core module execution`,
        example: "Hospital Management Module: Patient registration, appointment booking queue, doctor prescription logging, and billing record generation.",
        commonExamQuestions: [
          "What criteria are evaluated during the Internship Mid-Term Review? Outline the required technical documentation.",
          "Explain the role of UML Use Case Diagrams and Sequence Diagrams in modeling an internship software application.",
          "Discuss the importance of Database Normalization (up to 3NF) during the system design phase."
        ]
      },
      {
        id: "internship-final-report-viva",
        name: "Final Internship Report (APA 7th Format), Testing & External Viva (60%)",
        importance: "Very High",
        keyPoints: [
          "End-Term Final Defense carries 60% of total evaluation: Depth of Work (15%), Internship Report (25%), Oral Viva (10%), and Final Presentation (10%).",
          "Conducted before an External Examiner appointed by the Purbanchal University Dean's Office, Faculty of Science & Technology, alongside internal supervisors.",
          "The Final Report must strictly adhere to APA 7th Edition styling (1.5 line spacing, Times New Roman 12pt, standard margins, proper in-text citations).",
          "Mandatory Report Chapters: Abstract, Introduction, Statement of Problem & Objectives, Literature Review/Methodology, System Analysis, System Design, Implementation, Testing, Limitations/Future Enhancements, Conclusion, References.",
          "Testing documentation must substantiate Unit Testing, Integration Testing, and User Acceptance Testing (UAT) with test case tables."
        ],
        theory: "The final defense is the capstone examination of the internship. The student defends the technical choices made during the industry placement before an external university board. The written report represents academic scholarship: the Abstract summarizes the problem, methodology, key findings, and outcomes in ~250 words. The Testing chapter details test cases with input data, expected results, actual results, and pass/fail status. In the oral viva, examiners probe understanding of design patterns, security defenses (SQLi, XSS mitigation), scalability bottlenecks, and the student's individual contribution within the group project.",
        code: `// APA Report Structure & Test Case Table Format:
// Table 1: Authentication Module Test Cases
// TC_ID | Test Scenario         | Input Data       | Expected Result         | Actual Result | Status
// TC01  | Valid Login           | user@domain.com  | HTTP 200 + JWT emitted  | As expected   | Pass
// TC02  | SQL Injection Attempt | admin' OR '1'='1 | HTTP 401 Unauthorized   | Blocked (401) | Pass
// TC03  | Expired Token Request | Expired Bearer   | HTTP 403 Forbidden      | As expected   | Pass`,
        example: "References must follow APA 7th format: Pressman, R. S. (2014). Software engineering: A practitioner's approach. McGraw-Hill Education.",
        commonExamQuestions: [
          "Detail the complete chapter structure of a Purbanchal University undergraduate Internship Report according to APA formatting guidelines.",
          "Explain the difference between Unit Testing, Integration Testing, and System Testing as documented in the internship report.",
          "How is the 60% End-Term internship grade allocated between report, depth of work, presentation, and viva voce?"
        ]
      }
    ],
    theoryTopics: [
      "Explain the Software Requirement Specification (SRS) formulation according to IEEE 830 standards.",
      "Discuss the professional ethics, confidentiality agreements (NDAs), and intellectual property rights observed during corporate internships.",
      "Explain how Version Control Systems (Git, GitHub/GitLab branching strategies) and Agile Scrum frameworks facilitate internship software collaboration.",
      "Describe how to document limitations, technical debt, and future enhancements in capstone software project reports."
    ]
  },

  "Disaster Governance (Track C)": {
    subjectName: "Disaster Governance (Track C)",
    code: "BIT487CO",
    creditHours: 3,
    topics: [
      {
        id: "dg-disaster-sendai-framework",
        name: "Disaster Governance, Digital Divide & The Sendai Framework",
        importance: "Very High",
        keyPoints: [
          "Disaster Governance encompasses the policy, regulatory, and institutional frameworks through which public agencies, private sectors, and civil societies coordinate disaster risk reduction.",
          "Disasters are categorized into Natural (earthquakes, floods, landslides, glacial lake outburst floods - GLOFs) and Anthropogenic/Non-natural (industrial fires, chemical spills, cyber infrastructure collapse).",
          "Disaster and Digital Divide: Vulnerable and marginalized communities often lack access to digital communication channels, necessitating multi-channel warning systems (SMS, sirens, radio).",
          "Sendai Framework for Disaster Risk Reduction 2015-2030 outlines 4 global priorities: (1) Understanding disaster risk, (2) Strengthening disaster risk governance, (3) Investing in disaster risk reduction for resilience, (4) Enhancing disaster preparedness for effective response and 'Build Back Better'.",
          "Sustainable Development Goals (SDGs) closely intertwine with disaster governance, notably SDG 11 (Sustainable Cities and Communities) and SDG 13 (Climate Action)."
        ],
        theory: "Disaster risk is a function of hazard, exposure, and vulnerability: Risk = (Hazard x Exposure x Vulnerability) / Capacity. Digital disaster governance employs ICT infrastructure to assess hazard probabilities and reduce societal vulnerability. The Sendai Framework, adopted at the Third UN World Conference on Disaster Risk Reduction, emphasizes that governance must transition from reactive post-disaster relief to proactive, risk-informed development. The digital divide poses an existential risk: during flash floods in Nepal's Terai or landslides in the hill districts, relying exclusively on smartphone apps or web portals leaves illiterate or off-grid populations uninformed, requiring automated community sirens and cellular broadcast SMS integration.",
        code: `// Disaster Risk Formulation:
// Risk = (Hazard x Exposure x Vulnerability) / Coping_Capacity
// Hazard: Probability of physical event (e.g. 7.8 Richter earthquake)
// Exposure: Human population and assets located in hazard zones
// Vulnerability: Susceptibility to damage (e.g. unreinforced masonry buildings)
// Capacity: Digital early warning, trained search & rescue, resilient hospital infrastructure`,
        example: "National Strategy for Disaster Risk Management in Nepal (NSDRM) aligns national disaster legislation with the Sendai Framework priorities.",
        commonExamQuestions: [
          "Define Disaster Governance. Differentiate between Disaster Management and Disaster Governance.",
          "Explain the Sendai Framework for Disaster Risk Reduction (2015-2030) and discuss its four priority action areas.",
          "Discuss the relationship between the Digital Divide and Disaster Vulnerability in the context of developing nations like Nepal."
        ]
      },
      {
        id: "dg-four-phases-drr-portal",
        name: "Phases of Disaster Management & Nepal DRR / NEOC Portals",
        importance: "Very High",
        keyPoints: [
          "Four Phases of Disaster Management: Mitigation (reducing hazard severity), Preparedness (contingency planning, drills), Response (saving lives during/after event), and Recovery (restoring infrastructure and 'Build Back Better').",
          "National Emergency Operation Center (NEOC) under the Ministry of Home Affairs (MoHA) coordinates national response through Provincial (PEOC) and District (DEOC) operation centers.",
          "DRR Portal Nepal (drrportal.gov.np) provides real-time geospatial incident reporting, fatality tracking, infrastructure damage statistics, and resource mobilization maps.",
          "Early Warning Systems (EWS): Automated hydrological river gauges, rainfall telemetry, Glacial Lake Outburst Flood (GLOF) acoustic sensors, and mass SMS push notifications.",
          "Search and Rescue (SAR) inventory systems track food stocks, medical relief supplies, excavators, and personnel deployments."
        ],
        theory: "Effective disaster governance operates through cyclical phases. Mitigation structural measures (seismic building codes, flood embankments) and non-structural measures (land-use zoning, public education) reduce base risk. Preparedness establishes evacuation routes, emergency shelters, and food prepositioning. When an emergency strikes, the National Emergency Operation Center (NEOC) activates incident command systems, dispatching Nepal Army, Armed Police Force, and Nepal Police alongside Nepal Red Cross Society. Real-time data platforms aggregate incident alerts from field officers and satellite remote sensing to allocate search-and-rescue teams efficiently.",
        code: `// Disaster Management Cycle:
// [Pre-Disaster]  Mitigation -> Preparedness -> [EVENT]
// [Post-Disaster] Response -> Recovery (Reconstruction & Rehabilitation)
// Cycle loops back into Mitigation incorporating lessons learned ("Build Back Better").`,
        example: "Department of Hydrology and Meteorology (DHM) flood early warning: When Koshi or Narayani river sensors cross danger levels, automated bulk SMS alerts trigger community evacuations.",
        commonExamQuestions: [
          "Explain the four phases of Disaster Management: Mitigation, Preparedness, Response, and Recovery with operational activities in each phase.",
          "Describe the role and functioning of the National Emergency Operation Center (NEOC) and District Emergency Operation Centers (DEOC) in Nepal.",
          "Discuss how the DRR Portal Nepal and Early Warning Systems (EWS) utilize ICT to minimize casualties during seasonal flooding."
        ]
      }
    ],
    theoryTopics: [
      "Explain Incident Command Systems (ICS): Unity of command, management by objectives, unified command, and span of control.",
      "Discuss Critical Infrastructure Planning and cyber threats to disaster recovery facilities during national crises.",
      "Describe Knowledge Management in digital governance: creating and maintaining disaster repositories to inform post-disaster reconstruction.",
      "Explain Hazard Mapping, Vulnerability Mapping, and evacuation simulation using GIS technologies."
    ]
  },

  "Artificial Intelligence": {
    subjectName: "Artificial Intelligence",
    code: "BIT701",
    creditHours: 3,
    topics: [
      {
        id: "ai-astar",
        name: "A* Informed Heuristic Graph Search & Admissibility",
        importance: "Very High",
        keyPoints: [
          "Evaluation function: f(n) = g(n) + h(n), where g(n) is the exact cost from start to node n, and h(n) is the estimated heuristic cost from n to goal.",
          "Admissibility Condition: h(n) <= h*(n) (the heuristic never overestimates the true minimal cost to the goal).",
          "Consistency / Monotonicity: h(n) <= c(n, a, n') + h(n') ensures that f(n) never decreases along any search path.",
          "A* is guaranteed to find an optimal solution if the heuristic h(n) is admissible on trees and consistent on graphs.",
          "When h(n) = 0, A* degrades into Dijkstra's Algorithm; when g(n) = 0, it behaves as Greedy Best-First Search."
        ],
        theory: "Informed search strategies exploit domain-specific heuristics to prune unpromising branches of a state space. Uninformed searches (BFS, DFS) explore blind paths uniformly. A* combines the cost-so-far guarantee of Dijkstra's algorithm with the goal-directed guidance of greedy heuristics. By maintaining an Open list (priority queue keyed on min f(n)) and a Closed list of expanded nodes, A* expands the minimum estimated cost path. If h(n) is admissible, the first time the goal node is popped from the Open queue, its path is guaranteed to be optimal.",
        code: `# A* Node Evaluation logic:
import heapq

def a_star_search(start, goal, neighbors_fn, h_fn):
    open_set = []
    heapq.heappush(open_set, (h_fn(start), 0, start, [start]))
    g_costs = {start: 0}

    while open_set:
        f, g, current, path = heapq.heappop(open_set)
        if current == goal:
            return path, g
        for neighbor, cost in neighbors_fn(current):
            new_g = g + cost
            if neighbor not in g_costs or new_g < g_costs[neighbor]:
                g_costs[neighbor] = new_g
                new_f = new_g + h_fn(neighbor)
                heapq.heappush(open_set, (new_f, new_g, neighbor, path + [neighbor]))
    return None, float('inf')`,
        example: "8-Puzzle problem: h1 = count of misplaced tiles; h2 = sum of Manhattan distances of tiles from goal positions. h2 dominates h1 and is both admissible and consistent.",
        commonExamQuestions: [
          "Explain the A* search algorithm. Prove that A* is optimal if the heuristic function h(n) is admissible.",
          "Trace A* search on a given state space graph with start state, goal state, edge costs, and heuristic values.",
          "Compare Breadth-First Search (BFS), Depth-First Search (DFS), Greedy Best-First Search, and A* in terms of completeness, optimality, time, and space complexity."
        ]
      },
      {
        id: "ai-adversarial-minimax",
        name: "Adversarial Search: Minimax Algorithm & Alpha-Beta Pruning",
        importance: "Very High",
        keyPoints: [
          "Minimax algorithm models optimal decision-making in two-player zero-sum, perfect-information games (Chess, Tic-Tac-Toe).",
          "MAX player aims to maximize the utility payoff; MIN player aims to minimize MAX's payoff.",
          "Minimax value is computed recursively: MAX chooses max(children); MIN chooses min(children).",
          "Alpha-Beta Pruning returns the identical minimax decision while pruning branches that cannot influence the final outcome.",
          "Alpha (alpha) is the best value MAX can guarantee so far (starts at -inf); Beta (beta) is the best value MIN can guarantee so far (starts at +inf). Pruning condition: alpha >= beta."
        ],
        theory: "Game-playing AI operates under adversarial constraints: our agent cannot simply plan a path to a goal because the opponent actively counteracts our strategy. Minimax computes the backed-up minimax value of game tree states up to a terminal depth. The computational complexity is O(b^d), making exhaustive search impossible for games like Chess (b ~ 35, d ~ 80). Alpha-Beta pruning maintains search bounds [alpha, beta] down the recursion tree. If at any node a sub-branch offers a worse outcome than a previously explored alternative, that branch is pruned immediately, reducing time complexity in the best-case move ordering to O(b^(d/2)), effectively doubling search depth.",
        code: `def alphabeta(node, depth, alpha, beta, is_max_player):
    if depth == 0 or is_terminal(node):
        return evaluate(node)
    if is_max_player:
        max_eval = float('-inf')
        for child in get_children(node):
            val = alphabeta(child, depth - 1, alpha, beta, False)
            max_eval = max(max_eval, val)
            alpha = max(alpha, val)
            if beta <= alpha:
                break # Beta cutoff / prune
        return max_eval
    else:
        min_eval = float('inf')
        for child in get_children(node):
            val = alphabeta(child, depth - 1, alpha, beta, True)
            min_eval = min(min_eval, val)
            beta = min(beta, val)
            if beta <= alpha:
                break # Alpha cutoff / prune
        return min_eval`,
        example: "At depth 3, if MIN discovers a child branch with score 3, and MAX already has an alternative guaranteeing score 5 (alpha=5), MIN's sub-tree is pruned because MAX will never permit the game to reach it.",
        commonExamQuestions: [
          "Explain the Minimax algorithm with an illustrative game tree. Discuss its time and space complexity.",
          "What is Alpha-Beta pruning? Trace alpha-beta pruning on a given game tree showing which branches are pruned and explaining why.",
          "Explain the Horizon Effect and how evaluation functions approximate utility in deep game search trees."
        ]
      },
      {
        id: "ai-fopl-resolution",
        name: "First-Order Predicate Logic (FOPL), Unification & Resolution Refutation",
        importance: "Very High",
        keyPoints: [
          "First-Order Predicate Logic (FOPL) represents facts, relations, and quantifiers (Universal: forall, Existential: exists) over objects and functions.",
          "Conversion to Conjunctive Normal Form (CNF) requires 8 steps: eliminate implications, move negations inward, standardize variables, Skolemize existential quantifiers, drop universal quantifiers, distribute OR over AND, flatten clauses.",
          "Unification algorithm computes the Most General Unifier (MGU) substitution theta that makes two expressions syntactically identical.",
          "Resolution is an inference rule: (A or B) and (~B or C) yields the resolvent (A or C).",
          "Resolution Refutation proves a statement S by negating it (~S), adding it to the knowledge base in CNF, and deriving a contradiction (the empty clause Box)."
        ],
        theory: "Propositional logic cannot express assertions about generalized objects or quantify relationships ('All humans are mortal'). FOPL introduces predicates and variables. To automate theorem proving, First-Order sentences are converted to CNF clauses. Skolemization replaces existential quantifiers with Skolem constants or functions dependent on universally quantified variables. Resolution refutation is sound and refutation-complete: if a theorem S logically follows from the knowledge base KB, resolving negated ~S with KB clauses will systematically produce an empty clause (contradiction) via syntactic unification.",
        code: `// Resolution Refutation Example:
// Axiom 1: All humans are mortal:      forall x: Human(x) -> Mortal(x)  => ~Human(x) v Mortal(x)
// Axiom 2: Socrates is human:          Human(Socrates)
// Goal: Prove Mortal(Socrates)
// Step 1: Negate Goal:                 ~Mortal(Socrates)
// Step 2: Unify Axiom 1 with Negated Goal: {x / Socrates}
// Resolving (~Human(Socrates) v Mortal(Socrates)) with ~Mortal(Socrates) yields ~Human(Socrates)
// Step 3: Resolve ~Human(Socrates) with Axiom 2 Human(Socrates) yields [] (Contradiction).
// Proved: Socrates is mortal.`,
        example: "Unification: UNIFY(Knows(John, x), Knows(y, Bill)) yields MGU theta = {y/John, x/Bill} => Knows(John, Bill).",
        commonExamQuestions: [
          "Convert the given set of English statements into First-Order Predicate Logic (FOPL) and then into Conjunctive Normal Form (CNF) clauses.",
          "Explain the Resolution Refutation proof procedure. Prove a given goal using resolution over clauses with unification.",
          "Explain the Unification algorithm. Find the Most General Unifier (MGU) for given pairs of logic expressions."
        ]
      }
    ],
    theoryTopics: [
      "Describe Constraint Satisfaction Problems (CSP): Forward checking, arc consistency (AC-3 algorithm), and backtracking search with MRV heuristic.",
      "Explain expert systems: Architecture, Inference Engine (Forward Chaining vs Backward Chaining), Knowledge Base, and Explanation facilities.",
      "Discuss probabilistic reasoning under uncertainty: Bayes' Rule, Conditional Independence, and Bayesian Belief Networks.",
      "Explain the structure of an Artificial Neural Network, activation functions, and gradient descent optimization."
    ]
  }
};
