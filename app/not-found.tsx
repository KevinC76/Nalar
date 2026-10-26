import Link from "next/link";
export default function NotFound() {
  return (
    <div className="shell empty-state">
      <span className="large-star">✳</span>
      <h1>Jalur ini belum ditemukan.</h1>
      <p>Masih banyak hal menarik untuk dipelajari.</p>
      <Link className="button" href="/modul">
        Kembali ke modul
      </Link>
    </div>
  );
}
