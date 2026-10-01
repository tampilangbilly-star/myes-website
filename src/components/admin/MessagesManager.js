"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Icon from "../Icon";
import { AdminTitle } from "./ResourceList";
import { api } from "./api";
import { useUI } from "./UIProvider";

const fmt = (v) => new Date(v).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Makassar" });

/** Pesan dari formulir kontak: baca/tandai, balas via email, hapus. */
export default function MessagesManager({ rows }) {
  const router = useRouter();
  const { toast, confirm } = useUI();
  const [items, setItems] = useState(rows);
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(null);

  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return items.filter((m) => (filter === "unread" ? !m.isRead : filter === "read" ? m.isRead : true) && (!n || `${m.name} ${m.email} ${m.message}`.toLowerCase().includes(n)));
  }, [items, filter, q]);
  const unread = items.filter((m) => !m.isRead).length;

  async function mark(m, isRead, silent = false) {
    setItems((xs) => xs.map((x) => (x.id === m.id ? { ...x, isRead } : x)));
    try {
      await api("/api/contact", { method: "PATCH", body: { id: m.id, isRead } });
      if (!silent) toast(isRead ? "Ditandai sudah dibaca." : "Ditandai belum dibaca.");
      router.refresh();
    } catch (err) {
      setItems((xs) => xs.map((x) => (x.id === m.id ? { ...x, isRead: m.isRead } : x)));
      toast(err.message, "error");
    }
  }

  async function remove(m) {
    if (!(await confirm({ title: `Hapus pesan dari ${m.name}?`, message: "Pesan yang dihapus tidak bisa dikembalikan." }))) return;
    try {
      await api(`/api/contact?id=${m.id}`, { method: "DELETE" });
      setItems((xs) => xs.filter((x) => x.id !== m.id));
      setOpen(null);
      toast("Pesan dihapus.");
      router.refresh();
    } catch (err) {
      toast(err.message, "error");
    }
  }

  const expand = (m) => {
    setOpen(open === m.id ? null : m.id);
    if (!m.isRead) mark(m, true, true);
  };

  return (
    <>
      <AdminTitle title="Pesan Masuk" subtitle={`${items.length} pesan · ${unread} belum dibaca`} />
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Cari pesan</span>
          <Icon name="search" size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama, email, atau isi…" className="field pl-10" />
        </label>
        <div className="flex rounded-xl bg-ink/5 p-1" role="group" aria-label="Filter pesan">
          {[
            ["all", "Semua"],
            ["unread", "Belum dibaca"],
            ["read", "Sudah dibaca"],
          ].map(([v, l]) => (
            <button key={v} type="button" aria-pressed={filter === v} onClick={() => setFilter(v)} className={clsx("min-h-10 flex-1 whitespace-nowrap rounded-lg px-3 text-sm font-semibold", filter === v ? "bg-surface text-primary-strong shadow-sm" : "text-ink-muted")}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="card px-6 py-14 text-center">
          <Icon name="inbox" size={32} className="mx-auto text-primary" />
          <p className="mt-3 font-bold">Tidak ada pesan</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {list.map((m) => (
            <li key={m.id} className={clsx("card overflow-hidden", !m.isRead && "border-primary/30")}>
              <button type="button" onClick={() => expand(m)} aria-expanded={open === m.id} className="flex w-full items-start gap-3 p-4 text-left">
                <span className={clsx("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", m.isRead ? "bg-transparent" : "bg-primary")} aria-label={m.isRead ? undefined : "Belum dibaca"} />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <span className={clsx("truncate", m.isRead ? "font-semibold" : "font-extrabold")}>{m.name}</span>
                    <span className="text-xs text-ink-soft">{fmt(m.createdAt)}</span>
                  </span>
                  <span className="block truncate text-sm text-ink-soft">{m.email}</span>
                  <span className={clsx("mt-1 block text-sm text-ink-muted", open === m.id ? "whitespace-pre-line" : "line-clamp-2")}>{m.message}</span>
                </span>
              </button>
              {open === m.id && (
                <div className="flex flex-wrap gap-2 border-t border-line bg-bg/60 px-4 py-3">
                  <a href={`mailto:${m.email}?subject=${encodeURIComponent("Balasan dari M-YES")}`} className="btn-primary btn-sm">
                    <Icon name="mail" size={16} /> Balas email
                  </a>
                  <button type="button" onClick={() => mark(m, !m.isRead)} className="btn-outline btn-sm">
                    <Icon name={m.isRead ? "eye-off" : "eye"} size={16} /> {m.isRead ? "Tandai belum dibaca" : "Tandai dibaca"}
                  </button>
                  <button type="button" onClick={() => remove(m)} className="btn-ghost btn-sm text-danger hover:bg-danger/10 hover:text-danger sm:ml-auto">
                    <Icon name="trash" size={16} /> Hapus
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
