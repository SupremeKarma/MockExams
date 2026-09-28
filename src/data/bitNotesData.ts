/**
 * Comprehensive Purbanchal University BIT Semester 1-8 Notes Database
 */

import { semester2NotesData } from "./semester2NotesData";
import { semester7NotesData } from "./semester7NotesData";

export interface CodeExample {
  language: string;
  title: string;
  code: string;
  explanation: string;
}

export interface Topic {
  id: string;
  name: string;
  unit?: number;
  unitTitle?: string;
  unitCode?: string;
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
    ...semester2NotesData,
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
    "Operating Systems": {
      subjectName: "Operating Systems",
      code: "BIT253CO",
      creditHours: 3,
      topics: [
        {
          id: "os-deadlock-coffman",
          name: "Four Coffman Conditions & Resource Allocation Graphs (RAG)",
          importance: "Very High",
          keyPoints: [
            "Deadlock requires all 4 Coffman conditions simultaneously: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait",
            "Breaking any single condition mathematically guarantees deadlock cannot occur",
            "Resource Allocation Graph (RAG): P -> R is Request edge, R -> P is Assignment edge",
            "Single instance with cycle = Deadlock; Multi-instance with cycle = Deadlock is possible but not guaranteed"
          ],
          theory: "Coffman conditions form the theoretical basis of all deadlock prevention strategies. Total ordering of resources prevents Circular Wait.",
          code: `// Detection of Circular Wait in Single-Instance Resource Allocation (Cycle Finding)
bool hasDeadlockCycle(int u, vector<bool>& visited, vector<bool>& recStack, const vector<vector<int>>& adj) {
    visited[u] = true;
    recStack[u] = true;
    for (int v : adj[u]) {
        if (!visited[v] && hasDeadlockCycle(v, visited, recStack, adj)) return true;
        else if (recStack[v]) return true; // Cycle detected = Deadlock
    }
    recStack[u] = false;
    return false;
}`,
          example: "Process P1 holds R1, requests R2. Process P2 holds R2, requests R1. Closed loop P1 -> R2 -> P2 -> R1 -> P1 constitutes circular wait.",
          commonExamQuestions: [
            "State and explain the four Coffman conditions necessary for deadlock to occur.",
            "Draw a Resource Allocation Graph showing a deadlock condition and prove how breaking circular wait prevents it."
          ]
        },
        {
          id: "os-bankers-algorithm",
          name: "Banker's Algorithm & Safe State Verification",
          importance: "Very High",
          keyPoints: [
            "Banker's Algorithm (Dijkstra) avoids deadlocks by ensuring the system never enters an unsafe state",
            "Need Matrix Formula: Need[i][j] = Max[i][j] - Allocation[i][j]",
            "Safety Algorithm: Finds a safe sequence <P1, P2, ... Pn> where each process can finish with Work + Allocation",
            "Resource-Request Algorithm: Allocates tentatively and checks safety before committing"
          ],
          theory: "Avoidance checks future worst-case Need, contrasting with detection which checks current Request.",
          code: `// C++ Banker's Safety Algorithm
bool isSafe(int n, int m, vector<int> avail, vector<vector<int>> maxM, vector<vector<int>> allot) {
    vector<vector<int>> need(n, vector<int>(m));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            need[i][j] = maxM[i][j] - allot[i][j];
    vector<bool> finish(n, false);
    vector<int> work = avail;
    int count = 0;
    while (count < n) {
        bool found = false;
        for (int p = 0; p < n; p++) {
            if (!finish[p]) {
                int j;
                for (j = 0; j < m; j++) if (need[p][j] > work[j]) break;
                if (j == m) {
                    for (int k = 0; k < m; k++) work[k] += allot[p][k];
                    finish[p] = true; found = true; count++;
                }
            }
        }
        if (!found) return false; // Unsafe state
    }
    return true;
}`,
          example: "Given Available=[3, 3, 2], Max & Allocation matrices for P0..P4. Need matrix computed. Safe sequence: <P1, P3, P4, P0, P2>.",
          commonExamQuestions: [
            "Given Allocation, Max, and Available matrices, calculate Need matrix and determine if the system is in a safe state.",
            "If process P1 makes a request for (1, 0, 2), can the request be granted immediately? Justify using Banker's Algorithm."
          ]
        },
        {
          id: "os-deadlock-recovery",
          name: "Deadlock Detection & Recovery Strategies",
          importance: "High",
          keyPoints: [
            "Wait-For Graph (WFG) detection for single instance per resource type",
            "Multiple instance detection uses Available, Allocation, and Request matrices",
            "Recovery Option 1: Process termination (abort all or abort one-by-one by lowest cost/priority)",
            "Recovery Option 2: Resource preemption with checkpoint rollback; must guard against starvation"
          ],
          theory: "The OS allows deadlock to occur, periodically invokes detection, and breaks the deadlock via preemption or aborts.",
          code: `// Deadlock Recovery: Select Victim Process with Minimum Penalty Cost
int selectVictimProcess(const vector<int>& cpuTimeSpent, const vector<int>& priority) {
    int victim = -1, minScore = 1e9;
    for (size_t i = 0; i < cpuTimeSpent.size(); i++) {
        int penalty = cpuTimeSpent[i] + priority[i] * 10;
        if (penalty < minScore) { minScore = penalty; victim = i; }
    }
    return victim;
}`,
          example: "Aborting lowest-priority background batch jobs while preserving user interactive foreground sessions.",
          commonExamQuestions: [
            "Describe the methods used for recovering from a deadlock situation.",
            "What is starvation in deadlock preemption, and how can the aging technique prevent it?"
          ]
        }
      ],
      theoryTopics: [
        "Compare Deadlock Prevention, Avoidance, and Detection & Recovery with respect to resource utilization and overhead.",
        "Why is Banker's algorithm not used in general purpose operating systems like Linux and Windows?",
        "Explain the differences between preemptive and non-preemptive CPU scheduling (Round Robin, SRTF, Priority).",
        "Describe Virtual Memory Page Replacement algorithms (FIFO, LRU, Optimal) and Belady's Anomaly."
      ]
    },
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
          id: "os-deadlock-coffman",
          name: "Four Coffman Conditions & Resource Allocation Graphs (RAG)",
          importance: "Very High",
          keyPoints: [
            "Deadlock requires all 4 Coffman conditions simultaneously: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait",
            "Breaking any single condition mathematically guarantees deadlock cannot occur",
            "Resource Allocation Graph (RAG): P -> R is Request edge, R -> P is Assignment edge",
            "Single instance with cycle = Deadlock; Multi-instance with cycle = Deadlock is possible but not guaranteed"
          ],
          theory: "Coffman conditions form the theoretical basis of all deadlock prevention strategies. Total ordering of resources prevents Circular Wait.",
          code: `// Detection of Circular Wait in Single-Instance Resource Allocation (Cycle Finding)
bool hasDeadlockCycle(int u, vector<bool>& visited, vector<bool>& recStack, const vector<vector<int>>& adj) {
    visited[u] = true;
    recStack[u] = true;
    for (int v : adj[u]) {
        if (!visited[v] && hasDeadlockCycle(v, visited, recStack, adj)) return true;
        else if (recStack[v]) return true; // Cycle detected = Deadlock
    }
    recStack[u] = false;
    return false;
}`,
          example: "Process P1 holds R1, requests R2. Process P2 holds R2, requests R1. Closed loop P1 -> R2 -> P2 -> R1 -> P1 constitutes circular wait.",
          commonExamQuestions: [
            "State and explain the four Coffman conditions necessary for deadlock to occur.",
            "Draw a Resource Allocation Graph showing a deadlock condition and prove how breaking circular wait prevents it."
          ]
        },
        {
          id: "os-bankers-algorithm",
          name: "Banker's Algorithm & Safe State Verification",
          importance: "Very High",
          keyPoints: [
            "Banker's Algorithm (Dijkstra) avoids deadlocks by ensuring the system never enters an unsafe state",
            "Need Matrix Formula: Need[i][j] = Max[i][j] - Allocation[i][j]",
            "Safety Algorithm: Finds a safe sequence <P1, P2, ... Pn> where each process can finish with Work + Allocation",
            "Resource-Request Algorithm: Allocates tentatively and checks safety before committing"
          ],
          theory: "Avoidance checks future worst-case Need, contrasting with detection which checks current Request.",
          code: `// C++ Banker's Safety Algorithm
bool isSafe(int n, int m, vector<int> avail, vector<vector<int>> maxM, vector<vector<int>> allot) {
    vector<vector<int>> need(n, vector<int>(m));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            need[i][j] = maxM[i][j] - allot[i][j];
    vector<bool> finish(n, false);
    vector<int> work = avail;
    int count = 0;
    while (count < n) {
        bool found = false;
        for (int p = 0; p < n; p++) {
            if (!finish[p]) {
                int j;
                for (j = 0; j < m; j++) if (need[p][j] > work[j]) break;
                if (j == m) {
                    for (int k = 0; k < m; k++) work[k] += allot[p][k];
                    finish[p] = true; found = true; count++;
                }
            }
        }
        if (!found) return false; // Unsafe state
    }
    return true;
}`,
          example: "Given Available=[3, 3, 2], Max & Allocation matrices for P0..P4. Need matrix computed. Safe sequence: <P1, P3, P4, P0, P2>.",
          commonExamQuestions: [
            "Given Allocation, Max, and Available matrices, calculate Need matrix and determine if the system is in a safe state.",
            "If process P1 makes a request for (1, 0, 2), can the request be granted immediately? Justify using Banker's Algorithm."
          ]
        },
        {
          id: "os-deadlock-recovery",
          name: "Deadlock Detection & Recovery Strategies",
          importance: "High",
          keyPoints: [
            "Wait-For Graph (WFG) detection for single instance per resource type",
            "Multiple instance detection uses Available, Allocation, and Request matrices",
            "Recovery Option 1: Process termination (abort all or abort one-by-one by lowest cost/priority)",
            "Recovery Option 2: Resource preemption with checkpoint rollback; must guard against starvation"
          ],
          theory: "The OS allows deadlock to occur, periodically invokes detection, and breaks the deadlock via preemption or aborts.",
          code: `// Deadlock Recovery: Select Victim Process with Minimum Penalty Cost
int selectVictimProcess(const vector<int>& cpuTimeSpent, const vector<int>& priority) {
    int victim = -1, minScore = 1e9;
    for (size_t i = 0; i < cpuTimeSpent.size(); i++) {
        int penalty = cpuTimeSpent[i] + priority[i] * 10;
        if (penalty < minScore) { minScore = penalty; victim = i; }
    }
    return victim;
}`,
          example: "Aborting lowest-priority background batch jobs while preserving user interactive foreground sessions.",
          commonExamQuestions: [
            "Describe the methods used for recovering from a deadlock situation.",
            "What is starvation in deadlock preemption, and how can the aging technique prevent it?"
          ]
        }
      ],
      theoryTopics: [
        "Compare Deadlock Prevention, Avoidance, and Detection & Recovery with respect to resource utilization and overhead.",
        "Why is Banker's algorithm not used in general purpose operating systems like Linux and Windows?",
        "Explain the differences between preemptive and non-preemptive CPU scheduling (Round Robin, SRTF, Priority).",
        "Describe Virtual Memory Page Replacement algorithms (FIFO, LRU, Optimal) and Belady's Anomaly."
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
    ...semester7NotesData,
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

/**
 * Look up subject notes by course code or subject title.
 * Handles both legacy (e.g. BIT101) and revised codes (e.g. BIT105CO).
 */
export function getSubjectNotes(codeOrName: string, semester?: number): SubjectNotes | null {
  const norm = codeOrName.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");

  const codeAliases: Record<string, string> = {
    BIT105CO: "BIT101",
    BIT101CO: "BIT101",
    BIT102HS: "BIT102",
    BIT151HS: "BIT151HS",
    BIT152SH: "BIT151HS",
    BIT151: "BIT151HS",
    BIT152CO: "BIT152CO",
    BIT152: "BIT152CO",
    BIT153HS: "BIT153HS",
    BIT153: "BIT153HS",
    BIT154CO: "BIT154CO",
    BIT154: "BIT154CO",
    BIT201: "BIT154CO",
    BIT201CO: "BIT154CO",
    BIT155MS: "BIT155MS",
    BIT155: "BIT155MS",
    BIT156CO: "BIT156CO",
    BIT156PR: "BIT156CO",
    BIT156: "BIT156CO",
    BIT253CO: "BIT253CO",
    BIT253: "BIT253CO",
    BIT501: "BIT253CO",
    BIT501CO: "BIT253CO",
    BIT301CO: "BIT301",
    BIT401CO: "BIT401CO",
    BIT402CO: "BIT402CO",
    BIT421CO: "BIT421CO",
    BIT422CO: "BIT422CO",
    BIT423CO: "BIT423CO",
    BIT428CO: "BIT428CO",
    BIT429CO: "BIT429CO",
    BIT435CO: "BIT435CO",
    BIT436CO: "BIT436CO",
    BIT437CO: "BIT437CO",
    BIT403CO: "BIT403CO",
    BIT487CO: "BIT487CO",
    BIT601CO: "BIT601",
    BIT701CO: "BIT701",
    BIT701: "BIT701",
    BIT801CO: "BIT801",
  };

  const targetCode = codeAliases[norm] || norm;
  const initialSemesters = semester ? [semester] : [1, 2, 3, 4, 5, 6, 7, 8];

  const searchInSemesters = (semList: number[]) => {
    for (const sem of semList) {
      const semData = bitNotesData[sem];
      if (!semData) continue;

      for (const [key, subj] of Object.entries(semData)) {
        const subjNormCode = subj.code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
        const subjNormName = subj.subjectName.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
        const keyNorm = key.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");

        if (
          subjNormCode === targetCode ||
          subjNormCode === norm ||
          subjNormName.includes(norm) ||
          norm.includes(subjNormName) ||
          keyNorm.includes(norm) ||
          norm.includes(keyNorm)
        ) {
          return subj;
        }
      }
    }
    return null;
  };

  const result = searchInSemesters(initialSemesters);
  if (result) return result;

  // Fallback: search all other semesters if not found in requested semester
  if (semester) {
    const allRemaining = [1, 2, 3, 4, 5, 6, 7, 8].filter((s) => s !== semester);
    return searchInSemesters(allRemaining);
  }

  return null;
}

/**
 * Generate official Markdown (.md) representation of subject study notes.
 */
export function generateSubjectNotesMarkdown(notes: SubjectNotes, semester: number): string {
  const lines: string[] = [];
  lines.push(`# ${notes.subjectName} (${notes.code})`);
  lines.push(`**Semester**: ${semester} | **Credits**: ${notes.creditHours || 3}`);
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## 1. Core Code Algorithms & Practical Implementations");
  lines.push("");

  notes.topics.forEach((t, i) => {
    lines.push(`### 1.${i + 1} ${t.name} [Priority: ${t.importance}]`);
    if (t.keyPoints && t.keyPoints.length > 0) {
      lines.push("**Key Concepts & Exam Notes:**");
      t.keyPoints.forEach((kp) => lines.push(`- ${kp}`));
      lines.push("");
    }
    if (t.code) {
      const lang = t.codeExamples?.[0]?.language || "cpp";
      lines.push("```" + lang);
      lines.push(t.code);
      lines.push("```");
      lines.push("");
    }
    lines.push("---");
    lines.push("");
  });

  if (notes.theoryTopics && notes.theoryTopics.length > 0) {
    lines.push("## 2. High-Frequency Theory Questions & University Solutions");
    lines.push("");
    notes.theoryTopics.forEach((tt, i) => {
      lines.push(`### Q${i + 1}: ${tt}`);
      lines.push(
        `> **University Exam Solution Guide**: High-frequency recurring topic for Purbanchal University assessments. Structure your answer with clear definitions, architecture diagram/state flow, and key points.`
      );
      lines.push("");
    });
  }

  return lines.join("\n");
}
