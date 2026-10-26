import { ensureSchema, db } from "../lib/db";
try {
  await ensureSchema();
  console.log("Schema Nalar siap.");
} finally {
  db().close();
}
