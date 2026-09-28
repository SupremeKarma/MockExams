# Operating Systems: Deadlock & Banker's Algorithm (Comprehensive Study Notes)
**Course Code**: BIT253CO / BIT501 | **Subject**: Operating System | **Department**: Computer Science & Information Technology | **Credits**: 3

---

## 1. Deadlock Introduction & Core Concepts

### 1.1 What is a Deadlock?
A **deadlock** in an Operating System is a permanent blocking of a set of concurrent processes that either compete for system resources or communicate with each other. 
Formally:
> A set of processes is in a **deadlocked state** when every process in the set is waiting for an event (typically the release of an allocated resource) that can only be caused by another process in the same set.

Because all processes in the set are waiting, none of them can ever run, none can ever release resources, and none can be awakened without operating system intervention.

```
       [Process P1]  ---(holds)---►  [Resource R1]
            ▲                              │
        (waits for)                   (waits for)
            │                              ▼
       [Resource R2] ◄---(holds)---  [Process P2]
```

### 1.2 Preemptable vs. Non-preemptable Resources
The operating system categorizes system resources into two distinct classes:

| Resource Type | Definition | System Examples | Deadlock Implication |
|---|---|---|---|
| **Preemptable** | Can be taken away from the process currently holding it without causing adverse effects or computation corruption. | CPU cycles, Main Memory pages. | Does **NOT** lead to deadlock; the OS scheduler can forcefully reclaim the resource. |
| **Non-preemptable** | Cannot be forcefully taken away from its current owner without causing the task or calculation to fail. | Physical Printers, Tape Drives, Mutex Locks, Database write locks. | **Deadlocks exclusively occur** on non-preemptable resources. |

---

## 2. The Four Necessary Coffman Conditions

In 1971, Edward G. Coffman Jr. proved that a deadlock condition can arise if and **only if all four** of the following conditions hold simultaneously in the system:

### 2.1 Mutual Exclusion
At least one resource must be held in a non-shareable mode. Only one process at a time can use the resource. If another process requests that resource, the requesting process must be delayed until the resource is released.
- *Counter-example*: Read-only files can be shared concurrently by infinite processes and will never deadlock.

### 2.2 Hold and Wait
There must exist a process that is currently holding at least one allocated resource and simultaneously waiting to acquire additional resources that are currently being held by other active processes.

### 2.3 No Preemption
Resources cannot be forcibly preempted from a process. A resource can only be released voluntarily by the process holding it, after that process has completed its execution task.

### 2.4 Circular Wait
A closed chain of processes must exist such that each process holds one or more resources needed by the next process in the chain:
$$P_0 \to P_1 \to P_2 \to \dots \to P_n \to P_0$$
Where $P_0$ waits for a resource held by $P_1$, $P_1$ waits for $P_2$, and $P_n$ waits for $P_0$.

> **Key Exam Theorem**: If you break or invalidate even **one** of these four conditions, system deadlock becomes mathematically impossible.

---

## 3. Resource Allocation Graphs (RAG)

Deadlocks can be precisely represented using directed graphs known as **Resource-Allocation Graphs (RAG)**:
- $V = P \cup R$, where $P = \{P_1, P_2, \dots, P_n\}$ (processes represented as circles) and $R = \{R_1, R_2, \dots, R_m\}$ (resource types represented as boxes with dots for instances).
- **Request Edge ($P_i \to R_j$)**: Directed edge from process to resource type (indicates process $P_i$ is waiting for an instance of $R_j$).
- **Assignment Edge ($R_j \to P_i$)**: Directed edge from a specific instance dot inside $R_j$ to process $P_i$ (indicates an instance of $R_j$ is allocated to $P_i$).

### Graph Rules for Deadlock Determination:
1. **No Cycle** in graph $\implies$ **No Deadlock** can exist.
2. **Cycle exists with Single Instance** per resource type $\implies$ **Deadlock definitely exists** (necessary and sufficient condition).
3. **Cycle exists with Multiple Instances** per resource type $\implies$ **Deadlock MAY exist** (necessary but not sufficient; reduction/safety analysis is required).

### Wait-For Graph (WFG)
For single-instance resource systems, we can collapse the resource nodes to form a **Wait-For Graph**:
- Nodes are strictly processes ($P_i$).
- Edge $P_i \to P_j$ exists if $P_i$ is waiting for process $P_j$ to release a required resource.
- **A cycle in a Wait-For Graph is a necessary and sufficient condition for deadlock.**

---

## 4. Methods for Handling Deadlocks

Modern computing handles deadlocks through four fundamental strategies:

```
                      ┌───────────────────────────────────────────────┐
                      │          Deadlock Handling Strategies         │
                      └──────────────────────┬────────────────────────┘
                                             │
      ┌──────────────────┬───────────────────┴──────────────────┬──────────────────┐
      ▼                  ▼                                      ▼                  ▼
┌───────────┐      ┌────────────┐                         ┌───────────┐      ┌───────────┐
│ Ignorance │      │ Prevention │                         │ Avoidance │      │ Detection │
│ (Ostrich) │      │ (Coffman)  │                         │ (Banker's)│      │& Recovery │
└───────────┘      └────────────┘                         └───────────┘      └───────────┘
```

1. **Ostrich Algorithm (Ignore Deadlock)**:
   - Presume deadlocks are exceedingly rare. If one occurs, reboot or kill processes. Used by modern general-purpose OSes (Linux, Windows, macOS) because the runtime overhead of prevention/avoidance exceeds the rare cost of deadlock.
2. **Deadlock Prevention**:
   - Constrain how requests for resources are made by systematically invalidating at least one of the 4 Coffman conditions at design time.
3. **Deadlock Avoidance**:
   - The OS dynamically examines each resource request in real-time. If granting the request could lead to an **unsafe state**, the process is forced to wait (e.g., Banker's Algorithm).
4. **Deadlock Detection and Recovery**:
   - Permit deadlocks to occur freely. Periodically invoke a detection algorithm to uncover cycles or unfinishable processes, then initiate recovery actions (aborting processes or preempting resources).

---

## 5. Deadlock Prevention (Breaking Coffman Conditions)

| Targeted Condition | Prevention Mechanism | Drawbacks & Performance Costs |
|---|---|---|
| **Mutual Exclusion** | Make all resources shareable (e.g. read-only files, or spooling printers). | Impossible for intrinsically non-shareable hardware (e.g., tape drives, hardware write ports). Spooling buffers consume disk space and can still exhaust spool table entries. |
| **Hold and Wait** | **Protocol 1**: A process must request and receive all required resources before execution begins.<br>**Protocol 2**: A process can only request resources when it currently holds none. | **Severe resource underutilization** (resources held idle for hours until needed); **Starvation** of processes requiring many popular resources. |
| **No Preemption** | If a process holding resources requests another resource that cannot be immediately allocated, all of its currently held resources are forcefully preempted and placed on the waitlist. | Only practical for state-saveable resources (CPU registers, RAM). Disastrous for database locks or file modifications midway through execution. |
| **Circular Wait** | **Total Resource Ordering**: Impose a global 1-to-1 ordering function $F: R \to \mathbb{N}$ on all resource types (e.g. $F(\text{Tape}) = 1$, $F(\text{Disk}) = 5$, $F(\text{Printer}) = 12$). A process can only request resource $R_j$ if $F(R_j) > F(R_i)$ for all $R_i$ it holds. | The most practical prevention technique; however, finding an optimal global ordering that accommodates all software workflows without limiting concurrency is challenging. |

---

## 6. Deadlock Avoidance & The Banker's Algorithm

### 6.1 Safe State vs. Unsafe State
- **Safe State**: A state is safe if there exists a **safe sequence** $\langle P_1, P_2, \dots, P_n \rangle$ such that for each $P_i$, the maximum additional resources that $P_i$ may still request can be satisfied by the currently available resources plus the resources already held by all $P_j$ (where $j < i$).
- **Relationship**:
  $$\text{Deadlocked State} \subset \text{Unsafe State} \subset \text{All States}$$
  - A **Safe state** is strictly **NOT deadlocked**.
  - An **Unsafe state** is **NOT necessarily a deadlock**, but carries the potential to become deadlocked.
  - Avoidance ensures the OS **never exits the Safe State region**.

### 6.2 The Banker's Algorithm (Edsger Dijkstra)
Applicable to systems with multiple instances of each resource type. Each process must declare its **Maximum Need** in advance.

#### Primary Data Structures:
Let $n = \text{number of processes}$, $m = \text{number of resource types}$:
1. **Available $[m]$**: Vector of length $m$. If $\text{Available}[j] = k$, there are $k$ instances of resource $R_j$ free.
2. **Max $[n \times m]$**: Matrix defining the maximum demand of each process.
3. **Allocation $[n \times m]$**: Matrix defining resources currently allocated to each process.
4. **Need $[n \times m]$**: Matrix defining remaining resources needed to complete execution.
$$\mathbf{Need}[i][j] = \mathbf{Max}[i][j] - \mathbf{Allocation}[i][j]$$

#### Safety Algorithm:
1. Let $\text{Work} = \text{Available}$ (vector of size $m$) and $\text{Finish}[i] = \text{false}$ for $i = 0, 1, \dots, n-1$.
2. Find an index $i$ such that:
   - $\text{Finish}[i] == \text{false}$
   - $\text{Need}[i] \le \text{Work}$
   If no such $i$ exists, go to step 4.
3. $\text{Work} = \text{Work} + \text{Allocation}[i]$
   $\text{Finish}[i] = \text{true}$
   Go to step 2.
4. If $\text{Finish}[i] == \text{true}$ for all $i$, then the system is in a **Safe State**.

#### Resource-Request Algorithm (Process $P_i$ requests vector $Y$):
1. If $Y[j] \le \text{Need}[i][j]$ for all $j$, proceed to Step 2. Else raise error (Process exceeded declared maximum claim).
2. If $Y[j] \le \text{Available}[j]$ for all $j$, proceed to Step 3. Else $P_i$ must wait (resources not available).
3. Pretend to allocate resources to $P_i$:
   $$\text{Available} = \text{Available} - Y$$
   $$\text{Allocation}[i] = \text{Allocation}[i] + Y$$
   $$\text{Need}[i] = \text{Need}[i] - Y$$
4. Run Safety Algorithm. If safe $\implies$ Grant transaction. If unsafe $\implies$ Rollback state and force $P_i$ to wait.

---

### 6.3 Complete Worked University Numerical Example

**Problem Statement**:
Consider 5 processes ($P_0$ through $P_4$) and 3 resource types ($A, B, C$) with total instances $A = 10, B = 5, C = 7$.
Snapshot at time $T_0$:

| Process | Allocation (A B C) | Max (A B C) | Available (A B C) |
|---|---|---|---|
| $P_0$ | 0 1 0 | 7 5 3 | **3 3 2** |
| $P_1$ | 2 0 0 | 3 2 2 | |
| $P_2$ | 3 0 2 | 9 0 2 | |
| $P_3$ | 2 1 1 | 2 2 2 | |
| $P_4$ | 0 0 2 | 4 3 3 | |

#### Step 1: Calculate the Need Matrix ($\text{Need} = \text{Max} - \text{Allocation}$)
- $\text{Need}(P_0) = [7-0, 5-1, 3-0] = [7, 4, 3]$
- $\text{Need}(P_1) = [3-2, 2-0, 2-0] = [1, 2, 2]$
- $\text{Need}(P_2) = [9-3, 0-0, 2-2] = [6, 0, 0]$
- $\text{Need}(P_3) = [2-2, 2-1, 2-1] = [0, 1, 1]$
- $\text{Need}(P_4) = [4-0, 3-0, 3-2] = [4, 3, 1]$

#### Step 2: Safety Algorithm Execution
Initial $\text{Work} = [3, 3, 2]$, $\text{Finish} = [\text{F}, \text{F}, \text{F}, \text{F}, \text{F}]$

1. **Check $P_0$**: $\text{Need}[7, 4, 3] \le \text{Work}[3, 3, 2]$? **False** ($P_0$ waits).
2. **Check $P_1$**: $\text{Need}[1, 2, 2] \le \text{Work}[3, 3, 2]$? **True**!
   - $\text{Work} = [3, 3, 2] + [2, 0, 0] = [5, 3, 2]$
   - $\text{Finish}[P_1] = \text{true}$
   - Sequence: $\langle P_1 \rangle$
3. **Check $P_3$**: $\text{Need}[0, 1, 1] \le \text{Work}[5, 3, 2]$? **True**!
   - $\text{Work} = [5, 3, 2] + [2, 1, 1] = [7, 4, 3]$
   - $\text{Finish}[P_3] = \text{true}$
   - Sequence: $\langle P_1, P_3 \rangle$
4. **Check $P_4$**: $\text{Need}[4, 3, 1] \le \text{Work}[7, 4, 3]$? **True**!
   - $\text{Work} = [7, 4, 3] + [0, 0, 2] = [7, 4, 5]$
   - $\text{Finish}[P_4] = \text{true}$
   - Sequence: $\langle P_1, P_3, P_4 \rangle$
5. **Check $P_0$**: $\text{Need}[7, 4, 3] \le \text{Work}[7, 4, 5]$? **True**!
   - $\text{Work} = [7, 4, 5] + [0, 1, 0] = [7, 5, 5]$
   - $\text{Finish}[P_0] = \text{true}$
   - Sequence: $\langle P_1, P_3, P_4, P_0 \rangle$
6. **Check $P_2$**: $\text{Need}[6, 0, 0] \le \text{Work}[7, 5, 5]$? **True**!
   - $\text{Work} = [7, 5, 5] + [3, 0, 2] = [10, 5, 7]$
   - $\text{Finish}[P_2] = \text{true}$
   - Final Safe Sequence: $\mathbf{\langle P_1, P_3, P_4, P_0, P_2 \rangle}$

**Conclusion**: Since all processes finished, the system is in a **Safe State**, and **no deadlock exists**.

---

### 6.4 Production C++ Banker's Algorithm Implementation

```cpp
#include <iostream>
#include <vector>
using namespace std;

const int P = 5; // Number of processes
const int R = 3; // Number of resource types

bool checkSafeState(const vector<int>& processes, const vector<int>& avail, 
                    const vector<vector<int>>& maxm, const vector<vector<int>>& allot) {
    vector<vector<int>> need(P, vector<int>(R));
    for (int i = 0; i < P; i++) {
        for (int j = 0; j < R; j++) {
            need[i][j] = maxm[i][j] - allot[i][j];
        }
    }

    vector<bool> finish(P, false);
    vector<int> safeSeq(P);
    vector<int> work = avail;

    int count = 0;
    while (count < P) {
        bool found = false;
        for (int p = 0; p < P; p++) {
            if (!finish[p]) {
                int j;
                for (j = 0; j < R; j++) {
                    if (need[p][j] > work[j]) break;
                }

                if (j == R) {
                    for (int k = 0; k < R; k++) work[k] += allot[p][k];
                    safeSeq[count++] = p;
                    finish[p] = true;
                    found = true;
                }
            }
        }

        if (!found) {
            cout << "System is in an UNSAFE state (Deadlock potential detected)!\n";
            return false;
        }
    }

    cout << "System is in a SAFE state.\nSafe Sequence: ";
    for (int i = 0; i < P; i++) {
        cout << "P" << safeSeq[i] << (i < P - 1 ? " -> " : "\n");
    }
    return true;
}

int main() {
    vector<int> processes = {0, 1, 2, 3, 4};
    vector<int> avail = {3, 3, 2};
    vector<vector<int>> maxm = {
        {7, 5, 3},
        {3, 2, 2},
        {9, 0, 2},
        {2, 2, 2},
        {4, 3, 3}
    };
    vector<vector<int>> allot = {
        {0, 1, 0},
        {2, 0, 0},
        {3, 0, 2},
        {2, 1, 1},
        {0, 0, 2}
    };

    checkSafeState(processes, avail, maxm, allot);
    return 0;
}
```

---

## 7. Deadlock Detection & Recovery

### 7.1 Detection Algorithm for Multiple Instances
Identical in mathematical structure to Banker's Safety algorithm with **one vital difference**:
- Banker's Avoidance checks future worst-case $\mathbf{Need}$.
- Detection checks immediate current outstanding $\mathbf{Request}$.
- If any process cannot complete under current $\text{Available}$ resources, all unfinishable processes are tagged in the **Deadlock Set**.

### 7.2 Recovery Techniques
When a detection algorithm identifies a deadlocked cycle, the OS must choose a recovery path:

#### Option A: Process Termination
1. **Abort all deadlocked processes**: Guaranteed to break deadlock, but causes massive loss of completed computation.
2. **Abort one process at a time** until the deadlock cycle is broken:
   - Abort priority determined by: Process priority, computation time spent vs. time to completion, resources held, future resources needed.

#### Option B: Resource Preemption
Preempt resources from processes and assign them to others until the deadlock cycle is cleared:
1. **Selecting a Victim**: Minimize penalty cost (e.g. choose processes holding few resources that can be easily restarted).
2. **Rollback**: Roll back the victim process to a safe **checkpoint state**, then restart it from that point.
3. **Starvation Prevention**: Ensure the same victim is not perpetually selected for preemption (track a rollback count metric in the PCB).

---

## 8. High-Frequency Exam Questions & University Rubric

### Q1: Compare Deadlock Prevention, Avoidance, and Detection & Recovery.
> **Exam Rubric (8 Marks)**:
> - **Prevention (2.5 marks)**: Static design-time constraints; breaks 1 of 4 Coffman conditions; high overhead & lowest resource utilization.
> - **Avoidance (2.5 marks)**: Dynamic runtime analysis; keeps system in safe state via Banker's algorithm; requires advance knowledge of maximum resource demands.
> - **Detection & Recovery (3 marks)**: Reactive post-condition inspection; uses wait-for graph or detection matrix; resolves via process termination or preemption/rollback.

### Q2: What is the Banker's Algorithm? Why is it rarely implemented in modern general-purpose operating systems?
> **Answer**:
> The Banker's Algorithm is a deadlock avoidance algorithm that checks if granting a request leaves the system in a safe state with a complete execution sequence.
> **Why rarely implemented in Linux/Windows**:
> 1. It requires processes to know and declare their maximum resource claim in advance, which is impossible for modern dynamic applications.
> 2. The number of active processes ($n$) and available resources ($m$) in modern systems changes dynamically.
> 3. Enormous computational complexity $O(m \times n^2)$ evaluated on every single resource request causes unacceptable system latency.
