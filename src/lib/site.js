import { cache } from "react";
import prisma from "./prisma";
import { safeAccent } from "./theme";

/**
 * Nilai cadangan diambil dari link yang sebelumnya ditulis langsung di kode,
 * sehingga tampilan tetap sama walau pengaturan di admin masih kosong.
 */
export const FALLBACK = {
  social_instagram: "https://www.instagram.com/myes_worship",
  social_tiktok: "https://www.tiktok.com/@myes_fellowship",
  social_whatsapp: "https://chat.whatsapp.com/Fialpt9jLrCL0oLagStRTc",
  social_facebook: "",
  social_youtube: "",
  contact_email: "myesworship@gmail.com",
  contact_phone: "+62 822 9065 8336",
  contact_address: "Lorong Tuminting 1 A, Jalan Sea Malalayang 1 Barat, Manado",
  contact_schedule: "Every Friday, 17:30 WITA",
  contact_map_url: "https://maps.app.goo.gl/gqEXDHvSLFkn5LUc6",
  contact_map_embed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.6204589046138!2d124.80560197423821!3d1.4492102612499522!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32877544d235223b%3A0x216b2b2a129e1930!2sMG.Maru.Home!5e1!3m2!1sen!2sus!4v1782539996785!5m2!1sen!2sus",
  contact_area: "KEL. MARU - KIMBAL",
  contact_admin_name: "Billy",
};

/** Semua pengaturan situs (dideduplikasi per request). Tidak pernah melempar error. */
export const getSite = cache(async (lang = "en") => {
  let rows = [];
  try {
    rows = await prisma.setting.findMany();
  } catch (e) {
    console.error("[site] gagal memuat settings:", e?.message);
  }
  const raw = {};
  for (const r of rows) raw[r.key] = { en: r.valueEn || "", id: r.valueId || "" };
  const get = (key) => {
    const v = raw[key];
    const val = v ? (lang === "id" ? v.id || v.en : v.en) : "";
    return val || FALLBACK[key] || "";
  };
  const phone = get("contact_phone");
  return {
    get,
    accent: safeAccent(raw.theme_accent?.en),
    mainBackground: raw.main_background?.en || "",
    socials: {
      instagram: get("social_instagram"),
      tiktok: get("social_tiktok"),
      whatsapp: get("social_whatsapp"),
      facebook: get("social_facebook"),
      youtube: get("social_youtube"),
    },
    contact: {
      email: get("contact_email"),
      phone,
      phoneDigits: phone.replace(/\D/g, "").replace(/^0/, "62"),
      address: get("contact_address"),
      schedule: get("contact_schedule"),
      mapUrl: get("contact_map_url"),
      mapEmbed: get("contact_map_embed"),
      area: get("contact_area"),
      adminName: get("contact_admin_name"),
    },
  };
});
