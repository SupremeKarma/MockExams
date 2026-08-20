"use client";

import Link from "next/link";
import { CheckCircle, Clock, TrendingUp, BookOpen, FileText, Award } from "lucide-react";

interface DashboardCard {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  href?: string;
}

export const StudentDashboard = () => {
  const cards: DashboardCard[] = [
    {
      title: "Tests Completed",
      value: "12",
      subtitle: "This week",
      icon: <CheckCircle className="w-6 h-6" />,
      color: "green",
      href: "/exams",
    },
    {
      title: "Study Streak",
      value: "7 days",
      subtitle: "Keep it up!",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "blue",
      href: "/schedule",
    },
    {
      title: "Topics Mastered",
      value: "8",
      subtitle: "Out of 24",
      icon: <Award className="w-6 h-6" />,
      color: "purple",
      href: "/learn",
    },
    {
      title: "Time Spent",
      value: "12.5h",
      subtitle: "This week",
      icon: <Clock className="w-6 h-6" />,
      color: "amber",
      href: "/schedule",
    },
  ];

  const recentExams = [
    { title: "DBMS Final", score: 87, total: 100, date: "Today" },
    { title: "Data Structures", score: 92, total: 100, date: "Yesterday" },
    { title: "Algorithms", score: 78, total: 100, date: "2 days ago" },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <Link href={card.href || "#"} key={idx}>
            <div className="card-interactive p-6 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${
                  card.color === "green" ? "bg-green-100 text-green-600" :
                  card.color === "blue" ? "bg-blue-100 text-blue-600" :
                  card.color === "purple" ? "bg-purple-100 text-purple-600" :
                  "bg-amber-100 text-amber-600"
                }`}>
                  {card.icon}
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium">{card.title}</h3>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                {card.subtitle && (
                  <span className="text-xs text-gray-500">{card.subtitle}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Exams & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Exams */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Recent Attempts
            </h2>
            <div className="space-y-3">
              {recentExams.map((exam, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">{exam.title}</p>
                    <p className="text-xs text-gray-500">{exam.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{exam.score}/{exam.total}</p>
                    <p className="text-xs text-green-600">{Math.round((exam.score/exam.total)*100)}%</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/exams" className="mt-4 inline-block text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All Attempts →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <div className="card bg-blue-50 border-blue-200 cursor-pointer hover:shadow-md">
            <BookOpen className="w-5 h-5 text-blue-600 mb-2" />
            <h3 className="font-bold text-gray-900">Start Practice</h3>
            <p className="text-sm text-gray-600 mt-1">6 exams available</p>
          </div>
          <div className="card bg-green-50 border-green-200 cursor-pointer hover:shadow-md">
            <TrendingUp className="w-5 h-5 text-green-600 mb-2" />
            <h3 className="font-bold text-gray-900">View Progress</h3>
            <p className="text-sm text-gray-600 mt-1">See your improvement</p>
          </div>
          <div className="card bg-purple-50 border-purple-200 cursor-pointer hover:shadow-md">
            <Award className="w-5 h-5 text-purple-600 mb-2" />
            <h3 className="font-bold text-gray-900">Achievements</h3>
            <p className="text-sm text-gray-600 mt-1">3 new badges earned</p>
          </div>
        </div>
      </div>

      {/* Study Recommendations */}
      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recommended for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Database Indexing", difficulty: "Advanced", urgency: "High" },
            { title: "Graph Algorithms", difficulty: "Hard", urgency: "Medium" },
          ].map((item, idx) => (
            <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">{item.title}</h3>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  item.urgency === "High" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {item.urgency}
                </span>
              </div>
              <p className="text-sm text-gray-600">Difficulty: {item.difficulty}</p>
              <button className="mt-3 w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
                Start Revision
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
