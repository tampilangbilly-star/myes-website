"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer({ lang = "en" }) {
  const pathname = usePathname();

  // Logika penyembunyi: Jika rute berawalan /admin, jangan tampilkan footer
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer
      className="footer-cinema"
      style={{
        background: "#030814",
        color: "#94a3b8",
        fontFamily: "inherit",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        borderTop: "1px solid rgba(59, 130, 246, 0.2)",
        overflow: "hidden",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* ==========================================
           POLA GRID BACKGROUND
        ========================================== */
        .footer-grid-pattern {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
          z-index: 0;
        }

        /* ==========================================
           WATERMARK M-YES
        ========================================== */
        .footer-watermark {
          position: absolute;
          bottom: 10px;
          right: 30px;
          font-family: "Playfair Display", serif;
          font-size: clamp(6rem, 12vw, 11rem);
          font-weight: 900;
          color: rgba(255, 255, 255, 0.022);
          line-height: 1;
          user-select: none;
          pointer-events: none;
          z-index: 0;
          letter-spacing: -2px;
        }

        .footer-content-wrapper {
          position: relative;
          z-index: 1;
        }

        /* ==========================================
           GARIS CAHAYA
        ========================================== */
        .footer-glow-line {
          width: 100%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(59, 130, 246, 0.5),
            var(--gold, #e8a33d),
            rgba(59, 130, 246, 0.5),
            transparent
          );
          margin-bottom: 1rem;
        }

        /* ==========================================
           FOOTER LINK
        ========================================== */
        .footer-link {
          position: relative;
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.3s ease;
          display: inline-block;
          padding: 1px 0;
        }

        .footer-link:hover {
          color: #fff;
        }

        .footer-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -2px;
          left: 0;
          border-radius: 99px;
          background: linear-gradient(90deg, #3b82f6, #06b6d4);
          transition: width 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .footer-link:hover::after {
          width: 100%;
        }

        /* ==========================================
           CTA BUTTON
        ========================================== */
        .cta-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 40px;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          color: #fff;
          padding: 0.6rem 1.8rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: bold;
          font-size: 0.9rem;
          transition:
            transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          box-shadow:
            0 6px 20px rgba(59, 130, 246, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(59, 130, 246, 0.55);
        }

        /* ==========================================
           JUDUL CTA
        ========================================== */
        .footer-cta-title {
          font-family: "Playfair Display", serif;
          font-size: clamp(1.5rem, 1.1rem + 1.8vw, 2.1rem);
          letter-spacing: -0.5px;
        }

        /* ==========================================
           DESKTOP FOOTER LAYOUT
        ========================================== */
        .desktop-footer-layout {
          max-width: 750px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          justify-items: center;
        }

        /* ==========================================
           PERBAIKAN KHUSUS DESKTOP
           Tidak mengubah tampilan Android/Mobile
        ========================================== */
        @media (min-width: 769px) {
          .footer-cinema {
            height: auto;
            min-height: 0;
          }

          .footer-content-wrapper {
            width: 100%;
            height: auto;
          }

          .footer-cta-zone {
            padding-top: 1.6rem !important;
            padding-bottom: 1rem !important;
          }

          .footer-main-container {
            padding-top: 0 !important;
            padding-bottom: 0.65rem !important;
          }

          .desktop-footer-layout {
            margin-bottom: 0.65rem !important;
          }

          .footer-bottom-flex {
            padding-top: 0.4rem !important;
          }

          .footer-watermark {
            pointer-events: none;
          }
        }

        /* ==========================================
           RESPONSIVE KHUSUS ANDROID/MOBILE
           TIDAK DIUBAH
        ========================================== */
        @media (max-width: 768px) {
          .footer-cta-zone {
            padding: 2rem 1rem 1.25rem !important;
          }

          .footer-cta-title {
            font-size: 1.4rem !important;
          }

          .footer-cta-zone p {
            font-size: 0.85rem !important;
            margin-bottom: 0.85rem !important;
          }

          .cta-button {
            min-height: 38px !important;
            padding: 0.5rem 1.4rem !important;
            font-size: 0.85rem !important;
          }
          
          .footer-main-container {
            padding: 0.4rem 1rem 0.85rem !important;
          }

          .desktop-footer-layout {
            grid-template-columns: 1fr 1fr !important;
            gap: 1rem !important;
            max-width: 100% !important;
          }

          .desktop-footer-layout > div {
            text-align: center !important;
          }

          .footer-grid-links h3 {
            font-size: 0.85rem !important;
            margin-bottom: 0.4rem !important;
            color: #60a5fa !important;
            letter-spacing: 0.5px;
            text-transform: uppercase;
          }

          .footer-grid-links ul {
            font-size: 0.8rem !important;
            gap: 0.3rem !important;
          }

          .footer-watermark {
            font-size: 20vw !important;
            bottom: 0px !important;
            right: 5% !important;
          }

          .footer-bottom-flex {
            flex-direction: column !important;
            text-align: center !important;
            gap: 0.35rem !important;
            padding-top: 0.5rem !important;
            font-size: 0.72rem !important;
          }
        }
      `,
        }}
      />

      {/* Latar Belakang Kotak-Kotak Tipis (Grid Pattern) */}
      <div className="footer-grid-pattern"></div>

      {/* Watermark Teks M-YES Besar dan Samar */}
      <div className="footer-watermark" aria-hidden="true">
        M-YES
      </div>

      <div className="footer-content-wrapper">
        {/* ========================================== */}
        {/* BAGIAN ATAS: READY TO GROW                */}
        {/* ========================================== */}
        <div
          className="footer-cta-zone"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2.2rem 1.25rem 1.2rem",
          }}
        >
          <div
            className="container"
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <span
              style={{
                display: "inline-block",
                color: "#60a5fa",
                fontSize: "0.65rem",
                fontWeight: "700",
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginBottom: "0.3rem",
                background: "rgba(59, 130, 246, 0.1)",
                padding: "2px 8px",
                borderRadius: "99px",
                border: "1px solid rgba(59, 130, 246, 0.2)",
              }}
            >
              M-YES Community
            </span>

            <h2
              className="footer-cta-title"
              style={{
                marginBottom: "0.3rem",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              {lang === "id"
                ? "Siap Bertumbuh Bersama?"
                : "Ready to Grow With Us?"}
            </h2>

            <p
              style={{
                fontSize: "0.88rem",
                color: "#cbd5e1",
                marginBottom: "0.85rem",
                lineHeight: "1.5",
                maxWidth: "440px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {lang === "id"
                ? "Mari bergabung dengan komunitas anak muda M-YES. Kita belajar bahasa Inggris, membangun relasi, dan memperdalam iman bersama-sama!"
                : "Join the M-YES youth community. We learn English, build relationships, and deepen our faith together!"}
            </p>

            <Link href="/contact" className="cta-button">
              {lang === "id" ? "Bergabung Sekarang" : "Join Us Now"}
            </Link>
          </div>
        </div>

        {/* Garis Cahaya Pemisah Estetik */}
        <div className="footer-glow-container" style={{ padding: "0 1.25rem" }}>
          <div className="footer-glow-line"></div>
        </div>

        {/* ========================================== */}
        {/* BAGIAN BAWAH: MENU & COPYRIGHT            */}
        {/* ========================================== */}
        <div
          className="container footer-main-container"
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            padding: "0 1.25rem 0.85rem",
            width: "100%",
          }}
        >
          <div
            className="desktop-footer-layout footer-grid-links"
            style={{ marginBottom: "0.85rem" }}
          >
            {/* Kolom 1: Quick Links */}
            <div style={{ textAlign: "right" }}>
              <h3
                style={{
                  color: "#fff",
                  fontSize: "0.88rem",
                  margin: "0 0 0.3rem 0",
                  fontWeight: "600",
                  letterSpacing: "0.5px",
                }}
              >
                {lang === "id" ? "Tautan Cepat" : "Quick Links"}
              </h3>

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                  fontSize: "0.82rem",
                }}
              >
                <li>
                  <Link href="/about" className="footer-link">
                    {lang === "id" ? "Tentang" : "About"}
                  </Link>
                </li>

                <li>
                  <Link href="/program" className="footer-link">
                    Program
                  </Link>
                </li>

                <li>
                  <Link href="/activities" className="footer-link">
                    {lang === "id" ? "Kegiatan" : "Activities"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Kolom 2: Explore */}
            <div style={{ textAlign: "left" }}>
              <h3
                style={{
                  color: "#fff",
                  fontSize: "0.88rem",
                  margin: "0 0 0.3rem 0",
                  fontWeight: "600",
                  letterSpacing: "0.5px",
                }}
              >
                {lang === "id" ? "Jelajahi" : "Explore"}
              </h3>

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                  fontSize: "0.82rem",
                }}
              >
                <li>
                  <Link href="/mission" className="footer-link">
                    {lang === "id" ? "Misi" : "Mission"}
                  </Link>
                </li>

                <li>
                  <Link href="/news" className="footer-link">
                    {lang === "id" ? "Berita" : "News"}
                  </Link>
                </li>

                <li>
                  <Link href="/contact" className="footer-link">
                    {lang === "id" ? "Kontak" : "Contact"}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* COPYRIGHT & DEVELOPER CREDIT */}
          <div
            className="footer-bottom-flex"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.5rem",
              paddingTop: "0.5rem",
              borderTop: "1px solid rgba(255, 255, 255, 0.06)",
              fontSize: "0.75rem",
              color: "#64748b",
            }}
          >
            <p style={{ margin: 0 }}>
              © {new Date().getFullYear()} Manado Youth English Service (M-YES).
              All rights reserved.
            </p>

            <div style={{ margin: 0 }}>
              <Link
                href="/admin"
                style={{
                  color: "#64748b",
                  opacity: 0.7,
                  textDecoration: "none",
                  letterSpacing: "1px",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.opacity = "1";
                  e.target.style.color = "#3b82f6";
                }}
                onMouseOut={(e) => {
                  e.target.style.opacity = "0.7";
                  e.target.style.color = "#64748b";
                }}
              >
                Admin{" "}
                <span style={{ margin: "0 4px", fontWeight: "300" }}>~bt~</span>{" "}
                Billy Tampilang
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
