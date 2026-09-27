"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  Building2,
  ChevronRight,
  Loader2,
  PlusCircle,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";

interface OrgSummary {
  id: string;
  name: string;
  type?: string;
  status: string;
  email?: string;
}

export default function OrganizationIndexPage() {
  const { user, loading, role, isAdmin, orgId } = useAuth();
  const router = useRouter();
  const [organizations, setOrganizations] = useState<OrgSummary[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (loading) return;

    // 1. If user is tied to a specific organization, redirect to that organization's dashboard
    if (orgId) {
      router.replace(`/organization/${orgId}`);
      return;
    }

    // 2. If user is an Admin, load the list of organizations they can oversee
    if (isAdmin) {
      const fetchOrgs = async () => {
        setFetching(true);
        try {
          const snap = await getDocs(collection(db, "organizations"));
          const orgList: OrgSummary[] = snap.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<OrgSummary, "id">),
          }));
          setOrganizations(orgList);
        } catch (err) {
          console.error("Failed to fetch organizations:", err);
        } finally {
          setFetching(false);
        }
      };
      fetchOrgs();
    }
  }, [loading, orgId, isAdmin, router]);

  if (loading || fetching) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  // Admin view: list of organizations with quick action to oversee or approve new ones
  if (isAdmin) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-zinc-200 rounded-xl shadow-sm">
          <div>
            <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
              Administration
            </span>
            <h2 className="text-2xl font-bold text-zinc-900 mt-1">
              Active Institutional Organizations
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Select an institutional portal to manage its members, curriculum, and exam rosters.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/organizations"
              className="px-4 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-2 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              Org Requests Queue
            </Link>
            <Link
              href="/organization/apply"
              className="px-4 py-2.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold transition-colors inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              New Application
            </Link>
          </div>
        </div>

        {organizations.length === 0 ? (
          <div className="p-12 text-center bg-white border border-zinc-200 rounded-xl">
            <Building2 className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-zinc-800">No organizations found</h3>
            <p className="text-xs text-zinc-500 mt-1 mb-4">
              There are no approved organizations currently registered in the database.
            </p>
            <Link
              href="/admin/organizations"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-xs font-bold hover:bg-primary-700 transition-colors"
            >
              Check pending requests
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {organizations.map((org) => (
              <Link
                key={org.id}
                href={`/organization/${org.id}`}
                className="group block p-6 bg-white border border-zinc-200 hover:border-primary-500 rounded-xl transition-all shadow-sm hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      org.status === "approved"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {org.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-zinc-900 mt-4 group-hover:text-primary-600 transition-colors">
                  {org.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Type: {org.type || "Institutional"} • {org.email || "No contact"}
                </p>
                <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-primary-600">
                  <span>Enter Portal</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Non-admin without assigned org
  return (
    <div className="p-8 text-center bg-white border border-zinc-200 rounded-xl max-w-lg mx-auto">
      <Building2 className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
      <h2 className="text-xl font-bold text-zinc-900">No Active Organization Assigned</h2>
      <p className="text-xs text-zinc-500 mt-2 mb-6">
        Your account has organization permissions, but is not currently assigned to an active organization roster.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/organization/apply"
          className="px-6 py-2.5 bg-primary-600 text-white rounded-lg text-xs font-bold hover:bg-primary-700 transition-colors"
        >
          Submit Organization Application
        </Link>
        <Link
          href="/dashboard"
          className="px-6 py-2.5 bg-zinc-100 text-zinc-700 rounded-lg text-xs font-bold hover:bg-zinc-200 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
