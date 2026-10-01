/** Ambil ID YouTube dari link apa pun (youtu.be, watch?v=, shorts, embed) atau ID langsung. */
export function youtubeId(input) {
  const v = String(input || "").trim();
  if (!v) return "";
  const m = v.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{6,})/);
  if (m) return m[1];
  return /^[A-Za-z0-9_-]{6,}$/.test(v) ? v : "";
}
