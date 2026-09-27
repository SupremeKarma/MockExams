"use client";

import { motion } from "framer-motion";
import { MoveLeft, Github, Mail, Lock, Loader2, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GithubAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Only an internal path is honoured — an open redirect through `next` would
  // let a phishing link send a signed-in student anywhere after they trust
  // this page enough to type a password into it.
  const rawNext = searchParams.get("next");
  const next = rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Ensure Firestore user doc exists on email login
      const { db } = await import("@/lib/firebase");
      const { doc, getDoc, setDoc, serverTimestamp } = await import("firebase/firestore");
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const name = user.displayName || user.email?.split("@")[0] || "Student";
        const initialRole = user.email?.toLowerCase() === "amanmahato321@gmail.com" ? 'admin' : 'student';
        await setDoc(userRef, {
          id: user.uid,
          email: user.email || email,
          name,
          displayName: user.displayName || name,
          photoURL: user.photoURL || "",
          phone: user.phoneNumber || "",
          role: initialRole,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      router.push(next);
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (providerName: 'github' | 'google') => {
    setLoading(true);
    setError(null);
    try {
      const provider = providerName === 'google' 
        ? new GoogleAuthProvider() 
        : new GithubAuthProvider();
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const { db } = await import("@/lib/firebase");
      const { doc, getDoc, setDoc, serverTimestamp } = await import("firebase/firestore");
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const name = user.displayName || user.email?.split("@")[0] || "Student";
      const initialRole = user.email?.toLowerCase() === "amanmahato321@gmail.com" ? 'admin' : 'student';

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          id: user.uid,
          email: user.email || "",
          name,
          displayName: user.displayName || name,
          photoURL: user.photoURL || "",
          phone: user.phoneNumber || "",
          role: initialRole,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } else {
        await setDoc(userRef, {
          name: userSnap.data()?.name || name,
          displayName: user.displayName || userSnap.data()?.displayName || name,
          photoURL: user.photoURL || userSnap.data()?.photoURL || "",
          updatedAt: serverTimestamp()
        }, { merge: true });
      }

      router.push(next);
    } catch (err: any) {
      setError(err.message || `Failed to sign in with ${providerName}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-mesh text-zinc-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-8 md:p-10 rounded-xl border border-zinc-200 shadow-lg"
      >
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-primary-600 transition-colors text-xs font-bold mb-6">
            <MoveLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900">Welcome Back</h1>
          </div>
          <p className="text-zinc-500 text-xs font-medium">Log in to access your notes, flashcards, and exam analytics.</p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-bold text-zinc-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                id="email"
                type="email" 
                placeholder="student@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-primary-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-bold text-zinc-700">Password</label>
              <Link href="/forgot-password" className="text-[11px] text-primary-600 hover:underline font-bold">Forgot password?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                id="password"
                type="password" 
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-primary-600"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary-600 text-white rounded-xl font-bold text-xs hover:bg-primary-700 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6 relative text-center">
          <div className="absolute top-1/2 left-0 w-full h-px bg-zinc-200" />
          <span className="relative z-10 bg-white px-3 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">or continue with</span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button 
            onClick={() => handleSocialLogin('github')}
            className="flex items-center justify-center gap-2 py-2.5 bg-zinc-50 hover:bg-zinc-100 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-700 transition-colors"
          >
            <Github className="w-4 h-4" />
            GitHub
          </button>
          <button 
            onClick={() => handleSocialLogin('google')}
            className="flex items-center justify-center gap-2 py-2.5 bg-zinc-50 hover:bg-zinc-100 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-700 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-zinc-500 font-medium">
          Don&apos;t have an account?{" "}
          <Link
            href={next === "/dashboard" ? "/signup" : `/signup?next=${encodeURIComponent(next)}`}
            className="text-primary-600 hover:underline font-bold"
          >
            Sign up for free
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
