Q: What is the worst-case time complexity of searching for an element in an unbalanced Binary Search Tree (BST) containing n nodes?
A) O(1)
B) O(log n)
C) O(n)
D) O(n log n)
ANSWER: C
EXPLAIN: If elements are inserted into a Binary Search Tree in sorted (or reverse-sorted) order, the tree degenerates into a linear linked list (skewed tree). In this worst-case structure, searching requires traversing all n nodes sequentially, giving O(n) time complexity.
DIFFICULTY: easy
MARKS: 1

Q: Which data structure operates under the Last-In, First-Out (LIFO) protocol and is fundamentally used by compilers to manage function call stacks and expression evaluation?
A) Queue
B) Stack
C) Heap
D) Circular Array
ANSWER: B
EXPLAIN: A Stack is a linear data structure following the Last-In, First-Out (LIFO) discipline. The call stack (activation records, return addresses, local variables) in compilers and operating systems is inherently managed as a stack.
DIFFICULTY: easy
MARKS: 1

Q: In an AVL tree, what is the maximum allowed difference between the heights of the left and right subtrees of any node (the Balance Factor)?
A) 0
B) 1
C) 2
D) log n
ANSWER: B
EXPLAIN: An AVL tree is a strictly self-balancing Binary Search Tree where the Balance Factor (Height of Left Subtree - Height of Right Subtree) of every node must be either -1, 0, or +1. If it deviates to ±2, balancing rotations (LL, RR, LR, or RL) are applied immediately.
DIFFICULTY: medium
MARKS: 1

Q: What is the best-case, average-case, and worst-case time complexity of Merge Sort on an array of n elements?
A) Best: O(n), Average: O(n log n), Worst: O(n²)
B) Best: O(n log n), Average: O(n log n), Worst: O(n log n)
C) Best: O(1), Average: O(n), Worst: O(n²)
D) Best: O(n log n), Average: O(n²), Worst: O(n²)
ANSWER: B
EXPLAIN: Merge Sort is a divide-and-conquer algorithm that always divides the array in half (log n levels of division) and takes O(n) linear work to merge the sorted sub-arrays at each level. Consequently, its time complexity is strictly O(n log n) in all cases (best, average, and worst).
DIFFICULTY: medium
MARKS: 2

Q: When converting an infix mathematical expression 'A + B * C' into postfix notation (Reverse Polish Notation), what is the resulting string?
A) + A * B C
B) A B C * +
C) A B + C *
D) A B * C +
ANSWER: B
EXPLAIN: Following operator precedence rules, multiplication (*) has higher priority than addition (+). Thus, 'B * C' is evaluated first to 'B C *'. Then adding 'A' gives 'A B C * +'.
DIFFICULTY: easy
MARKS: 1

Q: In a Circular Queue implemented with an array of size MAX, with 'front' and 'rear' indices, what is the condition indicating that the queue is completely full?
A) front == rear
B) (rear + 1) % MAX == front
C) rear == MAX - 1
D) front == (rear + 1)
ANSWER: B
EXPLAIN: In circular array implementation using modulo arithmetic, if incrementing the rear index wraps around to point to the current front index `(rear + 1) % MAX == front`, the circular queue has reached full capacity.
DIFFICULTY: medium
MARKS: 2

Q: What is the time complexity to insert a new node at the beginning of a Singly Linked List with n nodes, given a pointer to the head node?
A) O(1)
B) O(log n)
C) O(n)
D) O(n²)
ANSWER: A
EXPLAIN: Inserting at the beginning requires creating a new node, setting its `next` pointer to point to the current head, and updating the head pointer to the new node. This involves a constant number of pointer manipulations, executing in O(1) time.
DIFFICULTY: easy
MARKS: 1

Q: Which graph traversal algorithm uses a First-In, First-Out (FIFO) queue and is guaranteed to find the shortest path in terms of number of edges in an unweighted graph?
A) Depth-First Search (DFS)
B) Breadth-First Search (BFS)
C) Kruskal's Algorithm
D) Bellman-Ford Algorithm
ANSWER: B
EXPLAIN: Breadth-First Search (BFS) explores all vertices at the current distance level before moving to vertices at the next distance level, utilizing a FIFO queue. In unweighted graphs, BFS inherently yields the shortest path from the source vertex.
DIFFICULTY: easy
MARKS: 1

Q: What is the primary difference between a Singly Linked List and a Doubly Linked List?
A) Doubly linked lists store twice as many data elements
B) Each node in a doubly linked list contains two pointers: one pointing to the next node and one pointing to the previous node
C) Doubly linked lists do not support dynamic memory allocation
D) Singly linked lists can only be used with numeric data
ANSWER: B
EXPLAIN: While a singly linked list node contains only a data field and a pointer to the next node, a doubly linked list node contains two pointer fields (`next` and `prev`), enabling bidirectional traversal through the list.
DIFFICULTY: easy
MARKS: 1

Q: In a min-heap binary tree of n nodes, where is the minimum element always located?
A) At the leftmost leaf node
B) At the rightmost leaf node
C) At the root node
D) It can be anywhere in the tree
ANSWER: C
EXPLAIN: By definition, the min-heap property states that for every node i other than the root, the value of the node is greater than or equal to the value of its parent: `A[parent(i)] <= A[i]`. Thus, the minimum element of the entire heap is located at the root node.
DIFFICULTY: easy
MARKS: 1

Q: What collision resolution strategy in Hash Tables stores colliding elements in a separate linked list attached to the corresponding hash bucket?
A) Linear Probing
B) Quadratic Probing
C) Separate Chaining
D) Double Hashing
ANSWER: C
EXPLAIN: In Separate Chaining, each cell or bucket of the hash table references a linked list of records that hash to the same index. When collisions occur, the new element is simply appended to that bucket's list. Open addressing methods (linear/quadratic probing) store colliding elements in other available table slots instead.
DIFFICULTY: medium
MARKS: 2

Q: Dijkstra's single-source shortest path algorithm fails or produces incorrect results when:
A) The graph contains cycles
B) The graph contains edges with negative weights
C) The graph is directed
D) The graph has more than 100 vertices
ANSWER: B
EXPLAIN: Dijkstra's algorithm relies on a greedy assumption that once a vertex is marked visited with the minimum tentative distance, its shortest distance cannot be decreased further. Edges with negative weights violate this assumption; the Bellman-Ford algorithm must be used instead for graphs with negative weights.
DIFFICULTY: medium
MARKS: 2

Q: In a complete binary tree with n nodes, what is the maximum height of the tree?
A) O(n)
B) O(log n)
C) O(n log n)
D) O(1)
ANSWER: B
EXPLAIN: A complete binary tree is completely filled on all levels except possibly the lowest, which is filled from left to right. Because the number of nodes doubles at each level, a tree with n nodes has height h = ⌊log₂ n⌋ = O(log n).
DIFFICULTY: easy
MARKS: 1

Q: What is the worst-case time complexity of Quick Sort, and under what condition does it typically occur?
A) O(n log n), occurs when elements are randomly shuffled
B) O(n²), occurs when the pivot chosen is consistently the smallest or largest element (such as an already sorted array with naive first/last element pivot selection)
C) O(n), occurs when all elements are identical
D) O(log n), occurs in descending arrays
ANSWER: B
EXPLAIN: When the chosen pivot repeatedly partitions the array into one empty sub-array and one sub-array of size (n - 1), the recursion depth reaches n, requiring O(n) comparisons at each level. This results in O(n²) worst-case time complexity.
DIFFICULTY: medium
MARKS: 2

Q: Which sorting algorithm is non-comparative and achieves O(n + k) linear time complexity by counting the occurrences of each distinct key value?
A) Insertion Sort
B) Counting Sort
C) Heap Sort
D) Quick Sort
ANSWER: B
EXPLAIN: Counting Sort works by counting the number of objects having each distinct key value, using arithmetic to calculate the positions of each key in the output sequence. It avoids comparisons entirely and runs in O(n + k) time, where k is the range of key values.
DIFFICULTY: medium
MARKS: 1

Q: What is the result of performing an In-Order Traversal (Left, Root, Right) on a valid Binary Search Tree (BST)?
A) The keys are visited in descending sorted order
B) The keys are visited in ascending strictly sorted order
C) The keys are visited in random order
D) The root is visited first, followed by all leaves
ANSWER: B
EXPLAIN: Because a Binary Search Tree maintains the invariant that all keys in the left subtree are smaller than the node, and all keys in the right subtree are larger, visiting in the order (Left, Root, Right) naturally produces a sorted, non-decreasing sequence of keys.
DIFFICULTY: easy
MARKS: 1

Q: Prim's and Kruskal's algorithms are used to find which fundamental subgraph structure in a connected, weighted, undirected graph?
A) Shortest Path Tree
B) Minimum Spanning Tree (MST)
C) Maximum Flow Network
D) Strongly Connected Components
ANSWER: B
EXPLAIN: Both Prim's algorithm (a greedy vertex-growing approach) and Kruskal's algorithm (a greedy edge-joining approach using disjoint sets) compute a Minimum Spanning Tree (MST) — a tree connecting all vertices with the minimum total edge weight without forming cycles.
DIFFICULTY: easy
MARKS: 1

Q: In asymptotic notation, which symbol denotes an asymptotically tight bound that sandwiches a function f(n) from both above and below by constant multiples of g(n)?
A) Big-O notation, O(g(n))
B) Big-Omega notation, Ω(g(n))
C) Big-Theta notation, Θ(g(n))
D) Little-o notation, o(g(n))
ANSWER: C
EXPLAIN: Big-Theta notation Θ(g(n)) provides an asymptotically tight bound, meaning there exist positive constants c₁, c₂, and n₀ such that c₁·g(n) ≤ f(n) ≤ c₂·g(n) for all n ≥ n₀. Big-O is an upper bound and Big-Omega is a lower bound.
DIFFICULTY: medium
MARKS: 1

Q: What is the space complexity of storing a graph with V vertices and E edges using an Adjacency Matrix representation?
A) O(V + E)
B) O(V²)
C) O(E²)
D) O(V · E)
ANSWER: B
EXPLAIN: An adjacency matrix uses a 2-dimensional V × V boolean or weight array, requiring O(V²) memory space regardless of the number of edges E present in the graph. In comparison, an Adjacency List requires O(V + E) space.
DIFFICULTY: easy
MARKS: 1

Q: Which data structure is utilized in Disjoint-Set Union (DSU / Union-Find) to achieve near-constant time operations using Path Compression and Union by Rank?
A) Binary Search Tree
B) Forest of Inverted Trees
C) Fibonacci Heap
D) Circular Doubly Linked List
ANSWER: B
EXPLAIN: Disjoint-Set Union is implemented as a forest of rooted trees where each node points to its parent. With Union by Rank and Path Compression optimizations, any sequence of m operations on n elements runs in O(m · α(n)) time, where α is the inverse Ackermann function (effectively constant, ≤ 4 for all practical universes).
DIFFICULTY: hard
MARKS: 2
