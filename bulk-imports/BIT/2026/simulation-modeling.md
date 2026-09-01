Q: What is "simulation" in the context of systems modeling?
A) Building the actual physical system before testing it
B) Imitating the operation of a real-world process or system over time using a model, to study its behavior
C) A method used only for financial accounting
D) A purely theoretical exercise with no practical application
ANSWER: B
EXPLAIN: Simulation is the technique of building a model that imitates the operation of a real system over time, letting analysts study, experiment with, and predict system behavior without needing to build or disrupt the real system.
DIFFICULTY: easy
MARKS: 2

Q: Which of these is a common drawback of using simulation to study a system?
A) It always gives exact, provably optimal answers
B) It can be time-consuming and expensive to build and validate an accurate model, and results are estimates, not guaranteed optimal solutions
C) It cannot be used for any real-world system
D) It requires no data collection at all
ANSWER: B
EXPLAIN: A key drawback of simulation is that developing an accurate, validated model can be costly and time-consuming, and unlike some analytical methods, simulation produces statistical estimates of behavior rather than a guaranteed, provably optimal answer.
DIFFICULTY: easy
MARKS: 2

Q: In simulation terminology, what is an "entity"?
A) A fixed numeric constant used throughout the model
B) An object or component of interest within the system being modeled (e.g. a customer, a vehicle, a part)
C) The software used to run the simulation
D) The final report generated after simulation
ANSWER: B
EXPLAIN: An entity is an object of interest in the system being simulated — for example, in a banking system, customers are entities; in a traffic system, vehicles are entities — around which attributes, activities, and state variables are defined.
DIFFICULTY: medium
MARKS: 6

Q: What is a "state variable" in a simulation model, such as for a banking system?
A) A fixed parameter that never changes during simulation
B) A variable that describes the system's condition at any point in time, such as the number of customers currently waiting in a queue
C) The name of the programming language used
D) The physical location of the bank branch
ANSWER: B
EXPLAIN: A state variable captures the condition of the system at a given point in time — for a banking system, this could be the number of customers in the queue or whether a teller is busy — and changes as events occur during the simulation.
DIFFICULTY: medium
MARKS: 6

Q: What is the primary purpose of a Poker Test in simulation?
A) To generate random numbers
B) To statistically test whether a sequence of generated numbers exhibits genuine randomness/independence, based on digit patterns
C) To measure the speed of the simulation software
D) To validate the graphical output of a simulation
ANSWER: B
EXPLAIN: The Poker Test examines groupings of digits within generated random numbers (e.g. all-different, one-pair, two-pair patterns) and compares observed frequencies against expected theoretical frequencies using a chi-square test, to check if the numbers are sufficiently random and independent.
DIFFICULTY: hard
MARKS: 12

Q: What is Monte Carlo Simulation primarily used for?
A) Deterministic calculations with no randomness involved
B) Solving problems and modeling systems using repeated random sampling to estimate numerical results
C) Only visualizing static datasets
D) Compiling source code faster
ANSWER: B
EXPLAIN: Monte Carlo simulation uses repeated random sampling to model the probability of different outcomes in a process that is difficult to predict analytically, making it useful for estimating results in complex, uncertain systems.
DIFFICULTY: easy
MARKS: 4

Q: How does Monte Carlo Simulation differ from traditional analytical methods for solving mathematical problems?
A) It always produces the exact same deterministic answer every run
B) It uses repeated random sampling to approximate solutions, especially useful when an analytical (closed-form) solution is difficult or impossible to derive
C) It requires no computer at all
D) It can only be applied to linear equations
ANSWER: B
EXPLAIN: Unlike analytical methods that derive an exact closed-form solution, Monte Carlo simulation approximates solutions through repeated random sampling and statistical analysis of the outcomes, which is especially valuable for complex systems lacking a tractable analytical solution.
DIFFICULTY: medium
MARKS: 4

Q: Why is "replication of runs" important in simulation studies?
A) It has no real benefit and wastes computing time
B) Running the simulation multiple independent times allows statistical estimation of variability and improves the reliability/accuracy of results
C) It ensures the simulation always produces identical results every time
D) It replaces the need for random number generation
ANSWER: B
EXPLAIN: Because a single simulation run only produces one possible sample outcome, replication (running the simulation multiple independent times) allows statistical measures like mean and confidence intervals to be computed, improving the reliability and accuracy of conclusions drawn.
DIFFICULTY: medium
MARKS: 8

Q: In Kendall's notation for describing a queueing system (A/B/C), what does each of the three symbols represent?
A) A = number of servers, B = arrival process, C = service process
B) A = arrival process, B = service (departure) process, C = number of servers
C) A = queue capacity, B = population size, C = service discipline
D) A = service process, B = arrival process, C = queue length
ANSWER: B
EXPLAIN: In Kendall's notation A/B/C, A denotes the arrival process (e.g. M for Markovian/Poisson arrivals), B denotes the service time distribution, and C denotes the number of servers — e.g. M/M/1 describes Poisson arrivals, exponential service times, and a single server.
DIFFICULTY: medium
MARKS: 8

Q: A queueing system has customers arriving according to a Poisson process, service times following an exponential distribution, and a single server. How is this system represented in Kendall's notation?
A) D/D/1
B) M/M/1
C) M/D/2
D) G/G/1
ANSWER: B
EXPLAIN: "M" (Markovian) denotes both a Poisson arrival process and an exponential service time distribution in Kendall's notation, and "1" denotes a single server — so Poisson arrivals + exponential service + one server is written M/M/1, the classic simple queueing model.
DIFFICULTY: medium
MARKS: 8

Q: Using a Mixed Congruential Generator with m=100, a=47, b=10, and seed r₀=7, what is the first generated random number r₁?
A) r₁ = 39
B) r₁ = 44
C) r₁ = 69
D) r₁ = 90
ANSWER: A
EXPLAIN: r₁ = (a×r₀ + b) mod m = (47×7 + 10) mod 100 = (329 + 10) mod 100 = 339 mod 100 = 39.
DIFFICULTY: hard
MARKS: 8
