"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  Shield, 
  ShieldAlert, 
  Mail, 
  Calendar, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  CreditCard,
  Crown,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  getDocs, 
  orderBy, 
  where, 
  limit, 
  startAfter,
  doc,
  updateDoc,
  Timestamp 
} from "firebase/firestore";
import Link from "next/link";

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchUsers(true);
  }, [selectedRole]);

  const fetchUsers = async (reset = false) => {
    setLoading(true);
    try {
      let q = query(collection(db, "users"), orderBy("created_at", "desc"), limit(20));
      
      if (selectedRole !== "all") {
        q = query(collection(db, "users"), where("role", "==", selectedRole), orderBy("created_at", "desc"), limit(20));
      }

      if (!reset && lastVisible) {
        q = query(q, startAfter(lastVisible));
      }

      const snapshot = await getDocs(q);
      const userData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (reset) {
        setUsers(userData);
      } else {
        setUsers(prev => [...prev, ...userData]);
      }
      
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "student" : "admin";
    if (!confirm(`Switch user to ${newRole}?`)) return;

    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert("Permission denied or update failed.");
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
      const newStatus = currentStatus === "suspended" ? "active" : "suspended";
      try {
        await updateDoc(doc(db, "users", userId), { status: newStatus });
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      } catch (err) {
        alert("Failed to update status.");
      }
  };

  const filteredUsers = users.filter(u => 
    (u.displayName || u.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black mb-2 flex items-center justify-center md:justify-start gap-3">
              <Users className="text-primary w-10 h-10" />
              User <span className="text-gradient">Management</span>
            </h1>
            <p className="text-slate-400 font-medium">Control platform access, roles, and account status.</p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
               <input 
                 type="text"
                 placeholder="Search by name or email..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all w-80 font-medium"
               />
            </div>
            
            <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1">
               {["all", "admin", "student", "examiner"].map(role => (
                 <button
                   key={role}
                   onClick={() => setSelectedRole(role)}
                   className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedRole === role ? "bg-primary text-white" : "text-slate-400 hover:text-white"}`}
                 >
                   {role}
                 </button>
               ))}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="glass-card rounded-[2.5rem] border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Identity</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Access Level</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Subscription</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Joined Date</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={user.id} 
                    className={`hover:bg-white/[0.01] transition-colors ${user.status === "suspended" ? "opacity-60 bg-rose-500/5" : ""}`}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-black text-xs text-primary border border-white/5">
                          {user.displayName?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "??"}
                        </div>
                        <div>
                          <p className="font-bold text-white flex items-center gap-2">
                            {user.displayName || "Anonymous User"}
                            {user.status === "suspended" && <span className="text-[8px] bg-rose-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">Suspended</span>}
                          </p>
                          <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === "admin" ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"}`}>
                        {user.role === "admin" ? <ShieldAlert className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                        {user.role || "student"}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                          {user.is_premium ? (
                             <>
                                <Crown className="w-4 h-4 text-amber-400" />
                                <span className="text-amber-400">Premium Elite</span>
                             </>
                          ) : (
                             <>
                                <CreditCard className="w-4 h-4 text-slate-500" />
                                <span>Basic Tier</span>
                             </>
                          )}
                       </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-slate-300">{user.created_at ? new Date(user.created_at.seconds * 1000).toLocaleDateString() : "Unknown"}</span>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-black uppercase tracking-widest">
                           <Clock className="w-3 h-3" />
                           {user.last_login ? "Recent Active" : "Never Logged In"}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <button 
                            onClick={() => toggleUserRole(user.id, user.role)}
                            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-primary hover:border-primary/30 transition-all group"
                            title="Toggle Admin Role"
                          >
                             <UserCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </button>
                          <button 
                            onClick={() => toggleUserStatus(user.id, user.status)}
                            className={`p-2.5 rounded-xl border transition-all group ${user.status === "suspended" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-rose-500/10 border-rose-500/20 text-rose-500"}`}
                            title={user.status === "suspended" ? "Reactivate User" : "Suspend User"}
                          >
                             {user.status === "suspended" ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                          </button>
                       </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && !loading && (
            <div className="py-20 text-center flex flex-col items-center gap-4">
               <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-slate-700">
                  <Users className="w-10 h-10" />
               </div>
               <p className="text-slate-500 font-medium">No users found matching your criteria.</p>
            </div>
          )}

          <div className="p-8 border-t border-white/5 flex items-center justify-between">
             <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Showing {filteredUsers.length} of {users.length} loaded records
             </div>
             {lastVisible && (
               <button 
                 onClick={() => fetchUsers()}
                 className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all font-bold"
               >
                 Load More
               </button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
