import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  BookOpen,
  Network,
  MessageCircle,
  Check,
  SubjectIcon,
  Lightbulb,
} from "@/components/icons";
import { modules } from "@/lib/curriculum";
export default function Home() {
  return (
    <>
      <section className="shell hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="live-dot" />
            RUANG BELAJAR, RUANG BERTUMBUH
          </div>
          <h1>
            Rasa ingin tahu.
            <br />
            Arah belajar <em>baru.</em>
            <span className="heading-star">✳</span>
          </h1>
          <p className="hero-description">
            Bukan sekadar menemukan jawaban. Pahami <strong>kenapanya</strong>{" "}
            bersama materi yang dekat denganmu dan tutor AI yang membimbing cara
            berpikir.
          </p>
          <div className="hero-actions">
            <Link href="/modul" className="button">
              Temukan modulmu <ArrowUpRight size={19} />
            </Link>
            <Link href="/tentang" className="text-link">
              Kenalan dengan Nalar <ArrowRight size={17} />
            </Link>
          </div>
          <div className="hero-proof">
            <span className="tiny-avatars">
              <span>A</span>
              <span>✳</span>
              <span>N</span>
            </span>
            <span>
              Dirancang untuk rasa ingin tahu
              <br />
              <strong>dari SD sampai SMA.</strong>
            </span>
          </div>
        </div>
        <div
          className="learning-canvas"
          aria-label="Ilustrasi belajar pecahan dengan tutor AI"
        >
          <div className="canvas-top">
            <span className="eyebrow">SEBUAH IDE KECIL, PEMAHAMAN BESAR</span>
            <span>↗</span>
          </div>
          <div className="canvas-orbit orbit-one" />
          <div className="canvas-orbit orbit-two" />
          <span className="canvas-star">✳</span>
          <div className="lesson-note">
            <div className="note-meta">
              <span className="tag coral">MATEMATIKA · SD</span>
              <BookOpen size={18} />
            </div>
            <h2>
              Berbagi itu
              <br />
              belajar pecahan.
            </h2>
            <div className="fraction-demo">
              <div className="fraction-disc" />
              <span>
                <b>¼</b>
                <small>
                  satu bagian,
                  <br />
                  dari empat yang sama
                </small>
              </span>
            </div>
            <div className="note-bottom">
              <span>01 / 03 · Konsep dasar</span>
              <span className="round-arrow">↗</span>
            </div>
          </div>
          <div className="tutor-note">
            <span className="nara-avatar">
              <Sparkles size={20} />
            </span>
            <div>
              <span className="tutor-label">NARA, TEMAN BERPIKIRMU</span>
              <p>
                Kalau pizzanya dibagi empat,
                <br />
                satu potong itu berapa bagian?
              </p>
              <span className="source-mini">
                <Network size={12} /> Terhubung ke sumber belajar
              </span>
            </div>
          </div>
          <span className="floating-label">
            <Check size={14} /> Pelan-pelan, jadi paham.
          </span>
        </div>
      </section>
      <section className="learning-strip">
        <div className="shell strip-inner">
          <span>BELAJAR DENGAN CARA YANG LEBIH MANUSIAWI</span>
          <span>
            <Lightbulb size={17} /> Pahami konsep
          </span>
          <span>
            <MessageCircle size={17} /> Berani bertanya
          </span>
          <span>
            <Network size={17} /> Hubungkan ide
          </span>
        </div>
      </section>
      <section className="shell section-space">
        <div className="section-heading">
          <div>
            <span className="eyebrow">SETIAP TAHAP PUNYA CERITANYA</span>
            <h2>
              Mulai dari tempatmu <em>sekarang.</em>
            </h2>
          </div>
          <p>
            Rasa penasaran yang sama.
            <br />
            Cara belajar yang tumbuh bersamamu.
          </p>
        </div>
        <div className="grade-grid">
          {[
            {
              g: "SD",
              n: "01",
              title: "Dunia penuh pertanyaan.",
              text: "Cerita, gambar, dan contoh sederhana untuk menemukan konsep pertama.",
              c: "mint",
              icon: "sun",
            },
            {
              g: "SMP",
              n: "02",
              title: "Saatnya menghubungkan ide.",
              text: "Asah logika, temukan pola, dan bangun alasan di balik setiap jawaban.",
              c: "lavender",
              icon: "search",
            },
            {
              g: "SMA",
              n: "03",
              title: "Berpikir lebih jauh.",
              text: "Jelajahi analisis, soal HOTS, dan sudut pandang yang lebih mendalam.",
              c: "peach",
              icon: "chart",
            },
          ].map((x) => (
            <Link
              href={`/modul?jenjang=${x.g}`}
              className={`grade-card ${x.c}`}
              key={x.g}
            >
              <div className="grade-card-top">
                <span className="grade-number">{x.n} / JENJANG</span>
                <SubjectIcon name={x.icon} size={30} />
              </div>
              <h3>{x.g}</h3>
              <h4>{x.title}</h4>
              <p>{x.text}</p>
              <span className="grade-card-link">
                Jelajahi 5 modul <ArrowUpRight size={20} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="method-section">
        <div className="shell method-grid">
          <div>
            <span className="eyebrow">BUKAN MENGHAFAL. MEMAHAMI.</span>
            <h2>
              Teman berpikir,
              <br />
              bukan mesin
              <br />
              <em>jawaban.</em>
            </h2>
            <p>
              Nara mengajakmu mengurai masalah, menghubungkan konsep, dan
              menemukan jawabanmu sendiri.
            </p>
            <Link className="text-link" href="/tentang">
              Lihat cara belajarnya <ArrowRight size={18} />
            </Link>
          </div>
          <div className="method-steps">
            {[
              [
                "01",
                "Baca satu ide kecil",
                "Materi terkurasi yang mudah dicerna, lengkap dengan analogi dari keseharian.",
              ],
              [
                "02",
                "Tanyakan “kenapa?”",
                "Tutor mencari sumber relevan dan konsep prasyarat melalui vector dan graph ChironDB.",
              ],
              [
                "03",
                "Ingat, coba, ulangi",
                "Kuis singkat dan jadwal pengulangan membantu melihat bagian yang perlu dipelajari lagi.",
              ],
            ].map((x) => (
              <div className="method-step" key={x[0]}>
                <span>{x[0]}</span>
                <div>
                  <h3>{x[1]}</h3>
                  <p>{x[2]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="shell section-space">
        <div className="section-heading">
          <div>
            <span className="eyebrow">SATU MODUL, SATU PENEMUAN</span>
            <h2>
              Penasaran mulai <em>dari mana?</em>
            </h2>
          </div>
          <Link href="/modul" className="text-link">
            Lihat semua modul <ArrowRight size={18} />
          </Link>
        </div>
        <div className="module-grid">
          {[modules[0], modules[6], modules[14]].map((m) => (
            <Link className="module-card" href={`/modul/${m.id}`} key={m.id}>
              <div className={`module-art ${m.color}`}>
                <SubjectIcon name={m.icon} size={64} />
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
      </section>
      <section className="shell">
        <div className="closing-banner">
          <span className="banner-star">✳</span>
          <div>
            <span className="eyebrow">PERTANYAAN PERTAMAMU MENUNGGU</span>
            <h2>Hari ini, mau memahami apa?</h2>
            <p>Mulai dari satu hal kecil yang membuatmu penasaran.</p>
          </div>
          <Link href="/modul" className="button light">
            Ayo, mulai belajar <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
