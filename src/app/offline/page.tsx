import { WifiOff } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Offline — MockExams" };

// Served by the service worker when a navigation fails. Kept deliberately
// plain so it renders from cache with no data and no network.
export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-zinc-50/40 flex items-center justify-center px-4">
      <div className="max-w-sm text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-500 flex items-center justify-center mx-auto">
          <WifiOff className="w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold text-zinc-900">You are offline</h1>
        <p className="text-sm text-zinc-500 leading-relaxed">
          Pages you have already opened will still load. Exams need a connection —
          they are timed by the server, so an attempt cannot be started offline.
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-4 py-2.5 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm"
        >
          Try again
        </Link>
      </div>
    </div>
  );
}
