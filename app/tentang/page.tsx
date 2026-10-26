import Link from "next/link";
import {
  ArrowUpRight,
  Lightbulb,
  Network,
  RotateCcw,
} from "@/components/icons";
export const metadata = { title: "Tentang Nalar" };
export default function About() {
  return (
    <div className="shell section-space">
      <div className="page-heading narrow">
        <span className="eyebrow">KENALI NALAR</span>
        <h1>
          Belajar untuk <em>mengerti.</em>
          <br />
          Bertanya untuk bertumbuh.
        </h1>
        <p>
          Kami membayangkan ruang belajar di mana pelajar Indonesia berani
          penasaran, memahami alasan, dan berlatih menyelesaikan masalah dengan
          pikiran sendiri.
        </p>
      </div>
      <div className="about-statement">
        <span>✳</span>
        <h2>
          Jawaban bisa ditemukan.
          <br />
          Cara berpikir perlu <em>ditumbuhkan.</em>
        </h2>
      </div>
      <div className="about-grid">
        {[
          [
            Lightbulb,
            "Sederhana, bukan dangkal",
            "Teknik Feynman membantu menjelaskan konsep melalui bahasa sehari-hari dan analogi. Nara menggunakan pertanyaan Socratic agar siswa ikut menyusun alasan.",
          ],
          [
            Network,
            "Punya sumber, punya hubungan",
            "Vector menemukan materi yang dekat dengan pertanyaan. Graph menelusuri konsep prasyarat. Jawaban tutor menunjukkan bagian materi yang dipakai, bukan mengarang rujukan.",
          ],
          [
            RotateCcw,
            "Dilatih, lalu diingat lagi",
            "Active recall melalui kuis dan pengulangan terjadwal membantu siswa memeriksa pemahaman. Skor kuis adalah indikator latihan, bukan ukuran kecerdasan.",
          ],
        ].map(([Icon, title, text]) => {
          const I = Icon as typeof Lightbulb;
          return (
            <article className="about-item" key={String(title)}>
              <I size={26} />
              <h3>{String(title)}</h3>
              <p>{String(text)}</p>
            </article>
          );
        })}
      </div>
      <div className="notice">
        <strong>Tentang demo ini</strong>
        <p>
          15 modul ini adalah contoh konten terkurasi untuk SD, SMP, dan SMA,
          bukan kurikulum nasional lengkap. Critical Thinking merupakan
          pengayaan. Materi dan AI perlu ditinjau bersama guru; Nalar tidak
          menggantikan pendidik. Gunakan data sintetis untuk mencoba demo lokal
          ini.
        </p>
        <p>
          Materi disusun mandiri dengan rujukan{" "}
          <a
            href="https://pusatinformasi.rumahpendidikan.kemendikdasmen.go.id/hc/id/articles/52513313951257-Pengertian-Capaian-Pembelajaran-CP"
            target="_blank"
            rel="noreferrer"
          >
            Capaian Pembelajaran Kemendikdasmen ↗
          </a>
          . Penggunaan AI mengirim pertanyaan dan konteks materi ke penyedia API
          yang dikonfigurasi pengelola.
        </p>
      </div>
      <Link className="button" href="/modul">
        Temukan hal baru <ArrowUpRight size={18} />
      </Link>
    </div>
  );
}
