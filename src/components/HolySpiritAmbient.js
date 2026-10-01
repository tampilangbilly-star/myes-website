import Image from "next/image";
import clsx from "clsx";

/**
 * Merpati Roh Kudus — terbang masuk lalu melayang pelan. pointer-events: none (tidak menghalangi klik).
 *
 * variant="photo"  → DESKTOP saja: di pojok kanan atas foto hero (teks menumpuk di atas foto).
 * variant="inline" → HP/tablet saja: di samping judul hitam di bawah foto.
 */
export default function HolySpiritAmbient({ variant = "photo" }) {
  const inline = variant === "inline";
  return (
    <div
      aria-hidden
      className={clsx(
        "pointer-events-none absolute z-[1]",
        inline
          ? "-top-3 right-0 w-[68px] xs:w-20 sm:w-24 lg:hidden"
          : "hidden lg:block lg:right-[6%] lg:top-[8%] lg:w-[13%] lg:min-w-[90px] lg:max-w-[150px]",
      )}
    >
      <div
        className={clsx(
          "ray-pulse absolute -inset-[35%] rounded-full",
          inline
            ? "bg-[radial-gradient(circle,rgb(var(--color-primary)/0.18)_0%,rgb(var(--color-primary)/0)_65%)]"
            : "bg-[radial-gradient(circle,rgb(255_255_255/0.55)_0%,rgb(255_255_255/0)_65%)]",
        )}
      />
      <div className="dove-fly relative">
        <Image src="/dove.webp" alt="" width={420} height={493} priority sizes="150px" className="dove-glow h-auto w-full" />
      </div>
    </div>
  );
}