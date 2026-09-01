"use client";

import { motion } from "framer-motion";
import {
  Bell,
  FileText,
  Trophy,
  MapPin,
  Search,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { noticesData, NoticeItem } from "@/data/noticesData";

export default function NoticesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("" );
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);

  const categories = ["All", "Grand Mock", "Result", "Exam Routine", "Syllabus"];

  const filteredNotices = noticesData.filter((notice) => {
    const matchCategory = selectedCategory === "All" || notice.category === selectedCategory;
    const matchSearch = !searchTerm.trim() || 
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.venue.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-zinc-50/40 pt-8 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Noticeboard Hero */}
        <div className="bg-white rounded-lg p-6 sm:p-8 border border-zinc-200 space-y-2.5 text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-[11px] font-bold uppercase tracking-wider">
            <Bell className="w-3.5 h-3.5 text-orange-600" />
            <span>Direct notifications</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            Notice board &amp; results
          </h1>

          <p className="text-zinc-500 text-sm max-w-xl mx-auto leading-relaxed">
            Find all announcements regarding online test registrations, syllabus schedules, physical mock test results, and administrative routines.
          </p>
        </div>

        {/* Controls: Search & Categories */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notices, results, venues..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 shadow-2xs"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 w-full sm:w-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? "bg-zinc-900 text-white border-zinc-900 shadow-2xs"
                    : "bg-white text-zinc-700 hover:bg-zinc-50 border-zinc-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Saral Pathshala Style Notice Item List */}
        <div className="space-y-4">
          {filteredNotices.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="p-5 sm:p-6 rounded-xl bg-white border border-zinc-200 hover:border-orange-400 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5 group"
            >
              <div className="flex items-start gap-4">
                
                {/* Date Block (Saral Pathshala Exact Design) */}
                <div className="w-16 h-16 rounded-lg bg-orange-50/80 border border-orange-200 flex flex-col items-center justify-center flex-shrink-0 text-center shadow-2xs">
                  <span className="text-xl font-bold text-orange-600 leading-none">{item.day}</span>
                  <span className="text-[10px] font-bold text-orange-700 uppercase tracking-tight mt-0.5">{item.monYear}</span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-zinc-700 px-2 py-0.5 rounded-md bg-zinc-100">
                      {item.badge}
                    </span>
                    {item.venue && (
                      <span className="text-[11px] text-zinc-500 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-orange-500" />
                        {item.venue}
                      </span>
                    )}
                  </div>

                  <h3 
                    onClick={() => setSelectedNotice(item)}
                    className="text-base sm:text-lg font-bold text-zinc-900 hover:text-orange-600 transition-colors cursor-pointer leading-snug"
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs text-zinc-600 leading-relaxed line-clamp-2">
                    {item.summary}
                  </p>

                  {/* PDF Attachment Badge */}
                  {item.hasPdf && (
                    <div className="pt-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                        <FileText className="w-3 h-3" />
                        PDF Attachment
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-3 self-end sm:self-center flex-shrink-0">
                <button
                  onClick={() => setSelectedNotice(item)}
                  className="w-10 h-10 rounded-xl bg-orange-50 hover:bg-orange-500 text-orange-700 hover:text-white border border-orange-200 hover:border-orange-500 flex items-center justify-center transition-all shadow-2xs group-hover:scale-105"
                  aria-label="View Notice Details"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Notice Details Modal */}
        {selectedNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-6 shadow-2xl text-zinc-800"
            >
              <div className="flex items-start justify-between border-b border-zinc-100 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase text-orange-600">{selectedNotice.badge}</span>
                  <h2 className="text-2xl font-bold text-zinc-900 mt-1">{selectedNotice.title}</h2>
                  <p className="text-xs text-zinc-400 mt-1">Published on {selectedNotice.publishedDate} • Venue: {selectedNotice.venue}</p>
                </div>
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-zinc-700 transition-all"
                >
                  Close
                </button>
              </div>

              <p className="text-sm text-zinc-700 leading-relaxed">{selectedNotice.summary}</p>

              {/* Highlights */}
              <div className="p-5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700">Official Highlights</h4>
                <ul className="space-y-1.5 text-xs text-zinc-700">
                  {selectedNotice.details.map((d, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">•</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Top Rankers Leaderboard */}
              {selectedNotice.topRankers && selectedNotice.topRankers.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-600" />
                    Top Rankers Merit Roll
                  </h4>
                  <div className="space-y-2">
                    {selectedNotice.topRankers.map((tr) => (
                      <div key={tr.rank} className="p-3.5 rounded-lg bg-white border border-zinc-200 flex items-center justify-between shadow-2xs">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold text-xs">
                            #{tr.rank}
                          </span>
                          <div>
                            <p className="font-bold text-xs text-zinc-900">{tr.name}</p>
                            <p className="text-[10px] text-zinc-400">{tr.college}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-600">{tr.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-zinc-100 flex justify-between items-center gap-3">
                {selectedNotice.hasPdf && (
                  <span className="text-xs font-bold text-red-600 flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    Official Result Sheet Verified
                  </span>
                )}
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="px-6 py-2.5 rounded-xl bg-zinc-900 text-white font-bold text-xs hover:bg-zinc-800 transition-all shadow-sm"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
}
