import { createInterface } from "node:readline";
import { db, sql, schema } from "../lib/db";

async function query(statement: string) {
  const first = statement.replace(
    /^(?:\s+|--[^\n]*(?:\n|$)|\/\*[\s\S]*?\*\/)*/,
    "",
  );
  const result = await db().query(
    /^(SELECT|WITH)\b/i.test(first) ? `SQL ${statement}` : statement,
  );
  console.dir(result, { depth: null, maxArrayLength: null });
}

async function status() {
  const endpoint = process.env.CHIRONDB_URL || "http://127.0.0.1:17401";
  const response = await fetch(`${endpoint}/health`, {
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Health HTTP ${response.status}`);
  const health = await response.json();
  console.log(`ChironDB ${health.version} | ${health.status} | ${endpoint}`);
  const active = await sql<{ collection_name: string; dimensions: number }>(
    "SELECT collection_name, dimensions FROM knowledge_versions WHERE active=true",
  );
  for (const collection of active)
    console.log(
      `Aktif: ${collection.collection_name} | ${collection.dimensions} dimensi | ${await db().count(collection.collection_name)} point`,
    );
}

function help() {
  console.log(`ChironQL dan SQL dalam satu konsol. Akhiri query dengan ; (boleh beberapa baris).
SELECT/WITH biasa tetap didukung; SQL lainnya memakai awalan SQL.
\\status       Status server dan indeks aktif
\\tables       Daftar tabel Nalar
\\collections  Daftar koleksi vector
\\r            Batalkan query yang belum selesai
\\q            Keluar

Contoh:
SELECT id, full_name, grade_level FROM users LIMIT 10;
SQL SELECT collection_name, embedding_model, dimensions, active FROM knowledge_versions;
SHOW COLLECTIONS;
SCROLL <nama_koleksi> WHERE kind = 'chunk' LIMIT 5;
SEARCH <nama_koleksi> NEAR @'genetika-bagian-3-0' LIMIT 6 WITH PAYLOAD;
TRAVERSE <nama_koleksi> FROM 'genetika-konsep-3' VIA REQUIRES DEPTH 1 RETURN NODES LIMIT 10;
`);
}

try {
  await status();
  if (process.argv.length > 2) {
    await query(process.argv.slice(2).join(" "));
  } else {
    help();
    const terminal = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    let pending = "";
    terminal.setPrompt("nalar> ");
    terminal.prompt();
    for await (const line of terminal) {
      const input = line.trim();
      if (input === "\\q") {
        pending = "";
        break;
      }
      try {
        if (input === "\\r") pending = "";
        else if (!pending && input === "\\status") await status();
        else if (!pending && input === "\\tables")
          console.table(schema.map((s) => ({ table: s.split(" ")[5] })));
        else if (!pending && input === "\\collections")
          console.table(
            (await db().listCollections()).map((c) => ({
              name: c.name,
              dimensions: c.vector_dim,
            })),
          );
        else if (!pending && input === "\\help") help();
        else if (input && (pending || !input.startsWith("--"))) {
          pending += `${line}\n`;
          if (input.endsWith(";")) {
            const statement = pending;
            pending = "";
            await query(statement);
          }
        }
      } catch {
        console.error(
          "Query gagal. Periksa sintaks ChironQL; untuk SQL gunakan SQL <pernyataan>.",
        );
        process.exitCode = 1;
      }
      terminal.setPrompt(pending ? "   ... " : "nalar> ");
      terminal.prompt();
    }
    if (pending) {
      console.error("Query belum dijalankan. Akhiri dengan titik koma (;).");
      process.exitCode = 1;
    }
    terminal.close();
  }
} catch {
  console.error("Koneksi/query gagal. Periksa ChironDB dan konfigurasi lokal.");
  process.exitCode = 1;
} finally {
  db().close();
}
