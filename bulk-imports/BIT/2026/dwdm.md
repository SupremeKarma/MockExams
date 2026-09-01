Q: In the Apriori algorithm, what does "support" measure for an itemset?
A) The confidence of a rule
B) The proportion of transactions in the dataset that contain the itemset
C) The number of clusters formed
D) The depth of the decision tree
ANSWER: B
EXPLAIN: Support measures how frequently an itemset appears across all transactions (support = transactions containing the itemset / total transactions), and is used to filter out infrequent itemsets before generating association rules.
DIFFICULTY: medium
MARKS: 4

Q: In association rule mining, what does "confidence" of a rule A → B measure?
A) How rare itemset A is overall
B) The likelihood that a transaction containing A also contains B, i.e. support(A∪B) / support(A)
C) The total number of transactions in the database
D) The number of items in the largest frequent itemset
ANSWER: B
EXPLAIN: Confidence measures the conditional probability that B occurs given A has occurred: confidence(A→B) = support(A∪B) / support(A), indicating how reliable the association rule is.
DIFFICULTY: medium
MARKS: 4

Q: What is the "Apriori property" that makes the Apriori algorithm efficient?
A) Every subset of a frequent itemset must also be frequent
B) Every itemset is automatically frequent regardless of support
C) Larger itemsets are always more frequent than smaller ones
D) Only single items can ever be frequent
ANSWER: A
EXPLAIN: The Apriori property states that any subset of a frequent itemset must itself be frequent (the anti-monotone property), which lets the algorithm prune candidate itemsets early without computing their exact support, greatly improving efficiency.
DIFFICULTY: hard
MARKS: 9

Q: What is the primary goal of a classification algorithm in data mining?
A) To group similar unlabeled records together with no predefined categories
B) To predict a predefined categorical class label for new data based on patterns learned from labeled training data
C) To compress data for storage
D) To generate random synthetic data
ANSWER: B
EXPLAIN: Classification is a supervised learning task that uses labeled training data to build a model predicting the categorical class label of new, unseen data instances (e.g. classifying an email as spam or not spam).
DIFFICULTY: easy
MARKS: 12

Q: What is the fundamental difference between classification and clustering?
A) Classification uses labeled data to predict predefined classes; clustering groups unlabeled data based on similarity with no predefined classes
B) Clustering always requires more computing power than classification
C) Classification and clustering are the same technique
D) Clustering can only be applied to numeric data
ANSWER: A
EXPLAIN: Classification is supervised (uses known class labels to train a predictive model), while clustering is unsupervised — it groups data points into clusters purely based on similarity, without any predefined class labels to guide it.
DIFFICULTY: medium
MARKS: 4

Q: In the K-means clustering algorithm, what does the parameter "k" represent?
A) The number of iterations the algorithm will run
B) The number of clusters the data should be partitioned into
C) The number of attributes in the dataset
D) The distance metric used
ANSWER: B
EXPLAIN: In K-means, "k" is a user-specified parameter defining how many clusters the algorithm should partition the data into; the algorithm then iteratively assigns points to the nearest of k cluster centroids and recomputes centroids until convergence.
DIFFICULTY: easy
MARKS: 8

Q: What does OLAP (Online Analytical Processing) primarily enable analysts to do?
A) Process single transactions quickly, one at a time
B) Interactively analyze multidimensional data from multiple perspectives (e.g. slicing, dicing, drilling down)
C) Physically back up a database
D) Encrypt sensitive columns in a table
ANSWER: B
EXPLAIN: OLAP tools let analysts interactively explore multidimensional data — such as sales by time, region, and product — through operations like slicing, dicing, drilling down, and rolling up, supporting complex analytical queries.
DIFFICULTY: easy
MARKS: 8

Q: Why is data preprocessing (cleaning, transformation) a critical step before data mining?
A) It is optional and rarely improves results
B) Raw data is often noisy, incomplete, or inconsistent, and preprocessing improves data quality so mining algorithms produce accurate, meaningful results
C) It replaces the need for any mining algorithm
D) It only applies to text data
ANSWER: B
EXPLAIN: Real-world data is frequently noisy, missing values, or inconsistent; preprocessing (cleaning, integration, transformation, reduction) improves data quality, which directly affects the accuracy and reliability of the patterns a mining algorithm discovers.
DIFFICULTY: medium
MARKS: 8

Q: Given the transaction table below, what is the support of the itemset {Bread, Milk}? T1: Bread,Butter,Jam,Milk. T2: Bread,Butter,Milk. T3: Bread,Juice,Curd. T4: Bread,Milk,Juice. T5: Butter,Milk,Juice.
A) 20% (1 out of 5 transactions)
B) 60% (3 out of 5 transactions)
C) 80% (4 out of 5 transactions)
D) 100% (5 out of 5 transactions)
ANSWER: B
EXPLAIN: {Bread, Milk} appears together in T1, T2, and T4 (3 of the 5 transactions), giving support = 3/5 = 60%. T3 has Bread but not Milk, and T5 has Milk but not Bread, so they don't count.
DIFFICULTY: medium
MARKS: 12

Q: For the transaction table below, which of these items has the highest individual support? T1: Bread,Butter,Jam,Milk. T2: Bread,Butter,Milk. T3: Bread,Juice,Curd. T4: Bread,Milk,Juice. T5: Butter,Milk,Juice.
A) Butter (appears in T1, T2, T5 — support 60%)
B) Bread (appears in T1, T2, T3, T4 — support 80%)
C) Juice (appears in T3, T4, T5 — support 60%)
D) Jam (appears in T1 only — support 20%)
ANSWER: B
EXPLAIN: Counting occurrences across all 5 transactions: Bread appears in 4 of them (T1, T2, T3, T4), giving it the highest support at 80%, compared to Butter and Juice at 60% each and Jam at just 20%.
DIFFICULTY: medium
MARKS: 12

Q: In K-means clustering with k=2 applied to customers by "Amount" spent (500, 1000, 800, 300, 1200, 1400, 1800), which grouping is most consistent with two natural clusters by spending?
A) A random split with no relation to amount
B) A low-spending cluster (300, 500, 800) and a high-spending cluster (1000, 1200, 1400, 1800)
C) Every customer in its own cluster
D) All customers forced into a single cluster
ANSWER: B
EXPLAIN: K-means groups points by minimizing distance to the nearest centroid. Sorting the "Amount" values (300, 500, 800, 1000, 1200, 1400, 1800), the most natural 2-cluster split separates the lower-spending customers from the higher-spending ones, consistent with typical K-means convergence on 1-D interval data like this.
DIFFICULTY: medium
MARKS: 12

Q: What is the key structural difference between a single-layer perceptron and a multilayer feedforward neural network?
A) They are identical in structure and capability
B) A single-layer perceptron has only input and output layers with no hidden layers, limiting it to linearly separable problems; a multilayer feedforward network adds one or more hidden layers, enabling it to learn non-linear decision boundaries
C) A multilayer network can only be used for regression, never classification
D) A single-layer perceptron always has more parameters than a multilayer network
ANSWER: B
EXPLAIN: A single-layer perceptron directly maps inputs to outputs with no hidden layer, so it can only learn linearly separable functions. Adding hidden layers (multilayer feedforward network) allows the network to approximate complex, non-linear functions via non-linear activation functions across layers.
DIFFICULTY: medium
MARKS: 8

Q: What is the key difference between Euclidean distance and Manhattan distance as similarity measures in clustering?
A) They always produce identical distance values for any two points
B) Euclidean distance measures the straight-line ("as the crow flies") distance between two points; Manhattan distance measures the sum of absolute differences along each dimension (like navigating a city grid)
C) Manhattan distance can only be used in one dimension
D) Euclidean distance is only defined for negative numbers
ANSWER: B
EXPLAIN: Euclidean distance computes √(Σ(xᵢ-yᵢ)²), representing the direct straight-line distance between two points, while Manhattan distance computes Σ|xᵢ-yᵢ|, representing distance traveled only along axis-aligned paths (like city blocks) — they usually give different values except along a single axis.
DIFFICULTY: medium
MARKS: 8
