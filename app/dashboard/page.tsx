import { Dashboard } from "@/components/dashboard";
import { modules } from "@/lib/curriculum";
export const metadata = { title: "Ruang belajarku" };
export const dynamic = "force-dynamic";
export default function DashboardPage() {
  return (
    <Dashboard
      items={modules.map(({ id, title, grade, subject, icon, color }) => ({
        id,
        title,
        grade,
        subject,
        icon,
        color,
      }))}
    />
  );
}
