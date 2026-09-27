import { BookOpen, Clock, FileText, Wrench } from "lucide-react";
import type { SubjectInfo } from "@/data/bitSyllabusData";

interface SyllabusViewProps {
  subject: SubjectInfo;
}

export function SyllabusView({ subject }: SyllabusViewProps) {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-200 pb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">{subject.name}</h1>
            <p className="text-lg text-zinc-600 mt-1">{subject.code}</p>
          </div>
          <div className="text-right space-y-1">
            <div className="inline-block bg-blue-50 px-3 py-1 rounded-lg">
              <p className="text-sm font-semibold text-blue-900">{subject.credits} Credits</p>
            </div>
            <div className="inline-block bg-green-50 px-3 py-1 rounded-lg ml-2">
              <p className="text-sm font-semibold text-green-900">{subject.type}</p>
            </div>
          </div>
        </div>
        <p className="text-base text-zinc-700 mt-4">{subject.description}</p>
      </div>

      {/* Key Units Overview */}
      {subject.keyUnits.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-zinc-900">Key Learning Units</h2>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <ul className="space-y-2">
              {subject.keyUnits.map((unit, idx) => (
                <li key={idx} className="flex gap-3 text-sm">
                  <span className="text-blue-600 font-semibold min-w-fit">Unit {idx + 1}:</span>
                  <span className="text-zinc-700">{unit}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Detailed Syllabus Units */}
      {subject.syllabusUnits && subject.syllabusUnits.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-zinc-900">Detailed Syllabus</h2>
          </div>
          <div className="space-y-6">
            {subject.syllabusUnits.map((unit, idx) => (
              <div
                key={idx}
                className="border border-zinc-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-lg font-semibold text-zinc-900">{unit.title}</h3>
                  <div className="flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-lg shrink-0">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-900">{unit.teachingHours}h</span>
                  </div>
                </div>

                {unit.subtopics && unit.subtopics.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-zinc-700 mb-2">Topics:</h4>
                    <ul className="space-y-1.5 ml-4">
                      {unit.subtopics.map((subtopic, sidx) => (
                        <li key={sidx} className="flex gap-2 text-sm text-zinc-700">
                          <span className="text-zinc-400 mt-1">•</span>
                          <span>{subtopic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Lab Work */}
      {subject.labWork && subject.labWork.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Wrench className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-zinc-900">Lab Work & Practical Activities</h2>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <ul className="space-y-2">
              {subject.labWork.map((activity, idx) => (
                <li key={idx} className="flex gap-3 text-sm">
                  <span className="text-purple-600 font-bold min-w-fit">{idx + 1}.</span>
                  <span className="text-zinc-700">{activity}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Reference Books */}
      {subject.referenceBooks && subject.referenceBooks.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">Recommended References</h2>
          <div className="space-y-2">
            {subject.referenceBooks.map((book, idx) => (
              <div key={idx} className="border-l-4 border-primary-600 bg-zinc-50 p-4 rounded">
                <p className="text-sm text-zinc-800">{book}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
