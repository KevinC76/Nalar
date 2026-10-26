"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowUpRight, Search, SubjectIcon } from "./icons";
type Item = {
  id: string;
  title: string;
  grade: string;
  subject: string;
  color: string;
  icon: string;
  description: string;
};
export function Catalog({ items }: { items: Item[] }) {
  const [grade, setGrade] = useState("Semua"),
    [query, setQuery] = useState("");
  useEffect(() => {
    const g = new URLSearchParams(location.search).get("jenjang");
    if (g && ["SD", "SMP", "SMA"].includes(g)) setGrade(g);
  }, []);
  const selected = items.filter(
    (m) =>
      (grade === "Semua" || m.grade === grade) &&
      `${m.title} ${m.subject}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="catalog-controls">
        <div className="grade-tabs" aria-label="Filter jenjang">
          {["Semua", "SD", "SMP", "SMA"].map((g) => (
            <button
              aria-pressed={grade === g}
              className={grade === g ? "selected" : ""}
              onClick={() => setGrade(g)}
              key={g}
            >
              {g === "Semua" ? "Semua jenjang" : g}
            </button>
          ))}
        </div>
        <label className="search-box">
          <Search size={18} />
          <span className="sr-only">Cari materi</span>
          <input
            placeholder="Mau belajar apa?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      <div className="results-meta">
        <span>{selected.length} modul untuk rasa ingin tahumu</span>
        <span>Materi · Kuis · Tutor AI</span>
      </div>
      <div className="module-grid">
        {selected.map((m) => (
          <Link className="module-card" href={`/modul/${m.id}`} key={m.id}>
            <div className={`module-art ${m.color}`}>
              <SubjectIcon name={m.icon} size={60} />
              <span className="art-mark">✳</span>
              <span className="tag white">{m.grade}</span>
            </div>
            <div className="module-card-body">
              <span className="eyebrow">{m.subject}</span>
              <h3>{m.title}</h3>
              <p>{m.description}</p>
              <div className="module-card-bottom">
                <span>3 bagian · 5 soal</span>
                <ArrowUpRight size={19} />
              </div>
            </div>
          </Link>
        ))}
      </div>
      {!selected.length && (
        <div className="empty-state">
          <Search />
          <h3>Belum ketemu?</h3>
          <p>Coba kata kunci atau jenjang yang berbeda.</p>
          <button
            className="button"
            onClick={() => {
              setQuery("");
              setGrade("Semua");
            }}
          >
            Tampilkan semua modul
          </button>
        </div>
      )}
    </>
  );
}
