import { AuthForm } from "./auth-form";
import { Sparkles } from "./icons";
export function AuthPage({ signup = false }: { signup?: boolean }) {
  return (
    <div className="shell auth-layout">
      <div className="auth-intro mint">
        <span className="eyebrow">RUANG BELAJAR MILIKMU</span>
        <h1>
          Setiap pikiran
          <br />
          punya cara
          <br />
          <em>bertumbuh.</em>
        </h1>
        <span className="auth-star">✳</span>
        <div className="auth-quote">
          <Sparkles size={25} />
          <p>
            “Tidak apa-apa belum tahu.
            <br />
            Yang penting, berani bertanya.”
          </p>
          <span>— Nara, teman berpikirmu</span>
        </div>
      </div>
      <div className="auth-panel">
        <span className="eyebrow">
          {signup ? "LANGKAH PERTAMA" : "SENANG BERTEMU LAGI"}
        </span>
        <h2>
          {signup ? "Halo, calon penjelajah." : "Selamat datang kembali."}
        </h2>
        <p>
          {signup
            ? "Simpan progres, temukan ritmemu, dan belajar bersama Nara."
            : "Pertanyaan baru dan penemuan kecil sudah menunggumu."}
        </p>
        <AuthForm signup={signup} />
      </div>
    </div>
  );
}
