Q: In queuing theory, what does "balking" refer to?
A) A customer who joins the queue and waits until served
B) A customer who arrives, looks at the queue, and decides not to join it at all
C) A customer who switches from one queue to another, shorter queue
D) A customer who leaves the queue after waiting too long
ANSWER: B
EXPLAIN: Balking occurs when an arriving customer decides not to join the queue at all, typically because it appears too long — distinct from "reneging" (leaving after joining) and "jockeying" (switching between queues).
DIFFICULTY: medium
MARKS: 4

Q: In queuing theory, what is "reneging"?
A) A customer refusing to enter the system at all
B) A customer who joins the queue but leaves before being served, due to impatience
C) A server taking a break during service
D) A customer switching to a faster-moving queue
ANSWER: B
EXPLAIN: Reneging is when a customer joins a queue but grows impatient and leaves before receiving service — different from balking (never joining) and jockeying (switching queues while still waiting).
DIFFICULTY: medium
MARKS: 4

Q: What is "jockeying" in a multi-queue system?
A) Customers switching from one queue to another they perceive as faster or shorter
B) A customer refusing service entirely
C) The server processing multiple customers simultaneously
D) A method for generating random numbers
ANSWER: A
EXPLAIN: Jockeying occurs in systems with multiple queues when a waiting customer switches from one queue to another that appears to be moving faster or is shorter, a common behavior in real-world multi-line queuing systems like banks or supermarkets.
DIFFICULTY: medium
MARKS: 4

Q: What statistical test is commonly used to determine whether a sequence of random numbers is uniformly distributed over an interval, comparing observed and theoretical cumulative distributions?
A) The Poker Test
B) The Kolmogorov-Smirnov (K-S) Test
C) The Chi-Square Goodness of Fit Test only
D) The T-test
ANSWER: B
EXPLAIN: The Kolmogorov-Smirnov (K-S) test compares the empirical cumulative distribution function of a sample against a theoretical (e.g. uniform) distribution to determine whether the observed data plausibly comes from that distribution, useful for validating random number generators.
DIFFICULTY: medium
MARKS: 8

Q: What formula defines a Mixed Congruential Generator (MCG) for producing pseudo-random numbers?
A) rₙ = rₙ₋₁² mod m
B) rₙ = (a × rₙ₋₁ + b) mod m, using a multiplier a, increment b, modulus m, and a seed r₀
C) rₙ = rₙ₋₁ + n
D) rₙ = a / rₙ₋₁
ANSWER: B
EXPLAIN: The Mixed (Linear) Congruential Generator produces the next random number using the recurrence rₙ = (a·rₙ₋₁ + b) mod m, where a is the multiplier, b the increment, m the modulus, and r₀ the initial seed — "mixed" because it includes both multiplication and addition (unlike a purely multiplicative generator).
DIFFICULTY: hard
MARKS: 12

Q: What is the primary purpose of the Poker Test in simulation, when applied to four-digit random numbers?
A) To measure the execution speed of the random number generator
B) To test whether generated digit groupings (e.g. all-different, one-pair, two-pair patterns) match expected frequencies, verifying the numbers are sufficiently random and independent
C) To generate new random numbers directly
D) To convert random numbers into normally distributed values
ANSWER: B
EXPLAIN: The Poker Test examines the pattern of digits within each generated number (e.g., how many have all-different digits vs. one pair, two pairs, etc.) and compares the observed frequencies to theoretically expected frequencies via a chi-square test, checking for genuine randomness.
DIFFICULTY: hard
MARKS: 12

Q: What is a Markov Chain used for in simulation and modeling?
A) Modeling a system whose future state depends only on its current state, not on the sequence of events that preceded it (the "memoryless" property)
B) Only for generating truly random, unpredictable sequences
C) Exclusively for encrypting simulation data
D) A method for compressing simulation output files
ANSWER: A
EXPLAIN: A Markov Chain models a system as a sequence of states where the probability of transitioning to the next state depends only on the current state (the Markov/memoryless property), using a transition matrix of probabilities to describe how the system evolves over time.
DIFFICULTY: medium
MARKS: 8

Q: What is the key difference between continuous system simulation and discrete system simulation?
A) Continuous simulation models systems whose state changes continuously over time (e.g. via differential equations); discrete simulation models systems where state changes only at distinct event points in time
B) They are identical techniques with different names
C) Discrete simulation can only be used for financial systems
D) Continuous simulation never uses mathematical equations
ANSWER: A
EXPLAIN: Continuous system simulation models variables that change continuously over time, typically using differential equations (e.g. fluid flow, temperature); discrete-event simulation models systems where state changes occur only at specific discrete points triggered by events (e.g. a customer arriving) — a hybrid simulation combines both.
DIFFICULTY: medium
MARKS: 8
