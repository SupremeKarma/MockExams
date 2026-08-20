/**
 * Comprehensive Purbanchal University BIT Semester 1-8 Notes Database
 */

export interface CodeExample {
  language: string;
  title: string;
  code: string;
  explanation: string;
}

export interface Topic {
  id: string;
  name: string;
  importance: 'Very High' | 'High' | 'Medium' | 'Low';
  keyPoints: string[];
  theory: string;
  code?: string;
  example?: string;
  codeExamples?: CodeExample[];
  commonExamQuestions?: string[];
}

export type CodeTopic = Topic;

export interface SubjectNotes {
  subjectName: string;
  code: string;
  creditHours: number;
  topics: Topic[];
  theoryTopics: string[];
}

export type SemesterNotesData = Record<string, SubjectNotes>;

export const bitNotesData: Record<number, SemesterNotesData> = {
  1: {
    "Programming in C": {
      subjectName: "Programming in C",
      code: "BIT101",
      creditHours: 3,
      topics: [
        {
          id: "c-pointers",
          name: "Pointers, Dynamic Memory & Memory Addresses",
          importance: "Very High",
          keyPoints: [
            "Pointer stores hexadecimal address of another variable (* dereference, & address-of)",
            "Dynamic allocation via malloc(), calloc(), realloc(), and free() in <stdlib.h>",
            "Dangling pointers occur when referencing deallocated heap memory",
            "Pointer arithmetic: ptr + 1 advances by sizeof(data_type) bytes"
          ],
          theory: "Pointers enable direct memory manipulation, dynamic data structures, and efficient call-by-reference.",
          code: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int *arr = (int *)malloc(5 * sizeof(int));\n    if (!arr) return 1;\n    for(int i = 0; i < 5; i++) *(arr + i) = (i + 1) * 10;\n    for(int i = 0; i < 5; i++) printf("%d ", *(arr + i));\n    free(arr);\n    return 0;\n}`,
          example: "Time Complexity: O(1) allocation, O(n) traversal. Space: O(n) on heap.",
          commonExamQuestions: [
            "Differentiate between malloc() and calloc() with syntax and memory layout diagrams.",
            "What is a pointer to pointer (double pointer)? Explain with a code snippet."
          ]
        },
        {
          id: "c-structures",
          name: "Structures, Unions & Bit-Fields",
          importance: "High",
          keyPoints: [
            "Structure members each have their own memory; union members share the largest member's memory",
            "struct size is affected by byte padding and memory alignment",
            "Access members using dot operator (.) for values and arrow operator (->) for pointers"
          ],
          theory: "User-defined composite types grouping heterogeneous data attributes.",
          code: `#include <stdio.h>\n\nstruct Student {\n    int id;\n    char name[30];\n    float gpa;\n};\n\nint main() {\n    struct Student s1 = {101, "Aarav Sharma", 3.85};\n    struct Student *ptr = &s1;\n    printf("Student: %s, GPA: %.2f\\n", ptr->name, ptr->gpa);\n    return 0;\n}`,
          example: "sizeof(union) = max(sizeof(member)), sizeof(struct) >= sum(sizeof(member))",
          commonExamQuestions: [
            "Compare structures and unions with memory allocation layout diagrams.",
            "Write a program to store 100 students' records and sort by GPA."
          ]
        }
      ],
      theoryTopics: [
        "Explain different storage classes in C (auto, register, static, extern) with scope and lifetime.",
        "Describe recursive functions with memory stack activation record diagrams.",
        "What are file handling modes in C? Explain fopen, fread, fwrite, fclose."
      ]
    },
    "Mathematics-I": {
      subjectName: "Mathematics-I (Calculus & Vectors)",
      code: "BIT102",
      creditHours: 3,
      topics: [
        {
          id: "math-derivatives",
          name: "Mean Value Theorems & Partial Differentiation",
          importance: "Very High",
          keyPoints: [
            "Rolle's Theorem: If f(a)=f(b) on [a,b], then exists c where f'(c)=0",
            "Lagrange MVT: f'(c) = (f(b) - f(a)) / (b - a)",
            "Euler's Theorem on Homogeneous Functions: x(dz/dx) + y(dz/dy) = n*z"
          ],
          theory: "Differential calculus formulations for rate of change, limits, and multi-variable surface optimization.",
          code: `// Analytical formulation:\n// If f(x) is continuous on [a,b] & differentiable on (a,b)\n// f'(c) = (f(b) - f(a)) / (b - a)`,
          example: "f(x) = x^3 - 3x on [0, 2] => f'(c) = 3c^2 - 3 = (2 - 0)/2 = 1 => c = sqrt(4/3)",
          commonExamQuestions: [
            "State and prove Rolle's Theorem and Lagrange's Mean Value Theorem.",
            "Verify Euler's theorem for homogeneous function u = sin^-1((x+y)/(sqrt(x)+sqrt(y)))."
          ]
        }
      ],
      theoryTopics: [
        "Find asymptotes of rational algebraic curves.",
        "Evaluate definite integrals using Beta and Gamma functions.",
        "Solve linear differential equations of first order using Integrating Factor."
      ]
    }
  },
  2: {
    "Object-Oriented Programming in C++": {
      subjectName: "Object-Oriented Programming in C++",
      code: "BIT201",
      creditHours: 3,
      topics: [
        {
          id: "cpp-polymorphism",
          name: "Virtual Functions, Abstract Classes & Dynamic Polymorphism",
          importance: "Very High",
          keyPoints: [
            "Virtual functions enable runtime dynamic dispatch via vtable and vptr",
            "Pure virtual functions (= 0) create abstract classes that cannot be instantiated",
            "Virtual destructors ensure derived class destructors execute properly during base-pointer deletion"
          ],
          theory: "Polymorphism allows objects of different classes to respond uniquely to the same function call.",
          code: `#include <iostream>\nusing namespace std;\n\nclass Shape {\npublic:\n    virtual void draw() = 0; // Pure virtual\n    virtual ~Shape() {}\n};\n\nclass Circle : public Shape {\npublic:\n    void draw() override { cout << "Drawing Circle\\n"; }\n};\n\nint main() {\n    Shape *s = new Circle();\n    s->draw();\n    delete s;\n    return 0;\n}`,
          example: "Dynamic dispatch: vptr -> vtable[index] at runtime.",
          commonExamQuestions: [
            "Explain virtual function mechanism using vptr and vtable diagrams.",
            "What is multiple inheritance? Explain ambiguity and how virtual base class resolves it."
          ]
        }
      ],
      theoryTopics: [
        "Compare compile-time polymorphism (overloading) with run-time polymorphism (overriding).",
        "Explain C++ exception handling mechanism (try, catch, throw).",
        "Describe C++ template classes and function templates with generic examples."
      ]
    }
  },
  3: {
    "Data Structures & Algorithms": {
      subjectName: "Data Structures & Algorithms",
      code: "BIT301",
      creditHours: 3,
      topics: [
        {
          id: "dsa-avl",
          name: "AVL Self-Balancing Binary Search Trees",
          importance: "Very High",
          keyPoints: [
            "Balance factor = height(left_subtree) - height(right_subtree) must be in {-1, 0, 1}",
            "4 Rotation types: Left-Left (Right Rotate), Right-Right (Left Rotate), Left-Right, Right-Left",
            "Guarantees O(log n) search, insertion, and deletion time complexity"
          ],
          theory: "Self-balancing BST preventing degenerate linked-list degradation in worst-case lookups.",
          code: `// AVL Node Balance & Right Rotation:\nstruct Node* rightRotate(struct Node* y) {\n    struct Node* x = y->left;\n    struct Node* T2 = x->right;\n    x->right = y;\n    y->left = T2;\n    y->height = max(height(y->left), height(y->right)) + 1;\n    x->height = max(height(x->left), height(x->right)) + 1;\n    return x;\n}`,
          example: "Time: O(log n) for Search/Insert/Delete. Space: O(n).",
          commonExamQuestions: [
            "Insert keys [10, 20, 30, 40, 50, 25] into an initially empty AVL tree and show all rotations.",
            "Explain Dijkstra's Single Source Shortest Path algorithm with time complexity."
          ]
        }
      ],
      theoryTopics: [
        "Explain Quick Sort with partition algorithm and worst-case vs average-case analysis.",
        "Compare BFS (Queue) and DFS (Stack/Recursion) traversals with adjacency list graphs.",
        "Describe Hash collision resolution techniques (Chaining vs Open Addressing)."
      ]
    }
  },
  4: {
    "Database Management Systems": {
      subjectName: "Database Management Systems",
      code: "BIT401",
      creditHours: 3,
      topics: [
        {
          id: "dbms-normalization",
          name: "Relational Normalization (1NF to BCNF)",
          importance: "Very High",
          keyPoints: [
            "1NF: Atomic attribute values (no multi-valued/repeating groups)",
            "2NF: In 1NF and no partial dependencies (non-prime depends on full candidate key)",
            "3NF: In 2NF and no transitive dependencies (X -> Y where Y is non-prime => X is superkey)",
            "BCNF: For every functional dependency X -> Y, X must be a superkey"
          ],
          theory: "Decomposition technique to eliminate insertion, update, and deletion anomalies.",
          code: `-- SQL DDL with Foreign Key Constraints & Indexes\nCREATE TABLE Students (\n    student_id INT PRIMARY KEY AUTO_INCREMENT,\n    name VARCHAR(100) NOT NULL,\n    email VARCHAR(100) UNIQUE\n);\n\nCREATE INDEX idx_student_email ON Students(email);`,
          example: "Lossless Join Decomposition: R1 ∩ R2 -> R1 or R1 ∩ R2 -> R2",
          commonExamQuestions: [
            "Given R(A,B,C,D,E) with F={A->BC, CD->E, B->D, E->A}, find candidate keys and normal form.",
            "Explain ACID properties in database transaction processing."
          ]
        }
      ],
      theoryTopics: [
        "Explain Two-Phase Locking (2PL) protocol for concurrency control.",
        "Describe B+ Tree indexing architecture and why it is preferred for disk storage over B Trees."
      ]
    }
  },
  5: {
    "Operating Systems": {
      subjectName: "Operating Systems",
      code: "BIT501",
      creditHours: 3,
      topics: [
        {
          id: "os-deadlock",
          name: "Deadlock Handling & Banker's Algorithm",
          importance: "Very High",
          keyPoints: [
            "4 Coffman Conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait",
            "Banker's Algorithm: Resource Allocation State Verification (Need = Max - Allocation)",
            "Safe State: System can allocate maximum resources to each process in some sequence"
          ],
          theory: "Process synchronization and resource allocation state safety analysis.",
          code: `// Banker's Algorithm Safety Check:\n// If Need[i][j] <= Work[j], process i can finish.\n// Work[j] += Allocation[i][j]; Finish[i] = true;`,
          example: "Total Resources = [10, 5, 7], Available = [3, 3, 2]. Safe Sequence: <P1, P3, P4, P0, P2>",
          commonExamQuestions: [
            "Solve Banker's algorithm safe sequence problem given Allocation, Max, and Available matrices.",
            "Explain paging memory management and calculate effective memory access time with TLB."
          ]
        }
      ],
      theoryTopics: [
        "Compare preemptive vs non-preemptive CPU scheduling algorithms (Round Robin, SRTF, Priority).",
        "Describe virtual memory page replacement algorithms (FIFO, LRU, Optimal)."
      ]
    }
  },
  6: {
    "Computer Networks": {
      subjectName: "Computer Networks",
      code: "BIT601",
      creditHours: 3,
      topics: [
        {
          id: "net-subnetting",
          name: "IPv4 Variable Length Subnet Masking (VLSM) & Routing",
          importance: "Very High",
          keyPoints: [
            "Subnet mask separates Network ID from Host ID",
            "VLSM allocates subnets based on exact host requirements without wasting address space",
            "CIDR notation: /24 = 255.255.255.0 (256 - 2 = 254 usable hosts)"
          ],
          theory: "Network layer addressing, packet forwarding, and topological route planning.",
          code: `// Subnet Calculation for 192.168.1.0/26:\n// Mask: 255.255.255.192\n// Block Size: 256 - 192 = 64\n// Subnet 1: 192.168.1.0 - 192.168.1.63 (Usable: .1 to .62, Broadcast: .63)`,
          example: "Formula: Usable Hosts = 2^(32 - prefix) - 2",
          commonExamQuestions: [
            "Given IP 192.168.10.0/24, create 4 subnets with 50, 25, 12, and 6 hosts using VLSM.",
            "Compare OSI 7-Layer Model with TCP/IP 4-Layer Protocol Suite."
          ]
        }
      ],
      theoryTopics: [
        "Explain TCP 3-Way Handshake and connection teardown flow.",
        "Describe Link-State (OSPF) vs Distance-Vector (RIP) routing protocols."
      ]
    }
  },
  7: {
    "Artificial Intelligence": {
      subjectName: "Artificial Intelligence",
      code: "BIT701",
      creditHours: 3,
      topics: [
        {
          id: "ai-astar",
          name: "A* Informed Heuristic Graph Search",
          importance: "Very High",
          keyPoints: [
            "Evaluation function: f(n) = g(n) + h(n)",
            "g(n) = exact cost from start node to n",
            "h(n) = heuristic estimated cost from n to goal",
            "Admissibility condition: h(n) <= h*(n) (never overestimates true cost)"
          ],
          theory: "Optimal best-first search algorithm combining Dijkstra's cost and Greedy best-first heuristics.",
          code: `// A* Search Evaluation:\n// Node selected = min(f(n)) from Open Priority Queue\n// Guaranteed optimal if h(n) is admissible and consistent.`,
          example: "h(n) straight line distance in 8-puzzle or GPS routing navigation.",
          commonExamQuestions: [
            "Trace A* algorithm on given graph with node coordinates and heuristic table.",
            "Explain Minimax algorithm with Alpha-Beta Pruning on game decision trees."
          ]
        }
      ],
      theoryTopics: [
        "Describe knowledge representation using First-Order Predicate Logic (FOPL) and Resolution refutation.",
        "Explain Backpropagation in Artificial Neural Networks."
      ]
    }
  },
  8: {
    "Network Security & Cryptography": {
      subjectName: "Network Security & Cryptography",
      code: "BIT801",
      creditHours: 3,
      topics: [
        {
          id: "sec-rsa",
          name: "RSA Asymmetric Cryptography & Key Generation",
          importance: "Very High",
          keyPoints: [
            "Select two large primes p and q; calculate modulus n = p * q",
            "Euler totient phi(n) = (p - 1) * (q - 1)",
            "Select public exponent e where gcd(e, phi(n)) = 1 and 1 < e < phi(n)",
            "Compute private key d = e^(-1) mod phi(n)",
            "Ciphertext: C = M^e mod n, Plaintext: M = C^d mod n"
          ],
          theory: "Public-key cryptography based on the computational intractability of factoring large semi-prime integers.",
          code: `// RSA Encryption Formula:\n// C = (M^e) % n\n// Decryption: M = (C^d) % n`,
          example: "p=3, q=11 => n=33, phi(n)=20. Choose e=7. d=3 (7*3 = 21 = 1 mod 20).",
          commonExamQuestions: [
            "Given p=7, q=17, and e=5, compute public/private keys and encrypt message M=19 using RSA.",
            "Explain Diffie-Hellman Key Exchange and Man-in-the-Middle vulnerability."
          ]
        }
      ],
      theoryTopics: [
        "Explain SHA-256 cryptographic hash function and digital signatures.",
        "Describe Kerberos authentication protocol and ticket granting service."
      ]
    }
  }
};
