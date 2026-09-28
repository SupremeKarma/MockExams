export interface PastPaperQuestion {
  id: string;
  group: string;
  marks: number;
  questionText: string;
  orQuestionText?: string;
  solutionSummary: string;
  chapterRef: string;
}

export interface FullPastPaper {
  id: string;
  semester: number;
  subject: string;
  subjectCode: string;
  year: number;
  totalMarks: number;
  passMarks: number;
  timeHours: number;
  questions: PastPaperQuestion[];
}

export const bitPastPapersData: FullPastPaper[] = [
  // ── Semester 1 ──
  {
    id: "sem1-c-2024",
    semester: 1,
    subject: "Programming in C",
    subjectCode: "BIT105",
    year: 2024,
    totalMarks: 80,
    passMarks: 32,
    timeHours: 3,
    questions: [
      {
        id: "c-24-1",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "What is dynamic memory allocation? Differentiate between malloc(), calloc(), realloc(), and free() with memory layout diagrams and code snippets.",
        orQuestionText: "Explain pointers and pointer arithmetic in C. Write a program to sort an array of integers using pointers.",
        solutionSummary: "malloc allocates uninitialized heap memory; calloc zero-initializes contiguous blocks. realloc resizes existing allocations. free returns memory to avoid leaks.",
        chapterRef: "Unit 6: Pointers & Dynamic Memory"
      },
      {
        id: "c-24-2",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Explain recursion with an example. Write a recursive C program to solve the Tower of Hanoi problem for N disks.",
        solutionSummary: "Recursive base condition halts stack execution. Time complexity T(n) = 2^n - 1 moves.",
        chapterRef: "Unit 5: Functions & Recursion"
      },
      {
        id: "c-24-3",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Differentiate between Structures and Unions with memory alignment examples.",
        solutionSummary: "Structures allocate distinct memory for all members. Unions share a single memory block sized to the largest member.",
        chapterRef: "Unit 7: Structures & Unions"
      },
      {
        id: "c-24-4",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Explain file handling modes 'r', 'w', 'a', 'rb', and 'wb' in C with error handling using feof() and ferror().",
        solutionSummary: "fopen() returns FILE pointer; fopen fails return NULL; fclose flushes buffer.",
        chapterRef: "Unit 8: File Management"
      }
    ]
  },
  {
    id: "sem1-fit-2024",
    semester: 1,
    subject: "Fundamentals of IT",
    subjectCode: "BIT101",
    year: 2024,
    totalMarks: 80,
    passMarks: 32,
    timeHours: 3,
    questions: [
      {
        id: "fit-24-1",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Describe the Von Neumann computer architecture. Explain the role of ALU, Control Unit, and the Fetch-Decode-Execute instruction cycle.",
        solutionSummary: "Stored-program concept where instructions and data share unified memory bus. CPU registers PC, MAR, MDR, IR govern execution.",
        chapterRef: "Unit 1: Computer Architecture & Organization"
      },
      {
        id: "fit-24-2",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Perform number conversions: (a) (347.625)10 to Octal (b) (AF2.C)16 to Binary and Decimal.",
        solutionSummary: "Successive division/multiplication by 8 for decimal-to-octal. 4-bit nibble grouping for hexadecimal-to-binary.",
        chapterRef: "Unit 2: Number Systems & Boolean Logic"
      },
      {
        id: "fit-24-3",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "What is an Operating System? Differentiate between Preemptive and Non-Preemptive CPU scheduling algorithms.",
        solutionSummary: "OS manages hardware resources. Preemptive (Round Robin, SRTF) interrupts running processes; Non-preemptive (FCFS, SJF) executes until completion.",
        chapterRef: "Unit 3: Operating Systems Fundamentals"
      }
    ]
  },
  {
    id: "sem1-math-2024",
    semester: 1,
    subject: "Mathematics-I",
    subjectCode: "BIT102",
    year: 2024,
    totalMarks: 80,
    passMarks: 32,
    timeHours: 3,
    questions: [
      {
        id: "m1-24-1",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "State and prove Rolle's Theorem and Lagrange's Mean Value Theorem. Verify LMVT for f(x) = x^3 - 5x^2 - 3x in [1, 3].",
        solutionSummary: "Continuous on [a,b], differentiable on (a,b). There exists c in (a,b) where f'(c) = [f(b)-f(a)]/(b-a).",
        chapterRef: "Unit 2: Differential Calculus & Theorems"
      },
      {
        id: "m1-24-2",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Evaluate the indeterminate limit: lim(x->0) (e^x - e^(-x) - 2x) / (x - sin x) using L'Hopital's Rule.",
        solutionSummary: "Applying L'Hopital's rule twice yields 2.",
        chapterRef: "Unit 1: Limits & Continuity"
      }
    ]
  },
  {
    id: "sem1-techcomm-2024",
    semester: 1,
    subject: "Technical Communication",
    subjectCode: "BIT103",
    year: 2024,
    totalMarks: 80,
    passMarks: 32,
    timeHours: 3,
    questions: [
      {
        id: "tc-24-1",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Draft a formal technical proposal for implementing an AI-Powered Spaced Repetition Mock Exam System for Purbanchal University colleges.",
        solutionSummary: "Includes Executive Summary, Problem Statement, Technical Architecture, Milestones, Budget, and Deliverables.",
        chapterRef: "Unit 4: Formal Proposals & Reports"
      }
    ]
  },
  {
    id: "sem1-ethics-2024",
    semester: 1,
    subject: "Society and Ethics in IT",
    subjectCode: "BIT104",
    year: 2024,
    totalMarks: 80,
    passMarks: 32,
    timeHours: 3,
    questions: [
      {
        id: "se-24-1",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Analyze Nepal's Electronic Transactions Act (ETA 2063). Discuss cyber crimes, digital signatures, and intellectual property rights.",
        solutionSummary: "Legal recognition of electronic records, cyber crime penalties under Sections 44-59.",
        chapterRef: "Unit 3: Cyber Law & ETA 2063"
      }
    ]
  },

  // ── Semester 2 ──
  {
  "id": "sem2-math2-2025",
  "semester": 2,
  "subject": "Mathematics-II",
  "subjectCode": "BIT151HS",
  "year": 2025,
  "totalMarks": 80,
  "passMarks": 32,
  "timeHours": 3,
  "questions": [
    {
      "id": "m2-25-1",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Evaluate: $\\int_0^a \\int_0^b (x^2 + y^2) \\, dx \\, dy$",
      "solutionSummary": "Evaluating inner integral with respect to $x$: $\\int_0^b (x^2 + y^2) \\, dx = \\left[ \\frac{x^3}{3} + y^2 x \\right]_0^b = \\frac{b^3}{3} + b y^2$. Integrating with respect to $y$: $\\int_0^a \\left(\\frac{b^3}{3} + b y^2\\right) \\, dy = \\left[ \\frac{b^3 y}{3} + \\frac{b y^3}{3} \\right]_0^a = \\frac{a b^3 + a^3 b}{3} = \\frac{ab(a^2 + b^2)}{3}$.",
      "chapterRef": "Unit 1: Multiple Integrals (Double & Polar)"
    },
    {
      "id": "m2-25-2",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Evaluate: $\\int_0^1 \\int_0^2 \\int_0^3 xyz \\, dx \\, dy \\, dz$",
      "solutionSummary": "Since limits are constants and integrand factors: $I = \\left(\\int_0^3 x \\, dx\\right) \\left(\\int_0^2 y \\, dy\\right) \\left(\\int_0^1 z \\, dz\\right) = \\left[\\frac{x^2}{2}\\right]_0^3 \\times \\left[\\frac{y^2}{2}\\right]_0^2 \\times \\left[\\frac{z^2}{2}\\right]_0^1 = \\frac{9}{2} \\times 2 \\times \\frac{1}{2} = \\frac{9}{2} = 4.5$.",
      "chapterRef": "Unit 1: Triple Integrals & Applications"
    },
    {
      "id": "m2-25-3",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Solve: $\\sqrt{1 - x^2} \\, dy + \\sqrt{1 - y^2} \\, dx = 0$",
      "solutionSummary": "Separating variables: $\\frac{dy}{\\sqrt{1 - y^2}} + \\frac{dx}{\\sqrt{1 - x^2}} = 0$. Integrating both sides: $\\sin^{-1} y + \\sin^{-1} x = C$. Taking sine of both sides: $x\\sqrt{1 - y^2} + y\\sqrt{1 - x^2} = c$ (where $c = \\sin C$).",
      "chapterRef": "Unit 2: Differential Equations of First Order"
    },
    {
      "id": "m2-25-4",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Solve: $P^2 - y^2 = 0 \\quad \\text{where } P = \\frac{dy}{dx}$",
      "solutionSummary": "Factoring: $(P - y)(P + y) = 0$. Case 1: $\\frac{dy}{dx} = y \\implies \\frac{dy}{y} = dx \\implies \\ln|y| = x + c_1 \\implies y - C_1 e^x = 0$. Case 2: $\\frac{dy}{dx} = -y \\implies \\frac{dy}{y} = -dx \\implies \\ln|y| = -x + c_2 \\implies y - C_2 e^{-x} = 0$. Combined general solution: $(y - c e^x)(y - c e^{-x}) = 0$.",
      "chapterRef": "Unit 2: Differential Equations of First Order"
    },
    {
      "id": "m2-25-5",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Solve: $y'' - 3y' + 2y = 0$",
      "solutionSummary": "Auxiliary equation: $m^2 - 3m + 2 = 0 \\implies (m - 1)(m - 2) = 0 \\implies m_1 = 1, m_2 = 2$. Since roots are real and distinct, general complementary function is: $y = c_1 e^x + c_2 e^{2x}$.",
      "chapterRef": "Unit 3: Higher-Order Linear ODEs"
    },
    {
      "id": "m2-25-6",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Define even and odd function with examples.",
      "solutionSummary": "A function $f(x)$ is **even** if $f(-x) = f(x)$ for all $x$ (symmetric about the $y$-axis, e.g. $f(x) = x^2, \\cos x$; Fourier series has $b_n = 0$). A function is **odd** if $f(-x) = -f(x)$ (symmetric about origin $(0,0)$, e.g. $f(x) = x^3, \\sin x$; Fourier series has $a_0 = a_n = 0$).",
      "chapterRef": "Unit 4: Fourier Series (Period 2pi & 2L)"
    },
    {
      "id": "m2-25-7",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Express the function $f(z) = e^z$ in the form of $u(x, y) + i v(x, y)$.",
      "solutionSummary": "Let $z = x + iy$. Then $f(z) = e^{x + iy} = e^x \\cdot e^{iy}$. By Euler's formula: $e^{iy} = \\cos y + i \\sin y$. Thus $f(z) = (e^x \\cos y) + i (e^x \\sin y)$, yielding real part $u(x, y) = e^x \\cos y$ and imaginary part $v(x, y) = e^x \\sin y$.",
      "chapterRef": "Unit 5: Functions of a Complex Variable"
    },
    {
      "id": "m2-25-8",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Find the derivative of $z^2$ at $z = z_0$.",
      "solutionSummary": "By first principles: $f'(z_0) = \\lim_{\\Delta z \\to 0} \\frac{(z_0 + \\Delta z)^2 - z_0^2}{\\Delta z} = \\lim_{\\Delta z \\to 0} \\frac{2z_0 \\Delta z + (\\Delta z)^2}{\\Delta z} = \\lim_{\\Delta z \\to 0} (2z_0 + \\Delta z) = 2z_0$.",
      "chapterRef": "Unit 5: Functions of a Complex Variable"
    },
    {
      "id": "m2-25-9",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Find the zeros of the function $f(z) = (z - 3)\\sin\\left(\\frac{1}{z - 2}\\right)$.",
      "solutionSummary": "Zeros occur when $f(z) = 0$. Either $z - 3 = 0 \\implies z = 3$ (simple zero of order 1), or $\\sin\\left(\\frac{1}{z-2}\\right) = 0 \\implies \\frac{1}{z-2} = n\\pi \\implies z = 2 + \\frac{1}{n\\pi}$ for $n \\in \\mathbb{Z} \\setminus \\{0\\}$. ($z = 2$ is an essential singularity and limit point of zeros).",
      "chapterRef": "Unit 6: Laurent Series & Singularities"
    },
    {
      "id": "m2-25-10",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Determine the order of the pole of the function $f(z) = \\frac{\\sinh z}{z^5}$.",
      "solutionSummary": "Maclaurin expansion: $\\sinh z = z + \\frac{z^3}{6} + \\frac{z^5}{120} + \\dots$ Dividing by $z^5$: $f(z) = \\frac{1}{z^4} + \\frac{1}{6z^2} + \\frac{1}{120} + \\dots$ The highest negative power of $z$ in the Laurent series is $z^{-4}$, so $z = 0$ is a **pole of order 4**.",
      "chapterRef": "Unit 6: Laurent Series & Singularities"
    },
    {
      "id": "m2-25-11",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Define the Fourier integral of the function. Find the Fourier integral of the function: $f(x) = x$ for $|x| < 1$, and $0$ for $|x| > 1$.",
      "solutionSummary": "Fourier integral formula: $f(x) = \\frac{1}{\\pi} \\int_0^\\infty [A(\\lambda) \\cos(\\lambda x) + B(\\lambda) \\sin(\\lambda x)] \\, d\\lambda$. Since $f(x)$ is odd, $A(\\lambda) = 0$. $B(\\lambda) = 2\\int_0^1 t \\sin(\\lambda t) \\, dt = 2\\left[ -\\frac{t\\cos(\\lambda t)}{\\lambda} + \\frac{\\sin(\\lambda t)}{\\lambda^2} \\right]_0^1 = \\frac{2(\\sin\\lambda - \\lambda \\cos\\lambda)}{\\lambda^2}$. Thus: $f(x) = \\frac{2}{\\pi} \\int_0^\\infty \\left( \\frac{\\sin\\lambda - \\lambda \\cos\\lambda}{\\lambda^2} \\right) \\sin(\\lambda x) \\, d\\lambda$.",
      "chapterRef": "Unit 4: Fourier Integrals & Transforms"
    },
    {
      "id": "m2-25-12",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Solve: $y' - 2y - 4x = 0 \\quad \\text{with } y(0) = 1$",
      "solutionSummary": "Standard form: $\\frac{dy}{dx} - 2y = 4x$. Integrating factor: $\\text{I.F.} = e^{\\int -2 \\, dx} = e^{-2x}$. General solution: $y e^{-2x} = \\int 4x e^{-2x} \\, dx = -2x e^{-2x} - e^{-2x} + C \\implies y = -2x - 1 + C e^{2x}$. Applying initial condition $y(0) = 1 \\implies 1 = -1 + C \\implies C = 2$. Particular solution: $y(x) = 2e^{2x} - 2x - 1$.",
      "chapterRef": "Unit 2: Linear, Bernoulli & Clairaut Equations"
    },
    {
      "id": "m2-25-13",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Find the general solution of the differential equation: $\\frac{d^2 y}{dx^2} - 13 \\frac{dy}{dx} + 12y = e^{-2x}$",
      "solutionSummary": "Auxiliary equation: $m^2 - 13m + 12 = 0 \\implies (m - 1)(m - 12) = 0 \\implies m_1 = 1, m_2 = 12$. Complementary function: $y_c = c_1 e^x + c_2 e^{12x}$. Particular integral: $y_p = \\frac{1}{D^2 - 13D + 12} e^{-2x} = \\frac{e^{-2x}}{(-2)^2 - 13(-2) + 12} = \\frac{e^{-2x}}{42}$. General solution: $y = c_1 e^x + c_2 e^{12x} + \\frac{e^{-2x}}{42}$.",
      "chapterRef": "Unit 3: Higher-Order Linear ODEs"
    },
    {
      "id": "m2-25-14",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Find the Fourier series for the function: $f(x) = x^2, \\quad 0 \\le x \\le \\pi$.",
      "solutionSummary": "In $[0, \\pi]$, half-range cosine series has $b_n = 0$. $a_0 = \\frac{2}{\\pi} \\int_0^\\pi x^2 \\, dx = \\frac{2\\pi^2}{3} \\implies \\frac{a_0}{2} = \\frac{\\pi^2}{3}$. Integrating by parts twice: $a_n = \\frac{2}{\\pi} \\int_0^\\pi x^2 \\cos(nx) \\, dx = \\frac{4(-1)^n}{n^2}$. Fourier series: $x^2 = \\frac{\\pi^2}{3} + 4 \\sum_{n=1}^\\infty \\frac{(-1)^n}{n^2} \\cos(nx)$.",
      "chapterRef": "Unit 4: Fourier Series (Period 2pi & 2L)"
    },
    {
      "id": "m2-25-15",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Obtain the half-range cosine series for $f(x) = \\sin x$ in $0 \\le x \\le \\pi$ and hence show that $\\sum_{n=1}^\\infty \\frac{1}{4n^2 - 1} = \\frac{1}{2}$.",
      "solutionSummary": "Half-range cosine coefficients: $a_0 = \\frac{2}{\\pi} \\int_0^\\pi \\sin x \\, dx = \\frac{4}{\\pi} \\implies \\frac{a_0}{2} = \\frac{2}{\\pi}$. $a_1 = 0$; for $n > 1$: $a_n = -\\frac{4}{\\pi(n^2 - 1)}$ for even $n = 2m$, and $0$ for odd $n$. Thus: $\\sin x = \\frac{2}{\\pi} - \\frac{4}{\\pi} \\sum_{m=1}^\\infty \\frac{\\cos(2mx)}{4m^2 - 1}$. At $x = 0$: $0 = \\frac{2}{\\pi} - \\frac{4}{\\pi} \\sum_{m=1}^\\infty \\frac{1}{4m^2 - 1} \\implies \\sum_{m=1}^\\infty \\frac{1}{4m^2 - 1} = \\frac{1}{2}$.",
      "chapterRef": "Unit 4: Half-Range Series & Parseval's Identity"
    },
    {
      "id": "m2-25-16",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Verify Cauchy-Riemann equation for the function: $f(z) = e^x(\\cos y + i \\sin y)$.",
      "solutionSummary": "Here $u = e^x \\cos y, v = e^x \\sin y$. Partial derivatives: $u_x = e^x \\cos y, u_y = -e^x \\sin y, v_x = e^x \\sin y, v_y = e^x \\cos y$. Then $u_x = v_y = e^x \\cos y$ and $u_y = -v_x = -e^x \\sin y$. Both Cauchy-Riemann equations hold everywhere on $\\mathbb{C}$, confirming $f(z) = e^z$ is analytic.",
      "chapterRef": "Unit 5: Cauchy-Riemann Equations (Cartesian & Polar)"
    },
    {
      "id": "m2-25-17",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Find the Laurent's series for $f(z) = \\frac{1}{(1 - z)(z + 2)}$ valid for the domain $1 < |z| < 2$.",
      "solutionSummary": "Partial fractions: $f(z) = \\frac{1/3}{1 - z} + \\frac{1/3}{z + 2}$. For $|z| > 1$: $\\frac{1}{1 - z} = -\\frac{1}{z}\\left(1 - \\frac{1}{z}\\right)^{-1} = -\\sum_{n=1}^\\infty \\frac{1}{z^n}$. For $|z| < 2$: $\\frac{1}{z + 2} = \\frac{1}{2}\\left(1 + \\frac{z}{2}\\right)^{-1} = \\sum_{n=0}^\\infty \\frac{(-1)^n z^n}{2^{n+1}}$. Combined Laurent series: $f(z) = -\\frac{1}{3} \\sum_{n=1}^\\infty \\frac{1}{z^n} + \\frac{1}{3} \\sum_{n=0}^\\infty \\frac{(-1)^n}{2^{n+1}} z^n$.",
      "chapterRef": "Unit 6: Laurent Series & Singularities"
    },
    {
      "id": "m2-25-18",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Solve: $x \\frac{dy}{dx} + 2y = x^2 \\log x$",
      "solutionSummary": "Dividing by $x$: $\\frac{dy}{dx} + \\frac{2}{x}y = x \\log x$. Integrating factor: $\\text{I.F.} = e^{\\int \\frac{2}{x}\\,dx} = x^2$. Solution: $y \\cdot x^2 = \\int x^3 \\log x \\, dx + C$. By integration by parts ($u = \\log x, v = x^4/4$): $y x^2 = \\frac{x^4}{4}\\log x - \\frac{x^4}{16} + C \\implies y(x) = \\frac{x^2}{4}\\log x - \\frac{x^2}{16} + \\frac{C}{x^2}$.",
      "chapterRef": "Unit 2: Linear, Bernoulli & Clairaut Equations"
    },
    {
      "id": "m2-25-19",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Find by double integration, the area which lies inside the cardioid $r = a(1 + \\cos\\theta)$ and outside the circle $r = a$.",
      "solutionSummary": "Intersection points: $a(1 + \\cos\\theta) = a \\implies \\cos\\theta = 0 \\implies \\theta = -\\pi/2$ to $\\pi/2$. By symmetry about initial line: $\\text{Area} = 2 \\int_0^{\\pi/2} \\int_a^{a(1 + \\cos\\theta)} r \\, dr \\, d\\theta = a^2 \\int_0^{\\pi/2} (2\\cos\\theta + \\cos^2\\theta) \\, d\\theta = a^2 \\left[ 2 + \\frac{\\pi}{4} \\right] = \\frac{a^2(8 + \\pi)}{4} \\text{ sq. units}$.",
      "chapterRef": "Unit 1: Multiple Integrals (Double & Polar)"
    },
    {
      "id": "m2-25-20",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Solve: $\\frac{d^2 y}{dx^2} - 2 \\frac{dy}{dx} + 5y = 10 \\sin x$",
      "solutionSummary": "Auxiliary equation: $m^2 - 2m + 5 = 0 \\implies m = 1 \\pm 2i$. Complementary function: $y_c = e^x(c_1 \\cos 2x + c_2 \\sin 2x)$. Particular integral: $y_p = \\frac{1}{D^2 - 2D + 5}(10\\sin x) = \\frac{10\\sin x}{-1 - 2D + 5} = \\frac{5(2 + D)}{4 - D^2}\\sin x = \\frac{5(2\\sin x + \\cos x)}{5} = 2\\sin x + \\cos x$. General solution: $y = e^x(c_1 \\cos 2x + c_2 \\sin 2x) + 2\\sin x + \\cos x$.",
      "chapterRef": "Unit 3: Higher-Order Linear ODEs"
    },
    {
      "id": "m2-25-21",
      "group": "Group C (5 Marks)",
      "marks": 5,
      "questionText": "Solve: $\\frac{dy}{dx} = \\frac{x + 2y - 3}{2x + y - 3}$",
      "solutionSummary": "Substitute $x = X + 1, y = Y + 1$ to reduce to homogeneous form $\\frac{dY}{dX} = \\frac{X + 2Y}{2X + Y}$. Let $Y = vX$: $v + X\\frac{dv}{dX} = \\frac{1 + 2v}{2 + v} \\implies \\frac{2 + v}{1 - v^2}\\,dv = \\frac{dX}{X}$. Partial fractions integration yields $\\frac{1 + v}{(1 - v)^3} = C_1 X^2 \\implies X + Y = C(X - Y)^3$. Substituting $X = x - 1, Y = y - 1$: $x + y - 2 = C(x - y)^3$.",
      "chapterRef": "Unit 2: Differential Equations of First Order"
    },
    {
      "id": "m2-25-22",
      "group": "Group C (5 Marks)",
      "marks": 5,
      "questionText": "Find the general solution of the differential equation: $\\frac{d^2 y}{dx^2} - 2 \\frac{dy}{dx} + 4y = e^x \\sin x$",
      "solutionSummary": "Auxiliary equation: $m^2 - 2m + 4 = 0 \\implies m = 1 \\pm i\\sqrt{3}$. Complementary function: $y_c = e^x[c_1 \\cos(\\sqrt{3}x) + c_2 \\sin(\\sqrt{3}x)]$. Particular integral using exponential shift: $y_p = e^x \\frac{1}{(D + 1)^2 - 2(D + 1) + 4}\\sin x = e^x \\frac{1}{D^2 + 3}\\sin x = e^x \\frac{\\sin x}{-1 + 3} = \\frac{1}{2} e^x \\sin x$. General solution: $y = e^x[c_1 \\cos(\\sqrt{3}x) + c_2 \\sin(\\sqrt{3}x)] + \\frac{1}{2} e^x \\sin x$.",
      "chapterRef": "Unit 3: Higher-Order Linear ODEs"
    },
    {
      "id": "m2-25-23",
      "group": "Group C (5 Marks)",
      "marks": 5,
      "questionText": "Obtain the Fourier series for: $f(x) = x$ for $-1 < x \\le 0$, and $x + 2$ for $0 < x \\le 1$.",
      "solutionSummary": "Period $2L = 2 \\implies L = 1$. $a_0 = \\int_{-1}^0 x \\, dx + \\int_0^1 (x + 2) \\, dx = -1/2 + 5/2 = 2 \\implies \\frac{a_0}{2} = 1$. $a_n = \\int_{-1}^1 x\\cos(n\\pi x)\\,dx + 2\\int_0^1 \\cos(n\\pi x)\\,dx = 0$. $b_n = 2\\int_0^1 x\\sin(n\\pi x)\\,dx + 2\\int_0^1 \\sin(n\\pi x)\\,dx = \\frac{2[1 - 2(-1)^n]}{n\\pi}$. Fourier series: $f(x) = 1 + \\frac{2}{\\pi} \\sum_{n=1}^\\infty \\frac{1 - 2(-1)^n}{n} \\sin(n\\pi x)$.",
      "chapterRef": "Unit 4: Fourier Series (Period 2pi & 2L)"
    },
    {
      "id": "m2-25-24",
      "group": "Group C (5 Marks)",
      "marks": 5,
      "questionText": "Find an analytic function $f(z)$ whose real part is $u(x, y) = e^x \\sin y$.",
      "solutionSummary": "Given $u = e^x \\sin y \\implies u_x = e^x \\sin y, u_y = e^x \\cos y$. By Milne-Thomson Method: $f'(z) = u_x(z, 0) - i u_y(z, 0) = 0 - i(e^z \\cdot 1) = -i e^z$. Integrating with respect to $z$: $f(z) = \\int -i e^z \\, dz = -i e^z + C$. (Expanding: $-i e^{x + iy} = e^x \\sin y - i e^x \\cos y$, confirming real part $u = e^x \\sin y$).",
      "chapterRef": "Unit 5: Harmonic Functions & Milne-Thomson Method"
    },
    {
      "id": "m2-25-25",
      "group": "Group C (5 Marks)",
      "marks": 5,
      "questionText": "Find the residue of $f(z) = \\frac{3z - 4}{z(z - 1)(z - 2)}$ at each of its poles.",
      "solutionSummary": "Poles are all simple poles at $z = 0, 1, 2$. $\\text{Res}(f, 0) = \\lim_{z \\to 0} z f(z) = \\frac{-4}{(-1)(-2)} = -2$. $\\text{Res}(f, 1) = \\lim_{z \\to 1} (z - 1) f(z) = \\frac{3 - 4}{1(1 - 2)} = \\frac{-1}{-1} = 1$. $\\text{Res}(f, 2) = \\lim_{z \\to 2} (z - 2) f(z) = \\frac{6 - 4}{2(2 - 1)} = \\frac{2}{2} = 1$. (Check: $\\sum \\text{Res} = -2 + 1 + 1 = 0$).",
      "chapterRef": "Unit 6: Residue Theorem & Trigonometric Contours"
    }
  ]
},
  {
  "id": "sem2-math2-2024",
  "semester": 2,
  "subject": "Mathematics-II",
  "subjectCode": "BIT151HS",
  "year": 2024,
  "totalMarks": 80,
  "passMarks": 32,
  "timeHours": 3,
  "questions": [
    {
      "id": "m2-24-1",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Evaluate: $\\int_0^a \\int_0^a \\int_0^a (x + y + z) \\, dx \\, dy \\, dz$",
      "solutionSummary": "By symmetry over the cube $[0, a]^3$, $\\iiint x \\, dx\\,dy\\,dz = \\left(\\int_0^a x\\,dx\\right) a^2 = \\frac{a^4}{2}$. Since each term contributes equally: $\\int_0^a \\int_0^a \\int_0^a (x + y + z) \\, dx \\, dy \\, dz = 3 \\times \\frac{a^4}{2} = \\frac{3a^4}{2}$.",
      "chapterRef": "Unit 1: Triple Integrals & Applications"
    },
    {
      "id": "m2-24-2",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Evaluate the integral by changing the order of integration: $\\int_0^\\infty \\int_x^\\infty \\frac{e^{-y}}{y} \\, dy \\, dx$",
      "solutionSummary": "The region is $0 \\le x \\le y < \\infty$. Reversing order of integration: $x$ runs from $0$ to $y$ while $y$ runs from $0$ to $\\infty$. The integral becomes $\\int_0^\\infty \\int_0^y \\frac{e^{-y}}{y} \\, dx \\, dy = \\int_0^\\infty \\frac{e^{-y}}{y} [x]_0^y \\, dy = \\int_0^\\infty e^{-y} \\, dy = [-e^{-y}]_0^\\infty = 1$.",
      "chapterRef": "Unit 1: Multiple Integrals (Double & Polar)"
    },
    {
      "id": "m2-24-3",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Determine the order and degree of the differential equation: $\\sqrt{\\frac{d^3 y}{dx^3}} = \\frac{dy}{dx}$",
      "solutionSummary": "Squaring both sides to eliminate fractional powers on derivatives yields $\\frac{d^3 y}{dx^3} = \\left(\\frac{dy}{dx}\\right)^2$. The highest derivative is $\\frac{d^3 y}{dx^3}$ (order 3), and its power is 1 (degree 1). Thus, $\\text{Order} = 3, \\text{Degree} = 1$.",
      "chapterRef": "Unit 2: Differential Equations of First Order"
    },
    {
      "id": "m2-24-4",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Solve: $(x + 1) \\, dy = (y - 1) \\, dx$",
      "solutionSummary": "Separating variables: $\\frac{dy}{y - 1} = \\frac{dx}{x + 1}$. Integrating both sides: $\\ln|y - 1| = \\ln|x + 1| + \\ln C \\implies y - 1 = C (x + 1)$, or $y = C(x + 1) + 1$.",
      "chapterRef": "Unit 2: Differential Equations of First Order"
    },
    {
      "id": "m2-24-5",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Solve: $\\frac{d^2 y}{dx^2} - 4 \\frac{dy}{dx} + 13 y = 0$",
      "solutionSummary": "Auxiliary equation: $m^2 - 4m + 13 = 0 \\implies m = \\frac{4 \\pm \\sqrt{16 - 52}}{2} = 2 \\pm 3i$. The general solution is $y = e^{2x} (c_1 \\cos 3x + c_2 \\sin 3x)$.",
      "chapterRef": "Unit 3: Higher-Order Linear ODEs"
    },
    {
      "id": "m2-24-6",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Determine whether the function $f(x) = \\log\\left|\\frac{1 - x}{1 + x}\\right|$ is even or odd.",
      "solutionSummary": "Evaluating at $-x$: $f(-x) = \\log\\left|\\frac{1 - (-x)}{1 + (-x)}\\right| = \\log\\left|\\frac{1 + x}{1 - x}\\right| = \\log\\left|\\left(\\frac{1 - x}{1 + x}\\right)^{-1}\\right| = -\\log\\left|\\frac{1 - x}{1 + x}\\right| = -f(x)$. Since $f(-x) = -f(x)$, $f(x)$ is an odd function.",
      "chapterRef": "Unit 4: Fourier Series (Period 2pi & 2L)"
    },
    {
      "id": "m2-24-7",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Express the function $f(z) = \\sin z$ in the form of $u(x, y) + i v(x, y)$.",
      "solutionSummary": "Let $z = x + iy$. Then $\\sin z = \\sin(x + iy) = \\sin x \\cos(iy) + \\cos x \\sin(iy)$. Using $\\cos(iy) = \\cosh y$ and $\\sin(iy) = i \\sinh y$, we have $f(z) = (\\sin x \\cosh y) + i (\\cos x \\sinh y)$. Thus $u(x, y) = \\sin x \\cosh y$ and $v(x, y) = \\cos x \\sinh y$.",
      "chapterRef": "Unit 5: Functions of a Complex Variable"
    },
    {
      "id": "m2-24-8",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "If $f(z)$ is differentiable at $z_0$, then show that $f(z)$ is continuous at $z = z_0$.",
      "solutionSummary": "Since $f'(z_0) = \\lim_{z \\to z_0} \\frac{f(z) - f(z_0)}{z - z_0}$ exists, $\\lim_{z \\to z_0} [f(z) - f(z_0)] = \\lim_{z \\to z_0} \\left[ \\frac{f(z) - f(z_0)}{z - z_0} \\right] \\cdot \\lim_{z \\to z_0} (z - z_0) = f'(z_0) \\cdot 0 = 0$. Hence $\\lim_{z \\to z_0} f(z) = f(z_0)$, proving continuity.",
      "chapterRef": "Unit 5: Functions of a Complex Variable"
    },
    {
      "id": "m2-24-9",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Find the zeros of the function $f(z) = \\left(\\frac{z + 2}{z^2 + 1}\\right)^3$.",
      "solutionSummary": "Zeros occur where the numerator vanishes while the denominator is non-zero: $(z + 2)^3 = 0 \\implies z = -2$. Denominator $((-2)^2 + 1)^3 = 125 \\ne 0$. Thus $z = -2$ is a zero of order 3.",
      "chapterRef": "Unit 6: Laurent Series & Singularities"
    },
    {
      "id": "m2-24-10",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Show that the function $f(z) = \\frac{z^2 - 2z + 5}{z - 2}$ has a simple pole at $z = 2$.",
      "solutionSummary": "Evaluating $\\lim_{z \\to 2} (z - 2) f(z) = \\lim_{z \\to 2} (z^2 - 2z + 5) = 4 - 4 + 5 = 5 \\ne 0$. Since this limit is a non-zero finite value, $z = 2$ is a simple pole (pole of order 1) with residue 5.",
      "chapterRef": "Unit 6: Laurent Series & Singularities"
    },
    {
      "id": "m2-24-11",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Evaluate: $\\iint_R xy \\, dx \\, dy$ where $R$ is the positive quadrant of the circle $x^2 + y^2 = a^2$.",
      "solutionSummary": "In polar coordinates $x = r \\cos\\theta, y = r \\sin\\theta, dx\\,dy = r\\,dr\\,d\\theta$ where $0 \\le r \\le a$ and $0 \\le \\theta \\le \\pi/2$: $I = \\int_0^{\\pi/2} \\sin\\theta \\cos\\theta \\, d\\theta \\int_0^a r^3 \\, dr = \\left[ \\frac{\\sin^2\\theta}{2} \\right]_0^{\\pi/2} \\left[ \\frac{r^4}{4} \\right]_0^a = \\frac{1}{2} \\times \\frac{a^4}{4} = \\frac{a^4}{8}$.",
      "chapterRef": "Unit 1: Multiple Integrals (Double & Polar)"
    },
    {
      "id": "m2-24-12",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Solve: $\\frac{dy}{dx} + \\frac{y}{x^2} = \\frac{1}{x^2}$",
      "solutionSummary": "First-order linear ODE with $P(x) = \\frac{1}{x^2}, Q(x) = \\frac{1}{x^2}$. Integrating factor $\\text{I.F.} = e^{\\int x^{-2} \\, dx} = e^{-1/x}$. General solution: $y \\cdot e^{-1/x} = \\int \\frac{1}{x^2} e^{-1/x} \\, dx + C = e^{-1/x} + C \\implies y = 1 + C e^{1/x}$.",
      "chapterRef": "Unit 2: Linear, Bernoulli & Clairaut Equations"
    },
    {
      "id": "m2-24-13",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Find the general solution of the differential equation: $\\frac{d^2 y}{dx^2} - \\frac{dy}{dx} - 2y = 6e^x$",
      "solutionSummary": "Auxiliary equation: $m^2 - m - 2 = 0 \\implies m = 2, -1 \\implies y_c = c_1 e^{2x} + c_2 e^{-x}$. Particular integral $y_p = \\frac{1}{D^2 - D - 2} (6e^x) = \\frac{6e^x}{1^2 - 1 - 2} = -3e^x$. General solution: $y = c_1 e^{2x} + c_2 e^{-x} - 3e^x$.",
      "chapterRef": "Unit 3: Higher-Order Linear ODEs"
    },
    {
      "id": "m2-24-14",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Find the Fourier series for the function $f(x) = 2x, 0 \\le x \\le \\pi$ where $f(x) = f(x + 2\\pi)$.",
      "solutionSummary": "Extended as an odd periodic function on $(-\\pi, \\pi)$: $a_0 = 0, a_n = 0$. Fourier sine coefficients: $b_n = \\frac{2}{\\pi} \\int_0^\\pi 2x \\sin(nx) \\, dx = \\frac{4}{\\pi} \\left[ \\frac{-x\\cos nx}{n} + \\frac{\\sin nx}{n^2} \\right]_0^\\pi = \\frac{4(-1)^{n+1}}{n}$. The Fourier series is $f(x) = 4 \\sum_{n=1}^\\infty \\frac{(-1)^{n+1}}{n} \\sin(nx) = 4 \\left( \\sin x - \\frac{\\sin 2x}{2} + \\frac{\\sin 3x}{3} - \\dots \\right)$.",
      "chapterRef": "Unit 4: Fourier Series (Period 2pi & 2L)"
    },
    {
      "id": "m2-24-15",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Expand the following function in Fourier cosine series: $f(x) = \\begin{cases} 1, & 0 < x < \\frac{\\pi}{2} \\\\ 0, & \\frac{\\pi}{2} < x < \\pi \\end{cases}$",
      "solutionSummary": "Half-range cosine series on $(0, \\pi)$: $a_0 = \\frac{2}{\\pi} \\int_0^{\\pi/2} 1 \\, dx = 1 \\implies \\frac{a_0}{2} = \\frac{1}{2}$. $a_n = \\frac{2}{\\pi} \\int_0^{\\pi/2} \\cos(nx) \\, dx = \\frac{2}{n\\pi} \\sin\\left(\\frac{n\\pi}{2}\\right)$. For even $n$, $a_n = 0$; for odd $n = 2k-1$, $a_{2k-1} = \\frac{2(-1)^{k-1}}{(2k-1)\\pi}$. Fourier cosine series: $f(x) = \\frac{1}{2} + \\frac{2}{\\pi} \\left( \\cos x - \\frac{\\cos 3x}{3} + \\frac{\\cos 5x}{5} - \\dots \\right)$.",
      "chapterRef": "Unit 4: Half-Range Series & Parseval's Identity"
    },
    {
      "id": "m2-24-16",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Verify Cauchy-Riemann equation for the function: $f(z) = \\frac{x - iy}{x^2 + y^2}$",
      "solutionSummary": "$u = \\frac{x}{x^2 + y^2}, v = \\frac{-y}{x^2 + y^2}$. Partial derivatives: $\\frac{\\partial u}{\\partial x} = \\frac{y^2 - x^2}{(x^2 + y^2)^2} = \\frac{\\partial v}{\\partial y}$ and $\\frac{\\partial u}{\\partial y} = \\frac{-2xy}{(x^2 + y^2)^2} = -\\frac{\\partial v}{\\partial x}$. Both Cauchy-Riemann equations hold everywhere for $(x, y) \\ne (0, 0)$.",
      "chapterRef": "Unit 5: Cauchy-Riemann Equations (Cartesian & Polar)"
    },
    {
      "id": "m2-24-17",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Expand $f(z) = \\frac{1}{z}$ by Taylor's series about the point $z = 1$.",
      "solutionSummary": "Writing $z = 1 + (z - 1)$: $f(z) = \\frac{1}{1 + (z - 1)} = [1 + (z - 1)]^{-1}$. Since $|z - 1| < 1$, geometric series expansion gives $f(z) = \\sum_{n=0}^\\infty (-1)^n (z - 1)^n = 1 - (z - 1) + (z - 1)^2 - (z - 1)^3 + \\dots$ with radius of convergence $R = 1$.",
      "chapterRef": "Unit 6: Laurent Series & Singularities"
    },
    {
      "id": "m2-24-18",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Solve the equation: $x \\frac{dy}{dx} = y + x^2 \\log x$",
      "solutionSummary": "Standard linear form: $\\frac{dy}{dx} - \\frac{1}{x} y = x \\log x$. Integrating factor $\\text{I.F.} = e^{-\\int \\frac{1}{x} dx} = \\frac{1}{x}$. Solution: $\\frac{y}{x} = \\int \\frac{x \\log x}{x} \\, dx + C = \\int \\log x \\, dx + C = x \\log x - x + C \\implies y = x^2(\\log x - 1) + Cx$.",
      "chapterRef": "Unit 2: Linear, Bernoulli & Clairaut Equations"
    },
    {
      "id": "m2-24-19",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "State and prove the Cauchy-Riemann equations.",
      "solutionSummary": "Theorem: If $f(z) = u(x, y) + i v(x, y)$ is differentiable at $z$, then $\\frac{\\partial u}{\\partial x} = \\frac{\\partial v}{\\partial y}$ and $\\frac{\\partial u}{\\partial y} = -\\frac{\\partial v}{\\partial x}$. Proof evaluates $f'(z) = \\lim_{\\Delta z \\to 0} \\frac{f(z + \\Delta z) - f(z)}{\\Delta z}$ along real axis ($\\Delta z = \\Delta x \\implies u_x + i v_x$) and imaginary axis ($\\Delta z = i\\Delta y \\implies v_y - i u_y$). Equating real and imaginary parts proves the relations.",
      "chapterRef": "Unit 5: Cauchy-Riemann Equations (Cartesian & Polar)"
    },
    {
      "id": "m2-24-20",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "A function $f(x)$ is defined by $f(x) = \\begin{cases} 1, & -1 \\le x \\le 1 \\\\ 0, & \\text{otherwise} \\end{cases}$. Find the Fourier integral representation of $f(x)$.",
      "solutionSummary": "Since $f(x)$ is an even function, $B(\\lambda) = 0$. $A(\\lambda) = 2 \\int_0^1 1 \\cdot \\cos(\\lambda t) \\, dt = 2 \\frac{\\sin \\lambda}{\\lambda}$. By Fourier integral formula: $f(x) = \\frac{1}{\\pi} \\int_0^\\infty A(\\lambda) \\cos(\\lambda x) \\, d\\lambda = \\frac{2}{\\pi} \\int_0^\\infty \\frac{\\sin \\lambda \\cos(\\lambda x)}{\\lambda} \\, d\\lambda$.",
      "chapterRef": "Unit 4: Fourier Integrals & Transforms"
    },
    {
      "id": "m2-24-21",
      "group": "Group C (5 Marks)",
      "marks": 5,
      "questionText": "Solve: $\\frac{dy}{dx} = \\frac{2x - y + 1}{6x - 5y + 4}$",
      "solutionSummary": "Setting $x = X + h, y = Y + k$ with $2h - k + 1 = 0$ and $6h - 5k + 4 = 0$ yields $h = -1/4, k = 1/2$. Substituting $Y = vX$ gives homogeneous ODE $X \\frac{dv}{dX} = \\frac{5v^2 - 7v + 2}{6 - 5v}$. Separating variables and integrating via partial fractions yields $(Y - X) = C_1 (5Y - 2X)^4$, which transforms back to $4(y - x) - 3 = C (5y - 2x - 3)^4$.",
      "chapterRef": "Unit 2: Differential Equations of First Order"
    },
    {
      "id": "m2-24-22",
      "group": "Group C (5 Marks)",
      "marks": 5,
      "questionText": "Find the general solution of the differential equation: $\\frac{d^2 y}{dx^2} + 2 \\frac{dy}{dx} + y = 2x + x^2$",
      "solutionSummary": "Auxiliary equation: $(m + 1)^2 = 0 \\implies m = -1, -1 \\implies y_c = (c_1 + c_2 x) e^{-x}$. Particular integral: $y_p = (1 + D)^{-2} (x^2 + 2x) = (1 - 2D + 3D^2) (x^2 + 2x) = (x^2 + 2x) - 2(2x + 2) + 3(2) = x^2 - 2x + 2$. General solution: $y = (c_1 + c_2 x) e^{-x} + x^2 - 2x + 2$.",
      "chapterRef": "Unit 3: Higher-Order Linear ODEs"
    },
    {
      "id": "m2-24-23",
      "group": "Group C (5 Marks)",
      "marks": 5,
      "questionText": "Find the Fourier sine series for $f(x) = x^2$ in the interval $0 < x < 3$.",
      "solutionSummary": "With $L = 3$, $b_n = \\frac{2}{3} \\int_0^3 x^2 \\sin\\left(\\frac{n\\pi x}{3}\\right) dx$. Integrating by parts: $b_n = \\frac{18(-1)^{n+1}}{n\\pi} - \\frac{36(1 - (-1)^n)}{n^3 \\pi^3}$. The Fourier sine series is $f(x) = \\sum_{n=1}^\\infty \\left[ \\frac{18(-1)^{n+1}}{n\\pi} - \\frac{36(1 - (-1)^n)}{n^3 \\pi^3} \\right] \\sin\\left(\\frac{n\\pi x}{3}\\right)$.",
      "chapterRef": "Unit 4: Half-Range Series & Parseval's Identity"
    },
    {
      "id": "m2-24-24",
      "group": "Group C (5 Marks)",
      "marks": 5,
      "questionText": "Find an analytic function $f(z)$ whose real part is $e^x (x \\cos y - y \\sin y)$.",
      "solutionSummary": "Given $u = e^x (x \\cos y - y \\sin y)$. Using Milne-Thomson Method: $u_x(z, 0) = (z + 1) e^z$ and $u_y(z, 0) = 0$. Then $f'(z) = u_x(z, 0) - i u_y(z, 0) = (z + 1) e^z$. Integrating gives $f(z) = \\int (z + 1) e^z \\, dz = z e^z + C$.",
      "chapterRef": "Unit 5: Harmonic Functions & Milne-Thomson Method"
    },
    {
      "id": "m2-24-25",
      "group": "Group C (5 Marks)",
      "marks": 5,
      "questionText": "Find the residue of $f(z) = \\frac{z}{(z - 1)(z - 2)^2}$ at its poles.",
      "solutionSummary": "Simple pole at $z = 1$: $\\text{Res}(f, 1) = \\lim_{z \\to 1} (z - 1) f(z) = \\frac{1}{(1 - 2)^2} = 1$. Double pole at $z = 2$: $\\text{Res}(f, 2) = \\lim_{z \\to 2} \\frac{d}{dz} \\left[ (z - 2)^2 f(z) \\right] = \\lim_{z \\to 2} \\frac{d}{dz} \\left(\\frac{z}{z - 1}\\right) = \\lim_{z \\to 2} \\frac{-1}{(z - 1)^2} = -1$. (Note $\\sum \\text{Res} = 1 + (-1) = 0$).",
      "chapterRef": "Unit 6: Residue Theorem & Trigonometric Contours"
    }
  ]
},
  {
  "id": "sem2-math2-2023",
  "semester": 2,
  "subject": "Mathematics-II",
  "subjectCode": "BIT151HS",
  "year": 2023,
  "totalMarks": 80,
  "passMarks": 32,
  "timeHours": 3,
  "questions": [
    {
      "id": "m2-23-1",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Evaluate the double integral: \\int_1^3 \\int_2^5 (2x^2 + 3y^2) dx dy",
      "solutionSummary": "\\int_1^3 [ 2 x^3/3 + 3 x y^2 ]_2^5 dy = \\int_1^3 [ (250/3 + 15 y^2) - (16/3 + 6 y^2) ] dy = \\int_1^3 (78 + 9 y^2) dy = [78 y + 3 y^3]_1^3 = (234 + 81) - (78 + 3) = 315 - 81 = 234.",
      "chapterRef": "Unit 1: Multiple Integrals (Double & Polar)"
    },
    {
      "id": "m2-23-2",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Solve: (x + y) dy + (y - x) dx = 0",
      "solutionSummary": "Homogeneous equation: dy/dx = (x - y)/(x + y). Put y = vx => v + x dv/dx = (1 - v)/(1 + v) => x dv/dx = (1 - 2v - v^2)/(1 + v). Separating: (v + 1)/(v^2 + 2v - 1) dv = -dx/x. Integrating: 1/2 ln|v^2 + 2v - 1| = -ln|x| + ln C => y^2 + 2xy - x^2 = C.",
      "chapterRef": "Unit 2: Differential Equations of First Order"
    },
    {
      "id": "m2-23-3",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Verify Cauchy-Riemann equations for the function cosh y sin x + i sinh y cos x.",
      "solutionSummary": "Here u = cosh y sin x, v = sinh y cos x. u_x = cosh y cos x, u_y = sinh y sin x. v_x = -sinh y sin x, v_y = cosh y cos x. Thus u_x = v_y = cosh y cos x and u_y = -v_x = sinh y sin x, verifying C-R equations identically.",
      "chapterRef": "Unit 5: Cauchy-Riemann Equations (Cartesian & Polar)"
    },
    {
      "id": "m2-23-4",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "A function f(x) is defined as follows: f(x) = 1 for 0 < x < 1, = 0 for x >= 1. Find Fourier cosine integral of f(x).",
      "solutionSummary": "Fourier cosine integral: f(x) = (2/\\pi) \\int_0^\\infty A_c(\\omega) cos(\\omega x) d\\omega where A_c(\\omega) = \\int_0^1 1 * cos(\\omega x) dx = sin(\\omega)/\\omega. Thus f(x) = \\frac{2}{\\pi} \\int_0^\\infty \\frac{\\sin \\omega \\cos(\\omega x)}{\\omega} d\\omega.",
      "chapterRef": "Unit 4: Fourier Integrals & Transforms"
    },
    {
      "id": "m2-23-5",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Solve: p^2 - y^2 = 0 where p = dy/dx",
      "solutionSummary": "Factorizing gives p = y or p = -y. Integrating dy/y = dx gives y = c_1 e^x, and dy/y = -dx gives y = c_2 e^{-x}. Combined general solution: (y - c e^x)(y - c e^{-x}) = 0.",
      "chapterRef": "Unit 2: Differential Equations of First Order"
    },
    {
      "id": "m2-23-6",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Express the function: f(z) = e^z in the form of u(x, y) + i v(x, y).",
      "solutionSummary": "f(z) = e^{x+iy} = e^x(cos y + i sin y) = (e^x cos y) + i (e^x sin y), giving u = e^x cos y and v = e^x sin y.",
      "chapterRef": "Unit 5: Functions of a Complex Variable"
    },
    {
      "id": "m2-23-7",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Find the zeros and poles of the function: f(z) = (\\frac{z + 1}{z^2 + 1})^2.",
      "solutionSummary": "Zeros: (z + 1)^2 = 0 => z = -1 is a zero of order 2. Poles: (z^2 + 1)^2 = (z - i)^2 (z + i)^2 = 0 => z = i and z = -i are poles of order 2.",
      "chapterRef": "Unit 6: Laurent Series & Singularities"
    },
    {
      "id": "m2-23-8",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Define odd and even functions with examples.",
      "solutionSummary": "An even function satisfies f(-x) = f(x) (e.g., x^2, cos x). An odd function satisfies f(-x) = -f(x) (e.g., x^3, sin x).",
      "chapterRef": "Unit 4: Fourier Series (Period 2pi & 2L)"
    },
    {
      "id": "m2-23-9",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Show that the function f(z) = \\frac{\\sinh(z - z_0)}{z - z_0} has a removable singularity at z = z_0.",
      "solutionSummary": "lim_{z->z_0} \\frac{sinh(z - z_0)}{z - z_0} = lim_{w->0} \\frac{w + w^3/6 + ...}{w} = 1. Since the limit exists and is finite, the singularity at z = z_0 is removable.",
      "chapterRef": "Unit 6: Laurent Series & Singularities"
    },
    {
      "id": "m2-23-10",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Find the residue of f(z) = \\frac{3z - 4}{z(z - 1)(z - 2)}.",
      "solutionSummary": "At z = 0: Res = -4 / ((-1)(-2)) = -2. At z = 1: Res = (3-4)/((1)(-1)) = 1. At z = 2: Res = (6-4)/((2)(1)) = 1.",
      "chapterRef": "Unit 6: Residue Theorem & Trigonometric Contours"
    },
    {
      "id": "m2-23-11",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Find by double integration, the area which lies inside the cardioid r = a(1 + \\cos\\theta) and outside the circle r = a.",
      "solutionSummary": "Intersections at \\theta = -\\pi/2 and \\pi/2. Area = 2 \\int_0^{\\pi/2} \\int_a^{a(1 + \\cos\\theta)} r dr d\\theta = a^2 \\int_0^{\\pi/2} (2 \\cos\\theta + \\cos^2\\theta) d\\theta = a^2 [2 + \\pi/4] = \\frac{a^2}{4}(8 + \\pi).",
      "chapterRef": "Unit 1: Multiple Integrals (Double & Polar)"
    },
    {
      "id": "m2-23-12",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Solve: \\frac{dy}{dx} = \\frac{x^2 + xy + y^2}{x^2}",
      "solutionSummary": "Homogeneous ODE: dy/dx = 1 + y/x + (y/x)^2. Substitute y = vx => v + x dv/dx = 1 + v + v^2 => x dv/dx = 1 + v^2. Separating variables: dv / (1 + v^2) = dx / x. Integrating: arctan(v) = ln|x| + C => \\arctan(y/x) = \\ln|x| + C.",
      "chapterRef": "Unit 2: Differential Equations of First Order"
    },
    {
      "id": "m2-23-13",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Find the orthogonal trajectories of the family of curves given by y = k x^2; k != 0.",
      "solutionSummary": "Differentiating: y' = 2kx => k = y' / (2x). Substituting into curve equation: y = (y' / 2x) x^2 = (x y') / 2. Replacing y' with -1/y' for orthogonal trajectories: y = -x / (2 y') => 2y dy = -x dx. Integrating: y^2 + x^2 / 2 = C, representing a family of co-axial ellipses x^2 + 2y^2 = 2C.",
      "chapterRef": "Unit 2: Orthogonal Trajectories & Applications"
    },
    {
      "id": "m2-23-14",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Solve: \\frac{d^2 y}{dx^2} + 2 \\frac{dy}{dx} + y = 2x + x^2",
      "solutionSummary": "Auxiliary equation: (m + 1)^2 = 0 => y_c = (c_1 + c_2 x) e^{-x}. Particular integral: PI = 1/(1+D)^2 [x^2 + 2x] = (1 - 2D + 3D^2)(x^2 + 2x) = x^2 - 2x + 2. General solution: y = (c_1 + c_2 x) e^{-x} + x^2 - 2x + 2.",
      "chapterRef": "Unit 3: Higher-Order Linear ODEs"
    },
    {
      "id": "m2-23-15",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Find the Fourier series for the function defined by: f(x) = 1 for 0 <= x <= pi, = -1 for pi <= x <= 2pi.",
      "solutionSummary": "Period 2L = 2pi => L = pi. Square wave function. a_0 = 0, a_n = 0. b_n = (1/\\pi) [ \\int_0^\\pi sin(nx) dx - \\int_\\pi^{2\\pi} sin(nx) dx ] = 2[1 - (-1)^n]/(n\\pi). For even n, b_n = 0; for odd n = 2k-1, b_n = 4/((2k-1)\\pi). Series: f(x) = \\frac{4}{\\pi} \\sum_{k=1}^\\infty \\frac{\\sin((2k-1)x)}{2k-1}.",
      "chapterRef": "Unit 4: Fourier Series (Period 2pi & 2L)"
    },
    {
      "id": "m2-23-16",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Expand f(x) = x as a cosine series in the interval 0 <= x <= pi and hence show that 1 + 1/3^2 + 1/5^2 + ... = pi^2 / 8.",
      "solutionSummary": "Half-range cosine series: b_n = 0. a_0 = \\pi. a_n = (2/\\pi n^2) [(-1)^n - 1]. For odd n, a_n = -4/(\\pi n^2). Series: f(x) = \\pi/2 - (4/\\pi) \\sum_{k=1}^\\infty \\frac{\\cos((2k-1)x)}{(2k-1)^2}. Setting x = 0 gives \\sum_{k=1}^\\infty 1/(2k-1)^2 = \\pi^2 / 8.",
      "chapterRef": "Unit 4: Half-Range Series & Parseval's Identity"
    },
    {
      "id": "m2-23-17",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "State and prove Cauchy-Riemann equations.",
      "solutionSummary": "Conditions u_x = v_y and u_y = -v_x for f(z) = u + iv. Proved by evaluating derivative along horizontal and vertical limits in the complex plane.",
      "chapterRef": "Unit 5: Cauchy-Riemann Equations (Cartesian & Polar)"
    },
    {
      "id": "m2-23-18",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Expand f(z) = 1/z by Taylor's series about the point z = 1.",
      "solutionSummary": "1/z = 1/[1 + (z-1)] = \\sum_{n=0}^\\infty (-1)^n (z-1)^n = 1 - (z-1) + (z-1)^2 - (z-1)^3 + ... valid for |z-1| < 1.",
      "chapterRef": "Unit 6: Laurent Series & Singularities"
    },
    {
      "id": "m2-23-19",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Show that u = e^x (x \\cos y - y \\sin y) is a harmonic function and find the analytic function f(z) = u + iv.",
      "solutionSummary": "u_{xx} + u_{yy} = 0 confirms u is harmonic. By Milne-Thomson method: f'(z) = u_x(z, 0) - i u_y(z, 0) = (z + 1) e^z => f(z) = z e^z + C.",
      "chapterRef": "Unit 5: Harmonic Functions & Milne-Thomson Method"
    },
    {
      "id": "m2-23-20",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Find the residue of f(z) = \\frac{3z - 4}{z(z - 1)(z - 2)} at each of its poles.",
      "solutionSummary": "Simple poles at z = 0, 1, 2. Residues: Res(0) = -2, Res(1) = 1, Res(2) = 1.",
      "chapterRef": "Unit 6: Residue Theorem & Trigonometric Contours"
    },
    {
      "id": "m2-23-21",
      "group": "Group C (5 Marks)",
      "marks": 5,
      "questionText": "Find the volume bounded by the sphere x^2 + y^2 + z^2 = a^2 using triple integral.",
      "solutionSummary": "Using spherical polar coordinates x = r sin \\phi cos \\theta, y = r sin \\phi sin \\theta, z = r cos \\phi with Jacobian r^2 sin \\phi: V = \\int_0^{2\\pi} d\\theta \\int_0^\\pi sin \\phi d\\phi \\int_0^a r^2 dr = (2\\pi) * (2) * (a^3/3) = \\frac{4}{3} \\pi a^3.",
      "chapterRef": "Unit 1: Triple Integrals & Applications"
    },
    {
      "id": "m2-23-22",
      "group": "Group C (5 Marks)",
      "marks": 5,
      "questionText": "Solve: \\frac{d^2 y}{dx^2} + 4 \\frac{dy}{dx} + 4y = e^{3x} + \\cos 5x",
      "solutionSummary": "Auxiliary equation: (m + 2)^2 = 0 => y_c = (c_1 + c_2 x) e^{-2x}. PI_1 = e^{3x} / (3+2)^2 = e^{3x} / 25. PI_2 = 1/(D^2 + 4D + 4) cos 5x = 1/(-25 + 4D + 4) cos 5x = (4D + 21)/[16D^2 - 441] cos 5x = (4D + 21) cos 5x / [-400 - 441] = (21 cos 5x - 20 sin 5x)/(-841). General solution: y = (c_1 + c_2 x) e^{-2x} + \\frac{e^{3x}}{25} - \\frac{21 \\cos 5x - 20 \\sin 5x}{841}.",
      "chapterRef": "Unit 3: Higher-Order Linear ODEs"
    },
    {
      "id": "m2-23-23",
      "group": "Group C (5 Marks)",
      "marks": 5,
      "questionText": "Find the Fourier transform of the function: f(x) = 1 - x^2 for -1 < x < 1, = 0 otherwise.",
      "solutionSummary": "F{f(x)} = \\int_{-1}^1 (1 - x^2) e^{-i\\omega x} dx = 2 \\int_0^1 (1 - x^2) cos(\\omega x) dx = \\frac{4}{\\omega^3} [\\sin \\omega - \\omega \\cos \\omega].",
      "chapterRef": "Unit 4: Fourier Integrals & Transforms"
    },
    {
      "id": "m2-23-24",
      "group": "Group C (5 Marks)",
      "marks": 5,
      "questionText": "Show that u = e^x \\cos y is harmonic and find an analytic function f(z).",
      "solutionSummary": "u_{xx} = e^x cos y, u_{yy} = -e^x cos y => u_{xx} + u_{yy} = 0 (harmonic). By Milne-Thomson: f'(z) = u_x(z, 0) - i u_y(z, 0) = e^z => f(z) = e^z + C.",
      "chapterRef": "Unit 5: Harmonic Functions & Milne-Thomson Method"
    },
    {
      "id": "m2-23-25",
      "group": "Group C (5 Marks)",
      "marks": 5,
      "questionText": "Obtain the Laurent series of the function f(z) = \\frac{\\sin z}{z^6} and hence show that \\int_C \\frac{\\sin z}{z^6} dz = -\\frac{1}{60} \\pi i where C is the circle |z| = 2.",
      "solutionSummary": "Since sin z = z - z^3/3! + z^5/5! - z^7/7! + ..., dividing by z^6 gives f(z) = 1/z^5 - 1/(6 z^3) + 1/(120 z) - z/5040 + ... The residue at z = 0 is the coefficient of 1/z, which is 1/120. By Cauchy's Residue Theorem: \\oint_C f(z) dz = 2\\pi i * Res(f, 0) = 2\\pi i * (1/120) = \\frac{\\pi i}{60}. (With sign depending on contour orientation).",
      "chapterRef": "Unit 6: Laurent Series & Singularities"
    }
  ]
},
  {
  "id": "sem2-math2-2022",
  "semester": 2,
  "subject": "Mathematics-II",
  "subjectCode": "BIT151HS",
  "year": 2022,
  "totalMarks": 80,
  "passMarks": 32,
  "timeHours": 3,
  "questions": [
    {
      "id": "m2-22-1",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Evaluate the double integral: \\int_0^2 \\int_0^1 (x^2 + y^2) dx dy",
      "solutionSummary": "\\int_0^2 [x^3/3 + x y^2]_0^1 dy = \\int_0^2 (1/3 + y^2) dy = [y/3 + y^3/3]_0^2 = 2/3 + 8/3 = 10/3.",
      "chapterRef": "Unit 1: Multiple Integrals (Double & Polar)"
    },
    {
      "id": "m2-22-2",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Define Taylor's theorem and Laurent's series.",
      "solutionSummary": "Taylor's theorem expands a holomorphic function f(z) inside disk |z - z_0| < R as \\sum a_n (z - z_0)^n. Laurent's series expands f(z) in an annular domain r < |z - z_0| < R into analytic and principal parts \\sum_{n=-\\infty}^\\infty a_n (z - z_0)^n.",
      "chapterRef": "Unit 6: Laurent Series & Singularities"
    },
    {
      "id": "m2-22-3",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Determine the order and degree of the differential equation: \\sqrt{\\frac{d^3 y}{dx^3}} = \\frac{dy}{dx}",
      "solutionSummary": "Squaring yields d^3y/dx^3 = (dy/dx)^2. Highest order derivative is order 3 with degree 1.",
      "chapterRef": "Unit 2: Differential Equations of First Order"
    },
    {
      "id": "m2-22-4",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Solve: (x + 1) dy + (y - 1) dx = 0",
      "solutionSummary": "Separating variables: dy/(y - 1) + dx/(x + 1) = 0. Integrating: ln|y - 1| + ln|x + 1| = ln C => (x + 1)(y - 1) = C.",
      "chapterRef": "Unit 2: Differential Equations of First Order"
    },
    {
      "id": "m2-22-5",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Find the general solution of the differential equation: y'' - 4y' + 5y = 0",
      "solutionSummary": "Auxiliary equation: m^2 - 4m + 5 = 0 => m = 2 \\pm i. General solution: y = e^{2x} (c_1 cos x + c_2 sin x).",
      "chapterRef": "Unit 3: Higher-Order Linear ODEs"
    },
    {
      "id": "m2-22-6",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Define odd and even function with examples.",
      "solutionSummary": "Even: f(-x) = f(x), e.g., cos x, x^2. Odd: f(-x) = -f(x), e.g., sin x, x^3.",
      "chapterRef": "Unit 4: Fourier Series (Period 2pi & 2L)"
    },
    {
      "id": "m2-22-7",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "If f(z) is differentiable at z_0, then show that f(z) is continuous at z = z_0.",
      "solutionSummary": "lim_{z->z_0} [f(z) - f(z_0)] = lim_{z->z_0} \\frac{f(z) - f(z_0)}{z - z_0} * (z - z_0) = f'(z_0) * 0 = 0 => lim f(z) = f(z_0).",
      "chapterRef": "Unit 5: Functions of a Complex Variable"
    },
    {
      "id": "m2-22-8",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Express the function f(z) = z^2 in the form of f(z) = u(x, y) + i v(x, y).",
      "solutionSummary": "z^2 = (x + iy)^2 = (x^2 - y^2) + i (2xy). Hence u = x^2 - y^2, v = 2xy.",
      "chapterRef": "Unit 5: Functions of a Complex Variable"
    },
    {
      "id": "m2-22-9",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Define isolated singularity with example.",
      "solutionSummary": "A point z = z_0 is an isolated singularity of f(z) if f is not analytic at z_0 but is analytic in some punctured neighborhood 0 < |z - z_0| < R (e.g., f(z) = 1/z at z = 0).",
      "chapterRef": "Unit 6: Laurent Series & Singularities"
    },
    {
      "id": "m2-22-10",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Show that the function f(z) = \\frac{z^2 - 2z + 5}{z - 2} has a simple pole at z = 2.",
      "solutionSummary": "lim_{z->2} (z - 2) f(z) = 4 - 4 + 5 = 5 != 0, proving a pole of order 1 at z = 2.",
      "chapterRef": "Unit 6: Laurent Series & Singularities"
    },
    {
      "id": "m2-22-11",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Solve: x dy - y dx = \\sqrt{x^2 + y^2} dx",
      "solutionSummary": "Homogeneous equation: x dy = (y + \\sqrt{x^2 + y^2}) dx => dy/dx = y/x + \\sqrt{1 + (y/x)^2}. Put y = vx => v + x dv/dx = v + \\sqrt{1 + v^2} => dv/\\sqrt{1 + v^2} = dx/x. Integrating: ln|v + \\sqrt{1 + v^2}| = ln|x| + ln C => y + \\sqrt{x^2 + y^2} = C x^2.",
      "chapterRef": "Unit 2: Differential Equations of First Order"
    },
    {
      "id": "m2-22-12",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Solve: \\frac{d^2 y}{dx^2} + 16y = \\cos 4x",
      "solutionSummary": "Auxiliary equation: m^2 + 16 = 0 => m = \\pm 4i => y_c = c_1 cos 4x + c_2 sin 4x. Particular integral: PI = 1/(D^2 + 16) cos 4x = x/(2 * 4) sin 4x = (x sin 4x) / 8. General solution: y = c_1 cos 4x + c_2 sin 4x + \\frac{x \\sin 4x}{8}.",
      "chapterRef": "Unit 3: Higher-Order Linear ODEs"
    },
    {
      "id": "m2-22-13",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Express: f(x) = |x|, -\\pi < x < \\pi as Fourier series.",
      "solutionSummary": "Even function => b_n = 0. a_0 = \\pi. a_n = (2/\\pi n^2) [(-1)^n - 1] = -4/(\\pi (2k-1)^2) for odd n. Fourier series: f(x) = \\frac{\\pi}{2} - \\frac{4}{\\pi} \\sum_{k=1}^\\infty \\frac{\\cos((2k-1)x)}{(2k-1)^2}.",
      "chapterRef": "Unit 4: Fourier Series (Period 2pi & 2L)"
    },
    {
      "id": "m2-22-14",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Find the Fourier transform of f(x) = 1 - x^2 for |x| <= 1, = 0 for |x| > 1.",
      "solutionSummary": "F{f(x)} = 2 \\int_0^1 (1 - x^2) cos(\\omega x) dx = \\frac{4}{\\omega^3} [\\sin \\omega - \\omega \\cos \\omega].",
      "chapterRef": "Unit 4: Fourier Integrals & Transforms"
    },
    {
      "id": "m2-22-15",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Expand: f(z) = \\frac{1}{z^2 - 3z + 2} in region: (a) |z| < 1, (b) 1 < |z| < 2.",
      "solutionSummary": "Partial fractions: f(z) = 1/(z-2) - 1/(z-1) = -1/2(1 - z/2)^{-1} + (1 - z)^{-1}. (a) For |z| < 1: \\sum_{n=0}^\\infty (1 - 1/2^{n+1}) z^n. (b) For 1 < |z| < 2: -\\sum_{n=1}^\\infty z^{-n} - \\sum_{n=0}^\\infty \\frac{z^n}{2^{n+1}}.",
      "chapterRef": "Unit 6: Laurent Series & Singularities"
    },
    {
      "id": "m2-22-16",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Solve the differential equation: (D^2 - 3D + 2)y = e^{3x}",
      "solutionSummary": "Auxiliary roots: m = 1, 2 => y_c = c_1 e^x + c_2 e^{2x}. PI = e^{3x} / (3^2 - 3*3 + 2) = e^{3x} / 2. General solution: y = c_1 e^x + c_2 e^{2x} + \\frac{e^{3x}}{2}.",
      "chapterRef": "Unit 3: Higher-Order Linear ODEs"
    },
    {
      "id": "m2-22-17",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Solve: \\frac{dy}{dx} + y \\tan x = \\sec x",
      "solutionSummary": "Linear ODE: Integrating factor I.F. = e^{\\int tan x dx} = sec x. General solution: y sec x = \\int sec^2 x dx = tan x + C => y = \\sin x + C \\cos x.",
      "chapterRef": "Unit 2: Linear, Bernoulli & Clairaut Equations"
    },
    {
      "id": "m2-22-18",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Evaluate \\int_0^\\infty \\int_0^x \\frac{e^{-x}}{x} dy dx by changing the order of integration.",
      "solutionSummary": "Reversing order: x runs from y to \\infty while y runs from 0 to \\infty: \\int_0^\\infty \\int_y^\\infty \\frac{e^{-x}}{x} dx dy = \\int_0^\\infty dx \\int_0^x \\frac{e^{-x}}{x} dy = \\int_0^\\infty \\frac{e^{-x}}{x} [x] dx = \\int_0^\\infty e^{-x} dx = 1.",
      "chapterRef": "Unit 1: Multiple Integrals (Double & Polar)"
    },
    {
      "id": "m2-22-19",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Show that u = e^x (x \\cos y - y \\sin y) is a harmonic function and find the analytic function f(z) = u + iv.",
      "solutionSummary": "\\nabla^2 u = 0. Milne-Thomson yields f'(z) = (z + 1) e^z => f(z) = z e^z + C.",
      "chapterRef": "Unit 5: Harmonic Functions & Milne-Thomson Method"
    },
    {
      "id": "m2-22-20",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "The equations of motion of a particle are given by dx/dt + \\omega y = 0, dy/dt - \\omega x = 0. Find the path of the particle and show that it is a circle.",
      "solutionSummary": "Differentiating first equation: d^2x/dt^2 + \\omega (dy/dt) = 0. Substituting dy/dt = \\omega x gives d^2x/dt^2 + \\omega^2 x = 0 => x(t) = R cos(\\omega t + \\phi). Then y(t) = -(1/\\omega) dx/dt = R sin(\\omega t + \\phi). Squaring and adding: x^2 + y^2 = R^2, which is the equation of a circle of radius R.",
      "chapterRef": "Unit 3: Simple Harmonic Motion & Vibrations"
    },
    {
      "id": "m2-22-21",
      "group": "Group C (5 Marks)",
      "marks": 5,
      "questionText": "Solve the differential equation: (D^2 + 4D + 4)y = e^{2x} + \\cos 5x",
      "solutionSummary": "Auxiliary roots: m = -2, -2 => y_c = (c_1 + c_2 x) e^{-2x}. PI_1 = e^{2x} / (2+2)^2 = e^{2x}/16. PI_2 = (21 cos 5x - 20 sin 5x)/(-841). General solution: y = (c_1 + c_2 x) e^{-2x} + \\frac{e^{2x}}{16} - \\frac{21 \\cos 5x - 20 \\sin 5x}{841}.",
      "chapterRef": "Unit 3: Higher-Order Linear ODEs"
    },
    {
      "id": "m2-22-22",
      "group": "Group C (5 Marks)",
      "marks": 5,
      "questionText": "Find the residue of f(z) = \\frac{3z - 4}{z(z - 1)(z - 2)} at each of its poles.",
      "solutionSummary": "Simple poles at z = 0, 1, 2. Residues are Res(0) = -2, Res(1) = 1, Res(2) = 1.",
      "chapterRef": "Unit 6: Residue Theorem & Trigonometric Contours"
    },
    {
      "id": "m2-22-23",
      "group": "Group C (5 Marks)",
      "marks": 5,
      "questionText": "Find the Fourier transform of f(x) = 1 for |x| < 1, = 0 for |x| > 1. Hence, evaluate: \\int_0^\\infty \\frac{\\sin s}{s} ds.",
      "solutionSummary": "F{f(x)} = 2 \\int_0^1 cos(\\omega x) dx = 2 \\sin \\omega / \\omega. By the Fourier inversion formula at x = 0: f(0) = 1 = (1/2\\pi) \\int_{-\\infty}^\\infty \\frac{2 \\sin \\omega}{\\omega} d\\omega = (2/\\pi) \\int_0^\\infty \\frac{\\sin s}{s} ds => \\int_0^\\infty \\frac{\\sin s}{s} ds = \\frac{\\pi}{2}.",
      "chapterRef": "Unit 4: Fourier Integrals & Transforms"
    },
    {
      "id": "m2-22-24",
      "group": "Group C (5 Marks)",
      "marks": 5,
      "questionText": "Find the Taylor expansion of \\frac{2z^3 + 1}{z^2 + 2} about the point z = i.",
      "solutionSummary": "Let f(z) = \\frac{2z^3 + 1}{z^2 + 2} = 2z + \\frac{1 - 4z}{z^2 + 2}. Evaluating derivatives at z = i: f(i) = (2 i^3 + 1)/(i^2 + 2) = (-2i + 1)/1 = 1 - 2i. f'(z) = 2 + [-4(z^2+2) - 2z(1-4z)]/(z^2+2)^2 => f'(i) = 2 + [-4(1) - 2i(1-4i)]/1 = 2 - 4 - 2i - 8 = -10 - 2i. Taylor expansion: f(z) = (1 - 2i) - (10 + 2i)(z - i) + \\dots",
      "chapterRef": "Unit 6: Laurent Series & Singularities"
    },
    {
      "id": "m2-22-25",
      "group": "Group C (5 Marks)",
      "marks": 5,
      "questionText": "Define Fourier cosine series and Fourier sine series with Dirichlet conditions.",
      "solutionSummary": "Half-range Fourier cosine series: f(x) = a_0/2 + \\sum a_n cos(n\\pi x / L). Half-range sine series: f(x) = \\sum b_n sin(n\\pi x / L). Dirichlet conditions: f(x) must be single-valued, bounded, have a finite number of jump discontinuities and extrema in any period.",
      "chapterRef": "Unit 4: Fourier Series (Period 2pi & 2L)"
    }
  ]
},
  {
  "id": "sem2-math2-2021",
  "semester": 2,
  "subject": "Mathematics-II",
  "subjectCode": "BIT102SH",
  "year": 2021,
  "totalMarks": 80,
  "passMarks": 32,
  "timeHours": 3,
  "questions": [
    {
      "id": "m2-21-1",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Find the solution of the differential equation: (x + 1) dy + (y - 1) dx = 0",
      "solutionSummary": "Separation of variables: dy/(y - 1) + dx/(x + 1) = 0. Integrating yields (x + 1)(y - 1) = C.",
      "chapterRef": "Unit 2: Differential Equations of First Order"
    },
    {
      "id": "m2-21-2",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Find the inverse Laplace transform of: \\frac{1}{s^2 + 3s + 2}",
      "solutionSummary": "Partial fractions: 1/[(s + 1)(s + 2)] = 1/(s + 1) - 1/(s + 2). L^{-1}{1/(s+1)} - L^{-1}{1/(s+2)} = e^{-t} - e^{-2t}.",
      "chapterRef": "Unit 4: Fourier Integrals & Transforms"
    },
    {
      "id": "m2-21-3",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Express f(z) = \\log z in the form u(x, y) + i v(x, y).",
      "solutionSummary": "In polar coordinates z = r e^{i\\theta}: log z = ln r + i \\theta = \\frac{1}{2} \\ln(x^2 + y^2) + i \\arctan(y/x).",
      "chapterRef": "Unit 5: Functions of a Complex Variable"
    },
    {
      "id": "m2-21-4",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Find the Fourier expansion of the function in the interval 0 <= x <= 2pi: f(x) = 2x.",
      "solutionSummary": "Period 2L = 2pi => L = pi. a_0 = 4pi. a_n = 0. b_n = -4/n. Series: f(x) = 2\\pi - 4 \\sum_{n=1}^\\infty \\frac{\\sin(nx)}{n}.",
      "chapterRef": "Unit 4: Fourier Series (Period 2pi & 2L)"
    },
    {
      "id": "m2-21-5",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Find the general solution of the partial differential equation: a p + b q = c",
      "solutionSummary": "Lagrange's auxiliary equations: dx/a = dy/b = dz/c. Integrating dx/a = dy/b gives b x - a y = c_1. Integrating dx/a = dz/c gives c x - a z = c_2. General solution: \\Phi(b x - a y, c x - a z) = 0.",
      "chapterRef": "Unit 2: Differential Equations of First Order"
    },
    {
      "id": "m2-21-6",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Evaluate \\int_C f(z) dz, where f(z) = \\frac{1}{z - a}, C is the circle with centre at a and radius r.",
      "solutionSummary": "Let z - a = r e^{i\\theta}, dz = i r e^{i\\theta} d\\theta. \\oint_C \\frac{dz}{z - a} = \\int_0^{2\\pi} \\frac{i r e^{i\\theta} d\\theta}{r e^{i\\theta}} = i \\int_0^{2\\pi} d\\theta = 2\\pi i.",
      "chapterRef": "Unit 6: Residue Theorem & Trigonometric Contours"
    },
    {
      "id": "m2-21-7",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Calculate the residue of: f(z) = \\frac{1}{z^2 + z}",
      "solutionSummary": "Poles at z = 0 and z = -1. Res(f, 0) = lim_{z->0} z/(z(z+1)) = 1. Res(f, -1) = lim_{z->-1} (z+1)/(z(z+1)) = -1.",
      "chapterRef": "Unit 6: Residue Theorem & Trigonometric Contours"
    },
    {
      "id": "m2-21-8",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Find the Laplace transform of: e^{3t} \\cos 2t",
      "solutionSummary": "By first shifting property L{cos 2t} = s/(s^2 + 4). Therefore L{e^{3t} cos 2t} = \\frac{s - 3}{(s - 3)^2 + 4} = \\frac{s - 3}{s^2 - 6s + 13}.",
      "chapterRef": "Unit 4: Fourier Integrals & Transforms"
    },
    {
      "id": "m2-21-9",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Find the general solution of the differential equation \\frac{d^2 y}{dx^2} - 2 \\frac{dy}{dx} + 2y = 0.",
      "solutionSummary": "Auxiliary roots: m = 1 \\pm i. General solution: y = e^x (c_1 cos x + c_2 sin x).",
      "chapterRef": "Unit 3: Higher-Order Linear ODEs"
    },
    {
      "id": "m2-21-10",
      "group": "Group A (2 Marks)",
      "marks": 2,
      "questionText": "Define Fourier cosine and sine integral of f(x).",
      "solutionSummary": "Fourier cosine integral: f(x) = (2/\\pi) \\int_0^\\infty [\\int_0^\\infty f(t) cos(\\omega t) dt] cos(\\omega x) d\\omega. Fourier sine integral: f(x) = (2/\\pi) \\int_0^\\infty [\\int_0^\\infty f(t) sin(\\omega t) dt] sin(\\omega x) d\\omega.",
      "chapterRef": "Unit 4: Fourier Integrals & Transforms"
    },
    {
      "id": "m2-21-11",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Solve the differential equation: \\frac{dy}{dx} = \\frac{2xy}{x^2 - y^2}",
      "solutionSummary": "Homogeneous equation. Substitute y = vx => v + x dv/dx = 2v / (1 - v^2) => x dv/dx = (v + v^3) / (1 - v^2). Separating: (1 - v^2)/(v(1 + v^2)) dv = dx/x. Integrating: ln|v| - ln(1 + v^2) = ln|x| + ln C => y / (x^2 + y^2) = C => x^2 + y^2 = c y, representing a family of circles tangent to the x-axis at the origin.",
      "chapterRef": "Unit 2: Differential Equations of First Order"
    },
    {
      "id": "m2-21-12",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Solve the second order differential equation: \\frac{d^2 y}{dx^2} - 2 \\frac{dy}{dx} + 4y = e^x \\sin x",
      "solutionSummary": "Auxiliary roots: m = 1 \\pm i\\sqrt{3} => y_c = e^x [c_1 cos(\\sqrt{3}x) + c_2 sin(\\sqrt{3}x)]. PI = (e^x sin x)/2. General solution: y = e^x [c_1 cos(\\sqrt{3}x) + c_2 sin(\\sqrt{3}x)] + \\frac{1}{2} e^x \\sin x.",
      "chapterRef": "Unit 3: Higher-Order Linear ODEs"
    },
    {
      "id": "m2-21-13",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Solve: x dy - y dx = \\sqrt{x^2 + y^2} dx",
      "solutionSummary": "Homogeneous equation. Substitute y = vx gives dv/\\sqrt{1+v^2} = dx/x. Integrating gives y + \\sqrt{x^2 + y^2} = C x^2.",
      "chapterRef": "Unit 2: Differential Equations of First Order"
    },
    {
      "id": "m2-21-14",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Find the Laplace transform of: t e^{-t} \\cos t",
      "solutionSummary": "L{cos t} = s/(s^2 + 1). By shifting: L{e^{-t} cos t} = (s + 1)/[(s + 1)^2 + 1] = (s + 1)/(s^2 + 2s + 2). By multiplication by t: L{t e^{-t} cos t} = -d/ds [(s+1)/(s^2+2s+2)] = \\frac{s^2 + 2s}{(s^2 + 2s + 2)^2}.",
      "chapterRef": "Unit 4: Fourier Integrals & Transforms"
    },
    {
      "id": "m2-21-15",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Find the inverse Laplace transform of: \\frac{2s + 3}{(s - 1)(s - 2)(s - 3)}",
      "solutionSummary": "Partial fractions: A/(s-1) + B/(s-2) + C/(s-3). A = 5/((-1)(-2)) = 5/2. B = 7/((1)(-1)) = -7. C = 9/((2)(1)) = 9/2. L^{-1} = \\frac{5}{2} e^t - 7 e^{2t} + \\frac{9}{2} e^{3t}.",
      "chapterRef": "Unit 4: Fourier Integrals & Transforms"
    },
    {
      "id": "m2-21-16",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Expand the function f(x) = x^2, 0 <= x <= pi in a Fourier cosine series and deduce that \\sum_{n=1}^\\infty \\frac{1}{n^2} = \\frac{\\pi^2}{6}.",
      "solutionSummary": "Half-range cosine series on [0, \\pi]: a_0 = (2\\pi^2)/3, a_n = 4(-1)^n / n^2. f(x) = \\pi^2 / 3 + 4 \\sum_{n=1}^\\infty \\frac{(-1)^n}{n^2} cos(nx). At x = \\pi: \\pi^2 = \\pi^2/3 + 4 \\sum 1/n^2 => \\sum_{n=1}^\\infty 1/n^2 = \\pi^2 / 6.",
      "chapterRef": "Unit 4: Fourier Series (Period 2pi & 2L)"
    },
    {
      "id": "m2-21-17",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Verify Cauchy Riemann equations for the following function: e^x (\\cos y + i \\sin y).",
      "solutionSummary": "u = e^x cos y, v = e^x sin y. u_x = e^x cos y = v_y, u_y = -e^x sin y = -v_x. Cauchy-Riemann equations hold everywhere.",
      "chapterRef": "Unit 5: Cauchy-Riemann Equations (Cartesian & Polar)"
    },
    {
      "id": "m2-21-18",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Obtain the Laurent Series for f(z) = \\frac{1}{(1 - z)(z + 2)} in the domain 1 < |z| < 2.",
      "solutionSummary": "Partial fractions: f(z) = -1/(3(z-1)) + 1/(6(1 + z/2)). In 1 < |z| < 2, expanding in powers of 1/z and z/2 yields -1/3 \\sum_{n=1}^\\infty z^{-n} + 1/3 \\sum_{n=0}^\\infty (-1)^n z^n / 2^{n+1}.",
      "chapterRef": "Unit 6: Laurent Series & Singularities"
    },
    {
      "id": "m2-21-19",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Solve the partial differential equation: p^2 + q y = 0",
      "solutionSummary": "Charpit's method or separation of variables. Let z = f(x) + g(y). p = f'(x), q = g'(y). Then [f'(x)]^2 = -y g'(y) = a^2. Case 1: f'(x) = a => f(x) = a x + c_1. Case 2: -y g'(y) = a^2 => dg = -a^2 dy / y => g(y) = -a^2 ln|y| + c_2. Complete integral: z = a x - a^2 \\ln|y| + c.",
      "chapterRef": "Unit 2: Differential Equations of First Order"
    },
    {
      "id": "m2-21-20",
      "group": "Group B (5 Marks)",
      "marks": 5,
      "questionText": "Solve the differential equation by the method of Laplace transform: \\frac{d^2 y}{dt^2} + 2 \\frac{dy}{dt} + 5y = e^{-t} \\sin t, y(0) = 0, y'(0) = 1.",
      "solutionSummary": "Taking Laplace transforms: [s^2 Y - s y(0) - y'(0)] + 2[s Y - y(0)] + 5 Y = 1/[(s + 1)^2 + 1]. With y(0)=0, y'(0)=1: (s^2 + 2s + 5) Y - 1 = 1/(s^2 + 2s + 2) => Y = 1/(s^2 + 2s + 5) + 1/[(s^2 + 2s + 5)(s^2 + 2s + 2)]. Partial fractions and inverse Laplace transform yields y(t) = \\frac{1}{3} e^{-t} \\sin t + \\frac{1}{3} e^{-t} \\sin 2t.",
      "chapterRef": "Unit 3: Higher-Order Linear ODEs"
    },
    {
      "id": "m2-21-21",
      "group": "Group C (10 Marks)",
      "marks": 10,
      "questionText": "(a) Find an analytic function f(z) = u + iv if u = e^x \\sin y. (b) Find the Fourier sine integral of the function f(x) = x^2 for 0 < x < b, = 0 for x > b.",
      "solutionSummary": "(a) By Milne-Thomson: f'(z) = u_x(z, 0) - i u_y(z, 0) = -i e^z => f(z) = -i e^z + C. (b) Fourier sine integral: f(x) = (2/\\pi) \\int_0^\\infty B_s(\\omega) sin(\\omega x) d\\omega where B_s(\\omega) = \\int_0^b x^2 sin(\\omega x) dx = [ -x^2 cos(\\omega x)/\\omega + 2x sin(\\omega x)/\\omega^2 + 2 cos(\\omega x)/\\omega^3 ]_0^b = \\frac{-b^2 \\cos(b\\omega)}{\\omega} + \\frac{2b \\sin(b\\omega)}{\\omega^2} + \\frac{2[\\cos(b\\omega) - 1]}{\\omega^3}.",
      "chapterRef": "Unit 5: Harmonic Functions & Milne-Thomson Method"
    },
    {
      "id": "m2-21-22",
      "group": "Group C (10 Marks)",
      "marks": 10,
      "questionText": "Obtain the general solution of the one-dimensional wave equation \\frac{\\partial^2 u}{\\partial t^2} = c^2 \\frac{\\partial^2 u}{\\partial x^2} using variable separation method.",
      "solutionSummary": "Let u(x, t) = X(x) T(t). Substituting into PDE: X T'' = c^2 X'' T => X''/X = T''/(c^2 T) = -p^2. Spatial ODE: X'' + p^2 X = 0 => X(x) = c_1 cos(px) + c_2 sin(px). Temporal ODE: T'' + p^2 c^2 T = 0 => T(t) = c_3 cos(pct) + c_4 sin(pct). Applying boundary conditions u(0, t) = u(L, t) = 0 gives p_n = n\\pi / L. General solution by superposition: u(x, t) = \\sum_{n=1}^\\infty [A_n \\cos(n\\pi c t / L) + B_n \\sin(n\\pi c t / L)] \\sin(n\\pi x / L).",
      "chapterRef": "Unit 4: Fourier Series and Integrals"
    }
  ]
},

  {
    id: "sem2-dsa-2024",
    semester: 2,
    subject: "Data Structures & Algorithms",
    subjectCode: "BIT201",
    year: 2024,
    totalMarks: 80,
    passMarks: 32,
    timeHours: 3,
    questions: [
      {
        id: "dsa-24-1",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "What is an AVL Tree? Explain balance factors and demonstrate LL, RR, LR, and RL rotation cases with step-by-step tree insertion diagrams.",
        solutionSummary: "Self-balancing BST where height difference of subtrees is at most 1. Guarantees O(log n) lookup, insert, and delete.",
        chapterRef: "Unit 4: Trees & Balanced Search Trees"
      },
      {
        id: "dsa-24-2",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Explain Dijkstra's Single Source Shortest Path algorithm. Trace the algorithm on a weighted directed graph of 6 vertices.",
        solutionSummary: "Greedy algorithm using min-priority queue. Time complexity O((V + E) log V).",
        chapterRef: "Unit 6: Graph Algorithms"
      },
      {
        id: "dsa-24-3",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Write a complete C implementation of Circular Queue with enqueue() and dequeue() operations handling full and empty conditions.",
        solutionSummary: "Circular queue utilizes modulo arithmetic (rear + 1) % MAX to prevent memory wastage.",
        chapterRef: "Unit 2: Linear Data Structures"
      }
    ]
  },
  {
    id: "sem2-oop-2024",
    semester: 2,
    subject: "Object Oriented Programming in C++",
    subjectCode: "BIT202",
    year: 2024,
    totalMarks: 80,
    passMarks: 32,
    timeHours: 3,
    questions: [
      {
        id: "oop-24-1",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Explain runtime polymorphism in C++ using virtual functions and pure virtual functions (abstract classes). Draw the vtable structure.",
        solutionSummary: "Virtual function table (vptr/vtable) enables dynamic dispatch at runtime.",
        chapterRef: "Unit 5: Polymorphism & Virtual Tables"
      }
    ]
  },

  // ── Semester 3 ──
  {
    id: "sem3-dbms-2024",
    semester: 3,
    subject: "Database Management Systems",
    subjectCode: "BIT301",
    year: 2024,
    totalMarks: 80,
    passMarks: 32,
    timeHours: 3,
    questions: [
      {
        id: "dbms-24-1",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Explain Normalization. Differentiate between 1NF, 2NF, 3NF, and BCNF with functional dependency examples and decomposition rules.",
        solutionSummary: "1NF eliminates repeating groups; 2NF eliminates partial dependencies; 3NF eliminates transitive dependencies; BCNF requires determinants to be superkeys.",
        chapterRef: "Unit 4: Relational Database Design & Normalization"
      },
      {
        id: "dbms-24-2",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Explain ACID properties of transactions. Discuss concurrency control protocols: Two-Phase Locking (2PL) and Strict 2PL.",
        solutionSummary: "Atomicity, Consistency, Isolation, Durability. 2PL growing phase acquires locks; shrinking phase releases locks.",
        chapterRef: "Unit 6: Transaction Management & Concurrency"
      }
    ]
  },

  // ── Semester 4 ──
  {
    id: "sem4-os-2024",
    semester: 4,
    subject: "Operating Systems",
    subjectCode: "BIT401",
    year: 2024,
    totalMarks: 80,
    passMarks: 32,
    timeHours: 3,
    questions: [
      {
        id: "os-24-1",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Explain Deadlocks. Detail the 4 necessary Coffman conditions and demonstrate Banker's Algorithm for deadlock avoidance with an allocation matrix.",
        solutionSummary: "Mutual exclusion, hold and wait, no preemption, circular wait. Banker's checks if available resources satisfy Need <= Available.",
        chapterRef: "Unit 4: Deadlocks & Resource Allocation"
      }
    ]
  },

  // ── Semester 5 ──
  {
    id: "sem5-ai-2024",
    semester: 5,
    subject: "Artificial Intelligence",
    subjectCode: "BIT501",
    year: 2024,
    totalMarks: 80,
    passMarks: 32,
    timeHours: 3,
    questions: [
      {
        id: "ai-24-1",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Explain A* Search Algorithm. Prove that A* is admissible when heuristic h(n) is admissible (underestimates actual cost).",
        solutionSummary: "Evaluation function f(n) = g(n) + h(n). Admissibility h(n) <= h*(n) guarantees optimal path.",
        chapterRef: "Unit 2: Heuristic Search Strategies"
      }
    ]
  },

  // ── Semester 6 ──
  {
    id: "sem6-cn-2024",
    semester: 6,
    subject: "Computer Networks",
    subjectCode: "BIT601",
    year: 2024,
    totalMarks: 80,
    passMarks: 32,
    timeHours: 3,
    questions: [
      {
        id: "cn-24-1",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Compare OSI 7 Layer reference model with TCP/IP protocol suite. Detail TCP 3-Way Handshake, Flow Control (Sliding Window), and Congestion Control.",
        solutionSummary: "SYN -> SYN-ACK -> ACK. Sliding window optimizes throughput. AIMD (Additive Increase Multiplicative Decrease) handles congestion.",
        chapterRef: "Unit 4: Transport Layer & TCP Mechanisms"
      }
    ]
  },

  // ── Semester 7 ──
  {
    id: "sem7-netprog-2025",
    semester: 7,
    subject: "Network Programming",
    subjectCode: "BIT401CO",
    year: 2025,
    totalMarks: 80,
    passMarks: 32,
    timeHours: 3,
    questions: [
      {
        id: "np-25-1",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Illustrate the TCP State Transition Diagram with special emphasis on TIME_WAIT state. Explain why 2MSL wait time is mandatory before socket closure.",
        orQuestionText: "Differentiate between Iterative and Concurrent servers. Write a complete C socket program implementing a concurrent TCP echo server using fork().",
        solutionSummary: "TIME_WAIT ensures trailing FIN/ACK segments are received and old duplicate segments expire in the network. fork() allows parent to listen while child processes client descriptor.",
        chapterRef: "Unit 1 & 3: Introduction & TCP/UDP Protocols"
      },
      {
        id: "np-25-2",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Explain I/O Multiplexing. Compare select(), poll(), and epoll() in terms of algorithmic complexity, file descriptor limits, and kernel buffer overhead.",
        solutionSummary: "select() is O(N) with FD_SETSIZE limit (1024); poll() is O(N) without fixed limit; epoll() uses event-driven epoll_ctl and epoll_wait for O(1) ready notification.",
        chapterRef: "Unit 6: I/O Multiplexing"
      },
      {
        id: "np-25-3",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Explain socket address structures: sockaddr_in (IPv4) versus sockaddr_in6 (IPv6). How does sockaddr provide generic polymorphism in C?",
        solutionSummary: "sockaddr defines generic sa_family_t and 14 bytes char; sockaddr_in casts to sockaddr using sin_family, sin_port, sin_addr.",
        chapterRef: "Unit 4: Elementary Socket Calls"
      },
      {
        id: "np-25-4",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "What are socket options? Explain SO_REUSEADDR, SO_KEEPALIVE, and TCP_NODELAY (Nagle's Algorithm disable).",
        solutionSummary: "SO_REUSEADDR allows instant server restart on ports in TIME_WAIT. TCP_NODELAY disables Nagle's algorithm for interactive real-time payloads.",
        chapterRef: "Unit 7: Socket Options"
      },
      {
        id: "np-25-5",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Explain Unix Domain Sockets (AF_UNIX). Why are they faster than standard loopback TCP (AF_INET 127.0.0.1)?",
        solutionSummary: "AF_UNIX bypasses network stack checksumming, IP header generation, and packet segmentation, passing memory buffers directly in kernel space.",
        chapterRef: "Unit 9: Unix Domain Protocol"
      }
    ]
  },
  {
    id: "sem7-gov-2025",
    semester: 7,
    subject: "Digital Governance",
    subjectCode: "BIT402CO",
    year: 2025,
    totalMarks: 80,
    passMarks: 32,
    timeHours: 3,
    questions: [
      {
        id: "dg-25-1",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Explain the architectural layers of an e-Governance system. Analyze Nepal's Digital Nepal Framework (DNF) across its eight key sectors.",
        solutionSummary: "DNF covers Digital Foundation, Agriculture, Health, Education, Energy, Tourism, Finance, and Urban Infrastructure with enterprise government architecture.",
        chapterRef: "Unit 1: Overview of E-Governance & DNF"
      },
      {
        id: "dg-25-2",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Discuss G2C, G2B, G2G, and G2E service delivery models. How has the Nagarik App transformed citizen service delivery and interoperability?",
        solutionSummary: "Nagarik App integrates PAN, Citizenships, Voter ID, Land ownership, and Vehicle tax via RESTful microservices and National Data Center API gateway.",
        chapterRef: "Unit 2: Models of E-Governance"
      },
      {
        id: "dg-25-3",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Explain Public Key Infrastructure (PKI) and Digital Signatures in the context of Nepal's Electronic Transactions Act (ETA 2063).",
        solutionSummary: "ETA 2063 legalizes asymmetric cryptography (RSA/ECC) with Controller of Certifying Authorities (CCA) issuing root trust certificates.",
        chapterRef: "Unit 5: Legal & Security Frameworks"
      }
    ]
  },
  {
    id: "sem7-ml-2025",
    semester: 7,
    subject: "Machine Learning (Track A)",
    subjectCode: "BIT421CO",
    year: 2025,
    totalMarks: 80,
    passMarks: 32,
    timeHours: 3,
    questions: [
      {
        id: "ml-25-1",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Derive the Cost Function for Linear Regression with Gradient Descent updates. Explain the Bias-Variance Tradeoff with learning curves.",
        solutionSummary: "J(w,b) = 1/(2m) sum(y_hat - y)^2. High bias = underfitting (high train & val error); high variance = overfitting (large train/val gap).",
        chapterRef: "Unit 2: Supervised Learning & Regression"
      },
      {
        id: "ml-25-2",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Explain Support Vector Machines (SVM). How does the Kernel Trick (RBF / Polynomial) enable classification in non-linearly separable spaces?",
        solutionSummary: "SVM maximizes the margin 2/||w||. Kernel functions K(x, z) = phi(x)^T phi(z) compute inner products in infinite-dimensional Hilbert spaces without explicit mapping.",
        chapterRef: "Unit 3: Classification Algorithms"
      },
      {
        id: "ml-25-3",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Differentiate between Bagging (Random Forest) and Boosting (AdaBoost / XGBoost). When is each preferred?",
        solutionSummary: "Bagging trains parallel independent trees on bootstrap samples to reduce variance. Boosting trains sequential trees focusing on residual errors to reduce bias.",
        chapterRef: "Unit 4: Ensemble Learning"
      }
    ]
  }
];

