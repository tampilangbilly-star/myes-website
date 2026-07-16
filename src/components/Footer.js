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
      className="footer-cinema bg-fixed"
      style={{
        /* KUNCI GRADASI HALUS (FADE TO BLACK)
           Catatan: background-attachment kini diatur oleh kelas .bg-fixed
           di globals.css — parallax di desktop, scroll di HP (fix Android) */
        backgroundImage: `linear-gradient(to bottom, rgba(5, 11, 20, 0.4) 0%, rgba(5, 11, 20, 0.9) 55%, rgba(5, 11, 20, 1) 75%), url('bg-s.jpeg')`,
        color: "#94a3b8",
        fontFamily: "inherit",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .footer-link {
          position: relative;
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.3s ease;
          display: inline-block;
          padding: 2px 0;
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
        .cta-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          color: #fff;
          padding: 0.8rem 2.2rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: bold;
          font-size: 1rem;
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4),
                      inset 0 1px 0 rgba(255, 255, 255, 0.25);
        }
        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(59, 130, 246, 0.55);
        }
        .footer-cta-title {
          font-size: clamp(1.9rem, 1.3rem + 3vw, 2.6rem);
          letter-spacing: -0.5px;
        }
      `,
        }}
      />

      {/* ========================================== */}
      {/* BAGIAN ATAS: READY TO GROW (Flex 1 agar mengisi ruang tengah) */}
      {/* ========================================== */}
      <div
        className="footer-cta-zone"
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "6rem 1.25rem 4rem" /* Napas lebih lega */,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          className="container"
          style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}
        >
          <h2
            className="footer-cta-title"
            style={{
              marginBottom: "1rem",
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
              fontSize: "1.05rem",
              color: "#cbd5e1",
              marginBottom: "2rem",
              lineHeight: "1.7",
              maxWidth: "620px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {lang === "id"
              ? "Mari bergabung dengan komunitas anak muda M-YES. Kita belajar bahasa Inggris, membangun relasi, dan memperdalam iman bersama-sama dalam suasana yang menyenangkan!"
              : "Join the M-YES youth community. We learn English, build relationships, and deepen our faith together in a fun and welcoming environment!"}
          </p>
          <Link href="/contact" className="cta-button">
            {lang === "id" ? "Bergabung Sekarang" : "Join Us Now"}
          </Link>
        </div>
      </div>

      {/* ========================================== */}
      {/* BAGIAN BAWAH: MENU & COPYRIGHT             */}
      {/* ========================================== */}
      <div
        className="container"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2.5rem 1.25rem 1.25rem" /* Jarak atas bawah dirapatkan */,
          width: "100%",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem",
            marginBottom: "2rem",
          }}
        >
          {/* Kolom 1: Identitas Brand */}
          <div>
            <h2
              style={{
                color: "#fff",
                fontSize: "1.8rem",
                margin: "0 0 0.8rem 0",
                fontWeight: "bold",
                letterSpacing: "1px",
              }}
            >
              M-YES
            </h2>
            <p
              style={{
                lineHeight: "1.6",
                fontSize: "0.9rem",
                margin: 0,
                opacity: 0.9,
                maxWidth: "280px",
              }}
            >
              {lang === "id"
                ? "Manado Youth English Service. Belajar Bahasa Inggris, Bertumbuh dalam Iman."
                : "Manado Youth English Service. Learning English, Growing in Faith."}
            </p>
          </div>

          {/* Kolom 2: Quick Links */}
          <div>
            <h3
              style={{
                color: "#fff",
                fontSize: "1.1rem",
                margin: "0 0 1rem 0",
                fontWeight: "600",
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
                gap: "0.6rem",
                fontSize: "0.9rem",
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

          {/* Kolom 3: Explore */}
          <div>
            <h3
              style={{
                color: "#fff",
                fontSize: "1.1rem",
                margin: "0 0 1rem 0",
                fontWeight: "600",
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
                gap: "0.6rem",
                fontSize: "0.9rem",
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
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            fontSize: "0.8rem",
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
                opacity: 0.6,
                textDecoration: "none",
                letterSpacing: "1px",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.opacity = "1";
                e.target.style.color = "#3b82f6";
              }}
              onMouseOut={(e) => {
                e.target.style.opacity = "0.6";
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
    </footer>
  );
}
