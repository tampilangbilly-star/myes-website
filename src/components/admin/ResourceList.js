"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Icon from "../Icon";
import { RESOURCES } from "./resources";
import { api } from "./api";
import { useUI } from "./UIProvider";
import ResourceForm from "./ResourceForm";
import Sheet from "./Sheet";

const PAGE_SIZE = 10;

/**
 * Daftar data admin: tabel di desktop, kartu di HP. Ada pencarian, filter, halaman,
 * aktif/nonaktif cepat, hapus dengan konfirmasi. Jika resource tidak punya halaman form
 * sendiri (cfg.base kosong), tambah/ubah dilakukan di panel samping (sheet).
 */
export default function ResourceList({ resource, rows: initialRows }) {
  const cfg = RESOURCES[resource];
  const router = useRouter();
  const { toast, confirm } = useUI();
  const [rows, setRows] = useState(initialRows);
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null); // null | "new" | row

  // Sinkron bila server mengirim data baru (router.refresh)
  const [lastInitial, setLastInitial] = useState(initialRows);
  if (lastInitial !== initialRows) {
    setLastInitial(initialRows);
    setRows(initialRows);
  }

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (needle && !JSON.stringify([cfg.primary(r), cfg.secondary?.(r), r.titleId, r.name, r.roleId]).toLowerCase().includes(needle)) return false;
      for (const [k, v] of Object.entries(filters)) if (v !== "" && v !== undefined && String(r[k]) !== v) return false;
      return true;
    });
  }, [rows, q, filters, cfg]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const hasActive = cfg.fields.some((f) => f.name === "isActive");

  async function toggle(row) {
    const base = cfg.fromItem ? cfg.fromItem(row) : row;
    const payload = { ...(cfg.toApi ? cfg.toApi(base) : base), isActive: !row.isActive };
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, isActive: !r.isActive } : r)));
    try {
      await api(`${cfg.api}/${row.id}`, { method: "PUT", body: payload });
      toast(!row.isActive ? "Ditampilkan di website." : "Disembunyikan dari website.");
      router.refresh();
    } catch (err) {
      setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, isActive: row.isActive } : r)));
      toast(err.message, "error");
    }
  }

  async function remove(row) {
    const ok = await confirm({ title: `Hapus "${cfg.primary(row)}"?`, message: "Data yang dihapus tidak bisa dikembalikan." });
    if (!ok) return;
    try {
      await api(`${cfg.api}/${row.id}`, { method: "DELETE" });
      setRows((rs) => rs.filter((r) => r.id !== row.id));
      toast(`${cfg.singular} dihapus.`);
      router.refresh();
    } catch (err) {
      toast(err.message, "error");
    }
  }

  const editHref = (row) => (cfg.base ? `${cfg.base}/${row.id}` : null);
  const openNew = () => setEditing("new");
  const onSaved = (saved) => {
    if (saved) setRows((rs) => (rs.some((r) => r.id === saved.id) ? rs.map((r) => (r.id === saved.id ? saved : r)) : [saved, ...rs]));
    else if (editing && editing !== "new") setRows((rs) => rs.filter((r) => r.id !== editing.id));
    setEditing(null);
    router.refresh();
  };

  const thumb = (row, size = "h-12 w-12") => {
    const src = cfg.thumb?.(row);
    return (
      <span className={clsx("relative flex shrink-0 items-center justify-center overflow-hidden bg-primary-soft text-primary", size, cfg.round ? "rounded-full" : "rounded-xl")}>
        {src ? <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" /> : <Icon name={cfg.icon || "image"} size={20} />}
      </span>
    );
  };
  const status = (row) =>
    hasActive ? (
      <button type="button" onClick={() => toggle(row)} className={clsx("inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-xs font-bold transition", row.isActive ? "bg-success/10 text-success hover:bg-success/20" : "bg-ink/5 text-ink-soft hover:bg-ink/10")} aria-label={row.isActive ? "Sembunyikan dari website" : "Tampilkan di website"}>
        <span className={clsx("h-2 w-2 rounded-full", row.isActive ? "bg-success" : "bg-ink-soft")} /> {row.isActive ? "Aktif" : "Nonaktif"}
      </button>
    ) : null;
  const actions = (row) => (
    <div className="flex items-center justify-end gap-1">
      {editHref(row) ? (
        <Link href={editHref(row)} className="icon-btn" aria-label={`Ubah ${cfg.primary(row)}`}>
          <Icon name="edit" size={18} />
        </Link>
      ) : (
        <button type="button" onClick={() => setEditing(row)} className="icon-btn" aria-label={`Ubah ${cfg.primary(row)}`}>
          <Icon name="edit" size={18} />
        </button>
      )}
      <button type="button" onClick={() => remove(row)} className="icon-btn hover:bg-danger/10 hover:text-danger" aria-label={`Hapus ${cfg.primary(row)}`}>
        <Icon name="trash" size={18} />
      </button>
    </div>
  );

  return (
    <div>
      <AdminTitle
        title={cfg.title}
        subtitle={`${rows.length} data`}
        action={
          cfg.base ? (
            <Link href={`${cfg.base}/new`} className="btn-primary">
              <Icon name="plus" size={18} /> Tambah
            </Link>
          ) : (
            <button type="button" onClick={openNew} className="btn-primary">
              <Icon name="plus" size={18} /> Tambah
            </button>
          )
        }
      />

      {/* Cari & filter */}
      <div className="mb-4 grid grid-cols-2 gap-2 sm:flex">
        <label className="relative col-span-2 flex-1">
          <span className="sr-only">Cari</span>
          <Icon name="search" size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            type="search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder={`Cari ${cfg.title.toLowerCase()}…`}
            className="field pl-10"
          />
        </label>
        {(cfg.filters || []).map((f) => (
          <label key={f.key} className={clsx("sm:w-48", cfg.filters.length === 1 && "col-span-2")}>
            <span className="sr-only">{f.label}</span>
            <select
              value={filters[f.key] ?? ""}
              onChange={(e) => {
                setFilters((x) => ({ ...x, [f.key]: e.target.value }));
                setPage(1);
              }}
              className="field"
            >
              <option value="">Semua {f.label.toLowerCase()}</option>
              {f.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card flex flex-col items-center px-6 py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <Icon name={rows.length ? "search" : "inbox"} size={26} />
          </span>
          <p className="mt-4 font-bold">{rows.length ? "Tidak ada yang cocok" : `Belum ada ${cfg.title.toLowerCase()}`}</p>
          <p className="mt-1 text-sm text-ink-muted">{rows.length ? "Coba kata kunci atau filter lain." : "Klik tombol Tambah untuk membuat data pertama."}</p>
        </div>
      ) : (
        <>
          {/* HP: kartu */}
          <ul className="space-y-2 md:hidden">
            {visible.map((row) => (
              <li key={row.id} className="card flex items-center gap-3 p-3">
                {thumb(row, "h-14 w-14")}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{cfg.primary(row)}</p>
                  {cfg.secondary && <p className="truncate text-xs text-ink-soft">{cfg.secondary(row)}</p>}
                  <div className="mt-1">
                    {status(row)}
                  </div>
                </div>
                {actions(row)}
              </li>
            ))}
          </ul>

          {/* Desktop: tabel */}
          <div className="card hidden overflow-hidden md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-bg/60 text-xs font-bold uppercase tracking-wider text-ink-soft">
                <tr>
                  <th className="px-4 py-3">{cfg.singular}</th>
                  <th className="px-4 py-3">Keterangan</th>
                  {hasActive && <th className="px-4 py-3">Status</th>}
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {visible.map((row) => (
                  <tr key={row.id} className="transition hover:bg-bg/60">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        {thumb(row)}
                        <span className="line-clamp-2 font-semibold">{cfg.primary(row)}</span>
                      </div>
                    </td>
                    <td className="max-w-xs px-4 py-2.5 text-ink-muted">
                      <span className="line-clamp-2">{cfg.secondary?.(row)}</span>
                    </td>
                    {hasActive && (
                      <td className="px-4 py-2.5">
                        {status(row)}
                      </td>
                    )}
                    <td className="px-4 py-2.5">
                      {actions(row)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <nav className="mt-4 flex items-center justify-between gap-3" aria-label="Halaman">
              <p className="text-sm text-ink-soft">
                {(current - 1) * PAGE_SIZE + 1}–{Math.min(current * PAGE_SIZE, filtered.length)} dari {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button type="button" className="icon-btn border border-line bg-surface" disabled={current === 1} onClick={() => setPage(current - 1)} aria-label="Halaman sebelumnya">
                  <Icon name="chevron-left" />
                </button>
                <span className="px-2 text-sm font-semibold tabular-nums">
                  {current}/{pages}
                </span>
                <button type="button" className="icon-btn border border-line bg-surface" disabled={current === pages} onClick={() => setPage(current + 1)} aria-label="Halaman berikutnya">
                  <Icon name="chevron-right" />
                </button>
              </div>
            </nav>
          )}
        </>
      )}

      {editing && (
        <Sheet title={editing === "new" ? `Tambah ${cfg.singular}` : `Ubah ${cfg.singular}`} onClose={() => setEditing(null)}>
          <ResourceForm resource={resource} item={editing === "new" ? null : editing} onDone={onSaved} onCancel={() => setEditing(null)} />
        </Sheet>
      )}
    </div>
  );
}

export function AdminTitle({ title, subtitle, action, back }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3 sm:mb-6">
      <div className="min-w-0">
        {back && (
          <Link href={back.href} className="mb-2 inline-flex min-h-9 items-center gap-1 text-sm font-semibold text-ink-muted hover:text-primary">
            <Icon name="chevron-left" size={16} /> {back.label}
          </Link>
        )}
        <h1 className="text-2xl font-extrabold sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
