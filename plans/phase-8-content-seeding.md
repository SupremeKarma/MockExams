# Phase 8 — Content & Database Seeding

---

## Task 8.1 — Signup creates Firestore doc ✅ (fixed in Phase 6)

After Phase 6 Task 6.5, all new signups write a proper `users/{uid}` document
with `displayName`, `role: "student"`, and `created_at`.

---

## Task 8.2 — Add resources collection seed data

**Priority:** 🔴 High (required for Notes page to show real content)
**File:** `supabase/seed-firestore.ts`

**Problem:**
After fixing the Notes page to read from Firestore (Phase 1 Bug 4),
the `resources` collection will be empty. Students will see a blank library.

**Fix — Add to the seed script:**

```ts
// Add this section to supabase/seed-firestore.ts

const resources = [
  {
    title: "IOE Entrance Preparation Guide 2081",
    author: "Er. Gopal Khanal",
    type: "Book",
    format: "PDF",
    category: "Engineering",
    subject: "IOE Entrance",
    rating: 4.8,
    downloadUrl: "", // add real URL or leave empty
    externalUrl: "https://ioe.edu.np",
    created_at: serverTimestamp(),
  },
  {
    title: "NEB Physics Grade 12 Notes",
    author: "Physics Department, JCC",
    type: "Notes",
    format: "PDF",
    category: "Physics",
    subject: "NEB Grade 12",
    rating: 4.6,
    downloadUrl: "",
    externalUrl: "",
    created_at: serverTimestamp(),
  },
  {
    title: "Mathematics Formula Sheet — IOE",
    author: "Er. Ram Prasad Sharma",
    type: "Notes",
    format: "PDF",
    category: "Mathematics",
    subject: "IOE Entrance",
    rating: 4.9,
    downloadUrl: "",
    externalUrl: "",
    created_at: serverTimestamp(),
  },
  {
    title: "NEB Chemistry Grade 12 — Past Papers 2075-2081",
    author: "NEB Archive",
    type: "Past Papers",
    format: "PDF",
    category: "Chemistry",
    subject: "NEB Grade 12",
    rating: 4.7,
    downloadUrl: "",
    externalUrl: "",
    created_at: serverTimestamp(),
  },
  {
    title: "Computer Science — IOE Syllabus Notes",
    author: "IOE Study Group",
    type: "Notes",
    format: "PDF",
    category: "Computer Science",
    subject: "IOE Entrance",
    rating: 4.4,
    downloadUrl: "",
    externalUrl: "",
    created_at: serverTimestamp(),
  },
];

// Write each resource
for (const resource of resources) {
  await adminDb.collection("resources").add(resource);
  console.log("Seeded resource:", resource.title);
}
```

**Run:**
```bash
npm run seed-firebase
```

---

## Task 8.3 — Expand IOE exam question bank

**Priority:** 🔴 High
**File:** `supabase/seed-firestore.ts`

**Problem:**
The current seed has only 10 questions for the IOE mock exam.
A realistic IOE entrance exam has 100 questions.
Students will finish in 5 minutes and the platform feels empty.

**Minimum viable:**
Expand to at least 40 questions following the IOE subject breakdown:
- Physics: 20 questions
- Chemistry: 10 questions
- Mathematics: 8 questions
- English: 2 questions

**IOE exam config to update:**
```ts
// Update the exam document
{
  id: "real-ioe-entrance",
  title: "IOE Entrance Model Exam 2081",
  duration_minutes: 120,
  totalQuestions: 40,       // update from 10
  negativeMarkingEnabled: true,
  defaultMarksPerQuestion: 1,
  defaultNegativeMarks: 0.25,
  passingScore: 40,
}
```

Add 30 more questions across the 4 subjects. Follow the existing question format:
```ts
{
  question_text: "...",
  option_a: "...",
  option_b: "...",
  option_c: "...",
  option_d: "...",
  correct_option: "a" | "b" | "c" | "d",
  explanation: "...",
  marks: 1,
  negativeMarks: 0.25,
  subject: "Physics" | "Chemistry" | "Mathematics" | "English",
}
```

---

## Task 8.4 — Add second full exam (NEB Physics)

**Priority:** 🟡 Medium
**File:** `supabase/seed-firestore.ts`

The `neb-physics-mastery` exam is referenced in the seed but has fewer than
10 questions. Expand it to 30 questions covering the NEB Grade 12 Physics
syllabus: Mechanics, Thermodynamics, Optics, Electricity, Modern Physics.

Update the exam document:
```ts
{
  id: "neb-physics-12",
  title: "NEB Grade 12 Physics Final Prep",
  duration_minutes: 90,
  totalQuestions: 30,
  negativeMarkingEnabled: false,   // NEB does not use negative marking
  defaultMarksPerQuestion: 1,
  passingScore: 40,
}
```
