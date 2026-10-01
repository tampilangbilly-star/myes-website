"use client";
import { useState } from "react";
import clsx from "clsx";
import Icon from "../Icon";
import { api } from "./api";
import { useUI } from "./UIProvider";

export default function PasswordForm() {
  const { toast } = useUI();
  const [v, setV] = useState({ current: "", next: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const errs = {};
    if (!v.current) errs.current = "Isi password lama.";
    if (v.next.length < 10) errs.next = "Password baru minimal 10 karakter.";
    if (v.next !== v.confirm) errs.confirm = "Konfirmasi password tidak sama.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSaving(true);
    try {
      await api("/api/account/password", { method: "POST", body: v });
      toast("Password berhasil diganti.");
      setV({ current: "", next: "", confirm: "" });
    } catch (err) {
      toast(err.message, "error");
      if (/lama/i.test(err.message)) setErrors({ current: err.message });
    } finally {
      setSaving(false);
    }
  }

  const field = (k, label, auto) => (
    <div>
      <label htmlFor={`pw-${k}`} className="label">
        {label}
      </label>
      <input id={`pw-${k}`} type={show ? "text" : "password"} autoComplete={auto} value={v[k]} onChange={(e) => setV((x) => ({ ...x, [k]: e.target.value }))} aria-invalid={Boolean(errors[k])} className={clsx("field", errors[k] && "field-error")} />
      {errors[k] && (
        <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-danger">
          <Icon name="alert" size={14} /> {errors[k]}
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {field("current", "Password lama", "current-password")}
      {field("next", "Password baru", "new-password")}
      {field("confirm", "Ulangi password baru", "new-password")}
      <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-ink-muted">
        <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} className="h-5 w-5 accent-[rgb(var(--color-primary))]" /> Tampilkan password
      </label>
      <button type="submit" disabled={saving} className="btn-primary">
        <Icon name="lock" size={18} /> {saving ? "Menyimpan…" : "Simpan password"}
      </button>
    </form>
  );
}
