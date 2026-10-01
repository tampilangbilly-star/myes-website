"use client";
import { useRef, useState } from "react";
import clsx from "clsx";
import Icon from "../Icon";
import { uploadImage } from "./api";
import { useUI } from "./UIProvider";

const MAX_MB = 8;

function checkFile(file) {
  if (!file.type.startsWith("image/")) return `${file.name}: bukan file gambar.`;
  if (file.size > MAX_MB * 1024 * 1024) return `${file.name}: ukuran maksimal ${MAX_MB} MB.`;
  return null;
}

/** Satu foto: pratinjau langsung sebelum/selama upload, ganti, hapus. */
export function ImageField({ id, value, onChange, folder, invalid, onBusy }) {
  const input = useRef(null);
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const { toast } = useUI();

  async function pick(file) {
    if (!file) return;
    const err = checkFile(file);
    if (err) return toast(err, "error");
    const local = URL.createObjectURL(file);
    setPreview(local);
    setBusy(true);
    onBusy?.(true);
    try {
      onChange(await uploadImage(file, folder));
      toast("Foto berhasil diunggah.");
    } catch (e) {
      toast(e.message, "error");
    } finally {
      URL.revokeObjectURL(local);
      setPreview(null);
      setBusy(false);
      onBusy?.(false);
      if (input.current) input.current.value = "";
    }
  }

  const shown = preview || value;
  return (
    <div
      className={clsx("rounded-2xl border-2 border-dashed p-3 transition", invalid ? "border-danger/60" : "border-line hover:border-primary/40")}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        pick(e.dataTransfer.files?.[0]);
      }}
    >
      <input ref={input} id={id} type="file" accept="image/*" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
      {shown ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-bg sm:w-56">
            <img src={shown} alt="Pratinjau" className="h-full w-full object-contain" />
            {busy && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm font-semibold text-ink">
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" /> Mengunggah…
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-outline btn-sm" disabled={busy} onClick={() => input.current?.click()}>
              <Icon name="upload" size={16} /> Ganti foto
            </button>
            <button type="button" className="btn-ghost btn-sm text-danger hover:bg-danger/10 hover:text-danger" disabled={busy} onClick={() => onChange("")}>
              <Icon name="trash" size={16} /> Hapus
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => input.current?.click()} className="flex w-full flex-col items-center justify-center gap-2 rounded-xl py-8 text-center text-sm text-ink-muted hover:bg-primary-soft/50">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <Icon name="upload" size={22} />
          </span>
          <span>
            <strong className="text-primary-strong">Pilih foto</strong> atau seret ke sini
          </span>
          <span className="text-xs text-ink-soft">JPG, PNG, WebP · maks {MAX_MB} MB · otomatis dikompres</span>
        </button>
      )}
    </div>
  );
}

/** Banyak foto: unggah sekaligus, urutkan (geser kiri/kanan), hapus satu per satu. */
export function ImagesField({ id, value = [], onChange, folder, max = 20, onBusy }) {
  const input = useRef(null);
  const [pending, setPending] = useState([]);
  const { toast } = useUI();
  const list = Array.isArray(value) ? value : [];

  async function pick(files) {
    const arr = Array.from(files || []);
    if (!arr.length) return;
    const room = max - list.length;
    if (room <= 0) return toast(`Maksimal ${max} foto.`, "error");
    const chosen = arr.slice(0, room);
    if (arr.length > room) toast(`Hanya ${room} foto pertama yang diunggah (maks ${max}).`, "error");
    const valid = [];
    for (const f of chosen) {
      const err = checkFile(f);
      if (err) toast(err, "error");
      else valid.push({ file: f, url: URL.createObjectURL(f) });
    }
    if (!valid.length) return;
    setPending(valid.map((v) => v.url));
    onBusy?.(true);
    const uploaded = [];
    let failed = 0;
    // Unggah 3 sekaligus agar cepat tapi tidak membebani server
    for (let i = 0; i < valid.length; i += 3) {
      const res = await Promise.allSettled(valid.slice(i, i + 3).map((v) => uploadImage(v.file, folder)));
      res.forEach((r) => (r.status === "fulfilled" ? uploaded.push(r.value) : failed++));
    }
    valid.forEach((v) => URL.revokeObjectURL(v.url));
    setPending([]);
    onBusy?.(false);
    if (input.current) input.current.value = "";
    onChange([...list, ...uploaded]);
    if (uploaded.length) toast(`${uploaded.length} foto berhasil diunggah.`);
    if (failed) toast(`${failed} foto gagal diunggah.`, "error");
  }

  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div
      className="rounded-2xl border-2 border-dashed border-line p-3"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        pick(e.dataTransfer.files);
      }}
    >
      <input ref={input} id={id} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => pick(e.target.files)} />
      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {list.map((src, i) => (
          <li key={src + i} className="group relative aspect-square overflow-hidden rounded-xl bg-bg">
            <img src={src} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
            {i === 0 && <span className="absolute left-1 top-1 rounded-md bg-primary px-1.5 text-[10px] font-bold text-white">Utama</span>}
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-ink/70 to-transparent p-1">
              <span className="flex">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="flex h-8 w-8 items-center justify-center rounded-lg text-white hover:bg-white/20 disabled:opacity-30" aria-label="Geser ke kiri">
                  <Icon name="chevron-left" size={16} />
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === list.length - 1} className="flex h-8 w-8 items-center justify-center rounded-lg text-white hover:bg-white/20 disabled:opacity-30" aria-label="Geser ke kanan">
                  <Icon name="chevron-right" size={16} />
                </button>
              </span>
              <button type="button" onClick={() => onChange(list.filter((_, k) => k !== i))} className="flex h-8 w-8 items-center justify-center rounded-lg text-white hover:bg-danger" aria-label={`Hapus foto ${i + 1}`}>
                <Icon name="trash" size={15} />
              </button>
            </div>
          </li>
        ))}
        {pending.map((src) => (
          <li key={src} className="relative aspect-square overflow-hidden rounded-xl bg-bg">
            <img src={src} alt="" className="h-full w-full object-cover opacity-60" />
            <span className="absolute inset-0 m-auto h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </li>
        ))}
        {list.length + pending.length < max && (
          <li>
            <button type="button" onClick={() => input.current?.click()} disabled={pending.length > 0} className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-xl bg-primary-soft/60 text-xs font-semibold text-primary-strong transition hover:bg-primary-soft disabled:opacity-50">
              <Icon name="plus" size={22} /> Tambah foto
            </button>
          </li>
        )}
      </ul>
      <p className="hint mt-2">
        {list.length}/{max} foto · bisa pilih banyak sekaligus atau seret ke kotak ini
      </p>
    </div>
  );
}
