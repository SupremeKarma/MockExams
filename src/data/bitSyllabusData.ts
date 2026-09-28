export interface SubjectInfo {
  code: string;
  name: string;
  credits: number;
  type: "Core" | "Elective" | "Project / Practical";
  description: string;
  keyUnits: string[];
  syllabusUnits?: Array<{ title: string; teachingHours: number; subtopics: string[] }>;
  labWork?: string[];
  referenceBooks?: string[];
}

export interface SemesterSyllabus {
  semester: number;
  totalCredits: number;
  subjects: SubjectInfo[];
}

export const bitSyllabusData: SemesterSyllabus[] = [
  {
    "semester": 1,
    "totalCredits": 17,
    "subjects": [
      {
        "code": "BIT101CO",
        "name": "Fundamentals of Information Technology",
        "credits": 3,
        "type": "Core",
        "description": "Computer components and history, hardware and storage, software and databases, networks and the internet, and emerging IT trends.",
        "keyUnits": [
          "Introduction to Computer",
          "Basic Computer Organization and Computer Peripherals",
          "Computer Storage",
          "Computer Software",
          "Introduction to Database",
          "Networks and Internet",
          "Information Security",
          "Computer Hardware",
          "Technological trends in Information Technology"
        ]
      },
      {
        "code": "BIT102HS",
        "name": "Mathematics-I",
        "credits": 3,
        "type": "Core",
        "description": "Matrix algebra, coordinate systems and geometry, vectors and solid geometry, and applications of differentiation.",
        "keyUnits": [
          "Matrix Algebra",
          "Coordinate Systems",
          "Elementary Coordinate Geometry",
          "Vectors and Solid Geometry",
          "Applications of Differentiation",
          "Applications of the Definite Integral",
          "Functions of Several Variables"
        ]
      },
      {
        "code": "BIT103HS",
        "name": "Technical Communication",
        "credits": 3,
        "type": "Core",
        "description": "Oral presentation skills, intensive and extensive reading, and professional business/technical writing.",
        "keyUnits": [
          "Oral Communication",
          "Reading: Intensive and Extensive",
          "Writing"
        ]
      },
      {
        "code": "BIT104HS",
        "name": "Society and Ethics in IT",
        "credits": 3,
        "type": "Core",
        "description": "Sociology fundamentals, social and cultural change, Nepali society, professional ethics in IT, and emotional intelligence.",
        "keyUnits": [
          "Introduction",
          "Social and Cultural Change",
          "Understanding Development",
          "Process of Transformation",
          "Historical Characteristics of Nepali Society and Culture",
          "Ethical issues in IT",
          "Introduction to Emotional Intelligence",
          "Social Management and Responsibility"
        ]
      },
      {
        "code": "BIT105CO",
        "name": "Computer Programming in C",
        "credits": 3,
        "type": "Core",
        "description": "Procedural programming fundamentals in C — control flow, arrays, functions, pointers, structures, and file handling.",
        "keyUnits": [
          "Problem Solving with Computer",
          "Elements of C",
          "Input and Output",
          "Operators and Expression",
          "Control Statements",
          "Arrays",
          "Functions",
          "Pointers",
          "Structure and Union",
          "Files and File Handling in C",
          "Introduction to Graphics"
        ]
      },
      {
        "code": "BIT106CO",
        "name": "Project-I",
        "credits": 2,
        "type": "Project / Practical",
        "description": "Group software project (2-3 students) built in C, covering requirement gathering through implementation and oral defense — 45 lab hours.",
        "keyUnits": [
          "Information Gathering & Requirements",
          "Algorithms & Flowcharts",
          "Coding & Implementation",
          "Documentation & Final Presentation"
        ]
      }
    ]
  },
  {
    "semester": 2,
    "totalCredits": 17,
    "subjects": [
      {
        "code": "BIT151HS",
        "name": "Mathematics-II",
        "credits": 3,
        "type": "Core",
        "description": "Multiple integrals, ordinary differential equations of the first order, linear differential equations with constant/variable coefficients, Fourier series and integrals, functions of a complex variable, and complex series, residues, and poles.",
        "keyUnits": [
          "Multiple Integrals (Double & Triple Integrals)",
          "Differential Equations of the First Order",
          "Linear Differential Equations with Constant & Variable Coefficients",
          "Fourier Series and Integrals",
          "Functions of a Complex Variable (Analytic Functions & C-R Equations)",
          "Complex Series, Residues and Poles (Contour Integration)"
        ],
        "syllabusUnits": [
          {
            "title": "Multiple Integrals",
            "teachingHours": 6,
            "subtopics": [
              "Double integrals and evaluation in Cartesian coordinates",
              "Evaluation of double integrals in polar coordinates",
              "Change of order of integration in double integrals",
              "Change of variables in double integrals (Jacobian of transformation)",
              "Triple integrals in Cartesian coordinates",
              "Triple integrals in cylindrical and spherical polar coordinates",
              "Applications of multiple integrals: areas of plane regions and volumes of solid bodies",
              "Physical applications: centers of gravity, moments of inertia, and mass of lamina"
            ]
          },
          {
            "title": "Differential Equations of the First Order",
            "teachingHours": 8,
            "subtopics": [
              "Basic concepts, order, degree, and formation of differential equations",
              "Equations of first order and first degree: Variables separable method",
              "Homogeneous and reducible to homogeneous differential equations",
              "Exact differential equations and necessary and sufficient conditions",
              "Integrating factors and rules for finding integrating factors",
              "Linear differential equations of first order (Integrating Factor method)",
              "Bernoulli's equation (equations reducible to linear form)",
              "Equations of the first order but higher degree (solvable for p, solvable for y, solvable for x)",
              "Clairaut's equation and singular solutions",
              "Applications: Orthogonal trajectories, Newton's law of cooling, chemical mixture problems, growth and decay models"
            ]
          },
          {
            "title": "Linear Differential Equations with Constant and Variable Coefficients",
            "teachingHours": 7,
            "subtopics": [
              "Linear differential equations of second and higher orders with constant coefficients",
              "Linear independence and dependence of solutions, Wronskian determinant",
              "Complementary function (CF) for real, distinct, repeated, and complex roots",
              "Particular integral (PI) using operator D = d/dx methods for standard forms: e^{ax}, sin(ax), cos(ax), x^m, and e^{ax}*V(x)",
              "Method of variation of parameters for non-homogeneous linear differential equations",
              "Cauchy-Euler homogeneous linear equations and reducible forms",
              "Legendre's linear differential equations",
              "Simultaneous linear differential equations with constant coefficients"
            ]
          },
          {
            "title": "Fourier Series and Integrals",
            "teachingHours": 10,
            "subtopics": [
              "Periodic functions and Dirichlet's conditions for Fourier expansion",
              "Euler's formulae for Fourier coefficients",
              "Fourier series of functions with period 2*pi and arbitrary period 2*L",
              "Fourier series for even and odd functions (simplification of coefficients)",
              "Half-range Fourier sine series and half-range Fourier cosine series",
              "Parseval's identity and its application in summing infinite series",
              "Complex exponential form of Fourier series",
              "Fourier integral theorem and Fourier integral representations",
              "Fourier cosine and Fourier sine transforms",
              "Complex Fourier transform, inverse transform, and key properties (linearity, shifting, modulation, convolution)"
            ]
          },
          {
            "title": "Functions of a Complex Variable",
            "teachingHours": 8,
            "subtopics": [
              "Review of complex numbers, modulus, argument, and polar representation",
              "Neighborhoods, open and closed sets, domains in the complex plane",
              "Limits, continuity, and differentiability of complex functions",
              "Analytic functions (holomorphic functions) and singular points",
              "Cauchy-Riemann (C-R) equations in Cartesian coordinates (necessary and sufficient conditions)",
              "Cauchy-Riemann equations in polar coordinates",
              "Harmonic functions, harmonic conjugates, and orthogonal families of curves",
              "Construction of analytic functions: Milne-Thomson method",
              "Conformal mapping: Definition, conditions, scale factor, and angle preservation",
              "Bilinear transformation (Mobius transformation), invariant points, cross-ratio preservation"
            ]
          },
          {
            "title": "Complex Series, Residues and Poles",
            "teachingHours": 6,
            "subtopics": [
              "Sequences and series of complex numbers, absolute and uniform convergence",
              "Power series, radius of convergence, and Cauchy-Hadamard theorem",
              "Taylor's theorem and expansion of analytic functions in Taylor series",
              "Laurent's theorem and Laurent series expansion about singular points",
              "Classification of singularities: Isolated singularities, removable singularities, poles, and essential singularities",
              "Zeros of analytic functions and their relationship to poles",
              "Residues: Definition and formulas for computing residues at simple and multiple poles",
              "Cauchy's Residue Theorem and contour integration fundamentals",
              "Evaluation of real definite trigonometric integrals of the type integral from 0 to 2*pi of R(cos theta, sin theta) d theta",
              "Evaluation of improper real integrals of rational functions from -infinity to +infinity using semicircular contours"
            ]
          }
        ],
        "referenceBooks": [
          "Erwin Kreyszig, Advanced Engineering Mathematics (10th ed.), John Wiley & Sons.",
          "H.K. Dass and Er. Rajnish Verma, Higher Engineering Mathematics, S. Chand & Company.",
          "B.S. Grewal, Higher Engineering Mathematics (44th ed.), Khanna Publishers.",
          "R.K. Jain and S.R.K. Iyengar, Advanced Engineering Mathematics, Narosa Publishing House.",
          "James Ward Brown and Ruel V. Churchill, Complex Variables and Applications (9th ed.), McGraw-Hill."
        ]
      },
      {
        "code": "BIT152CO",
        "name": "Digital Logic",
        "credits": 3,
        "type": "Core",
        "description": "Number systems, binary arithmetic and codes, Boolean algebra, logic gates, gate-level minimization (K-Maps, Quine-McCluskey), combinational logic circuits (adders, subtractors, multiplexers, decoders, encoders, ALUs), synchronous and asynchronous sequential logic circuits (flip-flops, registers, counters), and semiconductor memories.",
        "keyUnits": [
          "Number Systems and Codes",
          "Boolean Algebra and Logic Gates",
          "Simplification of Boolean Functions (K-Maps & Tabulation)",
          "Combinational Logic Circuits (Adders, Multiplexers, Decoders, ROM, PLA)",
          "Sequential Logic Circuits (Latches & Flip-Flops)",
          "Registers and Counters (Shift Registers, Ripple & Synchronous Counters)"
        ],
        "syllabusUnits": [
          {
            "title": "Number Systems and Codes",
            "teachingHours": 5,
            "subtopics": [
              "Digital systems overview and analog vs digital signals",
              "Binary, octal, decimal, and hexadecimal number systems and radix conversions",
              "Binary arithmetic: addition, subtraction, unsigned multiplication, and division",
              "Signed binary numbers: Signed magnitude, 1's complement, and 2's complement representations",
              "2's complement arithmetic and hardware overflow detection conditions",
              "Binary codes: BCD (8421), Excess-3, Gray code, and ASCII alphanumeric code",
              "Code conversions: Binary to Gray code and Gray code to Binary conversion",
              "Error detecting and correcting codes: Parity bit generation and Hamming code principles"
            ]
          },
          {
            "title": "Boolean Algebra and Logic Gates",
            "teachingHours": 6,
            "subtopics": [
              "Basic definitions, axiomatic properties, and huntington postulates of Boolean algebra",
              "Fundamental theorems of Boolean algebra: Duality principle, involution, idempotency, and De Morgan's laws",
              "Boolean algebraic functions, truth tables, and algebraic manipulations",
              "Canonical and standard forms: Minterms, Maxterms, Sum of Products (SOP), and Product of Sums (POS)",
              "Digital logic gates: NOT, AND, OR, NAND, NOR, XOR, XNOR truth tables and symbols",
              "Universal logic gates: Implementation of inverter, AND, and OR gates using NAND-only and NOR-only logic",
              "Multi-level gate implementations and conversion to non-degenerate forms (AND-OR, NAND-NAND, NOR-NOR)"
            ]
          },
          {
            "title": "Simplification of Boolean Functions",
            "teachingHours": 6,
            "subtopics": [
              "The Map Method: Two-variable, three-variable, four-variable, and five-variable Karnaugh Maps (K-Maps)",
              "Adjacent squares, grouping rules (pairs, quads, octets), and algebraic minimization",
              "Prime implicants, essential prime implicants, and non-essential prime implicants",
              "Simplification with don't-care (X) conditions for incompletely specified functions",
              "Product of Sums (POS) simplification using K-Maps and duality",
              "Implementation of minimized expressions using two-level NAND and NOR logic",
              "Tabulation method (Quine-McCluskey method) for multi-variable boolean function optimization"
            ]
          },
          {
            "title": "Combinational Logic Circuits",
            "teachingHours": 16,
            "subtopics": [
              "Design procedure for combinational logic circuits: Problem specification, truth table, optimization, and schematic design",
              "Arithmetic circuits: Half adder, Full adder (circuit design and Boolean equations)",
              "Half subtractor and Full subtractor (circuit design using XOR and universal gates)",
              "Binary Parallel Adder (Ripple Carry Adder) and carry propagation delay analysis",
              "Carry Look-Ahead Adder (CLA) design: Carry generate (G) and carry propagate (P) expressions",
              "Binary adder-subtractor circuit using 2's complement and XOR control line",
              "Magnitude comparator: 1-bit and 4-bit binary magnitude comparators",
              "Decoders: 2-to-4 line decoder, 3-to-8 line decoder with enable inputs, and decoder tree expansion",
              "BCD-to-7-segment decoder/driver (common anode and common cathode displays)",
              "Encoders: Octal-to-binary encoder and 4-to-2/8-to-3 priority encoders",
              "Multiplexers (Data Selectors): 2-to-1, 4-to-1, 8-to-1 multiplexers and multiplexer expansion trees",
              "Implementation of arbitrary combinational Boolean logic functions using Multiplexers and Decoders",
              "Demultiplexers (Data Distributors) and decoder-demultiplexer duality",
              "Programmable logic devices: Read-Only Memory (ROM), Programmable Logic Array (PLA), and Programmable Array Logic (PAL)"
            ]
          },
          {
            "title": "Sequential Logic Circuits",
            "teachingHours": 6,
            "subtopics": [
              "Introduction to sequential circuits: Combinational vs sequential circuits, feedback, and memory",
              "Latches: SR latch using NOR gates and NAND gates, bistable multivibrator operation",
              "Clocked / Gated latches: Gated SR latch and Gated D latch (transparent latch)",
              "Flip-Flops: Clocked D flip-flop, Clocked JK flip-flop, and T (Toggle) flip-flop",
              "Race-around condition in level-triggered JK flip-flops and remedy using Master-Slave JK flip-flop architecture",
              "Edge-triggered flip-flops (positive and negative edge triggering)",
              "Characteristic tables, characteristic equations, and excitation tables of SR, D, JK, and T flip-flops",
              "Flip-flop conversion techniques (converting any flip-flop type to another)",
              "Clock skew, propagation delay, setup time, and hold time considerations"
            ]
          },
          {
            "title": "Registers and Counters",
            "teachingHours": 6,
            "subtopics": [
              "Registers: Basic buffer register with parallel load capability",
              "Shift registers: Serial-In Serial-Out (SISO), Serial-In Parallel-Out (SIPO), Parallel-In Serial-Out (PISO), Parallel-In Parallel-Out (PIPO)",
              "Bidirectional shift register with parallel load and Universal Shift Register architecture (IC 74194)",
              "Asynchronous (Ripple) counters: 4-bit binary ripple up-counter, down-counter, and propagation delay limitations",
              "Synchronous counters: 4-bit synchronous binary up-counter and up/down counter design",
              "Modulo-N counters: Decade (BCD) counter (IC 7490) and arbitrary truncated sequence counters",
              "Ring counter and Johnson (twisted ring / Mobius) counter",
              "Design procedure for synchronous sequential circuits: State diagrams, state tables, state reduction, state assignment, and flip-flop excitation derivation"
            ]
          }
        ],
        "labWork": [
          "Verification of truth tables of basic logic gates (AND, OR, NOT, NAND, NOR, XOR, XNOR) using 74-series TTL ICs",
          "Realization of basic gates and arbitrary Boolean expressions using universal gates (NAND and NOR)",
          "Verification of Boolean algebra theorems, involution, absorption, and De Morgan's laws",
          "Design and experimental verification of Half Adder and Full Adder circuits using basic gates and XOR gates",
          "Design and experimental verification of Half Subtractor and Full Subtractor circuits",
          "Implementation of 4-bit Binary Parallel Adder and 4-bit Subtractor using IC 7483 and XOR control gates",
          "Design and verification of 2-to-4 and 3-to-8 line decoders (IC 74138) and BCD-to-7-segment display drivers (IC 7447)",
          "Implementation of combinational Boolean functions using 4-to-1 and 8-to-1 Multiplexers (IC 74151 / IC 74153)",
          "Realization and truth table verification of SR, D, JK, and T flip-flops (IC 7474, IC 7476)",
          "Design and implementation of 4-bit Asynchronous (Ripple) Counter and 4-bit Synchronous Binary Counter using JK flip-flops",
          "Implementation of 4-bit Shift Register (SISO, SIPO, PIPO) and study of Ring counter and Johnson counter"
        ],
        "referenceBooks": [
          "M. Morris Mano and Michael D. Ciletti, Digital Design: With an Introduction to the Verilog HDL (5th ed.), Pearson.",
          "Ronald J. Tocci, Neal S. Widmer, and Gregory L. Moss, Digital Systems: Principles and Applications (12th ed.), Pearson.",
          "Thomas L. Floyd, Digital Fundamentals (11th ed.), Pearson.",
          "Donald P. Leach, Albert Paul Malvino, and Goutam Saha, Digital Principles and Applications (8th ed.), McGraw-Hill.",
          "A. Anand Kumar, Fundamentals of Digital Circuits (4th ed.), PHI Learning."
        ]
      },
      {
        "code": "BIT153HS",
        "name": "Discrete Structure",
        "credits": 3,
        "type": "Core",
        "description": "Set theory, functions, mathematical reasoning and counting techniques, propositional and predicate logic, binary relations and directed graphs, graph theory and trees, partially ordered sets and lattices, algebraic structures, and finite automata, languages, and grammars.",
        "keyUnits": [
          "Set Theory and Matrices",
          "Functions and Counting Techniques",
          "Logic and Mathematical Proofs",
          "Relations and Digraphs (Closures & Warshall's Algorithm)",
          "Graph Theory and Trees (Euler, Hamilton, Shortest Path & MST)",
          "Order Relations and Structures (Posets & Lattices)",
          "Automata, Languages and Grammars (FSM, DFA, NFA & Regular Expressions)"
        ],
        "syllabusUnits": [
          {
            "title": "Set Theory and Matrices",
            "teachingHours": 3,
            "subtopics": [
              "Sets, elements, set-builder notation, empty set, universal set, and power sets",
              "Set operations: union, intersection, set difference, symmetric difference, and complement",
              "Venn diagrams, set identities, algebraic laws of sets, and principle of duality",
              "Computer representation of sets using bit strings and bitwise Boolean operations",
              "Matrices: matrix addition, scalar multiplication, matrix multiplication, and transpose",
              "Zero-one matrices (Boolean matrices): join (OR), meet (AND), and Boolean product (circle dot) of zero-one matrices"
            ]
          },
          {
            "title": "Functions and Counting",
            "teachingHours": 7,
            "subtopics": [
              "Functions: domain, codomain, range, image, and preimage",
              "Classification of functions: Injection (one-to-one), Surjection (onto), and Bijection (one-to-one correspondence)",
              "Inverse functions, composition of functions, and associativity of composition",
              "Special functions: Floor function, ceiling function, and factorial function",
              "Basic counting principles: The Sum Rule, The Product Rule, The Subtraction Rule (Inclusion-Exclusion), and The Division Rule",
              "The Pigeonhole Principle: Classical form, generalized pigeonhole principle, and elegant combinatorial applications",
              "Permutations (ordered arrangements) and Combinations (unordered selections) without and with repetition",
              "Binomial theorem, Pascal's triangle, and algebraic identities involving binomial coefficients"
            ]
          },
          {
            "title": "Logic and Proofs",
            "teachingHours": 6,
            "subtopics": [
              "Propositional logic: propositions, truth values, and logical connectives (conjunction, disjunction, negation, implication, biconditional)",
              "Truth tables for compound propositions, converse, contrapositive, and inverse of conditional statements",
              "Propositional equivalences: Tautology, contradiction, contingency, logical equivalence, and De Morgan's laws for logic",
              "Predicates and quantifiers: Propositional functions, universal quantifier (forall), and existential quantifier (exists)",
              "Nested quantifiers, negation of quantified statements, and scope of quantifiers",
              "Rules of inference for propositional logic: Modus Ponens, Modus Tollens, Hypothetical Syllogism, Disjunctive Syllogism, and Resolution",
              "Methods of mathematical proof: Direct proof, proof by contraposition, proof by contradiction, and counterexamples",
              "The Principle of Mathematical Induction, basis step, inductive step, and strong induction with well-ordering principle"
            ]
          },
          {
            "title": "Relations and Digraphs",
            "teachingHours": 8,
            "subtopics": [
              "Binary relations: Definition, relations from set A to set B, and relations on a set A",
              "Properties of relations: Reflexive, irreflexive, symmetric, antisymmetric, and transitive relations",
              "Combining relations: Union, intersection, difference, and composition of relations",
              "Representation of relations: Matrix of a relation (zero-one matrix) and Directed Graphs (digraphs)",
              "Closures of relations: Reflexive closure, symmetric closure, and transitive closure",
              "Paths in directed graphs and connection to transitive closure",
              "Warshall's algorithm for computing transitive closures with time complexity analysis",
              "Equivalence relations, equivalence classes, congruence modulo m, and partitions of sets"
            ]
          },
          {
            "title": "Graph Theory and Trees",
            "teachingHours": 8,
            "subtopics": [
              "Graphs and graph models: Simple graphs, multigraphs, pseudographs, directed and undirected graphs",
              "Graph terminology: Degrees of vertices, Handshaking Lemma (sum of degrees = 2E), isolated and pendant vertices",
              "Special simple graphs: Complete graphs (K_n), Cycles (C_n), Wheels (W_n), Bipartite graphs, and Complete Bipartite graphs (K_{m,n})",
              "Representations of graphs: Adjacency matrices, incidence matrices, and adjacency lists",
              "Graph isomorphism and invariant properties",
              "Connectivity: Paths, cycles, connected components, cut-vertices, and cut-edges (bridges)",
              "Euler paths and Euler circuits: Euler's Theorem (all even degree vertices) and Fleury's algorithm",
              "Hamilton paths and Hamilton circuits: Dirac's theorem, Ore's theorem, and Traveling Salesperson Problem (TSP)",
              "Planar graphs, Euler's formula for planar graphs (V - E + R = 2), Kuratowski's theorem, and graph coloring (chromatic number)",
              "Trees: Definition, properties, rooted trees, m-ary trees, and binary trees",
              "Tree traversal algorithms: Preorder, Inorder, and Postorder traversals",
              "Spanning trees: Depth-First Search (DFS) and Breadth-First Search (BFS) spanning trees",
              "Minimum Spanning Trees (MST): Kruskal's greedy algorithm and Prim's algorithm with worked examples"
            ]
          },
          {
            "title": "Order Relations and Structures",
            "teachingHours": 6,
            "subtopics": [
              "Partially ordered sets (Posets): Definition (reflexive, antisymmetric, transitive) and formal notation (S, <=)",
              "Comparability and incomparability of poset elements, and totally ordered sets (chains)",
              "Hasse diagrams: Construction rules, removing reflexive loops and transitive edges",
              "Extremal elements in posets: Maximal elements, minimal elements, greatest element (maximum), and least element (minimum)",
              "Upper bounds, lower bounds, Least Upper Bound (LUB / Supremum / Join), and Greatest Lower Bound (GLB / Infimum / Meet)",
              "Well-ordered sets and the well-ordering theorem",
              "Lattices: Definition as posets where every pair has a unique LUB and GLB, and algebraic definition with meet and join operations",
              "Properties of lattices: Idempotent, commutative, associative, absorption, and modular laws",
              "Special lattices: Sublattices, bounded lattices, distributive lattices, and complemented lattices",
              "Boolean algebra as a complemented distributive lattice and isomorphism with switching circuits"
            ]
          },
          {
            "title": "Automata, Languages and Grammars",
            "teachingHours": 7,
            "subtopics": [
              "Formal languages: Alphabets, strings, string length, concatenation, prefix, suffix, and empty string",
              "Operations on languages: Union, intersection, concatenation, and Kleene star closure",
              "Phrase-structure grammars: Terminal symbols, non-terminals, start symbol, and production rules",
              "Chomsky hierarchy of grammars: Type 0 (Unrestricted), Type 1 (Context-sensitive), Type 2 (Context-free), Type 3 (Regular)",
              "Derivations, derivation trees (parse trees), and sentential forms",
              "Finite State Machines (FSM): State diagrams, state transition tables, and machines with output (Moore and Mealy machines)",
              "Deterministic Finite Automata (DFA): Formal 5-tuple definition (Q, Sigma, delta, q_0, F), language accepted by DFA, and string tracing",
              "Non-Deterministic Finite Automata (NFA): Definition, lambda/epsilon-transitions, and language acceptance",
              "Equivalence of DFA and NFA: The Subset Construction (powerset construction) algorithm to convert NFA to DFA",
              "Regular expressions, correspondence with regular languages, and Arden's theorem",
              "Pumping Lemma for regular languages: Statement, proof methodology, and application to prove languages non-regular"
            ]
          }
        ],
        "referenceBooks": [
          "Kenneth H. Rosen, Discrete Mathematics and Its Applications (8th ed.), McGraw-Hill.",
          "Bernard Kolman, Robert C. Busby, and Sharon Cutler Ross, Discrete Mathematical Structures (6th ed.), Pearson.",
          "C.L. Liu and D.P. Mohapatra, Elements of Discrete Mathematics: A Computer Oriented Approach (4th ed.), McGraw-Hill.",
          "John E. Hopcroft, Rajeev Motwani, and Jeffrey D. Ullman, Introduction to Automata Theory, Languages, and Computation (3rd ed.), Pearson.",
          "Peter Linz, An Introduction to Formal Languages and Automata (6th ed.), Jones & Bartlett Learning."
        ]
      },
      {
        "code": "BIT154CO",
        "name": "Object-Oriented Programming in C++",
        "credits": 3,
        "type": "Core",
        "description": "Object-oriented paradigms, classes and objects, constructors and destructors, operator overloading, inheritance and derived classes, virtual functions, abstract classes and runtime polymorphism, templates and generic programming, namespaces, exception handling, and streams and file handling in C++.",
        "keyUnits": [
          "Introduction to Object-Oriented Programming",
          "C++ Programming Concepts and Language Extensions",
          "Functions in C++ (Overloading, Inline & Reference)",
          "Classes and Objects (Encapsulation, Friends & Static)",
          "Constructors and Destructors (Lifecycle & Copy Semantics)",
          "Operator Overloading and Type Conversions",
          "Inheritance: Extending Classes (Diamond Problem & Virtual Base)",
          "Virtual Functions and Polymorphism (vptr, vtable & Abstract Classes)",
          "Streams and File Handling (Binary I/O & File Pointers)",
          "Templates and Namespaces (Generic Programming)",
          "Exception Handling (try, catch & throw)"
        ],
        "syllabusUnits": [
          {
            "title": "Introduction to Object-Oriented Programming",
            "teachingHours": 2,
            "subtopics": [
              "Limitations of procedural programming and structured paradigm pitfalls",
              "Paradigm shift: Procedure-Oriented Programming (POP) vs Object-Oriented Programming (OOP)",
              "Core fundamental principles of OOP: Objects, Classes, Data abstraction, Encapsulation, Inheritance, Polymorphism, Dynamic binding, and Message passing",
              "Software reusability, modularity, maintainability, and enterprise applications of OOP"
            ]
          },
          {
            "title": "C++ Programming Concepts and Language Extensions",
            "teachingHours": 3,
            "subtopics": [
              "Evolution and history of C++ (Bjarne Stroustrup, C with Classes)",
              "Structure of a modern C++ program and compilation pipeline",
              "Tokens, keywords, identifiers, constants, and basic vs user-defined data types",
              "Reference variables: Definition, syntax, and comparison with pointers",
              "Dynamic memory management: new and delete operators vs malloc() and free()",
              "Scope resolution operator (::), member dereferencing operators (.* and ->*)",
              "Type casting operators (static_cast, const_cast, reinterpret_cast, dynamic_cast)",
              "Stream I/O manipulators: endl, setw, setprecision, setfill, and flags in <iomanip>"
            ]
          },
          {
            "title": "Functions in C++",
            "teachingHours": 3,
            "subtopics": [
              "Function prototyping and type-safe linkage in C++",
              "Parameter passing mechanisms: Call by value, Call by pointer, and Call by reference",
              "Return by reference and returning lvalues from functions",
              "Inline functions: Definition, compiler expansion mechanism, benefits, and execution constraints",
              "Default arguments in functions: Rules, declaration syntax, and restrictions",
              "Constant function parameters (const correctness) and const return types",
              "Function overloading: Compile-time polymorphism, resolution rules, and ambiguous calls"
            ]
          },
          {
            "title": "Classes and Objects",
            "teachingHours": 7,
            "subtopics": [
              "Specifying a class: Class declaration, data members, and member functions",
              "Access specifiers: private, protected, and public visibility rules",
              "Defining member functions inside the class (implicit inlining) and outside using scope resolution (::)",
              "Nesting of member functions and private helper functions",
              "Memory allocation for objects: Shared member functions and independent data members",
              "Static data members: Class-wide shared variables, external definition, and initialization",
              "Static member functions: Characteristics, restrictions (cannot access this pointer or non-static members)",
              "Arrays of objects and object pointer indexing",
              "Objects as function arguments: Pass by value and pass by reference",
              "Friend functions: Need, syntax, accessing private members, and bridging disparate classes",
              "Friend classes: Complete encapsulation sharing between cooperating classes",
              "Returning objects from functions and anonymous temporary objects"
            ]
          },
          {
            "title": "Constructor and Destructor",
            "teachingHours": 3,
            "subtopics": [
              "Constructors: Definition, automatic invocation, naming rules, and characteristics",
              "Default constructor: Compiler-synthesized vs user-defined default constructors",
              "Parameterized constructors: Initialization with arguments and explicit calls",
              "Constructor overloading in a class and constructor chaining",
              "Constructors with default arguments and ambiguity resolution",
              "Dynamic initialization of objects through constructors at runtime",
              "Copy constructor: Definition, shallow copy vs deep copy, dynamic memory replication, and pass-by-value invocation",
              "Dynamic constructors using new operator inside constructors",
              "Destructors: Characteristics, no-argument rule, cleanup of dynamically allocated resources",
              "Order of invocation of constructors and destructors for global, local, and dynamic objects"
            ]
          },
          {
            "title": "Operator Overloading",
            "teachingHours": 6,
            "subtopics": [
              "Operator overloading: Concept, syntax, and operator keyword",
              "Rules and limitations: Operators that cannot be overloaded (. , .* , :: , ?: , sizeof)",
              "Overloading unary operators: Unary minus (-), logical NOT (!), and increment/decrement (++ and --)",
              "Distinguishing prefix and postfix increment/decrement operators using dummy int argument",
              "Overloading binary arithmetic operators (+, -, *, /) using member functions",
              "Overloading binary operators using friend functions (handling commutative operands like int + Object)",
              "Overloading stream insertion (<<) and stream extraction (>>) operators for custom classes",
              "Overloading comparison and assignment operators (operator=, deep copy, and self-assignment checks)",
              "Data conversion: Basic type to class type (using single-argument constructor)",
              "Data conversion: Class type to basic type (using custom conversion operator functions)",
              "Data conversion: Class type to another class type (using constructor in destination class or conversion routine in source class)"
            ]
          },
          {
            "title": "Inheritance",
            "teachingHours": 6,
            "subtopics": [
              "Inheritance: Concept, base class, derived class, and software reusability",
              "Access control in derived classes: public, protected, and private derivation modes and member visibility matrix",
              "Forms of inheritance: Single inheritance, Multilevel inheritance, Multiple inheritance, Hierarchical inheritance, and Hybrid inheritance",
              "Multipath inheritance and member duplication ambiguity: The Diamond Problem",
              "Virtual base classes: Syntax, internal shared memory mechanism, and resolving diamond ambiguity",
              "Constructors and destructors in derived classes: Passing arguments from derived to base constructors",
              "Member initialization list (MIL) syntax, order of execution, and member initialization order",
              "Overriding base class member functions and accessing overridden members using scope resolution"
            ]
          },
          {
            "title": "Virtual Functions and Polymorphism",
            "teachingHours": 4,
            "subtopics": [
              "Pointers to objects, object pointer arithmetic, and the this pointer",
              "Pointers to derived classes: Base class pointer pointing to derived class object (Upcasting)",
              "Compile-time polymorphism (early binding) vs Run-time polymorphism (late binding / dynamic dispatch)",
              "Virtual functions: virtual keyword, mechanics of dynamic dispatch, and rules for virtual functions",
              "Virtual method table (vtable) and virtual pointer (vptr) internal implementation mechanism",
              "Pure virtual functions (= 0 syntax) and Abstract Base Classes (interfaces)",
              "Virtual destructors: Preventing partial destruction and memory leaks when deleting derived objects via base pointers"
            ]
          },
          {
            "title": "File Handling",
            "teachingHours": 6,
            "subtopics": [
              "Streams in C++: Standard input/output streams and hierarchy of stream classes in <iostream> and <fstream>",
              "File stream classes: ifstream (input), ofstream (output), and fstream (input/output)",
              "Opening and closing files using constructors and open() member function",
              "File opening modes: ios::in, ios::out, ios::app, ios::ate, ios::binary, ios::trunc, and bitwise OR combining",
              "Detecting end-of-file: eof() function, good(), fail(), and bad() stream status flags",
              "File pointers and manipulators: get pointer (seekg, tellg) and put pointer (seekp, tellp)",
              "Random access in files using seekg/seekp with ios::beg, ios::cur, and ios::end offsets",
              "Formatted text file I/O vs Unformatted binary file I/O",
              "Reading and writing binary records/objects using read() and write() member functions with reinterpret_cast<char*>",
              "Updating, searching, modifying, and deleting records in binary data files"
            ]
          },
          {
            "title": "Templates and Namespaces",
            "teachingHours": 3,
            "subtopics": [
              "Generic programming philosophy and type independence",
              "Function templates: Syntax, template type parameters, and automatic template argument deduction",
              "Function templates with multiple type arguments and non-type template arguments",
              "Overloading function templates with ordinary functions and other templates",
              "Class templates: Definition, syntax, member function definitions outside template class",
              "Class templates with default parameters and multiple parameters",
              "Generic data structures implementation: Generic Stack and Generic Queue using class templates",
              "Namespaces: Resolving identifier collisions, defining namespaces, and the std standard namespace",
              "Accessing namespace members: Explicit qualification (::), using declaration, and using directive",
              "Nested namespaces, aliased namespaces, and unnamed (anonymous) namespaces"
            ]
          },
          {
            "title": "Exception Handling",
            "teachingHours": 2,
            "subtopics": [
              "Traditional error handling vs C++ structured exception handling",
              "Exception handling architecture: try block, throw statement, and catch handler blocks",
              "Control flow in exception handling, stack unwinding, and automatic destruction of local objects",
              "Catching multiple exceptions and catch-all handler (catch(...))",
              "Re-throwing exceptions from catch handlers and nested try-catch blocks",
              "Exception specifications (throw() lists) and modern noexcept specifier",
              "Standard library exceptions hierarchy in <stdexcept> (exception, runtime_error, out_of_range, bad_alloc)"
            ]
          }
        ],
        "labWork": [
          "Programs demonstrating reference variables, function overloading, inline functions, and default arguments",
          "Class creation, private/public members, objects as arguments, and member functions defined inside and outside classes",
          "Implementation of static data members, static member functions, friend functions, and friend classes",
          "Default, parameterized, copy, and dynamic constructors with destructors demonstrating exact lifecycle destruction order",
          "Overloading unary operators (++ prefix/postfix, unary -) and binary arithmetic operators (+, -, *)",
          "Overloading stream insertion (<<) and stream extraction (>>) operators, and custom class-to-basic / basic-to-class type conversions",
          "Implementation of single, multilevel, multiple, and hierarchical inheritance hierarchies",
          "Resolving multipath diamond inheritance ambiguity using virtual base classes",
          "Dynamic polymorphism: Virtual functions, pure virtual functions, and abstract base classes demonstrating vtable dispatch",
          "File stream handling: Writing, reading, searching, and updating class objects in binary files using read() and write()",
          "Function templates and class templates for generic data structures (generic Stack and Queue)",
          "Structured exception handling using try, throw, and catch blocks for divide-by-zero and array bounds checking"
        ],
        "referenceBooks": [
          "E. Balagurusamy, Object Oriented Programming with C++ (8th ed.), McGraw-Hill.",
          "Robert Lafore, Object-Oriented Programming in C++ (4th ed.), Sams Publishing.",
          "Bjarne Stroustrup, The C++ Programming Language (4th ed.), Addison-Wesley.",
          "Herbert Schildt, C++: The Complete Reference (4th ed.), McGraw-Hill.",
          "Stanley B. Lippman, Josee Lajoie, and Barbara E. Moo, C++ Primer (5th ed.), Addison-Wesley."
        ]
      },
      {
        "code": "BIT155MS",
        "name": "Financial Management and Accounting",
        "credits": 3,
        "type": "Core",
        "description": "Principles of financial management, time value of money, capital budgeting and investment appraisal, working capital management, capital structure and leverage, dividend policy, double-entry accounting fundamentals, accounting cycle (journal, ledger, trial balance), financial statements (Trading, Profit & Loss, Balance Sheet), financial ratio analysis, and Cash Flow Statement (Direct Method).",
        "keyUnits": [
          "Nature and Scope of Financial Management",
          "Time Value of Money (Compounding & Discounting)",
          "Capital Budgeting Decisions (NPV, IRR, PBP & PI)",
          "Working Capital Management (Operating Cycle & Cash/Inventory)",
          "Capital Structure and Leverage (DOL, DFL, DCL & Theories)",
          "Dividend Decisions and Corporate Policies",
          "Nature and Scope of Accounting (GAAP & Principles)",
          "The Accounting Process and Cycle (Journal, Ledger & Trial Balance)",
          "Financial Statements (Trading, Profit & Loss Account & Balance Sheet)",
          "Financial Statement Analysis (Ratio Analysis)",
          "Cash Flow Statement (Direct Method - NAS 07 / IAS 7)"
        ],
        "syllabusUnits": [
          {
            "title": "Nature of Financial Management",
            "teachingHours": 3,
            "subtopics": [
              "Meaning, definition, and evolutionary stages of financial management",
              "Key financial decisions: Investment decisions (capital budgeting), Financing decisions (capital structure), and Dividend decisions",
              "Objectives of financial management: Profit maximization vs Wealth maximization (Shareholder wealth maximization)",
              "Agency problem, agency costs, conflicts between shareholders and management, and corporate governance solutions",
              "Role and responsibilities of the Chief Financial Officer (CFO) and finance manager in IT firms"
            ]
          },
          {
            "title": "Time Value of Money",
            "teachingHours": 3,
            "subtopics": [
              "Concept, rationale, and real-world importance of time value of money in capital investment",
              "Compounding techniques: Future value of a single cash flow, continuous compounding, and effective interest rates",
              "Discounting techniques: Present value of a single cash flow and discount factors",
              "Annuities: Future value and present value of Ordinary Annuity vs Annuity Due",
              "Perpetuity: Present value of perpetual cash streams and growing perpetuities",
              "Loan amortization schedules: Equal annual installments, principal reduction, and interest split calculation"
            ]
          },
          {
            "title": "Capital Budgeting",
            "teachingHours": 4,
            "subtopics": [
              "Nature, significance, and process of capital budgeting decisions",
              "Types of investment proposals: Independent, Mutually exclusive, and Replacement projects",
              "Cash flow estimation: Initial cash outlay, operating cash flows after taxes (CFAT), and terminal cash flows",
              "Non-discounted capital appraisal techniques: Payback Period (PBP) and Accounting Rate of Return (ARR)",
              "Discounted capital appraisal techniques: Net Present Value (NPV), Internal Rate of Return (IRR), and Profitability Index (PI)",
              "Comparison of NPV and IRR: Conflicting rankings in mutually exclusive projects and reinvestment rate assumptions"
            ]
          },
          {
            "title": "Working Capital",
            "teachingHours": 5,
            "subtopics": [
              "Concept of working capital: Gross working capital vs Net working capital",
              "Permanent (fixed) working capital vs Temporary (variable) working capital",
              "Operating cycle and Cash Conversion Cycle (CCC) calculation and trade-offs",
              "Working capital financing strategies: Matching (hedging), Conservative, and Aggressive financing approaches",
              "Cash management: Transaction, precautionary, and speculative motives; Baumol's economic order quantity cash model and Miller-Orr model",
              "Receivables management: Credit policy, credit standards, terms of credit, collection procedures, and aging schedule",
              "Inventory management: Motives for holding inventory, Economic Order Quantity (EOQ) formula, reorder level, and ABC analysis"
            ]
          },
          {
            "title": "Capital Structure",
            "teachingHours": 4,
            "subtopics": [
              "Meaning, definition, and optimal capital structure concept",
              "Financial leverage vs Operating leverage: Meaning, mechanics, and risk implications",
              "Degree of Operating Leverage (DOL), Degree of Financial Leverage (DFL), and Degree of Combined Leverage (DCL)",
              "EBIT-EPS analysis and financial indifference point calculation",
              "Capital structure theories: Net Income (NI) approach, Net Operating Income (NOI) approach, and Traditional approach",
              "Modigliani-Miller (MM) hypothesis: Proposition I and II without taxes (arbitrage mechanism) and with corporate taxes",
              "Determinants of capital structure: Business risk, tax shelter, financial distress costs, and agency costs"
            ]
          },
          {
            "title": "Dividends",
            "teachingHours": 4,
            "subtopics": [
              "Meaning and forms of dividend: Cash dividends, stock dividends (bonus shares), and stock splits",
              "Determinants of dividend policy: Legal constraints, liquidity, investment opportunities, and stability",
              "Dividend theories: Walter's model (relationship between internal rate of return r and cost of capital k)",
              "Gordon's dividend capitalization model and constant growth assumptions",
              "Modigliani-Miller (MM) dividend irrelevance hypothesis and arbitrage proof",
              "Practical dividend policies: Constant payout, stable dividend, and residual dividend policy"
            ]
          },
          {
            "title": "Nature of Accounting",
            "teachingHours": 4,
            "subtopics": [
              "Meaning, definition, objectives, and scope of accounting in business",
              "Accounting as an information system for economic decision-making",
              "Users of accounting information: Internal users (management, employees) and external users (investors, creditors, tax authorities)",
              "Branches of accounting: Financial accounting, Cost accounting, and Management accounting",
              "Generally Accepted Accounting Principles (GAAP) and international alignment",
              "Fundamental accounting concepts: Business entity, Money measurement, Going concern, Accounting period, Cost concept, Dual aspect concept",
              "Fundamental accounting conventions: Accrual convention, Matching principle, Realization principle, Consistency, Conservatism (prudence), Materiality, and Full disclosure"
            ]
          },
          {
            "title": "Accounting Process",
            "teachingHours": 6,
            "subtopics": [
              "The accounting cycle: Source documents, journalizing, posting, balancing, trial balance, and financial statement preparation",
              "Double-entry bookkeeping system: Concepts of debit and credit, accounting equation (Assets = Liabilities + Owner's Equity)",
              "Golden rules of debit and credit for Personal accounts, Real accounts, and Nominal accounts",
              "Journal entries: Preparation of simple journal entries and compound journal entries",
              "Sub-division of journals: Cash Book (single, double, and triple column cash book), Purchases Day Book, Sales Day Book",
              "Ledger posting: Ledger account formats (T-account), posting from journal to ledger, and balancing of ledger accounts",
              "Trial Balance: Objectives, format, rules for preparation, and classification of errors (errors revealed vs errors not revealed by trial balance)"
            ]
          },
          {
            "title": "Financial Statement",
            "teachingHours": 5,
            "subtopics": [
              "Meaning, objectives, and importance of final accounts / financial statements",
              "Trading Account: Concept, components (opening stock, purchases, direct expenses, sales, closing stock), and gross profit calculation",
              "Profit and Loss Account: Operating expenses, non-operating income/expenses, operating profit, and net profit calculation",
              "Balance Sheet: Structure, classification, and marshalling of assets (liquidity vs permanence order) and liabilities",
              "Key year-end accounting adjustments: Closing stock, outstanding expenses, prepaid expenses, accrued income, unearned income, depreciation, bad debts, and provision for doubtful debts"
            ]
          },
          {
            "title": "Financial Analysis",
            "teachingHours": 4,
            "subtopics": [
              "Meaning, significance, and tools of financial statement analysis",
              "Comparative financial statements and common-size financial statements (horizontal and vertical analysis)",
              "Ratio Analysis: Classification, standards, and diagnostic utility",
              "Liquidity ratios: Current Ratio and Quick Ratio (Acid-Test Ratio)",
              "Leverage / Solvency ratios: Debt-to-Equity Ratio, Debt-to-Total-Assets Ratio, and Interest Coverage Ratio",
              "Activity / Turnover ratios: Inventory Turnover Ratio, Debtors (Receivables) Turnover Ratio, Average Collection Period, and Total Assets Turnover",
              "Profitability ratios: Gross Profit Margin, Net Profit Margin, Return on Assets (ROA), Return on Equity (ROE), and Earnings Per Share (EPS)"
            ]
          },
          {
            "title": "Cash Flow Statement - Direct Method",
            "teachingHours": 3,
            "subtopics": [
              "Meaning, objectives, and significance of Cash Flow Statement as per Nepal Accounting Standard (NAS 07) / IAS 7",
              "Distinction between Cash Flow Statement, Funds Flow Statement, and Profit & Loss Account",
              "Classification of enterprise cash flows: Operating activities, Investing activities, and Financing activities",
              "Direct Method of preparing Cash Flow Statement: Cash collections from customers, cash paid to suppliers and employees, operating expenses, tax paid",
              "Cash flows from investing activities: Purchase and sale of fixed assets and long-term investments",
              "Cash flows from financing activities: Issue of shares, debentures, loan borrowings, dividend payments, and repayment of debt",
              "Net increase/decrease in cash and cash equivalents and reconciliation with opening and closing cash balances"
            ]
          }
        ],
        "labWork": [
          "Hands-on practical exposure to computerized accounting software (Tally Prime / QuickBooks or Excel financial modeling)",
          "Creation of company profile, configuration of financial year, and creation of Chart of Accounts (groups and ledgers)",
          "Recording business transactions using accounting vouchers: Payment, Receipt, Contra, Sales, Purchase, and Journal vouchers",
          "Generating and interpreting computerized Day Book, General Ledger, Trial Balance, Profit & Loss Account, and Balance Sheet",
          "Building automated financial spreadsheet models in Excel for Time Value of Money calculations (PV, FV, PMT, RATE, NPER)",
          "Capital budgeting investment modeling in Excel: Calculating NPV, IRR, and Profitability Index for competing projects",
          "Automated financial ratio analysis model and comparative balance sheet templates with graphical dashboards"
        ],
        "referenceBooks": [
          "I.M. Pandey, Financial Management (11th ed.), Vikas Publishing House.",
          "James C. Van Horne and John M. Wachowicz, Fundamentals of Financial Management (13th ed.), Pearson.",
          "S.N. Maheshwari, S.K. Maheshwari, and Sharad K. Maheshwari, An Introduction to Accountancy (12th ed.), Vikas Publishing House.",
          "T.S. Grewal, Double Entry Book Keeping: Financial Accounting, Sultan Chand & Sons.",
          "M.Y. Khan and P.K. Jain, Financial Management: Text, Problems and Cases (8th ed.), McGraw-Hill."
        ]
      },
      {
        "code": "BIT156CO",
        "name": "Project-II",
        "credits": 2,
        "type": "Project / Practical",
        "description": "Group software development project (2-3 students) applying Object-Oriented Analysis, Design, and Implementation in C++. Emphasizes practical problem-solving, modular code organization, file-based persistence, exception handling, technical documentation, and oral defense.",
        "keyUnits": [
          "Topic Selection, Feasibility Study & Project Proposal",
          "System Requirements & Object-Oriented Analysis (OOA)",
          "Object-Oriented Design (OOD) & Architecture",
          "System Implementation & Coding in C++",
          "Verification, Testing & Bug Fixing",
          "Project Documentation & Final Viva Voce Defense"
        ],
        "syllabusUnits": [
          {
            "title": "Topic Selection, Feasibility Study & Project Proposal",
            "teachingHours": 6,
            "subtopics": [
              "Software project domain exploration: Academic management systems, banking systems, hospital management, library systems, inventory tracking, airline reservation, or 2D game engines in C++",
              "Team formation (2-3 students per team) and role assignment (lead developer, architect, QA/documentation)",
              "Feasibility analysis: Technical feasibility, operational feasibility, and schedule/economic feasibility",
              "Preparation and submission of formal Project Proposal (problem statement, objectives, scope, methodology, tools, and Gantt chart timeline)",
              "Proposal defense presentation before departmental evaluation committee (10% marks weightage)"
            ]
          },
          {
            "title": "System Requirements & Object-Oriented Analysis (OOA)",
            "teachingHours": 8,
            "subtopics": [
              "Requirement elicitation: Gathering functional requirements and non-functional requirements (performance, reliability, security)",
              "Use case analysis: Identifying system actors, writing structured use case descriptions, and diagramming use case boundaries",
              "Domain modeling: Identifying candidate classes and entity abstraction from requirements",
              "Class Responsibility Collaborator (CRC) modeling",
              "Defining object relationships: Association, Aggregation (has-a weak), Composition (has-a strong), and Generalization/Inheritance (is-a)"
            ]
          },
          {
            "title": "Object-Oriented Design (OOD) & Architecture",
            "teachingHours": 8,
            "subtopics": [
              "System architectural design: Multi-tiered architecture (Presentation/Console UI layer, Business logic layer, Data persistence layer)",
              "Detailed Class Diagram modeling: Class names, attributes with types, member functions with signatures, and visibility specifiers (+, -, #)",
              "Interaction modeling: Sequence diagrams for critical transaction workflows (e.g., authentication, record creation, transaction processing)",
              "Persistent data file architecture: File formats, record structures, index files, header blocks, and data validation rules"
            ]
          },
          {
            "title": "System Implementation & Coding in C++",
            "teachingHours": 12,
            "subtopics": [
              "Project modularization: Structuring headers (.h) and implementation source files (.cpp) with header guards",
              "Clean coding standards: Meaningful naming conventions, commenting guidelines, and indentation",
              "Implementation of class hierarchies: Encapsulation, parameterized constructors, copy constructors, and destructors",
              "Applying operator overloading for domain arithmetic or custom stream formatting (<< and >>)",
              "Dynamic polymorphism implementation: Base class pointers, virtual functions, and abstract base classes",
              "File handling implementation: Persistent binary file I/O using ifstream, ofstream, fstream, and seekg/seekp",
              "Structured exception handling: Custom exception classes, try-catch hierarchies, and graceful error recovery"
            ]
          },
          {
            "title": "Verification, Testing & Bug Fixing",
            "teachingHours": 4,
            "subtopics": [
              "Unit testing of individual class member functions and boundary cases",
              "Integration testing: Verifying interaction between UI layer, logic layer, and file storage layer",
              "Validation testing: Input sanitization, erroneous data rejection, and edge case resilience",
              "Debugging techniques, memory leak detection, dynamic memory verification (proper delete of new objects), and code refactoring"
            ]
          },
          {
            "title": "Project Documentation & Final Viva Voce Defense",
            "teachingHours": 7,
            "subtopics": [
              "Purbanchal University standard project report preparation guidelines and formatting standards",
              "Report structure: Cover page, Certificate of Approval, Recommendation, Acknowledgments, Abstract, Table of Contents, List of Figures/Tables",
              "Core chapters: Introduction, System Analysis, System Design, Implementation & Testing, Conclusion & Recommendations, References, Appendix (code listings & user manual)",
              "Mid-term progress demonstration and evaluation (20% marks weightage)",
              "Pre-final project defense and working prototype verification (30% marks weightage)",
              "Final viva voce defense, live software demonstration, and oral examination by internal and external examiners (40% marks weightage)"
            ]
          }
        ],
        "labWork": [
          "Phase 1: Project proposal preparation, problem specification, and proposal defense (Week 1-3)",
          "Phase 2: Requirement analysis, CRC modeling, and detailed UML class diagram design (Week 4-6)",
          "Phase 3: Core C++ implementation of domain classes, inheritance hierarchies, and virtual functions (Week 7-9)",
          "Phase 4: Binary file persistence, stream operators, and exception handling integration (Week 10-11)",
          "Phase 5: System integration, unit testing, debugging, and user interface refinement (Week 12-13)",
          "Phase 6: Project report drafting, documentation formatting, and pre-final defense (Week 14)",
          "Phase 7: Final software demonstration, viva voce examination, and code defense (Week 15)"
        ],
        "referenceBooks": [
          "Grady Booch, Robert A. Maksimchuk, Michael W. Engle, and Jim Conallen, Object-Oriented Analysis and Design with Applications (3rd ed.), Addison-Wesley.",
          "Bjarne Stroustrup, The C++ Programming Language (4th ed.), Addison-Wesley.",
          "Erich Gamma, Richard Helm, Ralph Johnson, and John Vlissides, Design Patterns: Elements of Reusable Object-Oriented Software, Addison-Wesley.",
          "Robert C. Martin, Clean Code: A Handbook of Agile Software Craftsmanship, Prentice Hall."
        ]
      }
    ]
  },
  {
    "semester": 3,
    "totalCredits": 17,
    "subjects": [
      {
        "code": "BIT201HS",
        "name": "Numerical Methods",
        "credits": 3,
        "type": "Core",
        "description": "Numerical solutions to nonlinear equations, interpolation, linear systems, differentiation/integration, and ODEs.",
        "keyUnits": [
          "Errors in Numerical Computation",
          "Solution of Nonlinear Equations (Bisection, Newton-Raphson)",
          "Interpolation & Least Square Methods",
          "System of Linear Equations (Direct & Indirect Methods)",
          "Numerical Differentiation & Integration",
          "Numerical Solution of ODEs (Euler, Runge-Kutta)"
        ]
      },
      {
        "code": "BIT202CO",
        "name": "Microcontroller",
        "credits": 3,
        "type": "Core",
        "description": "8051 microcontroller architecture, instruction set, I/O and timer programming, interrupts, and peripheral interfacing.",
        "keyUnits": [
          "Introduction to Microcontroller & 8051 Architecture",
          "Instruction Set & Addressing Modes",
          "Stack, I/O Port Interfacing & Programming",
          "Timers and Serial Port",
          "Interrupts and Interfacing Applications"
        ]
      },
      {
        "code": "BIT203CO",
        "name": "Data Structure and Algorithm",
        "credits": 3,
        "type": "Core",
        "description": "Core data structures — stacks, queues, lists, trees, graphs — plus sorting, searching, and algorithm efficiency.",
        "keyUnits": [
          "Introduction & Algorithm Efficiency",
          "Stack & Queue",
          "List and Linked List",
          "Recursion",
          "Trees (BST, AVL, Huffman)",
          "Sorting (Quick, Merge, Heap)",
          "Searching, Hashing & Graphs (DFS, BFS, Dijkstra)"
        ]
      },
      {
        "code": "BIT204CO",
        "name": "Computer Network and Data Communication",
        "credits": 3,
        "type": "Core",
        "description": "Networking fundamentals, the OSI/TCP-IP layered model, data link/network/transport layers, and network security.",
        "keyUnits": [
          "Introduction to Networking & Data Communication",
          "Layered Network Architecture (OSI, TCP/IP)",
          "Data Transmission & Physical Layer",
          "Data Link Control (Error Detection, HDLC)",
          "Network Layer (IP Addressing, Subnetting, Routing)",
          "Transport & Application Layer",
          "Network Security (Cryptography, SSL/TLS, Firewall)"
        ]
      },
      {
        "code": "BIT205CO",
        "name": "System Analysis and Design",
        "credits": 3,
        "type": "Core",
        "description": "SDLC models, process/conceptual modeling with DFDs and ERDs, systems analysis and design, and object-oriented analysis with UML.",
        "keyUnits": [
          "Overview of Systems Analysis & Design (SDLC Models)",
          "Process & Conceptual Modeling (DFD, ERD)",
          "Logic Modeling (Decision Table/Tree)",
          "Systems Analysis (Requirements, Feasibility)",
          "Systems Design & Implementation",
          "Object-Oriented Analysis & Design (UML)"
        ]
      },
      {
        "code": "BIT206CO",
        "name": "Project-III",
        "credits": 2,
        "type": "Project / Practical",
        "description": "Group project (2-3 students) developing a microcontroller (BIT202CO)-based system — 45 lab hours.",
        "keyUnits": [
          "Title Identification & Proposal Writing",
          "Mid-Term Presentation",
          "Pre-Final Submission & Final Presentation"
        ]
      }
    ]
  },
  {
    "semester": 4,
    "totalCredits": 17,
    "subjects": [
      {
        "code": "BIT251HS",
        "name": "Probability and Statistics",
        "credits": 3,
        "type": "Core",
        "description": "Descriptive statistics, probability theory, theoretical distributions, estimation, hypothesis testing, and correlation/regression.",
        "keyUnits": [
          "Nature and scope of statistics",
          "Data and its collection",
          "Classification and tabulation of data",
          "Diagrammatic and graphic presentation",
          "Measures of central tendency",
          "Measures of dispersion",
          "Probability",
          "Theoretical distribution (Binomial, Poisson, Normal, Hyper-geometric)",
          "Estimation theory and testing of hypothesis",
          "Chi-Square distribution",
          "Correlation and regression analysis"
        ]
      },
      {
        "code": "BIT252CO",
        "name": "Computer Organization and Architecture",
        "credits": 3,
        "type": "Core",
        "description": "Computer instruction sets, control unit design, CPU architecture, pipelining, memory organization, and multiprocessors.",
        "keyUnits": [
          "Introduction",
          "Computer organization and design",
          "Control unit design",
          "Central processing unit",
          "Pipeline and vector processing",
          "Computer arithmetic",
          "Input and output organization",
          "Memory organization",
          "Multiprocessor"
        ]
      },
      {
        "code": "BIT253CO",
        "name": "Operating System",
        "credits": 3,
        "type": "Core",
        "description": "Process/thread management, memory management, file systems, I/O, deadlocks, and distributed systems.",
        "keyUnits": [
          "Introduction",
          "Processes and Threads",
          "Memory Management",
          "File Systems",
          "Input/Output",
          "Deadlocks",
          "Real Time System",
          "Distributed System",
          "Case study (UNIX/LINUX/Windows/Android/iOS)"
        ]
      },
      {
        "code": "BIT254CO",
        "name": "Database Management System",
        "credits": 3,
        "type": "Core",
        "description": "DBMS architecture, relational model, SQL, normalization, database security, and transaction/query processing.",
        "keyUnits": [
          "Introduction",
          "Database System Concepts and Architecture (E-R model)",
          "Relational Model",
          "SQL (incl. PL/SQL)",
          "Integrity Constraints",
          "Normalization (1NF-5NF, BCNF)",
          "Database Security",
          "Transaction and Query Processing (ACID, concurrency, WAL)",
          "Backup and Recovery"
        ]
      },
      {
        "code": "BIT255CO",
        "name": "Programming in JAVA",
        "credits": 3,
        "type": "Core",
        "description": "Core Java OOP, GUI programming, file I/O, JDBC, socket programming, and Servlet/JSP.",
        "keyUnits": [
          "Introduction to Java",
          "Applet Programming",
          "GUI Programming (AWT/Swing)",
          "Java IO",
          "JDBC",
          "Socket Programming",
          "Distributed Application (RMI)",
          "Overview of Servlet and JSP"
        ]
      },
      {
        "code": "BIT256CO",
        "name": "Project-IV",
        "credits": 2,
        "type": "Project / Practical",
        "description": "Group application software project (up to 3 students) developed in Java, with proposal, mid-term, and final presentation.",
        "keyUnits": [
          "Title Identification & Proposal Writing",
          "Mid-Term Presentation",
          "Pre-Final Submission & Final Presentation"
        ]
      }
    ]
  },
  {
    "semester": 5,
    "totalCredits": 17,
    "subjects": [
      {
        "code": "BIT301HS",
        "name": "Research Methodology",
        "credits": 3,
        "type": "Core",
        "description": "Scientific inquiry, quantitative and qualitative research designs, hypothesis formulation, and technical writing.",
        "keyUnits": [
          "Foundations of Scientific Research",
          "Literature Review & Research Gap",
          "Research Design & Sampling Strategies",
          "Hypothesis Formulation & Testing",
          "Data Analysis & Interpretation",
          "Report Writing & Publication Ethics"
        ]
      },
      {
        "code": "BIT302CO",
        "name": "Computer Graphics",
        "credits": 3,
        "type": "Core",
        "description": "Rasterization algorithms, 2D/3D transformations, clipping, illumination, and shading.",
        "keyUnits": [
          "Display Devices & Raster Graphics",
          "Line & Circle Drawing Algorithms",
          "2D Transformations & Clipping",
          "3D Transformations & Projections",
          "Visible Surface Detection (Z-Buffer)",
          "Illumination & Shading Models"
        ]
      },
      {
        "code": "BIT303CO",
        "name": "Cryptography and Network Security",
        "credits": 3,
        "type": "Core",
        "description": "Classical and modern ciphers, public key cryptosystems, digital signatures, hash functions, and network security protocols.",
        "keyUnits": [
          "Security Concepts & Attacks",
          "Classical Encryption Techniques",
          "Symmetric Ciphers (DES, AES)",
          "Public Key Cryptography (RSA, ECC)",
          "Hash Functions & Digital Signatures",
          "Network Security Protocols (TLS, IPSec)"
        ]
      },
      {
        "code": "BIT304CO",
        "name": "Web Technology",
        "credits": 3,
        "type": "Core",
        "description": "Web technology fundamentals. Unit contents pending the official Semester V syllabus PDF — the previous entry described a React/Next.js course that is not the PU syllabus.",
        "keyUnits": []
      },
      {
        "code": "BIT305CO",
        "name": "Internet of Things",
        "credits": 3,
        "type": "Core",
        "description": "IoT fundamentals. Unit contents pending the official Semester V syllabus PDF; this subject was missing from the data entirely.",
        "keyUnits": []
      },
      {
        "code": "BIT306CO",
        "name": "Project-V",
        "credits": 2,
        "type": "Project / Practical",
        "description": "Group project carrying the semester's practical assessment. Evaluation criteria pending the official Semester V syllabus PDF.",
        "keyUnits": []
      }
    ]
  },
  {
    "semester": 6,
    "totalCredits": 17,
    "subjects": [
      {
        "code": "BIT351CO",
        "name": "Artificial Intelligence",
        "credits": 3,
        "type": "Core",
        "description": "AI foundations from agents and search through knowledge representation, learning, reasoning, expert systems, neural networks, and NLP.",
        "keyUnits": [
          "Introduction & Applications of AI",
          "Agents: PEAS, Rationality & Agent Types",
          "Uninformed & Informed Search (BFS, DFS, A*, Hill Climbing)",
          "Adversarial Search & Constraint Satisfaction (Minimax, Alpha-Beta, CSP)",
          "Knowledge Representation (Logic, Semantic Nets, FOPL)",
          "Learning Systems (Decision Trees, Reinforcement Learning)",
          "Reasoning (Monotonic, Bayesian, Case-Based)",
          "Expert Systems (Inference Engine, Forward/Backward Chaining)",
          "Artificial Neural Networks (Perceptron, Backpropagation)",
          "Natural Language Processing"
        ]
      },
      {
        "code": "BIT352CO",
        "name": "Management Information System (MIS)",
        "credits": 3,
        "type": "Core",
        "description": "Information systems in global business, IT infrastructure, decision support and executive systems, and the strategic/security role of MIS.",
        "keyUnits": [
          "Information Systems in Global Business Today",
          "Global E-Business & Collaboration",
          "Information Systems Organization & Strategy (Value Chain)",
          "IT Infrastructure & Platform Trends",
          "Business Intelligence Foundations",
          "Decision Support Systems (DSS) & Executive Information Systems (EIS)",
          "Business Information Systems (Marketing, Manufacturing, Finance)",
          "Security of Information Systems",
          "Enterprise Systems, SCM & CRM",
          "Strategic Information Systems & SISP"
        ]
      },
      {
        "code": "BIT353CO",
        "name": "Data Warehousing and Mining",
        "credits": 3,
        "type": "Core",
        "description": "Data warehouse architecture and OLAP, plus core data mining techniques — association rule mining, classification, and cluster analysis.",
        "keyUnits": [
          "Introduction to Data Mining & Data Warehousing",
          "Data Warehouse & OLAP Technology, KDD",
          "Mining Association Rules (Apriori, Market Basket Analysis)",
          "Multidimensional & Multilevel Association Rules",
          "Classification & Prediction (Decision Trees, Bayesian, k-NN)",
          "Cluster Analysis (k-Means, k-Medoids, Hierarchical Methods)"
        ]
      },
      {
        "code": "BIT354CO",
        "name": "Simulation and Modeling",
        "credits": 3,
        "type": "Core",
        "description": "Simulation concepts and system types, the Monte Carlo method, random number generation and randomness testing, and analyzing simulation output.",
        "keyUnits": [
          "Concepts of Simulation (Types, Advantages, Limitations)",
          "Monte Carlo Method",
          "Simulation of Continuous Systems (Queuing, Markov Chains)",
          "Random Numbers: Generation & Testing (Chi-Square, Poker Test)",
          "Analysis of Simulation Output & Replication of Runs",
          "Simulation Languages & Discrete/Continuous Modeling"
        ]
      },
      {
        "code": "BIT355CO",
        "name": "Software Engineering",
        "credits": 3,
        "type": "Core",
        "description": "The software engineering lifecycle — process models, project management, requirements, design, testing, and quality metrics.",
        "keyUnits": [
          "Introduction to Software Engineering",
          "Process Models (Waterfall, Prototyping, RAD, Spiral, Agile)",
          "Software Project Management (4Ps, COCOMO, Risk, Scheduling)",
          "Software Requirements & Specification",
          "Software Design (Principles, Architecture Types)",
          "Software Testing (Black-Box, White-Box, V&V)",
          "Metrics for Process & Product Quality (ISO 9000)",
          "SE Trends: Agile, XP, Cloud Computing, SOA"
        ]
      },
      {
        "code": "BIT356CO",
        "name": "Project-VI",
        "credits": 2,
        "type": "Project / Practical",
        "description": "Group web-based application project (up to 3 students) built with server-side scripting, on a topic related to Artificial Intelligence or Data Mining — 45 lab hours, evaluated across title, mid-term, and pre-final presentations.",
        "keyUnits": [
          "Title Presentation",
          "Mid-Term Presentation",
          "Server-Side Web Application Development",
          "AI or Data Mining-Related Project Topic",
          "Pre-Final Submission & Presentation"
        ]
      }
    ]
  },
  {
    "semester": 7,
    "totalCredits": 15,
    "subjects": [
      {
        "code": "BIT401CO",
        "name": "Network Programming",
        "credits": 3,
        "type": "Core",
        "description": "Client-server socket programming — TCP/UDP sockets, I/O multiplexing, broadcast/multicast, and raw sockets in C/Unix.",
        "keyUnits": [
          "Introduction to Network Programming (Client/Server Model)",
          "Elementary Operating System Calls (fork, exec, wait, IPC)",
          "TCP/UDP Transport Layer Protocols",
          "Elementary Socket Calls (socket, bind, connect, accept)",
          "Elementary TCP-UDP Socket Calls (sendto, recvfrom)",
          "I/O Multiplexing (select, poll, shutdown)",
          "Socket Options (getsockopt, setsockopt, SO_REUSEADDR)",
          "Name and Address Conversion (DNS, gethostbyname, getaddrinfo)",
          "Unix Domain Protocols (socketpair, stream/datagram)",
          "Daemon Processes and inetd Superserver",
          "Broadcast and Multicast",
          "IP Layers and Raw Sockets (ping implementation)"
        ],
        "syllabusUnits": [
          {
            "title": "Introduction to Network Programming",
            "teachingHours": 5,
            "subtopics": [
              "Introduction to computer network: client/server model",
              "Protocol Suite (ISO/OSI, TCP/IP)",
              "Unix Standards (POSIX, OpenGroup, IETF)",
              "Network Utilities (telnet, route, ipconfig, ifconfig, ping, netstat, and ftp)",
              "Introduction to programming: wrapper functions, header files, libraries and ports numbers, IP address",
              "Iterative server, concurrent server, networked servers"
            ]
          },
          {
            "title": "Elementary Operating System Calls",
            "teachingHours": 6,
            "subtopics": [
              "System call, program, thread, process, Kernel",
              "fork(), exec() and its family, waitpid(), wait()",
              "pipe(), Fifo(), signals (SIGCHLD, SIGINT, SIGIO)",
              "IPC Names, creating and opening IPC channels, IPC permissions"
            ]
          },
          {
            "title": "TCP/UDP Transport Layer Protocols",
            "teachingHours": 4,
            "subtopics": [
              "TCP (Transmission Control Protocol): features, connection establishment and termination, states in communication (LISTEN, TIME_WAIT, ESTABLISHED, BLOCKED)",
              "UDP (User Datagram Protocol): features, uses, comparison with TCP",
              "TCP and UDP buffer sizes and limitations",
              "SCTP overview"
            ]
          },
          {
            "title": "Elementary Socket Calls",
            "teachingHours": 5,
            "subtopics": [
              "Socket address structure: for IPV4, IPV6, UNIX domain socket and generic socket address structure, value-result argument",
              "Byte ordering and manipulating function: htonl(), htons(), ntohl(), ntohs(), inet_addr(), inet_aton(), inet_ntoa(), inet_pton()"
            ]
          },
          {
            "title": "Elementary TCP-UDP Socket",
            "teachingHours": 6,
            "subtopics": [
              "Socket(), connect(), bind(), listen(), accept(), read(), write(), close()",
              "sendto(), recvfrom()"
            ]
          },
          {
            "title": "I/O Multiplexing",
            "teachingHours": 4,
            "subtopics": [
              "Introduction, I/O models: blocking I/O, non-blocking I/O, I/O multiplexing, signal driven I/O (SIGIO) and asynchronous I/O model",
              "Select(), poll(), shutdown()"
            ]
          },
          {
            "title": "Socket Options",
            "teachingHours": 2,
            "subtopics": [
              "Getsockopt() and setsockopt() functions",
              "IPV4, IPV6, TCP socket options (SO_REUSEADDR, TCP_NODELAY)"
            ]
          },
          {
            "title": "Name and Address Conversion",
            "teachingHours": 2,
            "subtopics": [
              "Domain Name System, gethostbyname(), gethostbyaddr(), uname(), getservbyname() and getservbyport()",
              "gethostname() functions, socket timeouts"
            ]
          },
          {
            "title": "Unix Domain Protocol",
            "teachingHours": 3,
            "subtopics": [
              "Introduction, Unix domain socket address structure",
              "socketpair function",
              "Unix domain stream client-server, UNIX domain datagram client/server"
            ]
          },
          {
            "title": "Daemon Processes, Inetd Superservers",
            "teachingHours": 2,
            "subtopics": [
              "Introduction, Syslog facility (syslog function)",
              "daemon_init function",
              "inetd daemon configuration"
            ]
          },
          {
            "title": "Broadcast and Multicast",
            "teachingHours": 3,
            "subtopics": [
              "Introduction, Broadcast and multicast addresses",
              "Comparison between broadcast, unicast and multicast socket options",
              "Unicast versus Broadcast, multicast versus broadcast on LAN"
            ]
          },
          {
            "title": "IP Layers and Raw Socket",
            "teachingHours": 3,
            "subtopics": [
              "Introduction, raw socket creation",
              "Input and output packet processing (ping example implementation)"
            ]
          }
        ],
        "labWork": [
          "Linux command line utilities and shell programming",
          "IPC mechanisms: Pipe(), Fifo(), MessageQueue",
          "TCP, UDP and Unix Domain socket client server programs",
          "TCP echo server and client program",
          "Fork() system call process management",
          "Wait() and waitpid() system call handling",
          "Uname(), gethostbyaddr(), gethostbyname(), gethostname() system calls",
          "Shell programming for network diagnostics"
        ],
        "referenceBooks": [
          "Stevens, W. R., Unix Network Programming, Vol 1: Networking APIs - Sockets and XTI, Prentice Hall.",
          "Stevens, W. R., Unix Network Programming, Vol 2: Interprocess Communications, Prentice Hall.",
          "Comer, Douglas E., Internetworking with TCP/IP: Principles, Protocols, and Architecture, Vol 3, Prentice Hall."
        ]
      },
      {
        "code": "BIT402CO",
        "name": "Digital Governance",
        "credits": 3,
        "type": "Core",
        "description": "e-Government implementation and policy, ICT infrastructure, security, digital democracy, and case studies including Nepal's GIDC.",
        "keyUnits": [
          "Introduction to e-Government and e-Governance",
          "Public-Private Partnership for e-Government (PPP Models)",
          "ICT Infrastructure for e-Government (GIDC & Cloud)",
          "e-Government Readiness Framework",
          "Security for e-Government (Security Standards)",
          "Implementing e-Government (System Life Cycle)",
          "From Representative to Digital Democracy",
          "Citizen-Centric Remote Online Digital Governance (CRM)",
          "Applying Artificial Intelligence to Improve Performance",
          "Case Studies: Nepal (GIDC, Cyber Law), India, and Global Systems"
        ],
        "syllabusUnits": [
          {
            "title": "Introduction to e-Government and e-Governance",
            "teachingHours": 3,
            "subtopics": [
              "1.1. e-Government and e-Governance concepts and distinctions",
              "1.2. e-Government as information system",
              "1.3. Benefits of e-Government",
              "1.4. e-Government stages of development",
              "1.5. Online service delivery and electronic service delivery"
            ]
          },
          {
            "title": "Public-Private Partnership for e-Government",
            "teachingHours": 4,
            "subtopics": [
              "2.1. G2C Project models",
              "2.2. G2B Project models",
              "2.3. PPP Forms: JV Model, BOO Model, BOOT model, ASP model",
              "2.4. Issues in PPP for e-Government",
              "2.5. Citizen-centric approach to e-Government"
            ]
          },
          {
            "title": "ICT Infrastructure for e-Government",
            "teachingHours": 3,
            "subtopics": [
              "3.1. Network infrastructure",
              "3.2. Computing Infrastructure",
              "3.3. Government Data centers",
              "3.4. E-Government enterprise architecture",
              "3.5. Interoperability framework"
            ]
          },
          {
            "title": "e-Government Readiness",
            "teachingHours": 4,
            "subtopics": [
              "4.1. e-Readiness framework",
              "4.2. Steps to e-Government readiness",
              "4.3. Issues and barriers in e-Government readiness"
            ]
          },
          {
            "title": "Security for e-Government",
            "teachingHours": 5,
            "subtopics": [
              "5.1. Challenges of e-government security",
              "5.2. An approach to security for e-Government",
              "5.3. Security management model",
              "5.4. e-Government security architecture",
              "5.5. Security standards and compliance"
            ]
          },
          {
            "title": "Implementing e-Government",
            "teachingHours": 5,
            "subtopics": [
              "6.1. e-Government system life cycle and project assessment",
              "6.2. Analysis of current reality and gap analysis",
              "6.3. Design of new e-Government system",
              "6.4. e-Government risk assessment and mitigation",
              "6.5. e-Government system construction",
              "6.6. Implementation and beyond",
              "6.7. Developing e-Government hybrids"
            ]
          },
          {
            "title": "From Representative to Digital Democracy",
            "teachingHours": 3,
            "subtopics": [
              "7.1. Using Internet to increase Political Participation",
              "7.2. Online Participation and Political Organization",
              "7.3. Electronic voting and elections",
              "7.4. Protecting democratic institutions"
            ]
          },
          {
            "title": "Citizen-Centric Remote Online Digital Governance",
            "teachingHours": 3,
            "subtopics": [
              "8.1. Citizen Relationship Management (CRM) and Digital Governance",
              "8.2. Responding to citizens online",
              "8.3. From Electronic communication to Modernizing Government"
            ]
          },
          {
            "title": "Applying Artificial Intelligence to Improve Performance and Results",
            "teachingHours": 4,
            "subtopics": [
              "9.1. Assessing the Impact of Artificial Intelligence on Public Sector Performance",
              "9.2. Artificial Intelligence, Bias, Facial, and Voice recognition in public service"
            ]
          },
          {
            "title": "Case Studies and Applications of e-Government System",
            "teachingHours": 10,
            "subtopics": [
              "10.1. Nepal: Cyber Laws, ICT development project, Government Integrated Data Center (GIDC), e-Government master plan, Human resource management software",
              "10.2. India: Community information centers, e-Procurement in the government of Andhra Pradesh, e-Seva / e-Suvida",
              "10.3. Other Countries: E-Government development in South Korea, China, Brazil, Sri Lanka, Singapore, and USA"
            ]
          }
        ],
        "referenceBooks": [
          "Heeks, Richard, Implementing & Managing e-Government: An International Text, SAGE Publications.",
          "Prabhu, C. S. R., e-Governance: Concepts & Case Studies, Prentice Hall of India.",
          "Satyanarayana, J., e-Government: Technology and Management, Prentice Hall of India.",
          "Milakovich, Michael E., Digital Governance: Applying Advanced Technologies to Improve Public Services, Routledge Taylor & Francis Group."
        ]
      },
      {
        "code": "BIT421CO",
        "name": "Machine Learning (Track A)",
        "credits": 3,
        "type": "Elective",
        "description": "Theoretical concepts and practical implementations of supervised regression/classification, decision trees, model tuning, text mining, and deep neural networks in Python.",
        "keyUnits": [
          "Introduction to Machine Learning (Components & Frameworks)",
          "Supervised Learning: Regression, Classification, Decision Trees",
          "Unsupervised Learning (k-means, k-modes)",
          "Model Diagnosis and Tuning (Bias/Variance, Cross-Validation)",
          "Text Mining (Preprocessing, TF-IDF, Exploration)",
          "Deep Learning (Feedforward, CNNs, RNNs)"
        ],
        "syllabusUnits": [
          {
            "title": "Introduction to Machine Learning",
            "teachingHours": 5,
            "subtopics": [
              "Components of learning, Learning Models: Geometric, Probabilistic, Logical models",
              "Introduction to machine learning frameworks: Supervised, Unsupervised, Reinforcement Learning"
            ]
          },
          {
            "title": "Supervised Learning",
            "teachingHours": 12,
            "subtopics": [
              "Linear regression, Polynomial regression",
              "Logistic regression, Support Vector Machines (SVM)",
              "k-NN (k-Nearest Neighbors)",
              "Decision tree: Representation, ID3, C4.5, Inductive bias"
            ]
          },
          {
            "title": "Unsupervised Learning",
            "teachingHours": 4,
            "subtopics": [
              "Clustering fundamentals and similarity metrics",
              "k-means clustering algorithm and variants",
              "k-modes algorithm for categorical data"
            ]
          },
          {
            "title": "Model Diagnosis and Tuning",
            "teachingHours": 7,
            "subtopics": [
              "Evaluating a hypothesis: Bias-variance tradeoff",
              "Model selection: k-fold Cross-validation",
              "Ensemble methods: Random forests and bagging"
            ]
          },
          {
            "title": "Text Mining",
            "teachingHours": 6,
            "subtopics": [
              "Text preprocessing: Tokenization, Stopwords removal, Stemming, Lemmatization",
              "Feature representation: Bag of Words, TF-IDF",
              "Text exploration and classification"
            ]
          },
          {
            "title": "Deep Learning",
            "teachingHours": 11,
            "subtopics": [
              "Feedforward neural networks, Perceptron and Multilayer Perceptron",
              "Cost functions, Gradient descent and Backpropagation training",
              "Convolutional Neural Networks (CNNs)",
              "Recurrent Neural Networks (RNNs)"
            ]
          }
        ],
        "labWork": [
          "Data preprocessing, transformation, and exploration using Python (NumPy, Pandas, Matplotlib, Seaborn)",
          "Implementation of Linear and Polynomial Regression with Scikit-Learn",
          "Binary and multiclass Logistic Regression classification",
          "Decision Tree implementation using ID3/C4.5 and Scikit-Learn",
          "Support Vector Machine (SVM) classification with kernel tuning",
          "k-Nearest Neighbor (k-NN) classification and hyperparameter tuning",
          "k-means and hierarchical clustering algorithms implementation",
          "Text classification using TF-IDF and Naive Bayes",
          "Model evaluation using k-fold cross validation, precision, recall, and ROC-AUC metrics",
          "Building a multi-layer feedforward neural network with Backpropagation in Python / PyTorch / TensorFlow"
        ],
        "referenceBooks": [
          "Mitchell, Tom M., Machine Learning, McGraw-Hill Education.",
          "Alpaydin, Ethem, Introduction to Machine Learning, MIT Press.",
          "Goodfellow, Ian, Yoshua Bengio, and Aaron Courville, Deep Learning, MIT Press.",
          "Muller, Andreas C. and Sarah Guido, Introduction to Machine Learning with Python: A Guide for Data Scientists, O'Reilly Media."
        ]
      },
      {
        "code": "BIT422CO",
        "name": "Business Intelligence and Data Science (Track A)",
        "credits": 3,
        "type": "Elective",
        "description": "Foundations of business intelligence, data warehousing, visual analytics with Tableau/Power BI, WEKA data mining, text/web analytics, and big data architectures.",
        "keyUnits": [
          "Overview of Business Intelligence & Decision Support",
          "Data Warehousing (Architectures, ETL Processes, Real-Time DW)",
          "Business Reporting & Visual Analytics (Tableau, Power BI)",
          "Data Mining Concepts & Applications (WEKA)",
          "Text and Web Analytics (NLP, Sentiment Analysis)",
          "Big Data Analytics & Stream Processing",
          "Business Analytics Emerging Trends and Ethics"
        ],
        "syllabusUnits": [
          {
            "title": "Overview of Business Intelligence & Decision Support",
            "teachingHours": 6,
            "subtopics": [
              "Decision support systems (DSS) concept and evolution",
              "Business intelligence definitions, frameworks, and architecture",
              "OLTP vs OLAP transaction vs analytical processing models",
              "Business analytics overview: descriptive, predictive, prescriptive"
            ]
          },
          {
            "title": "Data Warehousing and ETL Processes",
            "teachingHours": 6,
            "subtopics": [
              "Data warehousing definitions, characteristics, and architectures",
              "Multidimensional data modeling: Star, Snowflake, and Fact Constellation schemas",
              "Data extraction, transformation, and loading (ETL) pipeline architecture",
              "Real-time data warehousing and operational data stores (ODS)"
            ]
          },
          {
            "title": "Business Reporting & Visual Analytics",
            "teachingHours": 6,
            "subtopics": [
              "Business reporting definitions, metrics, and report types",
              "Information visualization and visual analytics principles",
              "Performance dashboards, scorecards, and Balanced Scorecard methodology",
              "Visual analytics tools: Tableau, Microsoft Power BI, and interactive dashboards"
            ]
          },
          {
            "title": "Data Mining Concepts & Applications",
            "teachingHours": 9,
            "subtopics": [
              "Data mining definitions, process models (CRISP-DM), and taxonomy",
              "Association rule mining: Apriori algorithm and FP-Growth",
              "Classification and clustering methods in data mining",
              "Data mining software and open source toolkits: WEKA, RapidMiner"
            ]
          },
          {
            "title": "Text and Web Analytics",
            "teachingHours": 6,
            "subtopics": [
              "Text analytics and Natural Language Processing for business insights",
              "Sentiment analysis and opinion mining architectures",
              "Web mining taxonomy: Web content mining, Web structure mining, and Web usage mining",
              "Social media analytics and network metrics"
            ]
          },
          {
            "title": "Big Data Analytics & Stream Processing",
            "teachingHours": 5,
            "subtopics": [
              "Big Data definition, V-characteristics (Volume, Velocity, Variety, Veracity, Value)",
              "Hadoop ecosystem and MapReduce processing framework",
              "NoSQL database architectures for analytical workloads",
              "Real-time stream analytics and in-memory computing architectures"
            ]
          },
          {
            "title": "Business Analytics Emerging Trends and Ethics",
            "teachingHours": 7,
            "subtopics": [
              "Location-based analytics and geospatial business intelligence",
              "Automated decision making and recommendation systems",
              "Data governance, privacy laws (GDPR), and ethical considerations in analytics",
              "Cloud-based BI and analytics service models"
            ]
          }
        ],
        "labWork": [
          "Multidimensional schema design (Star and Snowflake) using SQL in PostgreSQL / MySQL",
          "ETL pipeline construction for heterogeneous data sources",
          "Building interactive executive dashboards using Tableau / Power BI",
          "Association rule mining experiments in WEKA using Apriori algorithm",
          "Classification experiments (J48 Decision Trees, Naive Bayes) using WEKA",
          "Text preprocessing and sentiment analysis using Python NLP libraries",
          "Web scraping and log file analysis for web usage mining"
        ],
        "referenceBooks": [
          "Sharda, Ramesh, Dursun Delen, and Efraim Turban, Business Intelligence, Analytics, and Data Science: A Managerial Perspective, Pearson.",
          "Inmon, W. H., Building the Data Warehouse, John Wiley & Sons.",
          "Han, Jiawei, Micheline Kamber, and Jian Pei, Data Mining: Concepts and Techniques, Morgan Kaufmann.",
          "Kimball, Ralph and Margy Ross, The Data Warehouse Toolkit: The Definitive Guide to Dimensional Modeling, Wiley."
        ]
      },
      {
        "code": "BIT423CO",
        "name": "Deep Learning (Track A)",
        "credits": 3,
        "type": "Elective",
        "description": "Neural network architectures — multilayer perceptrons, deep CNNs, RNNs, LSTMs, generative belief nets, and TensorFlow vision/speech applications.",
        "keyUnits": [
          "Basics of Artificial Neural Networks (ANN Models)",
          "Feedforward Neural Networks & Backpropagation Learning",
          "Deep Neural Networks (Optimization: Adam, Regularization)",
          "Convolutional Neural Networks (LeNet, AlexNet, VGG)",
          "Recurrent Neural Networks (LSTM, GRU, Sequence Modeling)",
          "Generative Models (RBMs, Deep Belief Nets)",
          "Applications in Vision, Speech and NLP"
        ],
        "syllabusUnits": [
          {
            "title": "Basics of Artificial Neural Networks",
            "teachingHours": 4,
            "subtopics": [
              "Biological neuron inspiration and artificial neuron models",
              "Perceptron model and perceptron learning algorithm",
              "Linear separability and the XOR problem",
              "Activation functions: Sigmoid, Tanh, ReLU, Leaky ReLU, Softmax"
            ]
          },
          {
            "title": "Feedforward Neural Networks and Backpropagation",
            "teachingHours": 5,
            "subtopics": [
              "Multi-layer perceptron (MLP) architecture",
              "Forward propagation matrix formulations",
              "Loss functions: Mean Squared Error, Cross-Entropy loss",
              "Backpropagation algorithm, chain rule derivations, and gradient descent optimization"
            ]
          },
          {
            "title": "Deep Neural Networks and Optimization",
            "teachingHours": 8,
            "subtopics": [
              "Vanishing and exploding gradient problems",
              "Optimization algorithms: Momentum, RMSProp, Adam, AdaGrad",
              "Regularization techniques: L1/L2 weight decay, Dropout, Early Stopping",
              "Batch Normalization, Layer Normalization, and hyperparameter tuning"
            ]
          },
          {
            "title": "Convolutional Neural Networks (CNNs)",
            "teachingHours": 8,
            "subtopics": [
              "Convolution operation, kernels, stride, padding, and feature maps",
              "Pooling layers: Max pooling, Average pooling",
              "CNN architectures: LeNet-5, AlexNet, VGGNet, ResNet, Inception",
              "Transfer learning and fine-tuning pretrained CNNs for image classification"
            ]
          },
          {
            "title": "Recurrent Neural Networks (RNNs)",
            "teachingHours": 7,
            "subtopics": [
              "Sequential data modeling and recurrent neuron architecture",
              "Backpropagation Through Time (BPTT)",
              "Long Short-Term Memory (LSTM) cell architecture and gates",
              "Gated Recurrent Unit (GRU) architecture",
              "Bidirectional RNNs and sequence-to-sequence architectures"
            ]
          },
          {
            "title": "Generative Models",
            "teachingHours": 7,
            "subtopics": [
              "Energy-based models and Restricted Boltzmann Machines (RBM)",
              "Deep Belief Networks (DBN) training and contrastive divergence",
              "Autoencoders and Variational Autoencoders (VAE)",
              "Generative Adversarial Networks (GAN) generator and discriminator dynamics"
            ]
          },
          {
            "title": "Applications in Vision, Speech and NLP",
            "teachingHours": 6,
            "subtopics": [
              "Object detection and image segmentation (YOLO, Mask R-CNN concepts)",
              "Acoustic modeling and speech recognition overview",
              "Word embeddings (Word2Vec, GloVe) and Transformer attention mechanisms in NLP"
            ]
          }
        ],
        "labWork": [
          "Environment setup with Python, PyTorch / TensorFlow, and CUDA GPU acceleration",
          "Building a custom MLP from scratch using NumPy with backpropagation",
          "Training deep feedforward networks with PyTorch/Keras on MNIST / CIFAR-10",
          "Implementing CNN architectures for image classification and feature visualization",
          "Applying Transfer Learning using pretrained ResNet/VGG on custom image datasets",
          "Implementing LSTM and GRU networks for sequence classification / time series forecasting",
          "Implementing an Autoencoder for image denoising and dimensionality reduction",
          "Training a simple Generative Adversarial Network (GAN) on MNIST digits"
        ],
        "referenceBooks": [
          "Goodfellow, Ian, Yoshua Bengio, and Aaron Courville, Deep Learning, MIT Press.",
          "Geron, Aurelien, Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow, O'Reilly Media.",
          "Chollet, Francois, Deep Learning with Python, Manning Publications.",
          "Zhang, Aston, Zachary C. Lipton, Mu Li, and Alexander J. Smola, Dive into Deep Learning, Cambridge University Press."
        ]
      },
      {
        "code": "BIT428CO",
        "name": "Digital Commerce (Track B)",
        "credits": 3,
        "type": "Elective",
        "description": "Electronic commerce architectures, mercantile retailing models, mobile commerce (3G/4G), digital marketing SEO, WordPress CMS, and AI chatbots.",
        "keyUnits": [
          "E-Commerce Foundations (Business Models, Security, Payments)",
          "Electronic Retailing (Consumer Mercantile Models)",
          "Introduction to Digital Commerce Trends",
          "Fundamentals of Mobile Commerce (M-Commerce, GSM/GPRS)",
          "Digital Marketing (SEO, Google Ads, Social Media)",
          "Web Content Management Systems (WordPress Development)",
          "Application of Artificial Intelligence in Commerce"
        ],
        "syllabusUnits": [
          {
            "title": "E-Commerce Foundations",
            "teachingHours": 11,
            "subtopics": [
              "Introduction to Electronic Commerce: definitions, history, and framework",
              "E-Commerce business models: B2B, B2C, C2C, C2B, G2C, and m-Commerce",
              "Electronic payment systems: digital credit cards, debit cards, smart cards, e-wallets, token-based payment",
              "Security protocols for e-commerce: SSL/TLS, SET, digital signatures, certificates, and PKI",
              "Legal, regulatory, and taxation issues in global e-commerce"
            ]
          },
          {
            "title": "Electronic Retailing",
            "teachingHours": 2,
            "subtopics": [
              "Consumer mercantile models and the consumer purchasing decision cycle",
              "Electronic store models, online catalogs, search engines, and shopping carts"
            ]
          },
          {
            "title": "Introduction to Digital Commerce Trends",
            "teachingHours": 3,
            "subtopics": [
              "Omnichannel retail strategies and social commerce",
              "Subscription business models and hyper-personalization",
              "Cross-border digital commerce logistics and supply integration"
            ]
          },
          {
            "title": "Fundamentals of Mobile Commerce",
            "teachingHours": 8,
            "subtopics": [
              "M-Commerce concepts, drivers, and architectural frameworks",
              "Mobile networks: GSM, GPRS, 3G, 4G, and 5G infrastructure constraints",
              "Mobile payment systems, contactless NFC, QR-code payment, and digital wallets",
              "Location-based services (LBS) and proximity marketing"
            ]
          },
          {
            "title": "Digital Marketing",
            "teachingHours": 8,
            "subtopics": [
              "Search Engine Optimization (SEO): on-page and off-page optimization",
              "Pay-per-click advertising: Google Ads, keyword research, and bidding strategies",
              "Social media marketing (SMM) and content marketing strategies",
              "Email marketing campaigns, conversion rate optimization (CRO), and analytics"
            ]
          },
          {
            "title": "Web Content Management Systems",
            "teachingHours": 7,
            "subtopics": [
              "Content Management System (CMS) architecture and selection criteria",
              "WordPress architecture, theme development, and plugin ecosystem",
              "E-commerce CMS implementation using WooCommerce / Shopify",
              "Product catalog configuration, payment gateway integration, and shipping calculators"
            ]
          },
          {
            "title": "Application of Artificial Intelligence in Commerce",
            "teachingHours": 6,
            "subtopics": [
              "Conversational AI: customer support chatbots and virtual assistants",
              "Personalized product recommendation algorithms (collaborative vs content-based filtering)",
              "Dynamic pricing algorithms and predictive inventory management",
              "AI-driven fraud detection in online financial transactions"
            ]
          }
        ],
        "labWork": [
          "Setting up a local web server (LAMP/XAMPP) and installing WordPress CMS",
          "Configuring an online storefront using WooCommerce with custom catalog structure",
          "Integrating sandbox payment gateways (e.g. PayPal, Stripe, local digital wallets)",
          "Conducting on-page SEO audits, keyword research, and meta tag optimization",
          "Setting up and analyzing web traffic using Google Analytics / Search Console",
          "Building an automated customer support chatbot using modern conversational AI APIs",
          "Designing a social media marketing campaign strategy and tracking conversion funnels"
        ],
        "referenceBooks": [
          "Laudon, Kenneth C. and Carol Guercio Traver, E-Commerce: Business, Technology, Society, Pearson.",
          "Turban, Efraim, David King, Jae Kyu Lee, Ting-Peng Liang, and Deborrah C. Turban, Electronic Commerce: A Managerial and Social Networks Perspective, Springer.",
          "Chaffey, Dave and Fiona Ellis-Chadwick, Digital Marketing: Strategy, Implementation and Practice, Pearson.",
          "Sabater, Sabater, WordPress for Beginners: Visual Guide to Building Websites."
        ]
      },
      {
        "code": "BIT429CO",
        "name": "Multimedia and Application (Track B)",
        "credits": 3,
        "type": "Elective",
        "description": "Multimedia data representations — audio/MIDI, image processing, video encoding, compression (JPEG/MPEG), real-time OS scheduling, and network streaming.",
        "keyUnits": [
          "Multimedia Systems (Aspects, Elements, Data Streams)",
          "Sound and Audio (Sampling, MIDI, Speech Synthesis)",
          "Images and Graphics (Formats, Image Processing)",
          "Video and Animation (Signal Representation, Formats)",
          "Data Compression (Huffman, JPEG, MPEG, H.261)",
          "Optical Storage Media (CD, DVD, Blu-Ray)",
          "Multimedia Operating Systems (Real-Time Scheduling: EDF, RM)",
          "Multimedia Communication Systems (QoS, Streaming)",
          "Documentation, Hypertext and MHEG",
          "Synchronization (Reference Models & Specifications)",
          "Abstraction of Programming & Toolkits",
          "Multimedia Applications (VOD, Video Conferencing)"
        ],
        "syllabusUnits": [
          {
            "title": "Multimedia Systems",
            "teachingHours": 3,
            "subtopics": [
              "Multimedia aspects and definitions, key elements of multimedia systems",
              "Continuous vs discrete media streams, characterization of multimedia systems"
            ]
          },
          {
            "title": "Sound and Audio",
            "teachingHours": 4,
            "subtopics": [
              "Physics of sound, sampling rate, quantization, and signal-to-quantization-noise ratio (SQNR)",
              "Audio file formats: WAV, MP3, AAC, FLAC",
              "MIDI protocol: messages, devices, synthesizers, and comparison with digital audio",
              "Speech processing: speech synthesis and recognition principles"
            ]
          },
          {
            "title": "Images and Graphics",
            "teachingHours": 4,
            "subtopics": [
              "Raster vs vector graphics representations",
              "Color models: RGB, CMYK, HSV, YUV, and color palettes",
              "Image file formats: BMP, GIF, PNG, TIFF, JPEG",
              "Basic image processing: spatial filtering, enhancement, and histogram equalization"
            ]
          },
          {
            "title": "Video and Animation",
            "teachingHours": 4,
            "subtopics": [
              "Television and video signals: Component, Composite, S-Video",
              "Analog broadcast standards (NTSC, PAL, SECAM) and digital video standards (HDTV, 4K)",
              "Principles of computer animation: keyframing, kinematics, morphing, and rendering"
            ]
          },
          {
            "title": "Data Compression",
            "teachingHours": 6,
            "subtopics": [
              "Lossless vs lossy compression fundamentals",
              "Entropy encoding: Run-length encoding (RLE), Huffman coding, Arithmetic coding, LZW",
              "Image compression: JPEG standard (DCT, quantization, entropy coding)",
              "Video compression: MPEG standards (I, P, B frames, motion estimation) and H.261/H.264"
            ]
          },
          {
            "title": "Optical Storage Media",
            "teachingHours": 4,
            "subtopics": [
              "Optical recording technology and track geometry",
              "CD-ROM, CD-R, CD-RW standards and logical formats (ISO 9660)",
              "DVD technology, DVD-Video, and Blu-Ray disc physical and logical specifications"
            ]
          },
          {
            "title": "Multimedia Operating Systems",
            "teachingHours": 4,
            "subtopics": [
              "Real-time processing requirements for continuous media",
              "Real-time scheduling algorithms: Earliest Deadline First (EDF) and Rate Monotonic (RM)",
              "Resource management, buffer management, and memory allocation in multimedia OS"
            ]
          },
          {
            "title": "Multimedia Communication Systems",
            "teachingHours": 4,
            "subtopics": [
              "Quality of Service (QoS) parameters: bandwidth, latency, jitter, packet loss rate",
              "Protocols for real-time transport: RTP, RTCP, RTSP, and RSVP",
              "Streaming media architectures, adaptive bitrate streaming (HLS, DASH), and CDN distribution"
            ]
          },
          {
            "title": "Documentation, Hypertext and MHEG",
            "teachingHours": 4,
            "subtopics": [
              "Hypertext and hypermedia concepts, nodes and links",
              "Document architecture standards: SGML, ODA (Open Document Architecture)",
              "MHEG (Multimedia and Hypermedia Information Coding Expert Group) standards"
            ]
          },
          {
            "title": "Synchronization",
            "teachingHours": 4,
            "subtopics": [
              "Notion of synchronization: intra-media vs inter-media synchronization",
              "Lip-sync synchronization requirements and skew limits",
              "Synchronization reference models and specification methods (interval-based, timeline-based)"
            ]
          },
          {
            "title": "Abstraction of Programming & Toolkits",
            "teachingHours": 2,
            "subtopics": [
              "Higher-level programming abstractions for multimedia objects",
              "Media frameworks and toolkits (DirectShow, GStreamer, QuickTime, WebRTC APIs)"
            ]
          },
          {
            "title": "Multimedia Applications",
            "teachingHours": 2,
            "subtopics": [
              "Video on Demand (VoD) system architectures and server scheduling",
              "Interactive video conferencing architectures and collaborative virtual environments"
            ]
          }
        ],
        "labWork": [
          "Audio editing and recording using Audacity (noise removal, equalizing, multi-track mixing)",
          "Raster and vector graphics manipulation using Adobe Photoshop / GIMP / Inkscape",
          "Digital video editing and compositing using Premiere Pro / DaVinci Resolve",
          "Implementation of Huffman coding and Run-Length Encoding in C/C++ or Python",
          "Implementation of basic 2D keyframe animation using HTML5 Canvas / CSS / Blender",
          "Benchmarking video compression codecs (H.264 vs H.265) on file size and PSNR quality",
          "Setting up a real-time media streaming server using RTSP / RTMP with OBS and VLC"
        ],
        "referenceBooks": [
          "Steinmetz, Ralf and Klara Nahrstedt, Multimedia: Computing, Communications & Applications, Pearson Education.",
          "Li, Ze-Nian, Mark S. Drew, and Jiangchuan Liu, Fundamentals of Multimedia, Springer.",
          "Buford, John F. Koegel, Multimedia Systems, Addison-Wesley.",
          "Vaughan, Tay, Multimedia: Making It Work, McGraw-Hill Education."
        ]
      },
      {
        "code": "BIT435CO",
        "name": "GIS (Track C)",
        "credits": 3,
        "type": "Elective",
        "description": "Geographic Information Systems — spatial/attribute data, raster vs vector structures, map projections (UTM), spatial querying, and Nepal GIS applications.",
        "keyUnits": [
          "Basic Concepts & Components of GIS",
          "GIS Data & Databases (Raster & Vector Structures)",
          "GIS Data Input (Digitization, GPS & Remote Sensing)",
          "GIS Mapping & Map Projections (UTM)",
          "Data Editing in GIS (Error Correction, Rubber Sheeting)",
          "Spatial Analysis (Buffering, Overlay, Network Connectivity)",
          "Spatial Data Infrastructure (SDI & NSDI Standards)",
          "GIS in Nepal (Current Situation & Major Activities)"
        ],
        "syllabusUnits": [
          {
            "title": "Basic Concepts & Components of GIS",
            "teachingHours": 4,
            "subtopics": [
              "Definition and components of GIS (Hardware, Software, Data, People, Methods)",
              "Functionality of GIS",
              "Areas of GIS application",
              "Advantages and limitations of GIS"
            ]
          },
          {
            "title": "GIS Data & Database",
            "teachingHours": 8,
            "subtopics": [
              "Spatial and attribute data concepts",
              "Spatial data handling",
              "Data representations: points, lines, polygons",
              "Information organization and data structures: Raster and Vector data structures, Tessellations",
              "File organization and formats",
              "Geo-database concepts and GIS software packages"
            ]
          },
          {
            "title": "GIS Data Input",
            "teachingHours": 6,
            "subtopics": [
              "Nature and source of spatial data",
              "Methods of spatial data capture: Primary and Secondary sources",
              "Digitization and scanning methods, techniques and procedures for digitizing, errors of digitization",
              "Attribute data capture",
              "GPS and Remote Sensing integration for data collection"
            ]
          },
          {
            "title": "GIS Mapping and Map Projections",
            "teachingHours": 8,
            "subtopics": [
              "Defining maps, categories of maps, map contents and map scales",
              "Georeferencing principles and coordinate systems",
              "Projection systems: types and aspects (cylindrical, conical, azimuthal)",
              "Universal Transverse Mercator (UTM) coordinate system"
            ]
          },
          {
            "title": "Data Editing in GIS",
            "teachingHours": 4,
            "subtopics": [
              "Detecting and correcting topological errors",
              "Re-projection, coordinate transformation, and map generalization",
              "Edge matching and rubber sheeting",
              "Conversion from other digital sources and CAD formats"
            ]
          },
          {
            "title": "Spatial Analysis",
            "teachingHours": 7,
            "subtopics": [
              "Types of spatial analysis and measurements in GIS",
              "Query by attributes and spatial queries (point-in-polygon, line-in-polygon)",
              "Attribute-based operations",
              "Neighborhood analysis and buffering",
              "Connectivity analysis and network routing",
              "Overlay operations (union, intersect, identity) and coverage rebuilding"
            ]
          },
          {
            "title": "Data Sharing and Spatial Data Infrastructure",
            "teachingHours": 6,
            "subtopics": [
              "Concept of Geospatial Infrastructure",
              "Components of Spatial Data Infrastructure (SDI): Standards, Metadata, Data Sharing Clearinghouse",
              "National Spatial Data Infrastructure (NSDI) frameworks"
            ]
          },
          {
            "title": "GIS in Nepal",
            "teachingHours": 2,
            "subtopics": [
              "Present situation of GIS in Nepal",
              "Major GIS activities and national geospatial initiatives",
              "Prospects and challenges of GIS implementation in Nepal"
            ]
          }
        ],
        "labWork": [
          "Introduction to QGIS / ArcGIS interface, tools, and plugins",
          "Georeferencing scanned toposheets using ground control points (GCPs)",
          "Vectorization and digitization: creating shapefiles for points, lines, and polygons",
          "Attribute table creation, editing, joins, and spatial queries",
          "Thematic map production: symbology, labeling, layout preparation, scale, and north arrow",
          "Vector spatial analysis: Buffering, Clip, Intersect, and Union operations",
          "Raster spatial analysis: Digital Elevation Model (DEM) slope, aspect, and hillshade generation",
          "Creating a complete GIS project map report for a selected region in Nepal"
        ],
        "referenceBooks": [
          "Burrough, P. A. and R. A. McDonnell, Principles of Geographical Information Systems, Oxford University Press.",
          "Star, J. and J. Estes, Geographic Information Systems: An Introduction, Prentice Hall.",
          "Chang, Kang-Tsung, Introduction to Geographic Information Systems, Tata McGraw-Hill.",
          "Lo, C. P. and Albert K. W. Yeung, Concepts and Techniques of Geographic Information Systems, Prentice Hall of India.",
          "Heywood, Ian, Sarah Cornelius, Steve Carver, and Srinivasa Raju, An Introduction to Geographical Information Systems, Pearson Education.",
          "Bhatta, Basudeb, Remote Sensing and GIS, Oxford University Press.",
          "Lee, J. and D. W. S. Wong, Statistical Analysis with ArcView GIS, John Wiley & Sons."
        ]
      },
      {
        "code": "BIT436CO",
        "name": "Remote Sensing (Track C)",
        "credits": 3,
        "type": "Elective",
        "description": "Electromagnetic radiation spectrum, sensor platforms and satellite orbits, Landsat/Sentinel imagery, digital image processing, and GIS-RS integration.",
        "keyUnits": [
          "Concept and Scope of Remote Sensing Systems",
          "Electromagnetic Radiation (EMR Spectrum & Signatures)",
          "Sensor Characteristics (Whiskbroom, Pushbroom, Resolutions)",
          "Remote Sensor Platforms and Satellite Orbits (Sun-Synchronous)",
          "Space Imaging Satellites (IRS, Landsat, SPOT, High-Res)",
          "Integration of GIS and Remote Sensing",
          "Applications of Remote Sensing"
        ],
        "syllabusUnits": [
          {
            "title": "Concept and Scope of Remote Sensing",
            "teachingHours": 8,
            "subtopics": [
              "Definitions, process, and characteristics of Remote Sensing systems",
              "Types and components of Remote Sensing",
              "Advantages and limitations of satellite remote sensing"
            ]
          },
          {
            "title": "Concept of Electromagnetic Radiation (EMR)",
            "teachingHours": 8,
            "subtopics": [
              "Wavelength-frequency-energy relationship of EMR",
              "EMR spectrum and its properties across visible, infrared, and microwave bands",
              "EMR wavelength regions and their specific applications",
              "Atmospheric windows and atmospheric scattering (Rayleigh, Mie, Non-selective)",
              "Interactions of EMR with matter, energy interaction in the atmosphere, energy interactions with Earth surface features",
              "Spectral signatures of vegetation, soil, and water"
            ]
          },
          {
            "title": "Types and Characteristics of Sensor",
            "teachingHours": 10,
            "subtopics": [
              "Sensor materials and detector arrays",
              "Sensor systems: Framing and Scanning systems (Whiskbroom scanner, Push-broom scanner, Side-looking scanner)",
              "Imaging and non-imaging sensors; Active and passive sensors",
              "Resolutions of sensors: Spectral, Spatial, Radiometric, and Temporal resolution",
              "Scale, mapping unit, multi-band concepts, and False Color Composites (FCC)"
            ]
          },
          {
            "title": "Remote Sensor Platforms and Satellite Orbits",
            "teachingHours": 8,
            "subtopics": [
              "Ground, Airborne, and Space-borne platforms",
              "Orbital characteristics: Coverage, Passes, Pointing accuracy",
              "Geostationary orbits, Sun-synchronous orbits, Shuttle orbits, Semisynchronous orbits (Molniya orbit), and Quasi-zenith satellite orbits"
            ]
          },
          {
            "title": "Space Imaging Satellites",
            "teachingHours": 7,
            "subtopics": [
              "Early history of space imaging systems",
              "Multispectral and Hyperspectral sensors; RADAR and LiDAR systems",
              "Specifications of popular Earth resource satellites: IRS, LANDSAT, and SPOT series",
              "High resolution satellites: IKONOS, Cartosat, QuickBird, OrbView, WorldView",
              "Recent Earth observation satellite constellations (Sentinel, PlanetScope)"
            ]
          },
          {
            "title": "Integration of GIS and Remote Sensing",
            "teachingHours": 2,
            "subtopics": [
              "Mechanisms of integrating satellite imagery with GIS layers",
              "Data interchange formats and coordinate alignment",
              "Updating GIS databases using remote sensing imagery"
            ]
          },
          {
            "title": "Applications of Remote Sensing",
            "teachingHours": 2,
            "subtopics": [
              "Agricultural monitoring and crop yield estimation",
              "Forestry and land use / land cover (LULC) change detection",
              "Water resources, flood mapping, and glacial lake monitoring",
              "Urban planning and disaster impact assessment in Nepal"
            ]
          }
        ],
        "labWork": [
          "Downloading satellite imagery (Landsat 8/9, Sentinel-2) from USGS EarthExplorer / Copernicus Open Access Hub",
          "Displaying satellite bands and creating True Color and False Color Composites (FCC) in QGIS / ERDAS",
          "Radiometric and atmospheric correction of raw satellite data",
          "Geometric correction and image-to-image registration",
          "Calculating vegetation indices: Normalized Difference Vegetation Index (NDVI) and NDWI",
          "Supervised image classification using Maximum Likelihood / Random Forest",
          "Unsupervised image classification using k-means / ISODATA",
          "Accuracy assessment: confusion matrix, overall accuracy, and Kappa coefficient calculation"
        ],
        "referenceBooks": [
          "Joseph, George, Fundamentals of Remote Sensing, Universities Press.",
          "Gupta, Ravi P., Remote Sensing Geology, Springer.",
          "Bhatta, Basudeb, Remote Sensing and GIS, Oxford University Press.",
          "Levin, Noam, Fundamental of Remote Sensing, Research Press.",
          "Sabins, Floyd F., Remote Sensing: Principles and Interpretation, W. H. Freeman & Co.",
          "Lillesand, Thomas M., Ralph W. Kiefer, and Jonathan W. Chipman, Remote Sensing and Image Interpretation, John Wiley & Sons."
        ]
      },
      {
        "code": "BIT437CO",
        "name": "Data Center and Disaster Recovery Centers (Track C)",
        "credits": 3,
        "type": "Elective",
        "description": "Modern data center design, power redundancy, fire protection, cooling optimization, cloud data centers, and enterprise disaster recovery planning.",
        "keyUnits": [
          "Introduction to Data Center Types and Architecture",
          "The Role and Objectives of Data Centers (Standards & Tiers)",
          "Design Overview (Cooling, Power Redundancy, Cabling)",
          "Managing the Data Center (Processes, Decommissioning, Security)",
          "Data Center Industry Market and Trends",
          "Cloud Data Centers",
          "Disaster Recovery Center Formulation and DR Plans"
        ],
        "syllabusUnits": [
          {
            "title": "Introduction to Data Centre",
            "teachingHours": 5,
            "subtopics": [
              "Defining a modern enterprise data centre",
              "Identifying the main data centre types: Enterprise, Colocation, Managed, and Cloud",
              "Business service delivery options and SLAs",
              "Emerging delivery models and future computing demands"
            ]
          },
          {
            "title": "The Role and Objectives of a Data Centre",
            "teachingHours": 7,
            "subtopics": [
              "Driving factors and business value for establishing a data centre",
              "Data centre standards (ANSI/TIA-942, Uptime Institute Tier Standards I-IV)",
              "Data centre availability models and uptime considerations",
              "Location selection, civil building, and geophysical hazard considerations",
              "Analyzing reliability, MTBF, and MTTR in the data center",
              "Data center energy efficiency metrics: PUE (Power Usage Effectiveness) and DCiE",
              "Data center system capacity planning"
            ]
          },
          {
            "title": "Design Overview and Infrastructure",
            "teachingHours": 10,
            "subtopics": [
              "Criticality and availability considerations",
              "Fire protection methods in the data center: gaseous suppression (FM-200, Novec 1230), pre-action sprinklers",
              "Structured cabling strategies (horizontal, backbone, fiber vs copper, cable trays)",
              "Thermal management: maintaining humidity, hot/cold aisle containment, CRAC/CRAH units",
              "Physical security: biometric access, perimeter security, surveillance cameras",
              "Power management: utility feeds, diesel backup generators, UPS topologies (N, N+1, 2N), and PDUs",
              "Physical infrastructure: server rack fundamentals (42U), floor loading, row vs room-based cooling",
              "The four key constraints (4C's): Power, Cooling, IT Infrastructure, and Space"
            ]
          },
          {
            "title": "Managing the Data Centre",
            "teachingHours": 6,
            "subtopics": [
              "Regulations, best practices, and operational processes (ITIL, ISO 27001)",
              "Moves, adds, and changes (MAC) processes and change management",
              "Efficient energy management and thermal audit techniques",
              "Asset lifecycle and secure decommissioning processes",
              "Logical, IT, and network perimeter security integration"
            ]
          },
          {
            "title": "The Data Centre Industry and Market",
            "teachingHours": 5,
            "subtopics": [
              "Global and regional market size and economic drivers",
              "Hyperscale data center trends and edge computing",
              "Powering the Internet: green energy adoption, carbon neutrality, and renewable power",
              "Case studies of modern hyperscale facilities (Google, Microsoft, AWS)"
            ]
          },
          {
            "title": "Cloud Data Center",
            "teachingHours": 4,
            "subtopics": [
              "Cloud data center architecture and software-defined infrastructure (SDDC)",
              "Virtualization layers: compute, storage (SAN/NAS), and software-defined networking (SDN)",
              "Multi-tenant isolation and cloud workload orchestration"
            ]
          },
          {
            "title": "Disaster Recovery Center Formulation and DR Plans",
            "teachingHours": 8,
            "subtopics": [
              "Disaster Recovery Plan (DRP) formulation steps",
              "Business continuity planning (BCP) vs disaster recovery: RTO and RPO metrics",
              "Data backup strategies: Full, Incremental, Differential, and continuous replication",
              "Cloud-based disaster recovery (DRaaS) architectures",
              "Disaster recovery site tiers: Cold site, Warm site, and Hot site architectures"
            ]
          }
        ],
        "labWork": [
          "Formulation and presentation of a comprehensive Disaster Recovery Center Planning Document for an enterprise (compulsory for 20 internal practical marks)",
          "Calculation of PUE (Power Usage Effectiveness) and cooling loads for a simulated 50-rack server room",
          "Designing hot/cold aisle containment layout using data center modeling software / CAD",
          "Designing redundant power distribution topology (dual UPS feeds, ATS, and standby generator sizing)",
          "Configuring automated database backup and remote snapshot replication to a DR site",
          "Simulating disaster failover and calculating achieved Recovery Time Objective (RTO) and Recovery Point Objective (RPO)"
        ],
        "referenceBooks": [
          "Lowe, Scott D., James Green, and David Davis, Building a Modern Data Center: Principles and Strategies of Design, ActualTech Media, New York.",
          "Arregoces, Mauricio and Maurizio Portolani, Data Center Fundamentals, Cisco Press.",
          "Khan, Samee Ullah and Albert Y. Zomaya, Handbook on Data Centers, Springer.",
          "Rothstein, Philip Jan, IT Disaster Recovery Planning For Dummies, Wiley Publishing Inc.",
          "Snevely, Robert, Enterprise Data Center Design and Methodology, Prentice Hall."
        ]
      },
      {
        "code": "BIT403CO",
        "name": "Internship",
        "credits": 3,
        "type": "Project / Practical",
        "description": "45-hour supervised internship at a partner organization (bank, hospital, software company, telecom, or government IT unit), evaluated via proposal defense, mid-term, and end-term report.",
        "keyUnits": [
          "Proposal Defense & Organization Placement (10%)",
          "Mid-Term Progress Review & System Design (30%)",
          "System Analysis, Implementation & Testing",
          "Final Internship Report (APA Format) & Viva (60%)"
        ],
        "syllabusUnits": [
          {
            "title": "Proposal Defense & Organization Placement",
            "teachingHours": 10,
            "subtopics": [
              "Partner organization identification (Bank, Hospital, Software Company, Telecom, or Government IT Unit)",
              "Problem identification, scope definition, and internship plan preparation (first 2 weeks)",
              "Proposal defense presentation (10% weight: 5% topic selection, 5% presentation) evaluated by supervisor and mentor"
            ]
          },
          {
            "title": "Mid-Term Progress Review & System Design",
            "teachingHours": 15,
            "subtopics": [
              "System requirements specification (SRS) and architecture modeling",
              "Database design, ER diagrams, and normalized schema",
              "Mid-term progress presentation and prototype demo (30% weight: 10% program design, 10% demo, 10% viva) after 2 months"
            ]
          },
          {
            "title": "System Implementation & Quality Testing",
            "teachingHours": 10,
            "subtopics": [
              "Module implementation, database connectivity, and backend API integration",
              "System testing: Unit testing, integration testing, and bug fixing",
              "Evaluation of professional code quality, security, and documentation"
            ]
          },
          {
            "title": "Final Internship Report & University Viva",
            "teachingHours": 10,
            "subtopics": [
              "Technical report writing according to APA format (Abstract, Intro, System Analysis, System Design, Implementation, Testing, Future Enhancements, References)",
              "Preparation of individual project portfolios (max 3 students per group)",
              "End-term final defense (60% weight: 15% depth of work, 25% report, 10% presentation, 10% external viva) before Purbanchal University external examiner"
            ]
          }
        ],
        "labWork": [
          "Duration: 3 Credits (minimum 45 contact lab/industry hours) at approved partner organization (Bank, Hospital, Software Company, Telecom, or Government IT Unit).",
          "Internship Plan: Formal submission of objectives, problem statement, and milestone schedule within the first two weeks under assigned advisor.",
          "Group Size: Maximum 3 students per team, with individual document and portfolio preparation.",
          "Proposal Defense (10% weight): Topic selection with proposal (5%) and presentation (5%) evaluated by Supervisor and Mentor.",
          "Mid-Term Review (30% weight, after 2 months): Program design (10%), prototype demo presentation (10%), and oral viva (10%).",
          "End-Term Defense (60% weight): Depth of work (15%), formal internship report in APA 7th Edition format (25%), external viva (10%), and final presentation (10%) evaluated with external examiner from Purbanchal University."
        ],
        "referenceBooks": [
          "American Psychological Association, Publication Manual of the American Psychological Association (7th ed.), 2020.",
          "Purbanchal University, Faculty of Science & Technology, Guidelines for Undergraduate Internship and Project Works."
        ]
      }
    ]
  },
  {
    "semester": 8,
    "totalCredits": 15,
    "subjects": [
      {
        "code": "BIT451MS",
        "name": "Principles of Management and Entrepreneurship in IT",
        "credits": 3,
        "type": "Core",
        "description": "Management fundamentals, organization design, entrepreneurship, business planning, and IT product marketing/technology transfer.",
        "keyUnits": [
          "Introduction to Management Principles and Functions",
          "Organization Design and Decentralization",
          "The Foundation of Entrepreneurship",
          "Feasibility Analysis and Crafting Winning Business Plans",
          "Forms of Business Ownership and Franchising",
          "Building a Powerful Marketing Plan (Guerrilla Marketing)",
          "Location Selection and Layout Optimization",
          "E-Commerce and the Entrepreneur",
          "Entrepreneur of IT (Technology Transfer & Innovation)"
        ],
        "syllabusUnits": [
          {
            "title": "Introduction to Management Principles and Functions",
            "teachingHours": 3,
            "subtopics": [
              "Concept and scope of management",
              "Levels, principles, and functions of management",
              "Roles and skills of managers",
              "Women in organizational hierarchy and leadership"
            ]
          },
          {
            "title": "Organization Design and Decentralization",
            "teachingHours": 3,
            "subtopics": [
              "Concept, principles, and benefits of organizing",
              "Approaches to organization structure and design",
              "Departmentation methods",
              "Formal and informal organizations",
              "Authority, responsibility, and delegation",
              "Decentralization of authority"
            ]
          },
          {
            "title": "The Foundation of Entrepreneurship",
            "teachingHours": 5,
            "subtopics": [
              "The world of the entrepreneur: definition and entrepreneurial mindset",
              "Benefits and potential drawbacks of entrepreneurship",
              "Behind the boom: factors driving the entrepreneurial fire",
              "Cultural diversity of entrepreneurship",
              "The ten deadly mistakes of entrepreneurship and how to avoid the pitfalls"
            ]
          },
          {
            "title": "Feasibility Analysis and Crafting Winning Business Plans",
            "teachingHours": 5,
            "subtopics": [
              "Conducting a comprehensive feasibility analysis (Product/Service, Financial, Industry)",
              "Why develop a business plan: strategic and funding imperatives",
              "Elements and structural outline of a professional business plan",
              "Making the business plan pitch and executive presentation",
              "Standard business plan formatting guidelines"
            ]
          },
          {
            "title": "Forms of Business Ownership and Franchising",
            "teachingHours": 4,
            "subtopics": [
              "Sole proprietorship, partnership, and corporation structures",
              "Other forms of ownership (LLCs, Joint Ventures)",
              "Types of franchising",
              "Benefits and drawbacks of buying a franchise",
              "The right way to evaluate and acquire a franchise"
            ]
          },
          {
            "title": "Building a Powerful Marketing Plan",
            "teachingHours": 4,
            "subtopics": [
              "Building a guerrilla marketing plan",
              "Pinpointing the target market and market segmentation",
              "Determining customer needs and wants through market research",
              "Plotting guerrilla marketing strategies on a bootstrap budget",
              "Marketing on the World Wide Web and the modern marketing mix (4Ps/4Cs)"
            ]
          },
          {
            "title": "Choosing the Right Location and Layout",
            "teachingHours": 4,
            "subtopics": [
              "Location as a source of competitive advantage",
              "Location criteria and options for service, retail, and manufacturing businesses",
              "Layout optimization: maximizing revenues, increasing operational efficiency, and reducing costs"
            ]
          },
          {
            "title": "E-Commerce and the Entrepreneur",
            "teachingHours": 5,
            "subtopics": [
              "Benefits of selling on the Web for startups",
              "Factors to consider before launching into e-commerce",
              "Twelve myths of e-commerce",
              "Strategies for successful e-commerce execution",
              "Designing a high-converting web storefront",
              "Tracking web results and web analytics",
              "Ensuring customer privacy and transaction security"
            ]
          },
          {
            "title": "Entrepreneur of IT and Technology Transfer",
            "teachingHours": 8,
            "subtopics": [
              "Marketing Information Technology products",
              "Technological life cycle and adoption curves",
              "Classification of buyers in the IT market",
              "Technological SWOT analysis and techno-ready marketing",
              "How and why customers adopt information technology innovations",
              "Issues in technology management and intellectual property protection",
              "Mechanisms and modes of international technology transfer to developing nations",
              "Information technology as the wealth of nations",
              "Case study and student presentations based on Chapters 8 & 9 [4 Hrs]"
            ]
          }
        ],
        "referenceBooks": [
          "Koontz, Harold and Heinz Weihrich, Essentials of Management, Tata McGraw-Hill.",
          "Zimmerer, Thomas W. and Norman M. Scarborough, Essentials of Entrepreneurship and Small Business Management, Prentice Hall.",
          "Kotler, Philip and Gary Armstrong, Principles of Marketing, Pearson Education Asia.",
          "Hisrich, Robert D., Michael P. Peters, and Dean A. Shepherd, Entrepreneurship, McGraw-Hill."
        ]
      },
      {
        "code": "BIT452CO",
        "name": "Distributed and Cloud Computing",
        "credits": 3,
        "type": "Core",
        "description": "Distributed systems fundamentals and cloud computing service/deployment models, virtualization, and cloud security.",
        "keyUnits": [
          "Distributed Systems Fundamentals (RPC, RMI, Consistency)",
          "Cloud Computing Service Models (IaaS, PaaS, SaaS, Serverless)",
          "Virtualization Technologies (Hypervisors, Containers, K8s)",
          "Cloud Storage and Big Data Architectures",
          "Cloud Security, IAM and Shared Responsibility"
        ],
        "referenceBooks": [
          "Tanenbaum, Andrew S. and Maarten van Steen, Distributed Systems: Principles and Paradigms, Prentice Hall.",
          "Buyya, Rajkumar, Christian Vecchiola, and S. Thamarai Selvi, Mastering Cloud Computing: Foundations and Applications Programming, Morgan Kaufmann / McGraw Hill.",
          "Coulouris, George, Jean Dollimore, Tim Kindberg, and Gordon Blair, Distributed Systems: Concepts and Design, Addison-Wesley.",
          "Hwang, Kai, Jack Dongarra, and Geoffrey C. Fox, Distributed and Cloud Computing: From Parallel Processing to the Internet of Things, Morgan Kaufmann."
        ]
      },
      {
        "code": "BIT471CO",
        "name": "Natural Language Processing (Track A)",
        "credits": 3,
        "type": "Elective",
        "description": "Speech and language processing, morphological parsing with FSTs, N-grams, HMM POS tagging, feature unification, WordNet lexical semantics, and discourse pragmatics.",
        "keyUnits": [
          "Introduction to NLP (Linguistic Organization, CFG Parsing)",
          "Morphology & Phonology (Parsing with FSTs, Phonological Rules)",
          "Pronunciation, Spelling and N-grams (Smoothing, Language Models)",
          "Syntax: POS Tagging (HMM Tagger, Transformation-based)",
          "Sentence Level Construction & Unification Semantics",
          "Lexical Semantics (WordNet, Homonymy, WSD)",
          "Pragmatics and Discourse Structure"
        ],
        "syllabusUnits": [
          {
            "title": "Introduction to NLP",
            "teachingHours": 6,
            "subtopics": [
              "Definition, issues, and strategies in speech and language processing",
              "Application domains and software tools for NLP",
              "Linguistic organization of NLP, Natural Language Processing vs Programming Language Processing",
              "Word classes, review of Regular Expressions, Context-Free Grammars (CFG), and parsing techniques"
            ]
          },
          {
            "title": "Morphology and Phonology",
            "teachingHours": 7,
            "subtopics": [
              "Inflectional and derivational morphology",
              "Morphological parsing with Finite State Transducers (FSTs) and combinational rules",
              "Phonology: Speech sounds, phonetic transcription (IPA), phoneme definitions and phonological rules",
              "Optimality theory and machine learning of phonological rules",
              "Phonological aspects of prosody and speech synthesis (TTS)"
            ]
          },
          {
            "title": "Pronunciation, Spelling and N-grams",
            "teachingHours": 7,
            "subtopics": [
              "Spelling error detection and correction using probabilistic noisy channel models",
              "Pronunciation variation: lexical, allophonic, and dialectal variations",
              "Decision tree models for pronunciation",
              "Counting words in corpora and simple N-gram language models",
              "Smoothing techniques: Add-One (Laplace), Witten-Bell, Good-Turing discounting",
              "N-grams for spelling correction and pronunciation modeling"
            ]
          },
          {
            "title": "Syntax and Part-of-Speech Tagging",
            "teachingHours": 6,
            "subtopics": [
              "Penn Treebank tagsets and word categories",
              "Concept of Hidden Markov Model (HMM) taggers",
              "Rule-based vs stochastic POS tagging",
              "Viterbi algorithm for HMM decoding and tagging",
              "Transformation-Based Learning (Brill) tagger"
            ]
          },
          {
            "title": "Sentence Level Construction & Unification Semantics",
            "teachingHours": 7,
            "subtopics": [
              "Noun phrase structures, co-ordination, and sub-categorization",
              "Concept of feature structures and unification",
              "Representing Meaning: Unambiguous representation, canonical form, expressiveness, meaning structure of language",
              "Basics of First-Order Predicate Calculus (FOPC) in semantic interpretation",
              "Syntax-driven semantic analysis, attachment, integration, and robustness"
            ]
          },
          {
            "title": "Lexical Semantics",
            "teachingHours": 6,
            "subtopics": [
              "Lexemes and semantic relationships: homonymy, polysemy, synonymy, hyponymy",
              "WordNet taxonomy and relational database structure",
              "Internal structure of words, metaphors, and metonymy with computational approaches",
              "Word Sense Disambiguation (WSD): Selectional restriction-based, machine learning-based, and dictionary-based (Lesk algorithm) approaches"
            ]
          },
          {
            "title": "Pragmatics and Discourse Structure",
            "teachingHours": 6,
            "subtopics": [
              "Discourse reference resolution and referential phenomena",
              "Syntactic and semantic constraints on co-reference",
              "Pronoun resolution algorithms (Hobbs algorithm, centering theory)",
              "Text coherence and discourse rhetorical structure",
              "Dialogues: Turns and utterances, grounding, dialogue acts and conversational structures",
              "Natural Language Generation (NLG): introduction to language generation architecture and discourse planning"
            ]
          }
        ],
        "labWork": [
          "Text processing using Python NLTK and spaCy (tokenization, stopword removal, lemmatization)",
          "Building a morphological analyzer using Finite State Transducers (FST)",
          "Implementing an N-gram language model with Laplace and Good-Turing smoothing",
          "Implementing the Viterbi algorithm for Hidden Markov Model (HMM) POS tagging",
          "Rule-based and stochastic chunking and Named Entity Recognition (NER)",
          "Synset extraction, semantic similarity calculation, and sense disambiguation using WordNet",
          "Building a rule-based or probabilistic chatbot demonstrating dialogue state tracking"
        ],
        "referenceBooks": [
          "Jurafsky, Daniel and James H. Martin, Speech and Language Processing: An Introduction to Natural Language Processing, Computational Linguistics, and Speech Recognition, Pearson Education.",
          "Allen, James, Natural Language Understanding, Benjamin/Cummings.",
          "Bharati, Akshar, Vineet Chaitanya, and Rajeev Sangal, Natural Language Processing: A Paninian Perspective, Prentice Hall of India.",
          "Charniak, Eugene, Statistical Language Learning, MIT Press.",
          "Manning, Christopher D. and Hinrich Schutze, Foundations of Statistical Natural Language Processing, MIT Press."
        ]
      },
      {
        "code": "BIT472MS",
        "name": "Supply Chain Analytics (Track A)",
        "credits": 3,
        "type": "Elective",
        "description": "Data analytics and machine learning applied to supply chain management — data preparation in Python, Seaborn visualization, customer RFM segmentation, supplier risk, and demand forecasting.",
        "keyUnits": [
          "Introduction to Supply Chain Analytics & SMART Goals",
          "Data-Driven Supply Chains (Python Setup)",
          "Data Manipulation & Indexing in Python",
          "Data Visualization (Seaborn, Geospatial Mapping)",
          "Customer Management (Cohort & RFM Analysis, Clustering)",
          "Supply Management & Supplier Risk Regression",
          "Warehouse and Inventory Optimization",
          "Demand Forecasting (Time Series Methods)",
          "Logistics Management & Route Optimization"
        ],
        "syllabusUnits": [
          {
            "title": "Introduction to Supply Chain Analytics",
            "teachingHours": 4,
            "subtopics": [
              "Definition of Supply Chain and need for supply chain management",
              "Structure of supply chains, processes, flows, and strategic decision making",
              "Supply chain analytics definitions, value proposition, and role of AI",
              "Defining SMART goals and KPIs for supply chain optimization"
            ]
          },
          {
            "title": "Data-Driven Supply Chains with Python",
            "teachingHours": 5,
            "subtopics": [
              "Data-driven decision making in supply chain environments",
              "Setting up the Python analytics runtime environment (Jupyter, NumPy, Pandas)",
              "Structure of tabular data, variables, and series data types",
              "Data cleaning, outlier treatment, and missing value imputation in supply datasets"
            ]
          },
          {
            "title": "Data Manipulation & Indexing in Python",
            "teachingHours": 5,
            "subtopics": [
              "Pandas data manipulation: indexing, slicing, filtering, and grouping",
              "Data aggregation, pivoting, and merging disparate logistical datasets",
              "Feature engineering for delivery performance and transit time calculations"
            ]
          },
          {
            "title": "Data Visualization & Geospatial Analysis",
            "teachingHours": 5,
            "subtopics": [
              "Exploratory data visualization using Seaborn and Matplotlib",
              "Distribution plots, correlation heatmaps, and trend analysis",
              "Geospatial visualization of supplier locations, transport corridors, and delivery zones"
            ]
          },
          {
            "title": "Customer Management & RFM Segmentation",
            "teachingHours": 6,
            "subtopics": [
              "Customer relationship analytics in supply chain operations",
              "Customer cohort analysis and churn prediction",
              "Recency, Frequency, Monetary (RFM) customer segmentation",
              "k-means clustering for behavioral customer categorization"
            ]
          },
          {
            "title": "Supply Management & Supplier Risk Analysis",
            "teachingHours": 5,
            "subtopics": [
              "Procurement analytics and supplier performance scorecarding",
              "Assessing supplier delivery risk using multiple linear regression and logistic regression",
              "Lead time variability analysis and supplier reliability benchmarking"
            ]
          },
          {
            "title": "Warehouse and Inventory Optimization",
            "teachingHours": 5,
            "subtopics": [
              "Inventory management metrics: Economic Order Quantity (EOQ), Reorder Point (ROP), Safety Stock",
              "ABC and XYZ inventory classifications",
              "Warehouse slotting optimization and picking path efficiency"
            ]
          },
          {
            "title": "Demand Forecasting",
            "teachingHours": 5,
            "subtopics": [
              "Importance of demand forecasting in mitigating the Bullwhip Effect",
              "Quantitative time series methods: Moving Averages, Exponential Smoothing (Holt-Winters)",
              "Evaluating forecast accuracy: MAD, MSE, RMSE, and MAPE metrics"
            ]
          },
          {
            "title": "Logistics Management & Route Optimization",
            "teachingHours": 5,
            "subtopics": [
              "Transportation modes, freight logistics, and carrier selection",
              "Logistics network design and facility location decisions",
              "Route optimization fundamentals and Vehicle Routing Problem (VRP) solving with Python"
            ]
          }
        ],
        "labWork": [
          "There shall be laboratory classes on data visualization as applied to supply chain analytics using Python:",
          "1. Importing, cleaning, and preprocessing multi-source supply chain transaction datasets using Pandas",
          "2. Visualizing order volumes, delivery delays, and supplier lead times using Seaborn heatmaps and histograms",
          "3. Implementing RFM (Recency, Frequency, Monetary) segmentation with Scikit-Learn k-means on customer shipment data",
          "4. Building a regression model in Python to predict supplier delivery delays based on distance and order size",
          "5. Implementing EOQ and safety stock simulation algorithms in Python",
          "6. Forecasting product demand using Holt-Winters exponential smoothing and evaluating MAPE errors",
          "7. Solving a transportation route optimization problem using Linear Programming (PuLP / SciPy)"
        ],
        "referenceBooks": [
          "Liu, Kurt Y., Supply Chain Analytics: Concepts, Techniques and Applications, Palgrave Macmillan.",
          "Tipi, Nicoleta, Supply Chain Analytics and Modelling: Quantitative Tools and Applications, Kogan Page Ltd.",
          "Chopra, Sunil and Peter Meindl, Supply Chain Management: Strategy, Planning, and Operation, Pearson.",
          "Feigin, Gerald, Supply Chain Planning and Analytics: The Right Product in the Right Place at the Right Time, Business Expert Press."
        ]
      },
      {
        "code": "BIT478CO",
        "name": "Big Data (Track B)",
        "credits": 3,
        "type": "Elective",
        "description": "Big data paradigms in business intelligence — MapReduce workflow anatomy, NoSQL databases (HBase, Cassandra, MongoDB), HDFS storage, and Hadoop HiveQL tools.",
        "keyUnits": [
          "Introduction to Big Data (Distributed Systems, Trends)",
          "MapReduce Applications (Workflows, Optimization, Locality)",
          "Data Management & Taxonomy of NoSQL Implementations",
          "Fundamentals of Hadoop (HDFS, Streaming, Pipes, I/O)",
          "Hadoop Tools: HBase, Cassandra, Pig Latin, Hive & HiveQL"
        ],
        "syllabusUnits": [
          {
            "title": "Introduction to Big Data",
            "teachingHours": 5,
            "subtopics": [
              "Overview of Big Data and comparison with traditional database architectures",
              "Background of Data Analytics and emergence of distributed systems",
              "Big Data usage in distributed systems and cloud platforms",
              "Development history and milestones of Big Data technologies",
              "Current trends in Big Data Analytics",
              "Benefits and real-world applications of Big Data (telecom, healthcare, e-commerce, banking)"
            ]
          },
          {
            "title": "MapReduce Applications",
            "teachingHours": 8,
            "subtopics": [
              "MapReduce fundamentals and programming model",
              "MapReduce workflows, mappers, reducers, partitioners, and combiners",
              "Anatomy of a MapReduce job execution run",
              "Fault tolerance, node failures, and speculative execution",
              "Real-world problems solved via MapReduce",
              "Scalability goals, optimization techniques, and data locality exploitation",
              "Parallel efficiency and performance bottlenecks of MapReduce"
            ]
          },
          {
            "title": "Data Management & Taxonomy of NoSQL Implementations",
            "teachingHours": 12,
            "subtopics": [
              "Structured, semi-structured, and unstructured data management",
              "Taxonomy of NoSQL implementations: Key-Value, Document, Column-Family, and Graph stores",
              "Schemaless database designs and CAP theorem implications (Consistency, Availability, Partition tolerance)",
              "Basic architecture, data models, and query mechanisms of Apache HBase, Apache Cassandra, and MongoDB",
              "Partitioning, sharding, replication, and composing analytical calculations over NoSQL datastores"
            ]
          },
          {
            "title": "Fundamentals of HADOOP",
            "teachingHours": 10,
            "subtopics": [
              "Analyzing data at scale with Apache Hadoop",
              "Hadoop Distributed File System (HDFS): NameNode, DataNode, Secondary NameNode, blocks, and replication topology",
              "HDFS command line interface and file operations",
              "Hadoop Streaming and Hadoop Pipes for multi-language execution",
              "Hadoop I/O: Data integrity, compression codecs, serialization formats (Avro, Parquet, SequenceFiles)"
            ]
          },
          {
            "title": "Hadoop Tools: HBase, Cassandra, Pig, and Hive",
            "teachingHours": 10,
            "subtopics": [
              "Apache HBase architecture: RegionServers, ZooKeeper coordination, and column-family storage",
              "Apache Cassandra peer-to-peer gossip protocol and CQL operations",
              "Apache Pig: Architecture, Pig Latin execution environment, data types, and relational operations",
              "Apache Hive: Hive architecture, HiveQL queries, metastore configurations, managed vs external tables, and partitioning"
            ]
          }
        ],
        "labWork": [
          "Setting up a single-node and pseudo-distributed Apache Hadoop cluster in Linux",
          "Performing HDFS file system operations (uploading, retrieving, block status verification)",
          "Writing, compiling, and executing a WordCount MapReduce job in Java / Python Streaming",
          "Installing and executing CRUD operations in MongoDB and Apache Cassandra",
          "Writing and executing Pig Latin scripts for data filtering, grouping, and joining large datasets",
          "Creating Hive databases, schemas, and executing HiveQL queries against external datasets",
          "Executing analytical queries using Apache HBase and integrating with Hadoop"
        ],
        "referenceBooks": [
          "White, Tom, Hadoop: The Definitive Guide (3rd/4th ed.), O'Reilly Media.",
          "Minelli, Michael, Michelle Chambers, and Ambiga Dhiraj, Big Data, Big Analytics: Emerging Business Intelligence and Analytic Trends for Today's Businesses, Wiley.",
          "Sadalage, Pramod J. and Martin Fowler, NoSQL Distilled: A Brief Guide to the Emerging World of Polyglot Persistence, Addison-Wesley Professional.",
          "Sammer, Eric, Hadoop Operations, O'Reilly Media.",
          "George, Lars, HBase: The Definitive Guide, O'Reilly Media."
        ]
      },
      {
        "code": "BIT479CO",
        "name": "Mobile App Development (Track B)",
        "credits": 3,
        "type": "Elective",
        "description": "Mobile application development on Android — UI layouts, activity lifecycles, intents, SQLite databases, REST API consumption, location services, and Google Play Store deployment.",
        "keyUnits": [
          "Introduction to Mobile Devices & Architectures",
          "Mobile Platforms & Wireless Communication Constraints",
          "Introduction to Android Platform (ART, Tools, Manifest)",
          "Android Application Design Essentials (Layouts, Recycler View)",
          "Writing Basic Applications (Context, Activities, Intents)",
          "Data Handling in Android (SQLite, Preferences, Content Providers)",
          "Developing Real-Time Applications (Telephony, RESTful APIs)",
          "Debugging, Testing & Deployment (Play Store Distribution)",
          "Recent Concepts: App Monetization, Location Kit, ML Kit"
        ],
        "syllabusUnits": [
          {
            "title": "Introduction to Mobile Devices & Architectures",
            "teachingHours": 5,
            "subtopics": [
              "History of mobile devices and mobile computing evolution",
              "Modern mobile operating systems: Android, iOS architecture comparison",
              "Hardware architecture of smartphones: SoC, ARM processors, power constraints, sensors, and wireless radios"
            ]
          },
          {
            "title": "Mobile Platforms & Wireless Communication Constraints",
            "teachingHours": 4,
            "subtopics": [
              "Wireless network standards: Wi-Fi, Bluetooth BLE, Cellular (3G/4G/5G)",
              "Mobile communication constraints: intermittent connectivity, latency, battery consumption, and bandwidth throttling",
              "Offline-first mobile application design principles and data synchronization strategies"
            ]
          },
          {
            "title": "Introduction to Android Platform",
            "teachingHours": 5,
            "subtopics": [
              "Android OS architecture: Linux Kernel, Hardware Abstraction Layer (HAL), Android Runtime (ART/Dalvik), Native C/C++ libraries, and Application Framework",
              "Android development tooling: Android Studio, Gradle build system, Android SDK, and ADB",
              "Android Project Anatomy: AndroidManifest.xml, java/kotlin sources, res directory, and Gradle scripts"
            ]
          },
          {
            "title": "Android Application Design Essentials",
            "teachingHours": 6,
            "subtopics": [
              "UI layout components: LinearLayout, RelativeLayout, ConstraintLayout, and FrameLayout",
              "Core UI widgets: TextView, EditText, Button, ImageView, CheckBox, RadioButton, and Spinner",
              "Lists and dynamic collections: RecyclerView, LayoutManagers, ViewHolders, and Custom Adapters",
              "Material Design components, themes, styles, and responsive layout guidelines"
            ]
          },
          {
            "title": "Writing Basic Applications & Core Components",
            "teachingHours": 6,
            "subtopics": [
              "Android core components: Activity, Service, BroadcastReceiver, ContentProvider",
              "Activity lifecycle: onCreate(), onStart(), onResume(), onPause(), onStop(), onDestroy()",
              "Intents and Intent Filters: Explicit vs Implicit Intents, passing bundle data, starting activities for results",
              "Fragments: lifecycle, fragment manager, and tablet/phone adaptive layouts"
            ]
          },
          {
            "title": "Data Handling in Android",
            "teachingHours": 6,
            "subtopics": [
              "Internal and external file storage",
              "SharedPreferences for key-value settings storage",
              "Local structured databases: SQLite database helpers and Android Room ORM library",
              "Content Providers: sharing data between applications and querying system contacts/media"
            ]
          },
          {
            "title": "Developing Real-Time Applications & Networking",
            "teachingHours": 6,
            "subtopics": [
              "Background processing: Threads, Coroutines, WorkManager, and Services",
              "Consuming RESTful APIs using HTTP libraries (Retrofit, OkHttp, Volley) and JSON parsing",
              "Telephony and SMS APIs in Android",
              "Push notifications using Firebase Cloud Messaging (FCM)"
            ]
          },
          {
            "title": "Debugging, Testing & Deployment",
            "teachingHours": 4,
            "subtopics": [
              "Android debugging with Logcat, breakpoints, and Android Profiler (CPU, Memory, Network)",
              "Unit testing with JUnit and UI testing with Espresso",
              "Generating signed APKs and Android App Bundles (AAB)",
              "Google Play Store publishing guidelines, permissions, and app privacy compliance"
            ]
          },
          {
            "title": "Recent Concepts & Advanced Android APIs",
            "teachingHours": 3,
            "subtopics": [
              "Location-based services: Google Maps API, Fused Location Provider, geofencing",
              "On-device machine learning with Google ML Kit",
              "App monetization models: in-app purchases, Google AdMob banner/interstitial ads, and subscriptions"
            ]
          }
        ],
        "labWork": [
          "Setting up Android Studio, configuring virtual devices (AVD), and running a 'Hello World' app",
          "Designing complex responsive UI layouts using ConstraintLayout and Material Design",
          "Implementing multi-screen navigation using Activities, Fragments, and Explicit/Implicit Intents with bundle parameters",
          "Building a dynamic list feed using RecyclerView with custom adapters and item click listeners",
          "Persisting user preferences and application settings using SharedPreferences",
          "Implementing full CRUD operations on a local SQLite / Room database",
          "Consuming a third-party REST API asynchronously using Retrofit, displaying data, and handling loading/error states",
          "Integrating Google Maps API to display user location with custom map markers",
          "Building and testing a complete end-to-end Android application and generating a release APK"
        ],
        "referenceBooks": [
          "Phillips, Bill, Chris Stewart, and Kristin Marsicano, Android Programming: The Big Nerd Ranch Guide (4th ed.), Big Nerd Ranch Guides.",
          "Talukder, Asoke K. and Roopa R. Yavagal, Mobile Computing: Technology, Applications, and Service Creation, McGraw-Hill Communications Engineering.",
          "Collins, Charlie, Michael Galpin, and Matthias Kaeppler, Android in Practice, Manning Publications.",
          "Smyth, Neil, Android Studio Development Essentials, Payload Media."
        ]
      },
      {
        "code": "BIT485CO",
        "name": "Incident Response and Management System (Track C)",
        "credits": 3,
        "type": "Elective",
        "description": "Incident command systems (NEOC/DEOC), early warning alert systems, multi-agency response, disaster recovery portals, and cyber threats to critical infrastructure.",
        "keyUnits": [
          "Introduction to Incident Response Systems (NEOC/DEOC)",
          "Functioning of IRS (Chain of Command, Unified Command)",
          "Resources and Infrastructure Management (Incident Action Plan)",
          "Incident Decision System and Reporting (Early Warning, Media)",
          "Disaster Recovery Portals (DRR Portals, Real-Time Data)",
          "Phases of Disaster Management (Mitigation, Response, Recovery)",
          "Cyber Threats and Disaster Management (DR Sites, Fake News)"
        ],
        "syllabusUnits": [
          {
            "title": "Introduction to Incident Response System",
            "teachingHours": 5,
            "subtopics": [
              "Introduction to Incident Response Systems and Incident Command System (ICS) origins",
              "Incident Response System (IRS) terminology, principles, and characteristics",
              "Organization of National Emergency Operation Centers (NEOC), Provincial Emergency Operation Centers (PEOC), and District Emergency Operation Centers (DEOC) in Nepal"
            ]
          },
          {
            "title": "Functioning of Incident Response System",
            "teachingHours": 6,
            "subtopics": [
              "Chain of command and unity of command principles",
              "Unified Command across multi-agency disaster operations",
              "Management by objectives and operational period planning",
              "Incident action planning (IAP) process and documentation",
              "Span of control management and resource typing"
            ]
          },
          {
            "title": "Resources and Infrastructure Management",
            "teachingHours": 6,
            "subtopics": [
              "Resource management: ordering, mobilizing, tracking, and demobilizing physical and human resources",
              "Incident facility setup: Incident Command Post (ICP), Staging Areas, Bases, Camps, and Helispots",
              "Interoperable communications: frequency coordination, communication plans, and public safety radio networks"
            ]
          },
          {
            "title": "Incident Decision System and Reporting",
            "teachingHours": 6,
            "subtopics": [
              "Incident assessment, situation awareness, and decision support tools",
              "Early Warning Systems (EWS) integration and siren/broadcast network triggers",
              "Multi-agency coordination systems (MACS) and Emergency Support Functions (ESFs)",
              "Public information officer (PIO) role, media briefings, and rumor control during emergencies"
            ]
          },
          {
            "title": "Disaster Recovery Portals & Information Systems",
            "teachingHours": 6,
            "subtopics": [
              "Disaster Risk Reduction (DRR) portals and emergency information repositories in Nepal (Bipad Portal, Sahana)",
              "Real-time sensor data feeds: hydrological river gauges, seismological alerts, weather radar",
              "Crowdsourcing and volunteer-generated data in disaster response",
              "Geographic Information Systems (GIS) for real-time situational mapping"
            ]
          },
          {
            "title": "Phases of Disaster Management",
            "teachingHours": 8,
            "subtopics": [
              "Disaster management cycle: Mitigation, Preparedness, Response, and Recovery",
              "Mitigation strategies: structural and non-structural interventions",
              "Preparedness planning: standard operating procedures (SOPs), simulations, and drills",
              "Emergency search, rescue, triage, and relief distribution operations",
              "Post-disaster needs assessment (PDNA), build-back-better recovery, and critical infrastructure rehabilitation"
            ]
          },
          {
            "title": "Cyber Threats and Disaster Management",
            "teachingHours": 8,
            "subtopics": [
              "Critical information infrastructure (CII) protection during national crises",
              "Cyberattacks targeting emergency services, hospitals, power grids, and telecommunication switches",
              "Disaster recovery sites for emergency operation centers and communication redundancy",
              "Combating fake news, misinformation, and panic on social media during disaster situations"
            ]
          }
        ],
        "referenceBooks": [
          "Faggiano, Vincent, John McNall, and Thomas T. Gillespie, Critical Incident Management: A Complete Response Guide (2nd ed.), CRC Press, New York.",
          "Molino, Louis N. Sr., Emergency Incident Management Systems: Fundamentals and Applications, John Wiley & Sons.",
          "Schnepp, Rob, Ron Vidal, and Chris Hawley, Incident Management for Operations, O'Reilly Media.",
          "Rothstein, Philip Jan, Disaster Recovery Handbook, Amacom, New York.",
          "Government of Nepal, Ministry of Home Affairs, National Emergency Operation Center (NEOC) Standard Operating Procedures."
        ]
      },
      {
        "code": "BIT486CO",
        "name": "Climate Change Risk Management (Track C)",
        "credits": 3,
        "type": "Elective",
        "description": "Climate change science, greenhouse warming physics, climate impacts in Nepal, indicators, extreme weather adaptation, ICT for green growth, and CIRA risk analysis.",
        "keyUnits": [
          "Overview of Climate Change Science",
          "Causes of Climate Change (Greenhouse Effect, Earth Radiative Budget)",
          "Future of Climate Change (GHG Projections, Ocean Acidification)",
          "Climate Change Impacts (Nepal Sectoral Impacts)",
          "Climate Change Indicators (Glacial Lake Outbursts, Phenology)",
          "Climate Change and Extreme Weather Adaptation",
          "ICT for Climate Change and Green Growth",
          "Climate Change Impacts and Risk Analysis (CIRA Framework)"
        ],
        "syllabusUnits": [
          {
            "title": "Overview of Climate Change Science",
            "teachingHours": 5,
            "subtopics": [
              "Weather vs climate, climate system components (Atmosphere, Hydrosphere, Cryosphere, Lithosphere, Biosphere)",
              "Historical climate variability, ice age cycles, and modern anthropogenic warming trends",
              "Intergovernmental Panel on Climate Change (IPCC) assessment reports and global climate treaties (UNFCCC, Paris Agreement)"
            ]
          },
          {
            "title": "Causes of Climate Change",
            "teachingHours": 6,
            "subtopics": [
              "Greenhouse effect physics and Earth's radiative equilibrium budget",
              "Greenhouse gases: Carbon dioxide (CO2), Methane (CH4), Nitrous oxide (N2O), Fluorinated gases, and global warming potential (GWP)",
              "Natural radiative forcing (volcanic aerosols, solar cycles) vs anthropogenic forcing (fossil fuel emissions, deforestation, industrial agriculture)"
            ]
          },
          {
            "title": "Future of Climate Change & Projections",
            "teachingHours": 5,
            "subtopics": [
              "Global Climate Models (GCMs) and Regional Climate Models (RCMs)",
              "IPCC Representative Concentration Pathways (RCPs) and Shared Socioeconomic Pathways (SSPs)",
              "Global temperature rise projections, sea level rise, and ocean acidification"
            ]
          },
          {
            "title": "Climate Change Impacts in Nepal",
            "teachingHours": 6,
            "subtopics": [
              "Himalayan vulnerability: Third Pole warming amplification and snowpack retreat",
              "Impacts on water resources: glacial retreat, streamflow volatility, and hydroelectricity vulnerability",
              "Agricultural impacts: crop yield fluctuations, shifts in agro-ecological zones, and food security",
              "Forestry and biodiversity: species migration, habitat disruption, and forest fires",
              "Public health impacts: vector-borne disease expansion and heat stress"
            ]
          },
          {
            "title": "Climate Change Indicators & Extreme Events",
            "teachingHours": 5,
            "subtopics": [
              "Glacial Lake Outburst Floods (GLOFs) in Nepal: risk factors, monitoring, and early warning drainage",
              "Extreme weather phenomena: erratic monsoons, cloudbursts, intense flash flooding, and prolonged droughts",
              "Phenological shifts in flora and fauna as climate indicators"
            ]
          },
          {
            "title": "Climate Change Adaptation and Disaster Risk Management",
            "teachingHours": 6,
            "subtopics": [
              "Climate change mitigation vs adaptation strategies",
              "Community-Based Adaptation (CBA) and Ecosystem-Based Adaptation (EbA)",
              "Nepal's National Adaptation Plan (NAP) and Local Adaptation Plans for Action (LAPA)",
              "Climate finance mechanisms: Green Climate Fund (GCF), clean development mechanisms, and carbon trading"
            ]
          },
          {
            "title": "ICT for Climate Change and Green Growth",
            "teachingHours": 6,
            "subtopics": [
              "Role of Information and Communication Technology in climate monitoring and green growth",
              "Remote sensing satellite imagery and IoT weather sensor networks for environmental monitoring",
              "Green IT concepts: reducing data center carbon footprint, energy-efficient algorithms, and e-waste management",
              "Smart grids, precision agriculture, and ICT-enabled carbon accounting"
            ]
          },
          {
            "title": "Climate Change Impacts and Risk Analysis (CIRA Framework)",
            "teachingHours": 6,
            "subtopics": [
              "Climate Change Impacts and Risk Analysis (CIRA) framework methodology",
              "Quantitative hazard, vulnerability, and exposure risk assessment models",
              "Cost-benefit analysis of climate adaptation interventions and resilience building"
            ]
          }
        ],
        "referenceBooks": [
          "Houghton, John, Global Warming: The Complete Briefing (5th ed.), Cambridge University Press.",
          "IPCC, Climate Change 2021: The Physical Science Basis. Contribution of Working Group I to the Sixth Assessment Report of the Intergovernmental Panel on Climate Change, Cambridge University Press.",
          "Feenstra, Jan F., Ian Burton, Joel B. Smith, and Richard S. J. Tol, Handbook on Methods for Climate Change Impact Assessment and Adaptation Strategies, UNEP.",
          "O'Neill, M., Green IT for Sustainable Business Practice, British Computer Society.",
          "Kuehr, R. and E. Williams (eds.), Computers and the Environment: Understanding and Managing Their Impacts, Kluwer Academic Publishers."
        ]
      },
      {
        "code": "BIT487CO",
        "name": "Disaster Governance (Track C)",
        "credits": 3,
        "type": "Elective",
        "description": "Digital governance models for disaster risk reduction — knowledge repositories, Sendai Framework, disaster mitigation planning, and emergency response mobilization.",
        "keyUnits": [
          "Overview of Digital Governance in Disaster Management",
          "Knowledge Management in Digital Governance",
          "Overview of Disasters & Sendai Framework",
          "Disaster Governance Effectiveness and SDGs",
          "Governance in Disaster Mitigation (Infrastructure Planning)",
          "Governance in Disaster Preparedness (NSDRM Nepal, Evacuation)",
          "Governance in Disaster Response (Resource Deployment)",
          "Governance in Disaster Recovery (Critical Infrastructure Restoration)"
        ],
        "syllabusUnits": [
          {
            "title": "Overview of Digital Governance in Disaster Management",
            "teachingHours": 5,
            "subtopics": [
              "Definitions and conceptual foundations of disaster governance",
              "Electronic and digital governance models applied to Disaster Risk Reduction (DRR)",
              "Institutional mechanisms: role of central, provincial, and local governments in emergency governance",
              "Public-private partnerships and civic society involvement in disaster resilience"
            ]
          },
          {
            "title": "Knowledge Management in Digital Governance",
            "teachingHours": 5,
            "subtopics": [
              "Knowledge management definitions, cycles, and organizational memory in disaster contexts",
              "Establishing disaster knowledge repositories and open data portals (e.g. Nepal DRR portal)",
              "Information sharing protocols, taxonomies, and cross-agency data standardisation",
              "Lessons-learned mechanisms and post-incident review knowledge transfer"
            ]
          },
          {
            "title": "Overview of Disasters & Sendai Framework",
            "teachingHours": 6,
            "subtopics": [
              "Disaster taxonomy: natural, technological, and complex humanitarian emergencies",
              "The Sendai Framework for Disaster Risk Reduction (2015-2030): four priorities for action and global targets",
              "Hyogo Framework for Action review and progress transition",
              "Aligning national disaster policies with the Sendai Framework"
            ]
          },
          {
            "title": "Disaster Governance Effectiveness and SDGs",
            "teachingHours": 5,
            "subtopics": [
              "Metrics and indicators for evaluating disaster governance effectiveness",
              "Interlinkages between Disaster Risk Reduction and the Sustainable Development Goals (SDGs)",
              "Governance challenges: political will, bureaucratic coordination, resource constraints, and corruption risks in relief funding"
            ]
          },
          {
            "title": "Governance in Disaster Mitigation",
            "teachingHours": 6,
            "subtopics": [
              "Legal and regulatory frameworks for hazard mitigation (building codes, land-use zoning)",
              "Critical infrastructure protection policies and structural resilience regulations",
              "Enforcing disaster safety compliance across private and public sectors",
              "Mainstreaming disaster risk reduction into national economic and development planning"
            ]
          },
          {
            "title": "Governance in Disaster Preparedness",
            "teachingHours": 6,
            "subtopics": [
              "National Strategy for Disaster Risk Management (NSDRM) of Nepal and Disaster Risk Reduction and Management (DRRM) Act 2017",
              "Early warning governance: institutional command, alert dissemination, and SOP protocols",
              "Evacuation planning, emergency stockpiling, and institutional readiness audits",
              "Civil society, community, and volunteer mobilization governance"
            ]
          },
          {
            "title": "Governance in Disaster Response",
            "teachingHours": 6,
            "subtopics": [
              "Command and control governance during emergency operations",
              "Multi-agency coordination: military, police, civil administration, Red Cross, and NGOs",
              "Emergency resource deployment, supply chain oversight, and customs facilitation for international humanitarian aid",
              "Public emergency communications, media briefings, and citizen transparency during crises"
            ]
          },
          {
            "title": "Governance in Disaster Recovery and Reconstruction",
            "teachingHours": 6,
            "subtopics": [
              "Post-Disaster Needs Assessment (PDNA) governance and reconstruction authorities (e.g. National Reconstruction Authority - NRA Nepal)",
              "Build Back Better principles in physical reconstruction and livelihood restoration",
              "Accountability, financial auditing, and anti-corruption safeguards in recovery grants and reconstruction funds",
              "Restoring critical governmental IT infrastructure and public service continuity"
            ]
          }
        ],
        "referenceBooks": [
          "Subramanian, R., Disaster Management, Vikas Publishing House, India.",
          "Bumgarner, Jeffrey B., Emergency Management: A Reference Handbook, ABC-CLIO.",
          "Cahill, Kevin M., More with Less: Disasters in an Era of Diminishing Resources, Fordham University Press.",
          "Birkland, Thomas A., Lessons of Disaster: Policy Change after Catastrophic Events, Georgetown University Press.",
          "Government of Nepal, Disaster Risk Reduction and Management (DRRM) Act, 2017."
        ]
      },
      {
        "code": "BIT453CO",
        "name": "Apprentice Project",
        "credits": 3,
        "type": "Project / Practical",
        "description": "45-hour capstone project developing a 2-tier/3-tier/n-tier application with client-side and server-side scripting on any RDBMS.",
        "keyUnits": [
          "Title Identification & Proposal Writing (10 Marks)",
          "Mid-Term Architecture & DB Design Presentation (20 Marks)",
          "Pre-Final Application Submission & Demo (30 Marks)",
          "Final Documentation (APA Format: 20 Marks), Presentation (10) & Viva (10)"
        ],
        "labWork": [
          "Duration: 45 Lab Hours dedicated capstone project development assigned to every student.",
          "Technology Scope: Complete 2-tier, 3-tier, or n-tier application using client-side scripting, server-side scripting, and any modern RDBMS / SQL database.",
          "Internal Assessment (60 Marks total):",
          "1. Title identification and formal Proposal Writing (10 Marks)",
          "2. Mid-term presentation, architectural design, and database schema demo (20 Marks)",
          "3. Pre-final application submission, code demonstration, and internal presentation (30 Marks)",
          "External Assessment (40 Marks total):",
          "1. Final Project Documentation in APA Format (20 Marks)",
          "2. Final Presentation before University External Examiner (10 Marks)",
          "3. Oral Viva Voce examination (10 Marks)"
        ],
        "referenceBooks": [
          "American Psychological Association, Publication Manual of the American Psychological Association (7th ed.), 2020.",
          "Pressman, Roger S. and Bruce R. Maxim, Software Engineering: A Practitioner's Approach, McGraw-Hill.",
          "Purbanchal University, Faculty of Science & Technology, Guidelines for Apprentice Capstone Project Documentation."
        ]
      }
    ]
  }
];
