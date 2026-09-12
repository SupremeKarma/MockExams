---
id: bit253co-u6-t3
type: topic_note
course: BIT253CO
syllabus_path: bit.s4.bit253co.u6.t3
syllabus_code: "6.c"
trust: ai_draft
---

# Resources and deadlock modelling

:::idea
Rather than reason about deadlock in words, draw it. A resource allocation graph
puts every process and every resource on a page, with arrows showing who holds
what and who is waiting for what. Once it is drawn, deadlock becomes something
you can see: a loop.
:::

## The notation

A resource allocation graph has two kinds of node and two kinds of edge. Getting
the shapes and arrow directions right is most of the marks in a drawing
question.

| Symbol | Means |
|---|---|
| **Circle** | A process |
| **Rectangle** | A resource type |
| **Dot inside a rectangle** | One instance of that resource |
| **Arrow P → R** (request edge) | The process is **waiting for** that resource |
| **Arrow R → P** (assignment edge) | That instance is **held by** the process |

:::diagram{title="Both edge kinds at once. R1 has two instances: P1 holds one, and P2 is waiting for the other."}
```rag
labels: auto
process P1, P2
resource R1 x2
R1 -> P1
P2 -> R1
```
:::

:::warning
The arrow directions are not arbitrary and they are easy to reverse under exam
pressure. **Request points away from the process** (P is reaching out for
something). **Assignment points away from the resource** (the resource has been
handed over). Draw an assignment edge from a *specific dot*, not from the box
edge — with multiple instances, which dot is held matters.
:::

When a request is granted, the request edge is **flipped**: P → R becomes
R → P. That single move is the whole life of an allocation.

:::diagram{title="P1 holds R1 and wants R2; P2 holds R2 and wants R1. Following the arrows returns to where you started."}
```rag
process P1, P2
resource R1, R2
P1 -> R2
R2 -> P2
P2 -> R1
R1 -> P1
```
:::

Every arrow there is red because every one of them lies on the loop. Start
anywhere and follow the arrowheads: you come back. Both resources have a single
instance, so this is a deadlock.

## What a cycle means

This is the central rule of the topic, and it has two halves that students
routinely merge into one wrong statement.

| Situation | A cycle means |
|---|---|
| **One instance** of each resource type | **Deadlock, definitely** |
| **Several instances** of some type | Deadlock is **possible**, not certain |

And the contrapositive is always true and always worth stating:

> **No cycle ⇒ no deadlock.** Always, in every case.

:::warning
"A cycle in the graph means deadlock" is only true for single-instance
resources. With multiple instances a cycle can exist and resolve itself,
because a process waiting on a type may be satisfied by an instance some
*other* process — one outside the cycle — is about to release. Say which case
you mean; the unqualified sentence loses marks.
:::

::::example{title="A cycle that is NOT a deadlock"}
Resource type R has **two** instances; S has one.

- P1 holds S and is waiting for R.
- P2 holds one instance of R and is waiting for S.
- P4 holds the other instance of R and is waiting for nothing.

:::diagram{title="P1, R, P2 and S form a cycle, yet nothing is stuck. P4's edge is black because it lies outside the loop."}
```rag
process P1, P2, P4
resource R x2, S
P1 -> R
R -> P2
P2 -> S
S -> P1
R -> P4
```
:::

Trace the red arrows and you return to P1, so there is a genuine cycle. Yet
nothing is stuck. **P4 is not waiting for anything**, so it finishes, and when
it does it releases its instance of R. That instance goes to P1, which then
finishes and releases S, which frees P2.

P4 was never part of the cycle, which is exactly why the cycle was not fatal.
With only one instance of R there would have been no second holder to rescue
anyone, and the same picture would have been a deadlock.
::::

## The wait-for graph

When every resource type has exactly one instance, the resource boxes carry no
information — each has exactly one holder. Collapsing them leaves a **wait-for
graph**: processes only, with an edge from P to Q meaning "P is waiting for
something Q holds".

To build it: for every pair of edges `P → R` and `R → Q`, draw `P → Q`, then
delete the resource nodes.

This is the structure the detection algorithm uses in
[6.d](#), and finding a cycle in it costs O(n²) for n processes.

## Reading a graph in an exam

A drawing question almost always asks the same three things. Work in this order:

1. **Draw the graph** from the allocation table. Circles, rectangles, dots,
   correctly directed arrows.
2. **Look for a cycle.** Trace the arrows; if you return to where you started,
   there is one.
3. **Say what it means** — and say which case you are in. Single instance:
   deadlocked, name the processes in the cycle. Multiple instances: deadlock is
   possible, and you must run the detection algorithm to be sure.

:::exam-tip
Label every node. An unlabelled graph earns almost nothing even when the shape
is right, because the examiner cannot check the arrows against the table.

Two habits that pay: draw the **dots** for instances, since a question with two
instances of a resource is testing exactly that distinction; and write one
sentence under the graph stating your conclusion — "P1 and P2 form a cycle and
each resource has one instance, so they are deadlocked". The drawing is the
working; the sentence is the answer.
:::

:::practice-link
Practice variants for this topic arrive in Phase 4.
:::
