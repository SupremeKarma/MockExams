import type { SemesterNotesData } from "./bitNotesData";

/**
 * Purbanchal University — Faculty of Science & Technology
 * Bachelor in Information Technology (BIT)
 * Year I, Semester II (Semester 2) Official Study Notes Database
 *
 * FULL UNIT-WISE & TOPIC-WISE SYLLABUS ALIGNMENT:
 * 1. BIT151HS: Mathematics-II
 * 2. BIT152CO: Digital Logic
 * 3. BIT153HS: Discrete Structure
 * 4. BIT154CO: Object-Oriented Programming in C++
 * 5. BIT155MS: Financial Management and Accounting
 * 6. BIT156CO: Project-II
 */
export const semester2NotesData: SemesterNotesData = {
  "Mathematics-II": {
    subjectName: "Mathematics-II",
    code: "BIT151HS",
    creditHours: 3,
    topics: [
      {
        id: "m2-u1-double-integrals",
        name: "Double & Triple Integrals, Change of Order & Polar Coordinates",
        unit: 1,
        unitTitle: "Unit 1: Multiple Integrals",
        unitCode: "1.1",
        importance: "Very High",
        keyPoints: [
          "Double integral ∬_R f(x, y) dA computes volume under surface z = f(x,y) over 2D region R.",
          "Change of order of integration alters limits: from dy dx (vertical stripes) to dx dy (horizontal stripes), often simplifying impossible antiderivatives.",
          "Transformation to polar coordinates: x = r cos θ, y = r sin θ with Jacobian determinant J = r, giving dA = r dr dθ.",
          "Triple integral ∭_V f(x, y, z) dV in spherical coordinates: x = ρ sin φ cos θ, y = ρ sin φ sin θ, z = ρ cos φ with dV = ρ² sin φ dρ dφ dθ.",
          "Applications: Area of plane region A = ∬_R dx dy; Mass M = ∬_R ρ(x, y) dA; Center of gravity (x̄, ȳ) where x̄ = (1/M) ∬_R x ρ(x, y) dA."
        ],
        theory: "Multiple integrals extend single-variable Riemann integration to higher-dimensional Euclidean spaces. Fubini's Theorem guarantees that for continuous functions over bounded regions, multiple integrals evaluate as iterated single integrals. When switching coordinate systems, the transformation scale factor is quantified by the Jacobian determinant J = ∂(x, y)/∂(u, v). Changing the order of integration requires sketching the boundary curves, identifying intersection points, and rewriting the independent and dependent variable bounds.",
        code: `// Analytical Evaluation: Change of Order of Integration
// Evaluate: I = ∫_0^1 ∫_x^1 sin(y^2) dy dx
// Step 1: Region R is bounded by y = x, y = 1, x = 0, x = 1 (triangle)
// Step 2: In horizontal strips: for a fixed y ∈ [0, 1], x ranges from 0 to y
// Step 3: Rewritten Integral:
// I = ∫_0^1 [ ∫_0^y sin(y^2) dx ] dy
//   = ∫_0^1 sin(y^2) [x]_0^y dy = ∫_0^1 y sin(y^2) dy
// Let u = y^2 => du = 2y dy => (1/2) ∫_0^1 sin(u) du
//   = (1/2) [-cos(u)]_0^1 = (1 - cos(1)) / 2 ≈ 0.2298`,
        example: "Area of circle x² + y² = a² using polar double integrals: ∬_R dA = ∫_0^{2π} ∫_0^a r dr dθ = ∫_0^{2π} [r²/2]_0^a dθ = (a²/2)(2π) = π a².",
        commonExamQuestions: [
          "[8 Marks] Change the order of integration and evaluate ∫_0^∞ ∫_x^∞ (e^{-y} / y) dy dx.",
          "[7 Marks] Find the volume of the sphere x² + y² + z² = a² using spherical polar coordinates triple integration.",
          "[7 Marks] Evaluate ∬_R (x + y)² dx dy over the region bounded by x + y = 0, x + y = 1, 2x - y = 0, and 2x - y = 3 using change of variables."
        ]
      },
      {
        id: "m2-u2-first-order-ode",
        name: "First Order Differential Equations: Exact, Linear & Bernoulli",
        unit: 2,
        unitTitle: "Unit 2: Differential Equations of the First Order",
        unitCode: "2.1",
        importance: "Very High",
        keyPoints: [
          "Exact ODE test: M(x, y) dx + N(x, y) dy = 0 is exact if and only if ∂M/∂y = ∂N/∂x.",
          "Integrating Factors (IF): If (1/N)(∂M/∂y - ∂N/∂x) = f(x), then IF = e^{∫ f(x) dx}.",
          "First-order linear ODE: dy/dx + P(x) y = Q(x) has integrating factor IF = e^{∫ P(x) dx}; General solution: y * IF = ∫ (Q(x) * IF) dx + C.",
          "Bernoulli's equation: dy/dx + P(x) y = Q(x) y^n. Divide by y^n and substitute v = y^{1-n} to linearize into dv/dx + (1-n) P(x) v = (1-n) Q(x).",
          "Orthogonal trajectories: Replace dy/dx with -dx/dy in Cartesian, or dr/dθ with -r² (dθ/dr) in polar coordinates."
        ],
        theory: "Ordinary differential equations (ODEs) of the first order relate an unknown function y(x) and its first derivative. A differential equation represents a family of curves, where the general solution contains one arbitrary constant C. An exact differential equation arises directly from the total differential dU = (∂U/∂x) dx + (∂U/∂y) dy = 0. When non-exact, multiplying by an integrating factor μ(x, y) enforces the Euler reciprocity condition ∂(μM)/∂y = ∂(μN)/∂x.",
        code: `// Solution Pattern for Bernoulli ODE:
// dy/dx + (1/x) y = x * y^2
// 1. Divide by y^2: y^{-2} (dy/dx) + (1/x) y^{-1} = x
// 2. Let v = y^{-1} => dv/dx = -y^{-2} (dy/dx) => y^{-2} (dy/dx) = -dv/dx
// 3. Substitute: -dv/dx + (1/x) v = x => dv/dx - (1/x) v = -x
// 4. Linear IF: e^{∫ -1/x dx} = e^{-ln x} = 1/x
// 5. Solution: v * (1/x) = ∫ (-x * 1/x) dx = -x + C
// 6. Back-substitute v = 1/y: 1/(x*y) = -x + C => y = 1 / (C*x - x^2)`,
        example: "Orthogonal trajectories of parabolas y² = 4ax: Differentiating gives 2y(dy/dx) = 4a = 4(y²/4x) = y²/x => dy/dx = y/(2x). Replacing dy/dx with -dx/dy: -dx/dy = y/(2x) => 2x dx + y dy = 0 => 2x²/2 + y²/2 = C => 2x² + y² = C (a family of ellipses).",
        commonExamQuestions: [
          "[8 Marks] Solve the exact differential equation (x⁴ - 2xy² + y⁴) dx - (2x²y - 4xy³ + sin y) dy = 0.",
          "[7 Marks] Solve the linear equation (x + 1) (dy/dx) - y = e^{3x} (x + 1)².",
          "[7 Marks] Find the orthogonal trajectories of the family of cardioids r = a (1 - cos θ)."
        ]
      },
      {
        id: "m2-u3-higher-order-linear-ode",
        name: "Higher Order Linear Differential Equations & Variation of Parameters",
        unit: 3,
        unitTitle: "Unit 3: Linear Differential Equations",
        unitCode: "3.1",
        importance: "Very High",
        keyPoints: [
          "Linear ODE with constant coefficients: a_n (d^n y/dx^n) + ... + a_0 y = X(x). General solution: y = y_h (CF) + y_p (PI).",
          "Complementary Function (CF): Form auxiliary equation f(m) = 0. Distinct real roots: c₁e^{m₁x} + c₂e^{m₂x}; Repeated roots: (c₁ + c₂x)e^{mx}; Complex roots α ± iβ: e^{αx}(c₁ cos βx + c₂ sin βx).",
          "Particular Integral (PI) shortcut formulas: 1/f(D) [e^{ax}] = e^{ax}/f(a) (for f(a) ≠ 0); 1/f(D²) [sin ax] = sin ax / f(-a²).",
          "Method of Variation of Parameters: Finds PI for arbitrary RHS R(x): y_p = -y₁ ∫ (y₂ R / W) dx + y₂ ∫ (y₁ R / W) dx, where W = Wronskian(y₁, y₂).",
          "Cauchy-Euler equation: x² (d²y/dx²) + p x (dy/dx) + q y = X(x). Substitute x = e^z (z = ln x) to transform into constant coefficient ODE with x (d/dx) = D_z."
        ],
        theory: "The solution space of an nth-order homogeneous linear differential equation forms an n-dimensional vector space. Linear independence of solutions y₁, y₂, ..., y_n is established if their Wronskian determinant W(y₁, y₂, ..., y_n) ≠ 0. For non-homogeneous equations L[y] = R(x), the operator method treats D = d/dx algebraically. When standard inverse operator shortcuts fail (such as for sec x, tan x, or quotient expressions), the Method of Variation of Parameters replaces constants c₁, c₂ with variable functions u₁(x), u₂(x).",
        code: `// Variation of Parameters for: y'' + y = sec x
// 1. Auxiliary Equation: m^2 + 1 = 0 => m = ±i
//    CF: y_h = c1 cos x + c2 sin x => y1 = cos x, y2 = sin x
// 2. Wronskian W(y1, y2):
//    W = | cos x    sin x |
//        |-sin x    cos x | = cos^2 x + sin^2 x = 1
// 3. RHS R(x) = sec x
//    u1 = -∫ (y2 * R / W) dx = -∫ sin x * sec x dx = -∫ tan x dx = ln|cos x|
//    u2 = ∫ (y1 * R / W) dx = ∫ cos x * sec x dx = ∫ 1 dx = x
// 4. Particular Integral:
//    y_p = u1*y1 + u2*y2 = (ln|cos x|) cos x + x sin x
// 5. General Solution:
//    y = c1 cos x + c2 sin x + (ln|cos x|) cos x + x sin x`,
        example: "Cauchy-Euler equation x² y'' - 2x y' - 4y = x²: Let x = e^z => [D(D - 1) - 2D - 4]y = e^{2z} => (D² - 3D - 4)y = e^{2z}. Roots: m = 4, -1 => CF = c₁e^{4z} + c₂e^{-z} = c₁x⁴ + c₂x⁻¹. PI = e^{2z}/(2² - 3(2) - 4) = e^{2z}/(-6) = -x²/6. General solution: y = c₁x⁴ + c₂/x - x²/6.",
        commonExamQuestions: [
          "[8 Marks] Solve by method of variation of parameters: d²y/dx² + 4y = 4 tan 2x.",
          "[7 Marks] Solve the Cauchy-Euler differential equation: x² (d²y/dx²) - 3x (dy/dx) + 4y = 2x².",
          "[7 Marks] Solve (D³ - 3D² + 4D - 2) y = e^x + cos x."
        ]
      },
      {
        id: "m2-u4-fourier-series-integrals",
        name: "Fourier Series, Half-Range Expansions & Fourier Transforms",
        unit: 4,
        unitTitle: "Unit 4: Fourier Series and Integrals",
        unitCode: "4.1",
        importance: "Very High",
        keyPoints: [
          "Fourier Series of f(x) on [-L, L]: f(x) = a₀/2 + ∑_{n=1}^∞ [a_n cos(nπx/L) + b_n sin(nπx/L)].",
          "Euler-Fourier Coefficients: a₀ = (1/L) ∫_{-L}^L f(x) dx; a_n = (1/L) ∫_{-L}^L f(x) cos(nπx/L) dx; b_n = (1/L) ∫_{-L}^L f(x) sin(nπx/L) dx.",
          "Even functions: f(-x) = f(x) => b_n = 0 (Fourier Cosine Series); Odd functions: f(-x) = -f(x) => a₀ = 0, a_n = 0 (Fourier Sine Series).",
          "Dirichlet's Conditions: f(x) must be single-valued, periodic, piece-wise continuous with a finite number of finite discontinuities and extrema.",
          "Parseval's Identity: (1/L) ∫_{-L}^L [f(x)]² dx = a₀²/2 + ∑_{n=1}^∞ (a_n² + b_n²), widely used to evaluate infinite reciprocal square sums.",
          "Fourier Transform: F(ω) = (1/√(2π)) ∫_{-∞}^∞ f(t) e^{-iωt} dt; Inverse: f(t) = (1/√(2π)) ∫_{-∞}^∞ F(ω) e^{iωt} dω."
        ],
        theory: "Fourier analysis decomposes arbitrary periodic waveform signals into harmonically related sinusoidal components. Under Dirichlet conditions, the series converges to f(x) at points of continuity, and to the average value [f(x+) + f(x-)]/2 at finite jump discontinuities. For non-periodic transient functions on (-∞, ∞), the discrete spectrum extends to a continuous frequency distribution via the Fourier Integral Theorem.",
        code: `// Fourier Series Calculation for Square Wave on [-π, π]:
// f(x) = -k for -π < x < 0; f(x) = +k for 0 < x < π (Odd function)
// Since f(x) is odd: a0 = 0 and an = 0 for all n.
// bn = (2/π) ∫_0^π k sin(nx) dx = (2k/π) [-cos(nx)/n]_0^π
//    = (2k / (n*π)) [1 - (-1)^n]
// For even n: bn = 0
// For odd n:  bn = 4k / (n*π)
// Resulting Fourier Series:
// f(x) = (4k/π) [ sin(x) + sin(3x)/3 + sin(5x)/5 + ... ]
// At x = π/2: f(π/2) = k => k = (4k/π) [ 1 - 1/3 + 1/5 - 1/7 + ... ]
// => π/4 = 1 - 1/3 + 1/5 - 1/7 + ... (Leibniz's Formula for π)`,
        example: "Half-range cosine series for f(x) = x on [0, π]: a₀ = (2/π) ∫_0^π x dx = π; a_n = (2/π) ∫_0^π x cos(nx) dx = (2/(π n²))[(-1)^n - 1]. For odd n, a_n = -4/(π n²); for even n, a_n = 0. f(x) = π/2 - (4/π) ∑_{n=1,3,5...} [cos(nx)/n²]. Setting x = 0 yields ∑_{odd} 1/n² = π²/8.",
        commonExamQuestions: [
          "[8 Marks] Obtain the Fourier series expansion of f(x) = x² in the interval -π < x < π. Hence deduce that 1/1² - 1/2² + 1/3² - ... = π²/12.",
          "[7 Marks] Find the half-range sine series for f(x) = e^x in 0 < x < 1.",
          "[7 Marks] State Dirichlet conditions. Find the Fourier transform of f(x) = 1 for |x| < a and f(x) = 0 for |x| > a."
        ]
      },
      {
        id: "m2-u5-complex-variables-analytic",
        name: "Complex Analytic Functions, Cauchy-Riemann Equations & Conformal Mapping",
        unit: 5,
        unitTitle: "Unit 5: Functions of a Complex Variable",
        unitCode: "5.1",
        importance: "Very High",
        keyPoints: [
          "A complex function f(z) = u(x, y) + i v(x, y) is analytic (holomorphic) in a domain D if it is single-valued and differentiable at every point in D.",
          "Cauchy-Riemann (C-R) Equations in Cartesian form: ∂u/∂x = ∂v/∂y and ∂u/∂y = -∂v/∂x.",
          "C-R Equations in Polar form: ∂u/∂r = (1/r) (∂v/∂θ) and ∂v/∂r = -(1/r) (∂u/∂θ).",
          "Harmonic Functions: Both real and imaginary parts of an analytic function satisfy Laplace's equation: ∇²u = ∂²u/∂x² + ∂²u/∂y² = 0. v is called the harmonic conjugate of u.",
          "Milne-Thomson Method: Reconstructs f(z) directly from u(x, y) without calculating v: f'(z) = u_x(z, 0) - i u_y(z, 0) => f(z) = ∫ [u_x(z, 0) - i u_y(z, 0)] dz + C.",
          "Bilinear (Mobius) Transformation: w = (az + b)/(cz + d) where ad - bc ≠ 0. Preserves the cross-ratio of four distinct points and maps circles/lines into circles/lines."
        ],
        theory: "Complex differentiability is a much stronger condition than real differentiability because Δz = Δx + iΔy can approach zero from infinitely many directions in the complex plane. The C-R equations ensure that the limit of [f(z+Δz) - f(z)]/Δz is path-independent. Geometric mapping w = f(z) is conformal (preserves magnitude and sense of angles between curves) at all points where f'(z) ≠ 0.",
        code: `// Milne-Thomson Construction of Analytic Function:
// Given: u(x, y) = x^3 - 3xy^2 + 3x^2 - 3y^2 + 1
// 1. Partial derivatives:
//    u_x = 3x^2 - 3y^2 + 6x
//    u_y = -6xy - 6y
// 2. Put x = z and y = 0:
//    u_x(z, 0) = 3z^2 + 6z
//    u_y(z, 0) = 0
// 3. By Milne-Thomson Method:
//    f'(z) = u_x(z, 0) - i * u_y(z, 0) = 3z^2 + 6z
// 4. Integrate with respect to z:
//    f(z) = ∫ (3z^2 + 6z) dz + C = z^3 + 3z^2 + C`,
        example: "Verify harmonicity of u = e^x cos y: u_x = e^x cos y, u_{xx} = e^x cos y; u_y = -e^x sin y, u_{yy} = -e^x cos y. ∇²u = u_{xx} + u_{yy} = e^x cos y - e^x cos y = 0 (Harmonic). Harmonic conjugate v = e^x sin y + C.",
        commonExamQuestions: [
          "[8 Marks] State and prove the necessary and sufficient conditions for a complex function f(z) = u + iv to be analytic (derive Cauchy-Riemann equations).",
          "[7 Marks] If u = x² - y², find its harmonic conjugate v(x, y) and express f(z) as a function of z.",
          "[7 Marks] Find the bilinear transformation which maps the points z = {1, i, -1} into the points w = {i, 0, -i}."
        ]
      },
      {
        id: "m2-u6-residues-contour-integration",
        name: "Laurent Series, Poles, Residue Theorem & Contour Integration",
        unit: 6,
        unitTitle: "Unit 6: Complex Series, Residues and Poles",
        unitCode: "6.1",
        importance: "Very High",
        keyPoints: [
          "Laurent Series: f(z) = ∑_{n=0}^∞ a_n (z - z₀)^n + ∑_{n=1}^∞ b_n / (z - z₀)^n valid in an annulus r < |z - z₀| < R.",
          "Classification of Singularities: Removable singularity (no negative powers in principal part); Pole of order m (principal part terminates at b_m/(z-z₀)^m); Essential singularity (infinite terms in principal part, e.g., e^{1/z}).",
          "Residue Calculation: For a simple pole (order 1): Res(z₀) = lim_{z → z₀} (z - z₀) f(z). For a pole of order m: Res(z₀) = (1/(m-1)!) lim_{z → z₀} d^{m-1}/dz^{m-1} [(z - z₀)^m f(z)].",
          "Cauchy's Residue Theorem: ∮_C f(z) dz = 2πi ∑ Res(z_k), summing residues at all poles enclosed within closed contour C.",
          "Contour Integration of Real Integrals: ∫_0^{2π} R(cos θ, sin θ) dθ transformed using z = e^{iθ}, cos θ = (z + 1/z)/2, sin θ = (z - 1/z)/(2i), dz = i z dθ over unit circle |z| = 1."
        ],
        theory: "Where Taylor series expansions require analyticity throughout an entire disk, Laurent series extend representation to punctured disks containing isolated singular points. The coefficient b₁ = (1/2πi) ∮_C f(z) dz of the 1/(z - z₀) term is precisely the Residue. Cauchy's Residue Theorem turns difficult definite and improper real integrals across (-∞, ∞) into algebraic pole-residue evaluations along semicircular Bromwich or indented contours.",
        code: `// Evaluate Real Definite Integral via Residue Calculus:
// I = ∫_0^{2π} dθ / (5 - 4 cos θ)
// 1. Substitute z = e^{iθ} => cos θ = (z^2 + 1)/(2z), dθ = dz / (i*z)
// 2. Transformed contour integral over unit circle C: |z| = 1
//    I = ∮_C [dz / (i*z)] / [5 - 4((z^2 + 1)/(2z))]
//      = ∮_C dz / [ i * z * (5 - (2z^2 + 2)/z) ]
//      = ∮_C dz / [ i * (5z - 2z^2 - 2) ] = (1/i) ∮_C dz / [-(2z - 1)(z - 2)]
// 3. Poles: z = 1/2 (inside |z|=1) and z = 2 (outside |z|=1)
// 4. Residue at simple pole z = 1/2:
//    Res(1/2) = lim_{z -> 1/2} (z - 1/2) * [ 1 / (-2(z - 1/2)(z - 2)) ]
//             = 1 / [-2(1/2 - 2)] = 1 / [-2(-3/2)] = 1/3
// 5. By Cauchy's Residue Theorem:
//    I = (1/i) * [2πi * Res(1/2)] = (1/i) * (2πi * (1/3)) = 2π / 3`,
        example: "Laurent series of f(z) = 1 / [(z - 1)(z - 2)] in 1 < |z| < 2: f(z) = 1/(z - 2) - 1/(z - 1) = -(1/2)/(1 - z/2) - (1/z)/(1 - 1/z) = -∑_{n=0}^∞ (z^n / 2^{n+1}) - ∑_{n=1}^∞ (1 / z^n). Contains both positive and negative powers.",
        commonExamQuestions: [
          "[8 Marks] State Cauchy's Residue Theorem. Evaluate ∮_C [(z - 3) / (z² + 2z + 5)] dz where C is |z + 1 - i| = 2.",
          "[7 Marks] Expand f(z) = 1 / (z² - 3z + 2) in Laurent series valid for: (i) |z| < 1, (ii) 1 < |z| < 2, (iii) |z| > 2.",
          "[7 Marks] Using contour integration, evaluate ∫_{-∞}^∞ [1 / (x⁴ + 1)] dx."
        ]
      }
    ],
    theoryTopics: [
      "Derive the Euler equations for finding Fourier coefficients of periodic functions over arbitrary interval [-L, L].",
      "Explain the physical significance of divergence and curl of vector fields, and prove that the real and imaginary parts of an analytic function form orthogonal trajectories.",
      "Distinguish between isolated, removable, pole, and essential singularities with standard complex variable examples.",
      "Explain how Cauchy-Euler differential equations are transformed into linear differential equations with constant coefficients."
    ]
  },

  "Digital Logic": {
    subjectName: "Digital Logic",
    code: "BIT152CO",
    creditHours: 3,
    topics: [
      {
        id: "dl-u1-number-systems-codes",
        name: "Radix Conversions, Complement Arithmetic, Binary Codes & Error Detection",
        unit: 1,
        unitTitle: "Unit 1: Number Systems and Codes",
        unitCode: "1.1",
        importance: "Very High",
        keyPoints: [
          "Radix r conversions: Successive division by r for integer part; successive multiplication by r for fractional part.",
          "Signed numbers: Signed-magnitude has dual zero (+0 and -0); 1's complement has end-around carry; 2's complement (1's comp + 1) is standard in microprocessors because subtraction is executed via adder hardware.",
          "Hardware overflow rule: In 2's complement addition, overflow occurs if and only if two numbers of the same sign yield a result with the opposite sign (V = C_{in} ⊕ C_{out} on the MSB).",
          "Binary Codes: BCD (8421, invalid codes 1010-1111); Excess-3 (self-complementing BCD + 3); Gray code (unit-distance code where adjacent values change by exactly 1 bit).",
          "Hamming Code (Error correction): Parity bits placed at powers of 2 (positions 1, 2, 4, 8...). Detects and pinpoints single-bit errors via parity syndrome checks."
        ],
        theory: "Digital computation relies on positional number systems where the weight of each digit is a power of base r. In n-bit 2's complement representation, values span from -2^{n-1} to +(2^{n-1} - 1). Gray codes minimize electrical switching noise and eliminate transient decoding spikes in rotary optical shaft encoders. Error-detecting and correcting codes introduce controlled redundancy: a Hamming code with k parity bits protects m data bits provided 2^k ≥ m + k + 1.",
        code: `// C++ Bitwise Verification of 2's Complement Addition & Overflow Detection
#include <iostream>
using namespace std;

bool addWithOverflow(int8_t a, int8_t b, int8_t &result) {
    int16_t sum = (int16_t)a + (int16_t)b;
    result = (int8_t)sum;
    // Overflow occurs when both operands have same sign, but result has opposite sign
    bool overflow = ((a > 0 && b > 0 && result < 0) || (a < 0 && b < 0 && result > 0));
    return overflow;
}

int main() {
    int8_t x = 100, y = 50, res;
    if (addWithOverflow(x, y, res)) {
        cout << "Arithmetic Overflow Detected! Result wrapped to: " << (int)res << endl;
    }
    return 0;
}`,
        example: "Convert Binary 10110 to Gray Code: Retain MSB = 1; Bit 1 = 1 ⊕ 0 = 1; Bit 2 = 0 ⊕ 1 = 1; Bit 3 = 1 ⊕ 1 = 0; Bit 4 = 1 ⊕ 0 = 1. Gray Code = 11101.",
        commonExamQuestions: [
          "[8 Marks] Perform subtraction using 2's complement arithmetic: (i) (42)₁₀ - (68)₁₀, (ii) (-35)₁₀ - (-18)₁₀ using 8-bit registers. State how overflow is detected.",
          "[7 Marks] Encode data bits 1011 using 7-bit even parity Hamming Code. Show how a single-bit error in the 5th bit position is detected and corrected.",
          "[7 Marks] Convert (523.6875)₁₀ to Binary, Octal, and Hexadecimal representations."
        ]
      },
      {
        id: "dl-u2-boolean-algebra-gates",
        name: "Boolean Axioms, Canonical SOP/POS & Universal Logic Implementation",
        unit: 2,
        unitTitle: "Unit 2: Boolean Algebra and Logic Gates",
        unitCode: "2.1",
        importance: "Very High",
        keyPoints: [
          "Boolean Postulates: Commutative, Associative, Distributive (A + BC = (A + B)(A + C)), Identity (A + 0 = A, A · 1 = A), and Complement (A + A' = 1, A · A' = 0).",
          "Principle of Duality: Any valid Boolean algebraic identity remains valid if AND and OR operators are interchanged, and 0 and 1 are interchanged.",
          "De Morgan's Laws: (A + B)' = A' · B' and (A · B)' = A' + B'.",
          "Canonical Forms: Minterm (m_i) is a product of all literals where variable is unprimed for 1 and primed for 0; Maxterm (M_i) is a sum where variable is primed for 1 and unprimed for 0.",
          "Universal Gates: NAND and NOR gates can implement all three primary operations (NOT, AND, OR) individually, making single-gate-type silicon manufacturing practical."
        ],
        theory: "Boolean algebra provides the mathematical framework for modeling two-state switching circuits. Any logic function can be expressed in canonical Sum of Minterms (SOP) or Product of Maxterms (POS). Since NAND and NOR gates form functionally complete sets, any multi-level AND-OR circuit can be transformed into a NAND-NAND or NOR-NOR equivalent by inserting bubble inversions and applying De Morgan's identities without changing circuit latency.",
        code: `// Realization of Basic Gates Using Only 2-Input NAND Gates:
// 1. NOT Gate:
//    Y = A' = (A · A)'                   => 1 NAND gate
// 2. AND Gate:
//    Y = A · B = ((A · B)')'             => 2 NAND gates
// 3. OR Gate:
//    Y = A + B = (A' · B')'              => 3 NAND gates (Invert inputs, then NAND)
// 4. XOR Gate:
//    Y = A ⊕ B = A'B + AB' = (A · (A · B)')' · (B · (A · B)')'
//    => 4 NAND gates:
//       N1 = (A · B)'
//       N2 = (A · N1)'
//       N3 = (B · N1)'
//       N4 = (N2 · N3)' = A ⊕ B`,
        example: "Convert F(A, B, C) = AB + A'C to canonical SOP: F = AB(C + C') + A'(B + B')C = ABC + ABC' + A'BC + A'B'C = ∑m(1, 3, 6, 7). Maxterm form: ∏M(0, 2, 4, 5).",
        commonExamQuestions: [
          "[8 Marks] State and prove De Morgan's theorems. Implement F(w, x, y, z) = ∑m(0, 2, 8, 10, 14) using NAND gates only.",
          "[7 Marks] Convert the Boolean expression F = (A + B)(B + C)(A + C) into standard SOP and canonical POS forms.",
          "[7 Marks] Prove algebraically that A + A'B = A + B and AB + A'C + BC = AB + A'C (Consensus Theorem)."
        ]
      },
      {
        id: "dl-u3-kmap-minimization",
        name: "K-Map Minimization (2-5 Variables), Don't Cares & Quine-McCluskey",
        unit: 3,
        unitTitle: "Unit 3: Simplification of Boolean Functions",
        unitCode: "3.1",
        importance: "Very High",
        keyPoints: [
          "Karnaugh Map (K-Map) arranges minterms such that adjacent cells differ by exactly one binary bit (Gray code order: 00, 01, 11, 10).",
          "Grouping Rules: Groups must be powers of two (1, 2, 4, 8, 16); groups may wrap around edges and corners; largest possible groups eliminate the most variables.",
          "Implicants: Prime Implicant (PI) cannot be combined into a larger group; Essential Prime Implicant (EPI) covers at least one minterm not covered by any other PI.",
          "Don't Care (d) conditions: Output states that can never occur in practice; can be treated as 1 if it enlarges a group, or 0 if not helpful.",
          "Quine-McCluskey (Tabulation) method: Deterministic algorithmic reduction for functions with > 4 variables, used in Electronic Design Automation (EDA) software."
        ],
        theory: "K-Map minimization is a graphical implementation of the consensus theorem A·x + A·x' = A. Minimizing a function requires finding all Essential Prime Implicants first, then selecting the minimum set of remaining Prime Implicants to cover any lingering uncovered minterms. Don't-care conditions (X) offer degrees of freedom that prevent oversized gate structures.",
        code: `// 4-Variable K-Map Layout with Gray Code Indexing:
//           CD=00  CD=01  CD=11  CD=10
//   AB=00 |  m0  |  m1  |  m3  |  m2  |
//   AB=01 |  m4  |  m5  |  m7  |  m6  |
//   AB=11 | m12  | m13  | m15  | m14  |
//   AB=10 |  m8  |  m9  | m11  | m10  |

// Worked Minimization: F(A, B, C, D) = ∑m(0, 1, 2, 5, 8, 9, 10) + d(7, 14, 15)
// Quad 1: m0, m1, m8, m9 (corners/edges) => B'C'
// Quad 2: m0, m2, m8, m10 (four corners) => B'D'
// Quad 3: m1, m5, d7, m3(not present) => A'C'D with m5, d7 => A'C'D + A'CD' => A'D
// Minimized SOP: F = B'C' + B'D' + A'D`,
        example: "Corner grouping in 4-variable K-Map: Cells (0, 2, 8, 10) are adjacent in 2D toroidal geometry. Grouping them eliminates A, C, and their primes, yielding the single product term B'D'.",
        commonExamQuestions: [
          "[8 Marks] Simplify using 4-variable K-map in SOP and POS forms: F(A,B,C,D) = ∑m(1, 3, 7, 11, 15) + d(0, 2, 5). Draw the NAND logic diagram.",
          "[8 Marks] Simplify the Boolean function using Quine-McCluskey tabulation method: F(A,B,C,D) = ∑m(0, 2, 3, 5, 7, 8, 10, 11, 15).",
          "[7 Marks] Explain Prime Implicants and Essential Prime Implicants with an illustrative K-map example."
        ]
      },
      {
        id: "dl-u4-combinational-circuits",
        name: "Arithmetic Circuits, Decoders, Encoders, Multiplexers & PLDs",
        unit: 4,
        unitTitle: "Unit 4: Combinational Logic Circuits",
        unitCode: "4.1",
        importance: "Very High",
        keyPoints: [
          "Half Adder: Sum = A ⊕ B, Carry = A · B; Full Adder: Sum = A ⊕ B ⊕ C_{in}, Carry = AB + C_{in}(A ⊕ B).",
          "Carry Look-Ahead Adder (CLA): Eliminates ripple carry delay by computing Carry Generate G_i = A_i · B_i and Carry Propagate P_i = A_i ⊕ B_i simultaneously.",
          "Adder-Subtractor Circuit: Uses an XOR control gate on input B with M (Mode bit): if M = 0 (Add), B ⊕ 0 = B and C₀ = 0; if M = 1 (Subtract), B ⊕ 1 = B' and C₀ = 1 (2's complement).",
          "Decoders: n-to-2^n lines. An active-low 3-to-8 decoder (IC 74138) can generate any minterm. Encoders: 2^n-to-n lines. Priority encoders resolve multiple simultaneous active inputs.",
          "Multiplexers (Data Selectors): 2^n inputs to 1 output via n selection lines. Any Boolean function of n variables can be implemented directly using a 2^{n-1}-to-1 MUX.",
          "Programmable Logic: ROM (fixed AND array, programmable OR); PLA (programmable AND, programmable OR); PAL (programmable AND, fixed OR array)."
        ],
        theory: "Combinational logic circuits produce outputs that depend purely on the present state of inputs, containing no memory elements or feedback loops. Large arithmetic logic units (ALUs) replace sequential ripple carry propagation O(n) with parallel CLA logic O(1). Multiplexers serve as universal function generators by connecting truth table output values directly to data input lines while mapping function variables to select inputs.",
        code: `// Implementation of Boolean Function Using 8-to-1 Multiplexer
// Function: F(A, B, C, D) = ∑m(1, 3, 4, 11, 12, 13, 14, 15)
// Connect A, B, C to Select Lines S2, S1, S0. D is the data input:
// Minterm Pairs | Output F | Input to MUX (I_k)
// (m0, m1)      | (0, 1)   | I0 = D
// (m2, m3)      | (0, 1)   | I1 = D
// (m4, m5)      | (1, 0)   | I2 = D'
// (m6, m7)      | (0, 0)   | I3 = 0
// (m8, m9)      | (0, 0)   | I4 = 0
// (m10, m11)    | (0, 1)   | I5 = D
// (m12, m13)    | (1, 1)   | I6 = 1
// (m14, m15)    | (1, 1)   | I7 = 1
// Hardware connection: S2=A, S1=B, S0=C; I0=D, I1=D, I2=D', I3=0, I4=0, I5=D, I6=1, I7=1.`,
        example: "Design of a 4-bit Ripple Carry Adder using cascaded Full Adders: Full Adder 0 takes A0, B0, C0=0 and outputs S0, C1. FA 1 takes A1, B1, C1 and outputs S1, C2. Total propagation delay = 4 × t_{FA}.",
        commonExamQuestions: [
          "[8 Marks] Design a 4-bit Carry Look-Ahead Adder (CLA) circuit with mathematical derivations for carry generate (G) and carry propagate (P) terms.",
          "[7 Marks] Implement the Boolean function F(A, B, C, D) = ∑m(0, 1, 3, 4, 8, 9, 15) using an 8-to-1 Multiplexer.",
          "[7 Marks] Design a 3-to-8 line decoder using basic gates and show how a Full Adder can be implemented using a 3-to-8 decoder and two OR gates."
        ]
      },
      {
        id: "dl-u5-sequential-circuits-flipflops",
        name: "Latches, Flip-Flops, Master-Slave Architecture & Excitation Tables",
        unit: 5,
        unitTitle: "Unit 5: Sequential Logic Circuits",
        unitCode: "5.1",
        importance: "Very High",
        keyPoints: [
          "Latches are level-sensitive memory elements; Flip-flops are edge-triggered (synchronous clock transitions).",
          "SR Flip-Flop: Set (S=1, R=0 => Q=1), Reset (S=0, R=1 => Q=0), No Change (S=0, R=0 => Q), Invalid state (S=1, R=1 => Q=Q'=0).",
          "JK Flip-Flop: Overcomes SR invalid state. J=1, K=1 produces Toggle (Q_{next} = Q').",
          "Race-Around Condition: Occurs in level-triggered JK flip-flops when clock pulse width t_p > propagation delay t_{pd}, causing multiple rapid toggles. Solved by Master-Slave JK architecture or Edge-Triggering.",
          "D Flip-Flop (Data/Delay): Q_{next} = D. Eliminates setup invalid states; foundation of shift registers.",
          "T Flip-Flop (Toggle): Q_{next} = T ⊕ Q. When T=1, state toggles; foundation of binary counters."
        ],
        theory: "Sequential circuits introduce feedback loops and bistable storage elements where the next state Q(t+1) depends on both the present inputs and present state Q(t). Characteristic equations express next-state logic: Q_{next} = S + R'Q (SR), Q_{next} = J Q' + K' Q (JK), Q_{next} = D (D), Q_{next} = T ⊕ Q (T). Excitation tables invert this relationship, determining required input excitations to drive a known transition from Q to Q_{next}.",
        code: `// Summary of Flip-Flop Excitation Requirements:
// Transition: Q(t) -> Q(t+1) | S  R  |  J  K  |  D  |  T
// ----------------------------|-------|--------|-----|----
//        0   ->   0          | 0  X  |  0  X  |  0  |  0
//        0   ->   1          | 1  0  |  1  X  |  1  |  1
//        1   ->   0          | 0  1  |  X  1  |  0  |  1
//        1   ->   1          | X  0  |  X  0  |  1  |  0

// Conversion from JK Flip-Flop to D Flip-Flop:
// D is connected directly to J; D' (via NOT gate) is connected to K.
// Proof: Q_next = J*Q' + K'*Q = D*Q' + (D')'*Q = D*Q' + D*Q = D*(Q' + Q) = D. (Verified)`,
        example: "Master-Slave JK Flip-Flop: Composed of two cascaded clocked latches. The master responds to J and K inputs on the rising edge of the clock (CLK = 1) while the slave is isolated; on the falling edge (CLK = 0), the slave latches the master's state and updates the output Q.",
        commonExamQuestions: [
          "[8 Marks] What is race-around condition in a JK flip-flop? Explain how it is eliminated in a Master-Slave JK flip-flop with circuit and timing diagrams.",
          "[7 Marks] Convert an SR Flip-Flop into a JK Flip-Flop. Show the excitation table, K-maps, and final logic schematic.",
          "[7 Marks] Derive the characteristic equations and excitation tables for JK, D, and T flip-flops."
        ]
      },
      {
        id: "dl-u6-registers-counters",
        name: "Shift Registers, Universal Shift Registers, Ripple & Synchronous Counters",
        unit: 6,
        unitTitle: "Unit 6: Registers and Counters",
        unitCode: "6.1",
        importance: "Very High",
        keyPoints: [
          "Registers are cascaded flip-flop arrays storing multi-bit binary words with common clock and control lines.",
          "Shift Register Modes: SISO (Serial-In Serial-Out), SIPO (Serial-In Parallel-Out), PISO (Parallel-In Serial-Out), PIPO (Parallel-In Parallel-Out).",
          "Universal Shift Register (IC 74194): Features 4 operational modes controlled by S1, S0 (00: Locked/Hold, 01: Shift-Right, 10: Shift-Left, 11: Parallel Load).",
          "Asynchronous (Ripple) Counter: Output of flip-flop n serves as clock for flip-flop n+1. Simpler wiring, but accumulates propagation delay (t_{total} = N · t_{pd}), limiting maximum clock frequency.",
          "Synchronous Counter: All flip-flops trigger simultaneously from a master clock; next states are governed by combinational excitation gating, eliminating cumulative propagation delay.",
          "Modulo-N / Decade Counters: Truncates 2^N count sequence using NAND reset feedback when target count (e.g., 1010 for Decade counter) is reached."
        ],
        theory: "Digital counters cycle through predefined sequences of binary states upon clock transitions. Synchronous counter design follows a systematic 5-step procedure: (1) state diagram, (2) state table with next-state assignments, (3) selection of flip-flop type and excitation derivation, (4) K-map minimization for flip-flop control inputs, and (5) circuit implementation.",
        code: `// Systematic Design of a 3-Bit Synchronous Up-Counter Using T Flip-Flops:
// Count Sequence: 000 -> 001 -> 010 -> 011 -> 100 -> 101 -> 110 -> 111 -> 000
// Present State (Q2 Q1 Q0) | Next State (Q2+ Q1+ Q0+) | Excitations: T2  T1  T0
//       0  0  0            |       0   0   1          |              0   0   1
//       0  0  1            |       0   1   0          |              0   1   1
//       0  1  0            |       0   1   1          |              0   0   1
//       0  1  1            |       1   0   0          |              1   1   1
//       1  0  0            |       1   0   1          |              0   0   1
//       1  0  1            |       1   1   0          |              0   1   1
//       1  1  0            |       1   1   1          |              0   0   1
//       1  1  1            |       0   0   0          |              1   1   1

// Equations derived from K-maps:
// T0 = 1 (Toggles every clock cycle)
// T1 = Q0 (Toggles when Q0 = 1)
// T2 = Q1 · Q0 (Toggles when both Q1 and Q0 are 1)`,
        example: "Johnson Counter (Twisted Ring Counter): Connects the inverted output Q'_n of the last flip-flop to the data input D_0 of the first flip-flop. An n-flip-flop Johnson counter produces 2n unique states (e.g., 4 flip-flops yield 8 states), compared to n states in a simple Ring counter.",
        commonExamQuestions: [
          "[8 Marks] Design a 3-bit Synchronous Binary Up/Down Counter using JK Flip-Flops with an external control line M (M=0 for UP, M=1 for DOWN).",
          "[7 Marks] Explain the internal architecture and operational modes of a 4-bit Universal Shift Register.",
          "[7 Marks] Differentiate between Synchronous and Asynchronous counters. Design a Mod-6 asynchronous counter using T flip-flops."
        ]
      }
    ],
    theoryTopics: [
      "Compare the speed, power dissipation, noise immunity, and fan-out of TTL and CMOS logic families.",
      "Explain the internal architecture and programming differences among PROM, PAL, and PLA with suitable logic block diagrams.",
      "Describe the state reduction and state assignment techniques used in synchronous sequential machine synthesis.",
      "Explain the working principle of a 4-bit priority encoder with truth table and output logic equations."
    ]
  },

  "Discrete Structure": {
    subjectName: "Discrete Structure",
    code: "BIT153HS",
    creditHours: 3,
    topics: [
      {
        id: "ds-u1-sets-matrices",
        name: "Set Operations, Bit Strings & Boolean Matrix Operations",
        unit: 1,
        unitTitle: "Unit 1: Set Theory and Matrices",
        unitCode: "1.1",
        importance: "High",
        keyPoints: [
          "Set Operations: Union A ∪ B, Intersection A ∩ B, Set Difference A - B = {x | x ∈ A ∧ x ∉ B}, Symmetric Difference A ⊕ B = (A - B) ∪ (B - A).",
          "Power set P(S) contains all subsets of S; if |S| = n, then |P(S)| = 2^n.",
          "Bit String representation: For universal set U = {e₁, e₂, ..., e_n}, a subset A is represented by an n-bit vector where bit_i = 1 if e_i ∈ A, else 0. Set operations reduce to bitwise OR, AND, and XOR.",
          "Zero-One (Boolean) Matrices: Matrices whose entries are either 0 or 1, representing relations and graphs.",
          "Boolean matrix operations: Join (A ∨ B where c_{ij} = a_{ij} ∨ b_{ij}), Meet (A ∧ B where c_{ij} = a_{ij} ∧ b_{ij}), and Boolean Product (A ⊙ B where c_{ij} = ⋁_{k=1}^m (a_{ik} ∧ b_{kj}))."
        ],
        theory: "Set theory provides the foundational ontology for discrete mathematics and computer science databases. Representing finite sets as bit vectors allows memory-efficient storage and enables high-speed bit-parallel microprocessor register execution for union, intersection, and set membership testing. Boolean matrices map binary relations and graph adjacencies directly into algebraic structures.",
        code: `// C++ Bit String Set Representation & Boolean Join/Meet
#include <iostream>
#include <vector>
using namespace std;

// Boolean Matrix Multiplication (A ⊙ B)
vector<vector<int>> booleanProduct(const vector<vector<int>>& A, const vector<vector<int>>& B) {
    int r = A.size(), m = B.size(), c = B[0].size();
    vector<vector<int>> C(r, vector<int>(c, 0));
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            for (int k = 0; k < m; k++) {
                if (A[i][k] && B[k][j]) { C[i][j] = 1; break; }
            }
        }
    }
    return C;
}`,
        example: "Let U = {1, 2, 3, 4, 5}. If A = {1, 3, 5} (bit string: 10101) and B = {2, 3, 4} (bit string: 01110), then A ∩ B = 10101 AND 01110 = 00100 => {3}. A ∪ B = 10101 OR 01110 = 11111 => {1, 2, 3, 4, 5}.",
        commonExamQuestions: [
          "[7 Marks] State and prove the Principle of Inclusion-Exclusion for three sets A, B, and C.",
          "[7 Marks] Let A and B be zero-one matrices of size 3x3. Compute the Join, Meet, and Boolean Product of A and B."
        ]
      },
      {
        id: "ds-u2-functions-counting",
        name: "Injective/Surjective/Bijective Functions, Pigeonhole Principle & Permutations",
        unit: 2,
        unitTitle: "Unit 2: Function and Counting",
        unitCode: "2.1",
        importance: "Very High",
        keyPoints: [
          "Function Classification: Injective / One-to-One (f(a) = f(b) => a = b); Surjective / Onto (∀y ∈ B, ∃x ∈ A such that f(x) = y); Bijective (both one-to-one and onto; has an inverse f⁻¹).",
          "Pigeonhole Principle (PHP): If k + 1 or more objects are placed into k boxes, at least one box contains two or more objects.",
          "Generalized Pigeonhole Principle: If N objects are placed into k boxes, at least one box contains at least ⌈N/k⌉ objects.",
          "Permutations P(n, r) = n! / (n - r)! (order matters); Combinations C(n, r) = n! / [r! (n - r)!] (order does not matter).",
          "Combinations with repetition: Number of ways to choose r elements from n categories = C(n + r - 1, r)."
        ],
        theory: "Combinatorics and function theory establish the formal boundaries of computational complexity and resource allocation. The Pigeonhole principle is a non-constructive proof tool essential for establishing collision guarantees in hash tables, bounds in lossy data compression, and existence proofs in graph theory.",
        code: `// Pigeonhole Principle Problem:
// In a room of 367 people, there are 366 possible birthdays (including Feb 29).
// By PHP: 367 > 366 => At least 2 people must share the exact same birthday!

// Generalized Example:
// How many cards must be selected from a standard 52-card deck to guarantee 
// at least 3 cards of the same suit?
// Suits k = 4. Target ⌈N / 4⌉ = 3.
// Minimum N = 4 * (3 - 1) + 1 = 4 * 2 + 1 = 9 cards.`,
        example: "Prove that among any 5 points chosen inside an equilateral triangle of side 1, there exists a pair at distance ≤ 1/2. Divide the triangle into 4 smaller equilateral triangles of side 1/2. By PHP, 5 points in 4 triangles guarantees at least one small triangle contains ≥ 2 points.",
        commonExamQuestions: [
          "[8 Marks] State and prove the Generalized Pigeonhole Principle. Show that if 7 colors are used to paint 50 bicycles, at least 8 bicycles must have the same color.",
          "[7 Marks] Let f: A -> B and g: B -> C be two functions. Prove that: (i) If f and g are injective, then g ∘ f is injective. (ii) If g ∘ f is surjective, then g is surjective.",
          "[7 Marks] In how many ways can 5 computer science books, 4 mathematics books, and 3 physics books be arranged on a shelf such that books of the same subject are together?"
        ]
      },
      {
        id: "ds-u3-logic-proofs",
        name: "Propositional/Predicate Logic, Rules of Inference & Mathematical Induction",
        unit: 3,
        unitTitle: "Unit 3: Logic",
        unitCode: "3.1",
        importance: "Very High",
        keyPoints: [
          "Logical Connectives: Conjunction (∧), Disjunction (∨), Implication (p → q ≡ ¬p ∨ q), Biconditional (p ↔ q).",
          "Tautology (always True), Contradiction (always False), Contingency (neither).",
          "Rules of Inference: Modus Ponens [p, p → q ∴ q], Modus Tollens [¬q, p → q ∴ ¬p], Hypothetical Syllogism [p → q, q → r ∴ p → r], Resolution [p ∨ q, ¬p ∨ r ∴ q ∨ r].",
          "Quantifiers: Universal ∀x P(x) (True for all x); Existential ∃x P(x) (True for at least one x). Negation: ¬(∀x P(x)) ≡ ∃x ¬P(x).",
          "Proof Methods: Direct proof, Contrapositive proof (prove ¬q → ¬p to establish p → q), Contradiction (assume ¬p and derive a fallacy).",
          "Mathematical Induction: Basis Step (prove P(1) is true), Inductive Step (assume P(k) true, prove P(k+1) is true)."
        ],
        theory: "Formal mathematical logic eliminates ambiguity from specifications, automated reasoning, software verification, and compiler construction. The principle of mathematical induction is equivalent to the Well-Ordering Property of positive integers, providing the mathematical bedrock for proving correctness and termination of recursive algorithms.",
        code: `// Proof by Mathematical Induction:
// Claim: Prove that 1 + 2 + 3 + ... + n = n(n + 1) / 2 for all n ≥ 1.
// 1. Basis Step (n = 1):
//    LHS = 1; RHS = 1(1 + 1)/2 = 2/2 = 1. LHS = RHS. Basis step holds!
// 2. Inductive Hypothesis:
//    Assume true for n = k: 1 + 2 + ... + k = k(k + 1) / 2
// 3. Inductive Step (n = k + 1):
//    LHS = (1 + 2 + ... + k) + (k + 1)
//        = [k(k + 1) / 2] + (k + 1)
//        = (k + 1) [ (k/2) + 1 ]
//        = (k + 1) (k + 2) / 2 = (k + 1)((k + 1) + 1) / 2
//    Which is the formula for n = k + 1.
// By PMI, the formula holds for all integers n ≥ 1. Q.E.D.`,
        example: "Proof by Contradiction: Prove that √2 is irrational. Assume √2 = a/b where gcd(a, b) = 1. Then 2 = a²/b² => a² = 2b² => a² is even => a is even => a = 2k. Then (2k)² = 2b² => 4k² = 2b² => b² = 2k² => b is even. But if both a and b are even, gcd(a,b) ≥ 2, contradicting gcd(a,b) = 1. Hence √2 must be irrational.",
        commonExamQuestions: [
          "[8 Marks] Prove using the Principle of Mathematical Induction that 2^n < n! for all integers n ≥ 4.",
          "[7 Marks] Without using truth tables, prove the logical equivalence: ¬(p ∨ (¬p ∧ q)) ≡ ¬p ∧ ¬q.",
          "[7 Marks] Using rules of inference, prove the validity of the conclusion: 'If it rains, the grass is wet. The grass is not wet. Therefore, it did not rain.'"
        ]
      },
      {
        id: "ds-u4-relations-digraphs",
        name: "Binary Relations, Equivalence Classes & Warshall's Transitive Closure",
        unit: 4,
        unitTitle: "Unit 4: Relation and Digraphs",
        unitCode: "4.1",
        importance: "Very High",
        keyPoints: [
          "Binary relation R ⊆ A × B is a set of ordered pairs (a, b).",
          "Properties on a set A: Reflexive (∀a, (a,a) ∈ R); Symmetric (∀a,b, (a,b) ∈ R => (b,a) ∈ R); Antisymmetric (∀a,b, if (a,b) ∈ R and (b,a) ∈ R then a = b); Transitive (∀a,b,c, if (a,b) ∈ R and (b,c) ∈ R then (a,c) ∈ R).",
          "Equivalence Relation: A relation that is simultaneously Reflexive, Symmetric, and Transitive. Partitions set A into disjoint Equivalence Classes [a] = {x ∈ A | (a, x) ∈ R}.",
          "Closures: Reflexive closure R ∪ Δ; Symmetric closure R ∪ R⁻¹; Transitive closure R* (reachability in graphs).",
          "Warshall's Algorithm: Computes transitive closure of a relation represented as an n×n zero-one matrix in O(n³) operations using dynamic programming."
        ],
        theory: "Binary relations formalize associations between entities, serving as the mathematical underpinning of relational databases (Codd's relational model). Equivalence relations partition data spaces into non-overlapping clusters. The transitive closure of a relation represents the existence of directed paths of arbitrary length between nodes in a network.",
        code: `// Warshall's Algorithm in C++ to Compute Transitive Closure Matrix
#include <iostream>
#include <vector>
using namespace std;

void warshall(vector<vector<int>>& W, int n) {
    for (int k = 0; k < n; k++) {          // Intermediate vertex k
        for (int i = 0; i < n; i++) {      // Source vertex i
            for (int j = 0; j < n; j++) {  // Destination vertex j
                W[i][j] = W[i][j] || (W[i][k] && W[k][j]);
            }
        }
    }
}

int main() {
    int n = 4;
    vector<vector<int>> adj = {
        {0, 1, 0, 0},
        {0, 0, 0, 1},
        {0, 0, 0, 0},
        {1, 0, 1, 0}
    };
    warshall(adj, n);
    // adj now contains the reachability / transitive closure matrix!
    return 0;
}`,
        example: "Congruence Modulo m: R = {(a, b) | a ≡ b (mod m)} on the set of integers ℤ is an Equivalence Relation. For m = 3, equivalence classes are [0] = {..., -3, 0, 3, 6, ...}, [1] = {..., -2, 1, 4, 7, ...}, [2] = {..., -1, 2, 5, 8, ...}.",
        commonExamQuestions: [
          "[8 Marks] Define an equivalence relation. Prove that the relation R on ℤ defined by (a, b) ∈ R iff (a - b) is divisible by 5 is an equivalence relation. Determine its equivalence classes.",
          "[7 Marks] Apply Warshall's algorithm to find the transitive closure of the relation R = {(1,2), (2,3), (3,4), (4,1)} on A = {1, 2, 3, 4}.",
          "[7 Marks] Determine whether the relation R on positive integers defined by (a, b) ∈ R iff a divides b is a partial order relation. Justify."
        ]
      },
      {
        id: "ds-u5-graph-theory-trees",
        name: "Euler & Hamilton Circuits, Planar Graphs, Tree Traversals & Kruskal's MST",
        unit: 5,
        unitTitle: "Unit 5: Graph and Tree",
        unitCode: "5.1",
        importance: "Very High",
        keyPoints: [
          "Handshaking Theorem: ∑_{v ∈ V} deg(v) = 2 |E|. Corollary: Every undirected graph contains an even number of odd-degree vertices.",
          "Euler Circuit: Traverses every EDGE exactly once and returns to start. Exists iff graph is connected and EVERY vertex has an EVEN degree.",
          "Hamilton Circuit: Visits every VERTEX exactly once and returns to start (NP-complete in general). Dirac's Theorem: If |V| ≥ 3 and deg(v) ≥ |V|/2 for all v, G has a Hamilton circuit.",
          "Planar Graphs: Can be drawn in a plane without intersecting edges. Euler's Formula: V - E + R = 2. For simple planar graphs with |V| ≥ 3: E ≤ 3V - 6.",
          "Trees: Connected acyclic graphs. A tree with n vertices contains exactly n - 1 edges.",
          "Minimum Spanning Tree (MST): Kruskal's greedy algorithm sorts edges by weight and iteratively adds the cheapest edge that does not form a cycle (using Disjoint Set Union / DSU)."
        ],
        theory: "Graph theory models discrete relational topologies across networks, dependencies, routing, and data structures. Tree structures provide unique paths between any pair of vertices. Kruskal's and Prim's greedy strategies guarantee optimal minimum spanning trees by exploiting the cut property of weighted undirected graphs.",
        code: `// Kruskal's Minimum Spanning Tree Algorithm in C++
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct Edge { int u, v, weight; };

struct DSU {
    vector<int> parent;
    DSU(int n) : parent(n) { for (int i = 0; i < n; i++) parent[i] = i; }
    int find(int i) { return (parent[i] == i) ? i : (parent[i] = find(parent[i])); }
    bool unite(int i, int j) {
        int rootI = find(i), rootJ = find(j);
        if (rootI != rootJ) { parent[rootI] = rootJ; return true; }
        return false;
    }
};

int kruskalMST(int n, vector<Edge>& edges) {
    sort(edges.begin(), edges.end(), [](Edge a, Edge b) { return a.weight < b.weight; });
    DSU dsu(n);
    int mstCost = 0, edgesCount = 0;
    for (const auto& e : edges) {
        if (dsu.unite(e.u, e.v)) {
            mstCost += e.weight;
            if (++edgesCount == n - 1) break;
        }
    }
    return mstCost;
}`,
        example: "Testing Planarity of Complete Graph K₅: V = 5, E = C(5, 2) = 10. If K₅ were planar: E ≤ 3V - 6 => 10 ≤ 3(5) - 6 = 9 (False! 10 ≤ 9 is impossible). Hence K₅ is non-planar by Kuratowski's theorem.",
        commonExamQuestions: [
          "[8 Marks] State Euler's formula for connected planar graphs and prove it using mathematical induction. Show that K_{3,3} is non-planar.",
          "[8 Marks] State the necessary and sufficient conditions for a connected graph to contain an Euler circuit. Differentiate between Euler path and Hamilton path with examples.",
          "[7 Marks] Apply Kruskal's algorithm to find the Minimum Spanning Tree (MST) of a given 6-vertex weighted graph and calculate total weight."
        ]
      },
      {
        id: "ds-u6-posets-lattices",
        name: "Partially Ordered Sets, Hasse Diagrams & Lattices",
        unit: 6,
        unitTitle: "Unit 6: Order Relation and Structure",
        unitCode: "6.1",
        importance: "High",
        keyPoints: [
          "Partially Ordered Set (Poset): A pair (S, ≤) where relation ≤ is Reflexive, Antisymmetric, and Transitive.",
          "Hasse Diagram: Visual representation of a poset where reflexive loops and transitive edges are omitted, and elements are arranged with arrows pointing upward.",
          "Extremal Elements: Maximal (no element strictly greater); Minimal (no element strictly smaller); Greatest / Maximum (unique element greater than all others); Least / Minimum (unique element smaller than all others).",
          "Upper/Lower Bounds: Least Upper Bound (LUB / Supremum / Join ∨); Greatest Lower Bound (GLB / Infimum / Meet ∧).",
          "Lattice: A poset (L, ≤) in which EVERY pair of elements has a unique LUB and a unique GLB.",
          "Special Lattices: Bounded (has universal 0 and 1); Distributive (a ∧ (b ∨ c) = (a ∧ b) ∨ (a ∧ c)); Complemented (every element a has an a' such that a ∨ a' = 1 and a ∧ a' = 0). A Boolean Algebra is a complemented distributive lattice."
        ],
        theory: "Posets model hierarchy, task precedence scheduling, type systems, and access control matrices. Lattices guarantee that any two assertions or states have a well-defined supremum (join) and infimum (meet), forming the theoretical foundation of abstract interpretation in static program analysis and compiler optimizations.",
        code: `// Divisibility Poset: D_12 = {1, 2, 3, 4, 6, 12} with relation a | b
// Hasse Diagram Construction:
// Level 3:       12
//               /  \\
// Level 2:     4    6
//             | \\  / |
// Level 1:    |   2   3
//              \\  |  /
// Level 0:        1
//
// LUB(4, 6) = LCM(4, 6) = 12
// GLB(4, 6) = GCD(4, 6) = 2
// Since every pair of elements has a unique LCM and GCD, (D_12, |) is a Lattice!`,
        example: "Is D_12 complemented? The 0 element is 1, and 1 element is 12. For element 4, its complement x must satisfy 4 ∨ x = 12 and 4 ∧ x = 1. GCD(4, 3) = 1 and LCM(4, 3) = 12, so 3 is the complement of 4. But element 2 has no complement (no x has GCD(2, x)=1 and LCM(2, x)=12). Hence D_12 is NOT complemented.",
        commonExamQuestions: [
          "[8 Marks] Define a Lattice. Draw the Hasse diagram for the divisibility relation on D_30 = {1, 2, 3, 5, 6, 10, 15, 30} and determine whether it is a Boolean algebra.",
          "[7 Marks] Explain maximal, minimal, greatest, and least elements in a poset with a suitable Hasse diagram.",
          "[7 Marks] Prove that in any distributive lattice, if an element has a complement, then the complement is unique."
        ]
      },
      {
        id: "ds-u7-automata-languages",
        name: "Grammars, DFA, NFA, Subset Construction & Regular Expressions",
        unit: 7,
        unitTitle: "Unit 7: Automata, Language and Grammar",
        unitCode: "7.1",
        importance: "Very High",
        keyPoints: [
          "Phrase-Structure Grammar G = (V, T, S, P): V is variables, T is terminals, S is start symbol, P is production rules.",
          "Chomsky Hierarchy: Type 0 (Unrestricted), Type 1 (Context-Sensitive), Type 2 (Context-Free - CFG, pushdown automata), Type 3 (Regular - finite automata).",
          "Deterministic Finite Automaton (DFA): 5-tuple M = (Q, Σ, δ, q₀, F) where transition δ: Q × Σ → Q is single-valued.",
          "Non-Deterministic Finite Automaton (NFA): δ: Q × Σ → P(Q). Can transition to zero, one, or multiple states, or via λ/ε without reading input.",
          "Equivalence of DFA and NFA: Every NFA can be converted to an equivalent DFA using the Subset Construction (Powerset Construction) algorithm.",
          "Pumping Lemma: If L is regular, any string s ∈ L with |s| ≥ p can be partitioned into s = xyz such that |y| > 0, |xy| ≤ p, and xy^i z ∈ L for all i ≥ 0. Used to prove languages non-regular (e.g., L = {a^n b^n | n ≥ 0})."
        ],
        theory: "Finite automata and formal language theory define the boundary of machine computability with finite memory. DFAs serve as the execution engine for lexical analyzers (lex/flex), regular expression pattern matching engines, network protocol state machines, and digital circuit controllers.",
        code: `// DFA State Transition Table for Language over {0, 1} ending with '01'
// States: Q = {q0 (start), q1, q2 (accept)}
//
// Present State | Input 0 | Input 1
// --------------+---------+--------
//      -> q0    |   q1    |   q0
//         q1    |   q1    |   q2 (Accepting)
//        *q2    |   q1    |   q0
//
// Tracing string "1101":
// δ(q0, 1) = q0
// δ(q0, 1) = q0
// δ(q0, 0) = q1
// δ(q1, 1) = q2 ∈ F (String is ACCEPTED)`,
        example: "Proof that L = {0^n 1^n | n ≥ 0} is NOT regular using Pumping Lemma: Assume L is regular with pumping length p. Choose s = 0^p 1^p ∈ L. Then s = xyz with |xy| ≤ p and |y| > 0. Since |xy| ≤ p, y consists entirely of 0s (y = 0^k, k ≥ 1). Pump i = 2: x y² z = 0^{p+k} 1^p. The number of 0s is p + k > p, but number of 1s is p. Thus x y² z ∉ L, creating a contradiction! Hence L is non-regular.",
        commonExamQuestions: [
          "[8 Marks] Design a DFA that accepts the language over Σ = {a, b} consisting of all strings containing 'aba' as a substring. Show transition table and state diagram.",
          "[8 Marks] Convert a given NFA with transitions δ(q0, a)={q0, q1}, δ(q0, b)={q0}, δ(q1, b)={q2} into an equivalent DFA using subset construction.",
          "[7 Marks] State the Pumping Lemma for regular languages. Use it to prove that L = {a^n b^n | n ≥ 1} is not regular."
        ]
      }
    ],
    theoryTopics: [
      "Explain the Chomsky Hierarchy of grammars with production rule constraints and corresponding recognizing automata.",
      "Compare DFA, NFA, and Epsilon-NFA with respect to expressive power, memory complexity, and conversion algorithms.",
      "Explain how the Disjoint Set Union (Union-Find) data structure optimizes cycle detection in Kruskal's algorithm.",
      "Describe the Pigeonhole Principle and apply it to establish hash collision bounds in computer security."
    ]
  },

  "Object-Oriented Programming in C++": {
    subjectName: "Object-Oriented Programming in C++",
    code: "BIT154CO",
    creditHours: 3,
    topics: [
      {
        id: "cpp-u1-oop-concepts",
        name: "OOP Paradigm vs POP, Encapsulation, Abstraction & Dynamic Binding",
        unit: 1,
        unitTitle: "Unit 1: Introduction to Object Oriented Programming",
        unitCode: "1.1",
        importance: "High",
        keyPoints: [
          "Procedure-Oriented Programming (POP) focuses on algorithms and functions moving data globally; Object-Oriented Programming (OOP) binds data and operations into self-contained objects.",
          "Encapsulation: Bundling data and functions into a single unit (class) while restricting direct external access (data hiding via private specifiers).",
          "Abstraction: Representing essential features of an entity without including background implementation details.",
          "Inheritance: Mechanism where a new derived class acquires properties and behaviors of an existing base class, promoting software reusability.",
          "Polymorphism: Ability of an entity (function or operator) to take multiple forms (Compile-time via overloading; Run-time via virtual functions).",
          "Dynamic Binding: Code associated with a given procedure call is determined dynamically at runtime based on the target object's type."
        ],
        theory: "OOP overcomes the structural fragility of procedural software engineering where global state mutability often causes unintended side effects across large systems. In OOP, objects communicate exclusively via message passing (member function invocations), ensuring modular boundary encapsulation, testability, and enterprise maintainability.",
        code: `// C++ Class Demonstrating Encapsulation & Data Hiding
#include <iostream>
#include <string>
using namespace std;

class BankAccount {
private:
    string accountNumber; // Hidden data
    double balance;

public:
    BankAccount(string acc, double initBal) : accountNumber(acc), balance(initBal) {}

    void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    bool withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            return true;
        }
        return false;
    }

    double getBalance() const { return balance; } // Controlled abstraction
};`,
        example: "A Car object abstracts complex internal internal-combustion physics behind a simple driver interface: steer(), accelerate(), and brake(). The internal fuel injection mapping is completely encapsulated.",
        commonExamQuestions: [
          "[8 Marks] Compare Procedure-Oriented Programming (POP) with Object-Oriented Programming (OOP). Explain the core features of OOP.",
          "[7 Marks] Explain the concept of data abstraction and encapsulation with an illustrative C++ class design."
        ]
      },
      {
        id: "cpp-u2-cxx-basics",
        name: "C++ Language Extensions: References, Dynamic Memory & Stream Manipulators",
        unit: 2,
        unitTitle: "Unit 2: C++ Programming Concept",
        unitCode: "2.1",
        importance: "Medium",
        keyPoints: [
          "Reference Variables (int &ref = var): An alias or alternative name for an existing variable; cannot be null and cannot be reseated after initialization.",
          "Dynamic Memory: new and delete operators allocate and deallocate heap memory, automatically invoking constructors and destructors (unlike malloc/free).",
          "Scope Resolution Operator (::): Accesses global variables obscured by local scope, and defines member functions outside class declarations.",
          "Stream Manipulators: endl (newline + flush), setw(n) (sets field width), setprecision(n) (formats floating-point decimals in <iomanip>)."
        ],
        theory: "C++ extends C with strong typing, safe pointer aliases, and type-safe heap management. While malloc() allocates uninitialized raw bytes and requires manual type casting, new allocates typed memory and guarantees automatic object lifecycle initialization.",
        code: `// References, Scope Resolution & Dynamic Memory in C++
#include <iostream>
#include <iomanip>
using namespace std;

int globalCount = 500;

int main() {
    int globalCount = 10;
    cout << "Local: " << globalCount << ", Global via :: : " << ::globalCount << endl;

    // Dynamic Array Allocation
    int n = 5;
    int *arr = new int[n];
    for (int i = 0; i < n; i++) arr[i] = (i + 1) * 10;

    cout << "Formatted output: " << setw(8) << setprecision(2) << fixed << 123.4567 << endl;

    delete[] arr; // Crucial to prevent heap memory leak
    return 0;
}`,
        example: "Call by reference using reference parameters void swap(int &a, int &b) avoids the pointer syntax *a and *b while still enabling in-place mutation of caller variables.",
        commonExamQuestions: [
          "[7 Marks] Differentiate between pointers and reference variables in C++. Write a program demonstrating pass-by-reference.",
          "[7 Marks] Explain dynamic memory allocation in C++. Contrast new/delete with malloc/free."
        ]
      },
      {
        id: "cpp-u3-functions-overloading",
        name: "Function Overloading, Inline Functions & Default Arguments",
        unit: 3,
        unitTitle: "Unit 3: Functions Used in C++",
        unitCode: "3.1",
        importance: "High",
        keyPoints: [
          "Inline Functions: Suggests that the compiler replace function calls with the exact body code, eliminating call overhead (stack pushing, jump, return). Suitable for short functions.",
          "Default Arguments: Enables functions to be invoked without specifying all arguments; default parameters must appear trailing from right to left.",
          "Function Overloading: Multiple functions sharing the same name but differing in parameter count, types, or ordering. Resolved at compile-time (Name Mangling).",
          "Ambiguity in Overloading: Occurs when type promotion or default arguments make multiple overloaded candidates equally valid."
        ],
        theory: "Function overloading provides compile-time polymorphism. The C++ compiler disambiguates overloaded functions via name mangling, embedding parameter types directly into internal symbol table identifiers. Function inlining eliminates the runtime cost of calling small functions while preserving the clean abstraction of modular routines.",
        code: `// Function Overloading & Inline Functions in C++
#include <iostream>
using namespace std;

inline int square(int x) { return x * x; } // Expands in-place

// Overloaded functions
int add(int a, int b) { return a + b; }
double add(double a, double b) { return a + b; }
int add(int a, int b, int c = 0) { return a + b + c; } // Default argument

int main() {
    cout << square(5) << endl;
    cout << add(10, 20) << endl;        // Calls add(int, int)
    cout << add(2.5, 3.5) << endl;      // Calls add(double, double)
    cout << add(10, 20, 30) << endl;    // Calls add(int, int, int)
    return 0;
}`,
        example: "void display(char c = '*', int n = 10); Valid calls: display(); display('#'); display('$', 20). Invalid: cannot pass n without specifying c.",
        commonExamQuestions: [
          "[7 Marks] What is an inline function? What are its advantages and limitations? When will the compiler ignore the inline request?",
          "[7 Marks] Explain function overloading with suitable C++ examples. State the conditions that lead to ambiguity in overloading."
        ]
      },
      {
        id: "cpp-u4-classes-friends-static",
        name: "Classes, Objects, Static Members, Friend Functions & Friend Classes",
        unit: 4,
        unitTitle: "Unit 4: Classes and Objects",
        unitCode: "4.1",
        importance: "Very High",
        keyPoints: [
          "Class encapsulates private implementation and public interfaces. Objects are runtime instances.",
          "Static Data Members: Shared across all instances of a class; stored in static/global memory; must be defined outside class body; initialized before main().",
          "Static Member Functions: Can only access static data members and invoke static member functions; do not have a this pointer.",
          "Friend Functions: Non-member functions granted access to private and protected members via friend declaration.",
          "Friend Class: All member functions of the friend class have full access to private members of the granting class."
        ],
        theory: "Classes in C++ separate interface from implementation. While strict encapsulation prohibits external functions from probing private state, cooperating abstractions (such as Matrix and Vector classes, or custom stream operators) require controlled structural access, which friend functions provide without exposing internals globally.",
        code: `// Static Members & Friend Function Demonstration
#include <iostream>
using namespace std;

class Complex; // Forward declaration

class Calculator {
public:
    void printSum(Complex c1, Complex c2);
};

class Complex {
private:
    float real, imag;
    static int objectCount; // Shared static variable

public:
    Complex(float r = 0, float i = 0) : real(r), imag(i) { objectCount++; }
    static int getCount() { return objectCount; } // Static member function

    // Friend function declaration
    friend Complex addComplex(const Complex &a, const Complex &b);
    friend void Calculator::printSum(Complex c1, Complex c2);
};

int Complex::objectCount = 0; // Definition outside class

Complex addComplex(const Complex &a, const Complex &b) {
    return Complex(a.real + b.real, a.imag + b.imag); // Accesses private members directly
}`,
        example: "Static member count keeps track of total active player objects in a multiplayer game: Player p1, p2; Player::getCount() returns 2.",
        commonExamQuestions: [
          "[8 Marks] What is a friend function? Explain its characteristics, syntax, and scenarios where friend functions are necessary.",
          "[7 Marks] Explain static data members and static member functions with a working C++ program.",
          "[7 Marks] Write a C++ program to add two private attributes of two different classes using a common friend function."
        ]
      },
      {
        id: "cpp-u5-constructors-destructors",
        name: "Constructor Overloading, Copy Constructor, Dynamic Constructors & Destructors",
        unit: 5,
        unitTitle: "Unit 5: Constructor & Destructor",
        unitCode: "5.1",
        importance: "Very High",
        keyPoints: [
          "Constructor: Special member function sharing the class name, invoked automatically upon object instantiation to initialize state; has no return type.",
          "Default Constructor (no arguments), Parameterized Constructor, Overloaded Constructors.",
          "Copy Constructor: ClassName(const ClassName &source). Called during initialization from another object, pass-by-value, and return-by-value.",
          "Shallow Copy vs Deep Copy: Shallow copy duplicates pointer addresses (causing double-free crashes upon destruction); Deep copy allocates new memory and duplicates pointed-to content.",
          "Destructor: ~ClassName(). Invoked automatically when an object leaves its scope; executes reverse cleanup (deletes heap memory allocated by dynamic constructors)."
        ],
        theory: "The constructor-destructor lifecycle forms the basis of RAII (Resource Acquisition Is Initialization), C++'s primary paradigm for resource safety. When classes manage heap buffers, file handles, or network sockets, adhering to the Rule of Three (Destructor, Copy Constructor, Copy Assignment Operator) prevents resource leaks and dangling pointers.",
        code: `// Deep Copy Constructor & Dynamic Constructor in C++
#include <iostream>
#include <cstring>
using namespace std;

class StringHolder {
private:
    char *buffer;

public:
    // Dynamic Constructor
    StringHolder(const char *str = "") {
        buffer = new char[strlen(str) + 1];
        strcpy(buffer, str);
    }

    // Deep Copy Constructor
    StringHolder(const StringHolder &other) {
        buffer = new char[strlen(other.buffer) + 1];
        strcpy(buffer, other.buffer); // Deep copy!
    }

    // Destructor
    ~StringHolder() {
        delete[] buffer; // Safe memory cleanup
    }

    void display() const { cout << buffer << endl; }
};`,
        example: "Order of destruction is strictly the reverse of construction order (LIFO - Stack order). Global objects are created before main() and destroyed after main() exits.",
        commonExamQuestions: [
          "[8 Marks] What is a copy constructor? Explain shallow copy and deep copy with suitable diagrams and code snippets.",
          "[7 Marks] Explain dynamic constructors in C++ with an example of dynamic memory string handling.",
          "[7 Marks] Write a C++ program demonstrating the exact execution sequence of constructors and destructors in local and global scopes."
        ]
      },
      {
        id: "cpp-u6-operator-overloading",
        name: "Unary/Binary Operator Overloading, Stream Insertion/Extraction & Type Conversions",
        unit: 6,
        unitTitle: "Unit 6: Operator Overloading",
        unitCode: "6.1",
        importance: "Very High",
        keyPoints: [
          "Operator Overloading gives user-defined types natural syntactic operators (+, -, *, ==, <<).",
          "Operators that CANNOT be overloaded: . (member access), .* (pointer-to-member), :: (scope resolution), ?: (ternary conditional), sizeof.",
          "Prefix vs Postfix ++/--: Prefix takes no argument (operator++()); Postfix takes a dummy int argument (operator++(int)).",
          "Overloading stream operators: operator<< and operator>> MUST be overloaded as friend functions because the left-hand operand is an ostream/istream reference.",
          "Type Conversions: (1) Basic to Class type (via single-argument constructor), (2) Class to Basic type (via operator type() conversion function), (3) Class to Class type."
        ],
        theory: "Operator overloading transforms user-defined classes into first-class mathematical types without changing operator precedence or associativity. When overloading binary operators as member functions, the left operand is implicitly *this and the right operand is passed as an argument. Overloading via friend functions is necessary to support commutative operations where a primitive appears on the left (e.g., 5 + myObject).",
        code: `// Overloading Binary + and Stream Insertion <<
#include <iostream>
using namespace std;

class Vector2D {
private:
    float x, y;

public:
    Vector2D(float x = 0, float y = 0) : x(x), y(y) {}

    // Overloading binary + as member function
    Vector2D operator+(const Vector2D &other) const {
        return Vector2D(this->x + other.x, this->y + other.y);
    }

    // Overloading prefix ++
    Vector2D& operator++() {
        ++x; ++y;
        return *this;
    }

    // Overloading postfix ++
    Vector2D operator++(int) {
        Vector2D temp = *this;
        x++; y++;
        return temp;
    }

    // Overloading << as friend function
    friend ostream& operator<<(ostream &out, const Vector2D &v) {
        out << "(" << v.x << ", " << v.y << ")";
        return out;
    }
};`,
        example: "Class to Basic type conversion: operator float() const { return sqrt(x*x + y*y); }. Vector2D v(3, 4); float mag = v; // Evaluates to 5.0.",
        commonExamQuestions: [
          "[8 Marks] Overload the stream insertion (<<) and extraction (>>) operators for a Matrix or Complex number class in C++.",
          "[7 Marks] Differentiate between prefix and postfix increment operator overloading with code examples.",
          "[7 Marks] Explain data conversion routines: (i) Basic to Class type, (ii) Class to Basic type, (iii) Class to another Class type with examples."
        ]
      },
      {
        id: "cpp-u7-inheritance-diamond-problem",
        name: "Inheritance Forms, Virtual Base Classes & The Diamond Problem",
        unit: 7,
        unitTitle: "Unit 7: Inheritance",
        unitCode: "7.1",
        importance: "Very High",
        keyPoints: [
          "Derivation modes: public (public->public, protected->protected), protected (public & protected -> protected), private (all become private).",
          "Inheritance types: Single, Multilevel, Multiple, Hierarchical, Hybrid.",
          "The Diamond Problem: Arises in multipath multiple inheritance where Class D inherits from Class B and C, which both inherit from Class A. D receives two conflicting copies of A's members.",
          "Virtual Base Classes: Class B : virtual public A and Class C : virtual public A ensures that Class D inherits only ONE shared instance of Class A.",
          "Constructors in Inheritance: Base constructors execute first, followed by derived constructors. In virtual inheritance, the most derived class directly calls the virtual base constructor."
        ],
        theory: "Inheritance establishes 'is-a' relationships. In multipath multiple inheritance, duplicated ancestor copies create memory bloat and compiler ambiguity. C++ resolves this via Virtual Base Classes, where the compiler synthesizes an internal virtual base pointer table (vbtable), binding derived instances to a single shared ancestor subobject in memory.",
        code: `// Resolving The Diamond Problem Using Virtual Base Classes in C++
#include <iostream>
using namespace std;

class Student {
protected:
    int rollNumber;
public:
    void setRoll(int r) { rollNumber = r; }
};

class Test : virtual public Student {
protected:
    float marks1, marks2;
public:
    void setMarks(float m1, float m2) { marks1 = m1; marks2 = m2; }
};

class Sports : virtual public Student {
protected:
    float score;
public:
    void setScore(float s) { score = s; }
};

class Result : public Test, public Sports {
public:
    void display() {
        // No ambiguity! Exactly one copy of rollNumber exists
        float total = marks1 + marks2 + score;
        cout << "Roll: " << rollNumber << ", Total: " << total << endl;
    }
};`,
        example: "Member initialization list passes arguments to base constructors: Derived(int a, int b) : Base(a), derivedVal(b) {}.",
        commonExamQuestions: [
          "[8 Marks] What is the diamond problem in C++? Explain with an inheritance diagram how virtual base classes resolve member duplication.",
          "[7 Marks] Explain the visibility of base class members under public, protected, and private derivation modes.",
          "[7 Marks] Write a program demonstrating constructor call sequences in multiple and multilevel inheritance."
        ]
      },
      {
        id: "cpp-u8-virtual-functions-polymorphism",
        name: "Virtual Functions, Pure Virtual Functions, Abstract Classes & vptr/vtable",
        unit: 8,
        unitTitle: "Unit 8: Virtual Functions and Polymorphism",
        unitCode: "8.1",
        importance: "Very High",
        keyPoints: [
          "Upcasting: Base class pointer can point to a derived class object.",
          "Static Binding (Compile-time): Invokes base function based on pointer type; Dynamic Binding (Runtime): Invokes derived override based on pointed-to object.",
          "Virtual Functions: Declared with virtual keyword in base class, resolved dynamically at runtime.",
          "vtable & vptr: The compiler creates a Virtual Method Table (vtable) storing function pointers for each class with virtual functions, and injects a hidden pointer (vptr) into each object instance.",
          "Pure Virtual Function (virtual void draw() = 0): Makes the class Abstract. Cannot instantiate abstract classes.",
          "Virtual Destructor: Guarantees derived class destructors run when deleting derived objects through base class pointers, preventing memory leaks."
        ],
        theory: "Runtime polymorphism decouples system architectures from concrete implementations. The compiler achieves dynamic dispatch via vptr indexing into the class vtable at runtime (costing one pointer indirection). Virtual destructors are essential in C++ whenever a class contains any virtual functions.",
        code: `// Runtime Polymorphism & Virtual Destructors in C++
#include <iostream>
using namespace std;

class Shape {
public:
    virtual void draw() const = 0; // Pure virtual function => Abstract Class
    virtual double area() const = 0;

    virtual ~Shape() { // Crucial Virtual Destructor!
        cout << "Shape destroyed\\n";
    }
};

class Circle : public Shape {
private:
    double radius;
public:
    Circle(double r) : radius(r) {}
    void draw() const override { cout << "Drawing Circle\\n"; }
    double area() const override { return 3.14159 * radius * radius; }
    ~Circle() override { cout << "Circle destroyed\\n"; }
};

int main() {
    Shape *s = new Circle(5.0); // Upcasting
    s->draw();                  // Dynamic dispatch via vtable!
    cout << "Area: " << s->area() << endl;
    delete s;                   // Calls ~Circle() then ~Shape() safely
    return 0;
}`,
        example: "Without virtual destructor: 'delete s' where s is Shape* pointing to Circle would only execute ~Shape(), leaking Circle's internal resources.",
        commonExamQuestions: [
          "[8 Marks] Explain the internal working mechanism of virtual functions using vtable (Virtual Table) and vptr (Virtual Pointer) diagrams.",
          "[7 Marks] What is an abstract class and pure virtual function? Why is a virtual destructor necessary when dealing with inheritance?",
          "[7 Marks] Compare compile-time polymorphism with run-time polymorphism with clear code demonstrations."
        ]
      },
      {
        id: "cpp-u9-file-handling",
        name: "C++ File Streams, Binary I/O & Random Access File Pointers",
        unit: 9,
        unitTitle: "Unit 9: File Handling",
        unitCode: "9.1",
        importance: "Very High",
        keyPoints: [
          "Stream Classes in <fstream>: ifstream (input), ofstream (output), fstream (input/output).",
          "File Open Modes: ios::in (read), ios::out (write/overwrite), ios::app (append), ios::binary (binary I/O), ios::ate (seek to end on open).",
          "Binary File I/O: read((char*)&obj, sizeof(obj)) and write((char*)&obj, sizeof(obj)) read/write raw memory byte buffers.",
          "File Pointers: get pointer (seekg to seek, tellg to get position); put pointer (seekp to seek, tellp to get position).",
          "Stream Status Flags: eof() (end of file), fail() (format error), bad() (hardware error), good() (healthy)."
        ],
        theory: "C++ stream architecture treats files as sequences of continuous bytes. Binary file I/O bypasses character conversion overhead, persisting in-memory objects directly to storage. Random access operations move the file read/write cursor via seekg/seekp with offsets ios::beg, ios::cur, or ios::end, enabling direct record indexing.",
        code: `// Writing and Reading Class Objects to Binary Files in C++
#include <iostream>
#include <fstream>
using namespace std;

class StudentRecord {
public:
    int id;
    char name[30];
    float gpa;

    void input(int i, const char* n, float g) {
        id = i;
        strncpy(name, n, 29);
        name[29] = '\\0';
        gpa = g;
    }
};

void saveRecord(const StudentRecord& s) {
    ofstream outFile("students.dat", ios::binary | ios::app);
    outFile.write(reinterpret_cast<const char*>(&s), sizeof(s));
    outFile.close();
}

void readAllRecords() {
    ifstream inFile("students.dat", ios::binary);
    StudentRecord s;
    while (inFile.read(reinterpret_cast<char*>(&s), sizeof(s))) {
        cout << "ID: " << s.id << ", Name: " << s.name << ", GPA: " << s.gpa << endl;
    }
    inFile.close();
}`,
        example: "To seek to the 5th record: file.seekg(4 * sizeof(StudentRecord), ios::beg).",
        commonExamQuestions: [
          "[8 Marks] Write a complete C++ program to store student records (roll, name, marks) in a binary file and search for a record by roll number using read() and seekg().",
          "[7 Marks] Explain file opening modes and the functions of seekg(), seekp(), tellg(), and tellp()."
        ]
      },
      {
        id: "cpp-u10-templates-namespaces",
        name: "Function Templates, Class Templates & Custom Namespaces",
        unit: 10,
        unitTitle: "Unit 10: Templates and Namespaces",
        unitCode: "10.1",
        importance: "High",
        keyPoints: [
          "Templates enable Generic Programming: Writing algorithms and data structures independent of specific data types.",
          "Function Templates: template <typename T> T findMax(T a, T b) generates concrete functions on-demand.",
          "Class Templates: template <class T> class Stack creates type-safe collections for int, float, or custom objects.",
          "Namespaces: Prevent global identifier naming collisions in large projects (namespace MyProject { int value; }).",
          "Using Directives: using namespace std brings entire namespace into scope; using std::cout brings specific symbols."
        ],
        theory: "Templates are executed at compile-time via template instantiation. The compiler generates specialized machine code for each unique type parameter combination, avoiding runtime boxing/unboxing overhead while preserving compile-time type safety.",
        code: `// Generic Stack Implementation Using C++ Class Template
#include <iostream>
using namespace std;

template <typename T, int MAX_SIZE = 100>
class GenericStack {
private:
    T elements[MAX_SIZE];
    int topIndex;

public:
    GenericStack() : topIndex(-1) {}

    bool push(T val) {
        if (topIndex >= MAX_SIZE - 1) return false;
        elements[++topIndex] = val;
        return true;
    }

    T pop() {
        if (topIndex < 0) throw runtime_error("Stack Underflow");
        return elements[topIndex--];
    }
};

int main() {
    GenericStack<int> intStack;
    intStack.push(10); intStack.push(20);
    cout << intStack.pop() << endl;

    GenericStack<string> strStack;
    strStack.push("Purbanchal"); strStack.push("University");
    cout << strStack.pop() << endl;
    return 0;
}`,
        example: "Namespace isolation: namespace Engineering { int calculate(); } namespace Business { int calculate(); }. No name collisions!",
        commonExamQuestions: [
          "[8 Marks] Design a generic Stack class using C++ class templates with push, pop, and isEmpty operations.",
          "[7 Marks] What are namespaces in C++? How do they prevent identifier collisions? Explain with code snippets."
        ]
      },
      {
        id: "cpp-u11-exception-handling",
        name: "Structured Exception Handling: try, catch, throw & Stack Unwinding",
        unit: 11,
        unitTitle: "Unit 11: Exception Handling",
        unitCode: "11.1",
        importance: "Medium",
        keyPoints: [
          "try block: Encloses code that may trigger runtime errors; throw: Signals that an exceptional error occurred; catch block: Handles the exception.",
          "Catch-all Handler (catch(...)): Catches any exception type not caught by preceding catch blocks.",
          "Stack Unwinding: The runtime automatically destroys all local stack objects created inside the try block before entering the catch handler.",
          "Re-throwing Exceptions: A catch handler can re-throw the caught exception upward using throw; without arguments."
        ],
        theory: "Structured exception handling cleanly decouples error detection from error resolution. By bubbling errors up the call stack, functions encountering failures do not need to rely on awkward error return codes or global flags.",
        code: `// Exception Handling Demonstration in C++
#include <iostream>
#include <stdexcept>
using namespace std;

double divide(double a, double b) {
    if (b == 0) {
        throw invalid_argument("Division by zero error!"); // Throwing exception
    }
    return a / b;
}

int main() {
    try {
        cout << divide(10.0, 2.0) << endl;
        cout << divide(5.0, 0.0) << endl; // Will throw
    } catch (const invalid_argument &e) {
        cerr << "Caught Exception: " << e.what() << endl;
    } catch (...) {
        cerr << "Caught Unknown Exception!" << endl;
    }
    return 0;
}`,
        example: "Custom exception class: class InsufficientFundsException : public exception { public: const char* what() const noexcept override { return 'Balance too low'; } };",
        commonExamQuestions: [
          "[7 Marks] Explain the exception handling mechanism in C++ (try, catch, throw) with a divide-by-zero example.",
          "[7 Marks] What is stack unwinding during exception handling? How does C++ guarantee resource cleanup when an exception is thrown?"
        ]
      }
    ],
    theoryTopics: [
      "Compare function overloading (early binding) with virtual functions (late binding) in terms of compiler mechanism and overhead.",
      "Explain the Rule of Three in C++ and why custom destructors often require custom copy constructors and assignment operators.",
      "Describe how binary files are searched and updated using seekg/seekp with class objects in C++.",
      "Explain why stream insertion (<<) and extraction (>>) operators cannot be overloaded as member functions."
    ]
  },

  "Financial Management and Accounting": {
    subjectName: "Financial Management and Accounting",
    code: "BIT155MS",
    creditHours: 3,
    topics: [
      {
        id: "fma-u1-nature-financial-mgmt",
        name: "Financial Decisions, Profit vs Wealth Maximization & Agency Theory",
        unit: 1,
        unitTitle: "Unit 1: Nature of Financial Management",
        unitCode: "1.1",
        importance: "High",
        keyPoints: [
          "Financial Management deals with planning, procuring, and utilizing corporate funds effectively.",
          "Three Core Financial Decisions: (1) Investment Decision (Capital Budgeting), (2) Financing Decision (Capital Structure & Cost of Capital), (3) Dividend Decision (Payout vs Retention).",
          "Profit Maximization vs Wealth Maximization: Profit maximization is short-sighted, ignores time value of money, and neglects business risk. Wealth Maximization (maximizing Net Present Worth / Market Price per Share) is the universally accepted corporate objective.",
          "Agency Problem: Conflict of interest between Shareholders (principals) and Management (agents). Mitigated by stock options, performance bonuses, and active board monitoring."
        ],
        theory: "Financial management aligns operational resource management with shareholder economic value addition. While accounting reports past historical transactions, corporate finance evaluates future cash flows under uncertainty, aiming to optimize the firm's weighted average cost of capital (WACC) and maximize market capitalization.",
        code: `// Wealth Maximization Formula:
// Market Value of Equity = Number of Shares * Market Price Per Share (MPS)
// Present Worth of an Enterprise:
// W_0 = ∑_{t=1}^n [ CF_t / (1 + k)^t ] - Initial Outlay
// Where CF_t is cash flow in period t, and k is the risk-adjusted cost of capital.`,
        example: "If an IT firm pursues profit maximization, it might cancel R&D and cybersecurity to show high short-term accounting profit, destroying the long-term enterprise value of the firm.",
        commonExamQuestions: [
          "[8 Marks] Critically compare Profit Maximization and Wealth Maximization as objectives of financial management. Why is wealth maximization superior?",
          "[7 Marks] Explain the three major financial decisions made by a finance manager in an IT corporation."
        ]
      },
      {
        id: "fma-u2-time-value-of-money",
        name: "Compounding, Discounting, Annuities & Loan Amortization",
        unit: 2,
        unitTitle: "Unit 2: Time Value of Money",
        unitCode: "2.1",
        importance: "Very High",
        keyPoints: [
          "A rupee today is worth more than a rupee tomorrow due to inflation, investment opportunities, and risk.",
          "Future Value of a Single Sum: FV_n = PV · (1 + i)^n.",
          "Present Value of a Single Sum: PV = FV_n / (1 + i)^n = FV_n · PVIF(i, n).",
          "Ordinary Annuity (payments at END of each period): PVIFA = [1 - (1 + i)^{-n}] / i; Annuity Due (payments at BEGINNING): PV_{due} = PV_{ordinary} · (1 + i).",
          "Perpetuity: Constant stream of cash flows forever: PV = PMT / i.",
          "Loan Amortization: Calculating equal annual installments (PMT = Principal / PVIFA) and dividing each payment into interest and principal reduction."
        ],
        theory: "The time value of money provides the quantitative framework for all asset valuation, bond pricing, and capital budgeting. By discounting future nominal cash flows back to the present epoch using an appropriate opportunity cost of capital i, financial analysts can equitably evaluate competing multi-year investment alternatives.",
        code: `// Python Calculation: Loan Amortization Schedule
loan = 100000.0  # Loan amount
rate = 0.10      # 10% annual interest
n = 3            # 3 years
# PMT = Loan / PVIFA(10%, 3) = 100000 / 2.48685 = 40211.48
pmt = loan * (rate / (1 - (1 + rate)**(-n)))
print(f"Annual Installment: NPR {pmt:.2f}")

balance = loan
for year in range(1, n + 1):
    interest = balance * rate
    principal = pmt - interest
    balance -= principal
    print(f"Year {year}: Payment={pmt:.2f}, Interest={interest:.2f}, Principal={principal:.2f}, Balance={balance:.2f}")`,
        example: "Present Value of NPR 50,000 received 5 years from now at 12% discount rate: PV = 50000 / (1 + 0.12)⁵ = 50000 / 1.76234 = NPR 28,371.34.",
        commonExamQuestions: [
          "[8 Marks] A company borrows NPR 500,000 at 12% annual interest to be repaid in 5 equal annual installments. Construct a complete loan amortization schedule.",
          "[7 Marks] Differentiate between Ordinary Annuity and Annuity Due. Find the present value of an annuity of NPR 20,000 per year for 6 years at an 8% discount rate."
        ]
      },
      {
        id: "fma-u3-capital-budgeting",
        name: "Capital Budgeting Techniques: PBP, ARR, NPV, IRR & Profitability Index",
        unit: 3,
        unitTitle: "Unit 3: Capital Budgeting",
        unitCode: "3.1",
        importance: "Very High",
        keyPoints: [
          "Capital Budgeting evaluates long-term investment proposals involving significant capital outlays.",
          "Cash Flows (CFAT = EAT + Depreciation) are used instead of accounting profits.",
          "Payback Period (PBP): Time required to recover initial investment. (Non-discounted).",
          "Net Present Value (NPV): NPV = ∑ [CFAT_t / (1 + k)^t] - Initial Outlay. Accept project if NPV > 0.",
          "Internal Rate of Return (IRR): Discount rate that makes NPV = 0. Accept if IRR > Cost of Capital (k).",
          "Profitability Index (PI): PI = PV of Cash Inflows / Initial Outlay. Accept if PI > 1.0.",
          "NPV vs IRR Conflict: Can occur in mutually exclusive projects due to scale differences or reinvestment rate assumptions (NPV assumes reinvestment at cost of capital k; IRR assumes reinvestment at IRR). NPV is theoretically superior."
        ],
        theory: "Capital budgeting decisions are irreversible strategic commitments. Because cash flows occur over multiple operating years, discounted cash flow (DCF) techniques (NPV and IRR) adjust for time preference and project risk. A positive NPV directly measures the net addition to total shareholder wealth.",
        code: `// Worked Capital Budgeting Problem:
// Project Outlay: NPR 100,000; Cost of Capital k = 10%
// Cash Inflows: Year 1: 40k, Year 2: 40k, Year 3: 30k, Year 4: 20k
//
// Year | CFAT    | PVIF(10%) | Present Value
// -----+---------+-----------+--------------
//   1  | 40,000  |  0.9091   |   36,364
//   2  | 40,000  |  0.8264   |   33,056
//   3  | 30,000  |  0.7513   |   22,539
//   4  | 20,000  |  0.6830   |   13,660
// Total PV of Inflows = NPR 105,619
// Net Present Value (NPV) = 105,619 - 100,000 = +NPR 5,619 (ACCEPT PROJECT!)
// Profitability Index (PI) = 105,619 / 100,000 = 1.056`,
        example: "Payback Period: After Year 2, cumulative cash = 80k. Remaining to recover = 20k out of Year 3's 30k. PBP = 2 + (20,000 / 30,000) = 2.67 years.",
        commonExamQuestions: [
          "[8 Marks] A project costs NPR 200,000 and generates cash flows: Y1: 60k, Y2: 80k, Y3: 70k, Y4: 50k. Calculate: (i) PBP, (ii) NPV at 10%, (iii) PI, (iv) IRR.",
          "[7 Marks] Explain why NPV and IRR methods can give conflicting rankings for mutually exclusive projects. Which method is preferred and why?"
        ]
      },
      {
        id: "fma-u4-working-capital",
        name: "Operating Cycle, Cash Management & Economic Order Quantity (EOQ)",
        unit: 4,
        unitTitle: "Unit 4: Working Capital",
        unitCode: "4.1",
        importance: "High",
        keyPoints: [
          "Gross Working Capital = Total Current Assets; Net Working Capital = Current Assets - Current Liabilities.",
          "Operating Cycle: Time between purchasing raw materials and receiving cash from debtors: OC = Inventory Period + Debtors Period.",
          "Cash Conversion Cycle (CCC): CCC = Operating Cycle - Creditors Payment Period.",
          "Financing Policies: Matching / Hedging (mature matching), Conservative (long-term funds finance permanent and part of temporary CA), Aggressive (short-term funds finance temporary and part of permanent CA).",
          "Inventory Management: EOQ = √[(2 · Annual Demand · Ordering Cost) / Holding Cost per unit]."
        ],
        theory: "Working capital management navigates the trade-off between profitability and liquidity. Holding excess current assets reduces insolvency risk but depresses return on assets; maintaining low working capital enhances profitability but exposes the enterprise to production halts and liquidity default.",
        code: `// Economic Order Quantity (EOQ) Calculation in C++
#include <iostream>
#include <cmath>
using namespace std;

int main() {
    double D = 10000; // Annual demand in units
    double S = 250;   // Ordering cost per order
    double H = 5;     // Carrying/holding cost per unit per year

    double eoq = sqrt((2 * D * S) / H);
    double totalOrders = D / eoq;
    double totalCost = sqrt(2 * D * S * H);

    cout << "Economic Order Quantity (EOQ): " << eoq << " units" << endl;
    cout << "Optimal Number of Orders per Year: " << totalOrders << endl;
    cout << "Total Inventory Carrying & Ordering Cost: NPR " << totalCost << endl;
    return 0;
}`,
        example: "Cash Conversion Cycle: Inventory Conversion Period = 60 days, Receivables Collection Period = 40 days, Payables Deferral Period = 30 days. CCC = 60 + 40 - 30 = 70 days.",
        commonExamQuestions: [
          "[8 Marks] Explain the components of Working Capital. Calculate the Cash Conversion Cycle for a firm given relevant turnover figures.",
          "[7 Marks] Derive the EOQ formula. Given Annual Demand = 8,000 units, Ordering Cost = NPR 200, Carrying Cost = NPR 2/unit, calculate EOQ."
        ]
      },
      {
        id: "fma-u5-capital-structure-leverage",
        name: "Operating, Financial & Combined Leverage, and Capital Structure Theories",
        unit: 5,
        unitTitle: "Unit 5: Capital Structure",
        unitCode: "5.1",
        importance: "High",
        keyPoints: [
          "Operating Leverage measures fixed operating costs: DOL = Contribution / EBIT = (% Change in EBIT) / (% Change in Sales).",
          "Financial Leverage measures fixed financing interest costs: DFL = EBIT / EBT = (% Change in EPS) / (% Change in EBIT).",
          "Combined Leverage: DCL = DOL · DFL = Contribution / EBT.",
          "Net Income (NI) Approach (Durand): Capital structure matters; increasing debt reduces WACC and raises firm value.",
          "Net Operating Income (NOI) Approach: WACC and total firm value remain constant regardless of debt-equity mix.",
          "Modigliani-Miller (MM) Theorem: In a perfect market without taxes, capital structure is irrelevant (Arbitrage proof). With corporate taxes, debt increases firm value due to interest tax shields (V_L = V_U + t_c · Debt)."
        ],
        theory: "Leverage quantifies the magnification of return volatility caused by fixed commitments. Operating leverage magnifies the effect of revenue swings on operating earnings (EBIT), while financial leverage magnifies the effect of EBIT fluctuations on shareholder returns (EPS).",
        code: `// Leverage Formulations:
// Income Statement Flow:
// Sales - Variable Costs = Contribution
// Contribution - Fixed Operating Costs = EBIT
// EBIT - Interest = EBT (Earnings Before Tax)
// EBT - Taxes = EAT (Earnings After Tax)
// EAT / Number of Shares = EPS (Earnings Per Share)

// DOL = Contribution / EBIT
// DFL = EBIT / (EBIT - Interest - [Preference Dividend / (1 - Tax)])
// DCL = DOL * DFL = Contribution / (EBIT - Interest)`,
        example: "Sales = NPR 500,000, Variable Cost = NPR 200,000, Fixed Costs = NPR 150,000, Interest = NPR 50,000. Contribution = 300k, EBIT = 150k, EBT = 100k. DOL = 300k/150k = 2.0; DFL = 150k/100k = 1.5; DCL = 2.0 * 1.5 = 3.0.",
        commonExamQuestions: [
          "[8 Marks] Calculate Degree of Operating Leverage, Financial Leverage, and Combined Leverage from a given corporate income statement.",
          "[7 Marks] Explain Modigliani-Miller (MM) hypothesis of capital structure both in the absence and presence of corporate taxes."
        ]
      },
      {
        id: "fma-u6-double-entry-accounting",
        name: "Accounting Principles, Golden Rules of Debit/Credit & The Accounting Cycle",
        unit: 6,
        unitTitle: "Unit 7: Nature of Accounting & Unit 8: Accounting Process",
        unitCode: "7.1",
        importance: "Very High",
        keyPoints: [
          "Accounting Equation: Assets = Liabilities + Owner's Equity.",
          "Golden Rules of Accounting: (1) Personal Accounts: Debit the receiver, Credit the giver; (2) Real Accounts (Assets): Debit what comes in, Credit what goes out; (3) Nominal Accounts (Expenses/Revenues): Debit all expenses and losses, Credit all incomes and gains.",
          "Accounting Concepts: Business Entity (business separate from owner), Money Measurement, Going Concern, Accrual Concept, Matching Principle, Prudence / Conservatism (anticipate losses, never anticipate profits).",
          "Accounting Cycle: Source Documents -> Journal -> General Ledger -> Trial Balance -> Adjusting Entries -> Final Financial Statements.",
          "Trial Balance: Statement of all debit and credit balances; errors not revealed by trial balance include errors of omission, errors of commission, errors of principle, and compensating errors."
        ],
        theory: "Double-entry bookkeeping is an axiomatic recording system where every financial transaction has equal and offsetting debit and credit entries. Nominal accounts track operating expenses and revenues for the accounting period, which are closed into the capital account via the Profit and Loss Account.",
        code: `// Standard Journal Entries:
// 1. Started business with cash NPR 500,000:
//    Cash A/c (Real) ............................ Dr. 500,000
//        To Capital A/c (Personal) ...................... Cr. 500,000
//    (Being capital introduced into business)

// 2. Purchased computer equipment on credit from Apex Ltd for NPR 80,000:
//    Computer Equipment A/c (Real) .............. Dr. 80,000
//        To Apex Ltd A/c (Personal) ..................... Cr. 80,000
//    (Being computer equipment purchased on credit)

// 3. Paid office rent NPR 25,000 by cheque:
//    Rent Expense A/c (Nominal) ................. Dr. 25,000
//        To Bank A/c (Personal) ......................... Cr. 25,000
//    (Being office rent paid)`,
        example: "Trial Balance Equality: Total Debits must exactly equal Total Credits. If a rent payment of NPR 5,000 is completely forgotten, the trial balance still balances (Error of Omission).",
        commonExamQuestions: [
          "[8 Marks] State and explain the Golden Rules of Debit and Credit with two illustrative journal entries for each category.",
          "[7 Marks] Pass necessary journal entries for 5 given business transactions, post them to Ledger accounts, and balance the Cash account.",
          "[7 Marks] What is a Trial Balance? Explain four types of accounting errors that are not revealed by a balanced Trial Balance."
        ]
      },
      {
        id: "fma-u7-financial-statements",
        name: "Final Accounts: Trading, Profit & Loss Account, Balance Sheet & Adjustments",
        unit: 7,
        unitTitle: "Unit 9: Financial Statement",
        unitCode: "9.1",
        importance: "Very High",
        keyPoints: [
          "Trading Account: Determines Gross Profit = Net Sales - Cost of Goods Sold (COGS). COGS = Opening Stock + Net Purchases + Direct Expenses - Closing Stock.",
          "Profit and Loss Account: Determines Net Profit = Gross Profit + Indirect Incomes - Indirect/Operating Expenses.",
          "Balance Sheet: Snapshot of financial position at a specific date; marshaled in order of liquidity or permanence.",
          "Year-End Adjustments: (1) Closing Stock (Trading Cr. & Balance Sheet Asset); (2) Outstanding Expenses (Add to Expense & BS Liability); (3) Prepaid Expenses (Deduct from Expense & BS Asset); (4) Depreciation (P&L Dr. & Deduct from Asset); (5) Provision for Doubtful Debts."
        ],
        theory: "Final accounts synthesize the cumulative transactions of an accounting fiscal year. The accrual and matching concepts dictate that revenues and associated costs must be recognized in the period they occur, regardless of whether physical cash was transferred, necessitating year-end adjusting entries.",
        code: `// Financial Statement Structure:
// Trading Account:
//   Sales - (Opening Stock + Purchases + Wages/Freight - Closing Stock) = Gross Profit
//
// Profit & Loss Account:
//   Gross Profit - (Salaries + Rent + Depreciation + Interest) = Net Profit
//
// Balance Sheet:
//   ASSETS:
//     Non-Current Assets: Plant & Machinery, Furniture, Computers (Less Depreciation)
//     Current Assets: Closing Stock, Debtors, Prepaid Expenses, Cash & Bank
//   LIABILITIES & EQUITY:
//     Owner's Equity: Capital + Net Profit - Drawings
//     Non-Current Liabilities: Bank Loan, Debentures
//     Current Liabilities: Creditors, Outstanding Expenses, Bank Overdraft`,
        example: "Depreciation Adjustment: Computer cost NPR 100,000 depreciated at 20% SLM. Debit Depreciation Expense NPR 20,000 in P&L Account. Show Computer on Balance Sheet as NPR 100,000 - NPR 20,000 = NPR 80,000.",
        commonExamQuestions: [
          "[12 Marks] From a comprehensive 12-item Trial Balance and adjustments (closing stock, outstanding wages, depreciation), prepare Trading Account, Profit & Loss Account, and Balance Sheet.",
          "[7 Marks] Explain the accounting treatment of outstanding expenses, prepaid expenses, and provision for doubtful debts with journal entries."
        ]
      },
      {
        id: "fma-u8-ratio-analysis",
        name: "Financial Ratio Analysis: Liquidity, Leverage, Turnover & Profitability",
        unit: 8,
        unitTitle: "Unit 10: Financial Analysis",
        unitCode: "10.1",
        importance: "Very High",
        keyPoints: [
          "Liquidity Ratios: Current Ratio = Current Assets / Current Liabilities (Ideal 2:1); Quick / Acid-Test Ratio = (Current Assets - Stock - Prepaids) / Current Liabilities (Ideal 1:1).",
          "Leverage Ratios: Debt-Equity Ratio = Total Debt / Shareholders' Equity; Interest Coverage Ratio = EBIT / Interest.",
          "Activity / Turnover Ratios: Inventory Turnover = COGS / Average Inventory; Debtors Turnover = Net Credit Sales / Average Debtors; Average Collection Period = 365 / Debtors Turnover.",
          "Profitability Ratios: Gross Profit Margin = (Gross Profit / Sales) · 100; Net Profit Margin = (Net Profit / Sales) · 100; Return on Equity (ROE) = (Net Profit After Tax / Net Worth) · 100; Earnings Per Share (EPS) = Net Profit / Number of Common Shares."
        ],
        theory: "Ratio analysis evaluates the financial health, creditworthiness, and operational efficiency of an enterprise. By establishing mathematical relationships between items in financial statements, analysts benchmark corporate performance against historical trends, competitors, and industry averages.",
        code: `// Python Calculation: Financial Health Diagnostics via Ratio Analysis
def analyzeFinancials(ca, cl, stock, sales, cogs, ebit, interest, netIncome, equity, debt):
    currentRatio = ca / cl
    quickRatio = (ca - stock) / cl
    debtEquity = debt / equity
    icr = ebit / interest
    netMargin = (netIncome / sales) * 100
    roe = (netIncome / equity) * 100

    print(f"Current Ratio: {currentRatio:.2f} (Benchmark: 2.0)")
    print(f"Quick Ratio: {quickRatio:.2f} (Benchmark: 1.0)")
    print(f"Debt-to-Equity: {debtEquity:.2f}")
    print(f"Interest Coverage: {icr:.2f}x")
    print(f"Net Profit Margin: {netMargin:.2f}%")
    print(f"Return on Equity: {roe:.2f}%")

analyzeFinancials(ca=200000, cl=100000, stock=40000, sales=500000, cogs=300000, 
                  ebit=80000, interest=20000, netIncome=45000, equity=250000, debt=150000)`,
        example: "A company has Current Ratio = 2.5 and Quick Ratio = 0.8. The high divergence indicates heavy capital blockage in unsold inventory, exposing the firm to liquidity crunches despite an apparently healthy current ratio.",
        commonExamQuestions: [
          "[8 Marks] Calculate Current Ratio, Quick Ratio, Debt-Equity Ratio, Inventory Turnover Ratio, and Net Profit Margin from a given Balance Sheet and P&L statement.",
          "[7 Marks] Explain the significance of the Interest Coverage Ratio and Debt-Equity Ratio to a commercial bank evaluating a long-term loan proposal."
        ]
      },
      {
        id: "fma-u9-cash-flow-direct",
        name: "Cash Flow Statement: Direct Method (NAS 07 / IAS 7)",
        unit: 9,
        unitTitle: "Unit 11: Cash Flow Statement - Direct Method",
        unitCode: "11.1",
        importance: "Very High",
        keyPoints: [
          "Cash Flow Statement reports actual physical cash inflows and outflows categorized into three activities: Operating, Investing, and Financing.",
          "Operating Activities (Direct Method): Cash receipts from customers minus cash paid to suppliers, employees, operating expenses, and taxes.",
          "Investing Activities: Purchase and sale of long-term productive assets (Property, Plant, Equipment) and financial investments.",
          "Financing Activities: Proceeds from issuing shares, debentures, loan borrowings, repayment of debt principal, and dividend payments.",
          "Net Cash Flow = Operating CF + Investing CF + Financing CF. Closing Cash = Opening Cash + Net Cash Flow."
        ],
        theory: "While the Profit and Loss Account measures profitability under accrual conventions (where non-cash revenues and expenses distort real liquidity), the Cash Flow Statement tracks genuine solvency. The Direct Method is explicitly mandated by Nepal Accounting Standard (NAS 07) and preferred by regulatory bodies because it clearly reveals gross operational cash collection efficiency.",
        code: `// Cash Flow Statement (Direct Method) Outline:
// A. CASH FLOW FROM OPERATING ACTIVITIES:
//    Cash receipts from customers (Sales - Increase in Debtors)
//    Less: Cash paid to suppliers (Purchases + Increase in Creditors - Increase in Stock)
//    Less: Cash paid to employees and operating expenses
//    Less: Income tax paid
//    = Net Cash Flow from Operating Activities
//
// B. CASH FLOW FROM INVESTING ACTIVITIES:
//    Purchase of Machinery / Fixed Assets (Outflow)
//    Sale of Old Equipment (Inflow)
//    = Net Cash Flow from Investing Activities
//
// C. CASH FLOW FROM FINANCING ACTIVITIES:
//    Issue of Share Capital (Inflow)
//    Repayment of Bank Loan (Outflow)
//    Dividend Paid (Outflow)
//    = Net Cash Flow from Financing Activities
//
// Net Increase / Decrease in Cash (A + B + C)
// + Opening Cash and Bank Balance
// = Closing Cash and Bank Balance (Reconciled with Balance Sheet)`,
        example: "Cash collected from customers: Sales = NPR 800,000. Debtors increased by NPR 50,000. Cash collected = 800,000 - 50,000 = NPR 750,000.",
        commonExamQuestions: [
          "[10 Marks] Prepare a Cash Flow Statement using the Direct Method as per NAS 07 from two comparative Balance Sheets and an Income Statement.",
          "[7 Marks] Differentiate between Cash Flow Statement and Funds Flow Statement. Why is the Direct Method preferred by regulatory bodies?"
        ]
      }
    ],
    theoryTopics: [
      "Explain the fundamental accounting concepts of Accrual, Matching, Going Concern, and Conservatism with real business examples.",
      "Compare the Net Income (NI) and Net Operating Income (NOI) approaches to capital structure.",
      "Describe the limitations of financial ratio analysis in assessing corporate performance.",
      "Explain the Baumol and Miller-Orr models of cash management."
    ]
  },

  "Project-II": {
    subjectName: "Project-II",
    code: "BIT156CO",
    creditHours: 2,
    topics: [
      {
        id: "proj2-u1-proposal-feasibility",
        name: "Project Domain Selection, Feasibility Analysis & Proposal Defense",
        unit: 1,
        unitTitle: "Unit 1: Topic Selection, Feasibility Study & Project Proposal",
        unitCode: "1.1",
        importance: "Very High",
        keyPoints: [
          "Project-II is a group software project (2-3 students) implemented in C++ applying Object-Oriented Analysis and Design (OOAD).",
          "Domain Exploration: Systems such as Hospital Management, Banking Simulation, Academic Record Systems, Point-of-Sale Inventory, Airline Reservation, or 2D Game Engines.",
          "Feasibility Analysis: Technical Feasibility (C++ compiler, file formats, memory footprint), Operational Feasibility (user adoption), Economic/Schedule Feasibility.",
          "Proposal Structure: Problem Statement, Objectives, Scope and Limitations, System Methodology, Hardware/Software Requirements, Gantt Chart Timeline.",
          "Proposal Defense: Evaluated by departmental committee (10% marks weightage)."
        ],
        theory: "Software engineering begins with rigorous problem definition. The project proposal establishes the contractual scope between student development teams and academic evaluation supervisors, avoiding scope creep and aligning development objectives with core OOP paradigms.",
        code: `// Standard Structure of C++ Project Proposal:
// 1. Title of the Project
// 2. Introduction & Background
// 3. Problem Statement & Motivation
// 4. Project Objectives (General & Specific)
// 5. Scope and Delimitations
// 6. Feasibility Study (Technical, Operational, Schedule)
// 7. System Architecture & Methodology (OOA/OOD)
// 8. Work Breakdown Structure (WBS) & Gantt Chart
// 9. Expected Outcomes and Deliverables
// 10. References / Bibliography`,
        example: "A Gantt Chart allocates Week 1-3 for Proposal, Week 4-6 for Analysis and UML modeling, Week 7-10 for Core C++ Implementation, Week 11-12 for File Persistence & Testing, and Week 13-15 for Documentation & Defense.",
        commonExamQuestions: [
          "[10 Marks] Write a comprehensive project proposal for a Student Information and Grading System using Object-Oriented C++ including objectives, scope, and Gantt chart.",
          "[5 Marks] Explain the components of technical and operational feasibility analysis for desktop C++ software projects."
        ]
      },
      {
        id: "proj2-u2-ooa-use-cases",
        name: "Object-Oriented Analysis (OOA), CRC Cards & Use Case Modeling",
        unit: 2,
        unitTitle: "Unit 2: System Requirements & Object-Oriented Analysis (OOA)",
        unitCode: "2.1",
        importance: "Very High",
        keyPoints: [
          "Requirement Engineering: Eliciting Functional Requirements (what the system does) and Non-Functional Requirements (performance, memory, crash safety).",
          "Actor Identification: Primary actors (users, administrators) and external systems interacting across system boundaries.",
          "Use Case Modeling: Use cases capture interactions; diagrams show actors, use cases, <<include>> and <<extend>> relationships.",
          "Domain Modeling: Noun-verb analysis on problem descriptions to identify candidate classes and operations.",
          "Class Responsibility Collaborator (CRC) Cards: Lightweight index-card technique defining Class Name, Responsibilities (what it knows/does), and Collaborators (other classes it relies upon)."
        ],
        theory: "Object-Oriented Analysis focuses on understanding the problem domain without making premature implementation or storage commitments. Noun identification uncovers entities (Customer, Account, Transaction), while verb analysis identifies candidate member functions (deposit, authenticate, displayStatement).",
        code: `// CRC Card Layout Example for Banking System:
// -------------------------------------------------------------
// Class Name: BankAccount
// Superclass: (None)          Subclasses: SavingsAccount, CurrentAccount
// -------------------------------------------------------------
// Responsibilities:                    | Collaborators:
// - Maintain account number & balance | - TransactionLogger
// - Validate deposit amounts           | - InterestCalculator
// - Check overdraft limits on debit   |
// - Provide formatted balance report   |
// -------------------------------------------------------------`,
        example: "Use Case relationship: 'Process Loan' <<includes>> 'Verify Credit History'. 'Generate Overdraft Alert' <<extends>> 'Withdraw Cash' on condition of insufficient funds.",
        commonExamQuestions: [
          "[8 Marks] Draw a Use Case Diagram and write a detailed Use Case description for a Library Management System.",
          "[7 Marks] Explain CRC modeling and demonstrate how candidate classes and responsibilities are extracted from requirement specifications."
        ]
      },
      {
        id: "proj2-u3-ood-class-diagrams",
        name: "Object-Oriented Design (OOD), UML Class Diagrams & Architecture",
        unit: 3,
        unitTitle: "Unit 3: Object-Oriented Design (OOD) & Architecture",
        unitCode: "3.1",
        importance: "Very High",
        keyPoints: [
          "Tiered Architecture: Separating UI / Presentation Layer (console menu), Business Logic Layer (domain models), and Data Access Layer (file storage).",
          "UML Class Diagram: Standard diagrammatic notation showing class attributes (- private, # protected, + public), methods with signatures, and relationships.",
          "Relationships: Association (uses), Aggregation (weak has-a, hollow diamond), Composition (strong has-a lifecycle dependency, filled diamond), Generalization (is-a inheritance, hollow triangle).",
          "Sequence Diagrams: Temporal event flow between objects for primary operational workflows.",
          "File Structure Architecture: Designing record structures with fixed byte lengths to support direct indexing."
        ],
        theory: "Design bridges abstract analysis to concrete C++ implementation. Applying the Single Responsibility Principle (SRP) ensures that individual classes handle specific tasks (e.g., FileStorageManager handles persistence, while Account handles domain business validation).",
        code: `// UML Class Representation to C++ Header Translation:
// +-----------------------------------+
// |             Account               |
// +-----------------------------------+
// | - accountNumber : int             |
// | # balance : double                |
// +-----------------------------------+
// | + deposit(amount : double) : void |
// | + withdraw(amount : double) : bool|
// | + getBalance() : double           |
// +-----------------------------------+

class Account {
private:
    int accountNumber;
protected:
    double balance;
public:
    Account(int acc, double initBal) : accountNumber(acc), balance(initBal) {}
    virtual void deposit(double amount) { balance += amount; }
    virtual bool withdraw(double amount) = 0; // Pure virtual
    double getBalance() const { return balance; }
    virtual ~Account() {}
};`,
        example: "Composition vs Aggregation: A Car has a mandatory Engine (Composition - Car owns Engine's lifetime). A Department has Professors (Aggregation - Professors exist independently if Department dissolves).",
        commonExamQuestions: [
          "[8 Marks] Draw a comprehensive UML Class Diagram for an Inventory Management System showing inheritance, aggregation, and visibility specifiers.",
          "[7 Marks] Explain the difference between Composition and Aggregation with UML notation and equivalent C++ code snippets."
        ]
      },
      {
        id: "proj2-u4-cpp-implementation",
        name: "System Implementation: Modular Files, Persistence & Exception Handling",
        unit: 4,
        unitTitle: "Unit 4: System Implementation & Coding in C++",
        unitCode: "4.1",
        importance: "Very High",
        keyPoints: [
          "Modular File Organization: .h / .hpp header files for class declarations (with #ifndef / #define include guards), and .cpp files for member function definitions.",
          "Applying core OOP features: Inheritance hierarchies, constructor chaining, operator overloading, and dynamic polymorphism.",
          "Persistent Storage: Managing binary file streams (ifstream, ofstream, fstream) to perform full CRUD operations (Create, Read, Update, Delete) on domain records.",
          "Robust Input Validation: Preventing buffer overflows, handling bad numeric input (cin.fail(), cin.clear(), cin.ignore()), and throwing custom exception classes.",
          "Clean Code Practices: Meaningful identifiers, const-correctness, zero memory leaks, and informative comments."
        ],
        theory: "Project implementation translates architecture into executable, deployment-grade software. The integration of binary streams with OOP class structures allows persistent simulation of enterprise databases without requiring heavy external database engines.",
        code: `// Modular C++ File-Persistence Architecture for Project-II
#include <iostream>
#include <fstream>
#include <cstring>
using namespace std;

class Book {
public:
    int bookId;
    char title[50];
    char author[50];
    bool isIssued;

    void input() {
        cout << "Enter Book ID: "; cin >> bookId;
        cin.ignore();
        cout << "Enter Title: "; cin.getline(title, 50);
        cout << "Enter Author: "; cin.getline(author, 50);
        isIssued = false;
    }

    void display() const {
        cout << "[" << bookId << "] " << title << " by " << author 
             << (isIssued ? " (ISSUED)" : " (AVAILABLE)") << endl;
    }
};

class LibraryManager {
private:
    const char* filename = "library.dat";
public:
    void addBook(const Book& b) {
        ofstream out(filename, ios::binary | ios::app);
        out.write(reinterpret_cast<const char*>(&b), sizeof(Book));
        out.close();
    }

    bool updateStatus(int targetId, bool status) {
        fstream file(filename, ios::binary | ios::in | ios::out);
        Book b;
        while (file.read(reinterpret_cast<char*>(&b), sizeof(Book))) {
            if (b.bookId == targetId) {
                b.isIssued = status;
                file.seekp(-static_cast<int>(sizeof(Book)), ios::cur);
                file.write(reinterpret_cast<const char*>(&b), sizeof(Book));
                file.close();
                return true;
            }
        }
        file.close();
        return false;
    }
};`,
        example: "Using seekp(-sizeof(Record), ios::cur) rewinds the put pointer by exactly one record length, overwriting and updating a specific record in place.",
        commonExamQuestions: [
          "[10 Marks] Write a C++ program implementing an in-place record update and deletion algorithm on a binary file using seekg/seekp.",
          "[5 Marks] Explain why header guards (#ifndef, #define, #endif) are necessary in multi-file C++ projects."
        ]
      },
      {
        id: "proj2-u5-testing-debugging",
        name: "Unit Testing, Integration Testing, Memory Leaks & Bug Fixing",
        unit: 5,
        unitTitle: "Unit 5: Verification, Testing & Bug Fixing",
        unitCode: "5.1",
        importance: "Medium",
        keyPoints: [
          "Unit Testing: Testing individual class member functions in isolation (testing edge cases, zero/negative inputs, max bounds).",
          "Integration Testing: Verifying correct interaction between UI menus, business logic validation, and file persistence storage.",
          "Boundary Value Analysis: Testing inputs at extreme boundaries (e.g., 0 balance, max array size, end-of-file conditions).",
          "Memory Leak Detection: Ensuring every heap allocation via new or new[] is paired with an equivalent delete or delete[].",
          "Defensive Programming: Adding assertions (assert.h) and structured try-catch exception blocks."
        ],
        theory: "Testing verifies that the software satisfies all initial functional requirements without regressions or security vulnerabilities. In C++, dynamic memory leaks degrade host OS performance over long execution runs, making systematic lifecycle verification a critical project deliverable.",
        code: `// Defensive Unit Testing Test-Harness Pattern in C++
#include <iostream>
#include <cassert>
using namespace std;

class Calculator {
public:
    static int divide(int a, int b) {
        if (b == 0) throw invalid_argument("Zero division");
        return a / b;
    }
};

void runUnitTests() {
    assert(Calculator::divide(10, 2) == 5);
    assert(Calculator::divide(-6, 2) == -3);
    try {
        Calculator::divide(5, 0);
        assert(false); // Should not reach here!
    } catch (const invalid_argument&) {
        // Exception expected and successfully caught!
    }
    cout << "All automated unit tests passed cleanly!" << endl;
}`,
        example: "Testing file corruption resilience: What happens if the data file is deleted or read-only? The system must gracefully report an error rather than abruptly crash.",
        commonExamQuestions: [
          "[7 Marks] Differentiate between unit testing and integration testing. Describe test cases for a bank withdrawal function.",
          "[7 Marks] Explain common memory management errors in C++ (dangling pointers, double-free, memory leaks) and their remedies."
        ]
      },
      {
        id: "proj2-u6-documentation-defense",
        name: "PU Project Report Standards, Code Listings & Final Viva Voce Defense",
        unit: 6,
        unitTitle: "Unit 6: Project Documentation & Final Viva Voce Defense",
        unitCode: "6.1",
        importance: "Very High",
        keyPoints: [
          "Standard Purbanchal University Report Format: Cover Page, Certificate of Approval, Recommendation, Acknowledgments, Abstract, Table of Contents, List of Figures/Tables.",
          "Core Report Chapters: Chapter 1: Introduction; Chapter 2: Literature Review & Feasibility; Chapter 3: System Analysis & Design (UML diagrams); Chapter 4: Implementation & Testing; Chapter 5: Conclusion & Future Enhancements; References (IEEE/APA); Appendices (Sample code & User Manual).",
          "Marks Weightage Breakdown: Proposal Defense (10%), Mid-Term Progress Review (20%), Pre-Final Working Prototype Demo (30%), Final Project Defense & Viva Voce (40%).",
          "Viva Voce Preparation: Explaining individual code contributions, justifying OOAD design choices, and demonstrating live execution."
        ],
        theory: "Technical documentation provides the enduring record of software development. A well-written report details architecture, design trade-offs, and empirical testing, enabling other engineers to maintain, audit, and extend the system.",
        code: `// Standard Purbanchal University Project Report Structure:
// - Title Page (Title, Degree, Student Names & Roll Nos, Department, University, Date)
// - Certificate of Approval (Signed by Internal & External Examiners)
// - Supervisor's Recommendation Letter
// - Abstract (One-page concise summary of objectives, tools, and results)
// - Chapter 1: Introduction (Background, Problem Statement, Objectives, Scope)
// - Chapter 2: Literature Review & Feasibility Study
// - Chapter 3: System Analysis and Design (Use cases, Class diagrams, Sequence diagrams)
// - Chapter 4: Implementation, Testing and Results (Screenshots, Test logs)
// - Chapter 5: Conclusion, Limitations and Recommendations for Future Work
// - References & Appendices (Key Source Code Modules)`,
        example: "In the Final Defense, examiners evaluate live handling of invalid inputs, inspect destructor memory safety, and interrogate students on why specific inheritance models or virtual functions were chosen.",
        commonExamQuestions: [
          "[8 Marks] Outline the standard chapters and formatting guidelines required for a Purbanchal University undergraduate software engineering project report.",
          "[7 Marks] How should a student project team prepare for a final software defense and viva voce examination? What key questions do examiners ask?"
        ]
      }
    ],
    theoryTopics: [
      "Explain the significance of Class-Responsibility-Collaborator (CRC) cards in object-oriented analysis.",
      "Describe how binary file persistence is designed and implemented in C++ software projects.",
      "Explain the differences between Composition, Aggregation, and Association with UML diagrams.",
      "Detail the evaluation criteria for the Purbanchal University Project-II defense across proposal, midterm, pre-final, and final viva voce stages."
    ]
  }
};
