---
id: bit401co-u1-t1
type: topic_note
course: BIT401CO
syllabus_path: bit.s7.bit401co.u1.t1
syllabus_code: "1.a"
trust: ai_draft
---

# Introduction to network programming

:::idea
A web browser and a web server are two separate programs, usually on two
separate machines, that have never met. Network programming is the discipline
of writing the code that lets them agree on how to talk anyway: who speaks
first, how a message ends, and what happens when the wire in between just
drops the connection.
:::

## The client/server model

Almost everything in this course is one of two roles:

- A **server** waits at a known address for someone to contact it, then
  responds to whatever comes in — a web server, a database, an echo service.
- A **client** initiates the conversation — a browser, `curl`, a mobile app.

The same machine can run both. A server is not "bigger" than a client; it is
just the side that listens first.

## The protocol suite

Two programs cannot agree on anything without a shared set of rules — a
**protocol**. Two competing rulebooks matter here:

| Suite | Structure | Where it's used today |
|---|---|---|
| **OSI** | 7 layers (Physical → Application) | Mostly a teaching model now |
| **TCP/IP** | 4 layers (Link, Internet, Transport, Application) | What the real Internet runs |

The OSI model is more precise about *what* each layer does; TCP/IP is what
the sockets API in this course is actually built on. When this course says
"the transport layer," it means TCP/IP's transport layer — Unit 3 covers it
directly.

:::example{title="Mapping a request onto both models"}
Loading a web page: HTTP sits at the Application layer in both models, TCP is
the Transport layer, IP is the Internet (or Network) layer, and Ethernet/Wi-Fi
is the Link (or Physical + Data Link) layer. Four TCP/IP layers cover what OSI
splits into seven — Application absorbs OSI's Session and Presentation layers,
and Link absorbs Physical and Data Link.
:::

## Unix standards

Network programs written against one vendor's quirks stop working on the
next vendor's kernel. Three standards exist so "socket code" means the same
thing everywhere:

- **POSIX** — the baseline system-call interface (`fork`, `read`, `socket`, …)
  this whole course is written against.
- **The Open Group** — owns the formal "UNIX" trademark and the Single UNIX
  Specification that POSIX feeds into.
- **IETF** — defines the protocols themselves (TCP, UDP, HTTP) in RFCs, not
  the C API for using them.

## Network utilities

Before writing a line of code, these command-line tools answer "is the
network the problem?":

| Utility | Answers |
|---|---|
| `ping` | Is the host reachable at all? |
| `telnet` *host* *port* | Is something listening on that port? |
| `netstat` | What is open on *this* machine right now? |
| `ifconfig` / `ipconfig` | What is my own address? |
| `route` | Where does a packet go next? |
| `ftp` | Can I move a file over the connection? |

:::exam-tip
A question that names a specific utility and asks "what does it check"
wants the one-line answer above, not a general description of networking —
`netstat` and `telnet` are the two examiners return to most.
:::

## Getting to code: wrapper functions and addressing

Two things every program in this course needs before it can open a socket:

1. **An IP address and a port number.** The address gets you to the right
   machine; the port gets you to the right *program* on that machine (a web
   server on 80, SSH on 22). A socket is identified by the pair, not the
   address alone.
2. **Wrapper functions.** Raw system calls like `socket()` or `bind()` return
   `-1` on failure and expect the caller to check `errno` every single time.
   This course wraps each one in a capitalized version — `Socket()`,
   `Bind()` — that checks the return value and calls `err_sys()` to print the
   error and exit. The wrapper does not change *what* the call does, only who
   handles the failure.

:::warning
Do not confuse a **library** (compiled code you link against, e.g. `libc`)
with a **header file** (declarations you `#include` so the compiler knows
those functions exist). You need both: the header to compile, the library to
link. Missing either produces a different error — a compiler error for a
missing header, a linker error for a missing library — and knowing which
error you're looking at tells you which one is missing.
:::

## Iterative, concurrent, and networked servers

The three ways a server can be built, in order of how many clients it can
actually serve at once:

- **Iterative server** — handles one client fully, start to finish, before
  even looking at the next. Simple, but a slow client blocks everyone behind
  it.
- **Concurrent server** — hands each client off (usually with `fork()`) so
  many are served in parallel. This is the default assumption for the rest
  of the course.
- **Networked server** — a concurrent server whose clients are not all on
  the same machine or even the same network; it exists to make that
  distinction explicit once real networks, not just `localhost`, are in play.

:::practice-link
Practice variants for this topic arrive in Phase 4.
:::
