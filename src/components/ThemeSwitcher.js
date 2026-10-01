"use client";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Icon from "./Icon";
import { ACCENTS, ACCENT_STORAGE_KEY } from "@/lib/theme";

/** Pemilih warna aksen (ikon palet). Disimpan di localStorage; diterapkan sebelum render oleh skrip di <head>. */
export default function ThemeSwitcher({ lang = "en", align = "right" }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (id) => {
    document.documentElement.setAttribute("data-accent", id);
    try {
      localStorage.setItem(ACCENT_STORAGE_KEY, id);
    } catch {}
    setCurrent(id);
    setOpen(false);
  };

  const reset = () => {
    try {
      localStorage.removeItem(ACCENT_STORAGE_KEY);
    } catch {}
    const def = document.documentElement.getAttribute("data-default-accent") || "blue";
    document.documentElement.setAttribute("data-accent", def);
    setCurrent(def);
    setOpen(false);
  };

  const label = lang === "id" ? "Pilih warna tema" : "Choose theme colour";
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="icon-btn"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => {
          setCurrent(document.documentElement.getAttribute("data-accent"));
          setOpen((o) => !o);
        }}
      >
        <Icon name="palette" />
      </button>
      {open && (
        <div role="menu" aria-label={label} className={clsx("animate-fade-up absolute top-full z-50 mt-2 w-56 rounded-2xl border border-line bg-surface p-3 shadow-lift", align === "right" ? "right-0" : "left-0")}>
          <p className="px-1 pb-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">{label}</p>
          <div className="grid grid-cols-5 gap-2">
            {ACCENTS.map((a) => (
              <button
                key={a.id}
                type="button"
                role="menuitemradio"
                aria-checked={current === a.id}
                aria-label={lang === "id" ? a.label : a.labelEn}
                title={lang === "id" ? a.label : a.labelEn}
                onClick={() => choose(a.id)}
                className="flex h-11 w-full items-center justify-center rounded-xl ring-offset-2 transition hover:scale-105 focus-visible:ring-2"
                style={{ backgroundColor: a.hex }}
              >
                {current === a.id && <Icon name="check" size={18} strokeWidth={3} className="text-white" />}
              </button>
            ))}
          </div>
          <button type="button" onClick={reset} className="btn-ghost btn-sm mt-2 w-full">
            {lang === "id" ? "Kembali ke warna default" : "Reset to default"}
          </button>
        </div>
      )}
    </div>
  );
}
