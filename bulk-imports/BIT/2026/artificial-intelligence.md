Q: What is the key difference between propositional logic and predicate (first-order) logic?
A) Propositional logic can express relationships and quantifiers like "for all" and "there exists"; predicate logic cannot
B) Predicate logic can express objects, relations, and quantifiers ("for all", "there exists"); propositional logic only deals with whole statements as true/false
C) They are exactly the same, just different notation
D) Propositional logic only works with numbers
ANSWER: B
EXPLAIN: Predicate logic extends propositional logic by introducing objects, predicates, and quantifiers (universal "for all" and existential "there exists"), letting it express statements like "every student passed" that propositional logic cannot represent directly.
DIFFICULTY: medium
MARKS: 4

Q: How would "Every student passed the exam" be expressed in First-Order Predicate Logic (FOPL)?
A) There-exists(x): Student(x) AND Passed(x)
B) For-all(x): Student(x) IMPLIES Passed(x)
C) Student(x) OR Passed(x)
D) NOT Student(x)
ANSWER: B
EXPLAIN: Universal statements ("every X does Y") are expressed with the universal quantifier and an implication: for all x, if x is a student, then x passed — written formally as ∀x (Student(x) → Passed(x)).
DIFFICULTY: medium
MARKS: 4

Q: How would "There exists a fruit that all children like" be expressed in FOPL?
A) For-all(x) There-exists(y): Fruit(y) AND Child(x) AND Likes(x, y)
B) There-exists(y) For-all(x): Fruit(y) AND (Child(x) IMPLIES Likes(x, y))
C) For-all(x) For-all(y): Likes(x, y)
D) There-exists(x): Child(x)
ANSWER: B
EXPLAIN: This is an existential statement about a fruit ("there exists a fruit y") combined with a universal statement about children liking it — correctly nested as ∃y (Fruit(y) ∧ ∀x (Child(x) → Likes(x,y))).
DIFFICULTY: hard
MARKS: 4

Q: Between Breadth-First Search (BFS) and Depth-First Search (DFS), which is guaranteed to find the shortest path (fewest edges) in an unweighted graph?
A) DFS, because it explores deeply first
B) BFS, because it explores all nodes at the current depth before going deeper
C) Neither guarantees a shortest path
D) Both guarantee the same path always
ANSWER: B
EXPLAIN: BFS explores the search tree level by level, so the first time it reaches the goal node it has necessarily done so via the fewest possible edges, guaranteeing the shortest path in an unweighted graph — DFS offers no such guarantee.
DIFFICULTY: medium
MARKS: 2

Q: What is a key disadvantage of Depth-First Search (DFS) compared to Breadth-First Search (BFS)?
A) DFS uses much more memory than BFS in general
B) DFS can get stuck exploring an infinite or very deep path and may not find the shortest solution
C) DFS cannot be implemented recursively
D) DFS always visits every node twice
ANSWER: B
EXPLAIN: Because DFS commits to exploring one path as deeply as possible before backtracking, it can go down an unproductive or infinite branch without finding the goal efficiently, and it does not guarantee the shortest path like BFS does.
DIFFICULTY: medium
MARKS: 4

Q: What defines an "intelligent agent" in AI, in terms of its performance and rationality?
A) An agent that always acts randomly
B) An entity that perceives its environment through sensors and acts upon it through actuators to maximize its performance measure rationally
C) A program that never interacts with its environment
D) A fixed lookup table with no perception
ANSWER: B
EXPLAIN: A rational (intelligent) agent perceives its environment via sensors, chooses actions via actuators, and selects actions expected to maximize its performance measure given its knowledge and percept history.
DIFFICULTY: easy
MARKS: 8

Q: What is the main purpose of an expert system in AI?
A) To physically replace human workers in factories
B) To emulate the decision-making ability of a human expert within a specific, narrow domain using encoded knowledge and inference rules
C) To generate random data for testing
D) To manage computer hardware resources
ANSWER: B
EXPLAIN: An expert system uses a knowledge base of domain-specific facts/rules plus an inference engine to emulate the judgment and decision-making of a human expert within a narrow, well-defined problem domain (e.g. medical diagnosis).
DIFFICULTY: easy
MARKS: 4

Q: What is the key difference between supervised and unsupervised learning?
A) Supervised learning uses labeled training data with known outputs; unsupervised learning finds patterns/structure in unlabeled data
B) Unsupervised learning always requires more data than supervised learning
C) Supervised learning never uses a training dataset
D) They are identical approaches
ANSWER: A
EXPLAIN: Supervised learning trains a model on labeled data (input-output pairs) to predict outputs for new inputs, while unsupervised learning works with unlabeled data to discover hidden patterns or groupings, such as clustering.
DIFFICULTY: easy
MARKS: 8

Q: In the cryptarithmetic puzzle HIS + HER = MINE (each letter represents a unique digit), what AI search technique is typically used to solve such puzzles?
A) Simple linear search with no constraints
B) Constraint Satisfaction Problem (CSP) techniques, using backtracking search with constraints like "no two letters share the same digit" and "no leading digit is zero"
C) A purely random guess-and-check with no logic
D) Only sorting algorithms
ANSWER: B
EXPLAIN: Cryptarithmetic puzzles like HIS + HER = MINE are classic Constraint Satisfaction Problems (CSPs) — each letter is a variable with a domain of digits 0-9, constrained by uniqueness and arithmetic column-sum rules (including carries), typically solved via backtracking search with constraint propagation.
DIFFICULTY: medium
MARKS: 8
