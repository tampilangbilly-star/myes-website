"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Icon from "../Icon";
import SortableGrid from "./SortableGrid";
import { AdminTitle } from "./ResourceList";
import { api } from "./api";
import { useUI } from "./UIProvider";

/** Hero slider: seret untuk mengurutkan (tersimpan otomatis), aktif/nonaktif, ubah, hapus. */
export default function SlidesManager({ rows }) {
  const router = useRouter();
  const { toast, confirm } = useUI();
  const [items, setItems] = useState(rows);
  const [saving, setSaving] = useState(false);

  async function reorder(next) {
    const prev = items;
    setItems(next);
    setSaving(true);
    try {
      await api("/api/slides/reorder", { method: "PUT", body: { ids: next.map((s) => s.id) } });
      toast("Urutan slide disimpan.");
      router.refresh();
    } catch (err) {
      setItems(prev);
      toast(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  async function toggle(s) {
    setItems((xs) => xs.map((x) => (x.id === s.id ? { ...x, isActive: !x.isActive } : x)));
    try {
      await api(`/api/slides/${s.id}`, { method: "PUT", body: { ...s, isActive: !s.isActive } });
      toast(s.isActive ? "Slide disembunyikan." : "Slide ditampilkan.");
      router.refresh();
    } catch (err) {
      setItems((xs) => xs.map((x) => (x.id === s.id ? { ...x, isActive: s.isActive } : x)));
      toast(err.message, "error");
    }
  }

  async function remove(s) {
    if (!(await confirm({ title: `Hapus slide "${s.titleEn}"?`, message: "Slide yang dihapus tidak bisa dikembalikan." }))) return;
    try {
      await api(`/api/slides/${s.id}`, { method: "DELETE" });
      setItems((xs) => xs.filter((x) => x.id !== s.id));
      toast("Slide dihapus.");
      router.refresh();
    } catch (err) {
      toast(err.message, "error");
    }
  }

  return (
    <>
      <AdminTitle
        title="Hero Slider"
        subtitle={saving ? "Menyimpan urutan…" : "Seret ⠿ untuk mengubah urutan. Di HP: tahan pegangan sebentar, lalu geser."}
        action={
          <Link href="/admin/slides/new" className="btn-primary">
            <Icon name="plus" size={18} /> Tambah slide
          </Link>
        }
      />
      {items.length === 0 ? (
        <div className="card px-6 py-14 text-center">
          <p className="font-bold">Belum ada slide</p>
          <p className="mt-1 text-sm text-ink-muted">Website menampilkan slide bawaan sampai Anda menambah slide.</p>
        </div>
      ) : (
        <SortableGrid
          items={items}
          onReorder={reorder}
          renderItem={(s, handle) => {
            const img = s.backgroundImage || s.image;
            const pos = items.findIndex((x) => x.id === s.id) + 1;
            return (
              <div className={clsx("card flex items-center gap-2 p-2 pr-3 sm:gap-3", !s.isActive && "opacity-70")}>
                {handle}
                <span className="w-5 text-center font-display text-sm font-bold text-ink-soft">{pos}</span>
                <span className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg bg-primary-soft sm:h-16 sm:w-28">
                  {img ? <img src={img} alt="" className="h-full w-full object-cover" /> : <Icon name="image" className="absolute inset-0 m-auto text-primary" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{s.titleEn}</p>
                  <p className="truncate text-xs text-ink-soft">{s.overlineEn || s.type}</p>
                  <button type="button" onClick={() => toggle(s)} className={clsx("mt-1 inline-flex min-h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-bold", s.isActive ? "bg-success/10 text-success" : "bg-ink/5 text-ink-soft")}>
                    <span className={clsx("h-2 w-2 rounded-full", s.isActive ? "bg-success" : "bg-ink-soft")} /> {s.isActive ? "Aktif" : "Nonaktif"}
                  </button>
                </div>
                <div className="flex shrink-0 flex-col sm:flex-row">
                  <Link href={`/admin/slides/${s.id}`} className="icon-btn" aria-label={`Ubah ${s.titleEn}`}>
                    <Icon name="edit" size={18} />
                  </Link>
                  <button type="button" onClick={() => remove(s)} className="icon-btn hover:bg-danger/10 hover:text-danger" aria-label={`Hapus ${s.titleEn}`}>
                    <Icon name="trash" size={18} />
                  </button>
                </div>
              </div>
            );
          }}
        />
      )}
    </>
  );
}
