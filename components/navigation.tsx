"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "./icons";
export function Navigation() {
  const path = usePathname(),
    [open, setOpen] = useState(false),
    [name, setName] = useState("");
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setName(d.user?.full_name || ""))
      .catch(() => {});
    setOpen(false);
  }, [path]);
  return (
    <>
      <button
        className="mobile-menu icon-button"
        aria-label={open ? "Tutup navigasi" : "Buka navigasi"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
      <nav
        className={open ? "nav-links is-open" : "nav-links"}
        aria-label="Navigasi utama"
      >
        <Link
          className={path.startsWith("/modul") ? "active" : ""}
          href="/modul"
        >
          Jelajahi modul
        </Link>
        <Link className={path === "/tentang" ? "active" : ""} href="/tentang">
          Tentang Nalar
        </Link>
        <span className="nav-divider" />
        <Link href={name ? "/dashboard" : "/masuk"}>
          {name ? "Ruang belajarku" : "Masuk"}
        </Link>
        <Link className="button small" href={name ? "/dashboard" : "/daftar"}>
          {name ? "Lanjut belajar" : "Mulai belajar"}
          <ArrowUpRight size={16} />
        </Link>
      </nav>
    </>
  );
}
