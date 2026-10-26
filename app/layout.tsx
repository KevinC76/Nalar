import type { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { ArrowUpRight } from "@/components/icons";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "Nalar — Rasa ingin tahu, arah belajar baru",
    template: "%s · Nalar",
  },
  description:
    "Ruang belajar adaptif untuk pelajar Indonesia. Pahami konsep, latih penalaran, dan bertanya bersama tutor AI berbasis sumber.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <a href="#konten" className="skip-link">
          Langsung ke konten
        </a>
        <header className="site-header">
          <div className="shell nav-shell">
            <Link href="/" className="wordmark" aria-label="Nalar beranda">
              <span className="brand-symbol">
                n<span>✳</span>
              </span>
              nalar<span className="brand-dot">.</span>
            </Link>
            <Navigation />
          </div>
        </header>
        <main id="konten">{children}</main>
        <footer className="site-footer">
          <div className="shell footer-main">
            <Link href="/" className="wordmark">
              nalar<span className="brand-dot">.</span>
            </Link>
            <p>Untuk pikiran yang selalu ingin tahu.</p>
            <Link href="/tentang">
              Kenali cara kami belajar <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="shell footer-bottom">
            <span>Demo edukasi · Konten terkurasi · Bertenaga ChironDB</span>
            <span>Belajar sedikit. Mengerti lebih dalam.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
