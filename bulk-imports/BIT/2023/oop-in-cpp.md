# PURBANCHAL UNIVERSITY
## 2023
### Bachelor in Information Technology (B.I.T.) / Second Semester / Final
- **Subject Code:** BIT154CO
- **Subject:** Object Oriented Programming in C++ (New)
- **Time:** 03:00 hrs.
- **Full Marks:** 60 | **Pass Marks:** 24

> *Candidates are required to give their answers in their own words as far as practicable.*  
> *Figures in the margin indicate full marks.*

---

## Group A
**Answer TWO questions.** `[2 × 12 = 24]`

---

### Question 1 `[2 + 2 + 8 = 12 Marks]`
**a) What do you mean by operator overloading?** `[2 Marks]`  
**b) How is it done?** `[2 Marks]`  
**c) Write an OOP to overload `+` operator to concatenate two input strings.** `[8 Marks]`

#### Model Solution:
- **Operator Overloading:** Operator overloading is a compile-time polymorphism feature in C++ that allows giving special meanings and custom implementations to existing C++ operators (e.g., `+`, `-`, `*`, `==`, `<<`) when applied to user-defined data types (classes and structs) without altering their original behavior on built-in types.
- **How it is Done:** It is implemented by defining a special member function or a friend function using the keyword `operator` followed by the operator symbol:
  ```cpp
  return_type operator op_symbol (arguments) {
      // body
  }
  ```

#### C++ Program to Overload `+` for String Concatenation:
```cpp
#include <iostream>
#include <cstring>
using namespace std;

class StringConcat {
private:
    char str[100];

public:
    // Default constructor
    StringConcat() {
        str[0] = '\0';
    }

    // Parameterized constructor
    StringConcat(const char s[]) {
        strcpy(str, s);
    }

    // Member function to input string
    void input() {
        cout << "Enter string: ";
        cin >> str;
    }

    // Overloading '+' operator
    StringConcat operator+(const StringConcat &obj) {
        StringConcat temp;
        strcpy(temp.str, str);
        strcat(temp.str, obj.str);
        return temp;
    }

    // Display function
    void display() const {
        cout << str << endl;
    }
};

int main() {
    StringConcat s1, s2, s3;
    cout << "--- String 1 ---" << endl;
    s1.input();
    cout << "--- String 2 ---" << endl;
    s2.input();

    // Invoking overloaded + operator
    s3 = s1 + s2;

    cout << "\nConcatenated Result: ";
    s3.display();

    return 0;
}
```

---

### Question 2 `[4 + 8 = 12 Marks]`
**a) Define constructor and destructor.** `[4 Marks]`  
**b) Create a class 'student' with data members: `roll`, `name`, `age` and `address`. Use constructor to assign values to the data members and write a member function to display the information of students.** `[8 Marks]`

#### Model Solution:
- **Constructor:** A special member function of a class that shares the same name as the class and is automatically invoked whenever an object is instantiated. It has no return type (not even `void`) and initializes object state.
- **Destructor:** A special member function with the same name as the class preceded by a tilde (`~`). It is automatically executed when an object goes out of scope or is deleted, reclaiming allocated resources (memory, file handles).

#### C++ Program:
```cpp
#include <iostream>
#include <string>
using namespace std;

class Student {
private:
    int roll;
    string name;
    int age;
    string address;

public:
    // Parameterized Constructor
    Student(int r, string n, int a, string addr) {
        roll = r;
        name = n;
        age = a;
        address = addr;
        cout << "Constructor called for student: " << name << endl;
    }

    // Member function to display student information
    void display() const {
        cout << "\n----------------------------" << endl;
        cout << "Roll Number : " << roll << endl;
        cout << "Name        : " << name << endl;
        cout << "Age         : " << age << endl;
        cout << "Address     : " << address << endl;
        cout << "----------------------------" << endl;
    }

    // Destructor
    ~Student() {
        cout << "Destructor called for student: " << name << endl;
    }
};

int main() {
    // Instantiating student objects using constructor
    Student s1(101, "Aman Mahato", 20, "Biratnagar, Nepal");
    Student s2(102, "Rohan Shrestha", 21, "Kathmandu, Nepal");

    // Displaying student data
    s1.display();
    s2.display();

    return 0;
}
```

---

### Question 3 `[4 + 8 = 12 Marks]`
**a) What is inheritance and what are its types?** `[4 Marks]`  
**b) Write an OOP to demonstrate the concept of multilevel and multiple inheritance.** `[8 Marks]`

#### Model Solution:
- **Inheritance:** A core OOP principle allowing a new class (derived/child class) to inherit properties and behaviors (data members and member functions) from an existing class (base/parent class), promoting code reusability.
- **Types of Inheritance:**
  1. *Single Inheritance:* One derived class from one base class.
  2. *Multilevel Inheritance:* A class derived from another derived class (A → B → C).
  3. *Multiple Inheritance:* A class derived from two or more base classes (A, B → C).
  4. *Hierarchical Inheritance:* Multiple classes derived from a single base class.
  5. *Hybrid Inheritance:* Combination of two or more inheritance types.

#### C++ Program Demonstrating Multilevel and Multiple Inheritance:
```cpp
#include <iostream>
#include <string>
using namespace std;

// ==========================================
// 1. MULTILEVEL INHERITANCE: Person -> Student -> Result
// ==========================================
class Person {
protected:
    string name;
public:
    void getPerson(string n) { name = n; }
};

class StudentAcademic : public Person {
protected:
    int roll;
public:
    void getRoll(int r) { roll = r; }
};

class Result : public StudentAcademic {
private:
    float marks;
public:
    void getMarks(float m) { marks = m; }
    void displayResult() {
        cout << "[Multilevel Inheritance]" << endl;
        cout << "Name: " << name << ", Roll: " << roll << ", Marks: " << marks << endl;
    }
};

// ==========================================
// 2. MULTIPLE INHERITANCE: Academic + Sports -> FinalScore
// ==========================================
class AcademicScore {
protected:
    int theoryMarks;
public:
    void setTheory(int tm) { theoryMarks = tm; }
};

class SportsScore {
protected:
    int sportsMarks;
public:
    void setSports(int sm) { sportsMarks = sm; }
};

class FinalScore : public AcademicScore, public SportsScore {
public:
    void displayTotal() {
        cout << "\n[Multiple Inheritance]" << endl;
        cout << "Theory Marks: " << theoryMarks << endl;
        cout << "Sports Marks: " << sportsMarks << endl;
        cout << "Grand Total : " << (theoryMarks + sportsMarks) << endl;
    }
};

int main() {
    // Testing Multilevel
    Result res;
    res.getPerson("Aman Mahato");
    res.getRoll(42);
    res.getMarks(88.5);
    res.displayResult();

    // Testing Multiple
    FinalScore finalObj;
    finalObj.setTheory(75);
    finalObj.setSports(18);
    finalObj.displayTotal();

    return 0;
}
```

---

## Group B
**Answer SIX questions.** `[6 × 6 = 36]`

---

### Question 4 `[6 Marks]`
**Define friend function and write its characteristics. Briefly explain why it is useful.**

#### Model Solution:
- **Definition:** A non-member function granted access to the `private` and `protected` members of a class by being declared inside that class with the `friend` keyword.
- **Characteristics:**
  1. Not in the scope of the class it is declared a friend to.
  2. Cannot be called using the object dot operator (`object.friendFunc()` is invalid); invoked like a normal global function.
  3. Usually accepts objects of the class as parameters.
  4. Can be declared in `public`, `private`, or `protected` sections without affecting its access level.
  5. Friendship is not mutual and not inherited.
- **Why it is useful:** Essential for overloading I/O operators (`<<` and `>>`), operating on private members of two different classes simultaneously (e.g., matrix arithmetic), and inter-class bridge utilities.

---

### Question 5 `[6 Marks]`
**What are input and output stream? Explain hierarchy of stream classes.**

#### Model Solution:
- **Streams in C++:** A stream is an abstraction representing a sequence of bytes produced by a source or consumed by a destination.
  - **Input Stream:** Sequence of bytes flowing from an input device/file into main memory (e.g., `cin`, `ifstream`).
  - **Output Stream:** Sequence of bytes flowing from main memory to an output device/file (e.g., `cout`, `ofstream`).
- **Hierarchy of Stream Classes:**
  1. `ios_base`: Root class managing state flags, formatting, and buffer constants.
  2. `ios`: Inherits from `ios_base`; contains pointer to `streambuf` and error-state management.
  3. `istream` & `ostream`: Derived from `ios` via virtual inheritance for formatted input (`>>`) and output (`<<`).
  4. `iostream`: Derived via multiple inheritance from both `istream` and `ostream`.
  5. File Streams (`ifstream`, `ofstream`, `fstream`): Specialized derived classes in `<fstream>` handling persistent disk I/O.

---

### Question 6 `[6 Marks]`
**What is object-oriented programming? Explain its features and characteristics.**

#### Model Solution:
- **Definition:** A programming paradigm based on the concept of "objects" containing data (attributes/fields) and code (methods/functions), organizing software design around data objects rather than functions and logic.
- **Core Features & Characteristics:**
  1. **Encapsulation:** Binding data and methods into a single unit (class) and restricting direct access to internal components.
  2. **Data Abstraction:** Exposing essential background details while hiding low-level implementation complexities.
  3. **Inheritance:** Enabling hierarchical classification and code reuse by deriving new classes from existing ones.
  4. **Polymorphism:** The ability of a message or function call to be processed in different forms (compile-time via overloading and runtime via virtual functions).
  5. **Dynamic Binding:** Resolving function calls at runtime rather than compile-time.
  6. **Message Passing:** Objects communicate with one another by sending and receiving messages.

---

### Question 7 `[6 Marks]`
**What is type conversion? Explain conversion from class to basic type with suitable program.**

#### Model Solution:
- **Type Conversion:** Converting an expression from one data type to another. In C++ OOP, conversions can occur between basic types, from basic to class type (via constructor), from class to basic type (via casting operator function), or between two distinct class types.
- **Class to Basic Type Conversion:** Accomplished using an overloaded casting operator function:
  ```cpp
  operator target_basic_type() const {
      return value;
  }
  ```
  Rules: It must be a class member function, must not specify a return type, and must take no arguments.

#### Program:
```cpp
#include <iostream>
using namespace std;

class Distance {
private:
    float kilometers;

public:
    Distance(float km) : kilometers(km) {}

    // Overloaded casting operator: Class Type -> Basic Type (float/int)
    operator float() const {
        return kilometers * 1000.0f; // converts km to meters
    }
};

int main() {
    Distance d(3.5f); // 3.5 km

    // Implicit/Explicit conversion from class type to basic type (float)
    float meters = d;

    cout << "Distance in meters: " << meters << " m" << endl;
    return 0;
}
```

---

### Question 8 `[6 Marks]`
**How does template support generic programming? Write a program to demonstrate class template.**

#### Model Solution:
- **Generic Programming via Templates:** Templates allow writing functions and classes with generic type parameters (`template <typename T>`). The C++ compiler generates concrete type-specific implementations at compile time during instantiation, eliminating duplicate code for `int`, `float`, `double`, etc.

#### Program Demonstrating Class Template:
```cpp
#include <iostream>
using namespace std;

template <typename T>
class Calculator {
private:
    T num1, num2;

public:
    Calculator(T n1, T n2) : num1(n1), num2(n2) {}

    T add() { return num1 + num2; }
    T multiply() { return num1 * num2; }

    void displayResult() {
        cout << "Numbers: " << num1 << ", " << num2 << endl;
        cout << "Sum: " << add() << " | Product: " << multiply() << endl;
    }
};

int main() {
    cout << "--- Integer Template ---" << endl;
    Calculator<int> intCalc(10, 5);
    intCalc.displayResult();

    cout << "\n--- Float Template ---" << endl;
    Calculator<float> floatCalc(4.5f, 2.2f);
    floatCalc.displayResult();

    return 0;
}
```

---

### Question 9 `[6 Marks]`
**What is the need of virtual and pure virtual function in object-oriented programming? Write a program to explain it.**

#### Model Solution:
- **Virtual Function:** A base class member function declared with `virtual` that can be overridden in a derived class. It ensures dynamic dispatch (late binding) when invoked via a base class pointer/reference.
- **Pure Virtual Function:** A virtual function with no implementation in the base class (`virtual void draw() = 0;`). It makes the class an **Abstract Class**, enforcing derived classes to provide concrete definitions.

#### Program:
```cpp
#include <iostream>
using namespace std;

// Abstract Base Class
class Shape {
public:
    // Pure Virtual Function
    virtual void draw() = 0;

    // Virtual Function with default implementation
    virtual void area() {
        cout << "Generic shape area" << endl;
    }

    virtual ~Shape() {}
};

class Circle : public Shape {
private:
    float radius;
public:
    Circle(float r) : radius(r) {}

    void draw() override {
        cout << "Drawing Circle with radius " << radius << endl;
    }

    void area() override {
        cout << "Area of Circle: " << (3.14159f * radius * radius) << endl;
    }
};

int main() {
    Shape* shapePtr;
    Circle c(5.0f);

    // Base pointer pointing to derived object (Late Binding)
    shapePtr = &c;
    shapePtr->draw();
    shapePtr->area();

    return 0;
}
```

---

### Question 10 `[6 Marks]`
**Compare early binding and late binding. Write a program to create a text file, read the contents of text file, display the contents on screen, and close the file.**

#### Model Solution:
- **Comparison:**
  | Feature | Early Binding (Static Binding) | Late Binding (Dynamic Binding) |
  | :--- | :--- | :--- |
  | **Resolution Time** | Compile-time | Runtime |
  | **Mechanism** | Standard function/operator overloading | Virtual functions via vtable & vptr |
  | **Execution Speed** | Faster (no lookup overhead) | Slightly slower due to indirect pointer lookups |
  | **Flexibility** | Rigid | Highly flexible and extensible |

#### Program for File Creation, Reading, and Display:
```cpp
#include <iostream>
#include <fstream>
#include <string>
using namespace std;

int main() {
    string filename = "sample_exam.txt";

    // 1. Create and Write to file
    ofstream outFile(filename);
    if (!outFile) {
        cerr << "Error creating file!" << endl;
        return 1;
    }
    outFile << "Purbanchal University BIT 2023 Exam\nSubject: Object Oriented Programming in C++\nStatus: Verified.";
    outFile.close(); // Close file
    cout << "File written and closed successfully.\n" << endl;

    // 2. Read contents from file and display
    ifstream inFile(filename);
    if (!inFile) {
        cerr << "Error opening file for reading!" << endl;
        return 1;
    }

    cout << "--- File Contents ---" << endl;
    string line;
    while (getline(inFile, line)) {
        cout << line << endl;
    }

    // 3. Close the file
    inFile.close();
    cout << "\nFile read and closed successfully." << endl;

    return 0;
}
```

---

### Question 11 `[6 Marks]`
**Write short notes on any TWO:** `[2 × 3 = 6 Marks]`

#### (a) Exception Handling
A mechanism to detect, transfer, and handle runtime anomalies (errors) without abnormally crashing the program. Implemented via three keywords:
1. `try`: Encloses code that might throw an exception.
2. `throw`: Signals the occurrence of an error and transfers execution control.
3. `catch`: Catches and resolves the thrown exception based on data type.

#### (b) Enumeration (`enum`)
A user-defined data type consisting of a set of named integral constants. It improves code readability, maintainability, and type safety:
```cpp
enum Day { SUNDAY = 1, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY };
Day today = FRIDAY;
```

#### (c) `new` and `delete` Operator
Dynamic memory management operators in C++ operating on the heap:
- `new`: Allocates memory of specified type, initializes objects by calling constructors, and returns a typed pointer (e.g., `int* p = new int(10);`).
- `delete`: Destructs objects and deallocates heap memory previously allocated with `new` (e.g., `delete p;` or `delete[] arr;`).
