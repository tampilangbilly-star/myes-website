/** Jalankan query Prisma; bila database bermasalah, halaman tetap tampil dengan nilai cadangan. */
export async function safe(promise, fallback = []) {
  try {
    return await promise;
  } catch (e) {
    console.error("[data]", e?.message);
    return fallback;
  }
}
