"use client";
import { useState } from "react";
import clsx from "clsx";
import Icon from "./Icon";

const TEXT = {
  en: { name: "Name", email: "Email", message: "Message", send: "Send Message", sending: "Sending…", ok: "Thank you! Your message has been sent to the M-YES admin.", fail: "Couldn't send your message. Please try again.", nameErr: "Please enter your name (min. 2 characters).", emailErr: "Please enter a valid email address.", msgErr: "Message must be at least 5 characters.", ph: { name: "Your full name", email: "you@example.com", message: "How can we help you?" } },
  id: { name: "Nama", email: "Email", message: "Pesan", send: "Kirim Pesan", sending: "Mengirim…", ok: "Terima kasih! Pesan Anda berhasil dikirim ke Admin M-YES.", fail: "Gagal mengirim pesan. Silakan coba lagi.", nameErr: "Isi nama Anda (min. 2 karakter).", emailErr: "Masukkan alamat email yang valid.", msgErr: "Pesan minimal 5 karakter.", ph: { name: "Nama lengkap", email: "anda@contoh.com", message: "Ada yang bisa kami bantu?" } },
};

function validate(v, L) {
  const e = {};
  if (v.name.trim().length < 2) e.name = L.nameErr;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = L.emailErr;
  if (v.message.trim().length < 5) e.message = L.msgErr;
  return e;
}

export default function ContactForm({ lang = "en" }) {
  const L = TEXT[lang === "id" ? "id" : "en"];
  const [values, setValues] = useState({ name: "", email: "", message: "", website: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ type: "idle", msg: "" });

  const set = (k) => (e) => {
    const next = { ...values, [k]: e.target.value };
    setValues(next);
    if (touched[k]) setErrors(validate(next, L));
  };
  const blur = (k) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(values, L));
  };

  async function onSubmit(e) {
    e.preventDefault();
    const errs = validate(values, L);
    setErrors(errs);
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(errs).length) return;
    setStatus({ type: "loading", msg: "" });
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(res.status === 429 ? data.error : L.fail);
      setValues({ name: "", email: "", message: "", website: "" });
      setTouched({});
      setStatus({ type: "success", msg: L.ok });
    } catch (err) {
      setStatus({ type: "error", msg: err.message || L.fail });
    }
  }

  const field = (k, type = "text") => {
    const err = touched[k] && errors[k];
    const Tag = k === "message" ? "textarea" : "input";
    return (
      <div>
        <label htmlFor={`cf-${k}`} className="label">
          {L[k]} <span className="text-danger">*</span>
        </label>
        <Tag
          id={`cf-${k}`}
          name={k}
          type={Tag === "input" ? type : undefined}
          rows={Tag === "textarea" ? 5 : undefined}
          value={values[k]}
          onChange={set(k)}
          onBlur={blur(k)}
          placeholder={L.ph[k]}
          autoComplete={k === "name" ? "name" : k === "email" ? "email" : "off"}
          aria-invalid={Boolean(err)}
          aria-describedby={err ? `cf-${k}-err` : undefined}
          className={clsx("field", Tag === "textarea" && "resize-y", err && "field-error")}
        />
        {err && (
          <p id={`cf-${k}-err`} className="mt-1.5 flex items-center gap-1.5 text-sm text-danger">
            <Icon name="alert" size={14} /> {err}
          </p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {field("name")}
      {field("email", "email")}
      {field("message")}
      {/* Honeypot: disembunyikan dari manusia, diisi oleh bot spam */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={values.website} onChange={set("website")} />
        </label>
      </div>

      {status.msg && (
        <p role="status" className={clsx("flex items-start gap-2 rounded-xl px-4 py-3 text-sm font-medium", status.type === "success" ? "bg-success/10 text-success" : "bg-danger/10 text-danger")}>
          <Icon name={status.type === "success" ? "check" : "alert"} size={18} className="mt-0.5 shrink-0" /> {status.msg}
        </p>
      )}

      <button type="submit" disabled={status.type === "loading"} className="btn-primary w-full sm:w-auto sm:px-8">
        {status.type === "loading" ? L.sending : L.send} <Icon name="arrow-right" size={18} />
      </button>
    </form>
  );
}
