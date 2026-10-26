"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, LoaderCircle } from "./icons";
export function AuthForm({ signup = false }: { signup?: boolean }) {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const b = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const r = await fetch(`/api/auth/${signup ? "signup" : "login"}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(b),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      router.push("/dashboard");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Koneksi terputus. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="auth-form" onSubmit={submit}>
      {signup && (
        <>
          <label>
            Nama lengkap
            <input
              name="full_name"
              autoComplete="name"
              placeholder="Nama panggilan belajarmu"
              required
              minLength={2}
              maxLength={80}
            />
          </label>
          <label>
            Jenjang pendidikan
            <select name="grade_level" required defaultValue="">
              <option value="" disabled>
                Pilih jenjangmu
              </option>
              {["SD", "SMP", "SMA"].map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </label>
        </>
      )}
      <label>
        Email
        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="nama@contoh.id"
          required
          maxLength={254}
        />
      </label>
      <label>
        Password
        <input
          type="password"
          name="password"
          autoComplete={signup ? "new-password" : "current-password"}
          placeholder="Minimal 12 karakter"
          minLength={12}
          maxLength={128}
          required
        />
      </label>
      {error && (
        <p role="alert" className="error-message">
          {error}
        </p>
      )}
      <button className="button full-width" disabled={busy}>
        {busy ? (
          <LoaderCircle className="spin" size={18} />
        ) : (
          <>
            {signup ? "Buat ruang belajarku" : "Masuk dan lanjut belajar"}
            <ArrowUpRight size={18} />
          </>
        )}
      </button>
      <p className="auth-switch">
        {signup ? "Sudah punya akun?" : "Baru di Nalar?"}{" "}
        <Link href={signup ? "/masuk" : "/daftar"}>
          {signup ? "Masuk di sini" : "Daftar dulu, yuk"}
        </Link>
      </p>
      <p className="small-muted">
        Demo lokal. Gunakan email dan identitas sintetis untuk mencoba.
      </p>
    </form>
  );
}
