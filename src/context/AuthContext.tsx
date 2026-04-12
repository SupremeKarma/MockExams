"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs, limit } from "firebase/firestore";
import { useRouter, usePathname } from "next/navigation";

type UserRole = 'admin' | 'org_admin' | 'examiner' | 'student' | null;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  role: UserRole;
  isAdmin: boolean;
  isExaminer: boolean;   // true for admin | org_admin | examiner
  orgId: string | null;  // the org this user belongs to (if any)
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  role: null,
  isAdmin: false,
  isExaminer: false,
  orgId: null,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isExaminer, setIsExaminer] = useState(false);
  const [orgId, setOrgId] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const protectedRoutes = ["/dashboard", "/leaderboard", "/admin", "/examiner", "/organization"];
  const authRoutes = ["/login", "/signup"];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          // 1. Fetch User Profile
          const userSnap = await getDoc(doc(db, "users", firebaseUser.uid));
          const userData = userSnap.exists() ? userSnap.data() : null;
          
          // 2. Resolve Role
          let userRole: UserRole = userData?.role || 'student';
          
          // Hardcoded override for developer convenience
          if (firebaseUser.email === "amanmahato321@gmail.com") {
            userRole = 'admin';
          }
          
          setRole(userRole);
          setIsAdmin(userRole === 'admin');
          setIsExaminer(['admin', 'org_admin', 'examiner'].includes(userRole as any));

          // 3. Resolve Organization Membership
          if (userRole === 'org_admin' || userRole === 'examiner' || userData?.org_id) {
            // Check direct org_id first
            if (userData?.org_id) {
              setOrgId(userData.org_id);
            } else {
              // Fallback to searching org_members collection
              const memberQ = query(
                collection(db, "org_members"),
                where("user_id", "==", firebaseUser.uid),
                where("status", "==", "active"),
                limit(1)
              );
              const memberSnap = await getDocs(memberQ);
              setOrgId(!memberSnap.empty ? memberSnap.docs[0].data().org_id : null);
            }
          } else {
            setOrgId(null);
          }
        } catch (err) {
          console.error("AuthContext: Profile resolution failed", err);
          setRole('student');
          setIsAdmin(false);
          setIsExaminer(false);
          setOrgId(null);
        }
      } else {
        setUser(null);
        setRole(null);
        setIsAdmin(false);
        setIsExaminer(false);
        setOrgId(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push("/login");
  };

  useEffect(() => {
    if (loading) return;

    const isProtectedRoute =
      protectedRoutes.some(route => pathname.startsWith(route)) ||
      (pathname.startsWith("/exams/") && pathname.endsWith("/take"));

    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    if (!user && isProtectedRoute) {
      router.push("/login");
    }

    if (user && isAuthRoute) {
      router.push("/dashboard");
    }
  }, [pathname, user, loading, router]);

  return (
    <AuthContext.Provider value={{ user, loading, role, isAdmin, isExaminer, orgId, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
