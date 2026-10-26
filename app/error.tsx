"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="shell empty-state">
      <h1>Sebentar, koneksinya terputus.</h1>
      <p>Periksa koneksi, lalu coba kembali. Materimu akan tetap ada.</p>
      <button className="button" onClick={reset}>
        Coba lagi
      </button>
    </div>
  );
}
