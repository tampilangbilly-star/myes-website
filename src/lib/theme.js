/**
 * Pilihan warna aksen (semua lolos WCAG AA: teks putih di atas warna primer >= 5:1,
 * warna primer di atas latar #F8FAFC >= 4.7:1). Nilai RGB dipakai CSS variables di globals.css.
 */
export const ACCENTS = [
  { id: "blue", label: "Biru", labelEn: "Blue", hex: "#2563EB" },
  { id: "teal", label: "Teal", labelEn: "Teal", hex: "#0F766E" },
  { id: "purple", label: "Ungu", labelEn: "Purple", hex: "#7C3AED" },
  { id: "orange", label: "Oranye", labelEn: "Orange", hex: "#C2410C" },
  { id: "green", label: "Hijau", labelEn: "Green", hex: "#15803D" },
];

export const ACCENT_IDS = ACCENTS.map((a) => a.id);
export const DEFAULT_ACCENT = "blue";
export const ACCENT_STORAGE_KEY = "myes-accent";

export function safeAccent(value) {
  return ACCENT_IDS.includes(value) ? value : DEFAULT_ACCENT;
}

/**
 * Skrip kecil yang dijalankan di <head> SEBELUM halaman dirender:
 * membaca pilihan pengunjung dari localStorage agar tidak ada kedipan warna.
 */
export function themeInitScript() {
  return `(function(){try{var d=document.documentElement;var ok=${JSON.stringify(ACCENT_IDS)};var a=localStorage.getItem(${JSON.stringify(
    ACCENT_STORAGE_KEY,
  )});if(a&&ok.indexOf(a)>-1){d.setAttribute('data-accent',a);}}catch(e){}})();`;
}
