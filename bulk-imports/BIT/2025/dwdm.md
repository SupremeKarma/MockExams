Q: What is "association rule mining" in data mining?
A) A technique for encrypting sensitive data
B) A technique for discovering interesting relationships (rules) between items in large transactional datasets, such as "customers who buy A also tend to buy B"
C) A method for compressing image files
D) A way to physically back up a database
ANSWER: B
EXPLAIN: Association rule mining discovers frequent patterns and correlations among items in large datasets — the classic example being market basket analysis, where rules like "if a customer buys bread, they are likely to also buy butter" are extracted based on support and confidence thresholds.
DIFFICULTY: easy
MARKS: 4

Q: In decision tree induction (e.g. ID3/C4.5), what determines which attribute becomes the "root node" of the tree?
A) The attribute is chosen alphabetically
B) The attribute that provides the highest information gain (or lowest entropy/Gini impurity) for splitting the training data is chosen as the root
C) The first column listed in the dataset is always the root
D) The root node is chosen randomly
ANSWER: B
EXPLAIN: Decision tree algorithms like ID3 select the attribute that best splits the data — typically measured by information gain (reduction in entropy) or Gini impurity — to be the root node, since it provides the most useful split for classifying the training instances.
DIFFICULTY: hard
MARKS: 12

Q: What is the "Knowledge Discovery in Databases" (KDD) process?
A) A single-step process of running a query on a database
B) A multi-step process (including data cleaning, integration, selection, transformation, mining, and interpretation) for extracting useful, previously unknown knowledge from data
C) A synonym for data backup
D) A process only used for image processing
ANSWER: B
EXPLAIN: KDD is the overall multi-step process of discovering useful knowledge from data, encompassing data cleaning, integration, selection, transformation, the data mining step itself, and pattern evaluation/interpretation — data mining is just one step within the broader KDD process.
DIFFICULTY: medium
MARKS: 8

Q: What is the key difference between OLAP and OLTP systems?
A) OLAP (Online Analytical Processing) supports complex analytical queries over historical data for decision-making; OLTP (Online Transaction Processing) handles fast, routine day-to-day transactional operations
B) They are identical systems with different names
C) OLTP is used only for reporting, never for transactions
D) OLAP is used only in small databases
ANSWER: A
EXPLAIN: OLTP systems are optimized for fast, frequent, simple transactions (e.g. processing a sale), while OLAP systems are optimized for complex analytical queries over large volumes of historical, often aggregated data, supporting business intelligence and decision-making.
DIFFICULTY: medium
MARKS: 8

Q: What is "data partitioning" in a data warehouse, and why is it used?
A) Dividing a large table or database into smaller, more manageable pieces to improve query performance and manageability
B) Encrypting data for security purposes
C) A method of backing up data offsite
D) Combining multiple small tables into one large table
ANSWER: A
EXPLAIN: Data partitioning divides large data warehouse tables into smaller, more manageable segments (e.g. by date range or region), which improves query performance, simplifies maintenance, and allows more efficient data loading and archiving.
DIFFICULTY: medium
MARKS: 8

Q: What is "metadata" in the context of a data warehouse?
A) The actual transactional business data itself
B) Data that describes other data — such as its source, structure, meaning, and relationships — helping users and systems understand and manage the warehouse's contents
C) A type of data mining algorithm
D) A synonym for "big data"
ANSWER: B
EXPLAIN: Metadata is "data about data" — it describes the structure, source, meaning, transformations, and relationships of the actual data stored in a warehouse, making the warehouse's contents understandable and manageable for both users and systems.
DIFFICULTY: easy
MARKS: 8

Q: What is Bayes' Theorem primarily used for in data mining classification (e.g. Naive Bayes classifiers)?
A) To calculate the exact runtime of an algorithm
B) To compute the probability of a class label given observed feature evidence, by combining prior probability with the likelihood of the evidence
C) To physically store data more efficiently
D) To generate random test data
ANSWER: B
EXPLAIN: Bayes' Theorem computes the posterior probability of a hypothesis (e.g., a class label) given observed evidence, by combining the prior probability of the hypothesis with the likelihood of observing that evidence — forming the basis of Naive Bayes classifiers used widely in data mining.
DIFFICULTY: medium
MARKS: 8
