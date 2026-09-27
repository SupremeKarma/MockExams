import { describe, expect, it } from "vitest";
import { sanitizeForSpeech, findPreferredVoice } from "@/components/ReadAloud";
import { buildQuestionSpeechText } from "@/components/ExamReview";

describe("sanitizeForSpeech", () => {
  it("unwraps inline LaTeX rather than reading the delimiters", () => {
    expect(sanitizeForSpeech("The value of $x + 1$ is two.")).toBe("The value of x + 1 is two.");
  });

  it("unwraps display LaTeX", () => {
    expect(sanitizeForSpeech("Solve $$a^2 + b^2$$ now")).toBe("Solve a^2 + b^2 now");
  });

  it("drops LaTeX commands", () => {
    expect(sanitizeForSpeech("Compute \\frac{1}{2} exactly")).toBe("Compute 1 2 exactly");
  });

  it("strips markdown emphasis and code marks", () => {
    expect(sanitizeForSpeech("**Bold** and `code` and _italic_")).toBe("Bold and code and italic");
  });

  it("collapses the whitespace left behind", () => {
    expect(sanitizeForSpeech("a    b\n\nc")).toBe("a b c");
  });

  it("leaves ordinary prose untouched", () => {
    const prose = "Explain what a B-tree is and why databases use it.";
    expect(sanitizeForSpeech(prose)).toBe(prose);
  });

  it("handles empty and whitespace-only input", () => {
    expect(sanitizeForSpeech("")).toBe("");
    expect(sanitizeForSpeech("   \n  ")).toBe("");
  });

  it("never leaves a bare delimiter in the spoken text", () => {
    const out = sanitizeForSpeech("Given $\\alpha$ and **$\\beta$**, find $\\gamma$.");
    expect(out).not.toContain("$");
    expect(out).not.toContain("\\");
    expect(out).not.toContain("*");
  });
});

describe("findPreferredVoice (female voice selection)", () => {
  const createMockVoice = (name: string, lang = "en-US"): SpeechSynthesisVoice =>
    ({
      name,
      lang,
      default: false,
      localService: true,
      voiceURI: name,
    } as SpeechSynthesisVoice);

  it("prioritizes Microsoft Ava (Natural) when available", () => {
    const voices = [
      createMockVoice("Microsoft David - English (United States)"),
      createMockVoice("Microsoft Zira - English (United States)"),
      createMockVoice("Microsoft Ava Online (Natural) - English (United States)"),
    ];
    const picked = findPreferredVoice(voices);
    expect(picked?.name).toContain("Ava");
  });

  it("falls back to Zira on Windows if Ava is not installed", () => {
    const voices = [
      createMockVoice("Microsoft David - English (United States)"),
      createMockVoice("Microsoft Zira - English (United States)"),
    ];
    const picked = findPreferredVoice(voices);
    expect(picked?.name).toContain("Zira");
  });

  it("prioritizes other natural female voices (Jenny, Aria, Samantha)", () => {
    const voices = [
      createMockVoice("Microsoft David"),
      createMockVoice("Microsoft Jenny Online (Natural)"),
    ];
    const picked = findPreferredVoice(voices);
    expect(picked?.name).toContain("Jenny");
  });

  it("avoids known male default voices when female voice is available", () => {
    const voices = [
      createMockVoice("Microsoft David (Male)"),
      createMockVoice("Google US English (Female)"),
    ];
    const picked = findPreferredVoice(voices);
    expect(picked?.name).toContain("Female");
  });

  it("returns null safely if no voices are available", () => {
    expect(findPreferredVoice([])).toBeNull();
  });
});

describe("buildQuestionSpeechText", () => {
  it("formats MCQ question with options, student choice, correct answer, and explanation", () => {
    const text = buildQuestionSpeechText(
      {
        questionId: "q1",
        type: "mcq",
        question_text: "What is the primary function of an operating system kernel?",
        option_a: "To compile user programs",
        option_b: "To manage system hardware resources",
        option_c: "To design web layouts",
        option_d: "To format USB flash drives",
        selectedAnswer: "a",
        correctAnswer: "b",
        isCorrect: false,
        marksAwarded: 0,
        fullMarks: 1,
        explanation: "The kernel manages hardware resources such as CPU, memory, and I/O devices.",
      },
      1
    );

    expect(text).toContain("Question 1. What is the primary function of an operating system kernel?");
    expect(text).toContain("Option A: To compile user programs");
    expect(text).toContain("Option B: To manage system hardware resources");
    expect(text).toContain("Your answer was Option A: To compile user programs. That is incorrect.");
    expect(text).toContain("The correct answer is Option B: To manage system hardware resources.");
    expect(text).toContain("Explanation: The kernel manages hardware resources");
  });

  it("formats written question with student answer, feedback, and model answer", () => {
    const text = buildQuestionSpeechText(
      {
        questionId: "q2",
        type: "written",
        question_text: "Define deadlock and list the four necessary conditions.",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        selectedAnswer: null,
        correctAnswer: "",
        isCorrect: true,
        marksAwarded: 5,
        fullMarks: 5,
        writtenAnswer: "Deadlock occurs when processes are unable to proceed because each holds a resource while waiting for another.",
        strengths: ["Clear definition", "Correctly identified mutual exclusion"],
        gaps: [],
        nextStep: "Review recovery mechanisms",
        modelAnswer: "A deadlock is a situation where a set of processes are blocked because each process is holding a resource and waiting for another.",
      },
      2
    );

    expect(text).toContain("Question 2. Define deadlock");
    expect(text).toContain("Your answer was: Deadlock occurs when processes");
    expect(text).toContain("Marks awarded: 5 of 5");
    expect(text).toContain("What you did well: Clear definition. Correctly identified mutual exclusion.");
    expect(text).toContain("Do this next: Review recovery mechanisms.");
    expect(text).toContain("Model answer: A deadlock is a situation");
  });

  it("formats unanswered questions as incorrect in spoken narration", () => {
    const mcqText = buildQuestionSpeechText(
      {
        questionId: "q3",
        type: "mcq",
        question_text: "What is virtual memory?",
        option_a: "RAM on a graphics card",
        option_b: "Memory management technique that creates an illusion of a large memory",
        option_c: "A cloud storage drive",
        option_d: "BIOS firmware",
        selectedAnswer: null,
        correctAnswer: "b",
        isCorrect: false,
        marksAwarded: 0,
        fullMarks: 1,
        explanation: "Virtual memory maps virtual addresses used by an application onto physical addresses in computer memory.",
      },
      3
    );

    expect(mcqText).toContain("You left this question unanswered. Unanswered questions are counted as incorrect.");
    expect(mcqText).toContain("The correct answer is Option B: Memory management technique");

    const writtenText = buildQuestionSpeechText(
      {
        questionId: "q4",
        type: "written",
        question_text: "Explain thrashing in operating systems.",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        selectedAnswer: null,
        correctAnswer: "",
        isCorrect: false,
        marksAwarded: 0,
        fullMarks: 5,
        writtenAnswer: "",
      },
      4
    );

    expect(writtenText).toContain("Your answer was left blank. Unanswered questions are counted as incorrect.");
  });
});
