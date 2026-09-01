Q: What does it mean for Java to be described as a "platform-independent" programming language?
A) It only runs on Windows platforms
B) Compiled Java bytecode can run unmodified on any platform with a compatible JVM
C) It requires a different compiler for each operating system
D) It compiles directly to native machine code per OS
ANSWER: B
EXPLAIN: Java source code compiles to bytecode, which any Java Virtual Machine (JVM) can interpret/execute regardless of the underlying hardware or OS — "write once, run anywhere."
DIFFICULTY: easy
MARKS: 12

Q: What is a socket in network programming, as used in TCP/UDP communication?
A) A physical network cable connector
B) An endpoint for sending/receiving data across a network, identified by an IP address and port
C) A type of encryption algorithm
D) A Java class for file I/O only
ANSWER: B
EXPLAIN: A socket is a software abstraction representing one endpoint of a two-way network communication link, bound to an IP address and port number, used by both TCP and UDP.
DIFFICULTY: medium
MARKS: 4

Q: In Java's RMI-style distributed programming, what concept describes running code in a different JVM as if it were local?
A) Serialization
B) Remote Method Invocation (RMI) representing a virtual machine within a virtual machine
C) Multithreading
D) Garbage collection
ANSWER: B
EXPLAIN: RMI lets an object's methods be invoked from another JVM (potentially on a different machine) using stub/skeleton proxies, giving the illusion of a "virtual machine within a virtual machine."
DIFFICULTY: medium
MARKS: 4

Q: What is the main difference between the AWT and Swing GUI component libraries in Java?
A) AWT is platform-independent, Swing is not
B) Swing components are lightweight and rendered by Java itself; AWT components are heavyweight and rely on native OS peers
C) AWT supports more component types than Swing
D) Swing cannot be used to build windows
ANSWER: B
EXPLAIN: AWT (Abstract Window Toolkit) delegates rendering to native OS widgets (heavyweight), while Swing components are painted entirely by Java itself (lightweight), giving Swing more consistent cross-platform appearance and flexibility.
DIFFICULTY: medium
MARKS: 8

Q: What is the key advantage of using an applet over a standalone application, and a key disadvantage?
A) Advantage: runs without a browser; Disadvantage: cannot use graphics
B) Advantage: runs inside a web browser without separate installation; Disadvantage: restricted by browser security sandboxing
C) Advantage: faster than any desktop app; Disadvantage: cannot receive user input
D) Advantage: always platform-specific; Disadvantage: needs its own JVM
ANSWER: B
EXPLAIN: Applets run embedded in a web page without requiring separate installation, but are constrained by the browser's security sandbox, limiting file system and network access compared to standalone applications.
DIFFICULTY: easy
MARKS: 4

Q: What is the difference between an array and a Vector in Java?
A) Arrays can grow dynamically; Vectors have a fixed size
B) Vectors can grow/shrink dynamically and are synchronized; arrays have a fixed size set at creation
C) Arrays are synchronized by default; Vectors are not
D) There is no difference
ANSWER: B
EXPLAIN: A Java array has a fixed size determined at creation, while Vector is a resizable, thread-safe (synchronized) collection that can grow or shrink dynamically as elements are added or removed.
DIFFICULTY: easy
MARKS: 4

Q: What is the key difference between marshalling and unmarshalling in distributed object communication?
A) Marshalling converts an object into a transmittable format; unmarshalling reconstructs the object from that format on the receiving end
B) They are two names for the same process
C) Marshalling only applies to primitive types
D) Unmarshalling happens before marshalling
ANSWER: A
EXPLAIN: Marshalling serializes an object's state into a byte stream/format suitable for transmission; unmarshalling is the reverse process of deserializing that stream back into an object on the receiver's side.
DIFFICULTY: medium
MARKS: 4

Q: What is the primary purpose of object serialization in Java?
A) To speed up method execution
B) To convert an object's state into a byte stream that can be saved or transmitted, and later reconstructed
C) To compile Java source code
D) To enforce access modifiers
ANSWER: B
EXPLAIN: Serialization converts an object into a byte stream (implementing Serializable) so its state can be persisted to storage or sent over a network, and deserialization reconstructs the object later.
DIFFICULTY: easy
MARKS: 7

Q: In distributed applications, what problem does "code reusability via multithreading with synchronization" primarily solve?
A) Preventing race conditions when multiple threads access shared resources concurrently
B) Reducing the size of compiled bytecode
C) Eliminating the need for a network connection
D) Automatically translating code between languages
ANSWER: A
EXPLAIN: Synchronization mechanisms (like synchronized blocks/methods) coordinate concurrent thread access to shared resources, preventing race conditions while still allowing reusable, concurrent code execution.
DIFFICULTY: medium
MARKS: 8

Q: What does polymorphism allow in object-oriented distributed applications?
A) A single interface to represent different underlying forms/implementations, letting the same method call behave differently depending on the actual object type
B) Objects to have only one possible behavior
C) Classes to avoid inheritance entirely
D) Variables to change their data type at compile time only
ANSWER: A
EXPLAIN: Polymorphism lets a single method signature/interface invoke different implementations depending on the runtime type of the object, a core mechanism enabling flexible, extensible distributed object systems.
DIFFICULTY: medium
MARKS: 4
