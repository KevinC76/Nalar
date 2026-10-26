import { test } from "node:test";
import assert from "node:assert/strict";
import { modules, publicModule } from "../lib/curriculum";
import {
  gradeQuiz,
  reviewSchedule,
  completion,
  chunkText,
} from "../lib/learning";
import {
  knowledgeCorpus,
  validateGraph,
  packSources,
  validateCitations,
} from "../lib/knowledge";
test("15 complete modules, 75 curated questions, safe public payloads", () => {
  assert.equal(modules.length, 15);
  assert.equal(modules.flatMap((m) => m.quiz).length, 75);
  for (const grade of ["SD", "SMP", "SMA"])
    assert.equal(modules.filter((m) => m.grade === grade).length, 5);
  for (const m of modules) {
    assert.equal(m.sections.length, 3);
    assert.equal(m.references.length, 1);
    assert.equal(
      gradeQuiz(
        m,
        m.quiz.map((q) => q.answer),
      ).score,
      100,
    );
    assert.throws(() => gradeQuiz(m, [99]));
    for (const q of publicModule(m).quiz) {
      assert.ok(!("answer" in q));
      assert.ok(!("explanation" in q));
    }
  }
});
test("review schedule uses controlled time, caps interval, resets on failure", () => {
  const now = new Date("2026-10-25T00:00:00Z");
  assert.deepEqual(reviewSchedule(80, 0, now), {
    step: 1,
    due: "2026-10-26T00:00:00.000Z",
  });
  assert.equal(reviewSchedule(100, 1, now).due, "2026-10-28T00:00:00.000Z");
  assert.equal(reviewSchedule(100, 2, now).due, "2026-11-01T00:00:00.000Z");
  assert.equal(reviewSchedule(100, 3, now).due, "2026-11-08T00:00:00.000Z");
  assert.deepEqual(reviewSchedule(60, 3, now), {
    step: 0,
    due: "2026-10-26T00:00:00.000Z",
  });
  assert.equal(completion({ part1: true, part2: true, quiz_done: true }), 75);
});
test("chunking bounds, overlap, graph references and cycles", () => {
  const chunks = chunkText("abcdef ".repeat(1000));
  assert.ok(chunks.every((x) => x.length <= 1800));
  for (let i = 1; i < chunks.length; i++)
    assert.equal(chunks[i - 1].slice(-200), chunks[i].slice(0, 200));
  assert.throws(() => chunkText("x", 200, 200));
  const c = knowledgeCorpus();
  assert.equal(c.nodes.length, 105);
  assert.equal(c.edges.length, 125);
  assert.throws(() =>
    validateGraph(c.nodes, [
      ...c.edges,
      {
        source: "pecahan-konsep-1",
        target: "pecahan-konsep-3",
        type: "REQUIRES",
      },
    ]),
  );
  assert.throws(() =>
    validateGraph(c.nodes, [
      { source: "missing", target: "missing", type: "REQUIRES" },
    ]),
  );
});
test("context packing deduplicates, bounds material, validates citation IDs", () => {
  const { nodes } = knowledgeCorpus();
  const sources = packSources(
    [...nodes, ...nodes].map((n) => ({
      ...n,
      payload: { ...n.payload, text: "x".repeat(1800) },
      via: "vector",
    })),
  );
  assert.ok(sources.length <= 10);
  assert.ok(sources.reduce((n, s) => n + s.text.length, 0) <= 16000);
  assert.equal(new Set(sources.map((s) => s.point_id)).size, sources.length);
  assert.equal(validateCitations("Konsep [S1]", sources), true);
  assert.equal(validateCitations("Konsep [S999]", sources), false);
  assert.equal(validateCitations("Tanpa sumber", sources), false);
});
