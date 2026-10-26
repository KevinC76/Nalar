import { modules } from "@/lib/curriculum";
import { Catalog } from "@/components/catalog";
export const metadata = { title: "Jelajahi modul" };
export default function Modules() {
  return (
    <div className="shell section-space">
      <div className="page-heading">
        <span className="eyebrow">RUANG EKSPLORASI</span>
        <h1>
          Satu pertanyaan.
          <br />
          <em>Banyak kemungkinan.</em>
        </h1>
        <p>
          Pilih hal yang ingin kamu pahami. Baca, tanyakan, lalu coba dengan
          caramu sendiri.
        </p>
      </div>
      <Catalog
        items={modules.map(
          ({ id, title, grade, subject, color, icon, description }) => ({
            id,
            title,
            grade,
            subject,
            color,
            icon,
            description,
          }),
        )}
      />
    </div>
  );
}
