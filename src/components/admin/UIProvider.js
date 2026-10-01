"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Icon from "../Icon";

const UIContext = createContext(null);

/** Toast (berhasil/gagal) + dialog konfirmasi untuk seluruh admin. */
export function UIProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [dialog, setDialog] = useState(null);
  const seq = useRef(0);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const toast = useCallback(
    (message, type = "success") => {
      const id = ++seq.current;
      setToasts((t) => [...t.slice(-3), { id, message, type }]);
      setTimeout(() => dismiss(id), type === "error" ? 6000 : 3500);
    },
    [dismiss],
  );
  const confirm = useCallback((opts) => new Promise((resolve) => setDialog({ ...opts, resolve })), []);

  return (
    <UIContext.Provider value={{ toast, confirm }}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-[calc(76px+env(safe-area-inset-bottom))] z-[90] flex flex-col items-center gap-2 px-4 lg:bottom-6 lg:items-end lg:px-6">
        {toasts.map((t) => (
          <div key={t.id} role={t.type === "error" ? "alert" : "status"} className={clsx("animate-fade-up pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border bg-surface p-3.5 pr-2 shadow-lift", t.type === "error" ? "border-danger/30" : "border-success/30")}>
            <span className={clsx("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", t.type === "error" ? "bg-danger/10 text-danger" : "bg-success/10 text-success")}>
              <Icon name={t.type === "error" ? "alert" : "check"} size={18} />
            </span>
            <p className="flex-1 pt-1 text-sm font-medium">{t.message}</p>
            <button type="button" onClick={() => dismiss(t.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft hover:bg-ink/5" aria-label="Tutup">
              <Icon name="close" size={16} />
            </button>
          </div>
        ))}
      </div>
      {dialog && <ConfirmDialog {...dialog} onClose={(v) => (dialog.resolve(v), setDialog(null))} />}
    </UIContext.Provider>
  );
}

function ConfirmDialog({ title = "Yakin?", message, confirmText = "Hapus", danger = true, onClose }) {
  const btn = useRef(null);
  useEffect(() => {
    btn.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[95] flex items-end justify-center sm:items-center sm:p-6" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
      <button type="button" tabIndex={-1} aria-label="Batal" className="animate-fade-in absolute inset-0 cursor-default bg-ink/50" onClick={() => onClose(false)} />
      <div className="animate-sheet-up relative w-full rounded-t-3xl bg-surface p-5 pb-[max(20px,env(safe-area-inset-bottom))] shadow-lift sm:max-w-sm sm:animate-fade-up sm:rounded-3xl sm:p-6">
        <span className={clsx("flex h-12 w-12 items-center justify-center rounded-2xl", danger ? "bg-danger/10 text-danger" : "bg-primary-soft text-primary")}>
          <Icon name={danger ? "trash" : "alert"} size={22} />
        </span>
        <h2 id="confirm-title" className="mt-4 text-lg font-bold">
          {title}
        </h2>
        {message && <p className="mt-1 text-sm text-ink-muted">{message}</p>}
        <div className="mt-6 grid grid-cols-2 gap-2">
          <button type="button" className="btn-outline" onClick={() => onClose(false)}>
            Batal
          </button>
          <button ref={btn} type="button" className={danger ? "btn-danger" : "btn-primary"} onClick={() => onClose(true)}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI harus di dalam <UIProvider>");
  return ctx;
}
