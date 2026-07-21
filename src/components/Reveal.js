"use client";
import { useEffect, useRef } from "react";

/**
 * Reveal — animasi masuk saat elemen terlihat di viewport.
 * Dipakai section Homepage (kelas .hm-reveal di globals.css layer V4).
 * • Tanpa library — IntersectionObserver native.
 * • delay: detik (stagger antar elemen) via CSS variable --hm-d.
 * • prefers-reduced-motion ditangani di CSS (animasi dimatikan).
 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`hm-reveal ${className}`}
      style={{ "--hm-d": `${delay}s` }}
    >
      {children}
    </Tag>
  );
}
