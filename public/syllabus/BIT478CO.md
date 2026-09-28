# Big Data (Track B) (BIT478CO)
**Program**: Purbanchal University B.I.T. | **Semester**: 8 | **Credits**: 3

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

Big data paradigms in business intelligence — MapReduce workflow anatomy, NoSQL databases (HBase, Cassandra, MongoDB), HDFS storage, and Hadoop HiveQL tools.

---

## 3. Detailed Syllabus Chapters & Teaching Units

### Unit 1: Introduction to Big Data [5 Hours]
- Overview of Big Data and comparison with traditional database architectures
- Background of Data Analytics and emergence of distributed systems
- Big Data usage in distributed systems and cloud platforms
- Development history and milestones of Big Data technologies
- Current trends in Big Data Analytics
- Benefits and real-world applications of Big Data (telecom, healthcare, e-commerce, banking)

### Unit 2: MapReduce Applications [8 Hours]
- MapReduce fundamentals and programming model
- MapReduce workflows, mappers, reducers, partitioners, and combiners
- Anatomy of a MapReduce job execution run
- Fault tolerance, node failures, and speculative execution
- Real-world problems solved via MapReduce
- Scalability goals, optimization techniques, and data locality exploitation
- Parallel efficiency and performance bottlenecks of MapReduce

### Unit 3: Data Management & Taxonomy of NoSQL Implementations [12 Hours]
- Structured, semi-structured, and unstructured data management
- Taxonomy of NoSQL implementations: Key-Value, Document, Column-Family, and Graph stores
- Schemaless database designs and CAP theorem implications (Consistency, Availability, Partition tolerance)
- Basic architecture, data models, and query mechanisms of Apache HBase, Apache Cassandra, and MongoDB
- Partitioning, sharding, replication, and composing analytical calculations over NoSQL datastores

### Unit 4: Fundamentals of HADOOP [10 Hours]
- Analyzing data at scale with Apache Hadoop
- Hadoop Distributed File System (HDFS): NameNode, DataNode, Secondary NameNode, blocks, and replication topology
- HDFS command line interface and file operations
- Hadoop Streaming and Hadoop Pipes for multi-language execution
- Hadoop I/O: Data integrity, compression codecs, serialization formats (Avro, Parquet, SequenceFiles)

### Unit 5: Hadoop Tools: HBase, Cassandra, Pig, and Hive [10 Hours]
- Apache HBase architecture: RegionServers, ZooKeeper coordination, and column-family storage
- Apache Cassandra peer-to-peer gossip protocol and CQL operations
- Apache Pig: Architecture, Pig Latin execution environment, data types, and relational operations
- Apache Hive: Hive architecture, HiveQL queries, metastore configurations, managed vs external tables, and partitioning

---

## 4. Laboratory & Practical Guidelines

1. Setting up a single-node and pseudo-distributed Apache Hadoop cluster in Linux
2. Performing HDFS file system operations (uploading, retrieving, block status verification)
3. Writing, compiling, and executing a WordCount MapReduce job in Java / Python Streaming
4. Installing and executing CRUD operations in MongoDB and Apache Cassandra
5. Writing and executing Pig Latin scripts for data filtering, grouping, and joining large datasets
6. Creating Hive databases, schemas, and executing HiveQL queries against external datasets
7. Executing analytical queries using Apache HBase and integrating with Hadoop

---

## 5. Reference Textbooks & Materials

1. White, Tom, Hadoop: The Definitive Guide (3rd/4th ed.), O'Reilly Media.
2. Minelli, Michael, Michelle Chambers, and Ambiga Dhiraj, Big Data, Big Analytics: Emerging Business Intelligence and Analytic Trends for Today's Businesses, Wiley.
3. Sadalage, Pramod J. and Martin Fowler, NoSQL Distilled: A Brief Guide to the Emerging World of Polyglot Persistence, Addison-Wesley Professional.
4. Sammer, Eric, Hadoop Operations, O'Reilly Media.
5. George, Lars, HBase: The Definitive Guide, O'Reilly Media.
