Q: What does KDD (Knowledge Discovery in Databases) refer to?
A) A single algorithm for classification
B) The overall multi-step process of discovering useful knowledge/patterns from data, of which data mining is one step
C) A database backup procedure
D) A hardware architecture for storage
ANSWER: B
EXPLAIN: KDD is the broader end-to-end process (selection, preprocessing, transformation, data mining, interpretation/evaluation) of extracting valid, useful knowledge from data; data mining is specifically the pattern-extraction step within it.
DIFFICULTY: easy
MARKS: 12

Q: What do Association Rules in data mining typically discover?
A) Clusters of similar records only
B) Interesting relationships/correlations between items that frequently co-occur in transactions (e.g. "if A then B")
C) The exact schema of a database
D) Only numerical regression trends
ANSWER: B
EXPLAIN: Association rule mining (e.g. via the Apriori algorithm) finds frequent itemsets and derives "if-then" rules describing relationships between items that commonly occur together, such as market basket analysis.
DIFFICULTY: medium
MARKS: 12

Q: What is the core idea behind the Apriori algorithm's efficiency in mining frequent itemsets?
A) It scans the entire database only once regardless of itemset size
B) It uses the "apriori property" — any subset of a frequent itemset must also be frequent — to prune candidate itemsets early
C) It requires no minimum support threshold
D) It only works with numeric data
ANSWER: B
EXPLAIN: The Apriori algorithm exploits the property that all subsets of a frequent itemset must themselves be frequent, allowing it to prune non-frequent candidates early and drastically reduce the search space.
DIFFICULTY: hard
MARKS: 12

Q: What is "clustering" in the context of data mining?
A) Sorting records alphabetically
B) Grouping a set of objects such that objects in the same group (cluster) are more similar to each other than to those in other groups
C) Encrypting data for storage
D) Removing duplicate database entries
ANSWER: B
EXPLAIN: Clustering is an unsupervised learning technique that partitions data into groups (clusters) so that items within a cluster are more similar to each other than to items in other clusters, based on some similarity measure.
DIFFICULTY: easy
MARKS: 8

Q: In OLAP (Online Analytical Processing), what does a "multidimensional data model" primarily represent?
A) A flat single-table structure only
B) Data organized as facts and dimensions (e.g. a data cube), allowing analysis across multiple perspectives like time, product, and region
C) A model that only supports two dimensions
D) A purely transactional model with no aggregation
ANSWER: B
EXPLAIN: OLAP's multidimensional model organizes data into a "data cube" of facts (measures) and dimensions (like time, geography, product), enabling flexible slicing, dicing, and aggregation across multiple analytical perspectives.
DIFFICULTY: medium
MARKS: 8

Q: What is the primary purpose of a data warehouse's physical design, particularly partitioning?
A) To make queries slower for security reasons
B) To divide large tables into smaller, more manageable pieces to improve query performance and manageability
C) To eliminate the need for indexes
D) To store only the most recent day's data
ANSWER: B
EXPLAIN: Partitioning splits large fact/dimension tables into smaller physical segments (by range, hash, etc.), which improves query performance, simplifies maintenance, and supports more efficient data loading and archiving.
DIFFICULTY: medium
MARKS: 8

Q: Why is data extraction and transportation a critical stage in building a data warehouse?
A) It is optional and rarely performed in practice
B) It involves pulling data from heterogeneous source systems, cleaning/transforming it, and loading it into the warehouse in a consistent format (ETL)
C) It only applies to real-time transactional systems
D) It replaces the need for a data warehouse schema
ANSWER: B
EXPLAIN: Data extraction and transportation (part of the ETL process) pulls data from diverse operational source systems, cleans and transforms it into a consistent format, and loads it into the warehouse for unified analysis.
DIFFICULTY: medium
MARKS: 7
