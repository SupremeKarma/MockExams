Q: What does an agent's "architecture" refer to in AI, as distinct from the agent program?
A) The programming language used to write the agent
B) The physical computing device (sensors, actuators, and processor) that runs the agent program
C) The agent's performance measure only
D) The environment the agent operates in
ANSWER: B
EXPLAIN: An agent = architecture + program. The architecture is the underlying computing device (with sensors and actuators) that the agent program runs on, while the program is the function that maps percepts to actions.
DIFFICULTY: medium
MARKS: 4

Q: In Greedy Best-First Search, what does the algorithm use to decide which node to expand next?
A) The path cost from the start node only (g(n))
B) A heuristic function estimating cost to the goal (h(n)), always expanding the node that appears closest to the goal
C) A random selection among all frontier nodes
D) The depth of the node in the search tree
ANSWER: B
EXPLAIN: Greedy Best-First Search expands the node that appears closest to the goal according to the heuristic h(n) alone, ignoring the cost already incurred — this makes it fast but not guaranteed optimal, unlike A* which also considers g(n).
DIFFICULTY: medium
MARKS: 9

Q: What is "uncertainty in reasoning" in the context of AI?
A) A situation where the AI system has complete, perfect knowledge of all facts
B) The condition where an AI system must make decisions or inferences despite incomplete, ambiguous, or probabilistic information
C) A bug in the AI program
D) A property only found in deterministic systems
ANSWER: B
EXPLAIN: Uncertainty arises when an AI agent cannot know all facts with complete certainty — due to sensor limitations, incomplete data, or a genuinely probabilistic environment — requiring reasoning methods like probability theory (e.g. Bayesian networks) instead of pure logic.
DIFFICULTY: medium
MARKS: 6

Q: What is the main significance of a Bayesian network in AI reasoning under uncertainty?
A) It eliminates the need for any probability calculations
B) It compactly represents conditional dependencies between random variables as a graph, enabling efficient probabilistic inference
C) It only works for deterministic, certain data
D) It is used exclusively for natural language parsing
ANSWER: B
EXPLAIN: A Bayesian network represents variables and their conditional dependencies as a directed acyclic graph, allowing efficient computation of joint and conditional probabilities — crucial for reasoning under uncertainty without needing to store the full joint probability distribution explicitly.
DIFFICULTY: hard
MARKS: 4

Q: What is a "genetic algorithm" in AI, at a high level?
A) A deterministic sorting algorithm
B) A search/optimization technique inspired by natural selection, using operations like selection, crossover, and mutation on a population of candidate solutions
C) A rule-based expert system technique
D) A neural network training method exclusively
ANSWER: B
EXPLAIN: Genetic algorithms are optimization techniques inspired by biological evolution: a population of candidate solutions evolves over generations through selection (favoring fitter solutions), crossover (combining solutions), and mutation (random variation), converging toward better solutions.
DIFFICULTY: medium
MARKS: 8

Q: In propositional logic, which statement correctly relates P→Q (implication) and ¬P∨Q (negation-disjunction)?
A) They are never logically equivalent
B) They are logically equivalent — both are true in exactly the same set of circumstances, verifiable via a truth table
C) P→Q is always false when ¬P∨Q is true
D) They can only be compared using predicate logic, not propositional logic
ANSWER: B
EXPLAIN: P→Q ("if P then Q") is logically equivalent to ¬P∨Q ("not P or Q") — this is a standard logical equivalence, provable by comparing their truth tables across all combinations of P and Q, where both expressions yield identical truth values in every row.
DIFFICULTY: medium
MARKS: 8

Q: What are the main components of an expert system?
A) Only a database and a user interface
B) A knowledge base (facts and rules) and an inference engine that applies those rules to derive conclusions, typically alongside a user interface
C) Only a neural network and a compiler
D) A web server and a search engine
ANSWER: B
EXPLAIN: An expert system's core architecture consists of a knowledge base storing domain facts and rules, and an inference engine that applies logical reasoning (forward or backward chaining) over that knowledge base to answer queries or reach conclusions, typically presented through a user interface.
DIFFICULTY: easy
MARKS: 8
