/**
 * Firestore rules tests for the ExamAI collections.
 *
 * Run with: npm run test:rules
 * (starts the Firestore emulator, runs the rules suites, shuts it down)
 *
 * The property these protect is narrow and important: a student must never be
 * able to read a paper that is not `published`. Every other status is work in
 * progress — `extracted` is raw OCR nobody has checked, and `review` holds
 * solutions whose numericals may not verify. A student revising from an
 * unverified answer loses the marks twice: once for the wrong method, and once
 * for having practised it.
 *
 * The subcollection case is the one worth testing hardest. A question's
 * readability depends on its PARENT's status, which means the rule has to
 * `get()` the paper — and a rule that reads the wrong document fails open,
 * silently, with no error anywhere.
 */

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { readFileSync } from "fs";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";

const PROJECT_ID = "mockexams-rules-test";

const STUDENT = "student-alice";
const EXAMINER = "examiner-carol";
const ADMIN = "admin-dave";

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync("firestore.rules", "utf8"),
      host: "127.0.0.1",
      port: 8080,
    },
  });
});

afterAll(async () => {
  await testEnv?.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();

  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();

    // The rules resolve a caller's role by reading users/{uid}, so these must
    // exist before any assertion runs.
    await setDoc(doc(db, "users", STUDENT), { email: "alice@example.com", role: "student" });
    await setDoc(doc(db, "users", EXAMINER), { email: "carol@example.com", role: "examiner" });
    await setDoc(doc(db, "users", ADMIN), { email: "dave@example.com", role: "admin" });

    await setDoc(doc(db, "programs", "BIT"), {
      id: "BIT",
      name: "Bachelor in Information Technology",
      university: "Purbanchal University",
      semesters: 8,
    });

    await setDoc(doc(db, "courses", "BIT351CO"), {
      code: "BIT351CO",
      name: "Artificial Intelligence",
      semester: 6,
      programId: "BIT",
      syllabusUnits: [{ unitId: "BIT351CO_U01", title: "Introduction" }],
    });

    for (const [id, status] of [
      ["BIT351CO_2025_regular", "published"],
      ["BIT351CO_2026_regular", "review"],
      ["BIT352CO_2025_regular", "extracted"],
      ["BIT353CO_2025_regular", "failed"],
    ] as const) {
      await setDoc(doc(db, "papers", id), {
        paperId: id,
        courseId: id.slice(0, 8),
        year: 2025,
        status,
        imagePaths: [`papers/${id}/original/000.jpg`],
      });
      await setDoc(doc(db, "papers", id, "questions", "A1"), {
        qId: "A1",
        group: "A",
        number: "1",
        textExact: "Define agent.",
        type: "theory",
        marks: 12,
      });
    }

    await setDoc(doc(db, "jobs", "BIT351CO_2025_regular__extract"), {
      jobId: "BIT351CO_2025_regular__extract",
      paperId: "BIT351CO_2025_regular",
      stage: "extract",
      status: "succeeded",
      logs: [{ at: "2026-01-01T00:00:00Z", level: "info", message: "ok" }],
    });

    await setDoc(doc(db, "topicStats", "BIT351CO"), {
      courseId: "BIT351CO",
      topics: { "search algorithms": { count: 3, years: [2024, 2025], totalMarks: 32 } },
    });
  });
});

function as(uid: string | null) {
  return uid === null
    ? testEnv.unauthenticatedContext().firestore()
    : testEnv.authenticatedContext(uid).firestore();
}

describe("papers", () => {
  it("lets anyone read a published paper", async () => {
    await assertSucceeds(getDoc(doc(as(STUDENT), "papers", "BIT351CO_2025_regular")));
    await assertSucceeds(getDoc(doc(as(null), "papers", "BIT351CO_2025_regular")));
  });

  it("hides papers still in review from students", async () => {
    await assertFails(getDoc(doc(as(STUDENT), "papers", "BIT351CO_2026_regular")));
  });

  it("hides freshly extracted papers from students", async () => {
    // Raw OCR nobody has checked. This is the state the whole review step exists for.
    await assertFails(getDoc(doc(as(STUDENT), "papers", "BIT352CO_2025_regular")));
  });

  it("hides failed papers from students", async () => {
    await assertFails(getDoc(doc(as(STUDENT), "papers", "BIT353CO_2025_regular")));
  });

  it("lets staff read papers at any status", async () => {
    await assertSucceeds(getDoc(doc(as(EXAMINER), "papers", "BIT352CO_2025_regular")));
    await assertSucceeds(getDoc(doc(as(ADMIN), "papers", "BIT353CO_2025_regular")));
  });

  it("refuses every client write, including from an admin", async () => {
    // Papers are written only through the Admin SDK, which bypasses rules.
    // There is no client write path, so there is none to get wrong.
    await assertFails(
      setDoc(doc(as(ADMIN), "papers", "BIT351CO_2025_regular"), { status: "published" })
    );
    await assertFails(
      setDoc(doc(as(STUDENT), "papers", "BIT999CO_2025_regular"), { status: "published" })
    );
  });

  it("stops a student flipping a paper to published", async () => {
    await assertFails(
      setDoc(doc(as(STUDENT), "papers", "BIT352CO_2025_regular"), { status: "published" })
    );
  });
});

describe("paper questions", () => {
  it("lets a student read questions of a published paper", async () => {
    await assertSucceeds(
      getDoc(doc(as(STUDENT), "papers", "BIT351CO_2025_regular", "questions", "A1"))
    );
  });

  it("hides questions of an unpublished paper even though the question itself looks harmless", async () => {
    // The question document carries no status of its own — its readability
    // comes from the parent. A rule reading the wrong document fails open here.
    await assertFails(
      getDoc(doc(as(STUDENT), "papers", "BIT352CO_2025_regular", "questions", "A1"))
    );
    await assertFails(
      getDoc(doc(as(STUDENT), "papers", "BIT351CO_2026_regular", "questions", "A1"))
    );
  });

  it("blocks listing questions of an unpublished paper", async () => {
    await assertFails(
      getDocs(collection(as(STUDENT), "papers", "BIT352CO_2025_regular", "questions"))
    );
  });

  it("lets staff read questions at any status", async () => {
    await assertSucceeds(
      getDoc(doc(as(EXAMINER), "papers", "BIT352CO_2025_regular", "questions", "A1"))
    );
  });

  it("refuses client writes to questions", async () => {
    await assertFails(
      setDoc(doc(as(ADMIN), "papers", "BIT351CO_2025_regular", "questions", "A1"), {
        reviewStatus: "approved",
      })
    );
  });
});

describe("jobs", () => {
  it("keeps ingestion logs staff-only", async () => {
    // Logs carry model errors and partial extraction output — internal detail.
    await assertFails(getDoc(doc(as(STUDENT), "jobs", "BIT351CO_2025_regular__extract")));
    await assertSucceeds(getDoc(doc(as(EXAMINER), "jobs", "BIT351CO_2025_regular__extract")));
  });

  it("refuses client writes", async () => {
    await assertFails(
      setDoc(doc(as(ADMIN), "jobs", "BIT351CO_2025_regular__extract"), { status: "succeeded" })
    );
  });
});

describe("courses, programs and topic stats", () => {
  it("are public to read — they are the syllabus the app already shows", async () => {
    await assertSucceeds(getDoc(doc(as(null), "courses", "BIT351CO")));
    await assertSucceeds(getDoc(doc(as(null), "programs", "BIT")));
    await assertSucceeds(getDoc(doc(as(null), "topicStats", "BIT351CO")));
  });

  it("are not client-writable", async () => {
    await assertFails(setDoc(doc(as(ADMIN), "courses", "BIT351CO"), { name: "Hacked" }));
    await assertFails(setDoc(doc(as(STUDENT), "topicStats", "BIT351CO"), { topics: {} }));
    await assertFails(setDoc(doc(as(ADMIN), "programs", "BIT"), { name: "Hacked" }));
  });
});
