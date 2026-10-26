import OpenAI from "openai";
import { AppError } from "./errors";
export function embeddingConfig() {
  const base = process.env.EMBEDDING_BASE_URL,
    model = process.env.EMBEDDING_MODEL,
    key = process.env.EMBEDDING_API_KEY;
  if (!base || !model || !key)
    throw new AppError(
      503,
      "Pencarian materi belum siap. Pengelola perlu menghubungkan sumber belajar terlebih dahulu.",
    );
  return { base, model, key };
}
export const normalize = (s: string) => s.replace(/\s+/g, " ").trim();
export async function embed(texts: string[]) {
  const { base, model, key } = embeddingConfig();
  const client = new OpenAI({
    baseURL: base,
    apiKey: key,
    maxRetries: 0,
    timeout: 45000,
  });
  const r = await client.embeddings.create({
    model,
    input: texts.map(normalize),
    encoding_format: "float",
  });
  const vectors = r.data
    .sort((a, b) => a.index - b.index)
    .map((x) => x.embedding);
  const n = vectors[0]?.length;
  if (
    vectors.length !== texts.length ||
    !n ||
    vectors.some(
      (v) =>
        v.length !== n ||
        v.some((x) => !Number.isFinite(x)) ||
        v.every((x) => x === 0),
    )
  )
    throw new AppError(
      502,
      "Layanan embedding mengembalikan vector tidak valid.",
    );
  return vectors;
}
export function llm() {
  const base = process.env.LLM_BASE_URL,
    model = process.env.LLM_MODEL,
    key = process.env.LLM_API_KEY;
  if (!base || !model || !key)
    throw new AppError(
      503,
      "Tutor AI belum terhubung. Pengelola perlu mengaktifkan layanan ini. Materi dan kuis tetap dapat digunakan.",
    );
  return {
    model,
    client: new OpenAI({
      baseURL: base,
      apiKey: key,
      maxRetries: 0,
      timeout: 60000,
    }),
  };
}
