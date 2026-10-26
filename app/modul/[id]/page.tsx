import { notFound } from "next/navigation";
import { modules, getModule, publicModule } from "@/lib/curriculum";
import { Lesson } from "@/components/lesson";
export function generateStaticParams() {
  return modules.map((m) => ({ id: m.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const m = getModule((await params).id);
  return { title: m?.title || "Modul tidak ditemukan" };
}
export default async function ModulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const m = getModule((await params).id);
  if (!m) notFound();
  return <Lesson module={publicModule(m)} />;
}
