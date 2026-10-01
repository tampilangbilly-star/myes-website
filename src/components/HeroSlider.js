"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import SmartImage from "./SmartImage";
import Icon from "./Icon";
import GuestSpeakerSlider from "./GuestSpeakerSlider";
import HolySpiritAmbient from "./HolySpiritAmbient";

const FALLBACK_SLIDE = {
  id: "welcome",
  overlineEn: "Faith • Learning • Community",
  overlineId: "Iman • Pembelajaran • Komunitas",
  titleEn: "Manado Youth English Service",
  titleId: "Manado Youth English Service",
  descriptionEn: "Learn English through worship and community.",
  descriptionId: "Belajar bahasa Inggris melalui ibadah dan komunitas.",
  buttonTextEn: "Join Our Community",
  buttonTextId: "Bergabung Bersama Kami",
  buttonLink: "/contact",
};

const tr = (item, field, lang) => (lang === "id" ? item[field + "Id"] || item[field + "En"] || "" : item[field + "En"] || "");

/**
 * Hero beranda.
 * - Desktop (lg+): foto utama lebar; teks (kiri bawah) dan kartu guest speaker (kanan bawah) MENUMPUK di atas foto.
 *   Merpati di pojok kanan atas foto.
 * - HP/tablet: foto dulu, lalu teks DI BAWAH foto (merpati di samping judul), lalu kartu guest speaker.
 */
export default function HeroSlider({ slides = [], speakers = [], mainBackground = "", lang = "en" }) {
  const items = slides.length ? slides : [FALLBACK_SLIDE];
  const total = items.length;
  const [active, setActive] = useState(0);
  const touchX = useRef(null);
  // Autoplay ditahan sebentar (bukan berhenti selamanya) setelah pengguna menyentuh/menekan tombol slider.
  const holdUntil = useRef(0);
  const id = lang === "id";

  const hold = useCallback((ms = 8000) => {
    holdUntil.current = Date.now() + ms;
  }, []);

  const go = useCallback(
    (step) => {
      hold();
      setActive((c) => (c + step + total) % total);
    },
    [total, hold],
  );

  // AUTOPLAY: berganti tiap 6 detik. Tetap jalan walau kursor berada di atas hero.
  useEffect(() => {
    if (total < 2) return;
    const timer = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() < holdUntil.current) return;
      setActive((c) => (c + 1) % total);
    }, 6000);
    return () => clearInterval(timer);
  }, [total]);

  const slide = items[active];
  const title = tr(slide, "title", lang);
  const overline = tr(slide, "overline", lang);
  const description = tr(slide, "description", lang);
  const buttonText = tr(slide, "buttonText", lang);
  const photoOf = (s) => s.backgroundImage || s.image || mainBackground || "/sample/activity-1.webp";

  return (
    <section
      aria-roledescription="carousel"
      aria-label={id ? "Sorotan M-YES" : "M-YES highlights"}
      className="container-x pt-4 sm:pt-6"
    >
      <div className="relative">
        {/* FOTO UTAMA */}
        <div
          className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-line shadow-card sm:aspect-[16/9] lg:aspect-auto lg:h-[min(84svh,720px)] lg:min-h-[580px]"
          onTouchStart={(e) => {
            touchX.current = e.touches[0].clientX;
            hold();
          }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
          }}
        >
          {items.map((s, i) => (
            <div key={s.id} className={clsx("absolute inset-0 transition-opacity duration-700 ease-out", i === active ? "opacity-100" : "opacity-0")} aria-hidden={i !== active}>
              <SmartImage
                src={photoOf(s)}
                alt={i === active ? tr(s, "title", lang) : ""}
                fill
                priority={i === 0}
                sizes="(min-width:1200px) 1150px, 100vw"
                className={clsx("object-cover transition-transform duration-[7000ms] ease-out motion-reduce:transition-none motion-reduce:scale-100", i === active ? "scale-105" : "scale-100")}
              />
            </div>
          ))}
          {/* Gradasi hanya di desktop, supaya teks putih di atas foto tetap terbaca (kontras AA) */}
          <div aria-hidden className="absolute inset-0 hidden bg-gradient-to-r from-ink/85 via-ink/45 to-ink/5 lg:block" />
          <div aria-hidden className="absolute inset-x-0 bottom-0 hidden h-1/2 bg-gradient-to-t from-ink/60 to-transparent lg:block" />

          {/* Merpati di foto: khusus desktop */}
          <HolySpiritAmbient variant="photo" />

          {total > 1 && (
            <div className="absolute bottom-3 right-3 flex gap-2 lg:hidden">
              <button type="button" onClick={() => go(-1)} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-ink shadow-card backdrop-blur" aria-label={id ? "Slide sebelumnya" : "Previous slide"}>
                <Icon name="chevron-left" />
              </button>
              <button type="button" onClick={() => go(1)} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-ink shadow-card backdrop-blur" aria-label={id ? "Slide berikutnya" : "Next slide"}>
                <Icon name="chevron-right" />
              </button>
            </div>
          )}
        </div>

        {/* TEKS: di bawah foto (HP) / di atas foto kiri bawah (desktop) */}
        <div className="relative mt-6 lg:pointer-events-none lg:absolute lg:inset-y-0 lg:left-0 lg:mt-0 lg:flex lg:w-[56%] lg:flex-col lg:justify-end lg:p-12 xl:w-[58%] xl:p-14">
          {/* Merpati di samping judul: khusus HP/tablet (tidak ikut berganti saat slide berganti) */}
          <HolySpiritAmbient variant="inline" />
          <div key={slide.id} className="animate-fade-up lg:pointer-events-auto" aria-live="polite">
            {overline && <p className="eyebrow lg:bg-white/15 lg:text-white lg:backdrop-blur">{overline}</p>}
            <h1 className="mt-4 pr-16 text-[2.1rem] font-extrabold leading-[1.08] xs:pr-20 xs:text-[2.4rem] sm:pr-24 sm:text-5xl lg:pr-0 lg:text-white xl:text-[3.6rem]">
              {title === "Manado Youth English Service" ? (
                <>
                  Manado Youth <span className="text-primary lg:text-white/80">English Service</span>
                </>
              ) : (
                title
              )}
            </h1>
            {description && <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg lg:text-white/90">{description}</p>}
            <div className="mt-6 flex flex-wrap gap-3">
              {buttonText && (
                <Link href={slide.buttonLink || "/contact"} className="btn-primary px-6 text-base">
                  {buttonText} <Icon name="arrow-right" size={18} />
                </Link>
              )}
              <Link href="/activities" className="btn-outline px-6 text-base lg:border-white/40 lg:bg-white/10 lg:text-white lg:backdrop-blur lg:hover:bg-white/20 lg:hover:text-white">
                {id ? "Jadwal Mingguan" : "Weekly Schedule"}
              </Link>
            </div>
            {total > 1 && (
              <div className="mt-6 flex items-center gap-1" role="tablist" aria-label={id ? "Pilih slide" : "Choose slide"}>
                {items.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={i === active}
                    aria-label={`Slide ${i + 1}`}
                    onClick={() => {
                      hold();
                      setActive(i);
                    }}
                    className="flex h-11 w-7 items-center justify-center"
                  >
                    <span className={clsx("block h-2 rounded-full transition-all duration-300", i === active ? "w-7 bg-primary lg:bg-white" : "w-2 bg-ink/20 lg:bg-white/40")} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* KARTU GUEST SPEAKER: di bawah teks (HP) / kanan bawah foto (desktop) */}
        {speakers.length > 0 && (
         <div className="mt-6 lg:absolute lg:bottom-6 lg:right-6 lg:mt-0 lg:w-[340px] xl:w-[360px]">
            <GuestSpeakerSlider speakers={speakers} lang={lang} />
          </div>
        )}
      </div>
    </section>
  );
}