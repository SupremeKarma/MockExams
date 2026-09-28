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
    id: "sem2-math2-2024",
    semester: 2,
    subject: "Mathematics-II",
    subjectCode: "BIT151HS",
    year: 2024,
    totalMarks: 80,
    passMarks: 32,
    timeHours: 3,
    questions: [
      {
        id: "m2-24-1",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Evaluate the double integral by changing the order of integration: I = \\int_0^1 \\int_x^{\\sqrt{x}} (x^2 + y^2) dy dx. Also find the volume of the cylinder x^2 + y^2 = 2ax bounded above by the paraboloid x^2 + y^2 = 2az and below by the xy-plane.",
        orQuestionText: "State the transformation formula for triple integrals in spherical polar coordinates. Evaluate \\iiint_V (x^2 + y^2 + z^2) dx dy dz over the sphere x^2 + y^2 + z^2 <= a^2.",
        solutionSummary: "Original region is bounded by y = x and y = \\sqrt{x} (or x = y^2) from x = 0 to 1. Reversing order gives x running from y^2 to y while y runs from 0 to 1. Outer integration yields I = \\int_0^1 [x^3/3 + xy^2]_{y^2}^y dy = 3/35. For the cylinder-paraboloid volume, V = \\iint (x^2 + y^2)/(2a) dx dy. Converting to polar coordinates x = r cos \\theta, y = r sin \\theta with boundary r = 2a cos \\theta for -\\pi/2 <= \\theta <= \\pi/2 gives V = (3\\pi a^3)/4.",
        chapterRef: "Unit 1: Multiple Integrals (Double & Polar)"
      },
      {
        id: "m2-24-2",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "State and prove the necessary and sufficient conditions for a function f(z) = u(x, y) + i v(x, y) to be analytic in Cartesian form. If u(x, y) = x^3 - 3xy^2 + 3x^2 - 3y^2 + 1, show that u is harmonic, find its harmonic conjugate v(x, y), and construct f(z) in terms of z using the Milne-Thomson method.",
        orQuestionText: "What is a Bilinear (Möbius) Transformation? Find the bilinear transformation which maps the points z = (1, i, -1) of the z-plane into the points w = (i, 0, -i) of the w-plane respectively. Also determine its fixed (invariant) points.",
        solutionSummary: "Cauchy-Riemann equations: u_x = v_y and u_y = -v_x with continuous first partial derivatives. For u = x^3 - 3xy^2 + 3x^2 - 3y^2 + 1: \\nabla^2 u = u_{xx} + u_{yy} = (6x + 6) + (-6x - 6) = 0, proving u is harmonic. By total differential dv = -u_y dx + u_x dy = (6xy + 6y) dx + (3x^2 - 3y^2 + 6x) dy, integrating yields v(x, y) = 3x^2 y - y^3 + 6xy + C. Using Milne-Thomson: f'(z) = u_x(z, 0) - i u_y(z, 0) = (3z^2 + 6z) - i(0) = 3z^2 + 6z. Integrating gives f(z) = z^3 + 3z^2 + 1 + iC.",
        chapterRef: "Unit 5: Harmonic Functions & Milne-Thomson Method"
      },
      {
        id: "m2-24-3",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "State Cauchy's Residue Theorem. Evaluate by contour integration around the unit circle |z| = 1: I = \\int_0^{2\\pi} \\frac{d\\theta}{5 + 4\\cos\\theta}.",
        orQuestionText: "Evaluate the improper real integral I = \\int_{-\\infty}^\\infty \\frac{x^2}{(x^2 + 1)(x^2 + 4)} dx using Cauchy's Residue Theorem along an indented semi-circular contour in the upper half-plane.",
        solutionSummary: "Cauchy's Residue Theorem states \\oint_C f(z) dz = 2\\pi i \\sum Res(f, z_k). Setting z = e^{i\\theta}, dz = i z d\\theta, and cos \\theta = (z + 1/z)/2 transforms the integral into \\oint_{|z|=1} \\frac{dz/iz}{5 + 2(z + 1/z)} = \\frac{1}{i} \\oint_{|z|=1} \\frac{dz}{2z^2 + 5z + 2} = \\frac{1}{i} \\oint \\frac{dz}{(2z + 1)(z + 2)}. Poles are at z = -1/2 (inside |z|=1) and z = -2 (outside). Res(f, -1/2) = lim_{z->-1/2} (z + 1/2) / [2(z + 1/2)(z + 2)] = 1 / [2(3/2)] = 1/3. Hence I = (1/i) * 2\\pi i * (1/3) = 2\\pi / 3.",
        chapterRef: "Unit 6: Residue Theorem & Trigonometric Contours"
      },
      {
        id: "m2-24-4",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Solve the differential equation by finding an integrating factor: (x^2 y - 2xy^2) dx - (x^3 - 3x^2 y) dy = 0.",
        solutionSummary: "Equation is homogeneous of degree 3 with M = x^2 y - 2xy^2 and N = -(x^3 - 3x^2 y). Since Mx + Ny = (x^3 y - 2x^2 y^2) - (x^3 y - 3x^2 y^2) = x^2 y^2 != 0, integrating factor is I.F. = 1/(Mx + Ny) = 1/(x^2 y^2). Multiplying throughout yields exact equation: (1/y - 2/x) dx + (-x/y^2 + 3/y) dy = 0. Integrating gives x/y - 2 ln|x| + 3 ln|y| = C.",
        chapterRef: "Unit 2: Exact ODE & Integrating Factors"
      },
      {
        id: "m2-24-5",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Solve Bernoulli's differential equation: dy/dx + y/x = y^2 ln x.",
        solutionSummary: "Divide by y^2: y^{-2} dy/dx + (1/x) y^{-1} = ln x. Substitute v = y^{-1}, so dv/dx = -y^{-2} dy/dx. Equation becomes dv/dx - (1/x) v = -ln x. Integrating factor I.F. = e^{\\int -1/x dx} = 1/x. Solution: v * (1/x) = \\int (-ln x / x) dx = -(ln x)^2 / 2 + C. Replacing v = 1/y gives 1/(x y) = -(ln x)^2 / 2 + C, so 1/y = C x - (x (ln x)^2)/2.",
        chapterRef: "Unit 2: Linear, Bernoulli & Clairaut Equations"
      },
      {
        id: "m2-24-6",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Find the orthogonal trajectories of the family of coaxial parabolas y^2 = 4a(x + a), where a is an arbitrary parameter.",
        solutionSummary: "Differentiating: 2y y' = 4a => a = (y y')/2. Substitute a back: y^2 = 2y y' (x + (y y')/2) = 2x y y' + y^2 (y')^2. Divide by y: y = 2x y' + y (y')^2. For orthogonal trajectories, replace y' with -1/y': y = 2x (-1/y') + y (-1/y')^2 => y (y')^2 = -2x y' + y => y (y')^2 + 2x y' - y = 0. Notice this is the exact same differential equation form, proving the family of confocal parabolas is self-orthogonal.",
        chapterRef: "Unit 2: Orthogonal Trajectories & Applications"
      },
      {
        id: "m2-24-7",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Solve the linear differential equation with constant coefficients: (D^3 - 3D^2 + 4)y = e^{2x} + cos 2x, where D = d/dx.",
        solutionSummary: "Auxiliary equation: m^3 - 3m^2 + 4 = 0 => (m + 1)(m - 2)^2 = 0. Complementary function: y_c = c_1 e^{-x} + (c_2 + c_3 x) e^{2x}. Particular integral PI_1 = 1/(D^3 - 3D^2 + 4) e^{2x}: since m=2 is a double root, differentiate denominator twice: x^2 / (6D - 6)|_{D=2} e^{2x} = (x^2 e^{2x})/6. PI_2 = 1/(D^3 - 3D^2 + 4) cos 2x: replace D^2 by -4 => 1/(-4D + 12 + 4) cos 2x = 1/(16 - 4D) cos 2x = (16 + 4D)/[256 - 16(-4)] cos 2x = (16 cos 2x - 8 sin 2x)/320 = (2 cos 2x - sin 2x)/40. General solution: y = y_c + PI_1 + PI_2.",
        chapterRef: "Unit 3: Higher-Order Linear ODEs"
      },
      {
        id: "m2-24-8",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Solve by the method of variation of parameters: d^2y/dx^2 + y = sec x.",
        solutionSummary: "Auxiliary equation: m^2 + 1 = 0 => m = \\pm i. Solutions: y_1 = cos x, y_2 = sin x. Wronskian W(y_1, y_2) = (cos x)(cos x) - (sin x)(-sin x) = 1. Particular integral y_p = u(x) y_1 + v(x) y_2, where u(x) = -\\int (y_2 sec x)/W dx = -\\int tan x dx = ln|cos x|, and v(x) = \\int (y_1 sec x)/W dx = \\int 1 dx = x. General solution: y = c_1 cos x + c_2 sin x + (ln|cos x|) cos x + x sin x.",
        chapterRef: "Unit 3: Variation of Parameters & Cauchy-Euler"
      },
      {
        id: "m2-24-9",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Solve the Cauchy-Euler homogeneous differential equation: x^2 d^2y/dx^2 - 3x dy/dx + 4y = x^2 ln x.",
        solutionSummary: "Substitute x = e^z, z = ln x, D_z = d/dz. Transformed equation: [D_z(D_z - 1) - 3 D_z + 4]y = e^{2z} z => (D_z - 2)^2 y = z e^{2z}. Auxiliary roots: m = 2, 2. Complementary function: y_c = (c_1 + c_2 z) e^{2z} = (c_1 + c_2 ln x) x^2. Particular integral PI = 1/(D_z - 2)^2 [z e^{2z}] = e^{2z} 1/D_z^2 [z] = e^{2z} (z^3 / 6) = (x^2 (ln x)^3)/6. General solution: y = (c_1 + c_2 ln x) x^2 + (x^2 (ln x)^3)/6.",
        chapterRef: "Unit 3: Variation of Parameters & Cauchy-Euler"
      },
      {
        id: "m2-24-10",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Obtain the Fourier series expansion of f(x) = x^2 in the interval -\\pi < x < \\pi. Hence deduce that \\sum_{n=1}^\\infty \\frac{(-1)^{n+1}}{n^2} = \\frac{\\pi^2}{12} and \\sum_{n=1}^\\infty \\frac{1}{n^2} = \\frac{\\pi^2}{6}.",
        solutionSummary: "Since f(x) = x^2 is an even function, b_n = 0. a_0 = (2/\\pi) \\int_0^\\pi x^2 dx = (2\\pi^2)/3. a_n = (2/\\pi) \\int_0^\\pi x^2 cos(nx) dx = (4 (-1)^n)/n^2 by integrating by parts twice. Fourier series: f(x) = \\pi^2 / 3 + 4 \\sum_{n=1}^\\infty \\frac{(-1)^n}{n^2} cos(nx). At x = 0: 0 = \\pi^2 / 3 + 4 \\sum (-1)^n / n^2 => \\sum_{n=1}^\\infty (-1)^{n+1}/n^2 = \\pi^2 / 12. At x = \\pi: \\pi^2 = \\pi^2 / 3 + 4 \\sum 1/n^2 => \\sum_{n=1}^\\infty 1/n^2 = \\pi^2 / 6.",
        chapterRef: "Unit 4: Fourier Series (Period 2pi & 2L)"
      },
      {
        id: "m2-24-11",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Find the Fourier transform of f(x) = e^{-a|x|} (a > 0). Hence evaluate the definite integral \\int_0^\\infty \\frac{\\cos \\omega x}{a^2 + \\omega^2} d\\omega.",
        solutionSummary: "F{f(x)} = \\int_{-\\infty}^\\infty e^{-a|x|} e^{-i\\omega x} dx = 2 \\int_0^\\infty e^{-ax} cos(\\omega x) dx = 2a / (a^2 + \\omega^2). By the Fourier inversion formula: f(x) = (1/2\\pi) \\int_{-\\infty}^\\infty F(\\omega) e^{i\\omega x} d\\omega = (1/\\pi) \\int_0^\\infty \\frac{2a \\cos(\\omega x)}{a^2 + \\omega^2} d\\omega = e^{-a|x|}. Rearranging yields \\int_0^\\infty \\frac{\\cos(\\omega x)}{a^2 + \\omega^2} d\\omega = (\\pi / 2a) e^{-a|x|}.",
        chapterRef: "Unit 4: Fourier Integrals & Transforms"
      },
      {
        id: "m2-24-12",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Find the Laurent series expansion of f(z) = \\frac{1}{(z - 1)(z - 2)} valid in the annuli: (i) 1 < |z| < 2, (ii) |z| > 2, (iii) 0 < |z - 1| < 1.",
        solutionSummary: "Partial fractions: f(z) = -1/(z-1) + 1/(z-2). (i) For 1 < |z| < 2: 1/|z| < 1 and |z|/2 < 1 => f(z) = -(1/z)(1 - 1/z)^{-1} - (1/2)(1 - z/2)^{-1} = -\\sum_{n=0}^\\infty z^{-(n+1)} - \\sum_{n=0}^\\infty (1/2^{n+1}) z^n. (ii) For |z| > 2: 2/|z| < 1 => f(z) = -1/z(1 - 1/z)^{-1} + 1/z(1 - 2/z)^{-1} = \\sum_{n=1}^\\infty (2^{n-1} - 1) z^{-n}. (iii) For 0 < |z-1| < 1: write in powers of (z-1): f(z) = -1/(z-1) - 1/[1 - (z-1)] = -1/(z-1) - \\sum_{n=0}^\\infty (z-1)^n, exhibiting a simple pole at z = 1.",
        chapterRef: "Unit 6: Laurent Series & Singularities"
      }
    ]
  },
  {
    id: "sem2-math2-2023",
    semester: 2,
    subject: "Mathematics-II",
    subjectCode: "BIT151HS",
    year: 2023,
    totalMarks: 80,
    passMarks: 32,
    timeHours: 3,
    questions: [
      {
        id: "m2-23-1",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Find the area of the region bounded between the parabolas y^2 = 4ax and x^2 = 4ay using double integration. Also evaluate \\iint_R xy(x + y) dx dy over the region between y = x^2 and y = x.",
        orQuestionText: "Evaluate the triple integral \\iiint_V z dx dy dz over the volume bounded by the coordinate planes x = 0, y = 0, z = 0 and the plane x/a + y/b + z/c = 1 using Dirichlet's integral theorem.",
        solutionSummary: "Intersection of y^2 = 4ax and x^2 = 4ay occurs at (0,0) and (4a, 4a). Area = \\int_0^{4a} \\int_{x^2/(4a)}^{2\\sqrt{ax}} dy dx = \\int_0^{4a} [2\\sqrt{a} x^{1/2} - x^2/(4a)] dx = [ (4/3)\\sqrt{a} (4a)^{3/2} - (4a)^3 / (12a) ] = 32a^2 / 3 - 16a^2 / 3 = 16a^2 / 3. For \\iint xy(x+y) dx dy: x runs 0 to 1, y runs x^2 to x. Integrating yields [x^5/5 - x^8/8]/2 + [x^5/5 - x^11/11]/3 evaluated from 0 to 1 = 3/56. For Dirichlet integral: \\iiint x^{p-1} y^{q-1} z^{r-1} dx dy dz = a^p b^q c^r [\\Gamma(p)\\Gamma(q)\\Gamma(r) / \\Gamma(p+q+r+1)]. Here p=1, q=1, r=2 => abc^2 [1 * 1 * 1 / \\Gamma(5)] = (abc^2)/24.",
        chapterRef: "Unit 1: Multiple Integrals (Double & Polar)"
      },
      {
        id: "m2-23-2",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Derive the Cauchy-Riemann equations in polar coordinates: \\frac{\\partial u}{\\partial r} = \\frac{1}{r} \\frac{\\partial v}{\\partial \\theta} and \\frac{\\partial v}{\\partial r} = -\\frac{1}{r} \\frac{\\partial u}{\\partial \\theta}. Show that u(r, \\theta) = r^2 \\cos 2\\theta is harmonic and find its conjugate harmonic function v(r, \\theta).",
        orQuestionText: "Define a conformal mapping. Prove that an analytic function w = f(z) is conformal at all points where f'(z) != 0. Find the bilinear transformation that maps z = (-1, 0, 1) onto w = (0, i, 3i).",
        solutionSummary: "Using relations x = r cos \\theta, y = r sin \\theta and chain rule: u_r = u_x cos \\theta + u_y sin \\theta, u_\\theta = -u_x r sin \\theta + u_y r cos \\theta. Applying Cartesian C-R equations u_x = v_y and u_y = -v_x directly establishes u_r = (1/r) v_\\theta and v_r = -(1/r) u_\\theta. For u = r^2 cos 2\\theta: u_{rr} + (1/r) u_r + (1/r^2) u_{\\theta\\theta} = 2 cos 2\\theta + 2 cos 2\\theta - 4 cos 2\\theta = 0, verifying Laplace's equation in polar coordinates. Conjugate: v_\\theta = r u_r = 2 r^2 cos 2\\theta => v = r^2 sin 2\\theta + C, so f(z) = r^2 (cos 2\\theta + i sin 2\\theta) = z^2 + iC.",
        chapterRef: "Unit 5: Cauchy-Riemann Equations (Cartesian & Polar)"
      },
      {
        id: "m2-23-3",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "State and prove Cauchy's Integral Formula for higher derivatives. Using it or Residue Calculus, evaluate \\oint_C \\frac{e^{2z}}{(z + 1)^3 (z - 2)} dz where C is the circle |z| = 3/2.",
        orQuestionText: "Evaluate the real trigonometric integral by contour integration: \\int_0^{2\\pi} \\frac{d\\theta}{13 + 5\\sin\\theta}.",
        solutionSummary: "Cauchy's integral formula for n-th derivative: f^{(n)}(z_0) = \\frac{n!}{2\\pi i} \\oint_C \\frac{f(z)}{(z - z_0)^{n+1}} dz. In |z| = 1.5, z = -1 is inside (order 3 pole) and z = 2 is outside. Let g(z) = e^{2z}/(z - 2). Then g' = (2(z-2)e^{2z} - e^{2z})/(z-2)^2 = (2z - 5)e^{2z}/(z-2)^2, g'' = e^{2z} [4(z-2)^2 - 8(z-2) + 6]/(z-2)^3. At z = -1: g''(-1) = e^{-2} [36 + 24 + 6]/(-27) = -66/(27 e^2) = -22/(9 e^2). Integral = (2\\pi i / 2!) * g''(-1) = -\\frac{22\\pi i}{9 e^2}. For the sin \\theta integral: z = e^{i\\theta}, poles are at (5z^2 + 26iz - 5) = 0 => z = -5i, -i/5. Res at z = -i/5 gives final answer \\pi / 6.",
        chapterRef: "Unit 6: Residue Theorem & Trigonometric Contours"
      },
      {
        id: "m2-23-4",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Solve the differential equation: (x^2 + y^2 + 2x) dx + 2y dy = 0.",
        solutionSummary: "M = x^2 + y^2 + 2x, N = 2y. \\partial M/\\partial y = 2y, \\partial N/\\partial x = 0. Since (M_y - N_x)/N = (2y - 0)/(2y) = 1 (a function of x alone), integrating factor is I.F. = e^{\\int 1 dx} = e^x. Multiplying gives exact equation: e^x (x^2 + y^2 + 2x) dx + 2y e^x dy = 0. Solution is \\int e^x (x^2 + y^2 + 2x) dx = e^x (x^2 + y^2) = C.",
        chapterRef: "Unit 2: Exact ODE & Integrating Factors"
      },
      {
        id: "m2-23-5",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Solve Clairaut's equation: y = px + a/p where p = dy/dx. Also find its singular solution and explain its geometric significance.",
        solutionSummary: "Differentiating with respect to x: p = p + x dp/dx - (a/p^2) dp/dx => dp/dx (x - a/p^2) = 0. Case 1: dp/dx = 0 => p = c, giving general solution y = cx + a/c (a family of straight lines). Case 2: x - a/p^2 = 0 => p = \\pm \\sqrt{a/x}. Substituting into Clairaut's equation yields y^2 = 4ax. This singular solution is the envelope of the family of tangents, representing the parabola y^2 = 4ax.",
        chapterRef: "Unit 2: Linear, Bernoulli & Clairaut Equations"
      },
      {
        id: "m2-23-6",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "A body at an initial temperature of 80°C cools down in air maintained at 20°C. In 20 minutes, its temperature drops to 60°C. Using Newton's Law of Cooling, find the temperature of the body after 40 minutes and the time taken to cool down to 30°C.",
        solutionSummary: "Newton's law: dT/dt = -k(T - T_m) where T_m = 20. Solution: T(t) = 20 + C e^{-kt}. At t=0, T=80 => C = 60. At t=20, T=60 => 60 = 20 + 60 e^{-20k} => e^{-20k} = 40/60 = 2/3. (i) At t=40: T(40) = 20 + 60 (e^{-20k})^2 = 20 + 60 (4/9) = 20 + 26.67 = 46.67°C. (ii) When T=30: 30 = 20 + 60 e^{-kt} => e^{-kt} = 1/6 => t = ln(6)/k = 20 * ln(6)/ln(1.5) = 88.38 minutes.",
        chapterRef: "Unit 2: Orthogonal Trajectories & Applications"
      },
      {
        id: "m2-23-7",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Solve the second-order non-homogeneous ODE: (D^2 + 4)y = x sin x, where D = d/dx.",
        solutionSummary: "Auxiliary equation: m^2 + 4 = 0 => m = \\pm 2i. Complementary function: y_c = c_1 cos 2x + c_2 sin 2x. Particular integral: PI = 1/(D^2 + 4) [x sin x] = Im{ 1/(D^2 + 4) [x e^{ix}] } = Im{ e^{ix} 1/((D + i)^2 + 4) [x] } = Im{ e^{ix} 1/(D^2 + 2iD + 3) [x] } = Im{ e^{ix} (1/3) [1 - (2iD/3)] x } = Im{ (cos x + i sin x) (1/3) (x - 2i/3) } = (x sin x)/3 - (2 cos x)/9. General solution: y = c_1 cos 2x + c_2 sin 2x + (x sin x)/3 - (2 cos x)/9.",
        chapterRef: "Unit 3: Higher-Order Linear ODEs"
      },
      {
        id: "m2-23-8",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Solve Legendre's linear differential equation: (1 + x)^2 \\frac{d^2y}{dx^2} + (1 + x) \\frac{dy}{dx} + y = 4 \\cos(\\ln(1 + x)).",
        solutionSummary: "Put 1 + x = e^z, z = ln(1 + x), D_z = d/dz. Equation transforms into [D_z(D_z - 1) + D_z + 1]y = 4 cos z => (D_z^2 + 1)y = 4 cos z. Auxiliary roots: m = \\pm i. Complementary function: y_c = c_1 cos z + c_2 sin z. Particular integral: PI = 1/(D_z^2 + 1) [4 cos z] = 4 (z/2) sin z = 2 z sin z. Replacing z = ln(1+x): y = c_1 cos(ln(1+x)) + c_2 sin(ln(1+x)) + 2 ln(1+x) sin(ln(1+x)).",
        chapterRef: "Unit 3: Variation of Parameters & Cauchy-Euler"
      },
      {
        id: "m2-23-9",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Model the differential equation of damped mechanical vibrations: m \\frac{d^2x}{dt^2} + c \\frac{dx}{dt} + kx = 0. Discuss the physical significance of overdamped, critically damped, and underdamped motions with displacement-time characteristics.",
        solutionSummary: "Equation m x'' + c x' + k x = 0 has characteristic roots r = -c/(2m) \\pm \\sqrt{c^2 - 4mk}/(2m). (1) Overdamped (c^2 > 4mk): Real distinct negative roots, exponential decay without oscillation. (2) Critically Damped (c^2 = 4mk): Equal negative roots, fastest return to equilibrium without overshoot. (3) Underdamped (c^2 < 4mk): Complex conjugate roots -\\gamma \\pm i\\omega_d, causing exponentially decaying sinusoidal oscillations.",
        chapterRef: "Unit 3: Simple Harmonic Motion & Vibrations"
      },
      {
        id: "m2-23-10",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Obtain the Fourier series expansion of f(x) = |x| in the interval -\\pi < x < \\pi. Hence deduce that \\frac{1}{1^2} + \\frac{1}{3^2} + \\frac{1}{5^2} + \\dots = \\frac{\\pi^2}{8}.",
        solutionSummary: "f(x) = |x| is an even function, so b_n = 0. a_0 = (2/\\pi) \\int_0^\\pi x dx = \\pi. a_n = (2/\\pi) \\int_0^\\pi x cos(nx) dx = (2/\\pi) [ x sin(nx)/n + cos(nx)/n^2 ]_0^\\pi = (2/\\pi n^2) [(-1)^n - 1]. For even n, a_n = 0; for odd n = 2k-1, a_n = -4/(\\pi (2k-1)^2). Series: f(x) = \\pi/2 - (4/\\pi) \\sum_{k=1}^\\infty \\frac{\\cos((2k-1)x)}{(2k-1)^2}. Setting x = 0: 0 = \\pi/2 - (4/\\pi) \\sum_{k=1}^\\infty 1/(2k-1)^2 => \\sum_{k=1}^\\infty 1/(2k-1)^2 = \\pi^2 / 8.",
        chapterRef: "Unit 4: Fourier Series (Period 2pi & 2L)"
      },
      {
        id: "m2-23-11",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Find the Fourier sine and cosine transforms of f(x) = e^{-ax} (a > 0).",
        solutionSummary: "Fourier sine transform: F_s{e^{-ax}} = \\int_0^\\infty e^{-ax} sin(\\omega x) dx = \\frac{\\omega}{a^2 + \\omega^2}. Fourier cosine transform: F_c{e^{-ax}} = \\int_0^\\infty e^{-ax} cos(\\omega x) dx = \\frac{a}{a^2 + \\omega^2}. Both derived using standard exponential-trigonometric integration formula \\int e^{ax} sin(bx) dx = \\frac{e^{ax}(a sin bx - b cos bx)}{a^2 + b^2}.",
        chapterRef: "Unit 4: Fourier Integrals & Transforms"
      },
      {
        id: "m2-23-12",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Classify the singularities and calculate the residues at each pole for f(z) = \\frac{z^2 - 2z}{(z + 1)^2 (z^2 + 4)}.",
        solutionSummary: "Poles are at z = -1 (pole of order 2) and z = \\pm 2i (simple poles). Res(f, 2i) = lim_{z->2i} (z - 2i) f(z) = (-4 - 4i)/[(2i + 1)^2 (4i)] = (7 + i)/50. Res(f, -2i) = (7 - i)/50. Res(f, -1) = lim_{z->-1} d/dz [(z^2 - 2z)/(z^2 + 4)] = lim_{z->-1} [(2z - 2)(z^2 + 4) - 2z(z^2 - 2z)] / (z^2 + 4)^2 = [(-4)(5) - (-2)(3)] / 25 = -14/25. Note sum of all residues = 0, verifying residue theorem at infinity.",
        chapterRef: "Unit 6: Laurent Series & Singularities"
      }
    ]
  },
  {
    id: "sem2-math2-2022",
    semester: 2,
    subject: "Mathematics-II",
    subjectCode: "BIT151HS",
    year: 2022,
    totalMarks: 80,
    passMarks: 32,
    timeHours: 3,
    questions: [
      {
        id: "m2-22-1",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Find the total volume of the ellipsoid x^2/a^2 + y^2/b^2 + z^2/c^2 <= 1 using triple integration and Dirichlet's integral transformation.",
        orQuestionText: "Evaluate \\iint_R \\sqrt{a^2 - x^2 - y^2} dx dy over the positive quadrant of the circle x^2 + y^2 <= a^2 by transforming into polar coordinates.",
        solutionSummary: "Substitute x = a u^{1/2}, y = b v^{1/2}, z = c w^{1/2}. The positive octant transforms to u + v + w <= 1 with Jacobian J = (abc)/8 u^{-1/2} v^{-1/2} w^{-1/2}. Total volume V = 8 \\iiint J du dv dw = abc [\\Gamma(1/2)^3 / \\Gamma(1/2 + 1/2 + 1/2 + 1)] = abc [(\\pi^{3/2}) / \\Gamma(5/2)] = abc \\pi^{3/2} / [(3/4)\\sqrt{\\pi}] = (4/3) \\pi a b c. For polar quadrant integral: x = r cos \\theta, y = r sin \\theta. I = \\int_0^{\\pi/2} d\\theta \\int_0^a \\sqrt{a^2 - r^2} r dr = (\\pi/2) [ -(a^2 - r^2)^{3/2} / 3 ]_0^a = (\\pi a^3) / 6.",
        chapterRef: "Unit 1: Triple Integrals & Applications"
      },
      {
        id: "m2-22-2",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Show that u(x, y) = e^x (x \\cos y - y \\sin y) is a harmonic function. Determine its harmonic conjugate v(x, y) and express the analytic function f(z) = u + iv directly as an explicit function of z.",
        orQuestionText: "Find the bilinear transformation which maps z = (0, -i, -1) into w = (i, 1, 0). Find its fixed points and show that the transformation is elliptic.",
        solutionSummary: "u_x = e^x (x cos y - y sin y + cos y), u_{xx} = e^x (x cos y - y sin y + 2 cos y). u_y = e^x (-x sin y - sin y - y cos y), u_{yy} = e^x (-x cos y - 2 cos y + y sin y). Clearly u_{xx} + u_{yy} = 0, proving u is harmonic. By C-R equations v_x = -u_y, v_y = u_x. Integrating gives v(x, y) = e^x (y cos y + x sin y) + C. Using Milne-Thomson: f'(z) = u_x(z, 0) - i u_y(z, 0) = e^z(z + 1) - i(0) = (z + 1) e^z. Integrating yields f(z) = z e^z + C.",
        chapterRef: "Unit 5: Harmonic Functions & Milne-Thomson Method"
      },
      {
        id: "m2-22-3",
        group: "Group A (10 Marks)",
        marks: 10,
        questionText: "Evaluate the real improper integral using Cauchy's Residue Theorem: I = \\int_{-\\infty}^\\infty \\frac{dx}{(x^2 + a^2)^2} where a > 0.",
        orQuestionText: "Evaluate by contour integration around the unit circle: \\int_0^{2\\pi} \\frac{\\cos 2\\theta}{5 + 4\\cos\\theta} d\\theta.",
        solutionSummary: "Consider f(z) = 1/(z^2 + a^2)^2 = 1/[(z - ia)^2 (z + ia)^2] over an upper half-plane semicircle contour of radius R. Double pole inside contour at z = ia. Res(f, ia) = lim_{z->ia} d/dz [(z - ia)^2 f(z)] = lim_{z->ia} d/dz [1/(z + ia)^2] = lim_{z->ia} [-2/(z + ia)^3] = -2/(2ia)^3 = -2/(-8i a^3) = 1/(4i a^3). By Residue Theorem: \\int_{-\\infty}^\\infty \\frac{dx}{(x^2 + a^2)^2} = 2\\pi i Res(f, ia) = 2\\pi i * \\frac{1}{4i a^3} = \\frac{\\pi}{2 a^3}.",
        chapterRef: "Unit 6: Contour Integration of Improper Integrals"
      },
      {
        id: "m2-22-4",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Solve the exact differential equation: (2xy \\cos(x^2) - 2xy + 1) dx + (\\sin(x^2) - x^2) dy = 0.",
        solutionSummary: "M = 2xy cos(x^2) - 2xy + 1, N = sin(x^2) - x^2. \\partial M/\\partial y = 2x cos(x^2) - 2x. \\partial N/\\partial x = 2x cos(x^2) - 2x. Since \\partial M/\\partial y = \\partial N/\\partial x, the equation is exact. General solution: \\int M dx (treating y constant) + \\int (terms of N independent of x) dy = C. \\int [2xy cos(x^2) - 2xy + 1] dx = y sin(x^2) - x^2 y + x. Terms in N free from x: None. Solution: y sin(x^2) - x^2 y + x = C.",
        chapterRef: "Unit 2: Exact ODE & Integrating Factors"
      },
      {
        id: "m2-22-5",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Solve the initial value problem: dy/dx + 2y \\tan x = \\sin x, given y(0) = 0.",
        solutionSummary: "First-order linear ODE with P(x) = 2 tan x and Q(x) = sin x. Integrating factor I.F. = e^{\\int 2 tan x dx} = e^{2 ln|sec x|} = sec^2 x. Solution: y * sec^2 x = \\int sin x sec^2 x dx = \\int tan x sec x dx = sec x + C. Using y(0) = 0: 0 * 1 = 1 + C => C = -1. Therefore, y sec^2 x = sec x - 1 => y = cos x - cos^2 x.",
        chapterRef: "Unit 2: Linear, Bernoulli & Clairaut Equations"
      },
      {
        id: "m2-22-6",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Solve the differential equation: (D^2 - 4D + 4)y = 8(e^{2x} + \\sin 2x + x^2), where D = d/dx.",
        solutionSummary: "Auxiliary equation: (m - 2)^2 = 0 => m = 2, 2. Complementary function: y_c = (c_1 + c_2 x) e^{2x}. Particular integral PI_1 = 8/(D-2)^2 e^{2x} = 8 (x^2/2) e^{2x} = 4 x^2 e^{2x}. PI_2 = 8/(D^2 - 4D + 4) sin 2x = 8/(-4 - 4D + 4) sin 2x = -2/D sin 2x = 2 cos 2x. PI_3 = 8/(4(1 - D + D^2/4)) x^2 = 2 (1 + D + (3/4)D^2) x^2 = 2(x^2 + 2x + 3/2) = 2x^2 + 4x + 3. General solution: y = (c_1 + c_2 x) e^{2x} + 4 x^2 e^{2x} + 2 cos 2x + 2x^2 + 4x + 3.",
        chapterRef: "Unit 3: Higher-Order Linear ODEs"
      },
      {
        id: "m2-22-7",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Solve by the method of variation of parameters: d^2y/dx^2 + 4y = \\tan 2x.",
        solutionSummary: "Auxiliary equation: m^2 + 4 = 0 => y_1 = cos 2x, y_2 = sin 2x. Wronskian W = (cos 2x)(2 cos 2x) - (sin 2x)(-2 sin 2x) = 2. Method of variation of parameters: u(x) = -\\int (y_2 tan 2x)/W dx = -1/2 \\int (sin^2 2x / cos 2x) dx = -1/4 [ ln|sec 2x + tan 2x| - sin 2x ]. v(x) = \\int (y_1 tan 2x)/W dx = 1/2 \\int sin 2x dx = -(cos 2x)/4. General solution: y = c_1 cos 2x + c_2 sin 2x - 1/4 (cos 2x) ln|sec 2x + tan 2x|.",
        chapterRef: "Unit 3: Variation of Parameters & Cauchy-Euler"
      },
      {
        id: "m2-22-8",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Find the half-range Fourier cosine series for the function f(x) = x in the interval 0 < x < L. Hence evaluate \\sum_{n=1,3,5,\\dots}^\\infty \\frac{1}{n^2}.",
        solutionSummary: "In [0, L], half-range cosine series has b_n = 0. a_0 = (2/L) \\int_0^L x dx = L. a_n = (2/L) \\int_0^L x cos(n\\pi x / L) dx = (2L / (n^2 \\pi^2)) [(-1)^n - 1]. For even n, a_n = 0; for odd n = 2k-1, a_n = -4L / ((2k-1)^2 \\pi^2). Series: f(x) = L/2 - (4L / \\pi^2) \\sum_{k=1}^\\infty \\frac{\\cos((2k-1)\\pi x / L)}{(2k-1)^2}. At x = 0: 0 = L/2 - (4L/\\pi^2) \\sum_{k=1}^\\infty 1/(2k-1)^2 => \\sum_{k=1}^\\infty \\frac{1}{(2k-1)^2} = \\frac{\\pi^2}{8}.",
        chapterRef: "Unit 4: Half-Range Series & Parseval's Identity"
      },
      {
        id: "m2-22-9",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "State Parseval's identity for Fourier series. Using the Fourier series of f(x) = x in -\\pi < x < \\pi, prove that \\sum_{n=1}^\\infty \\frac{1}{n^2} = \\frac{\\pi^2}{6}.",
        solutionSummary: "Parseval's identity: (1/\\pi) \\int_{-\\pi}^\\pi [f(x)]^2 dx = a_0^2 / 2 + \\sum_{n=1}^\\infty (a_n^2 + b_n^2). Since f(x) = x is odd, a_n = 0 and b_n = (2/\\pi) \\int_0^\\pi x sin(nx) dx = 2(-1)^{n+1}/n. LHS = (1/\\pi) \\int_{-\\pi}^\\pi x^2 dx = (2/\\pi) (\\pi^3/3) = 2\\pi^2/3. RHS = \\sum_{n=1}^\\infty b_n^2 = \\sum_{n=1}^\\infty (4 / n^2). Equating: 4 \\sum_{n=1}^\\infty 1/n^2 = 2\\pi^2 / 3 => \\sum_{n=1}^\\infty 1/n^2 = \\pi^2 / 6.",
        chapterRef: "Unit 4: Half-Range Series & Parseval's Identity"
      },
      {
        id: "m2-22-10",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "State and prove the Modulation theorem and Shifting property for the complex Fourier transform.",
        solutionSummary: "Shifting theorem: If F{f(t)} = F(\\omega), then F{f(t - a)} = \\int_{-\\infty}^\\infty f(t-a) e^{-i\\omega t} dt = e^{-i\\omega a} F(\\omega). Modulation theorem: F{f(t) \\cos(a t)} = \\int_{-\\infty}^\\infty f(t) [(e^{iat} + e^{-iat})/2] e^{-i\\omega t} dt = 1/2 [ F(\\omega - a) + F(\\omega + a) ]. Both properties follow directly from substitution into the integral definition.",
        chapterRef: "Unit 4: Fourier Integrals & Transforms"
      },
      {
        id: "m2-22-11",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "Classify all singularities of the following complex functions: (i) f(z) = \\frac{\\cot \\pi z}{(z - a)^2}, (ii) g(z) = \\frac{\\sin z}{z}, (iii) h(z) = e^{1/z}.",
        solutionSummary: "(i) f(z) = \\frac{\\cos \\pi z}{(z - a)^2 \\sin \\pi z}: Simple poles at z = n (for integer n != a) where sin \\pi z = 0; if a is an integer, z = a is a pole of order 3; if a is non-integer, z = a is a pole of order 2. The point at infinity is a non-isolated essential singularity. (ii) g(z) = \\sin z / z = \\sum_{n=0}^\\infty (-1)^n z^{2n} / (2n+1)!: Removable singularity at z = 0 since lim_{z->0} g(z) = 1. (iii) h(z) = e^{1/z} = 1 + 1/z + 1/(2! z^2) + \\dots: Essential singularity at z = 0 because the principal part contains infinitely many negative powers of z.",
        chapterRef: "Unit 6: Laurent Series & Singularities"
      },
      {
        id: "m2-22-12",
        group: "Group B (5 Marks)",
        marks: 5,
        questionText: "State the Convolution Theorem for Fourier transforms. Use it to solve the integral equation \\int_{-\\infty}^\\infty f(u) \\frac{1}{(x - u)^2 + a^2} du = \\frac{1}{x^2 + b^2} (b > a > 0).",
        solutionSummary: "Convolution Theorem: F{f * g} = F{f} * F{g}. Here (f * g)(x) = 1/(x^2 + b^2) where g(x) = 1/(x^2 + a^2). Fourier transforms: F{g} = (\\pi/a) e^{-a|\\omega|} and F{f * g} = (\\pi/b) e^{-b|\\omega|}. Therefore F{f} = [ (\\pi/b) e^{-b|\\omega|} ] / [ (\\pi/a) e^{-a|\\omega|} ] = (a/b) e^{-(b - a)|\\omega|}. Applying inverse Fourier transform yields f(x) = \\frac{a}{\\pi b} \\frac{b - a}{x^2 + (b - a)^2}.",
        chapterRef: "Unit 4: Fourier Integrals & Transforms"
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

