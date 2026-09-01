/**
 * Draft marking rubrics for written questions.
 *
 *   npm run author-rubrics                    # dry run over untagged questions
 *   npm run author-rubrics -- --apply         # writes them
 *   npm run author-rubrics -- --exam <id>     # limit to one exam
 *   npm run author-rubrics -- --overwrite     # redo questions that already have one
 *
 * Dry run is the default. Rubrics are shown to students as "here is where your
 * marks went", and the grader feeds them to the model, so a wrong one misleads
 * twice over — read the output before applying it.
 *
 * A rubric whose criteria do not sum to the marks on offer is rejected rather
 * than written: a student following it could never reach full marks.
 */

import admin from "firebase-admin";
import fs from "fs";
import {
  authorRubric,
  rubricBalances,
  rubricSum,
  formatRubric,
  type Rubric,
} from "../src/lib/rubric-authoring";

const args = process.argv.slice(2);
const APPLY = args.includes("--apply");
const OVERWRITE = args.includes("--overwrite");
const EXAM_ID = args.includes("--exam") ? args[args.indexOf("--exam") + 1] : null;

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not set. Run via `npm run author-rubrics` so .env.local loads.");
  process.exit(1);
}

interface Candidate {
  id: string;
  questionText: string;
  modelAnswer: string;
  marks: number;
  topic: string | null;
}

async function main() {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(fs.readFileSync("serviceAccountKey.json", "utf8"))),
  });
  const db = admin.firestore();

  let query: FirebaseFirestore.Query = db.collection("questions").where("type", "==", "written");
  if (EXAM_ID) query = query.where("exam_id", "==", EXAM_ID);

  const candidates: Candidate[] = (await query.get()).docs
    .map((d) => ({ id: d.id, ...(d.data() as any) }))
    .filter((q) => q.model_answer && q.question_text)
    .filter((q) => OVERWRITE || !q.rubric)
    .map((q) => ({
      id: q.id,
      questionText: q.question_text,
      modelAnswer: q.model_answer,
      marks: Number(q.marks) || 0,
      topic: q.topic ?? null,
    }))
    // A question with no marks on offer has nothing to divide up.
    .filter((q) => q.marks > 0);

  console.log(`${candidates.length} written question(s) to rubric. ${APPLY ? "WRITING." : "Dry run."}\n`);
  if (candidates.length === 0) return;

  const drafted: { candidate: Candidate; rubric: Rubric; balanced: boolean }[] = [];

  for (const candidate of candidates) {
    try {
      const rubric = await authorRubric(apiKey!, {
        questionText: candidate.questionText,
        modelAnswer: candidate.modelAnswer,
        totalMarks: candidate.marks,
      });
      const balanced = rubricBalances(rubric);
      drafted.push({ candidate, rubric, balanced });

      console.log(
        `[${candidate.marks} marks] ${candidate.topic ?? "untagged"} — ${rubric.criteria.length} criteria, ` +
          `sums to ${rubricSum(rubric)}${balanced ? "" : "  ← DOES NOT BALANCE"}`
      );
      for (const c of rubric.criteria) {
        console.log(`    ${c.marks} - ${c.criterion}`);
      }
    } catch (err) {
      console.error(`  FAILED (${candidate.id}): ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  const balanced = drafted.filter((d) => d.balanced);
  const broken = drafted.filter((d) => !d.balanced);

  console.log(`\n${balanced.length} balanced, ${broken.length} rejected for not adding up.`);

  if (!APPLY) {
    console.log(`\nDry run — nothing written. Re-run with --apply to save ${balanced.length} rubrics.`);
    return;
  }

  if (balanced.length === 0) {
    console.log("Nothing balanced, so nothing written.");
    return;
  }

  const batch = db.batch();
  for (const d of balanced) {
    batch.update(db.collection("questions").doc(d.candidate.id), {
      rubric: formatRubric(d.rubric),
      rubric_authored_at: new Date().toISOString(),
    });
  }
  await batch.commit();

  console.log(`\nApplied ${balanced.length} rubrics. ${broken.length} left without one for a human to write.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
