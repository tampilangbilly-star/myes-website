/** fetch JSON untuk halaman admin: melempar Error dengan pesan ramah, sesi habis → ke halaman login. */
export async function api(url, { method = "GET", body } = {}) {
  let res;
  try {
    res = await fetch(url, {
      method,
      headers: body instanceof FormData ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
    });
  } catch {
    throw new Error("Koneksi terputus. Periksa internet Anda lalu coba lagi.");
  }
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    // Muat ulang penuh agar sesi & cookie bersih
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign(`/admin/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
    throw new Error("Sesi berakhir. Silakan login ulang.");
  }
  if (!res.ok) {
    const err = new Error(data.error || "Terjadi kesalahan. Coba lagi.");
    err.issues = data.issues || [];
    throw err;
  }
  return data;
}

export async function uploadImage(file, folder = "uploads") {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", folder);
  const data = await api("/api/upload", { method: "POST", body: fd });
  return data.url;
}
