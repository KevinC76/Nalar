import {
  ChironDbClient,
  type RelationalValue,
  type SqlExecutionResponse,
} from "@gaussian-id/chirondb";
if (typeof window !== "undefined")
  throw new Error("Database access is server only");
const globalDb = globalThis as typeof globalThis & { nalarDb?: ChironDbClient };
export function db() {
  return (globalDb.nalarDb ??= new ChironDbClient(
    process.env.CHIRONDB_URL || "http://127.0.0.1:17401",
    { apiKey: process.env.CHIRONDB_API_KEY, timeoutMs: 15000 },
  ));
}
export type Scalar = string | number | boolean | null;
export function values(params: Scalar[]): RelationalValue[] {
  return params.map((value) =>
    value === null
      ? { type: "null" }
      : typeof value === "string"
        ? { type: "text", value }
        : typeof value === "boolean"
          ? { type: "boolean", value }
          : ({
              type: Number.isInteger(value) ? "integer" : "float",
              value,
            } as RelationalValue),
  );
}
export function rows<T = Record<string, unknown>>(
  r: SqlExecutionResponse,
): T[] {
  const s = r.results.find((x) => x.kind === "rows");
  if (!s || s.kind !== "rows") return [];
  return s.rows.map((row) =>
    Object.fromEntries(
      s.columns.map((c, i) => [c, "value" in row[i] ? row[i].value : null]),
    ),
  ) as T[];
}
export async function sql<T = Record<string, unknown>>(
  query: string,
  params: Scalar[] = [],
  key?: string,
) {
  const r = await db()
    .relational()
    .sql(query, values(params), key ? { idempotency_key: key } : {});
  if (r.outcome === "unknown") throw new Error("UNCERTAIN_COMMIT");
  return rows<T>(r);
}
export async function batch(
  statements: { sql: string; parameters?: Scalar[] }[],
  key: string,
) {
  const r = await db().executeSql({
    statements: statements.map((s) => ({
      sql: s.sql,
      parameters: values(s.parameters ?? []),
    })),
    idempotency_key: key,
  });
  if (r.outcome === "unknown") throw new Error("UNCERTAIN_COMMIT");
  return r;
}
export const schema = [
  "CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, full_name TEXT NOT NULL, grade_level TEXT NOT NULL, created_at TEXT NOT NULL)",
  "CREATE TABLE IF NOT EXISTS auth_sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), expires_at TEXT NOT NULL)",
  "CREATE TABLE IF NOT EXISTS learning_progress (user_id TEXT NOT NULL REFERENCES users(id), module_id TEXT NOT NULL, part1 BOOLEAN NOT NULL, part2 BOOLEAN NOT NULL, part3 BOOLEAN NOT NULL, quiz_done BOOLEAN NOT NULL, score INTEGER, review_step INTEGER NOT NULL, next_review TEXT, updated_at TEXT NOT NULL, PRIMARY KEY(user_id,module_id))",
  "CREATE TABLE IF NOT EXISTS quiz_attempts (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), module_id TEXT NOT NULL, answers TEXT NOT NULL, score INTEGER NOT NULL, created_at TEXT NOT NULL)",
  "CREATE TABLE IF NOT EXISTS chat_sessions (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), module_id TEXT NOT NULL, busy_until TEXT, created_at TEXT NOT NULL)",
  "CREATE TABLE IF NOT EXISTS chat_messages (id TEXT PRIMARY KEY, session_id TEXT NOT NULL REFERENCES chat_sessions(id), turn_id TEXT NOT NULL, role TEXT NOT NULL, content TEXT NOT NULL, status TEXT NOT NULL, sources TEXT NOT NULL, knowledge_version TEXT, created_at TEXT NOT NULL, UNIQUE(session_id,turn_id,role))",
  "CREATE TABLE IF NOT EXISTS knowledge_versions (id TEXT PRIMARY KEY, collection_name TEXT NOT NULL, embedding_model TEXT NOT NULL, embedding_base TEXT NOT NULL, dimensions INTEGER NOT NULL, corpus_hash TEXT NOT NULL, active BOOLEAN NOT NULL, created_at TEXT NOT NULL)",
];
let migration: Promise<void> | undefined;
export function ensureSchema() {
  return (migration ??= (async () => {
    for (const q of schema) await sql(q);
  })().catch((e) => {
    migration = undefined;
    throw e;
  }));
}
