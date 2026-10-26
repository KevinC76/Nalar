import { createInterface } from "node:readline";
import { db, sql, schema } from "../lib/db";

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
  console.log(`Akhiri SQL dengan ; (boleh beberapa baris).
\\status       Status server dan indeks aktif
\\tables       Daftar tabel Nalar
\\collections  Daftar koleksi vector
\\q            Keluar

Contoh:
SELECT id, full_name, grade_level FROM users LIMIT 10;
SELECT collection_name, embedding_model, dimensions, active FROM knowledge_versions;
SELECT role, status, content FROM chat_messages LIMIT 5;
`);
}

try {
  await status();
  if (process.argv.length > 2) {
    console.table(await sql(process.argv.slice(2).join(" ")));
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
      if (input === "\\q") break;
      try {
        if (!pending && input === "\\status") await status();
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
        else if (input) {
          pending += `${line}\n`;
          if (input.endsWith(";")) {
            const query = pending;
            pending = "";
            console.table(await sql(query));
          }
        }
      } catch {
        console.error("Query gagal. Periksa sintaks SQL dan nama tabel/kolom.");
        process.exitCode = 1;
      }
      terminal.setPrompt(pending ? "   ... " : "nalar> ");
      terminal.prompt();
    }
    terminal.close();
  }
} catch {
  console.error("Koneksi/query gagal. Periksa ChironDB dan konfigurasi lokal.");
  process.exitCode = 1;
} finally {
  db().close();
}
