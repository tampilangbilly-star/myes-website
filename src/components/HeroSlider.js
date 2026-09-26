"use client";
import { useState, useEffect, useRef } from "react";

export default function HeroSlider({ slides = [], lang = "en" }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);
  const total = slides.length;
  const active = total ? current % total : 0;
  const t = (item, field) => lang === "id"
    ? item[field + "Id"] || item[field + "En"] || ""
    : item[field + "En"] || "";
  const go = (step) => total && setCurrent(c => (c + step + total) % total);

  useEffect(() => {
    if (total <= 1 || paused) return;
    const timer = setInterval(() => {
      if (document.visibilityState === "visible" &&
          !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setCurrent(c => (c + 1) % total);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [total, paused]);

  const items = total ? slides : [{
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
  }];

  return (
    <section className="hero-slider light-hero" aria-label={lang === "id" ? "Sorotan M-YES" : "M-YES highlights"}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false); }}
      onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
      onTouchCancel={() => { touchX.current = null; }}
      onTouchEnd={e => {
        if (touchX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(delta) > 45) go(delta < 0 ? 1 : -1);
      }}>
      <div className="light-hero-slides">
        {items.map((slide, i) => (
          <article key={slide.id} className={`light-hero-slide${i === active ? " is-active" : ""}`}
            aria-hidden={i !== active}>
            <div className="light-hero-copy">
              {t(slide, "overline") && <p className="light-hero-eyebrow">{t(slide, "overline")}</p>}
              <h1>{t(slide, "title") === "Manado Youth English Service" ? <>Manado Youth<br /><span>English Service</span></> : t(slide, "title")}</h1>
              {t(slide, "description") && <p className="light-hero-description">{t(slide, "description")}</p>}
              {t(slide, "buttonText") && <a className="light-primary-button" href={slide.buttonLink || "/contact"}
                tabIndex={i === active ? 0 : -1}>{t(slide, "buttonText")} <span aria-hidden="true">→</span></a>}
            </div>
            {slide.backgroundImage && <div className="light-hero-media"><img src={slide.backgroundImage}
              alt={t(slide, "title")} loading={i === 0 ? "eager" : "lazy"} /></div>}
            {slide.image && <div className="light-hero-inset"><img src={slide.image} alt={t(slide, "title")} /></div>}
          </article>
        ))}
      </div>
      {total > 1 && <div className="light-hero-controls">
        <button onClick={() => go(-1)} aria-label={lang === "id" ? "Slide sebelumnya" : "Previous slide"}>←</button>
        <div className="light-hero-dots">{slides.map((slide, i) => <button key={slide.id}
          className={i === active ? "active" : ""} aria-label={`Slide ${i + 1}`} aria-pressed={i === active}
          onClick={() => setCurrent(i)} />)}</div>
        <button onClick={() => go(1)} aria-label={lang === "id" ? "Slide berikutnya" : "Next slide"}>→</button>
      </div>}
    </section>
  );
}
