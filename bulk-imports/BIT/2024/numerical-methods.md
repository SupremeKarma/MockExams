Q: What does "convergence" mean in the context of an iterative numerical method?
A) The method always fails to produce an answer
B) The sequence of successive approximations produced by the method gets progressively closer to the true solution as iterations continue
C) The method requires no starting guess
D) The method always produces the exact answer in one step
ANSWER: B
EXPLAIN: Convergence means that as an iterative method repeats its calculation, the sequence of approximate solutions approaches the true (exact) solution — the difference between successive approximations shrinks toward zero.
DIFFICULTY: easy
MARKS: 2

Q: What is Horner's method primarily used for?
A) Solving systems of linear equations
B) Efficiently evaluating a polynomial (and its derivatives) at a given point using nested multiplication, minimizing the number of arithmetic operations
C) Finding the root of a transcendental equation only
D) Numerically integrating a function
ANSWER: B
EXPLAIN: Horner's method rewrites a polynomial in a nested form (e.g. a₀ + x(a₁ + x(a₂ + ...))), allowing its value at a specific point to be computed with far fewer multiplications than the naive term-by-term approach.
DIFFICULTY: medium
MARKS: 2

Q: In the Gauss-Seidel iterative method for solving a system of linear equations, what key feature distinguishes it from the Jacobi method?
A) Gauss-Seidel uses only the previous iteration's values for all unknowns when updating each variable
B) Gauss-Seidel immediately uses newly updated values of variables within the same iteration as soon as they are computed, rather than waiting for the next full iteration
C) Gauss-Seidel can only solve 2x2 systems
D) Gauss-Seidel does not require an initial guess
ANSWER: B
EXPLAIN: Unlike the Jacobi method, which uses only values from the previous full iteration to compute all new values, Gauss-Seidel updates each variable using the most recently computed values within the same iteration, generally leading to faster convergence.
DIFFICULTY: hard
MARKS: 10

Q: Simpson's 3/8 rule for numerical integration requires the number of sub-intervals (strips) to be a multiple of which number?
A) 2
B) 3
C) 5
D) 7
ANSWER: B
EXPLAIN: Simpson's 3/8 rule fits a cubic polynomial through every group of 4 consecutive points, so it requires the number of strips (sub-intervals) to be a multiple of 3, unlike Simpson's 1/3 rule which requires a multiple of 2.
DIFFICULTY: medium
MARKS: 8

Q: What does the Lagrange interpolation polynomial provide?
A) The derivative of a function at a single point only
B) A polynomial that exactly passes through a given set of data points, expressed as a weighted sum of basis polynomials, usable to estimate values between the known points
C) The definite integral of a dataset
D) Only the average of the given y-values
ANSWER: B
EXPLAIN: The Lagrange interpolation polynomial is constructed so that it passes exactly through every given (x, y) data point, built from a sum of Lagrange basis polynomials each weighted by the corresponding y-value — allowing estimation of the function's value at any x within the data range.
DIFFICULTY: medium
MARKS: 8

Q: Why is the Newton-Raphson method said to have "quadratic convergence" near a simple root?
A) It converges in exactly two iterations, always
B) Under suitable conditions, the error in each successive approximation is roughly proportional to the square of the previous error, so the number of correct digits roughly doubles with each iteration
C) It requires the function to be quadratic
D) It never converges for non-quadratic functions
ANSWER: B
EXPLAIN: Near a simple root, Newton-Raphson's error term satisfies eₙ₊₁ ≈ C·eₙ², meaning the error shrinks quadratically — each iteration roughly squares (and thus dramatically shrinks) the previous error, so the number of accurate digits approximately doubles each step.
DIFFICULTY: hard
MARKS: 8

Q: The Bisection method for finding a root of f(x) requires what initial condition to guarantee a root exists in an interval [a, b]?
A) f(a) and f(b) must have the same sign
B) f(a) and f(b) must have opposite signs (i.e., f(a)·f(b) < 0), guaranteeing at least one root exists between a and b by the Intermediate Value Theorem
C) f(a) must equal zero
D) The interval [a, b] must be infinitely small
ANSWER: B
EXPLAIN: The Bisection method relies on the Intermediate Value Theorem: if f is continuous on [a, b] and f(a) and f(b) have opposite signs, at least one root must exist in that interval — the method then repeatedly halves the interval, keeping the half where the sign change persists.
DIFFICULTY: medium
MARKS: 8

Q: In the 4th-order Runge-Kutta (RK4) method for solving an ODE dy/dx = f(x, y), how many intermediate function evaluations (k values) are computed per step?
A) 1
B) 2
C) 4
D) 8
ANSWER: C
EXPLAIN: The classic 4th-order Runge-Kutta method computes four intermediate slope estimates (k₁, k₂, k₃, k₄) at each step, then combines them in a weighted average to advance the solution — this is what gives the method its name and its fourth-order accuracy.
DIFFICULTY: medium
MARKS: 8

Q: What does the "Power Method" compute for a matrix?
A) The determinant only
B) The dominant (largest magnitude) eigenvalue of a matrix and its corresponding eigenvector, through repeated matrix-vector multiplication
C) The inverse of the matrix directly
D) Only the trace of the matrix
ANSWER: B
EXPLAIN: The Power Method iteratively multiplies an initial vector by the matrix repeatedly, normalizing at each step; this process converges toward the eigenvector corresponding to the matrix's dominant (largest absolute value) eigenvalue, which can then be extracted from the ratio of successive iterations.
DIFFICULTY: hard
MARKS: 8

Q: In least squares curve fitting of the exponential form y = ae^(bx) to a dataset, what is the typical first step before applying linear least squares?
A) Directly average all the y-values
B) Take the natural logarithm of both sides to linearize the equation into ln(y) = ln(a) + bx, then apply linear least squares to fit a straight line
C) Discard half of the data points
D) Square all the x-values
ANSWER: B
EXPLAIN: The exponential model y = ae^(bx) is nonlinear in its parameters, but taking the natural log of both sides gives ln(y) = ln(a) + bx — a linear equation in the unknowns ln(a) and b — allowing standard linear least squares to be applied to estimate the parameters.
DIFFICULTY: hard
MARKS: 8
