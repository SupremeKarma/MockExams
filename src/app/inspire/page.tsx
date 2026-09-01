'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Quote,
  Share2,
  Heart,
  Sparkles,
  Sun,
  Copy,
  Check,
  Target,
  ArrowRight,
} from 'lucide-react';
import {
  inspirationData,
  categories,
  type InspirationCategory,
  type Personality,
} from '@/data/inspirationData';

const FAVORITES_KEY = 'mockexams_inspire_favorites';

function dayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function InspirePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<InspirationCategory | 'All'>('All');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {
      // ignore corrupt storage
    }
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      } catch {
        // storage unavailable, keep in-memory only
      }
      return next;
    });
  };

  const dailyPick = useMemo(() => {
    const idx = dayOfYear(new Date()) % inspirationData.length;
    return inspirationData[idx];
  }, []);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return inspirationData.filter((p) => {
      const categoryMatch = activeCategory === 'All' || p.category === activeCategory;
      if (!categoryMatch) return false;
      if (!term) return true;
      return (
        p.name.toLowerCase().includes(term) ||
        p.quote.toLowerCase().includes(term) ||
        p.field.toLowerCase().includes(term) ||
        p.tags.some((t) => t.toLowerCase().includes(term))
      );
    });
  }, [searchTerm, activeCategory]);

  const recommended = useMemo(() => {
    if (favorites.length === 0) return inspirationData.slice(0, 4);
    const favTags = new Set(
      inspirationData.filter((p) => favorites.includes(p.id)).flatMap((p) => p.tags)
    );
    return inspirationData
      .filter((p) => !favorites.includes(p.id))
      .map((p) => ({ p, score: p.tags.filter((t) => favTags.has(t)).length }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((x) => x.p);
  }, [favorites]);

  const handleShare = async (p: Personality) => {
    const text = `"${p.quote}" — ${p.name}`;
    if (navigator.share) {
      try {
        await navigator.share({ text, title: p.name });
        return;
      } catch {
        // user cancelled or share failed, fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(p.id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // clipboard unavailable, nothing more we can do silently
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="relative rounded-lg p-8 sm:p-12 overflow-hidden border border-zinc-200 bg-white shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-transparent to-purple-50 opacity-60" />
          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-primary-100 border border-primary-300 text-primary-700 text-xs font-bold uppercase tracking-widest w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              Inspire
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight leading-tight">
              Find your next spark
            </h1>
            <p className="text-base sm:text-lg text-zinc-600 leading-relaxed font-medium">
              Search personalities and quotes that keep students going — save the ones that hit
              home, and share them with a friend who needs it today.
            </p>
          </div>
        </div>

        {/* Daily motivation widget */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 sm:p-8 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-white/70 border border-amber-200 text-amber-600 shrink-0">
              <Sun className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-700">
                Today&apos;s Motivation
              </span>
              <p className="text-lg sm:text-xl font-bold text-zinc-900 leading-snug">
                &ldquo;{dailyPick.quote}&rdquo;
              </p>
              <p className="text-sm font-bold text-amber-700">— {dailyPick.name}, {dailyPick.field}</p>
            </div>
            <button
              onClick={() => handleShare(dailyPick)}
              className="shrink-0 p-2.5 rounded-lg bg-white border border-amber-200 text-amber-700 hover:bg-amber-100 transition-all"
              aria-label="Share today's motivation"
            >
              {copiedId === dailyPick.id ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>

        {/* Search + filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search personalities, quotes, or themes like &quot;discipline&quot;..."
              className="w-full pl-11 pr-4 py-3.5 rounded-lg border border-zinc-200 bg-white text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-4 py-2 rounded-md text-xs font-bold border transition-all ${
                activeCategory === 'All'
                  ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                  : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-4 py-2 rounded-md text-xs font-bold border transition-all ${
                  activeCategory === c
                    ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                    : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Personalized recommendations */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
              {favorites.length ? 'Picked for you' : 'Popular starting points'}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommended.map((p) => (
              <PersonalityCard
                key={p.id}
                person={p}
                compact
                isFavorite={favorites.includes(p.id)}
                onToggleFavorite={() => toggleFavorite(p.id)}
                onShare={() => handleShare(p)}
                copied={copiedId === p.id}
              />
            ))}
          </div>
        </div>

        {/* Exam pattern tracker teaser */}
        <Link href="/exam-patterns">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary-50 text-primary-600 border border-primary-100">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 text-sm">Know your exam pattern</h3>
                <p className="text-xs text-zinc-600 font-medium">
                  Browse patterns for engineering, medical, board, and government exams across India and Nepal.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-400 shrink-0" />
          </motion.div>
        </Link>

        {/* Full grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Quote className="w-4 h-4 text-primary-600" />
              <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                All personalities
              </h2>
            </div>
            <span className="text-xs font-bold text-zinc-400">{filtered.length} results</span>
          </div>

          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((p) => (
                  <PersonalityCard
                    key={p.id}
                    person={p}
                    isFavorite={favorites.includes(p.id)}
                    onToggleFavorite={() => toggleFavorite(p.id)}
                    onShare={() => handleShare(p)}
                    copied={copiedId === p.id}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-lg bg-white border border-dashed border-zinc-200">
                <p className="text-sm font-bold text-zinc-600">
                  No matches. Try a different name, theme, or category.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function PersonalityCard({
  person,
  isFavorite,
  onToggleFavorite,
  onShare,
  copied,
  compact = false,
}: {
  person: Personality;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onShare: () => void;
  copied: boolean;
  compact?: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="rounded-lg border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-all p-5 flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-lg bg-gradient-to-br ${person.color} flex items-center justify-center text-white text-sm font-bold shrink-0`}
          >
            {person.initials}
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 text-sm leading-tight">{person.name}</h3>
            <p className="text-[11px] text-zinc-500 font-bold">{person.field} · {person.era}</p>
          </div>
        </div>
        <button
          onClick={onToggleFavorite}
          className={`p-1.5 rounded-md transition-all ${
            isFavorite ? 'text-rose-500' : 'text-zinc-300 hover:text-rose-400'
          }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <p className="text-sm text-zinc-700 leading-relaxed italic flex-1">&ldquo;{person.quote}&rdquo;</p>

      {!compact && <p className="text-xs text-zinc-500 mt-3 leading-relaxed">{person.bio}</p>}

      <div className="flex flex-wrap gap-1.5 mt-3">
        {person.tags.slice(0, compact ? 2 : 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-md bg-zinc-50 border border-zinc-200 text-[10px] font-bold text-zinc-500"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          {person.category}
        </span>
        <button
          onClick={onShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-50 hover:bg-primary-50 hover:text-primary-600 text-zinc-600 text-[11px] font-bold border border-zinc-200 transition-all"
        >
          {copied ? <Copy className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Share'}
        </button>
      </div>
    </motion.div>
  );
}
