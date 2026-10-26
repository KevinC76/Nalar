import type { LearningModule } from "./curriculum";
export const reviewDays = [1, 3, 7, 14];
export function reviewSchedule(score: number, step: number, now = new Date()) {
  const nextStep = score >= 80 ? Math.min(step + 1, reviewDays.length - 1) : 0;
  const days = score >= 80 ? reviewDays[Math.max(0, Math.min(step, 3))] : 1;
  return {
    step: nextStep,
    due: new Date(now.getTime() + days * 86400000).toISOString(),
  };
}
export function gradeQuiz(m: LearningModule, answers: number[]) {
  if (
    answers.length !== m.quiz.length ||
    answers.some(
      (a, i) => !Number.isInteger(a) || a < 0 || a >= m.quiz[i].options.length,
    )
  )
    throw new Error("Jawab kelima soal terlebih dahulu.");
  return {
    score: Math.round(
      (m.quiz.filter((q, i) => q.answer === answers[i]).length /
        m.quiz.length) *
        100,
    ),
    feedback: m.quiz.map((q, i) => ({
      correct: q.answer === answers[i],
      answer: q.answer,
      explanation: q.explanation,
    })),
  };
}
export type Progress = {
  user_id: string;
  module_id: string;
  part1: boolean;
  part2: boolean;
  part3: boolean;
  quiz_done: boolean;
  score: number | null;
  review_step: number;
  next_review: string | null;
  updated_at: string;
};
export function completion(p: Partial<Progress>) {
  return [p.part1, p.part2, p.part3, p.quiz_done].filter(Boolean).length * 25;
}
export function chunkText(text: string, max = 1800, overlap = 200) {
  if (max <= overlap || overlap < 0) throw new Error("Invalid chunk limits");
  const out: string[] = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(start + max, text.length);
    if (end < text.length) {
      const space = text.lastIndexOf(" ", end);
      if (space > start + max / 2) end = space;
    }
    out.push(text.slice(start, end));
    if (end === text.length) break;
    start = end - overlap;
  }
  return out;
}
