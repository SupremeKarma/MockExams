# Purbanchal University — Faculty of Science & Technology
## Bachelor in Information Technology (BIT)
### Semester 7 Official Syllabus Curriculum

**Total Semester Credits**: 15 | **Total Listed Courses**: 11

---

## Semester Course Structure & Examination Scheme (ESE)

| Course Code | Course Title | Type | Credits | Lecture (Hrs) | Tutorial (Hrs) | Practical (Hrs) | Total Hrs/Wk | Internal Marks | Final ESE Marks | Total Marks |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **BIT401CO** | Network Programming | Core | 3 | 3 | 1 | 2 | 6 | 70 | 80 | **150** |
| **BIT402CO** | Digital Governance | Core | 3 | 3 | 1 | 0 | 4 | 20 | 80 | **100** |
| **BIT421CO** | Machine Learning (Track A) | Elective | 3 | 3 | 1 | 2 | 6 | 70 | 80 | **150** |
| **BIT422CO** | Business Intelligence and Data Science (Track A) | Elective | 3 | 3 | 1 | 2 | 6 | 70 | 80 | **150** |
| **BIT423CO** | Deep Learning (Track A) | Elective | 3 | 3 | 1 | 2 | 6 | 70 | 80 | **150** |
| **BIT428CO** | Digital Commerce (Track B) | Elective | 3 | 3 | 1 | 0 | 4 | 20 | 80 | **100** |
| **BIT429CO** | Multimedia and Application (Track B) | Elective | 3 | 3 | 1 | 2 | 6 | 70 | 80 | **150** |
| **BIT435CO** | GIS (Track C) | Elective | 3 | 3 | 1 | 2 | 6 | 70 | 80 | **150** |
| **BIT436CO** | Remote Sensing (Track C) | Elective | 3 | 3 | 1 | 2 | 6 | 70 | 80 | **150** |
| **BIT437CO** | Data Center and Disaster Recovery Centers (Track C) | Elective | 3 | 3 | 1 | 2 | 6 | 70 | 80 | **150** |
| **BIT403CO** | Internship | Project / Practical | 3 | 0 | 0 | 0 | 45 | 40 | 60 | **100** |

---

## Detailed Course Syllabi

# Network Programming (BIT401CO)
**Program**: Purbanchal University BIT | **Semester**: 7 | **Credits**: 3

---

## 1. Teaching Schedule & Examination Scheme (ESE)

| Component | Lecture (L) | Tutorial (T) | Practical (P) | Total Hours/Week | Internal Assessment | End Semester Exam (Final) | Total Marks |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Hours / Marks** | 3 Hrs | 1 Hrs | 2 Hrs | **6 Hrs** | Theory: 20, Lab: 50 | Theory: 80, Lab: 0 | **150** |

### Evaluation Breakdown:
- **Continuous Internal Assessment**: 70 Marks (20 Theory + 50 Practical/Lab)
- **End Semester Final Examination (ESE)**: 80 Marks (80 Theory + 0 Practical/Defense)
- **Total Marks for Course**: **150 Marks**

---

## 2. Course Description & Objectives

Client-server socket programming — TCP/UDP sockets, I/O multiplexing, broadcast/multicast, and raw sockets in C/Unix.

---

## 3. Detailed Syllabus Chapters & Teaching Units

### Unit 1: Introduction to Network Programming [5 Hours]
- **Topic 1.1**: Introduction to computer network: client/server model
- **Topic 1.2**: Protocol Suite (ISO/OSI, TCP/IP)
- **Topic 1.3**: Unix Standards (POSIX, OpenGroup, IETF)
- **Topic 1.4**: Network Utilities (telnet, route, ipconfig, ifconfig, ping, netstat, and ftp)
- **Topic 1.5**: Introduction to programming: wrapper functions, header files, libraries and ports numbers, IP address
- **Topic 1.6**: Iterative server, concurrent server, networked servers

### Unit 2: Elementary Operating System Calls [6 Hours]
- **Topic 2.1**: System call, program, thread, process, Kernel
- **Topic 2.2**: fork(), exec() and its family, waitpid(), wait()
- **Topic 2.3**: pipe(), Fifo(), signals (SIGCHLD, SIGINT, SIGIO)
- **Topic 2.4**: IPC Names, creating and opening IPC channels, IPC permissions

### Unit 3: TCP/UDP Transport Layer Protocols [4 Hours]
- **Topic 3.1**: TCP (Transmission Control Protocol): features, connection establishment and termination, states in communication (LISTEN, TIME_WAIT, ESTABLISHED, BLOCKED)
- **Topic 3.2**: UDP (User Datagram Protocol): features, uses, comparison with TCP
- **Topic 3.3**: TCP and UDP buffer sizes and limitations
- **Topic 3.4**: SCTP overview

### Unit 4: Elementary Socket Calls [5 Hours]
- **Topic 4.1**: Socket address structure: for IPV4, IPV6, UNIX domain socket and generic socket address structure, value-result argument
- **Topic 4.2**: Byte ordering and manipulating function: htonl(), htons(), ntohl(), ntohs(), inet_addr(), inet_aton(), inet_ntoa(), inet_pton()

### Unit 5: Elementary TCP-UDP Socket [6 Hours]
- **Topic 5.1**: Socket(), connect(), bind(), listen(), accept(), read(), write(), close()
- **Topic 5.2**: sendto(), recvfrom()

### Unit 6: I/O Multiplexing [4 Hours]
- **Topic 6.1**: Introduction, I/O models: blocking I/O, non-blocking I/O, I/O multiplexing, signal driven I/O (SIGIO) and asynchronous I/O model
- **Topic 6.2**: Select(), poll(), shutdown()

### Unit 7: Socket Options [2 Hours]
- **Topic 7.1**: Getsockopt() and setsockopt() functions
- **Topic 7.2**: IPV4, IPV6, TCP socket options (SO_REUSEADDR, TCP_NODELAY)

### Unit 8: Name and Address Conversion [2 Hours]
- **Topic 8.1**: Domain Name System, gethostbyname(), gethostbyaddr(), uname(), getservbyname() and getservbyport()
- **Topic 8.2**: gethostname() functions, socket timeouts

### Unit 9: Unix Domain Protocol [3 Hours]
- **Topic 9.1**: Introduction, Unix domain socket address structure
- **Topic 9.2**: socketpair function
- **Topic 9.3**: Unix domain stream client-server, UNIX domain datagram client/server

### Unit 10: Daemon Processes, Inetd Superservers [2 Hours]
- **Topic 10.1**: Introduction, Syslog facility (syslog function)
- **Topic 10.2**: daemon_init function
- **Topic 10.3**: inetd daemon configuration

### Unit 11: Broadcast and Multicast [3 Hours]
- **Topic 11.1**: Introduction, Broadcast and multicast addresses
- **Topic 11.2**: Comparison between broadcast, unicast and multicast socket options
- **Topic 11.3**: Unicast versus Broadcast, multicast versus broadcast on LAN

### Unit 12: IP Layers and Raw Socket [3 Hours]
- **Topic 12.1**: Introduction, raw socket creation
- **Topic 12.2**: Input and output packet processing (ping example implementation)

---

## 4. Laboratory & Practical Guidelines

1. Linux command line utilities and shell programming
2. IPC mechanisms: Pipe(), Fifo(), MessageQueue
3. TCP, UDP and Unix Domain socket client server programs
4. TCP echo server and client program
5. Fork() system call process management
6. Wait() and waitpid() system call handling
7. Uname(), gethostbyaddr(), gethostbyname(), gethostname() system calls
8. Shell programming for network diagnostics

---

## 5. Reference Textbooks & Materials

1. Stevens, W. R., Unix Network Programming, Vol 1: Networking APIs - Sockets and XTI, Prentice Hall.
2. Stevens, W. R., Unix Network Programming, Vol 2: Interprocess Communications, Prentice Hall.
3. Comer, Douglas E., Internetworking with TCP/IP: Principles, Protocols, and Architecture, Vol 3, Prentice Hall.


---

# Digital Governance (BIT402CO)
**Program**: Purbanchal University BIT | **Semester**: 7 | **Credits**: 3

---

## 1. Teaching Schedule & Examination Scheme (ESE)

| Component | Lecture (L) | Tutorial (T) | Practical (P) | Total Hours/Week | Internal Assessment | End Semester Exam (Final) | Total Marks |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Hours / Marks** | 3 Hrs | 1 Hrs | 0 Hrs | **4 Hrs** | Theory: 20, Lab: 0 | Theory: 80, Lab: 0 | **100** |

### Evaluation Breakdown:
- **Continuous Internal Assessment**: 20 Marks (20 Theory + 0 Practical/Lab)
- **End Semester Final Examination (ESE)**: 80 Marks (80 Theory + 0 Practical/Defense)
- **Total Marks for Course**: **100 Marks**

---

## 2. Course Description & Objectives

e-Government implementation and policy, ICT infrastructure, security, digital democracy, and case studies including Nepal's GIDC.

---

## 3. Detailed Syllabus Chapters & Teaching Units

### Unit 1: Introduction to e-Government and e-Governance [3 Hours]
- **Topic 1.1**: 1.1. e-Government and e-Governance concepts and distinctions
- **Topic 1.2**: 1.2. e-Government as information system
- **Topic 1.3**: 1.3. Benefits of e-Government
- **Topic 1.4**: 1.4. e-Government stages of development
- **Topic 1.5**: 1.5. Online service delivery and electronic service delivery

### Unit 2: Public-Private Partnership for e-Government [4 Hours]
- **Topic 2.1**: 2.1. G2C Project models
- **Topic 2.2**: 2.2. G2B Project models
- **Topic 2.3**: 2.3. PPP Forms: JV Model, BOO Model, BOOT model, ASP model
- **Topic 2.4**: 2.4. Issues in PPP for e-Government
- **Topic 2.5**: 2.5. Citizen-centric approach to e-Government

### Unit 3: ICT Infrastructure for e-Government [3 Hours]
- **Topic 3.1**: 3.1. Network infrastructure
- **Topic 3.2**: 3.2. Computing Infrastructure
- **Topic 3.3**: 3.3. Government Data centers
- **Topic 3.4**: 3.4. E-Government enterprise architecture
- **Topic 3.5**: 3.5. Interoperability framework

### Unit 4: e-Government Readiness [4 Hours]
- **Topic 4.1**: 4.1. e-Readiness framework
- **Topic 4.2**: 4.2. Steps to e-Government readiness
- **Topic 4.3**: 4.3. Issues and barriers in e-Government readiness

### Unit 5: Security for e-Government [5 Hours]
- **Topic 5.1**: 5.1. Challenges of e-government security
- **Topic 5.2**: 5.2. An approach to security for e-Government
- **Topic 5.3**: 5.3. Security management model
- **Topic 5.4**: 5.4. e-Government security architecture
- **Topic 5.5**: 5.5. Security standards and compliance

### Unit 6: Implementing e-Government [5 Hours]
- **Topic 6.1**: 6.1. e-Government system life cycle and project assessment
- **Topic 6.2**: 6.2. Analysis of current reality and gap analysis
- **Topic 6.3**: 6.3. Design of new e-Government system
- **Topic 6.4**: 6.4. e-Government risk assessment and mitigation
- **Topic 6.5**: 6.5. e-Government system construction
- **Topic 6.6**: 6.6. Implementation and beyond
- **Topic 6.7**: 6.7. Developing e-Government hybrids

### Unit 7: From Representative to Digital Democracy [3 Hours]
- **Topic 7.1**: 7.1. Using Internet to increase Political Participation
- **Topic 7.2**: 7.2. Online Participation and Political Organization
- **Topic 7.3**: 7.3. Electronic voting and elections
- **Topic 7.4**: 7.4. Protecting democratic institutions

### Unit 8: Citizen-Centric Remote Online Digital Governance [3 Hours]
- **Topic 8.1**: 8.1. Citizen Relationship Management (CRM) and Digital Governance
- **Topic 8.2**: 8.2. Responding to citizens online
- **Topic 8.3**: 8.3. From Electronic communication to Modernizing Government

### Unit 9: Applying Artificial Intelligence to Improve Performance and Results [4 Hours]
- **Topic 9.1**: 9.1. Assessing the Impact of Artificial Intelligence on Public Sector Performance
- **Topic 9.2**: 9.2. Artificial Intelligence, Bias, Facial, and Voice recognition in public service

### Unit 10: Case Studies and Applications of e-Government System [10 Hours]
- **Topic 10.1**: 10.1. Nepal: Cyber Laws, ICT development project, Government Integrated Data Center (GIDC), e-Government master plan, Human resource management software
- **Topic 10.2**: 10.2. India: Community information centers, e-Procurement in the government of Andhra Pradesh, e-Seva / e-Suvida
- **Topic 10.3**: 10.3. Other Countries: E-Government development in South Korea, China, Brazil, Sri Lanka, Singapore, and USA

---

## 5. Reference Textbooks & Materials

1. Heeks, Richard, Implementing & Managing e-Government: An International Text, SAGE Publications.
2. Prabhu, C. S. R., e-Governance: Concepts & Case Studies, Prentice Hall of India.
3. Satyanarayana, J., e-Government: Technology and Management, Prentice Hall of India.
4. Milakovich, Michael E., Digital Governance: Applying Advanced Technologies to Improve Public Services, Routledge Taylor & Francis Group.


---

# Machine Learning (Track A) (BIT421CO)
**Program**: Purbanchal University BIT | **Semester**: 7 | **Credits**: 3

---

## 1. Teaching Schedule & Examination Scheme (ESE)

| Component | Lecture (L) | Tutorial (T) | Practical (P) | Total Hours/Week | Internal Assessment | End Semester Exam (Final) | Total Marks |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Hours / Marks** | 3 Hrs | 1 Hrs | 2 Hrs | **6 Hrs** | Theory: 20, Lab: 50 | Theory: 80, Lab: 0 | **150** |

### Evaluation Breakdown:
- **Continuous Internal Assessment**: 70 Marks (20 Theory + 50 Practical/Lab)
- **End Semester Final Examination (ESE)**: 80 Marks (80 Theory + 0 Practical/Defense)
- **Total Marks for Course**: **150 Marks**

---

## 2. Course Description & Objectives

Theoretical concepts and practical implementations of supervised regression/classification, decision trees, model tuning, text mining, and deep neural networks in Python.

---

## 3. Detailed Syllabus Chapters & Teaching Units

### Unit 1: Introduction to Machine Learning [5 Hours]
- **Topic 1.1**: Components of learning, Learning Models: Geometric, Probabilistic, Logical models
- **Topic 1.2**: Introduction to machine learning frameworks: Supervised, Unsupervised, Reinforcement Learning

### Unit 2: Supervised Learning [12 Hours]
- **Topic 2.1**: Linear regression, Polynomial regression
- **Topic 2.2**: Logistic regression, Support Vector Machines (SVM)
- **Topic 2.3**: k-NN (k-Nearest Neighbors)
- **Topic 2.4**: Decision tree: Representation, ID3, C4.5, Inductive bias

### Unit 3: Unsupervised Learning [4 Hours]
- **Topic 3.1**: Clustering fundamentals and similarity metrics
- **Topic 3.2**: k-means clustering algorithm and variants
- **Topic 3.3**: k-modes algorithm for categorical data

### Unit 4: Model Diagnosis and Tuning [7 Hours]
- **Topic 4.1**: Evaluating a hypothesis: Bias-variance tradeoff
- **Topic 4.2**: Model selection: k-fold Cross-validation
- **Topic 4.3**: Ensemble methods: Random forests and bagging

### Unit 5: Text Mining [6 Hours]
- **Topic 5.1**: Text preprocessing: Tokenization, Stopwords removal, Stemming, Lemmatization
- **Topic 5.2**: Feature representation: Bag of Words, TF-IDF
- **Topic 5.3**: Text exploration and classification

### Unit 6: Deep Learning [11 Hours]
- **Topic 6.1**: Feedforward neural networks, Perceptron and Multilayer Perceptron
- **Topic 6.2**: Cost functions, Gradient descent and Backpropagation training
- **Topic 6.3**: Convolutional Neural Networks (CNNs)
- **Topic 6.4**: Recurrent Neural Networks (RNNs)

---

## 4. Laboratory & Practical Guidelines

1. Data preprocessing, transformation, and exploration using Python (NumPy, Pandas, Matplotlib, Seaborn)
2. Implementation of Linear and Polynomial Regression with Scikit-Learn
3. Binary and multiclass Logistic Regression classification
4. Decision Tree implementation using ID3/C4.5 and Scikit-Learn
5. Support Vector Machine (SVM) classification with kernel tuning
6. k-Nearest Neighbor (k-NN) classification and hyperparameter tuning
7. k-means and hierarchical clustering algorithms implementation
8. Text classification using TF-IDF and Naive Bayes
9. Model evaluation using k-fold cross validation, precision, recall, and ROC-AUC metrics
10. Building a multi-layer feedforward neural network with Backpropagation in Python / PyTorch / TensorFlow

---

## 5. Reference Textbooks & Materials

1. Mitchell, Tom M., Machine Learning, McGraw-Hill Education.
2. Alpaydin, Ethem, Introduction to Machine Learning, MIT Press.
3. Goodfellow, Ian, Yoshua Bengio, and Aaron Courville, Deep Learning, MIT Press.
4. Muller, Andreas C. and Sarah Guido, Introduction to Machine Learning with Python: A Guide for Data Scientists, O'Reilly Media.


---

# Business Intelligence and Data Science (Track A) (BIT422CO)
**Program**: Purbanchal University BIT | **Semester**: 7 | **Credits**: 3

---

## 1. Teaching Schedule & Examination Scheme (ESE)

| Component | Lecture (L) | Tutorial (T) | Practical (P) | Total Hours/Week | Internal Assessment | End Semester Exam (Final) | Total Marks |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Hours / Marks** | 3 Hrs | 1 Hrs | 2 Hrs | **6 Hrs** | Theory: 20, Lab: 50 | Theory: 80, Lab: 0 | **150** |

### Evaluation Breakdown:
- **Continuous Internal Assessment**: 70 Marks (20 Theory + 50 Practical/Lab)
- **End Semester Final Examination (ESE)**: 80 Marks (80 Theory + 0 Practical/Defense)
- **Total Marks for Course**: **150 Marks**

---

## 2. Course Description & Objectives

Foundations of business intelligence, data warehousing, visual analytics with Tableau/Power BI, WEKA data mining, text/web analytics, and big data architectures.

---

## 3. Detailed Syllabus Chapters & Teaching Units

### Unit 1: Overview of Business Intelligence & Decision Support [6 Hours]
- **Topic 1.1**: Decision support systems (DSS) concept and evolution
- **Topic 1.2**: Business intelligence definitions, frameworks, and architecture
- **Topic 1.3**: OLTP vs OLAP transaction vs analytical processing models
- **Topic 1.4**: Business analytics overview: descriptive, predictive, prescriptive

### Unit 2: Data Warehousing and ETL Processes [6 Hours]
- **Topic 2.1**: Data warehousing definitions, characteristics, and architectures
- **Topic 2.2**: Multidimensional data modeling: Star, Snowflake, and Fact Constellation schemas
- **Topic 2.3**: Data extraction, transformation, and loading (ETL) pipeline architecture
- **Topic 2.4**: Real-time data warehousing and operational data stores (ODS)

### Unit 3: Business Reporting & Visual Analytics [6 Hours]
- **Topic 3.1**: Business reporting definitions, metrics, and report types
- **Topic 3.2**: Information visualization and visual analytics principles
- **Topic 3.3**: Performance dashboards, scorecards, and Balanced Scorecard methodology
- **Topic 3.4**: Visual analytics tools: Tableau, Microsoft Power BI, and interactive dashboards

### Unit 4: Data Mining Concepts & Applications [9 Hours]
- **Topic 4.1**: Data mining definitions, process models (CRISP-DM), and taxonomy
- **Topic 4.2**: Association rule mining: Apriori algorithm and FP-Growth
- **Topic 4.3**: Classification and clustering methods in data mining
- **Topic 4.4**: Data mining software and open source toolkits: WEKA, RapidMiner

### Unit 5: Text and Web Analytics [6 Hours]
- **Topic 5.1**: Text analytics and Natural Language Processing for business insights
- **Topic 5.2**: Sentiment analysis and opinion mining architectures
- **Topic 5.3**: Web mining taxonomy: Web content mining, Web structure mining, and Web usage mining
- **Topic 5.4**: Social media analytics and network metrics

### Unit 6: Big Data Analytics & Stream Processing [5 Hours]
- **Topic 6.1**: Big Data definition, V-characteristics (Volume, Velocity, Variety, Veracity, Value)
- **Topic 6.2**: Hadoop ecosystem and MapReduce processing framework
- **Topic 6.3**: NoSQL database architectures for analytical workloads
- **Topic 6.4**: Real-time stream analytics and in-memory computing architectures

### Unit 7: Business Analytics Emerging Trends and Ethics [7 Hours]
- **Topic 7.1**: Location-based analytics and geospatial business intelligence
- **Topic 7.2**: Automated decision making and recommendation systems
- **Topic 7.3**: Data governance, privacy laws (GDPR), and ethical considerations in analytics
- **Topic 7.4**: Cloud-based BI and analytics service models

---

## 4. Laboratory & Practical Guidelines

1. Multidimensional schema design (Star and Snowflake) using SQL in PostgreSQL / MySQL
2. ETL pipeline construction for heterogeneous data sources
3. Building interactive executive dashboards using Tableau / Power BI
4. Association rule mining experiments in WEKA using Apriori algorithm
5. Classification experiments (J48 Decision Trees, Naive Bayes) using WEKA
6. Text preprocessing and sentiment analysis using Python NLP libraries
7. Web scraping and log file analysis for web usage mining

---

## 5. Reference Textbooks & Materials

1. Sharda, Ramesh, Dursun Delen, and Efraim Turban, Business Intelligence, Analytics, and Data Science: A Managerial Perspective, Pearson.
2. Inmon, W. H., Building the Data Warehouse, John Wiley & Sons.
3. Han, Jiawei, Micheline Kamber, and Jian Pei, Data Mining: Concepts and Techniques, Morgan Kaufmann.
4. Kimball, Ralph and Margy Ross, The Data Warehouse Toolkit: The Definitive Guide to Dimensional Modeling, Wiley.


---

# Deep Learning (Track A) (BIT423CO)
**Program**: Purbanchal University BIT | **Semester**: 7 | **Credits**: 3

---

## 1. Teaching Schedule & Examination Scheme (ESE)

| Component | Lecture (L) | Tutorial (T) | Practical (P) | Total Hours/Week | Internal Assessment | End Semester Exam (Final) | Total Marks |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Hours / Marks** | 3 Hrs | 1 Hrs | 2 Hrs | **6 Hrs** | Theory: 20, Lab: 50 | Theory: 80, Lab: 0 | **150** |

### Evaluation Breakdown:
- **Continuous Internal Assessment**: 70 Marks (20 Theory + 50 Practical/Lab)
- **End Semester Final Examination (ESE)**: 80 Marks (80 Theory + 0 Practical/Defense)
- **Total Marks for Course**: **150 Marks**

---

## 2. Course Description & Objectives

Neural network architectures — multilayer perceptrons, deep CNNs, RNNs, LSTMs, generative belief nets, and TensorFlow vision/speech applications.

---

## 3. Detailed Syllabus Chapters & Teaching Units

### Unit 1: Basics of Artificial Neural Networks [4 Hours]
- **Topic 1.1**: Biological neuron inspiration and artificial neuron models
- **Topic 1.2**: Perceptron model and perceptron learning algorithm
- **Topic 1.3**: Linear separability and the XOR problem
- **Topic 1.4**: Activation functions: Sigmoid, Tanh, ReLU, Leaky ReLU, Softmax

### Unit 2: Feedforward Neural Networks and Backpropagation [5 Hours]
- **Topic 2.1**: Multi-layer perceptron (MLP) architecture
- **Topic 2.2**: Forward propagation matrix formulations
- **Topic 2.3**: Loss functions: Mean Squared Error, Cross-Entropy loss
- **Topic 2.4**: Backpropagation algorithm, chain rule derivations, and gradient descent optimization

### Unit 3: Deep Neural Networks and Optimization [8 Hours]
- **Topic 3.1**: Vanishing and exploding gradient problems
- **Topic 3.2**: Optimization algorithms: Momentum, RMSProp, Adam, AdaGrad
- **Topic 3.3**: Regularization techniques: L1/L2 weight decay, Dropout, Early Stopping
- **Topic 3.4**: Batch Normalization, Layer Normalization, and hyperparameter tuning

### Unit 4: Convolutional Neural Networks (CNNs) [8 Hours]
- **Topic 4.1**: Convolution operation, kernels, stride, padding, and feature maps
- **Topic 4.2**: Pooling layers: Max pooling, Average pooling
- **Topic 4.3**: CNN architectures: LeNet-5, AlexNet, VGGNet, ResNet, Inception
- **Topic 4.4**: Transfer learning and fine-tuning pretrained CNNs for image classification

### Unit 5: Recurrent Neural Networks (RNNs) [7 Hours]
- **Topic 5.1**: Sequential data modeling and recurrent neuron architecture
- **Topic 5.2**: Backpropagation Through Time (BPTT)
- **Topic 5.3**: Long Short-Term Memory (LSTM) cell architecture and gates
- **Topic 5.4**: Gated Recurrent Unit (GRU) architecture
- **Topic 5.5**: Bidirectional RNNs and sequence-to-sequence architectures

### Unit 6: Generative Models [7 Hours]
- **Topic 6.1**: Energy-based models and Restricted Boltzmann Machines (RBM)
- **Topic 6.2**: Deep Belief Networks (DBN) training and contrastive divergence
- **Topic 6.3**: Autoencoders and Variational Autoencoders (VAE)
- **Topic 6.4**: Generative Adversarial Networks (GAN) generator and discriminator dynamics

### Unit 7: Applications in Vision, Speech and NLP [6 Hours]
- **Topic 7.1**: Object detection and image segmentation (YOLO, Mask R-CNN concepts)
- **Topic 7.2**: Acoustic modeling and speech recognition overview
- **Topic 7.3**: Word embeddings (Word2Vec, GloVe) and Transformer attention mechanisms in NLP

---

## 4. Laboratory & Practical Guidelines

1. Environment setup with Python, PyTorch / TensorFlow, and CUDA GPU acceleration
2. Building a custom MLP from scratch using NumPy with backpropagation
3. Training deep feedforward networks with PyTorch/Keras on MNIST / CIFAR-10
4. Implementing CNN architectures for image classification and feature visualization
5. Applying Transfer Learning using pretrained ResNet/VGG on custom image datasets
6. Implementing LSTM and GRU networks for sequence classification / time series forecasting
7. Implementing an Autoencoder for image denoising and dimensionality reduction
8. Training a simple Generative Adversarial Network (GAN) on MNIST digits

---

## 5. Reference Textbooks & Materials

1. Goodfellow, Ian, Yoshua Bengio, and Aaron Courville, Deep Learning, MIT Press.
2. Geron, Aurelien, Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow, O'Reilly Media.
3. Chollet, Francois, Deep Learning with Python, Manning Publications.
4. Zhang, Aston, Zachary C. Lipton, Mu Li, and Alexander J. Smola, Dive into Deep Learning, Cambridge University Press.


---

# Digital Commerce (Track B) (BIT428CO)
**Program**: Purbanchal University BIT | **Semester**: 7 | **Credits**: 3

---

## 1. Teaching Schedule & Examination Scheme (ESE)

| Component | Lecture (L) | Tutorial (T) | Practical (P) | Total Hours/Week | Internal Assessment | End Semester Exam (Final) | Total Marks |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Hours / Marks** | 3 Hrs | 1 Hrs | 0 Hrs | **4 Hrs** | Theory: 20, Lab: 0 | Theory: 80, Lab: 0 | **100** |

### Evaluation Breakdown:
- **Continuous Internal Assessment**: 20 Marks (20 Theory + 0 Practical/Lab)
- **End Semester Final Examination (ESE)**: 80 Marks (80 Theory + 0 Practical/Defense)
- **Total Marks for Course**: **100 Marks**

---

## 2. Course Description & Objectives

Electronic commerce architectures, mercantile retailing models, mobile commerce (3G/4G), digital marketing SEO, WordPress CMS, and AI chatbots.

---

## 3. Detailed Syllabus Chapters & Teaching Units

### Unit 1: E-Commerce Foundations [11 Hours]
- **Topic 1.1**: Introduction to Electronic Commerce: definitions, history, and framework
- **Topic 1.2**: E-Commerce business models: B2B, B2C, C2C, C2B, G2C, and m-Commerce
- **Topic 1.3**: Electronic payment systems: digital credit cards, debit cards, smart cards, e-wallets, token-based payment
- **Topic 1.4**: Security protocols for e-commerce: SSL/TLS, SET, digital signatures, certificates, and PKI
- **Topic 1.5**: Legal, regulatory, and taxation issues in global e-commerce

### Unit 2: Electronic Retailing [2 Hours]
- **Topic 2.1**: Consumer mercantile models and the consumer purchasing decision cycle
- **Topic 2.2**: Electronic store models, online catalogs, search engines, and shopping carts

### Unit 3: Introduction to Digital Commerce Trends [3 Hours]
- **Topic 3.1**: Omnichannel retail strategies and social commerce
- **Topic 3.2**: Subscription business models and hyper-personalization
- **Topic 3.3**: Cross-border digital commerce logistics and supply integration

### Unit 4: Fundamentals of Mobile Commerce [8 Hours]
- **Topic 4.1**: M-Commerce concepts, drivers, and architectural frameworks
- **Topic 4.2**: Mobile networks: GSM, GPRS, 3G, 4G, and 5G infrastructure constraints
- **Topic 4.3**: Mobile payment systems, contactless NFC, QR-code payment, and digital wallets
- **Topic 4.4**: Location-based services (LBS) and proximity marketing

### Unit 5: Digital Marketing [8 Hours]
- **Topic 5.1**: Search Engine Optimization (SEO): on-page and off-page optimization
- **Topic 5.2**: Pay-per-click advertising: Google Ads, keyword research, and bidding strategies
- **Topic 5.3**: Social media marketing (SMM) and content marketing strategies
- **Topic 5.4**: Email marketing campaigns, conversion rate optimization (CRO), and analytics

### Unit 6: Web Content Management Systems [7 Hours]
- **Topic 6.1**: Content Management System (CMS) architecture and selection criteria
- **Topic 6.2**: WordPress architecture, theme development, and plugin ecosystem
- **Topic 6.3**: E-commerce CMS implementation using WooCommerce / Shopify
- **Topic 6.4**: Product catalog configuration, payment gateway integration, and shipping calculators

### Unit 7: Application of Artificial Intelligence in Commerce [6 Hours]
- **Topic 7.1**: Conversational AI: customer support chatbots and virtual assistants
- **Topic 7.2**: Personalized product recommendation algorithms (collaborative vs content-based filtering)
- **Topic 7.3**: Dynamic pricing algorithms and predictive inventory management
- **Topic 7.4**: AI-driven fraud detection in online financial transactions

---

## 4. Laboratory & Practical Guidelines

1. Setting up a local web server (LAMP/XAMPP) and installing WordPress CMS
2. Configuring an online storefront using WooCommerce with custom catalog structure
3. Integrating sandbox payment gateways (e.g. PayPal, Stripe, local digital wallets)
4. Conducting on-page SEO audits, keyword research, and meta tag optimization
5. Setting up and analyzing web traffic using Google Analytics / Search Console
6. Building an automated customer support chatbot using modern conversational AI APIs
7. Designing a social media marketing campaign strategy and tracking conversion funnels

---

## 5. Reference Textbooks & Materials

1. Laudon, Kenneth C. and Carol Guercio Traver, E-Commerce: Business, Technology, Society, Pearson.
2. Turban, Efraim, David King, Jae Kyu Lee, Ting-Peng Liang, and Deborrah C. Turban, Electronic Commerce: A Managerial and Social Networks Perspective, Springer.
3. Chaffey, Dave and Fiona Ellis-Chadwick, Digital Marketing: Strategy, Implementation and Practice, Pearson.
4. Sabater, Sabater, WordPress for Beginners: Visual Guide to Building Websites.


---

# Multimedia and Application (Track B) (BIT429CO)
**Program**: Purbanchal University BIT | **Semester**: 7 | **Credits**: 3

---

## 1. Teaching Schedule & Examination Scheme (ESE)

| Component | Lecture (L) | Tutorial (T) | Practical (P) | Total Hours/Week | Internal Assessment | End Semester Exam (Final) | Total Marks |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Hours / Marks** | 3 Hrs | 1 Hrs | 2 Hrs | **6 Hrs** | Theory: 20, Lab: 50 | Theory: 80, Lab: 0 | **150** |

### Evaluation Breakdown:
- **Continuous Internal Assessment**: 70 Marks (20 Theory + 50 Practical/Lab)
- **End Semester Final Examination (ESE)**: 80 Marks (80 Theory + 0 Practical/Defense)
- **Total Marks for Course**: **150 Marks**

---

## 2. Course Description & Objectives

Multimedia data representations — audio/MIDI, image processing, video encoding, compression (JPEG/MPEG), real-time OS scheduling, and network streaming.

---

## 3. Detailed Syllabus Chapters & Teaching Units

### Unit 1: Multimedia Systems [3 Hours]
- **Topic 1.1**: Multimedia aspects and definitions, key elements of multimedia systems
- **Topic 1.2**: Continuous vs discrete media streams, characterization of multimedia systems

### Unit 2: Sound and Audio [4 Hours]
- **Topic 2.1**: Physics of sound, sampling rate, quantization, and signal-to-quantization-noise ratio (SQNR)
- **Topic 2.2**: Audio file formats: WAV, MP3, AAC, FLAC
- **Topic 2.3**: MIDI protocol: messages, devices, synthesizers, and comparison with digital audio
- **Topic 2.4**: Speech processing: speech synthesis and recognition principles

### Unit 3: Images and Graphics [4 Hours]
- **Topic 3.1**: Raster vs vector graphics representations
- **Topic 3.2**: Color models: RGB, CMYK, HSV, YUV, and color palettes
- **Topic 3.3**: Image file formats: BMP, GIF, PNG, TIFF, JPEG
- **Topic 3.4**: Basic image processing: spatial filtering, enhancement, and histogram equalization

### Unit 4: Video and Animation [4 Hours]
- **Topic 4.1**: Television and video signals: Component, Composite, S-Video
- **Topic 4.2**: Analog broadcast standards (NTSC, PAL, SECAM) and digital video standards (HDTV, 4K)
- **Topic 4.3**: Principles of computer animation: keyframing, kinematics, morphing, and rendering

### Unit 5: Data Compression [6 Hours]
- **Topic 5.1**: Lossless vs lossy compression fundamentals
- **Topic 5.2**: Entropy encoding: Run-length encoding (RLE), Huffman coding, Arithmetic coding, LZW
- **Topic 5.3**: Image compression: JPEG standard (DCT, quantization, entropy coding)
- **Topic 5.4**: Video compression: MPEG standards (I, P, B frames, motion estimation) and H.261/H.264

### Unit 6: Optical Storage Media [4 Hours]
- **Topic 6.1**: Optical recording technology and track geometry
- **Topic 6.2**: CD-ROM, CD-R, CD-RW standards and logical formats (ISO 9660)
- **Topic 6.3**: DVD technology, DVD-Video, and Blu-Ray disc physical and logical specifications

### Unit 7: Multimedia Operating Systems [4 Hours]
- **Topic 7.1**: Real-time processing requirements for continuous media
- **Topic 7.2**: Real-time scheduling algorithms: Earliest Deadline First (EDF) and Rate Monotonic (RM)
- **Topic 7.3**: Resource management, buffer management, and memory allocation in multimedia OS

### Unit 8: Multimedia Communication Systems [4 Hours]
- **Topic 8.1**: Quality of Service (QoS) parameters: bandwidth, latency, jitter, packet loss rate
- **Topic 8.2**: Protocols for real-time transport: RTP, RTCP, RTSP, and RSVP
- **Topic 8.3**: Streaming media architectures, adaptive bitrate streaming (HLS, DASH), and CDN distribution

### Unit 9: Documentation, Hypertext and MHEG [4 Hours]
- **Topic 9.1**: Hypertext and hypermedia concepts, nodes and links
- **Topic 9.2**: Document architecture standards: SGML, ODA (Open Document Architecture)
- **Topic 9.3**: MHEG (Multimedia and Hypermedia Information Coding Expert Group) standards

### Unit 10: Synchronization [4 Hours]
- **Topic 10.1**: Notion of synchronization: intra-media vs inter-media synchronization
- **Topic 10.2**: Lip-sync synchronization requirements and skew limits
- **Topic 10.3**: Synchronization reference models and specification methods (interval-based, timeline-based)

### Unit 11: Abstraction of Programming & Toolkits [2 Hours]
- **Topic 11.1**: Higher-level programming abstractions for multimedia objects
- **Topic 11.2**: Media frameworks and toolkits (DirectShow, GStreamer, QuickTime, WebRTC APIs)

### Unit 12: Multimedia Applications [2 Hours]
- **Topic 12.1**: Video on Demand (VoD) system architectures and server scheduling
- **Topic 12.2**: Interactive video conferencing architectures and collaborative virtual environments

---

## 4. Laboratory & Practical Guidelines

1. Audio editing and recording using Audacity (noise removal, equalizing, multi-track mixing)
2. Raster and vector graphics manipulation using Adobe Photoshop / GIMP / Inkscape
3. Digital video editing and compositing using Premiere Pro / DaVinci Resolve
4. Implementation of Huffman coding and Run-Length Encoding in C/C++ or Python
5. Implementation of basic 2D keyframe animation using HTML5 Canvas / CSS / Blender
6. Benchmarking video compression codecs (H.264 vs H.265) on file size and PSNR quality
7. Setting up a real-time media streaming server using RTSP / RTMP with OBS and VLC

---

## 5. Reference Textbooks & Materials

1. Steinmetz, Ralf and Klara Nahrstedt, Multimedia: Computing, Communications & Applications, Pearson Education.
2. Li, Ze-Nian, Mark S. Drew, and Jiangchuan Liu, Fundamentals of Multimedia, Springer.
3. Buford, John F. Koegel, Multimedia Systems, Addison-Wesley.
4. Vaughan, Tay, Multimedia: Making It Work, McGraw-Hill Education.


---

# GIS (Track C) (BIT435CO)
**Program**: Purbanchal University BIT | **Semester**: 7 | **Credits**: 3

---

## 1. Teaching Schedule & Examination Scheme (ESE)

| Component | Lecture (L) | Tutorial (T) | Practical (P) | Total Hours/Week | Internal Assessment | End Semester Exam (Final) | Total Marks |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Hours / Marks** | 3 Hrs | 1 Hrs | 2 Hrs | **6 Hrs** | Theory: 20, Lab: 50 | Theory: 80, Lab: 0 | **150** |

### Evaluation Breakdown:
- **Continuous Internal Assessment**: 70 Marks (20 Theory + 50 Practical/Lab)
- **End Semester Final Examination (ESE)**: 80 Marks (80 Theory + 0 Practical/Defense)
- **Total Marks for Course**: **150 Marks**

---

## 2. Course Description & Objectives

Geographic Information Systems — spatial/attribute data, raster vs vector structures, map projections (UTM), spatial querying, and Nepal GIS applications.

---

## 3. Detailed Syllabus Chapters & Teaching Units

### Unit 1: Basic Concepts & Components of GIS [4 Hours]
- **Topic 1.1**: Definition and components of GIS (Hardware, Software, Data, People, Methods)
- **Topic 1.2**: Functionality of GIS
- **Topic 1.3**: Areas of GIS application
- **Topic 1.4**: Advantages and limitations of GIS

### Unit 2: GIS Data & Database [8 Hours]
- **Topic 2.1**: Spatial and attribute data concepts
- **Topic 2.2**: Spatial data handling
- **Topic 2.3**: Data representations: points, lines, polygons
- **Topic 2.4**: Information organization and data structures: Raster and Vector data structures, Tessellations
- **Topic 2.5**: File organization and formats
- **Topic 2.6**: Geo-database concepts and GIS software packages

### Unit 3: GIS Data Input [6 Hours]
- **Topic 3.1**: Nature and source of spatial data
- **Topic 3.2**: Methods of spatial data capture: Primary and Secondary sources
- **Topic 3.3**: Digitization and scanning methods, techniques and procedures for digitizing, errors of digitization
- **Topic 3.4**: Attribute data capture
- **Topic 3.5**: GPS and Remote Sensing integration for data collection

### Unit 4: GIS Mapping and Map Projections [8 Hours]
- **Topic 4.1**: Defining maps, categories of maps, map contents and map scales
- **Topic 4.2**: Georeferencing principles and coordinate systems
- **Topic 4.3**: Projection systems: types and aspects (cylindrical, conical, azimuthal)
- **Topic 4.4**: Universal Transverse Mercator (UTM) coordinate system

### Unit 5: Data Editing in GIS [4 Hours]
- **Topic 5.1**: Detecting and correcting topological errors
- **Topic 5.2**: Re-projection, coordinate transformation, and map generalization
- **Topic 5.3**: Edge matching and rubber sheeting
- **Topic 5.4**: Conversion from other digital sources and CAD formats

### Unit 6: Spatial Analysis [7 Hours]
- **Topic 6.1**: Types of spatial analysis and measurements in GIS
- **Topic 6.2**: Query by attributes and spatial queries (point-in-polygon, line-in-polygon)
- **Topic 6.3**: Attribute-based operations
- **Topic 6.4**: Neighborhood analysis and buffering
- **Topic 6.5**: Connectivity analysis and network routing
- **Topic 6.6**: Overlay operations (union, intersect, identity) and coverage rebuilding

### Unit 7: Data Sharing and Spatial Data Infrastructure [6 Hours]
- **Topic 7.1**: Concept of Geospatial Infrastructure
- **Topic 7.2**: Components of Spatial Data Infrastructure (SDI): Standards, Metadata, Data Sharing Clearinghouse
- **Topic 7.3**: National Spatial Data Infrastructure (NSDI) frameworks

### Unit 8: GIS in Nepal [2 Hours]
- **Topic 8.1**: Present situation of GIS in Nepal
- **Topic 8.2**: Major GIS activities and national geospatial initiatives
- **Topic 8.3**: Prospects and challenges of GIS implementation in Nepal

---

## 4. Laboratory & Practical Guidelines

1. Introduction to QGIS / ArcGIS interface, tools, and plugins
2. Georeferencing scanned toposheets using ground control points (GCPs)
3. Vectorization and digitization: creating shapefiles for points, lines, and polygons
4. Attribute table creation, editing, joins, and spatial queries
5. Thematic map production: symbology, labeling, layout preparation, scale, and north arrow
6. Vector spatial analysis: Buffering, Clip, Intersect, and Union operations
7. Raster spatial analysis: Digital Elevation Model (DEM) slope, aspect, and hillshade generation
8. Creating a complete GIS project map report for a selected region in Nepal

---

## 5. Reference Textbooks & Materials

1. Burrough, P. A. and R. A. McDonnell, Principles of Geographical Information Systems, Oxford University Press.
2. Star, J. and J. Estes, Geographic Information Systems: An Introduction, Prentice Hall.
3. Chang, Kang-Tsung, Introduction to Geographic Information Systems, Tata McGraw-Hill.
4. Lo, C. P. and Albert K. W. Yeung, Concepts and Techniques of Geographic Information Systems, Prentice Hall of India.
5. Heywood, Ian, Sarah Cornelius, Steve Carver, and Srinivasa Raju, An Introduction to Geographical Information Systems, Pearson Education.
6. Bhatta, Basudeb, Remote Sensing and GIS, Oxford University Press.
7. Lee, J. and D. W. S. Wong, Statistical Analysis with ArcView GIS, John Wiley & Sons.


---

# Remote Sensing (Track C) (BIT436CO)
**Program**: Purbanchal University BIT | **Semester**: 7 | **Credits**: 3

---

## 1. Teaching Schedule & Examination Scheme (ESE)

| Component | Lecture (L) | Tutorial (T) | Practical (P) | Total Hours/Week | Internal Assessment | End Semester Exam (Final) | Total Marks |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Hours / Marks** | 3 Hrs | 1 Hrs | 2 Hrs | **6 Hrs** | Theory: 20, Lab: 50 | Theory: 80, Lab: 0 | **150** |

### Evaluation Breakdown:
- **Continuous Internal Assessment**: 70 Marks (20 Theory + 50 Practical/Lab)
- **End Semester Final Examination (ESE)**: 80 Marks (80 Theory + 0 Practical/Defense)
- **Total Marks for Course**: **150 Marks**

---

## 2. Course Description & Objectives

Electromagnetic radiation spectrum, sensor platforms and satellite orbits, Landsat/Sentinel imagery, digital image processing, and GIS-RS integration.

---

## 3. Detailed Syllabus Chapters & Teaching Units

### Unit 1: Concept and Scope of Remote Sensing [8 Hours]
- **Topic 1.1**: Definitions, process, and characteristics of Remote Sensing systems
- **Topic 1.2**: Types and components of Remote Sensing
- **Topic 1.3**: Advantages and limitations of satellite remote sensing

### Unit 2: Concept of Electromagnetic Radiation (EMR) [8 Hours]
- **Topic 2.1**: Wavelength-frequency-energy relationship of EMR
- **Topic 2.2**: EMR spectrum and its properties across visible, infrared, and microwave bands
- **Topic 2.3**: EMR wavelength regions and their specific applications
- **Topic 2.4**: Atmospheric windows and atmospheric scattering (Rayleigh, Mie, Non-selective)
- **Topic 2.5**: Interactions of EMR with matter, energy interaction in the atmosphere, energy interactions with Earth surface features
- **Topic 2.6**: Spectral signatures of vegetation, soil, and water

### Unit 3: Types and Characteristics of Sensor [10 Hours]
- **Topic 3.1**: Sensor materials and detector arrays
- **Topic 3.2**: Sensor systems: Framing and Scanning systems (Whiskbroom scanner, Push-broom scanner, Side-looking scanner)
- **Topic 3.3**: Imaging and non-imaging sensors; Active and passive sensors
- **Topic 3.4**: Resolutions of sensors: Spectral, Spatial, Radiometric, and Temporal resolution
- **Topic 3.5**: Scale, mapping unit, multi-band concepts, and False Color Composites (FCC)

### Unit 4: Remote Sensor Platforms and Satellite Orbits [8 Hours]
- **Topic 4.1**: Ground, Airborne, and Space-borne platforms
- **Topic 4.2**: Orbital characteristics: Coverage, Passes, Pointing accuracy
- **Topic 4.3**: Geostationary orbits, Sun-synchronous orbits, Shuttle orbits, Semisynchronous orbits (Molniya orbit), and Quasi-zenith satellite orbits

### Unit 5: Space Imaging Satellites [7 Hours]
- **Topic 5.1**: Early history of space imaging systems
- **Topic 5.2**: Multispectral and Hyperspectral sensors; RADAR and LiDAR systems
- **Topic 5.3**: Specifications of popular Earth resource satellites: IRS, LANDSAT, and SPOT series
- **Topic 5.4**: High resolution satellites: IKONOS, Cartosat, QuickBird, OrbView, WorldView
- **Topic 5.5**: Recent Earth observation satellite constellations (Sentinel, PlanetScope)

### Unit 6: Integration of GIS and Remote Sensing [2 Hours]
- **Topic 6.1**: Mechanisms of integrating satellite imagery with GIS layers
- **Topic 6.2**: Data interchange formats and coordinate alignment
- **Topic 6.3**: Updating GIS databases using remote sensing imagery

### Unit 7: Applications of Remote Sensing [2 Hours]
- **Topic 7.1**: Agricultural monitoring and crop yield estimation
- **Topic 7.2**: Forestry and land use / land cover (LULC) change detection
- **Topic 7.3**: Water resources, flood mapping, and glacial lake monitoring
- **Topic 7.4**: Urban planning and disaster impact assessment in Nepal

---

## 4. Laboratory & Practical Guidelines

1. Downloading satellite imagery (Landsat 8/9, Sentinel-2) from USGS EarthExplorer / Copernicus Open Access Hub
2. Displaying satellite bands and creating True Color and False Color Composites (FCC) in QGIS / ERDAS
3. Radiometric and atmospheric correction of raw satellite data
4. Geometric correction and image-to-image registration
5. Calculating vegetation indices: Normalized Difference Vegetation Index (NDVI) and NDWI
6. Supervised image classification using Maximum Likelihood / Random Forest
7. Unsupervised image classification using k-means / ISODATA
8. Accuracy assessment: confusion matrix, overall accuracy, and Kappa coefficient calculation

---

## 5. Reference Textbooks & Materials

1. Joseph, George, Fundamentals of Remote Sensing, Universities Press.
2. Gupta, Ravi P., Remote Sensing Geology, Springer.
3. Bhatta, Basudeb, Remote Sensing and GIS, Oxford University Press.
4. Levin, Noam, Fundamental of Remote Sensing, Research Press.
5. Sabins, Floyd F., Remote Sensing: Principles and Interpretation, W. H. Freeman & Co.
6. Lillesand, Thomas M., Ralph W. Kiefer, and Jonathan W. Chipman, Remote Sensing and Image Interpretation, John Wiley & Sons.


---

# Data Center and Disaster Recovery Centers (Track C) (BIT437CO)
**Program**: Purbanchal University BIT | **Semester**: 7 | **Credits**: 3

---

## 1. Teaching Schedule & Examination Scheme (ESE)

| Component | Lecture (L) | Tutorial (T) | Practical (P) | Total Hours/Week | Internal Assessment | End Semester Exam (Final) | Total Marks |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Hours / Marks** | 3 Hrs | 1 Hrs | 2 Hrs | **6 Hrs** | Theory: 20, Lab: 50 | Theory: 80, Lab: 0 | **150** |

### Evaluation Breakdown:
- **Continuous Internal Assessment**: 70 Marks (20 Theory + 50 Practical/Lab)
- **End Semester Final Examination (ESE)**: 80 Marks (80 Theory + 0 Practical/Defense)
- **Total Marks for Course**: **150 Marks**

---

## 2. Course Description & Objectives

Modern data center design, power redundancy, fire protection, cooling optimization, cloud data centers, and enterprise disaster recovery planning.

---

## 3. Detailed Syllabus Chapters & Teaching Units

### Unit 1: Introduction to Data Centre [5 Hours]
- **Topic 1.1**: Defining a modern enterprise data centre
- **Topic 1.2**: Identifying the main data centre types: Enterprise, Colocation, Managed, and Cloud
- **Topic 1.3**: Business service delivery options and SLAs
- **Topic 1.4**: Emerging delivery models and future computing demands

### Unit 2: The Role and Objectives of a Data Centre [7 Hours]
- **Topic 2.1**: Driving factors and business value for establishing a data centre
- **Topic 2.2**: Data centre standards (ANSI/TIA-942, Uptime Institute Tier Standards I-IV)
- **Topic 2.3**: Data centre availability models and uptime considerations
- **Topic 2.4**: Location selection, civil building, and geophysical hazard considerations
- **Topic 2.5**: Analyzing reliability, MTBF, and MTTR in the data center
- **Topic 2.6**: Data center energy efficiency metrics: PUE (Power Usage Effectiveness) and DCiE
- **Topic 2.7**: Data center system capacity planning

### Unit 3: Design Overview and Infrastructure [10 Hours]
- **Topic 3.1**: Criticality and availability considerations
- **Topic 3.2**: Fire protection methods in the data center: gaseous suppression (FM-200, Novec 1230), pre-action sprinklers
- **Topic 3.3**: Structured cabling strategies (horizontal, backbone, fiber vs copper, cable trays)
- **Topic 3.4**: Thermal management: maintaining humidity, hot/cold aisle containment, CRAC/CRAH units
- **Topic 3.5**: Physical security: biometric access, perimeter security, surveillance cameras
- **Topic 3.6**: Power management: utility feeds, diesel backup generators, UPS topologies (N, N+1, 2N), and PDUs
- **Topic 3.7**: Physical infrastructure: server rack fundamentals (42U), floor loading, row vs room-based cooling
- **Topic 3.8**: The four key constraints (4C's): Power, Cooling, IT Infrastructure, and Space

### Unit 4: Managing the Data Centre [6 Hours]
- **Topic 4.1**: Regulations, best practices, and operational processes (ITIL, ISO 27001)
- **Topic 4.2**: Moves, adds, and changes (MAC) processes and change management
- **Topic 4.3**: Efficient energy management and thermal audit techniques
- **Topic 4.4**: Asset lifecycle and secure decommissioning processes
- **Topic 4.5**: Logical, IT, and network perimeter security integration

### Unit 5: The Data Centre Industry and Market [5 Hours]
- **Topic 5.1**: Global and regional market size and economic drivers
- **Topic 5.2**: Hyperscale data center trends and edge computing
- **Topic 5.3**: Powering the Internet: green energy adoption, carbon neutrality, and renewable power
- **Topic 5.4**: Case studies of modern hyperscale facilities (Google, Microsoft, AWS)

### Unit 6: Cloud Data Center [4 Hours]
- **Topic 6.1**: Cloud data center architecture and software-defined infrastructure (SDDC)
- **Topic 6.2**: Virtualization layers: compute, storage (SAN/NAS), and software-defined networking (SDN)
- **Topic 6.3**: Multi-tenant isolation and cloud workload orchestration

### Unit 7: Disaster Recovery Center Formulation and DR Plans [8 Hours]
- **Topic 7.1**: Disaster Recovery Plan (DRP) formulation steps
- **Topic 7.2**: Business continuity planning (BCP) vs disaster recovery: RTO and RPO metrics
- **Topic 7.3**: Data backup strategies: Full, Incremental, Differential, and continuous replication
- **Topic 7.4**: Cloud-based disaster recovery (DRaaS) architectures
- **Topic 7.5**: Disaster recovery site tiers: Cold site, Warm site, and Hot site architectures

---

## 4. Laboratory & Practical Guidelines

1. Formulation and presentation of a comprehensive Disaster Recovery Center Planning Document for an enterprise (compulsory for 20 internal practical marks)
2. Calculation of PUE (Power Usage Effectiveness) and cooling loads for a simulated 50-rack server room
3. Designing hot/cold aisle containment layout using data center modeling software / CAD
4. Designing redundant power distribution topology (dual UPS feeds, ATS, and standby generator sizing)
5. Configuring automated database backup and remote snapshot replication to a DR site
6. Simulating disaster failover and calculating achieved Recovery Time Objective (RTO) and Recovery Point Objective (RPO)

---

## 5. Reference Textbooks & Materials

1. Lowe, Scott D., James Green, and David Davis, Building a Modern Data Center: Principles and Strategies of Design, ActualTech Media, New York.
2. Arregoces, Mauricio and Maurizio Portolani, Data Center Fundamentals, Cisco Press.
3. Khan, Samee Ullah and Albert Y. Zomaya, Handbook on Data Centers, Springer.
4. Rothstein, Philip Jan, IT Disaster Recovery Planning For Dummies, Wiley Publishing Inc.
5. Snevely, Robert, Enterprise Data Center Design and Methodology, Prentice Hall.


---

# Internship (BIT403CO)
**Program**: Purbanchal University BIT | **Semester**: 7 | **Credits**: 3

---

## 1. Teaching Schedule & Examination Scheme (ESE)

| Component | Lecture (L) | Tutorial (T) | Practical (P) | Total Hours/Week | Internal Assessment | End Semester Exam (Final) | Total Marks |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Hours / Marks** | 0 Hrs | 0 Hrs | 0 Hrs | **45 Hrs** | Theory: 40, Lab: 0 | Theory: 60, Lab: 0 | **100** |

### Evaluation Breakdown:
- **Continuous Internal Assessment**: 40 Marks (40 Theory + 0 Practical/Lab)
- **End Semester Final Examination (ESE)**: 60 Marks (60 Theory + 0 Practical/Defense)
- **Total Marks for Course**: **100 Marks**

---

## 2. Course Description & Objectives

45-hour supervised internship at a partner organization (bank, hospital, software company, telecom, or government IT unit), evaluated via proposal defense, mid-term, and end-term report.

---

## 3. Detailed Syllabus Chapters & Teaching Units

### Unit 1: Proposal Defense & Organization Placement [10 Hours]
- **Topic 1.1**: Partner organization identification (Bank, Hospital, Software Company, Telecom, or Government IT Unit)
- **Topic 1.2**: Problem identification, scope definition, and internship plan preparation (first 2 weeks)
- **Topic 1.3**: Proposal defense presentation (10% weight: 5% topic selection, 5% presentation) evaluated by supervisor and mentor

### Unit 2: Mid-Term Progress Review & System Design [15 Hours]
- **Topic 2.1**: System requirements specification (SRS) and architecture modeling
- **Topic 2.2**: Database design, ER diagrams, and normalized schema
- **Topic 2.3**: Mid-term progress presentation and prototype demo (30% weight: 10% program design, 10% demo, 10% viva) after 2 months

### Unit 3: System Implementation & Quality Testing [10 Hours]
- **Topic 3.1**: Module implementation, database connectivity, and backend API integration
- **Topic 3.2**: System testing: Unit testing, integration testing, and bug fixing
- **Topic 3.3**: Evaluation of professional code quality, security, and documentation

### Unit 4: Final Internship Report & University Viva [10 Hours]
- **Topic 4.1**: Technical report writing according to APA format (Abstract, Intro, System Analysis, System Design, Implementation, Testing, Future Enhancements, References)
- **Topic 4.2**: Preparation of individual project portfolios (max 3 students per group)
- **Topic 4.3**: End-term final defense (60% weight: 15% depth of work, 25% report, 10% presentation, 10% external viva) before Purbanchal University external examiner

---

## 4. Laboratory & Practical Guidelines

1. Duration: 3 Credits (minimum 45 contact lab/industry hours) at approved partner organization (Bank, Hospital, Software Company, Telecom, or Government IT Unit).
2. Internship Plan: Formal submission of objectives, problem statement, and milestone schedule within the first two weeks under assigned advisor.
3. Group Size: Maximum 3 students per team, with individual document and portfolio preparation.
4. Proposal Defense (10% weight): Topic selection with proposal (5%) and presentation (5%) evaluated by Supervisor and Mentor.
5. Mid-Term Review (30% weight, after 2 months): Program design (10%), prototype demo presentation (10%), and oral viva (10%).
6. End-Term Defense (60% weight): Depth of work (15%), formal internship report in APA 7th Edition format (25%), external viva (10%), and final presentation (10%) evaluated with external examiner from Purbanchal University.

---

## 5. Reference Textbooks & Materials

1. American Psychological Association, Publication Manual of the American Psychological Association (7th ed.), 2020.
2. Purbanchal University, Faculty of Science & Technology, Guidelines for Undergraduate Internship and Project Works.


---
