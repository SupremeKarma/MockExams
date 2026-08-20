'use client';

import { useState } from 'react';
import { examPatternsData } from '@/data/examPatternsData';
import type { Country, ExamCategory } from '@/data/examPatternsData';
import { Search, Filter, Calendar, Target, Clock } from 'lucide-react';

export default function ExamPatternsPage() {
  const [selectedCountry, setSelectedCountry] = useState<Country>('India');
  const [selectedCategory, setSelectedCategory] = useState<ExamCategory | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedExam, setExpandedExam] = useState<string | null>(null);

  const countries = ['India', 'Nepal'] as const;

  const categories: ExamCategory[] = [
    'Engineering Entrance',
    'Medical Entrance',
    'Management/MBA',
    'Civil Services & Government',
    'Law',
    'Undergraduate',
    'School Boards',
    'Professional Exams',
    'Research & PhD',
  ];

  const filteredExams = examPatternsData.filter((exam) => {
    const countryMatch = exam.country === selectedCountry;
    const categoryMatch = selectedCategory === 'All' || exam.category === selectedCategory;
    const searchMatch =
      exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.description.toLowerCase().includes(searchTerm.toLowerCase());
    return countryMatch && categoryMatch && searchMatch;
  });

  const groupedByCategory = filteredExams.reduce(
    (acc, exam) => {
      if (!acc[exam.category]) {
        acc[exam.category] = [];
      }
      acc[exam.category].push(exam);
      return acc;
    },
    {} as Record<ExamCategory, typeof examPatternsData>
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Hard':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Very Hard':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-white">
      {/* Header */}
      <div className="relative overflow-hidden pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 blur-3xl" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                <Target className="w-4 h-4" />
                Complete Exam Database
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Exam Patterns for India & Nepal
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive directory of entrance, competitive, and board exams. Start your prep today!
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-slate-200">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search exam by name, keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Country Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                <Filter className="w-4 h-4 inline mr-2" />
                Select Country
              </label>
              <div className="flex gap-3">
                {countries.map((country) => (
                  <button
                    key={country}
                    onClick={() => {
                      setSelectedCountry(country);
                      setSelectedCategory('All');
                    }}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                      selectedCountry === country
                        ? 'bg-blue-600 text-white shadow-md scale-105'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                <Filter className="w-4 h-4 inline mr-2" />
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ExamCategory | 'All')}
                className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 font-medium bg-white cursor-pointer"
              >
                <option value="All">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-8 flex items-center justify-between">
          <p className="text-lg font-semibold text-slate-700">
            Found <span className="text-blue-600 font-bold text-xl">{filteredExams.length}</span> exams
          </p>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => setSelectedCategory('All')}
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold underline"
            >
              Clear category filter
            </button>
          )}
        </div>

        {/* Exams Grid */}
        <div className="space-y-12">
          {Object.entries(groupedByCategory).length > 0 ? (
            Object.entries(groupedByCategory).map(([category, exams]) => (
              <div key={category}>
                <h2 className="text-2xl font-bold text-slate-800 mb-6 pb-3 border-b-4 border-blue-500 flex items-center gap-2">
                  {category}
                  <span className="text-sm font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full ml-auto">
                    {exams.length} exams
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {exams.map((exam) => (
                    <div
                      key={exam.id}
                      onClick={() =>
                        setExpandedExam(expandedExam === exam.id ? null : exam.id)
                      }
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border-l-4 border-blue-500 cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition">
                            {exam.name}
                          </h3>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                            {exam.fullName}
                          </p>
                        </div>
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold whitespace-nowrap">
                          {exam.country}
                        </span>
                      </div>

                      <p className="text-slate-700 text-sm mb-4 line-clamp-2 group-hover:line-clamp-none">
                        {exam.description}
                      </p>

                      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100">
                          <p className="text-xs text-slate-600 font-semibold">Marks</p>
                          <p className="text-lg font-bold text-blue-600">{exam.totalMarks}</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg border border-green-100">
                          <p className="text-xs text-slate-600 font-semibold">Duration</p>
                          <p className="text-xs font-bold text-green-600">{exam.duration}</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-100">
                          <p className="text-xs text-slate-600 font-semibold">Since</p>
                          <p className="text-lg font-bold text-purple-600">{exam.yearStarted}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-slate-600 font-semibold mb-2">Sections ({exam.sections.length})</p>
                        <div className="flex flex-wrap gap-2">
                          {exam.sections.slice(0, 2).map((section, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium border border-indigo-200"
                            >
                              {section}
                            </span>
                          ))}
                          {exam.sections.length > 2 && (
                            <span className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium border border-slate-200">
                              +{exam.sections.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                        <span
                          className={`px-3 py-1 rounded-full font-semibold text-xs border ${getDifficultyColor(
                            exam.difficulty
                          )}`}
                        >
                          {exam.difficulty}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {Math.floor(Math.random() * 5) + 1} lac+ students
                        </span>
                      </div>

                      {/* Expandable Section */}
                      {expandedExam === exam.id && (
                        <div className="mt-4 pt-4 border-t border-slate-200 space-y-3 animate-in fade-in">
                          <div>
                            <p className="text-xs font-semibold text-slate-600 mb-2">Target Students</p>
                            <p className="text-sm text-slate-700">{exam.targetStudents}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-600 mb-2">Key Topics</p>
                            <div className="flex flex-wrap gap-2">
                              {exam.syllabusTopics.slice(0, 4).map((topic, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs"
                                >
                                  {topic}
                                </span>
                              ))}
                              {exam.syllabusTopics.length > 4 && (
                                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                                  +{exam.syllabusTopics.length - 4}
                                </span>
                              )}
                            </div>
                          </div>
                          {exam.officialWebsite && (
                            <div>
                              <a
                                href={exam.officialWebsite}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:text-blue-700 font-semibold underline"
                              >
                                Visit Official Website →
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="inline-block mb-4 p-4 bg-slate-100 rounded-full">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-600 text-lg font-semibold">No exams found</p>
              <p className="text-slate-500 text-sm mt-2">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Stats Footer */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-bold">{examPatternsData.length}+</p>
              <p className="text-sm mt-2 text-blue-100">Total Exams</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold">
                {examPatternsData.filter((e) => e.country === 'India').length}
              </p>
              <p className="text-sm mt-2 text-blue-100">India Exams</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold">
                {examPatternsData.filter((e) => e.country === 'Nepal').length}
              </p>
              <p className="text-sm mt-2 text-blue-100">Nepal Exams</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold">{categories.length}</p>
              <p className="text-sm mt-2 text-blue-100">Categories</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
