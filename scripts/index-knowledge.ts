import { indexKnowledge } from "../lib/knowledge";
import { db } from "../lib/db";
try {
  console.log(JSON.stringify(await indexKnowledge(), null, 2));
} catch {
  console.error(
    "Indexation failed. Check embedding configuration and ChironDB. Active version was not replaced.",
  );
  process.exitCode = 1;
} finally {
  db().close();
}
