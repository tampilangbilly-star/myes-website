/** Utilitas aman untuk server & client (tanpa prisma/cookies). */

// Ambil field terjemahan: item.titleEn / item.titleId
export function t(item, field, lang = "en") {
  if (!item) return "";
  if (lang === "id" && item[field + "Id"]) return item[field + "Id"];
  return item[field + "En"] || "";
}

export function formatDate(value, lang = "en", opts = { day: "numeric", month: "long", year: "numeric" }) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(lang === "id" ? "id-ID" : "en-US", { timeZone: "Asia/Makassar", ...opts });
}
