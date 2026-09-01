"""Phase 3: generate a worked solution and a marking scheme per question.

    python generate_solutions.py --paper BIT351CO_2025_regular   # one paper
    python generate_solutions.py --semester 6                    # all sem-6
    python generate_solutions.py --paper X --force               # regenerate

Writes `solutions/<SUBJECT>/<YEAR>/<question_id>.md` and records
`solution_path` + `marking_scheme` back onto the question in
work/extracted/<paper_id>.json.

Two design rules from the plan, both load-bearing:

  * The marking scheme is a CHECKLIST, not a model answer — key points with
    the marks each carries. That is how examiners actually mark, and it is
    what makes a solution usable for self-assessment: you check which points
    you would have hit, instead of comparing your prose to someone else's.
  * Answers are sized to the mark weighting. A 12-mark Group A question and an
    8-mark Group B question are not the same answer at different lengths.

Numerical questions get full worked steps, every line shown. The plan's
variant-generation idea is a later enhancement on top of these same
questions — a worked Poker test is what a student needs the week before the
exam; a variant generator is what they need the month after.

Nothing here publishes. Every generated question is left needs_review=true:
these are model-written answers, and reviewing them by hand is both the
quality gate and the revision.
"""

import argparse
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from src.config import (  # noqa: E402
    GENERATION_PROVIDER, GENERATION_MODEL, api_key_for,
)
from src.llm import TextRequest, ProviderError, get_provider  # noqa: E402

HERE = Path(__file__).parent
EXTRACTED = HERE / "work" / "extracted"
SOLUTIONS = HERE.parent / "solutions"

SYSTEM = """You write worked solutions for Purbanchal University BIT exam
questions, for a student revising from past papers.

Return your answer in exactly this shape, with no preamble:

<solution>
(the worked solution, in markdown)
</solution>
<marking_scheme>
- [2] states f(n) = g(n) + h(n) and identifies both terms
- [1] names the open and closed lists
</marking_scheme>

Each marking-scheme line is "- [marks] point". Append "(optional)" only for
genuine alternatives ("any four of the following").

Do NOT return JSON. Worked mathematics is full of backslashes and JSON string
escaping mangles them — this format exists so you can write LaTeX freely.

SIZE THE ANSWER TO THE MARKS
- The question's marks tell you the expected depth. Roughly one substantive
  point per 2 marks. A 12-mark question wants structure — definition, body,
  example, and a closing comparison or evaluation. An 8-mark question wants
  the core content without padding. Do not write the same answer longer.

NUMERICAL QUESTIONS
- Show EVERY step of the working, including the arithmetic. State formulas
  before applying them, substitute the actual numbers, and give the final
  answer with units. State any assumption you make explicitly.
- For proofs and puzzles, show the reasoning that leads to each deduction, not
  just the result. A student cannot learn from an answer that only asserts.

THE MARKING SCHEME IS A CHECKLIST, NOT A SUMMARY
- List the specific points an examiner awards marks for, with the marks each
  carries. The marks MUST sum exactly to the question's total.
- Write points as things a script either contains or does not: "states
  f(n) = g(n) + h(n) and identifies both terms" — not "understands A*".
- Mark a point "(optional)" only for genuine alternatives ("any four of the
  following"); the sum rule is then relaxed.

FORMAT
- The solution is GitHub-flavoured markdown. Use headings sparingly,
  prefer short paragraphs and lists. Use LaTeX ($...$) only for real
  mathematics. Diagrams: describe them in words; do not attempt ASCII art
  unless the shape genuinely carries the meaning.
- Write in plain, direct English. This is study material, not a textbook
  chapter: no throat-clearing, no "in this answer we will discuss"."""


def parse_response(text: str):
    """Pull the solution and marking scheme out of the delimited response.

    Deliberately not JSON. Worked mathematics is full of backslashes, and JSON
    string escaping turned a LaTeX fraction into "Invalid \\escape" — a parse
    error that reads as a model failure when it is really a container failure.
    A delimited format lets the model write LaTeX freely.
    """
    sol = re.search(r"<solution>(.*?)</solution>", text, re.S)
    if sol:
        body = sol.group(1).strip()
    elif "<solution>" in text:
        # Opening tag but no closing one: the response was cut off, almost
        # always because a long worked calculation ran past max_tokens.
        # Returning "no solution" here would blame the model for a limit we
        # set, so say what actually happened.
        return "__TRUNCATED__", []
    else:
        return None, []

    scheme = []
    block = re.search(r"<marking_scheme>(.*?)</marking_scheme>", text, re.S)
    if block:
        line_re = re.compile(r"^\s*[-*]\s*\[\s*(\d+(?:\.\d+)?)\s*\]\s*(.+)$")
        for line in block.group(1).splitlines():
            m = line_re.match(line)
            if not m:
                continue
            point = m.group(2).strip()
            optional = point.lower().endswith("(optional)")
            if optional:
                point = point[: -len("(optional)")].strip()
            raw_marks = m.group(1)
            scheme.append({
                "point": point,
                "marks": float(raw_marks) if "." in raw_marks else int(raw_marks),
                "required": not optional,
            })
    return body, scheme


def target_questions(paper: dict):
    """Questions that get their own solution file.

    One file per TOP-LEVEL question, covering its sub-parts, because that is
    the unit a student answers in the exam and the unit the marks are stated
    against.
    """
    return [q for q in paper.get("questions", []) if isinstance(q, dict)]


def build_prompt(paper: dict, q: dict) -> str:
    parts = []
    for sub in q.get("sub_parts") or []:
        if isinstance(sub, dict):
            mk = f" [{sub.get('marks')} marks]" if sub.get("marks") else ""
            parts.append(f"  ({sub.get('number')}) {sub.get('text')}{mk}")
    sub_block = ("\nSub-parts:\n" + "\n".join(parts)) if parts else ""

    choose = q.get("choose")
    choose_note = (
        f"\nNOTE: the candidate answers any {choose} of the options above. "
        f"Write a solution for EACH option, clearly separated."
        if choose else ""
    )

    units = ", ".join(t.get("unit_id", "") for t in (q.get("units") or []))
    return (
        f"Subject: {paper.get('subject_code')} {paper.get('subject_name')} "
        f"(semester {paper.get('semester')}, {paper.get('year')} exam)\n"
        f"Syllabus unit(s): {units or 'not tagged'}\n"
        f"Group {q.get('group')}, question {q.get('number')}, "
        f"{q.get('marks')} marks, type: {q.get('question_type')}\n\n"
        f"Question:\n{q.get('text') or '(see sub-parts)'}"
        f"{sub_block}{choose_note}\n"
    )


def solution_path(paper: dict, q: dict) -> Path:
    return (SOLUTIONS / paper["subject_code"] / str(paper["year"])
            / f"{q['question_id']}.md")


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser()
    ap.add_argument("--paper")
    ap.add_argument("--semester", type=int)
    ap.add_argument("--limit", type=int, help="stop after N questions")
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()

    paths = sorted(EXTRACTED.glob("*.json"))
    if args.paper:
        paths = [p for p in paths if p.stem == args.paper]
    if not paths:
        print("no matching papers")
        return 1

    try:
        provider = get_provider(
            GENERATION_PROVIDER, api_key_for(GENERATION_PROVIDER),
            GENERATION_MODEL, need="text",
        )
    except (ProviderError, ValueError) as e:
        print(f"ERROR: {e}")
        return 1

    print(f"generating via {GENERATION_PROVIDER}/{GENERATION_MODEL}\n")
    written = skipped = failed = 0

    for path in paths:
        paper = json.loads(path.read_text(encoding="utf-8"))
        if args.semester and paper.get("semester") != args.semester:
            continue
        print(f"{paper['paper_id']}")
        dirty = False

        for q in target_questions(paper):
            if args.limit and written >= args.limit:
                break
            out = solution_path(paper, q)
            if out.exists() and not args.force:
                skipped += 1
                continue

            try:
                resp = provider.complete_text(TextRequest(
                    system=SYSTEM,
                    text=build_prompt(paper, q),
                    # Worked calculations are long; a truncated solution is
                    # worse than none because it stops mid-derivation.
                    max_tokens=24000,
                    json_only=False,
                ))
            except ProviderError as e:
                print(f"   {q['question_id']}: FAILED — {e}")
                failed += 1
                continue

            body, scheme = parse_response(resp.text)
            if body == "__TRUNCATED__":
                print(f"   {q['question_id']}: response truncated at "
                      f"{resp.usage.get('output_tokens')} output tokens "
                      f"(finish={resp.usage.get('finish_reason')}) — raise "
                      f"max_tokens for this question")
                failed += 1
                continue
            if body is None:
                print(f"   {q['question_id']}: no <solution> block in response")
                failed += 1
                continue
            if not body:
                print(f"   {q['question_id']}: empty solution, skipped")
                failed += 1
                continue

            out.parent.mkdir(parents=True, exist_ok=True)
            header = (
                f"# {paper['subject_code']} {paper['year']} — "
                f"Group {q.get('group')} Q{q.get('number')} "
                f"({q.get('marks')} marks)\n\n"
                f"> {q.get('text') or '(see sub-parts)'}\n\n"
                f"*Generated by {resp.provider}/{resp.model}. "
                f"NOT yet reviewed by a human.*\n\n---\n\n"
            )
            marks_table = ""
            if scheme:
                rows = "\n".join(
                    f"| {p.get('point','')} | {p.get('marks','')} |"
                    for p in scheme
                )
                marks_table = (
                    "\n\n---\n\n## Marking scheme\n\n"
                    "Check which points you covered.\n\n"
                    "| Point | Marks |\n|---|---|\n" + rows + "\n"
                )
            out.write_text(header + body + marks_table, encoding="utf-8")

            q["solution_path"] = str(
                out.relative_to(HERE.parent)).replace("\\", "/")
            if scheme:
                q["marking_scheme"] = scheme
            q["needs_review"] = True
            note = "solution generated, not yet reviewed"
            q["notes"] = (
                f"{q['notes']} | {note}" if q.get("notes") and note not in q.get("notes", "")
                else q.get("notes") or note
            )
            dirty = True
            written += 1
            total = sum(p.get("marks", 0) for p in scheme if p.get("required", True))
            expected = q.get("marks") or 0
            if q.get("choose") and q.get("sub_parts"):
                # "Answer any TWO of three" — all options are covered, so the
                # scheme legitimately totals more than the question's marks.
                expected = total
            flag = "" if total == expected else f"  !! scheme sums {total}, expected {expected}"
            print(f"   {q['question_id']}  {len(body)} chars, "
                  f"{len(scheme)} scheme points{flag}")

        if dirty:
            path.write_text(json.dumps(paper, indent=2, ensure_ascii=False),
                            encoding="utf-8")

    print(f"\n{written} written, {skipped} already present, {failed} failed")
    if written:
        print("Every generated question is needs_review=true. Review before use —")
        print("that review is also the revision.")
    return 0 if not failed else 1


if __name__ == "__main__":
    sys.exit(main())
