"use client";
import Link from "next/link";
import { ConceptVisual } from "./concept-visual";
import { useEffect, useRef, useState } from "react";
import type { PublicModule } from "@/lib/curriculum";
import { completion, type Progress } from "@/lib/learning";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  BookOpen,
  Sparkles,
  Network,
  Send,
  LoaderCircle,
  RotateCcw,
  LockKeyhole,
  ChevronRight,
  Lightbulb,
} from "lucide-react";
type Source = {
  id: string;
  title: string;
  url: string;
  via: string;
  section_id: string;
  module_id: string;
};
type Message = {
  role: string;
  content: string;
  status: string;
  sources?: { sources?: Source[]; relations?: unknown[] };
};
async function post(path: string, b: unknown) {
  const r = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(b),
  });
  if (!r.ok) {
    const d = await r.json();
    throw new Error(d.error || "Permintaan belum berhasil.");
  }
  return r;
}
export function Lesson({ module: m }: { module: PublicModule }) {
  const [tab, setTab] = useState(0),
    [user, setUser] = useState<{ id: string; grade_level: string } | null>(
      null,
    ),
    [loaded, setLoaded] = useState(false),
    [progress, setProgress] = useState<Partial<Progress>>({}),
    [notice, setNotice] = useState(""),
    [answers, setAnswers] = useState<number[]>(Array(5).fill(-1)),
    [result, setResult] = useState<{
      score: number;
      feedback: { correct: boolean; answer: number; explanation: string }[];
      saved: boolean;
    } | null>(null),
    [quizBusy, setQuizBusy] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]),
    [message, setMessage] = useState(""),
    [chatBusy, setChatBusy] = useState(false),
    [chatError, setChatError] = useState(""),
    [sessionId, setSessionId] = useState(""),
    [historyBusy, setHistoryBusy] = useState(false);
  const quizRequest = useRef({ payload: "", id: "" }),
    chatRequest = useRef<{ id: string; message: string } | null>(null),
    abortRef = useRef<AbortController | null>(null),
    bottom = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const hash = location.hash.slice(1);
    const i = m.sections.findIndex((s) => s.id === hash);
    if (i >= 0) setTab(i);
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(async (d) => {
        setUser(d.user);
        if (d.user) {
          const p = await fetch("/api/progress").then((r) => r.json());
          setProgress(
            p.progress?.find((x: Progress) => x.module_id === m.id) || {},
          );
          if (d.user.grade_level === m.grade) {
            const s = await fetch(`/api/chat/sessions?module_id=${m.id}`).then(
              (r) => r.json(),
            );
            if (s.sessions?.[0]) {
              setSessionId(s.sessions[0].id);
              await loadHistory(s.sessions[0].id);
            }
          }
        }
      })
      .catch(() =>
        setNotice(
          "Koneksi akun belum tersedia. Materi tetap bisa dibaca sebagai guest.",
        ),
      )
      .finally(() => setLoaded(true));
    return () => abortRef.current?.abort();
  }, [m.id]);
  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [messages]);
  async function loadHistory(id = sessionId) {
    if (!id) return;
    setHistoryBusy(true);
    try {
      const r = await fetch(`/api/chat/sessions/${id}/messages`),
        d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setMessages(d.messages);
      setChatError("");
      chatRequest.current = null;
    } catch (e) {
      setChatError(String((e as Error).message));
    } finally {
      setHistoryBusy(false);
    }
  }
  async function completeSection() {
    setNotice("");
    try {
      if (user) {
        const r = await post(`/api/modules/${m.id}/progress`, {
          section_id: m.sections[tab].id,
        });
        setProgress(await r.json());
      } else setProgress((p) => ({ ...p, [`part${tab + 1}`]: true }));
      if (tab < 2) setTab(tab + 1);
      else setTab(3);
    } catch (e) {
      setNotice((e as Error).message);
    }
  }
  async function submitQuiz(e: React.FormEvent) {
    e.preventDefault();
    setQuizBusy(true);
    setNotice("");
    const payload = JSON.stringify(answers);
    if (quizRequest.current.payload !== payload)
      quizRequest.current = { payload, id: crypto.randomUUID() };
    try {
      const r = await post(`/api/modules/${m.id}/quiz`, {
        answers,
        request_id: quizRequest.current.id,
      });
      const d = await r.json();
      setResult(d);
      setProgress((p) => ({ ...p, quiz_done: true, score: d.score }));
    } catch (e) {
      setNotice((e as Error).message);
    } finally {
      setQuizBusy(false);
    }
  }
  async function send(e?: React.FormEvent, quick?: string) {
    e?.preventDefault();
    const text = quick || message;
    if (!text.trim() || chatBusy) return;
    setChatError("");
    setChatBusy(true);
    const abort = new AbortController();
    abortRef.current = abort;
    try {
      let id = sessionId;
      if (!id) {
        const r = await post("/api/chat/sessions", {
          module_id: m.id,
          request_id: crypto.randomUUID(),
        });
        id = (await r.json()).id;
        setSessionId(id);
      }
      if (!chatRequest.current || chatRequest.current.message !== text)
        chatRequest.current = { id: crypto.randomUUID(), message: text };
      const r = await post(`/api/chat/sessions/${id}/messages`, {
        message: text,
        section_id: m.sections[Math.min(tab, 2)].id,
        request_id: chatRequest.current.id,
      });
      setMessages((p) => [
        ...p,
        { role: "user", content: text, status: "complete" },
        { role: "assistant", content: "", status: "generating" },
      ]);
      setMessage("");
      const reader = r.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "",
        done = false;
      abort.signal.addEventListener("abort", () => reader.cancel(), {
        once: true,
      });
      while (true) {
        const part = await reader.read();
        if (part.done) break;
        buffer += decoder.decode(part.value, { stream: true });
        let split;
        while ((split = buffer.indexOf("\n\n")) >= 0) {
          const frame = buffer.slice(0, split);
          buffer = buffer.slice(split + 2);
          const event = frame
            .split("\n")
            .find((x) => x.startsWith("event: "))
            ?.slice(7);
          const dataLine = frame
            .split("\n")
            .find((x) => x.startsWith("data: "));
          if (!dataLine) continue;
          const d = JSON.parse(dataLine.slice(6));
          if (event === "error") throw new Error(d.error);
          if (event === "done") done = true;
          setMessages((p) => {
            const next = [...p],
              last = { ...next[next.length - 1] };
            if (event === "delta") last.content += d.text;
            if (event === "sources")
              last.sources = { sources: d.sources, relations: d.relations };
            if (event === "done") last.status = "complete";
            next[next.length - 1] = last;
            return next;
          });
        }
      }
      if (!done)
        throw new Error(
          "Respons terputus. Muat ulang riwayat untuk memeriksa statusnya.",
        );
      chatRequest.current = null;
    } catch (e) {
      setChatError((e as Error).message);
      setMessages((p) =>
        p.map((x) =>
          x.status === "generating" ? { ...x, status: "incomplete" } : x,
        ),
      );
    } finally {
      setChatBusy(false);
      abortRef.current = null;
    }
  }
  function sourceLink(s: Source) {
    if (s.module_id === m.id) {
      const i = m.sections.findIndex((x) => x.id === s.section_id);
      if (i >= 0) setTab(i);
    }
  }
  const section = m.sections[Math.min(tab, 2)],
    read = [progress.part1, progress.part2, progress.part3],
    percent = completion(progress),
    sameGrade = !user || user.grade_level === m.grade;
  return (
    <div className="shell lesson-shell">
      <Link href="/modul" className="back-link">
        <ArrowLeft size={15} /> Semua modul
      </Link>
      <div className="lesson-heading">
        <div>
          <div className="eyebrow">
            {m.grade} <span> / </span> {m.subject}
          </div>
          <h1>{m.title}</h1>
          <p>{m.description}</p>
        </div>
        <div className="lesson-progress">
          <span>
            {percent}% <small>perjalananmu</small>
          </span>
          <div className="progress-track">
            <i style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>
      {!sameGrade && (
        <p className="notice">
          Akunmu berada di jenjang {user?.grade_level}. Materi ini boleh dibaca,
          tetapi tutor dan penyimpanan progres mengikuti jenjang akun.
        </p>
      )}
      <div className="lesson-layout">
        <aside className="lesson-sidebar">
          <span className="eyebrow">PETA BELAJARMU</span>
          {m.sections.map((s, i) => (
            <button
              key={s.id}
              className={tab === i ? "lesson-step selected" : "lesson-step"}
              onClick={() => setTab(i)}
            >
              <span className={read[i] ? "step-index done" : "step-index"}>
                {read[i] ? <Check size={14} /> : i + 1}
              </span>
              <span>{s.title}</span>
            </button>
          ))}
          <button
            className={tab === 3 ? "lesson-step selected" : "lesson-step"}
            onClick={() => setTab(3)}
          >
            <span className="step-index">
              <Lightbulb size={14} />
            </span>
            <span>Uji pemahamanmu</span>
          </button>
          <div className="sidebar-note">
            <BookOpen size={18} />
            <p>
              Pelan-pelan saja.
              <br />
              Paham lebih penting
              <br />
              daripada cepat selesai.
            </p>
          </div>
        </aside>
        <article className="lesson-content">
          {tab < 3 ? (
            <>
              <div className="lesson-content-meta">
                <span className="tag mint">BAGIAN 0{tab + 1}</span>
                <span>Konsep → contoh → pertanyaan</span>
              </div>
              <h2 id={section.id}>{section.title}</h2>
              <p className="lesson-prose">{section.text}</p>
              {m.grade === "SD" && <ConceptVisual id={m.id} />}{" "}
              {m.id === "pecahan" && tab === 0 && (
                <div className="fraction-visual">
                  <div className="fraction-disc" />
                  <span>
                    <strong>1 dari 4</strong>
                    <br />
                    bagian yang sama besar
                  </span>
                </div>
              )}
              <div className="analogy-box">
                <Lightbulb size={20} />
                <div>
                  <h3>Coba bayangkan …</h3>
                  <p>{section.analogy}</p>
                </div>
              </div>
              <div className="think-box">
                <span className="eyebrow">SEKARANG, GILIRANMU BERPIKIR</span>
                <h3>{section.question}</h3>
                <button
                  className="text-link"
                  onClick={() => {
                    if (user && sameGrade) send(undefined, section.question);
                    else
                      setChatError(
                        "Masuk dengan akun sesuai jenjang untuk membahas pertanyaan bersama Nara.",
                      );
                  }}
                >
                  Bahas bersama Nara <ArrowRight size={16} />
                </button>
              </div>
              <div className="source-reference">
                Rujukan kurikulum:{" "}
                {m.references.map((r) => (
                  <a href={r.url} key={r.url} target="_blank" rel="noreferrer">
                    {r.title} ↗
                  </a>
                ))}
                <small>Penjelasan disusun mandiri untuk demo Nalar.</small>
              </div>
              <button
                className="button"
                onClick={completeSection}
                disabled={!sameGrade}
              >
                Sudah kupahami <Check size={17} />
              </button>
            </>
          ) : (
            <>
              <span className="tag mint">ACTIVE RECALL</span>
              <h2>Seberapa jauh kamu memahami?</h2>
              <p className="small-muted">
                Lima pertanyaan kecil. Kesempatan untuk tahu bagian mana yang
                perlu diulang.
              </p>
              <form onSubmit={submitQuiz} className="quiz-form">
                {m.quiz.map((q, i) => (
                  <fieldset key={q.prompt}>
                    <legend>
                      <span>{i + 1}.</span> {q.prompt}
                    </legend>
                    {q.options.map((o, j) => (
                      <label
                        className={
                          answers[i] === j
                            ? "quiz-option chosen"
                            : "quiz-option"
                        }
                        key={o}
                      >
                        <input
                          type="radio"
                          name={`q${i}`}
                          checked={answers[i] === j}
                          onChange={() => {
                            setAnswers((p) =>
                              p.map((v, k) => (k === i ? j : v)),
                            );
                            setResult(null);
                          }}
                          required
                        />
                        {o}
                      </label>
                    ))}
                    {result && (
                      <p
                        className={
                          result.feedback[i].correct
                            ? "quiz-feedback correct"
                            : "quiz-feedback"
                        }
                      >
                        {result.feedback[i].correct
                          ? "✓ Tepat."
                          : "Coba perhatikan lagi."}{" "}
                        {result.feedback[i].explanation}
                      </p>
                    )}
                  </fieldset>
                ))}
                {result && (
                  <div className="quiz-result">
                    <h3>Skor pemahaman: {result.score}/100</h3>
                    <p>
                      {result.score >= 80
                        ? "Konsepnya mulai terhubung. Pertahankan dengan mengulang."
                        : "Ini titik awal. Baca kembali bagian yang belum dipahami."}
                    </p>
                    <small>
                      {result.saved
                        ? "Hasil tersimpan. Jadwal pengulangan tersedia di dashboard."
                        : "Hasil guest bersifat sementara. Daftar untuk menyimpannya."}
                    </small>
                  </div>
                )}
                <button
                  className="button"
                  disabled={quizBusy || answers.includes(-1) || !sameGrade}
                >
                  {quizBusy ? (
                    <LoaderCircle size={18} className="spin" />
                  ) : (
                    "Periksa pemahamanku"
                  )}
                  <ArrowRight size={17} />
                </button>
              </form>
            </>
          )}
          {notice && (
            <p role="status" className="error-message">
              {notice}
            </p>
          )}
          {!user && loaded && (
            <p className="guest-note">
              <LockKeyhole size={14} /> Progres guest hanya untuk sesi ini.{" "}
              <Link href="/daftar">Buat akun untuk menyimpan.</Link>
            </p>
          )}
        </article>
        <aside className="tutor-panel" aria-label="Tutor AI Nara">
          <div className="tutor-header">
            <span className="nara-avatar">
              <Sparkles size={21} />
            </span>
            <div>
              <h2>Nara</h2>
              <span>Teman berpikir, berbasis sumber</span>
            </div>
            <Network size={18} />
          </div>
          <div className="tutor-context">
            <span className="live-dot" /> Sedang membahas: {section.title}
          </div>
          <div className="chat-messages" aria-live="polite">
            {!messages.length && (
              <div className="chat-welcome">
                <span className="welcome-spark">✳</span>
                <h3>Yuk, cari alasannya.</h3>
                <p>
                  Tanyakan bagian yang belum jelas. Aku akan mencari materi dan
                  konsep prasyarat untuk membantumu berpikir.
                </p>
                <span className="source-mini">
                  <Network size={13} /> Vector search + knowledge graph
                </span>
              </div>
            )}
            {messages.map((x, i) => (
              <div key={i} className={`chat-message ${x.role}`}>
                <span className="chat-author">
                  {x.role === "user" ? "Kamu" : "Nara"}
                </span>
                <div className="message-text">
                  {x.content || "Sedang menghubungkan konsep …"}
                </div>
                {x.status === "incomplete" && (
                  <small className="error-message">
                    Respons belum lengkap atau belum tervalidasi.
                  </small>
                )}
                {x.role === "assistant" &&
                  x.status === "complete" &&
                  x.sources?.sources && (
                    <div className="citation-list">
                      {x.sources.sources
                        .filter((s) => x.content.includes(`[${s.id}]`))
                        .map((s) => (
                          <a
                            href={s.url}
                            onClick={() => sourceLink(s)}
                            key={s.id}
                          >
                            [{s.id}] {s.title}
                            {s.via === "graph" && <span> · prasyarat</span>}
                          </a>
                        ))}
                    </div>
                  )}
              </div>
            ))}
            <div ref={bottom} />
          </div>
          {chatError && (
            <div className="chat-error" role="alert">
              {chatError}
              {sessionId && (
                <button className="text-link" onClick={() => loadHistory()}>
                  Muat ulang riwayat
                </button>
              )}
            </div>
          )}
          {!user ? (
            <div className="tutor-login">
              <LockKeyhole size={18} />
              <p>Masuk untuk berdiskusi dan menyimpan percakapanmu.</p>
              <Link className="button small" href="/masuk">
                Masuk ke Nalar <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <>
              <div className="quick-prompts">
                {[
                  "Jelaskan lebih sederhana",
                  "Beri contoh",
                  "Bantu saya memahami",
                ].map((t) => (
                  <button
                    onClick={() => send(undefined, `${t}: ${section.title}`)}
                    key={t}
                    disabled={chatBusy || !sameGrade}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <form className="chat-input" onSubmit={send}>
                <label className="sr-only" htmlFor="chat-message">
                  Pertanyaan untuk tutor
                </label>
                <textarea
                  id="chat-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Bagian mana yang membuatmu penasaran?"
                  maxLength={4000}
                  rows={2}
                  disabled={!sameGrade}
                />
                <button
                  className="icon-button"
                  aria-label="Kirim pertanyaan"
                  disabled={chatBusy || !message.trim() || !sameGrade}
                >
                  {chatBusy ? (
                    <LoaderCircle size={19} className="spin" />
                  ) : (
                    <Send size={19} />
                  )}
                </button>
              </form>
              <div className="chat-tools">
                <span>AI bisa keliru. Periksa sumbernya.</span>
                {sessionId && (
                  <button
                    onClick={() => loadHistory()}
                    disabled={chatBusy || historyBusy}
                    aria-label="Muat ulang percakapan"
                  >
                    <RotateCcw size={13} />
                  </button>
                )}
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
