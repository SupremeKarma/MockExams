"use client";

import { motion } from "framer-motion";
import { 
  Bell, 
  FileText, 
  Download, 
  Trophy, 
  MapPin,
  ChevronRight, 
  Search, 
  Award, 
  Building2,
  Clock,
  ArrowRight
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
    <div className="min-h-screen bg-mesh text-slate-900 pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Saral Pathshala Style Noticeboard Hero */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-3 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-black uppercase tracking-widest">
            <Bell className="w-3.5 h-3.5 text-orange-600" />
            <span>Direct Notifications</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Notice Board & <span className="text-gradient">Results</span>
          </h1>

          <p className="text-slate-600 text-xs sm:text-sm font-medium max-w-xl mx-auto leading-relaxed">
            Find all announcements regarding online test registrations, syllabus schedules, physical mock test results, and administrative routines.
          </p>
        </div>

        {/* Controls: Search & Categories */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notices, results, venues..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 shadow-2xs"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 w-full sm:w-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                    : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
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
              className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 hover:border-orange-400 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5 group"
            >
              <div className="flex items-start gap-4">
                
                {/* Date Block (Saral Pathshala Exact Design) */}
                <div className="w-16 h-16 rounded-2xl bg-orange-50/80 border border-orange-200 flex flex-col items-center justify-center flex-shrink-0 text-center shadow-2xs">
                  <span className="text-xl font-black text-orange-600 leading-none">{item.day}</span>
                  <span className="text-[10px] font-bold text-orange-700 uppercase tracking-tight mt-0.5">{item.monYear}</span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-700 px-2 py-0.5 rounded-md bg-slate-100">
                      {item.badge}
                    </span>
                    {item.venue && (
                      <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-orange-500" />
                        {item.venue}
                      </span>
                    )}
                  </div>

                  <h3 
                    onClick={() => setSelectedNotice(item)}
                    className="text-base sm:text-lg font-bold text-slate-900 hover:text-orange-600 transition-colors cursor-pointer leading-snug"
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-2xl text-slate-800"
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-black uppercase text-orange-600">{selectedNotice.badge}</span>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">{selectedNotice.title}</h2>
                  <p className="text-xs text-slate-400 mt-1">Published on {selectedNotice.publishedDate} • Venue: {selectedNotice.venue}</p>
                </div>
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-all"
                >
                  Close
                </button>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">{selectedNotice.summary}</p>

              {/* Highlights */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Official Highlights</h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
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
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-600" />
                    Top Rankers Merit Roll
                  </h4>
                  <div className="space-y-2">
                    {selectedNotice.topRankers.map((tr) => (
                      <div key={tr.rank} className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-black text-xs">
                            #{tr.rank}
                          </span>
                          <div>
                            <p className="font-bold text-xs text-slate-900">{tr.name}</p>
                            <p className="text-[10px] text-slate-400">{tr.college}</p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-emerald-600">{tr.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex justify-between items-center gap-3">
                {selectedNotice.hasPdf && (
                  <span className="text-xs font-bold text-red-600 flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    Official Result Sheet Verified
                  </span>
                )}
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all shadow-sm"
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
