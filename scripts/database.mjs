import { spawn } from "node:child_process";
import { readFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
const root = process.cwd();
const env = Object.fromEntries(
  (await readFile(".env.local", "utf8"))
    .split("\n")
    .filter((x) => x && !x.startsWith("#"))
    .map((x) => {
      const i = x.indexOf("=");
      return [x.slice(0, i), x.slice(i + 1)];
    }),
);
await mkdir(".runtime/data", { recursive: true, mode: 0o700 });
const child = spawn(
  resolve(".runtime/target/debug/chirondb"),
  [
    "--data-dir",
    resolve(".runtime/data"),
    "--listen-http",
    "127.0.0.1:17401",
    "--listen-grpc",
    "127.0.0.1:17402",
    "--listen-wire",
    "127.0.0.1:17403",
  ],
  {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, CHIRONDB_API_KEY: env.CHIRONDB_API_KEY },
  },
);
for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => child.kill(sig));
child.on("exit", (code) => process.exit(code ?? 1));
