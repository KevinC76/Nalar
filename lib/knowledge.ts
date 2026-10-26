import { createHash, randomUUID } from "node:crypto";
import {
  StructuralPoint,
  type JsonObject,
  type GraphEdgeType,
} from "@gaussian-id/chirondb";
import { modules, type Grade } from "./curriculum";
import { chunkText } from "./learning";
import { db, sql, batch, ensureSchema } from "./db";
import { embed, embeddingConfig } from "./ai";
import { AppError, assert } from "./errors";
// SDK beta.3 names several optional budget fields differently from the frozen server.
// Keep its transport and pass the server's verified wire fields without changing the SDK.
const graphBudget = (nodes: number, edges: number, time: number) => ({
  max_depth: 1,
  max_frontier: nodes,
  max_visited: nodes,
  max_edges: edges,
  max_time_ms: time,
  max_memory_bytes: 8 * 1024 * 1024,
});
export type KnowledgePayload = {
  kind: string;
  module_id: string;
  section_id: string;
  grade: Grade;
  title: string;
  text: string;
  concept: string;
  source: string;
  references: { title: string; url: string }[];
};
export type KnowledgeNode = { id: string; payload: KnowledgePayload };
export type KnowledgeEdge = { source: string; target: string; type: string };
export function knowledgeCorpus() {
  const nodes: KnowledgeNode[] = [],
    edges: KnowledgeEdge[] = [];
  for (const m of modules) {
    nodes.push({
      id: `module-${m.id}`,
      payload: {
        kind: "module",
        module_id: m.id,
        section_id: "",
        grade: m.grade,
        title: m.title,
        text: m.description,
        concept: "",
        source: `/modul/${m.id}`,
        references: m.references,
      },
    });
    for (const s of m.sections) {
      nodes.push({
        id: s.concept,
        payload: {
          kind: "concept",
          module_id: m.id,
          section_id: s.id,
          grade: m.grade,
          title: s.title,
          text: s.text.slice(0, 400),
          concept: s.concept,
          source: `/modul/${m.id}#${s.id}`,
          references: m.references,
        },
      });
      edges.push({
        source: `module-${m.id}`,
        target: s.concept,
        type: "TEACHES",
      });
      chunkText(`${s.title}\n${s.text}\nAnalogi: ${s.analogy}`).forEach(
        (text, i) => {
          const id = `${m.id}-${s.id}-${i}`;
          nodes.push({
            id,
            payload: {
              kind: "chunk",
              module_id: m.id,
              section_id: s.id,
              grade: m.grade,
              title: s.title,
              text,
              concept: s.concept,
              source: `/modul/${m.id}#${s.id}`,
              references: m.references,
            },
          });
          edges.push({ source: s.concept, target: id, type: "HAS_CHUNK" });
        },
      );
      for (const target of s.requires)
        edges.push({ source: s.concept, target, type: "REQUIRES" });
    }
  }
  validateGraph(nodes, edges);
  return { nodes, edges };
}
export function validateGraph(nodes: KnowledgeNode[], edges: KnowledgeEdge[]) {
  const ids = new Set(nodes.map((n) => n.id));
  assert(ids.size === nodes.length, "ID pengetahuan duplikat.");
  const visiting = new Set<string>(),
    done = new Set<string>();
  const next = new Map<string, string[]>();
  for (const e of edges) {
    assert(
      ids.has(e.source) && ids.has(e.target),
      "Referensi konsep tidak ditemukan.",
    );
    if (e.type === "REQUIRES")
      next.set(e.source, [...(next.get(e.source) ?? []), e.target]);
  }
  function visit(id: string) {
    assert(!visiting.has(id), "Prasyarat tidak boleh membentuk siklus.");
    if (done.has(id)) return;
    visiting.add(id);
    for (const n of next.get(id) ?? []) visit(n);
    visiting.delete(id);
    done.add(id);
  }
  for (const id of ids) visit(id);
}
export const digest = (s: string) =>
  createHash("sha256").update(s).digest("hex");
export type KnowledgeVersion = {
  id: string;
  collection_name: string;
  embedding_model: string;
  embedding_base: string;
  dimensions: number;
  corpus_hash: string;
  active: boolean;
};
export async function activeKnowledge() {
  await ensureSchema();
  const row = (
    await sql<KnowledgeVersion>(
      "SELECT id, collection_name, embedding_model, embedding_base, dimensions, corpus_hash, active FROM knowledge_versions WHERE active=true",
    )
  )[0];
  if (!row)
    throw new AppError(
      503,
      "Sumber belajar tutor sedang disiapkan. Materi dan kuis tetap bisa digunakan.",
    );
  const c = embeddingConfig();
  if (row.embedding_model !== c.model || row.embedding_base !== c.base)
    throw new AppError(
      503,
      "Sumber belajar tutor sedang diperbarui. Coba kembali setelah pengelola selesai menyiapkannya.",
    );
  return row;
}
export async function indexKnowledge() {
  await ensureSchema();
  const c = embeddingConfig();
  const corpus = knowledgeCorpus();
  const hash = digest(
    "whitespace-v1:chunk1800-overlap200:graph-v1|" + JSON.stringify(corpus),
  );
  const id = digest(`${hash}|${c.base}|${c.model}`).slice(0, 20);
  const collection = `nalar_${id}`;
  const collections = await db().listCollections();
  let dims = 0;
  const ready = (
    await sql<KnowledgeVersion>(
      "SELECT id, active FROM knowledge_versions WHERE id=$1",
      [id],
    )
  )[0];
  if (!collections.some((x) => (x as { name: string }).name === collection)) {
    const embeddings: number[][] = [];
    for (let i = 0; i < corpus.nodes.length; i += 24)
      embeddings.push(
        ...(await embed(
          corpus.nodes.slice(i, i + 24).map((n) => n.payload.text),
        )),
      );
    dims = embeddings[0].length;
    await db().createCollection({
      name: collection,
      vector_dim: dims,
      metric: "cosine",
    });
    await db().enableGraph(collection);
    for (let i = 0; i < corpus.nodes.length; i += 24)
      await db().upsertStructural(
        collection,
        corpus.nodes.slice(i, i + 24).map((n, j) =>
          StructuralPoint.create({
            id: n.id,
            vector: embeddings[i + j],
            payload: n.payload as unknown as JsonObject,
          }),
        ),
      );
  } else {
    dims = Number(
      (
        collections.find(
          (x) => (x as { name: string }).name === collection,
        ) as { vector_dim: number }
      ).vector_dim,
    );
    // Resume a failed import using the same point IDs and durable edge replay keys.
    if (!ready)
      for (let i = 0; i < corpus.nodes.length; i += 24) {
        const part = corpus.nodes.slice(i, i + 24);
        const vectors = await embed(part.map((n) => n.payload.text));
        assert(
          vectors.every((v) => v.length === dims),
          "Dimensi embedding berubah.",
          503,
        );
        await db().upsertStructural(
          collection,
          part.map((n, j) =>
            StructuralPoint.create({
              id: n.id,
              vector: vectors[j],
              payload: n.payload as unknown as JsonObject,
            }),
          ),
        );
      }
  }
  let configured: GraphEdgeType[];
  try {
    configured = await db().listEdgeTypes(collection);
  } catch (e) {
    if (!ready && String(e).includes("graph.disabled")) {
      await db().enableGraph(collection);
      configured = [];
    } else throw e;
  }
  for (const type of ["TEACHES", "HAS_CHUNK", "REQUIRES"])
    if (!configured.some((t) => t.name === type || t.edge_type === type))
      await db().configureEdgeType(collection, type);
  for (const e of corpus.edges)
    await db().relate(collection, {
      source_point_id: e.source,
      target_point_id: e.target,
      edge_type: e.type,
      idempotency_key: digest(`${id}|${e.type}|${e.source}|${e.target}`),
    });
  const count = await db().count(collection);
  assert(
    Number(count) === corpus.nodes.length,
    "Jumlah point indeks tidak sesuai.",
    503,
  );
  for (const type of ["TEACHES", "HAS_CHUNK", "REQUIRES"]) {
    const anchors = [
      ...new Set(
        corpus.edges.filter((e) => e.type === type).map((e) => e.source),
      ),
    ];
    let edgeCount = 0;
    for (let i = 0; i < anchors.length; i += 16) {
      const r = await db().traverse(collection, {
        anchors: anchors.slice(i, i + 16),
        edge_types: [type],
        direction: "outgoing",
        returns: "edges",
        limit: 200,
        budget: graphBudget(200, 500, 3000),
      });
      edgeCount += r.result.rows.length;
    }
    assert(
      edgeCount === corpus.edges.filter((e) => e.type === type).length,
      `Verifikasi relasi ${type} gagal.`,
      503,
    );
  }
  if (!ready?.active)
    await batch(
      [
        { sql: "UPDATE knowledge_versions SET active=false WHERE active=true" },
        {
          sql: "INSERT INTO knowledge_versions (id,collection_name,embedding_model,embedding_base,dimensions,corpus_hash,active,created_at) VALUES ($1,$2,$3,$4,$5,$6,true,$7) ON CONFLICT (id) DO UPDATE SET active=true",
          parameters: [
            id,
            collection,
            c.model,
            c.base,
            dims,
            hash,
            new Date().toISOString(),
          ],
        },
      ],
      `activate-${id}-${randomUUID()}`,
    );
  return {
    version: id,
    collection,
    points: corpus.nodes.length,
    edges: corpus.edges.length,
    dimensions: dims,
  };
}
export type Source = {
  id: string;
  point_id: string;
  title: string;
  text: string;
  url: string;
  module_id: string;
  section_id: string;
  via: "vector" | "graph";
  relation?: string;
};
export function packSources(
  nodes: {
    id: string;
    payload: KnowledgePayload;
    via: "vector" | "graph";
    relation?: string;
  }[],
) {
  const seen = new Set<string>(),
    sources: Source[] = [];
  let used = 0;
  for (const n of nodes) {
    if (seen.has(n.id) || sources.length === 10 || used >= 16000) continue;
    seen.add(n.id);
    const text = n.payload.text.slice(0, 16000 - used);
    used += text.length;
    sources.push({
      id: `S${sources.length + 1}`,
      point_id: n.id,
      title: n.payload.title,
      text,
      url: n.payload.source,
      module_id: n.payload.module_id,
      section_id: n.payload.section_id,
      via: n.via,
      relation: n.relation,
    });
  }
  return sources;
}
export async function retrieve(
  question: string,
  moduleId: string,
  grade: Grade,
  sectionId?: string,
) {
  const version = await activeKnowledge();
  const sectionTitle = modules
    .find((m) => m.id === moduleId)
    ?.sections.find((s) => s.id === sectionId)?.title;
  const [vector] = await embed([
    sectionTitle ? `${sectionTitle}: ${question}` : question,
  ]);
  assert(
    vector.length === Number(version.dimensions),
    "Sumber belajar tutor belum cocok dengan layanan pencarian. Hubungi pengelola.",
    503,
  );
  const filter: JsonObject = { kind: "chunk", module_id: moduleId, grade };

  const hits = await db().search(version.collection_name, {
    vector,
    k: 6,
    filter,
    with_payload: true,
  });
  if (hits.degraded)
    throw new AppError(
      503,
      "Pencarian materi belum dapat diselesaikan. Coba lagi.",
    );
  const nodes = hits.hits
    .filter((h) => h.payload)
    .map((h) => ({
      id: h.id,
      payload: h.payload as unknown as KnowledgePayload,
      via: "vector" as const,
    }));
  const visited = new Set(nodes.map((n) => n.id));
  const relations: KnowledgeEdge[] = [];
  async function traverse(
    anchors: string[],
    type: string,
    direction: "incoming" | "outgoing",
    kind: string,
  ) {
    if (!anchors.length || visited.size >= 30)
      return [] as { id: string; payload: KnowledgePayload }[];
    const r = await db().traverse(version.collection_name, {
      anchors,
      edge_types: [type],
      direction,
      returns: "nodes",
      with_payload: true,
      limit: 30 - visited.size,
      budget: graphBudget(30, 120, 2000),
    });
    if (r.truncation)
      throw new AppError(
        503,
        "Batas graph tercapai. Persempit pertanyaan Anda.",
      );
    const out = [];
    for (const row of r.result.rows) {
      if (anchors.includes(String(row.id))) continue;
      const p = row.payload as unknown as KnowledgePayload | undefined;
      if (p?.grade !== grade || p.kind !== kind) continue;
      visited.add(String(row.id));
      if (visited.size > 30) throw new AppError(503, "Batas graph tercapai.");
      out.push({ id: String(row.id), payload: p });
    }
    return out;
  }
  const concepts = await traverse(
    nodes.map((n) => n.id),
    "HAS_CHUNK",
    "incoming",
    "concept",
  );
  const prerequisites = await traverse(
    concepts.map((n) => n.id),
    "REQUIRES",
    "outgoing",
    "concept",
  );
  const chunks = await traverse(
    prerequisites.map((n) => n.id),
    "HAS_CHUNK",
    "outgoing",
    "chunk",
  );
  const corpus = knowledgeCorpus();
  const involved = new Set(
    [...concepts, ...prerequisites, ...chunks, ...nodes].map((x) => x.id),
  );
  for (const e of corpus.edges)
    if (involved.has(e.source) && involved.has(e.target)) relations.push(e);
  return {
    version: version.id,
    sources: packSources([
      ...nodes,
      ...chunks.map((n) => ({
        ...n,
        via: "graph" as const,
        relation: "REQUIRES → HAS_CHUNK",
      })),
    ]),
    relations,
    visited_nodes: visited.size,
  };
}
export function validateCitations(text: string, sources: Source[]) {
  const ids = [...text.matchAll(/\[S(\d+)\]/g)].map((m) => `S${m[1]}`);
  return ids.length > 0 && ids.every((id) => sources.some((s) => s.id === id));
}
