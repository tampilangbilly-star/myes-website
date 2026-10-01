"use client";
import { useEffect } from "react";
import Icon from "../Icon";

/** Panel form: dari kanan di desktop, bottom sheet penuh di HP. */
export default function Sheet({ title, onClose, children }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && !document.querySelector('[role="alertdialog"]') && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
      <button type="button" tabIndex={-1} aria-label="Tutup" className="animate-fade-in absolute inset-0 cursor-default bg-ink/45" onClick={onClose} />
      <div className="animate-sheet-up absolute inset-x-0 bottom-0 flex max-h-[94dvh] flex-col rounded-t-3xl bg-bg shadow-lift sm:animate-slide-in-right sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[min(640px,92vw)] sm:rounded-none sm:rounded-l-3xl">
        <div className="flex items-center justify-between gap-3 border-b border-line bg-surface px-5 py-3 sm:rounded-tl-3xl">
          <h2 id="sheet-title" className="text-lg font-bold">
            {title}
          </h2>
          <button type="button" onClick={onClose} className="icon-btn -mr-2" aria-label="Tutup">
            <Icon name="close" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-5 sm:px-6 [&_.sticky]:bottom-0">{children}</div>
      </div>
    </div>
  );
}
