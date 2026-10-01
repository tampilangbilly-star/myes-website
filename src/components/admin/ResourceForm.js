"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import Icon from "../Icon";
import { RESOURCES } from "./resources";
import { ImageField, ImagesField } from "./ImageFields";
import { api } from "./api";
import { useUI } from "./UIProvider";

function initialValues(cfg, item) {
  const base = { ...(cfg.defaults || {}) };
  for (const f of cfg.fields) if (base[f.name] === undefined) base[f.name] = f.type === "toggle" ? false : f.type === "images" ? [] : "";
  if (!item) return base;
  const loaded = cfg.fromItem ? cfg.fromItem(item) : item;
  const v = { ...base };
  for (const f of cfg.fields) v[f.name] = loaded[f.name] ?? base[f.name];
  return v;
}

function validate(cfg, v) {
  const e = {};
  for (const f of cfg.fields) {
    const val = v[f.name];
    if (f.required && (val === "" || val === null || val === undefined || (Array.isArray(val) && !val.length))) e[f.name] = `${f.label} wajib diisi.`;
    if (f.name === "buttonLink" && val && !/^(https?:\/\/|\/|#|mailto:|tel:)/.test(val)) e[f.name] = "Link harus diawali /, https:// atau #.";
    if (f.name === "video" && val && !/^https:\/\//.test(val)) e[f.name] = "Link video harus diawali https://";
  }
  return { ...e, ...(cfg.validate ? cfg.validate(v) : {}) };
}

/**
 * Form generik tambah/ubah data. Validasi di browser + di server (zod),
 * error per field, pratinjau foto sebelum upload, konfirmasi hapus, toast berhasil/gagal.
 * mode "page" → kembali ke daftar setelah simpan; mode "sheet" → panggil onDone.
 */
export default function ResourceForm({ resource, item = null, onDone, onCancel }) {
  const cfg = RESOURCES[resource];
  const router = useRouter();
  const { toast, confirm } = useUI();
  const [values, setValues] = useState(() => initialValues(cfg, item));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(0);
  const [dirty, setDirty] = useState(false);
  const isEdit = Boolean(item?.id);

  const set = (name, val) => {
    setValues((v) => ({ ...v, [name]: val }));
    setDirty(true);
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };
  const busy = (b) => setUploading((n) => Math.max(0, n + (b ? 1 : -1)));

  async function onSubmit(e) {
    e.preventDefault();
    const errs = validate(cfg, values);
    setErrors(errs);
    const firstErr = cfg.fields.find((f) => errs[f.name]);
    if (firstErr) {
      toast("Periksa kembali isian yang ditandai merah.", "error");
      document.getElementById(`f-${firstErr.name}`)?.focus();
      return;
    }
    setSaving(true);
    try {
      const payload = cfg.toApi ? cfg.toApi(values) : values;
      const saved = await api(isEdit ? `${cfg.api}/${item.id}` : cfg.api, { method: isEdit ? "PUT" : "POST", body: payload });
      toast(isEdit ? `${cfg.singular} berhasil diperbarui.` : `${cfg.singular} berhasil ditambahkan.`);
      setDirty(false);
      if (onDone) onDone(saved);
      else {
        router.push(cfg.base);
        router.refresh();
      }
    } catch (err) {
      // Tampilkan error dari server di field yang bersangkutan
      const fieldErrs = {};
      for (const is of err.issues || []) if (is.path?.[0]) fieldErrs[is.path[0]] = is.message;
      setErrors((x) => ({ ...x, ...fieldErrs }));
      toast(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    const ok = await confirm({ title: `Hapus ${cfg.singular.toLowerCase()} ini?`, message: "Data yang dihapus tidak bisa dikembalikan." });
    if (!ok) return;
    try {
      await api(`${cfg.api}/${item.id}`, { method: "DELETE" });
      toast(`${cfg.singular} dihapus.`);
      if (onDone) onDone(null);
      else {
        router.push(cfg.base);
        router.refresh();
      }
    } catch (err) {
      toast(err.message, "error");
    }
  }

  const cancel = async () => {
    if (dirty && !(await confirm({ title: "Buang perubahan?", message: "Perubahan yang belum disimpan akan hilang.", confirmText: "Buang", danger: true }))) return;
    if (onCancel) onCancel();
    else router.push(cfg.base);
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
        {cfg.fields.map((f) => {
          const err = errors[f.name];
          const common = {
            id: `f-${f.name}`,
            "aria-invalid": Boolean(err),
            "aria-describedby": err ? `e-${f.name}` : f.hint ? `h-${f.name}` : undefined,
          };
          const wide = !f.half || f.type === "image" || f.type === "images" || f.type === "textarea";
          const isPair = /(En|Id)$/.test(f.name) && f.type !== "textarea" ? true : false;
          return (
            <div key={f.name} className={clsx(wide && !isPair && "sm:col-span-2")}>
              {f.type === "toggle" ? (
                <label htmlFor={common.id} className="flex min-h-12 cursor-pointer items-center justify-between gap-4 rounded-xl border border-line bg-surface px-4">
                  <span className="text-sm font-semibold">{f.label}</span>
                  <span className="relative inline-flex">
                    <input {...common} type="checkbox" className="peer sr-only" checked={Boolean(values[f.name])} onChange={(e) => set(f.name, e.target.checked)} />
                    <span className="h-7 w-12 rounded-full bg-ink/20 transition peer-checked:bg-primary peer-focus-visible:ring-4 peer-focus-visible:ring-primary/25" />
                    <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                  </span>
                </label>
              ) : (
                <>
                  <label htmlFor={common.id} className="label">
                    {f.label} {f.required && <span className="text-danger">*</span>}
                  </label>
                  {f.type === "textarea" ? (
                    <textarea {...common} rows={f.rows || 4} placeholder={f.placeholder} value={values[f.name] ?? ""} onChange={(e) => set(f.name, e.target.value)} className={clsx("field resize-y", err && "field-error")} />
                  ) : f.type === "select" ? (
                    <select {...common} value={values[f.name] ?? ""} onChange={(e) => set(f.name, e.target.value)} className={clsx("field", err && "field-error")}>
                      {f.options.map(([v, l]) => (
                        <option key={v} value={v}>
                          {l}
                        </option>
                      ))}
                    </select>
                  ) : f.type === "image" ? (
                    <ImageField id={common.id} value={values[f.name]} onChange={(v) => set(f.name, v)} folder={cfg.folder} invalid={Boolean(err)} onBusy={busy} />
                  ) : f.type === "images" ? (
                    <ImagesField id={common.id} value={values[f.name]} onChange={(v) => set(f.name, v)} folder={cfg.folder} max={f.max || 20} onBusy={busy} />
                  ) : (
                    <input
                      {...common}
                      type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                      inputMode={f.type === "number" ? "numeric" : undefined}
                      min={f.type === "number" ? 0 : undefined}
                      placeholder={f.placeholder}
                      value={values[f.name] ?? ""}
                      onChange={(e) => set(f.name, e.target.value)}
                      className={clsx("field", err && "field-error")}
                    />
                  )}
                  {err ? (
                    <p id={`e-${f.name}`} className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-danger">
                      <Icon name="alert" size={14} /> {err}
                    </p>
                  ) : (
                    f.hint && (
                      <p id={`h-${f.name}`} className="hint">
                        {f.hint}
                      </p>
                    )
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Tombol aksi: menempel di bawah layar HP agar selalu terjangkau jempol */}
      <div className="sticky bottom-[calc(64px+env(safe-area-inset-bottom))] z-10 -mx-4 flex flex-wrap items-center gap-2 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none lg:bottom-0">
        <button type="submit" disabled={saving || uploading > 0} className="btn-primary flex-1 sm:flex-none sm:px-8">
          <Icon name="check" size={18} /> {saving ? "Menyimpan…" : uploading ? "Menunggu upload…" : "Simpan"}
        </button>
        {onCancel || !cfg.base ? (
          <button type="button" onClick={cancel} className="btn-outline">
            Batal
          </button>
        ) : (
          <Link href={cfg.base} onClick={(e) => dirty && (e.preventDefault(), cancel())} className="btn-outline">
            Batal
          </Link>
        )}
        {isEdit && (
          <button type="button" onClick={onDelete} className="btn-ghost text-danger hover:bg-danger/10 hover:text-danger sm:ml-auto">
            <Icon name="trash" size={18} /> Hapus
          </button>
        )}
      </div>
    </form>
  );
}
