"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  UserCheck,
  UserX,
  CreditCard,
  Crown,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
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
} from "firebase/firestore";

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [lastVisible, setLastVisible] = useState<any>(null);

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
    <div className="pb-16">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-xl font-bold text-zinc-900 mb-1 flex items-center justify-center md:justify-start gap-2">
              <Users className="text-primary-600 w-5 h-5" />
              User management
            </h1>
            <p className="text-zinc-500 text-sm">Control platform access, roles, and account status.</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="relative">
               <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
               <input
                 type="text"
                 placeholder="Search by name or email..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="bg-white border border-zinc-200 rounded-md pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-shadow w-72"
               />
            </div>

            <div className="flex bg-zinc-100 rounded-md p-1">
               {["all", "admin", "student", "examiner"].map(role => (
                 <button
                   key={role}
                   onClick={() => setSelectedRole(role)}
                   className={`px-3 py-1.5 rounded text-xs font-semibold capitalize transition-colors ${selectedRole === role ? "bg-white text-primary-700 shadow-xs" : "text-zinc-500 hover:text-zinc-900"}`}
                 >
                   {role}
                 </button>
               ))}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Identity</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Access level</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Subscription</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Joined</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredUsers.map((user) => (
                  <motion.tr
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={user.id}
                    className={`hover:bg-zinc-50 transition-colors ${user.status === "suspended" ? "opacity-60 bg-red-50/40" : ""}`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-md bg-primary-50 flex items-center justify-center font-bold text-xs text-primary-700">
                          {user.displayName?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "??"}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-zinc-900 flex items-center gap-2">
                            {user.displayName || "Anonymous User"}
                            {user.status === "suspended" && <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded-full uppercase tracking-wide">Suspended</span>}
                          </p>
                          <p className="text-xs text-zinc-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${user.role === "admin" ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
                        {user.role === "admin" ? <ShieldAlert className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                        {user.role || "student"}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                       <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600">
                          {user.is_premium ? (
                             <>
                                <Crown className="w-3.5 h-3.5 text-amber-500" />
                                <span className="text-amber-600">Premium</span>
                             </>
                          ) : (
                             <>
                                <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
                                <span>Basic tier</span>
                             </>
                          )}
                       </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-medium text-zinc-600">{user.created_at ? new Date(user.created_at.seconds * 1000).toLocaleDateString() : "Unknown"}</span>
                        <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-semibold uppercase tracking-wide">
                           <Clock className="w-3 h-3" />
                           {user.last_login ? "Recently active" : "Never logged in"}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                       <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => toggleUserRole(user.id, user.role)}
                            className="p-2 rounded-md bg-zinc-50 border border-zinc-200 text-zinc-500 hover:text-primary-600 hover:border-primary-300 transition-colors"
                            title="Toggle Admin Role"
                          >
                             <UserCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleUserStatus(user.id, user.status)}
                            className={`p-2 rounded-md border transition-colors ${user.status === "suspended" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-red-50 border-red-200 text-red-600"}`}
                            title={user.status === "suspended" ? "Reactivate User" : "Suspend User"}
                          >
                             {user.status === "suspended" ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                          </button>
                       </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && !loading && (
            <div className="py-16 text-center flex flex-col items-center gap-3">
               <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                  <Users className="w-6 h-6" />
               </div>
               <p className="text-zinc-500 text-sm">No users found matching your criteria.</p>
            </div>
          )}

          <div className="p-4 border-t border-zinc-100 flex items-center justify-between">
             <div className="text-xs font-semibold text-zinc-500">
                Showing {filteredUsers.length} of {users.length} loaded records
             </div>
             {lastVisible && (
               <button
                 onClick={() => fetchUsers()}
                 className="px-4 py-2 bg-white border border-zinc-200 rounded-md text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
               >
                 Load more
               </button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
