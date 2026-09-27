Q: In Java architecture, what component is responsible for converting Java bytecode (.class files) into native machine code during runtime?
A) Java Development Kit (JDK)
B) Just-In-Time (JIT) Compiler inside the Java Virtual Machine (JVM)
C) Java Standard Library Compiler (javac)
D) ClassLoader System
ANSWER: B
EXPLAIN: While `javac` compiles `.java` source code into platform-independent bytecode, the JIT (Just-In-Time) compiler within the JVM compiles frequently executed bytecode sections into native hardware instructions at runtime to optimize execution speed.
DIFFICULTY: medium
MARKS: 2

Q: Which of the following statements accurately characterizes the difference between an abstract class and an interface in Java 8+?
A) An interface cannot have any method implementations whatsoever
B) An abstract class supports multiple inheritance, whereas an interface supports only single inheritance
C) A class can implement multiple interfaces, but can extend only one abstract class
D) Variables declared in an interface are mutable by default
ANSWER: C
EXPLAIN: Java supports multiple inheritance of type through interfaces (a class can implement multiple interfaces), but enforces single inheritance of class implementation (a class can extend only one superclass, whether abstract or concrete).
DIFFICULTY: medium
MARKS: 2

Q: What happens when an unhandled runtime exception occurs in a thread in a Java application?
A) The JVM automatically restarts the program from the main method
B) The thread terminates immediately, prints its stack trace to standard error, while other independent non-daemon threads continue executing
C) The entire operating system crashes
D) The exception is automatically swallowed and converted to null
ANSWER: B
EXPLAIN: When an uncaught exception propagates to the top of a thread's call stack, the thread terminates and invokes its `UncaughtExceptionHandler`, printing a stack trace. Other threads continue running unless the failing thread was the only remaining non-daemon thread.
DIFFICULTY: medium
MARKS: 2

Q: Which Java Collection Framework interface guarantees that elements are maintained in sorted ascending order according to their natural ordering or a custom Comparator?
A) HashSet
B) PriorityQueue
C) SortedSet (e.g., TreeSet)
D) LinkedHashSet
ANSWER: C
EXPLAIN: `SortedSet` (implemented by `TreeSet`) guarantees that its elements are maintained in ascending sorted order, either according to the natural ordering of elements (`Comparable`) or by an explicitly supplied `Comparator`.
DIFFICULTY: easy
MARKS: 1

Q: What is the primary advantage of the 'try-with-resources' statement introduced in Java 7?
A) It runs the enclosed code on a secondary CPU core
B) It ensures that each resource implementing AutoCloseable is automatically closed at the end of the statement, preventing resource leaks
C) It catches both checked and unchecked exceptions without requiring catch blocks
D) It converts synchronous disk I/O into non-blocking streams
ANSWER: B
EXPLAIN: The `try-with-resources` statement automatically invokes `.close()` on all declared resources that implement `java.lang.AutoCloseable` or `java.io.Closeable` when exiting the block (whether normally or abruptly through an exception).
DIFFICULTY: easy
MARKS: 1

Q: What is the output of comparing two String objects using '==' versus '.equals()' in Java?
A) '==' compares the contents of strings, while '.equals()' compares reference memory addresses
B) '==' compares memory reference identity, while '.equals()' compares the sequence of characters (content value equality)
C) Both '==' and '.equals()' always return identical Boolean results
D) Neither can be used to compare String objects in Java
ANSWER: B
EXPLAIN: In Java, the `==` relational operator checks reference equality (whether both references point to the exact same object in heap memory), whereas `String.equals()` is overridden to compare character-by-character value equality.
DIFFICULTY: easy
MARKS: 1

Q: Which keyword is used in Java to prevent a method from being overridden by any subclass?
A) static
B) abstract
C) final
D) synchronized
ANSWER: C
EXPLAIN: When applied to a method, the `final` keyword specifies that the method cannot be overridden or hidden by subclasses. When applied to a class, it prevents the class from being subclassed at all.
DIFFICULTY: easy
MARKS: 1

Q: In Java multithreading, what is the role of the 'synchronized' keyword on a method?
A) It makes the method run on every thread at the exact same millisecond
B) It acquires an intrinsic lock (monitor) on the invoking object, ensuring only one thread can execute synchronized methods on that object at a time
C) It compiles the method to run asynchronously without blocking the caller
D) It prevents variables in the method from being garbage collected
ANSWER: B
EXPLAIN: Synchronized methods acquire the intrinsic monitor lock of the object (or the Class object for static synchronized methods). Only one thread can hold this lock at any given time, preventing race conditions on shared mutable state.
DIFFICULTY: medium
MARKS: 2

Q: Which memory region in the JVM is shared among all running threads and stores all instantiated object instances and their instance variables?
A) Program Counter (PC) Register
B) Java Virtual Machine Stack
C) Heap Memory
D) Native Method Stack
ANSWER: C
EXPLAIN: The Java Heap is the runtime data area from which memory for all class instances and arrays is allocated. It is shared across all active threads and managed by the garbage collector. In contrast, JVM Stacks are thread-private.
DIFFICULTY: medium
MARKS: 1

Q: In JDBC, which interface is designed for pre-compiling parameterized SQL queries to improve performance and prevent SQL injection?
A) Statement
B) PreparedStatement
C) CallableStatement
D) ResultSetMetaData
ANSWER: B
EXPLAIN: `PreparedStatement` extends `Statement` and represents precompiled SQL statements. Pre-compilation allows parameter placeholders (`?`) to be bound with type-safe setter methods, enhancing query throughput and shielding against SQL injection.
DIFFICULTY: easy
MARKS: 1

Q: Which of the following is an unchecked (Runtime) exception in Java?
A) java.io.IOException
B) java.sql.SQLException
C) java.lang.NullPointerException
D) java.lang.ClassNotFoundException
ANSWER: C
EXPLAIN: Unchecked exceptions inherit from `java.lang.RuntimeException` or `java.lang.Error`. `NullPointerException`, `ArrayIndexOutOfBoundsException`, and `IllegalArgumentException` are runtime exceptions and do not need to be explicitly declared in `throws` clauses.
DIFFICULTY: easy
MARKS: 1

Q: What is the function of the 'super' keyword in Java?
A) To declare a method with global package visibility
B) To refer directly to members (constructors, fields, or methods) of the immediate superclass
C) To allocate memory on the native C heap
D) To terminate the current program with an exit code
ANSWER: B
EXPLAIN: The `super` keyword in Java is a reference variable used to invoke the superclass constructor (`super()`), invoke superclass methods overridden in the subclass (`super.method()`), or access shadowed superclass fields.
DIFFICULTY: easy
MARKS: 1

Q: Which functional interface in java.util.function takes an argument of type T, performs an operation, and returns no result (void)?
A) Function<T, R>
B) Predicate<T>
C) Supplier<T>
D) Consumer<T>
ANSWER: D
EXPLAIN: `Consumer<T>` represents an operation that accepts a single input argument and returns no result (`void accept(T t)`), commonly used in operations like `.forEach()`.
DIFFICULTY: medium
MARKS: 1

Q: What is Method Overloading in Java?
A) Defining multiple methods in the same class with the same name but different parameter lists (type, count, or order)
B) Redefining a superclass method in a subclass with the exact same signature
C) Making a method return different types depending on the caller at runtime
D) Calling a method continuously until a stack overflow occurs
ANSWER: A
EXPLAIN: Method overloading is compile-time (static) polymorphism where two or more methods in the same class share the exact same method name, but have distinct parameter lists (different number, order, or data types of parameters).
DIFFICULTY: easy
MARKS: 1

Q: In Java, how does the Garbage Collector determine that an object is eligible for memory reclamation?
A) When its reference count falls below zero
B) When the object is no longer reachable through any chain of strong references originating from GC Roots (e.g., active stack frames, static variables)
C) When the object has existed in memory for more than 60 seconds
D) When the finalize() method is manually called by the developer
ANSWER: B
EXPLAIN: Java uses tracing garbage collection (reachability analysis) rather than reference counting. An object becomes eligible for garbage collection when there are no live references connecting it back to any active GC Root.
DIFFICULTY: hard
MARKS: 2

Q: What will be the outcome of attempting to instantiate an interface directly: e.g., 'Runnable r = new Runnable();'?
A) It compiles and runs successfully
B) A compilation error occurs because interfaces cannot be directly instantiated without providing an implementing class or anonymous class body
C) It instantiates a default concrete proxy object
D) The JVM crashes with an InstantiationException at runtime
ANSWER: B
EXPLAIN: Interfaces specify contracts and contain abstract method signatures; they cannot be instantiated directly with `new` unless an anonymous inner class or lambda expression provides concrete implementations for all abstract methods.
DIFFICULTY: easy
MARKS: 1

Q: Which class in Java provides thread-safe, mutable sequences of characters?
A) String
B) StringBuilder
C) StringBuffer
D) CharArray
ANSWER: C
EXPLAIN: Both `StringBuilder` and `StringBuffer` represent mutable sequences of characters. However, `StringBuffer` is synchronized (thread-safe), whereas `StringBuilder` is not synchronized and is faster for single-threaded usage.
DIFFICULTY: medium
MARKS: 1

Q: What is the effect of the 'volatile' keyword when applied to a field in Java?
A) It makes the field read-only
B) It serializes the field to disk
C) It guarantees memory visibility of changes to that variable across threads by preventing CPU caching and instruction reordering
D) It prevents garbage collection of the variable
ANSWER: C
EXPLAIN: Declaring a field `volatile` establishes a "happens-before" relationship: any write to a volatile variable is immediately flushed to main memory, and any subsequent read fetches the most current value directly from main memory, ensuring cross-thread visibility.
DIFFICULTY: hard
MARKS: 2

Q: What design pattern is implemented by java.lang.Runtime with its 'getRuntime()' method?
A) Factory Method Pattern
B) Singleton Pattern
C) Observer Pattern
D) Decorator Pattern
ANSWER: B
EXPLAIN: `java.lang.Runtime` has a private constructor and provides a static accessor method `getRuntime()` that always returns the exact same single instance of the current runtime environment, exemplifying the Singleton design pattern.
DIFFICULTY: medium
MARKS: 1

Q: Which statement best describes the Diamond Problem in object-oriented programming, and how Java resolves it?
A) Multiple classes sharing the same variable name; resolved by namespaces
B) Ambiguity arising when a class inherits from two classes that both implement the same method differently; resolved in Java by disallowing multiple class inheritance
C) Compiling recursive methods; resolved by tail-call optimization
D) Pointer arithmetic conflicts; resolved by bytecode verification
ANSWER: B
EXPLAIN: The Diamond Problem arises in multiple inheritance when a subclass inherits from two superclasses that both inherit from a common base class and override the same method. Java solves this by prohibiting multiple class inheritance, allowing a class to extend only one direct superclass.
DIFFICULTY: medium
MARKS: 2
