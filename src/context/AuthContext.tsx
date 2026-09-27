"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, onIdTokenChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs, limit } from "firebase/firestore";
import { useRouter, usePathname } from "next/navigation";
import { READER_AUTH_COOKIE } from "@/lib/examai/reader-auth-cookie";
import { AuthModal } from "@/components/auth/AuthModal";

type UserRole = 'admin' | 'org_admin' | 'examiner' | 'student' | null;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  role: UserRole;
  isAdmin: boolean;
  isExaminer: boolean;   // true for admin | org_admin | examiner
  orgId: string | null;  // the org this user belongs to (if any)
  signOut: () => Promise<void>;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  role: null,
  isAdmin: false,
  isExaminer: false,
  orgId: null,
  signOut: async () => {},
  isAuthModalOpen: false,
  authModalMode: 'login',
  openAuthModal: () => {},
  closeAuthModal: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isExaminer, setIsExaminer] = useState(false);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const router = useRouter();
  const pathname = usePathname();

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const protectedRoutes = ["/dashboard", "/leaderboard", "/admin", "/examiner", "/organization"];
  const authRoutes = ["/login", "/signup"];

  useEffect(() => {
    if (!auth) {
      console.warn("Firebase Auth not initialized");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          // 1. Fetch User Profile
          const userRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          let userData = userSnap.exists() ? userSnap.data() : null;

          if (!userData) {
            // Canonical User document fallback (Phase 0)
            const fallbackName = firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Student";
            const initialRole = firebaseUser.email?.toLowerCase() === "amanmahato321@gmail.com" ? 'admin' : 'student';
            const { serverTimestamp, setDoc } = await import("firebase/firestore");
            const newDoc = {
              id: firebaseUser.uid,
              email: firebaseUser.email || "",
              name: fallbackName,
              displayName: firebaseUser.displayName || fallbackName,
              photoURL: firebaseUser.photoURL || "",
              phone: firebaseUser.phoneNumber || "",
              role: initialRole,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            };
            try {
              await setDoc(userRef, newDoc, { merge: true });
              userData = newDoc;
            } catch (createErr) {
              console.warn("AuthContext: Could not create fallback user document", createErr);
            }
          }
          
          // 2. Resolve Role
          const userRole: UserRole = userData?.role || 'student';

          setRole(userRole);
          setIsAdmin(userRole === 'admin');
          setIsExaminer(['admin', 'org_admin', 'examiner'].includes(userRole as any));

          // 3. Resolve Organization Membership
          if (userData?.orgId || userData?.org_id) {
            setOrgId(userData.orgId || userData.org_id);
          } else if (userRole === 'org_admin' || userRole === 'examiner') {
            // Only query if role suggests org membership and no direct org_id/orgId
            const memberQ = query(
              collection(db, "org_members"),
              where("user_id", "==", firebaseUser.uid),
              where("status", "==", "active"),
              limit(1)
            );
            const memberSnap = await getDocs(memberQ);
            setOrgId(!memberSnap.empty ? (memberSnap.docs[0].data().org_id || memberSnap.docs[0].data().orgId) : null);
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

  // Keeps a cookie in sync with the current ID token, so Server Components —
  // the ExamAI Reader in particular — can tell a signed-in visitor from an
  // anonymous one before rendering anything. onIdTokenChanged (not
  // onAuthStateChanged, above) is the one that also fires on the SDK's own
  // background token refresh, which is what keeps the cookie from going
  // stale partway through an hour-long reading session.
  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        // max-age well under the ID token's own ~1hr lifetime: a cookie that
        // outlived the token it carries would let a stale tab read gated
        // pages right up until verifyIdToken caught it server-side anyway, so
        // there is no protection lost by expiring it sooner — only one fewer
        // case for the server check to have to catch.
        document.cookie = `${READER_AUTH_COOKIE}=${token}; path=/; max-age=3000; SameSite=Lax`;
      } else {
        document.cookie = `${READER_AUTH_COOKIE}=; path=/; max-age=0`;
      }
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
    <AuthContext.Provider
      value={{
        user,
        loading,
        role,
        isAdmin,
        isExaminer,
        orgId,
        signOut,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
      <AuthModal
        isOpen={isAuthModalOpen}
        mode={authModalMode}
        onClose={closeAuthModal}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
