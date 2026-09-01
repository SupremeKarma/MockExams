"use client";

import { useProgram } from "@/context/ProgramContext";
import { Compass, Bell } from "lucide-react";

// Wrap any BIT-specific content page's body in this. If the student has
// switched to a program we haven't built content for yet, they see an
// honest "coming soon" state instead of BIT content leaking through under
// a different program's name.
export default function ProgramGate({ children }: { children: React.ReactNode }) {
  const { activeProgram, isContentAvailable, setActiveProgramId, allPrograms } = useProgram();

  if (isContentAvailable) return <>{children}</>;

  const bit = allPrograms.find((p) => p.id === "prog-bit");

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-lg border border-zinc-200 p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-md bg-primary-50 flex items-center justify-center mx-auto">
          <Compass className="w-6 h-6 text-primary-600" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-lg font-bold text-zinc-900">
            {activeProgram.shortTitle} content is coming soon
          </h2>
          <p className="text-sm text-zinc-500 leading-relaxed">
            We&apos;re still building out notes, syllabus, and past papers for{" "}
            <span className="font-semibold text-zinc-700">{activeProgram.title}</span>. Purbanchal
            University BIT is fully live today.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 justify-center pt-1">
          {bit && (
            <button
              onClick={() => setActiveProgramId(bit.id)}
              className="px-4 py-2.5 rounded-md bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors shadow-button"
            >
              Switch to {bit.shortTitle}
            </button>
          )}
          <button
            className="px-4 py-2.5 rounded-md bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <Bell className="w-3.5 h-3.5" />
            Notify me when ready
          </button>
        </div>
      </div>
    </div>
  );
}
