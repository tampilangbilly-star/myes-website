import { cookies } from "next/headers";
import prisma from "./prisma";

export { t, formatDate } from "./format";

/** Bahasa aktif dari cookie "lang". Bahasa utama: English. */
export async function getLang() {
  const store = await cookies();
  return store.get("lang")?.value === "id" ? "id" : "en";
}

// Get setting value
export async function getSetting(key, lang = "en") {
  const s = await prisma.setting.findUnique({ where: { key } });
  if (!s) return "";
  return lang === "id" ? s.valueId || s.valueEn || "" : s.valueEn || "";
}

// Get all settings by group
export async function getSettings(group, lang = "en") {
  const items = await prisma.setting.findMany({ where: { group } });
  const result = {};
  for (const s of items) {
    result[s.key] = lang === "id" ? s.valueId || s.valueEn || "" : s.valueEn || "";
  }
  return result;
}

// Get social links
export async function getSocialLinks() {
  const items = await prisma.setting.findMany({ where: { group: "social" } });
  const result = {};
  for (const s of items) {
    result[s.key.replace("social_", "")] = s.valueEn || "";
  }
  return result;
}
