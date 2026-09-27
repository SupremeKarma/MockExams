"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  GraduationCap,
  Building2,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter, useSearchParams } from "next/navigation";
import { useProgram } from "@/context/ProgramContext";

export interface StuDocuAuthCardProps {
  initialMode?: "login" | "signup";
  onSuccess?: () => void;
  isModal?: boolean;
}

const UNIVERSITIES = [
  { id: "TU", name: "Tribhuvan University (TU / IOST / IOE)", country: "Nepal" },
  { id: "PU", name: "Purbanchal University (PU)", country: "Nepal" },
  { id: "POU", name: "Pokhara University (PoU)", country: "Nepal" },
  { id: "KU", name: "Kathmandu University (KU)", country: "Nepal" },
  { id: "CAMBRIDGE", name: "Cambridge Assessment International Education (CAIE)", country: "International" },
  { id: "COLLEGE_BOARD", name: "College Board (Advanced Placement)", country: "USA / Global" },
  { id: "GATE_IIT", name: "GATE / IISc & IITs", country: "India" },
  { id: "OTHER", name: "Other University / College", country: "Global" },
];

const PROGRAMS = [
  { id: "BIT", name: "Bachelor in Information Technology (BIT)", universityId: "PU" },
  { id: "TU_CSIT", name: "B.Sc. Computer Science & IT (B.Sc. CSIT)", universityId: "TU" },
  { id: "IOE_ENTRANCE", name: "IOE Engineering Entrance Examination", universityId: "TU" },
  { id: "BCA", name: "Bachelor in Computer Application (BCA)", universityId: "POU" },
  { id: "CAMBRIDGE_A_LEVELS", name: "Cambridge AS & A Level (STEM)", universityId: "CAMBRIDGE" },
  { id: "US_AP", name: "College Board AP (CS A / Calculus)", universityId: "COLLEGE_BOARD" },
  { id: "GATE_CS", name: "GATE Computer Science & IT", universityId: "GATE_IIT" },
  { id: "GENERAL_CS", name: "General Computer Science / Software Engineering", universityId: "OTHER" },
];

export function StuDocuAuthCard({ initialMode = "login", onSuccess, isModal = false }: StuDocuAuthCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawNext = searchParams.get("next");
  const next = rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";
  const { setActiveProgramId } = useProgram();

  const [mode, setMode] = useState<"login" | "signup" | "forgot">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState(UNIVERSITIES[0].name);
  const [selectedProgram, setSelectedProgram] = useState(PROGRAMS[0].id);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const handleAuthSuccess = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      router.push(next);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Ensure Firestore user document exists
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const fallbackName = user.displayName || user.email?.split("@")[0] || "Student";
        const initialRole = user.email?.toLowerCase() === "amanmahato321@gmail.com" ? "admin" : "student";
        await setDoc(userRef, {
          id: user.uid,
          email: user.email || email,
          name: fallbackName,
          displayName: user.displayName || fallbackName,
          photoURL: user.photoURL || "",
          phone: user.phoneNumber || "",
          role: initialRole,
          university: selectedUniversity,
          programId: selectedProgram,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      handleAuthSuccess();
    } catch (err: any) {
      setError(
        err.code === "auth/invalid-credential" || err.code === "auth/wrong-password"
          ? "Invalid email or password. Please check your credentials."
          : err.message || "Failed to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email || !password) {
      setError("Please fill in your name, email, and password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      const initialRole = email.toLowerCase() === "amanmahato321@gmail.com" ? "admin" : "student";

      await setDoc(
        doc(db, "users", user.uid),
        {
          id: user.uid,
          name,
          displayName: name,
          email,
          university: selectedUniversity,
          programId: selectedProgram,
          role: initialRole,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // Align active program context with chosen program
      if (selectedProgram === "BIT") setActiveProgramId("prog-bit");
      else if (selectedProgram === "IOE_ENTRANCE") setActiveProgramId("prog-ioe");
      else if (selectedProgram === "BCA") setActiveProgramId("prog-bca");

      handleAuthSuccess();
    } catch (err: any) {
      setError(
        err.code === "auth/email-already-in-use"
          ? "This email is already registered. Please sign in instead."
          : err.message || "Failed to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (providerType: "google" | "github") => {
    setLoading(true);
    setError(null);

    try {
      const provider = providerType === "google" ? new GoogleAuthProvider() : new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const fallbackName = user.displayName || user.email?.split("@")[0] || "Student";
      const initialRole = user.email?.toLowerCase() === "amanmahato321@gmail.com" ? "admin" : "student";

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          id: user.uid,
          name: fallbackName,
          displayName: user.displayName || fallbackName,
          email: user.email || "",
          photoURL: user.photoURL || "",
          university: selectedUniversity,
          programId: selectedProgram,
          role: initialRole,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      handleAuthSuccess();
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError(err.message || `Failed to sign in with ${providerType}.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your registered email address.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset link. Verify your email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full max-w-md mx-auto ${isModal ? "p-0" : "bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-zinc-100"}`}>
      {/* StuDocu-Style Brand Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-600 text-white shadow-md mb-3">
          <GraduationCap className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
          {mode === "forgot" ? "Reset your password" : mode === "signup" ? "Create your free account" : "Welcome back to MockExams"}
        </h2>
        <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
          {mode === "forgot"
            ? "Enter your email to receive recovery instructions."
            : "Access verified university past papers, lecture notes, and syllabus guides."}
        </p>
      </div>

      {/* Mode Tab Switcher (Sign In vs Register) */}
      {mode !== "forgot" && (
        <div className="flex bg-zinc-100 p-1 rounded-xl mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === "login" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === "signup" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            Register
          </button>
        </div>
      )}

      {/* Error / Feedback Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Social One-Tap Authentication (StuDocu Primary Path) */}
      {mode !== "forgot" && (
        <div className="space-y-2.5 mb-5">
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-semibold shadow-sm transition-all hover:border-zinc-300 disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3h3.86c2.26-2.09 3.68-5.17 3.68-9.1z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.37 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin("github")}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-zinc-900 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>Continue with GitHub</span>
          </button>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-zinc-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-medium text-zinc-400 absolute">
              or continue with email
            </span>
          </div>
        </div>
      )}

      {/* Main Email Form */}
      <AnimatePresence mode="wait">
        {mode === "forgot" ? (
          <motion.form
            key="forgot"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handlePasswordReset}
            className="space-y-4"
          >
            {resetSent ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-semibold text-emerald-900">Reset instructions sent!</p>
                <p className="text-[11px] text-emerald-700">
                  Check your inbox at <strong>{email}</strong> for a link to reset your password.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setResetSent(false);
                  }}
                  className="mt-2 text-xs font-semibold text-primary-600 hover:text-primary-700 underline"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@university.edu"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                  Send Password Reset Link
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-xs font-medium text-zinc-500 hover:text-zinc-800 flex items-center justify-center gap-1 mx-auto"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Back to Sign In
                  </button>
                </div>
              </>
            )}
          </motion.form>
        ) : mode === "signup" ? (
          <motion.form
            key="signup"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onSubmit={handleEmailSignup}
            className="space-y-3.5"
          >
            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aman Mahato"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@student.edu.np"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* University Selection (StuDocu Characteristic Step) */}
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">University / Academic Board</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <select
                  value={selectedUniversity}
                  onChange={(e) => setSelectedUniversity(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-zinc-200 text-xs bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none appearance-none transition-all"
                >
                  {UNIVERSITIES.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name} ({u.country})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Program / Major Selection */}
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Degree / Course Focus</label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-zinc-200 text-xs bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none appearance-none transition-all"
                >
                  {PROGRAMS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              Create Free Student Account
            </button>
          </motion.form>
        ) : (
          <motion.form
            key="login"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleEmailLogin}
            className="space-y-3.5"
          >
            {/* Email Address */}
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-zinc-700">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setMode("forgot");
                    setError(null);
                  }}
                  className="text-[11px] font-medium text-primary-600 hover:text-primary-700 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              Sign In to Your Account
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Security & Terms Trust Badge (StuDocu Style) */}
      <div className="mt-6 pt-4 border-t border-zinc-100 text-center">
        <p className="text-[10px] text-zinc-400 leading-relaxed flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Encrypted academic authentication & verified student records</span>
        </p>
      </div>
    </div>
  );
}
