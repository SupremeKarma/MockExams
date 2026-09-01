/**
 * Firestore security rules tests.
 *
 * Run with: npm run test:rules
 * (starts the Firestore emulator, runs this file, shuts the emulator down)
 *
 * These cover the holes closed in the P0 lockdown:
 *   - exam_attempts had no matching rule and fell through to a permissive
 *     catch-all, so any signed-in user could read everyone's answers
 *   - users could set their own `role` and `subscription`, granting themselves
 *     admin or Pro from the browser console
 *   - questions (including correct_option) were world-readable
 */

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { readFileSync } from "fs";
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where } from "firebase/firestore";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";

const PROJECT_ID = "mockexams-rules-test";

const STUDENT = "student-alice";
const OTHER_STUDENT = "student-bob";
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

  // Seed roles and fixtures with rules bypassed. The rules resolve a caller's
  // role by reading users/{uid}, so these documents must exist first.
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, "users", STUDENT), { email: "alice@example.com", role: "student" });
    await setDoc(doc(db, "users", OTHER_STUDENT), { email: "bob@example.com", role: "student" });
    await setDoc(doc(db, "users", EXAMINER), { email: "carol@example.com", role: "examiner" });
    await setDoc(doc(db, "users", ADMIN), { email: "dave@example.com", role: "admin" });

    await setDoc(doc(db, "questions", "q1"), {
      exam_id: "exam1",
      question_text: "What is a B-tree?",
      correct_option: "c",
      model_answer: "A self-balancing tree...",
    });

    await setDoc(doc(db, "exam_attempts", "attempt-alice"), {
      user_id: STUDENT,
      exam_id: "exam1",
      score: 4,
      percentage: 40,
    });

    await setDoc(doc(db, "entitlements", STUDENT), { plan: "free", credits: 20 });

    await setDoc(doc(db, "solved_papers", "paper-alice"), {
      user_id: STUDENT,
      source: "dbms-2024.pdf",
      questions: [{ number: "1", answer: "..." }],
    });

    await setDoc(doc(db, "notes", "note-approved"), {
      subject_code: "BIT353CO",
      name: "Association Rule Mining",
      status: "approved",
    });

    await setDoc(doc(db, "notes", "note-draft"), {
      subject_code: "BIT353CO",
      name: "Cluster Analysis",
      status: "draft",
    });

    await setDoc(doc(db, "certificates", "cert-alice"), {
      user_id: STUDENT,
      code: "MX-ABCD-2345",
      exam_title: "Data Structures",
      percentage: 92,
    });

    await setDoc(doc(db, "bookmarks", `${STUDENT}_q1`), {
      user_id: STUDENT,
      question_id: "q1",
      exam_id: "exam1",
    });

    await setDoc(doc(db, "exam_sessions", "session-alice"), {
      user_id: STUDENT,
      exam_id: "exam1",
      option_maps: { q1: ["c", "a", "d", "b"] },
      submitted: false,
    });

    await setDoc(doc(db, "practice_sessions", "practice-alice"), {
      user_id: STUDENT,
      score: 3,
      percentage: 30,
    });
  });
});

const asStudent = () => testEnv.authenticatedContext(STUDENT).firestore();
const asOtherStudent = () => testEnv.authenticatedContext(OTHER_STUDENT).firestore();
const asExaminer = () => testEnv.authenticatedContext(EXAMINER).firestore();
const asAdmin = () => testEnv.authenticatedContext(ADMIN).firestore();
const asAnon = () => testEnv.unauthenticatedContext().firestore();

describe("exam_attempts", () => {
  it("lets a student read their own attempt", async () => {
    await assertSucceeds(getDoc(doc(asStudent(), "exam_attempts", "attempt-alice")));
  });

  it("stops a student reading another student's attempt", async () => {
    await assertFails(getDoc(doc(asOtherStudent(), "exam_attempts", "attempt-alice")));
  });

  it("stops a student listing all attempts", async () => {
    await assertFails(getDocs(collection(asOtherStudent(), "exam_attempts")));
  });

  it("allows a student's own-attempts query", async () => {
    await assertSucceeds(
      getDocs(query(collection(asStudent(), "exam_attempts"), where("user_id", "==", STUDENT)))
    );
  });

  it("stops a student forging a score", async () => {
    await assertFails(
      setDoc(doc(asStudent(), "exam_attempts", "forged"), {
        user_id: STUDENT,
        exam_id: "exam1",
        score: 100,
        percentage: 100,
      })
    );
  });

  it("stops a student editing their own score after the fact", async () => {
    await assertFails(updateDoc(doc(asStudent(), "exam_attempts", "attempt-alice"), { percentage: 100 }));
  });

  it("lets staff read any attempt (for grading)", async () => {
    await assertSucceeds(getDoc(doc(asExaminer(), "exam_attempts", "attempt-alice")));
  });

  it("lets an examiner attach teacher feedback", async () => {
    await assertSucceeds(
      updateDoc(doc(asExaminer(), "exam_attempts", "attempt-alice"), { teacherReviewed: true })
    );
  });
});

describe("solved_papers", () => {
  it("lets the uploader read their own solved paper", async () => {
    await assertSucceeds(getDoc(doc(asStudent(), "solved_papers", "paper-alice")));
  });

  it("keeps one student's uploaded paper away from another", async () => {
    await assertFails(getDoc(doc(asOtherStudent(), "solved_papers", "paper-alice")));
    await assertFails(getDoc(doc(asAnon(), "solved_papers", "paper-alice")));
  });

  it("stops a student writing solutions directly", async () => {
    // Solving is paid for in credits and done server-side; a client write
    // would bypass both.
    await assertFails(
      setDoc(doc(asStudent(), "solved_papers", "forged"), { user_id: STUDENT, questions: [] })
    );
  });
});

describe("notes", () => {
  it("lets anyone read an approved note", async () => {
    await assertSucceeds(getDoc(doc(asAnon(), "notes", "note-approved")));
  });

  it("hides an unreviewed draft from students", async () => {
    // A wrong note costs marks, so nothing unreviewed reaches a student.
    await assertFails(getDoc(doc(asStudent(), "notes", "note-draft")));
    await assertFails(getDoc(doc(asAnon(), "notes", "note-draft")));
  });

  it("lets staff read drafts so they can review them", async () => {
    await assertSucceeds(getDoc(doc(asExaminer(), "notes", "note-draft")));
  });

  it("stops a student writing or approving notes", async () => {
    await assertFails(setDoc(doc(asStudent(), "notes", "forged"), { status: "approved" }));
    await assertFails(updateDoc(doc(asStudent(), "notes", "note-draft"), { status: "approved" }));
  });

  it("lets staff approve a draft", async () => {
    await assertSucceeds(updateDoc(doc(asExaminer(), "notes", "note-draft"), { status: "approved" }));
  });
});

describe("certificates", () => {
  it("lets a holder read their own certificate", async () => {
    await assertSucceeds(getDoc(doc(asStudent(), "certificates", "cert-alice")));
  });

  it("stops a student reading someone else's certificate", async () => {
    await assertFails(getDoc(doc(asOtherStudent(), "certificates", "cert-alice")));
  });

  it("stops a student minting a certificate", async () => {
    await assertFails(
      setDoc(doc(asStudent(), "certificates", "forged"), {
        user_id: STUDENT,
        code: "MX-FAKE-9999",
        percentage: 100,
      })
    );
  });

  it("stops a student editing the score on their certificate", async () => {
    await assertFails(updateDoc(doc(asStudent(), "certificates", "cert-alice"), { percentage: 100 }));
  });
});

describe("bookmarks", () => {
  it("lets a student read their own bookmark", async () => {
    await assertSucceeds(getDoc(doc(asStudent(), "bookmarks", `${STUDENT}_q1`)));
  });

  it("stops a student reading someone else's bookmarks", async () => {
    await assertFails(getDoc(doc(asOtherStudent(), "bookmarks", `${STUDENT}_q1`)));
  });

  it("stops direct client writes (they go through the API)", async () => {
    await assertFails(
      setDoc(doc(asStudent(), "bookmarks", `${STUDENT}_q2`), {
        user_id: STUDENT,
        question_id: "q2",
      })
    );
  });
});

describe("exam_sessions", () => {
  it("stops a student reading their own session's option shuffle", async () => {
    // The shuffle map is half the answer key, so even the owner cannot read it.
    await assertFails(getDoc(doc(asStudent(), "exam_sessions", "session-alice")));
  });

  it("stops a student rewriting the shuffle map", async () => {
    await assertFails(
      updateDoc(doc(asStudent(), "exam_sessions", "session-alice"), {
        option_maps: { q1: ["a", "b", "c", "d"] },
      })
    );
  });

  it("stops a student reopening a submitted session", async () => {
    await assertFails(
      updateDoc(doc(asStudent(), "exam_sessions", "session-alice"), { submitted: false })
    );
  });

  it("lets staff read sessions for review", async () => {
    await assertSucceeds(getDoc(doc(asExaminer(), "exam_sessions", "session-alice")));
  });
});

describe("practice_sessions", () => {
  it("lets a student read their own session", async () => {
    await assertSucceeds(getDoc(doc(asStudent(), "practice_sessions", "practice-alice")));
  });

  it("stops a student reading someone else's session", async () => {
    await assertFails(getDoc(doc(asOtherStudent(), "practice_sessions", "practice-alice")));
  });

  it("stops a student writing their own practice score", async () => {
    await assertFails(
      setDoc(doc(asStudent(), "practice_sessions", "forged"), {
        user_id: STUDENT,
        score: 100,
        percentage: 100,
      })
    );
  });
});

describe("entitlements", () => {
  it("lets a user read their own entitlement", async () => {
    await assertSucceeds(getDoc(doc(asStudent(), "entitlements", STUDENT)));
  });

  it("stops a user reading someone else's entitlement", async () => {
    await assertFails(getDoc(doc(asOtherStudent(), "entitlements", STUDENT)));
  });

  it("stops a user granting themselves Pro", async () => {
    await assertFails(updateDoc(doc(asStudent(), "entitlements", STUDENT), { plan: "pro" }));
  });

  it("stops a user minting credits", async () => {
    await assertFails(updateDoc(doc(asStudent(), "entitlements", STUDENT), { credits: 99999 }));
  });

  it("stops even an admin writing entitlements from the client", async () => {
    // Only the Admin SDK (which bypasses rules) may write these.
    await assertFails(updateDoc(doc(asAdmin(), "entitlements", STUDENT), { plan: "pro" }));
  });
});

describe("users", () => {
  it("lets a student edit their own profile", async () => {
    await assertSucceeds(updateDoc(doc(asStudent(), "users", STUDENT), { displayName: "Alice" }));
  });

  it("stops a student promoting themselves to admin", async () => {
    await assertFails(updateDoc(doc(asStudent(), "users", STUDENT), { role: "admin" }));
  });

  it("stops a student granting themselves a subscription", async () => {
    await assertFails(updateDoc(doc(asStudent(), "users", STUDENT), { subscription: "pro" }));
  });

  it("stops a student editing another user", async () => {
    await assertFails(updateDoc(doc(asOtherStudent(), "users", STUDENT), { displayName: "hacked" }));
  });

  it("lets an admin change a user's role", async () => {
    await assertSucceeds(updateDoc(doc(asAdmin(), "users", STUDENT), { role: "examiner" }));
  });

  it("stops signup creating a privileged account", async () => {
    const newUser = "student-eve";
    const db = testEnv.authenticatedContext(newUser).firestore();
    await assertFails(setDoc(doc(db, "users", newUser), { email: "eve@example.com", role: "admin" }));
  });

  it("allows an ordinary signup", async () => {
    const newUser = "student-eve";
    const db = testEnv.authenticatedContext(newUser).firestore();
    await assertSucceeds(setDoc(doc(db, "users", newUser), { email: "eve@example.com", role: "student" }));
  });
});

describe("questions (answer key)", () => {
  it("stops a student reading a question directly", async () => {
    await assertFails(getDoc(doc(asStudent(), "questions", "q1")));
  });

  it("stops an anonymous visitor scraping the question bank", async () => {
    await assertFails(getDocs(collection(asAnon(), "questions")));
  });

  it("lets staff read questions for authoring", async () => {
    await assertSucceeds(getDoc(doc(asExaminer(), "questions", "q1")));
  });

  it("stops a student writing questions", async () => {
    await assertFails(setDoc(doc(asStudent(), "questions", "q2"), { question_text: "x" }));
  });
});

describe("leaderboard", () => {
  it("is publicly readable", async () => {
    await assertSucceeds(getDocs(collection(asAnon(), "leaderboard")));
  });

  it("cannot be written from the client", async () => {
    await assertFails(
      setDoc(doc(asStudent(), "leaderboard", "fake"), { user_id: STUDENT, percentage: 100 })
    );
  });
});

describe("deny by default", () => {
  it("denies reads on a collection with no explicit rule", async () => {
    await assertFails(getDoc(doc(asStudent(), "payment_transactions", "tx1")));
  });

  it("denies writes on a collection with no explicit rule", async () => {
    await assertFails(setDoc(doc(asStudent(), "some_future_collection", "x"), { a: 1 }));
  });
});
