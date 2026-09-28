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
- **Topic 1.1**: Overview of Big Data and comparison with traditional database architectures
- **Topic 1.2**: Background of Data Analytics and emergence of distributed systems
- **Topic 1.3**: Big Data usage in distributed systems and cloud platforms
- **Topic 1.4**: Development history and milestones of Big Data technologies
- **Topic 1.5**: Current trends in Big Data Analytics
- **Topic 1.6**: Benefits and real-world applications of Big Data (telecom, healthcare, e-commerce, banking)

### Unit 2: MapReduce Applications [8 Hours]
- **Topic 2.1**: MapReduce fundamentals and programming model
- **Topic 2.2**: MapReduce workflows, mappers, reducers, partitioners, and combiners
- **Topic 2.3**: Anatomy of a MapReduce job execution run
- **Topic 2.4**: Fault tolerance, node failures, and speculative execution
- **Topic 2.5**: Real-world problems solved via MapReduce
- **Topic 2.6**: Scalability goals, optimization techniques, and data locality exploitation
- **Topic 2.7**: Parallel efficiency and performance bottlenecks of MapReduce

### Unit 3: Data Management & Taxonomy of NoSQL Implementations [12 Hours]
- **Topic 3.1**: Structured, semi-structured, and unstructured data management
- **Topic 3.2**: Taxonomy of NoSQL implementations: Key-Value, Document, Column-Family, and Graph stores
- **Topic 3.3**: Schemaless database designs and CAP theorem implications (Consistency, Availability, Partition tolerance)
- **Topic 3.4**: Basic architecture, data models, and query mechanisms of Apache HBase, Apache Cassandra, and MongoDB
- **Topic 3.5**: Partitioning, sharding, replication, and composing analytical calculations over NoSQL datastores

### Unit 4: Fundamentals of HADOOP [10 Hours]
- **Topic 4.1**: Analyzing data at scale with Apache Hadoop
- **Topic 4.2**: Hadoop Distributed File System (HDFS): NameNode, DataNode, Secondary NameNode, blocks, and replication topology
- **Topic 4.3**: HDFS command line interface and file operations
- **Topic 4.4**: Hadoop Streaming and Hadoop Pipes for multi-language execution
- **Topic 4.5**: Hadoop I/O: Data integrity, compression codecs, serialization formats (Avro, Parquet, SequenceFiles)

### Unit 5: Hadoop Tools: HBase, Cassandra, Pig, and Hive [10 Hours]
- **Topic 5.1**: Apache HBase architecture: RegionServers, ZooKeeper coordination, and column-family storage
- **Topic 5.2**: Apache Cassandra peer-to-peer gossip protocol and CQL operations
- **Topic 5.3**: Apache Pig: Architecture, Pig Latin execution environment, data types, and relational operations
- **Topic 5.4**: Apache Hive: Hive architecture, HiveQL queries, metastore configurations, managed vs external tables, and partitioning

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
