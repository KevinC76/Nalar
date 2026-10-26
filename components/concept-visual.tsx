import {
  Sun,
  CloudRain,
  Droplets,
  ArrowRight,
  BookOpen,
  Clock,
  Check,
  Heart,
  Search,
} from "lucide-react";
export function ConceptVisual({ id }: { id: string }) {
  const content: Record<
    string,
    { icon: typeof Sun; label: string; detail: string }[]
  > = {
    "siklus-air": [
      { icon: Sun, label: "Menguap", detail: "Panas matahari" },
      { icon: CloudRain, label: "Mengembun", detail: "Tetes membentuk awan" },
      { icon: Droplets, label: "Kembali", detail: "Hujan & peresapan" },
    ],
    "ide-pokok": [
      { icon: BookOpen, label: "Satu ide", detail: "Inti paragraf" },
      { icon: Search, label: "Rincian", detail: "Contoh & alasan" },
      { icon: Check, label: "Ringkas", detail: "Kata-katamu sendiri" },
    ],
    "daily-activities": [
      { icon: Sun, label: "Wake up", detail: "Bangun tidur" },
      { icon: BookOpen, label: "Read", detail: "Membaca" },
      { icon: Clock, label: "Every day", detail: "Setiap hari" },
    ],
    "fakta-opini": [
      { icon: Search, label: "Fakta", detail: "Bisa diperiksa" },
      { icon: Heart, label: "Opini", detail: "Penilaian atau selera" },
    ],
  };
  const parts = content[id];
  if (!parts) return null;
  return (
    <div className="concept-visual" aria-label="Peta konsep sederhana">
      {parts.map((x, i) => (
        <div className="concept-stop" key={x.label}>
          <x.icon size={25} />
          <strong>{x.label}</strong>
          <span>{x.detail}</span>
          {i < parts.length - 1 && (
            <ArrowRight className="concept-arrow" size={14} />
          )}
        </div>
      ))}
    </div>
  );
}
