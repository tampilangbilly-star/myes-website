"use client";
import { useEffect, useState } from "react";
import clsx from "clsx";
import Icon from "./Icon";

const KEY = "myes-greeter-seen";

/** "M-YES Virtual Buddy": sapaan kecil di kiri bawah (tidak bertabrakan dengan tombol WhatsApp di kanan). */
export default function VirtualGreeter({ joinUrl, lang = "en" }) {
  const [open, setOpen] = useState(false);
  const id = lang === "id";

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {}
    if (seen) return;
    // Tunggu sampai popup sambutan selesai, supaya tidak ada dua hal muncul bersamaan.
    const t = setInterval(() => {
      if (document.querySelector('[aria-modal="true"]')) return;
      if (window.scrollY < 10 && performance.now() < 7000) return;
      clearInterval(t);
      setOpen(true);
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fixed bottom-[max(16px,env(safe-area-inset-bottom))] left-4 z-40 flex items-end gap-3 sm:left-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="virtual-buddy"
        aria-label={id ? "Buka sapaan M-YES" : "Open M-YES greeting"}
        className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-2xl shadow-lift transition hover:scale-105 active:scale-95"
      >
        <span className="inline-block origin-[70%_70%] motion-safe:animate-[wave_2.4s_ease-in-out_infinite]">👋</span>
        <span className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full border-2 border-surface bg-success" />
      </button>

      <div
        id="virtual-buddy"
        role="status"
        className={clsx(
          "card mb-1 w-[min(260px,calc(100vw-9.5rem))] origin-bottom-left p-4 transition duration-300",
          open ? "scale-100 opacity-100" : "pointer-events-none scale-90 opacity-0",
        )}
        aria-hidden={!open}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-wider text-primary-strong">M-YES Virtual Buddy</p>
          <button type="button" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1} className="-mr-2 -mt-2 flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft hover:bg-ink/5 hover:text-ink" aria-label={id ? "Tutup" : "Close"}>
            <Icon name="close" size={16} />
          </button>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-ink">
          {id ? "Halo! Selamat datang di M-YES. Ayo bertumbuh dalam iman dan bahasa Inggris bersama kami minggu ini!" : "Hi there! Welcome to M-YES. Let's grow in faith and English together this week!"}
        </p>
        {joinUrl && (
          <a href={joinUrl} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1} className="btn-primary btn-sm mt-3 w-full">
            {id ? "Gabung Sekarang" : "Join Us Now"} <Icon name="arrow-right" size={16} />
          </a>
        )}
      </div>
    </div>
  );
}
