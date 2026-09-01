Q: Between Breadth-First Search (BFS) and Depth-First Search (DFS), which is guaranteed to find the shortest path in an unweighted graph?
A) DFS, because it explores deeply first
B) BFS, because it explores all nodes at the current depth before going deeper
C) Neither guarantees a shortest path
D) Both guarantee the same path always
ANSWER: B
EXPLAIN: BFS explores level by level, so the first time it reaches the goal it has done so via the fewest possible edges — DFS offers no such guarantee.
DIFFICULTY: medium
MARKS: 2

Q: What is the key difference between supervised and unsupervised learning?
A) Supervised learning uses labeled training data with known outputs; unsupervised learning finds patterns in unlabeled data
B) Unsupervised learning always requires more data than supervised learning
C) Supervised learning never uses a training dataset
D) They are identical approaches
ANSWER: A
EXPLAIN: Supervised learning trains on labeled input-output pairs to predict outputs for new inputs; unsupervised learning works with unlabeled data to discover hidden structure such as clusters.
DIFFICULTY: easy
MARKS: 2

Q: What is the main purpose of an expert system in AI?
A) To physically replace human workers in factories
B) To emulate the decision-making of a human expert in a narrow domain using a knowledge base and inference engine
C) To generate random test data
D) To manage computer hardware resources
ANSWER: B
EXPLAIN: An expert system combines a domain-specific knowledge base with an inference engine to emulate expert judgment within a narrow, well-defined problem area.
DIFFICULTY: easy
MARKS: 2

Q: What does an intelligent agent's "rationality" mean?
A) Always acting completely randomly
B) Selecting actions expected to maximize its performance measure given its percept history and knowledge
C) Never interacting with its environment
D) Following a fixed lookup table with no reasoning
ANSWER: B
EXPLAIN: A rational agent perceives its environment, then chooses the action expected to best achieve its performance measure, based on everything it has perceived and knows so far.
DIFFICULTY: medium
MARKS: 2

Q: What is the Apriori property that makes the Apriori algorithm efficient for association rule mining?
A) Every subset of a frequent itemset must also be frequent
B) Every itemset is automatically frequent regardless of support
C) Larger itemsets are always more frequent than smaller ones
D) Only single items can ever be frequent
ANSWER: A
EXPLAIN: This anti-monotone property lets Apriori prune candidate itemsets early — if a subset isn't frequent, no superset containing it can be either — without recomputing support for every possible combination.
DIFFICULTY: hard
MARKS: 2

Q: Define an intelligent agent, and explain the difference between agent performance and agent rationality.
TYPE: written
MODEL_ANSWER: An intelligent agent is anything that perceives its environment through sensors and acts upon that environment through actuators, choosing actions to achieve its goals. Performance is an objective measure of how well the agent is actually doing at any point — e.g. how many correct diagnoses a medical agent makes. Rationality, by contrast, is about the agent's choice of action given what it currently knows: a rational agent selects, at each step, the action expected to maximize its performance measure based on the percept sequence it has received so far and any built-in knowledge, even if the outcome later turns out to be suboptimal due to incomplete information or an unpredictable environment. In short, performance judges the outcome, while rationality judges the decision-making process given the information available at the time.
DIFFICULTY: medium
MARKS: 8

Q: Explain the working of the Minimax algorithm in adversarial search, and describe how alpha-beta pruning improves it.
TYPE: written
MODEL_ANSWER: Minimax is a decision-making algorithm used in two-player, zero-sum games (like chess or tic-tac-toe) where one player (MAX) tries to maximize the outcome and the other (MIN) tries to minimize it. The algorithm builds a game tree of possible future moves, evaluates the terminal states using a utility function, then propagates values back up the tree: at MAX nodes it takes the maximum of the children's values, and at MIN nodes it takes the minimum, ultimately choosing the move at the root that leads to the best guaranteed outcome assuming optimal play by both sides. Alpha-beta pruning improves Minimax's efficiency by tracking two bounds during the search — alpha (the best value MAX can guarantee so far) and beta (the best value MIN can guarantee so far). Whenever a node's value falls outside the current alpha-beta window (i.e., alpha >= beta), the remaining branches under that node are "pruned" (skipped entirely) because they cannot influence the final decision. This lets alpha-beta pruning explore far fewer nodes than plain Minimax while still returning the exact same result.
DIFFICULTY: hard
MARKS: 8

Q: What is a Bayesian network, and why is it useful for reasoning under uncertainty?
TYPE: written
MODEL_ANSWER: A Bayesian network is a probabilistic graphical model that represents a set of random variables and their conditional dependencies as a directed acyclic graph (DAG), where each node represents a variable and each edge represents a direct probabilistic dependency between two variables. Each node stores a conditional probability table describing the probability of that variable given the state of its parent nodes. Bayesian networks are useful for reasoning under uncertainty because they let an AI system compactly represent a full joint probability distribution over many variables (which would otherwise require an exponentially large table) by exploiting conditional independence between variables that aren't directly connected. This structure enables efficient probabilistic inference — computing the probability of unknown variables given observed evidence — which is essential for decision-making in domains like medical diagnosis or spam filtering, where the AI must draw conclusions from incomplete or noisy information rather than certain facts.
DIFFICULTY: hard
MARKS: 6
