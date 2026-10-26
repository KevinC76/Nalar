import { execFileSync, spawn } from "node:child_process";
import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import { resolve } from "node:path";
const revision = "32a5240460c244db3fc3f0a41f7cab1b595cd64f";
const source = resolve(process.argv[2] || "../GaussDB");
const runtime = resolve(".runtime"),
  checkout = resolve(runtime, "server-src");
await mkdir(runtime, { recursive: true });
let existing = false;
try {
  await access(resolve(checkout, "Cargo.toml"));
  existing = true;
} catch {}
if (existing) {
  const saved = JSON.parse(
    await readFile(resolve(runtime, "source-provenance.json"), "utf8"),
  );
  if (saved.revision !== revision)
    throw new Error(
      "Existing runtime source has different provenance; use a fresh runtime directory.",
    );
} else {
  const archive = execFileSync("git", ["archive", revision], {
    cwd: source,
    maxBuffer: 128 * 1024 * 1024,
  });
  await mkdir(checkout, { recursive: true });
  execFileSync("tar", ["-xf", "-", "-C", checkout], { input: archive });
  await writeFile(
    resolve(runtime, "source-provenance.json"),
    JSON.stringify({ revision, source }, null, 2),
  );
}
const cargo = spawn(
  "cargo",
  [
    "build",
    "--locked",
    "-p",
    "chirondb",
    "--bin",
    "chirondb",
    "--target-dir",
    resolve(runtime, "target"),
    "-j",
    "1",
  ],
  { cwd: checkout, stdio: "inherit" },
);
cargo.on("exit", (code) => process.exit(code ?? 1));
