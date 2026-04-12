"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  where,
  Timestamp 
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Info, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  link?: string;
  created_at: any;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
});

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toasts, setToasts] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) {
       setNotifications([]);
       return;
    }

    // Listen for global notifications (e.g. new exams)
    // In a real app, we might also listen for user-specific ones
    const q = query(
      collection(db, "notifications"),
      where("user_id", "==", user.uid),
      orderBy("created_at", "desc"),
      limit(10)
    );

    let active = true;
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!active) return;
      const newNotifs = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];

      // Check for strictly "new" notifications to show as toasts
      const now = Date.now();
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          const createdAt = (data.created_at as Timestamp)?.toMillis() || 0;
          if (now - createdAt < 10000) {
            const toast = { id: change.doc.id, ...data } as Notification;
            setToasts(prev => [...prev, toast]);
            setTimeout(() => {
              if (active) setToasts(prev => prev.filter(t => t.id !== toast.id));
            }, 6000);
          }
        }
      });

      setNotifications(newNotifs);
    }, (error) => {
      if (!active) return;
      console.warn("Notification stream error:", error);
    });

    return () => {
      active = false;
      try {
        unsubscribe();
      } catch (e) {
        console.warn("Notification listener cleanup suppressed error:", e);
      }
    };
  }, [user]);

  const markAsRead = (id: string) => {
    // Local read state for now, or could be stored in localstorage
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount: notifications.length, markAsRead }}>
      {children}
      
      {/* Toast Layer */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="pointer-events-auto"
            >
              <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl flex items-start gap-4">
                <div className={`p-2 rounded-xl shrink-0 ${
                  toast.type === "success" ? "bg-emerald-500/10 text-emerald-400" : 
                  toast.type === "warning" ? "bg-amber-500/10 text-amber-400" : 
                  "bg-primary/10 text-primary"
                }`}>
                  {toast.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : 
                   toast.type === "warning" ? <AlertCircle className="w-5 h-5" /> : 
                   <Bell className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white mb-1">{toast.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">{toast.message}</p>
                  {toast.link && (
                    <Link 
                      href={toast.link}
                      className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors"
                      onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                    >
                      View Details
                    </Link>
                  )}
                </div>
                <button 
                  onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                  className="p-1 hover:bg-white/5 rounded-lg transition-colors text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
