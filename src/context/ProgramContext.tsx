"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { academicTaxonomyData, AcademicNode } from "@/data/academicTaxonomyData";

// The program/faculty a student is currently browsing MockExams as. This is
// what the "University / Program" switcher in the navbar actually controls —
// previously it was decorative UI state with no effect on the app. Now it's
// global, persisted, and content pages (notes/syllabus/semester/projects/
// flashcards) gate their BIT-specific data behind it, so switching to a
// program we haven't built content for shows an honest "coming soon" state
// instead of silently leaking BIT content.
//
// Only Purbanchal University BIT has real content today. Add a program's id
// to CONTENT_AVAILABLE_PROGRAM_IDS below once its data is actually built.

export const CONTENT_AVAILABLE_PROGRAM_IDS = ["prog-bit"];

interface ProgramContextType {
  activeProgram: AcademicNode;
  setActiveProgramId: (id: string) => void;
  isContentAvailable: boolean;
  allPrograms: AcademicNode[];
}

const DEFAULT_PROGRAM_ID = "prog-bit";
const STORAGE_KEY = "mockexams-active-program";

const programs = academicTaxonomyData.filter((n) => n.nodeType === "program");

function resolveProgram(id: string | null): AcademicNode {
  return programs.find((p) => p.id === id) ?? programs.find((p) => p.id === DEFAULT_PROGRAM_ID) ?? programs[0];
}

const ProgramContext = createContext<ProgramContextType>({
  activeProgram: resolveProgram(DEFAULT_PROGRAM_ID),
  setActiveProgramId: () => {},
  isContentAvailable: true,
  allPrograms: programs,
});

export function ProgramProvider({ children }: { children: React.ReactNode }) {
  const [activeProgramId, setActiveProgramIdState] = useState(DEFAULT_PROGRAM_ID);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && programs.some((p) => p.id === stored)) {
      setActiveProgramIdState(stored);
    }
  }, []);

  const setActiveProgramId = (id: string) => {
    setActiveProgramIdState(id);
    window.localStorage.setItem(STORAGE_KEY, id);
  };

  const activeProgram = resolveProgram(activeProgramId);
  const isContentAvailable = CONTENT_AVAILABLE_PROGRAM_IDS.includes(activeProgram.id);

  return (
    <ProgramContext.Provider value={{ activeProgram, setActiveProgramId, isContentAvailable, allPrograms: programs }}>
      {children}
    </ProgramContext.Provider>
  );
}

export const useProgram = () => useContext(ProgramContext);
