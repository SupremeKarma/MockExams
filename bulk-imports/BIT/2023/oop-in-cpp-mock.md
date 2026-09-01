Q: In C++, how is the '+' operator overloaded to concatenate two user-defined String objects?
A) By defining a function named 'add' inside the class
B) By defining an 'operator+' member function that allocates/copies combined character buffers and returns a new String object
C) By redefining the binary representation of '+' in the compiler
D) Operator '+' cannot be overloaded in C++
ANSWER: B
EXPLAIN: Operator overloading in C++ uses the 'operator' keyword followed by the symbol ('operator+'). For string concatenation, it copies the contents of both operands into a destination buffer and returns a new object.
DIFFICULTY: hard
MARKS: 12

Q: What is the fundamental difference between a constructor and a destructor in C++?
A) Constructor initializes object state when instantiated and takes arguments; destructor cleans up resources when out of scope, has a tilde (~) prefix, and takes no arguments
B) Destructor is called first before the constructor
C) Constructor must always return void; destructor returns int
D) A class can have multiple destructors but only one constructor
ANSWER: A
EXPLAIN: Constructors initialize objects and can be overloaded with different parameters. Destructors have the same name preceded by '~', take no parameters, cannot be overloaded, and execute automatically when an object is destroyed.
DIFFICULTY: medium
MARKS: 12

Q: In object-oriented programming, how does 'multilevel inheritance' differ from 'multiple inheritance'?
A) Multilevel has multiple base classes for one derived class; Multiple has a chain of inheritance
B) Multilevel is a linear chain of derivation (Class A -> Class B -> Class C); Multiple inheritance has one derived class inheriting directly from two or more base classes (Class A, Class B -> Class C)
C) Multilevel inheritance is not supported in C++
D) They are identical concepts with different syntax
ANSWER: B
EXPLAIN: Multilevel inheritance represents transitive derivation where Class B inherits from Class A, and Class C inherits from Class B. Multiple inheritance allows a single child class to inherit directly from multiple distinct parent classes simultaneously.
DIFFICULTY: medium
MARKS: 12

Q: Which of the following is a true characteristic of a 'friend function' in C++?
A) It is invoked using the dot operator with an object (e.g. obj.friendFunc())
B) It has access to private and protected members of the class, but is not in the scope of the class and is called like a normal global function
C) Friendship is automatically inherited by derived classes
D) Friendship is mutual by default
ANSWER: B
EXPLAIN: A friend function is not a member function of the class, yet it has special permission to access private and protected data members. It is called as a regular global function, passing objects as arguments.
DIFFICULTY: medium
MARKS: 6

Q: In the C++ I/O stream hierarchy, which class is the common root base class responsible for stream state and formatting?
A) istream
B) ostream
C) ios_base
D) fstream
ANSWER: C
EXPLAIN: 'ios_base' is the topmost root class in the C++ stream hierarchy that defines stream formatting flags, state constants (eofbit, failbit, badbit), and openmode constants.
DIFFICULTY: medium
MARKS: 6

Q: Which OOP principle is demonstrated by declaring data members as 'private' and exposing them only through public getter/setter methods?
A) Polymorphism
B) Inheritance
C) Encapsulation
D) Dynamic Binding
ANSWER: C
EXPLAIN: Encapsulation bundles data and the functions that manipulate that data into a single unit (class) while restricting direct outside access to internal object representation.
DIFFICULTY: easy
MARKS: 6

Q: How is user-defined type conversion from a Class type to a Basic type (e.g., Distance to float) achieved in C++?
A) By defining a parameterized constructor
B) By defining an overloaded casting operator function 'operator float() const' with no return type and no arguments
C) By using dynamic_cast on primitive types
D) By declaring the basic type as a friend of the class
ANSWER: B
EXPLAIN: Conversion from class type to basic type requires an overloaded casting operator ('operator basic_type()'). It must be a class member function, cannot specify a return type, and takes no arguments.
DIFFICULTY: hard
MARKS: 6

Q: What is the primary role of templates in C++?
A) To enforce runtime type checking
B) To enable generic programming by allowing functions and classes to operate with generic type parameters resolved at compile time
C) To manage heap memory allocation
D) To replace inheritance completely
ANSWER: B
EXPLAIN: Templates support generic programming by allowing classes and functions to be defined with type placeholders (template <typename T>), generating type-safe code for any specified type at compile time.
DIFFICULTY: easy
MARKS: 6

Q: What makes a C++ class an 'Abstract Class' that cannot be instantiated on its own?
A) Declaring all member variables as private
B) Containing at least one Pure Virtual Function (declared with '= 0')
C) Having no constructor defined
D) Inheriting from multiple classes
ANSWER: B
EXPLAIN: A class containing at least one pure virtual function (e.g. 'virtual void draw() = 0;') is an abstract class and cannot be instantiated directly; derived classes must implement all pure virtual functions to become concrete.
DIFFICULTY: medium
MARKS: 6

Q: What mechanism is used in C++ to achieve 'Late Binding' (Dynamic Dispatch) at runtime?
A) Function overloading
B) Inline functions
C) Virtual functions invoked via base class pointers or references using a vtable (virtual table)
D) Macros and preprocessor directives
ANSWER: C
EXPLAIN: Late binding delays the binding of a function call to its definition until runtime. C++ achieves this through virtual functions using compiler-generated virtual tables (vtables) and virtual table pointers (vptrs).
DIFFICULTY: medium
MARKS: 6

Q: In C++ exception handling, what is the purpose of the 'throw' keyword?
A) To enclose code that might generate an error
B) To signal the occurrence of an exceptional condition and transfer control to the nearest matching catch block
C) To terminate the entire operating system
D) To ignore runtime errors silently
ANSWER: B
EXPLAIN: The 'throw' keyword creates and dispatches an exception object, transferring execution control from the try block to the matching 'catch' handler up the call stack.
DIFFICULTY: easy
MARKS: 6
