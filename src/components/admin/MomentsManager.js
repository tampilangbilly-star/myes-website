"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Icon from "../Icon";
import SortableGrid from "./SortableGrid";
import { AdminTitle } from "./ResourceList";
import { api, uploadImage } from "./api";
import { useUI } from "./UIProvider";

/** Momen Beranda: foto tanpa keterangan untuk slider di beranda. Unggah banyak, seret urutan, sembunyikan, hapus. */
export default function MomentsManager({ rows }) {
  const router = useRouter();
  const { toast, confirm } = useUI();
  const [items, setItems] = useState(rows);
  const [uploading, setUploading] = useState(0);
  const input = useRef(null);

  async function add(files) {
    const list = Array.from(files || []).filter((f) => f.type.startsWith("image/"));
    if (!list.length) return;
    setUploading(list.length);
    let ok = 0;
    for (const f of list) {
      try {
        const url = await uploadImage(f, "moments");
        const created = await api("/api/home-moments", { method: "POST", body: { image: url, sortOrder: items.length + ok, isActive: true } });
        setItems((xs) => [...xs, created]);
        ok++;
      } catch (err) {
        toast(`${f.name}: ${err.message}`, "error");
      }
      setUploading((n) => n - 1);
    }
    if (input.current) input.current.value = "";
    if (ok) toast(`${ok} foto ditambahkan.`);
    router.refresh();
  }

  async function reorder(next) {
    const prev = items;
    setItems(next);
    try {
      await api("/api/home-moments/reorder", { method: "PUT", body: { ids: next.map((x) => x.id) } });
      toast("Urutan disimpan.");
    } catch (err) {
      setItems(prev);
      toast(err.message, "error");
    }
  }

  async function toggle(m) {
    try {
      const saved = await api(`/api/home-moments/${m.id}`, { method: "PUT", body: { ...m, isActive: !m.isActive } });
      setItems((xs) => xs.map((x) => (x.id === m.id ? saved : x)));
      toast(m.isActive ? "Foto disembunyikan." : "Foto ditampilkan.");
    } catch (err) {
      toast(err.message, "error");
    }
  }

  async function remove(m) {
    if (!(await confirm({ title: "Hapus foto ini?", message: "Foto akan hilang dari beranda." }))) return;
    try {
      await api(`/api/home-moments/${m.id}`, { method: "DELETE" });
      setItems((xs) => xs.filter((x) => x.id !== m.id));
      toast("Foto dihapus.");
    } catch (err) {
      toast(err.message, "error");
    }
  }

  return (
    <>
      <AdminTitle
        title="Momen Beranda"
        subtitle="Foto kegiatan tanpa keterangan, tampil sebagai slider “Sepekan di M-YES” di beranda. Seret untuk mengurutkan."
        action={
          <>
            <input ref={input} type="file" accept="image/*" multiple className="sr-only" id="moments-upload" onChange={(e) => add(e.target.files)} />
            <label htmlFor="moments-upload" className={clsx("btn-primary cursor-pointer", uploading && "pointer-events-none opacity-60")}>
              <Icon name="upload" size={18} /> {uploading ? `Mengunggah (${uploading})…` : "Unggah foto"}
            </label>
          </>
        }
      />
      {items.length === 0 ? (
        <label htmlFor="moments-upload" className="card flex cursor-pointer flex-col items-center border-2 border-dashed px-6 py-14 text-center hover:border-primary/40">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <Icon name="camera" size={26} />
          </span>
          <p className="mt-4 font-bold">Belum ada foto</p>
          <p className="mt-1 text-sm text-ink-muted">Klik untuk mengunggah beberapa foto sekaligus.</p>
        </label>
      ) : (
        <SortableGrid
          items={items}
          onReorder={reorder}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
          renderItem={(m, handle) => (
            <div className={clsx("card overflow-hidden", !m.isActive && "opacity-60")}>
              <div className="relative aspect-[4/3] bg-bg">
                <img src={m.image} alt="" className="h-full w-full object-cover" />
                <div className="absolute left-1 top-1 rounded-xl bg-white/90">{handle}</div>
              </div>
              <div className="flex items-center justify-between p-1.5">
                <button type="button" onClick={() => toggle(m)} className={clsx("inline-flex min-h-9 items-center gap-1.5 rounded-full px-2.5 text-xs font-bold", m.isActive ? "text-success" : "text-ink-soft")}>
                  <Icon name={m.isActive ? "eye" : "eye-off"} size={16} /> {m.isActive ? "Tampil" : "Sembunyi"}
                </button>
                <button type="button" onClick={() => remove(m)} className="icon-btn hover:bg-danger/10 hover:text-danger" aria-label="Hapus foto">
                  <Icon name="trash" size={18} />
                </button>
              </div>
            </div>
          )}
        />
      )}
    </>
  );
}
