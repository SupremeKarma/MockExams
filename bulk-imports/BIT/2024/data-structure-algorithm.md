Q: What advantage does a circular queue have over a standard linear queue?
A) A circular queue can hold infinite elements
B) A circular queue reuses the freed space at the front of the array by wrapping the rear pointer back to the beginning, avoiding the wasted space problem that occurs in a linear queue after dequeue operations
C) A circular queue never needs a rear pointer
D) A circular queue can only store numbers, not objects
ANSWER: B
EXPLAIN: In a linear queue implemented with an array, once elements are dequeued from the front, that space cannot be reused, eventually causing "false overflow" even with free space available. A circular queue solves this by wrapping the rear index back to index 0 once it reaches the end, reusing the vacated front slots.
DIFFICULTY: medium
MARKS: 2

Q: What is the defining property of a stack data structure?
A) First-In-First-Out (FIFO) — the first element added is the first removed
B) Last-In-First-Out (LIFO) — the most recently added element is the first one removed
C) Elements can be removed from any arbitrary position
D) Elements are always sorted automatically
ANSWER: B
EXPLAIN: A stack follows the LIFO principle — elements are added (pushed) and removed (popped) only from the same end (the "top"), so the last element inserted is always the first one removed, unlike a queue's FIFO behavior.
DIFFICULTY: easy
MARKS: 8

Q: What is the general algorithm approach for evaluating a postfix expression using a stack?
A) Scan left to right; whenever an operand is found push it onto the stack; whenever an operator is found, pop the required number of operands, apply the operator, and push the result back
B) Scan right to left and push every symbol without exception
C) Postfix expressions cannot be evaluated using a stack
D) Convert to infix first, then evaluate using recursion only
ANSWER: A
EXPLAIN: Postfix (Reverse Polish) notation is evaluated left to right using a stack: operands are pushed as encountered, and when an operator is encountered, the necessary operands are popped, the operation applied, and the result pushed back — continuing until one final result remains on the stack.
DIFFICULTY: medium
MARKS: 8

Q: What is the key difference between recursion and iteration when solving a problem?
A) They are identical techniques with different names
B) Recursion solves a problem by having a function call itself with a smaller subproblem, relying on the call stack; iteration solves it using explicit loops without additional function calls
C) Iteration always requires more memory than recursion
D) Recursion can never be converted into an equivalent iterative solution
ANSWER: B
EXPLAIN: Recursion breaks a problem into smaller instances of itself, with each recursive call pushing a new stack frame, until a base case is reached; iteration instead uses loop constructs (for/while) to repeat computation without extra function call overhead — most recursive algorithms can be rewritten iteratively, and vice versa.
DIFFICULTY: medium
MARKS: 8

Q: What is an Abstract Data Type (ADT)?
A) A specific programming language's syntax
B) A logical/mathematical model of a data structure defined purely by its behavior (the operations it supports and their properties), independent of its concrete implementation
C) A synonym for a compiled binary file
D) A data type that has no operations defined
ANSWER: B
EXPLAIN: An ADT defines a data structure abstractly — in terms of the operations that can be performed on it and their expected behavior (e.g. a Stack ADT supports push/pop/peek) — without specifying implementation details like whether it's built on an array or linked list.
DIFFICULTY: medium
MARKS: 8

Q: The Tower of Hanoi puzzle is a classic example used to illustrate which programming concept?
A) Sorting algorithms
B) Recursion, since the problem is naturally solved by recursively moving n-1 disks, moving the largest disk, then recursively moving the n-1 disks again
C) Hash table collision handling
D) Graph traversal only
ANSWER: B
EXPLAIN: The Tower of Hanoi is a canonical recursion example: to move n disks from one peg to another, you recursively move the top n-1 disks to an auxiliary peg, move the largest disk to the destination, then recursively move the n-1 disks from the auxiliary peg to the destination.
DIFFICULTY: medium
MARKS: 8

Q: What is the time complexity of the Merge Sort algorithm in the average and worst case?
A) O(n)
B) O(n log n)
C) O(n²)
D) O(log n)
ANSWER: B
EXPLAIN: Merge Sort works by recursively dividing the array in half (log n levels of division) and merging sorted halves back together (O(n) work per level), giving a consistent O(n log n) time complexity in the average, worst, and even best cases.
DIFFICULTY: medium
MARKS: 8

Q: What is a "spanning tree" of a connected graph?
A) A tree containing every vertex of the graph but not necessarily every edge, using only enough edges to connect all vertices without forming a cycle
B) A tree that includes only half the vertices of the graph
C) A synonym for a binary search tree
D) A structure that always contains a cycle
ANSWER: A
EXPLAIN: A spanning tree of a connected graph with n vertices is a subgraph that includes all n vertices, uses exactly n-1 edges from the original graph, connects everything together, and contains no cycles — algorithms like Kruskal's and Prim's find minimum-weight spanning trees.
DIFFICULTY: medium
MARKS: 8

Q: What is a common technique for resolving hash collisions in a hash table?
A) Collisions are impossible in hash tables and never need resolving
B) Chaining (storing multiple colliding elements in a linked list at the same bucket) or open addressing (probing for the next available slot, e.g. linear/quadratic probing)
C) Deleting the entire hash table when a collision occurs
D) Always doubling the key value
ANSWER: B
EXPLAIN: Hash collisions (two keys mapping to the same bucket) are commonly resolved via chaining, where each bucket holds a linked list of all colliding elements, or via open addressing, where the algorithm probes for the next free slot in the table according to a defined sequence (linear, quadratic, or double hashing).
DIFFICULTY: medium
MARKS: 4
