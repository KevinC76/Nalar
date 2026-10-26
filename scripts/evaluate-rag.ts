import { writeFile } from "node:fs/promises";
import { modules } from "../lib/curriculum";
import { db } from "../lib/db";
import { embed } from "../lib/ai";
import { activeKnowledge } from "../lib/knowledge";
const cases = modules.flatMap((m) =>
  m.sections.map((s) => ({
    module_id: m.id,
    grade: m.grade,
    question: s.question,
    relevant: [`${m.id}-${s.id}-0`],
  })),
);
await writeFile(
  "reports/retrieval-questions.json",
  JSON.stringify(cases, null, 2) + "\n",
);
try {
  const version = await activeKnowledge();
  const vectors = await embed(cases.map((c) => c.question));
  const results = [];
  for (let i = 0; i < cases.length; i++) {
    const c = cases[i],
      r = await db().search(version.collection_name, {
        vector: vectors[i],
        k: 6,
        filter: { grade: c.grade, kind: "chunk" },
        with_payload: false,
      });
    results.push({
      ...c,
      hits: r.hits.map((h) => h.id),
      recall:
        c.relevant.filter((id) => r.hits.some((h) => h.id === id)).length /
        c.relevant.length,
    });
  }
  const recall = results.reduce((n, r) => n + r.recall, 0) / results.length;
  const report = {
    provider_kind: "configured-real-provider",
    version: version.id,
    cases: cases.length,
    recall_at_6: recall,
    passed: recall >= 0.9,
    results,
  };
  await writeFile(
    "reports/retrieval-results.json",
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(
    JSON.stringify({
      cases: cases.length,
      recall_at_6: recall,
      passed: report.passed,
    }),
  );
  if (!report.passed) process.exitCode = 1;
} catch {
  await writeFile(
    "reports/retrieval-results.json",
    JSON.stringify(
      {
        status: "pending",
        reason:
          "Real embedding configuration and an active index are required.",
        cases: cases.length,
        recall_at_6: null,
        passed: false,
      },
      null,
      2,
    ) + "\n",
  );
  console.error(
    "Evaluasi embedding nyata tertunda: lengkapi konfigurasi dan indeks materi.",
  );
  process.exitCode = 1;
} finally {
  db().close();
}
