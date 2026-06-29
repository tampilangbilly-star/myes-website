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
      style={{
        /* KUNCI GRADASI HALUS (FADE TO BLACK) */
        backgroundImage: `linear-gradient(to bottom, rgba(5, 11, 20, 0.4) 0%, rgba(5, 11, 20, 0.9) 55%, rgba(5, 11, 20, 1) 75%), url('bg-s.jpeg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        color: "#94a3b8",
        fontFamily: "inherit",
        position: "relative",
        minHeight: "100vh",
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
        }
        .footer-link:hover {
          color: #fff;
        }
        .footer-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -4px;
          left: 0;
          background-color: #3b82f6; 
          transition: width 0.3s ease;
        }
        .footer-link:hover::after {
          width: 100%;
        }
        .cta-button {
          display: inline-block;
          background: #3b82f6;
          color: #fff;
          padding: 0.8rem 2.2rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: bold;
          font-size: 1rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
        }
        .cta-button:hover {
          background: #2563eb;
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.6);
        }
      `,
        }}
      />

      {/* ========================================== */}
      {/* BAGIAN ATAS: READY TO GROW (Flex 1 agar mengisi ruang tengah) */}
      {/* ========================================== */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem" /* Jarak diperkecil agar muat di layar */,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          className="container"
          style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}
        >
          <h2
            style={{
              fontSize: "2.5rem",
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
              lineHeight: "1.6",
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
          padding: "2rem 1.5rem 1rem 1.5rem" /* Jarak atas bawah dirapatkan */,
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
                lineHeight: "1.5",
                fontSize: "0.9rem",
                margin: 0,
                opacity: 0.9,
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
            paddingTop: "1rem",
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
