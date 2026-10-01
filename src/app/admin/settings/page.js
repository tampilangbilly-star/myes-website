import prisma from "@/lib/prisma";
import { FALLBACK } from "@/lib/site";
import SettingsForm from "@/components/admin/SettingsForm";

export const metadata = { title: "Pengaturan" };

export default async function Page({ searchParams }) {
  const { tab } = await searchParams;
  const rows = await prisma.setting.findMany();
  const values = {};
  for (const r of rows) values[r.key] = { en: r.valueEn || "", id: r.valueId || "" };
  return <SettingsForm values={values} fallback={FALLBACK} initialTab={tab} />;
}
