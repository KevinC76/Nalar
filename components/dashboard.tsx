"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Progress } from "@/lib/learning";
import { completion } from "@/lib/learning";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  Clock,
  LogOut,
  Sparkles,
  SubjectIcon,
} from "./icons";
type Item = {
  id: string;
  title: string;
  grade: string;
  subject: string;
  icon: string;
  color: string;
};
export function Dashboard({ items }: { items: Item[] }) {
  const [user, setUser] = useState<{
      full_name: string;
      grade_level: string;
    } | null>(null),
    [progress, setProgress] = useState<Progress[]>([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const me = await fetch("/api/auth/me"),
        u = await me.json();
      if (!me.ok) throw new Error(u.error);
      if (!u.user) {
        router.replace("/masuk");
        return;
      }
      setUser(u.user);
      const r = await fetch("/api/progress"),
        p = await r.json();
      if (!r.ok) throw new Error(p.error);
      setProgress(p.progress);
    })()
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [router]);
  async function changeGrade(grade_level: string) {
    try {
      const r = await fetch("/api/auth/profile", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ grade_level }),
        }),
        d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setUser(d.user);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function signout() {
    try {
      const r = await fetch("/api/auth/logout", { method: "POST" });
      if (!r.ok) throw new Error("Logout belum berhasil. Coba lagi.");
      router.push("/masuk");
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    }
  }
  if (loading)
    return (
      <div className="shell empty-state">
        <span className="large-star">✳</span>
        <p>Menyiapkan ruang belajarmu …</p>
      </div>
    );
  if (error)
    return (
      <div className="shell empty-state" role="alert">
        <h1>Ruang belajar belum terhubung.</h1>
        <p>{error}</p>
        <button className="button" onClick={() => location.reload()}>
          Coba lagi
        </button>
      </div>
    );
  if (!user) return null;
  const completed = progress.filter((p) => completion(p) === 100).length,
    due = progress.filter(
      (p) => p.next_review && p.next_review <= new Date().toISOString(),
    );
  const list = items
    .filter((m) => m.grade === user.grade_level)
    .sort((a, b) => {
      const pa = progress.find((p) => p.module_id === a.id),
        pb = progress.find((p) => p.module_id === b.id);
      const priority = (p?: Progress) =>
        p?.next_review && p.next_review <= new Date().toISOString()
          ? 0
          : p?.score != null
            ? p.score + 1
            : 102;
      return priority(pa) - priority(pb);
    });
  return (
    <div className="shell section-space">
      <div className="dashboard-top">
        <div className="page-heading">
          <span className="eyebrow">RUANG BELAJARMU · {user.grade_level}</span>
          <h1>
            Halo, <em>{user.full_name.split(" ")[0]}.</em>
          </h1>
          <p>Satu hal baru hari ini, satu langkah lebih paham.</p>
          <label className="grade-picker">
            Jenjang belajar{" "}
            <select
              value={user.grade_level}
              onChange={(e) => changeGrade(e.target.value)}
            >
              {["SD", "SMP", "SMA"].map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </label>
        </div>
        <button className="text-link" onClick={signout}>
          <LogOut size={15} /> Keluar
        </button>
      </div>
      <div className="stats-grid">
        <div className="stat-card mint">
          <BookOpen />
          <strong>
            {completed}
            <small> / 15</small>
          </strong>
          <span>modul selesai seluruh jenjang</span>
        </div>
        <div className="stat-card lavender">
          <Clock />
          <strong>{due.length}</strong>
          <span>modul waktunya diulang</span>
        </div>
        <div className="stat-card peach">
          <Sparkles />
          <strong>
            {progress.some((p) => p.score !== null)
              ? Math.round(
                  progress
                    .filter((p) => p.score !== null)
                    .reduce((s, p) => s + Number(p.score), 0) /
                    progress.filter((p) => p.score !== null).length,
                )
              : "—"}
          </strong>
          <span>rata-rata skor kuis terakhir</span>
        </div>
      </div>
      <div className="dashboard-sections">
        <section>
          <div className="section-heading compact">
            <div>
              <span className="eyebrow">SEDIKIT DEMI SEDIKIT</span>
              <h2>
                Langkah <em>berikutnya.</em>
              </h2>
            </div>
          </div>
          <div className="learning-list">
            {list.map((m) => {
              const p = progress.find((x) => x.module_id === m.id),
                rate = p ? completion(p) : 0,
                isDue =
                  p?.next_review && p.next_review <= new Date().toISOString();
              return (
                <Link
                  href={`/modul/${m.id}`}
                  className="learning-row"
                  key={m.id}
                >
                  <span className={`subject-tile ${m.color}`}>
                    <SubjectIcon name={m.icon} />
                  </span>
                  <div>
                    <span className="eyebrow">{m.subject}</span>
                    <h3>{m.title}</h3>
                    <span className="small-muted">
                      {isDue
                        ? "Waktunya mengingat lagi"
                        : p?.next_review
                          ? `Ulangi ${new Date(p.next_review).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}`
                          : "Mulai satu penemuan baru"}
                      {p?.score != null ? ` · skor ${p.score}` : ""}
                    </span>
                    <div className="progress-track">
                      <i style={{ width: `${rate}%` }} />
                    </div>
                  </div>
                  <span className="row-progress">
                    {rate}%<ArrowUpRight size={18} />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
        <aside className="badge-panel">
          <span className="eyebrow">JEJAK PENEMUANMU</span>
          <h3>
            Langkah kecil
            <br />
            layak dirayakan.
          </h3>
          {[
            [1, "Penjelajah pertama"],
            [5, "Penghubung ide"],
            [15, "Penjelajah lintas jenjang"],
          ].map(([n, title]) => (
            <div
              className={
                completed >= Number(n) ? "badge-item earned" : "badge-item"
              }
              key={n}
            >
              <span>
                {completed >= Number(n) ? (
                  <Check size={18} />
                ) : (
                  <Sparkles size={18} />
                )}
              </span>
              <div>
                <strong>{title}</strong>
                <small>Selesaikan {n} modul</small>
              </div>
            </div>
          ))}
          <p className="small-muted">
            Pilih jenjang belajar di atas untuk menjelajah modul lain. Progres
            setiap jenjang tetap tersimpan.
          </p>
        </aside>
      </div>
    </div>
  );
}
