"use client";

import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { auth } from "@/lib/firebase";

interface BookmarkButtonProps {
  questionId: string;
  initiallyBookmarked?: boolean;
}

/**
 * Flags a question for the personal revision set (/practice?bookmarks=1).
 *
 * Bookmarking is idempotent server-side, so double-tapping cannot create
 * duplicates and the optimistic state can never drift permanently.
 */
export function BookmarkButton({ questionId, initiallyBookmarked = false }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initiallyBookmarked);
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    const user = auth.currentUser;
    if (!user || busy) return;

    const next = !bookmarked;
    setBusy(true);
    setBookmarked(next);

    try {
      const token = await user.getIdToken();
      const res = next
        ? await fetch("/api/me/bookmarks", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ questionId }),
          })
        : await fetch(`/api/me/bookmarks?questionId=${encodeURIComponent(questionId)}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });

      if (!res.ok) setBookmarked(!next);
    } catch {
      setBookmarked(!next);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={busy}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? "Remove from revision set" : "Save to revision set"}
      title={bookmarked ? "Saved to your revision set" : "Save to your revision set"}
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md border text-xs font-semibold transition-colors ${
        bookmarked
          ? "bg-amber-50 border-amber-200 text-amber-700"
          : "bg-white border-zinc-200 text-zinc-700 hover:border-amber-300 hover:bg-amber-50/40"
      }`}
    >
      {busy ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : bookmarked ? (
        <BookmarkCheck className="w-3.5 h-3.5" />
      ) : (
        <Bookmark className="w-3.5 h-3.5" />
      )}
      {bookmarked ? "Saved" : "Save for revision"}
    </button>
  );
}

export default BookmarkButton;
