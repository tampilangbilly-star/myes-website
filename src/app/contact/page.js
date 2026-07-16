import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import ContactForm from "@/components/ContactForm";

export default async function ContactPage() {
  const cookieStore = cookies();
  const lang = cookieStore.get("lang")?.value || "en";

  // Mengambil data pengaturan kontak dari Database
  const items = await prisma.setting.findMany({ where: { group: "contact" } });
  const s = {};
  items.forEach((i) => {
    s[i.key] = lang === "id" ? i.valueId || i.valueEn : i.valueEn;
  });

  // Fungsi untuk membersihkan karakter aneh di nomor WA (misal: spasi, +, -)
  const cleanPhone = (s.contact_phone || "6282290658336").replace(/\D/g, "");

  return (
    <>
      <Navbar lang={lang} />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* Grid untuk kartu info di atas */
        .contact-top-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
          gap: clamp(1rem, 2.5vw, 1.5rem);
          margin-bottom: clamp(2.5rem, 6vw, 4rem);
        }

        /* Desain kartu info generasi baru */
        .info-card {
          padding: clamp(2rem, 5vw, 2.5rem) 1.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          color: inherit;
          overflow: hidden;
        }
        /* Tepi warna khas tiap kanal */
        .info-card::before {
          content: '';
          position: absolute;
          top: 0; left: 22%; right: 22%;
          height: 3px;
          border-radius: 0 0 6px 6px;
          background: var(--card-accent, linear-gradient(90deg, #1d4ed8, #60a5fa));
        }
        .info-card.ig    { --card-accent: linear-gradient(90deg, #f09433, #d6249f); }
        .info-card.mail  { --card-accent: linear-gradient(90deg, #EA4335, #FBBC04); }
        .info-card.wa    { --card-accent: linear-gradient(90deg, #128C7E, #25D366); }
        .info-card.map   { --card-accent: linear-gradient(90deg, #ef4444, #f97316); }

        .info-card h4 {
          font-family: "Playfair Display", serif;
          font-size: 1.3rem;
          color: #fff;
          margin: 0 0 0.5rem;
        }
        .info-card p {
          color: #94a3b8;
          font-size: 0.95rem;
          line-height: 1.6;
          margin: 0;
          word-break: break-word;
        }

        /* Lingkaran pembungkus ikon */
        .info-icon-wrapper {
          width: 70px;
          height: 70px;
          border-radius: 20px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(148, 178, 224, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
                      background 0.4s ease;
        }

        .info-card:hover .info-icon-wrapper {
          background: rgba(59, 130, 246, 0.1);
          transform: translateY(-4px) scale(1.08);
        }

        /* Animasi Panah Memantul (Bounce) */
        .bounce-arrow {
          animation: bounce 2s infinite;
          margin: 0 auto 1.5rem auto;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(96, 165, 250, 0.3);
          border-radius: 50%;
          color: #3b82f6;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        /* Bungkus formulir kontak agar full width elegan */
        .form-wrapper {
          padding: clamp(1.75rem, 6vw, 3.5rem);
          width: 100%;
        }
        .form-wrapper::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          border-radius: 20px 20px 0 0;
          background: linear-gradient(90deg, #1d4ed8, #60a5fa 55%, var(--gold));
        }
      `,
        }}
      />

      <header className="ph2">
        <div className="ph2-inner">
          <span className="ph2-watermark" aria-hidden="true">
            Contact
          </span>
          <div className="ph2-overline">
            <span className="live-dot" />
            {lang === "id" ? "Hubungi Kami" : "Get In Touch"}
          </div>
          <h1 className="ph2-title">
            {lang === "id" ? (
              <>
                Hubungi <em>Kami</em>
              </>
            ) : (
              <>
                Contact <em>Us</em>
              </>
            )}
          </h1>
          <div className="ph2-rule">
            <i />
            <i />
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container" style={{ maxWidth: "1200px" }}>
          {/* BAGIAN ANIMASI PANAH & TEKS PETUNJUK */}
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "1.05rem",
                marginBottom: "1rem",
              }}
            >
              {lang === "id"
                ? "Pilih jalur komunikasi di bawah ini untuk terhubung dengan kami:"
                : "Choose a communication channel below to connect with us:"}
            </p>
            <div className="bounce-arrow">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* ========================================== */}
          {/* BAGIAN KARTU INFO (HORIZONTAL) */}
          {/* ========================================== */}
          <div className="contact-top-grid">
            {/* 1. INSTAGRAM */}
            <a
              href="https://www.instagram.com/myes_worship?igsh=MW5sa211OHN6eTJodg=="
              className="panel info-card ig"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="info-icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 24 24">
                  <defs>
                    <linearGradient
                      id="ig-contact-card-grad"
                      x1="0%"
                      y1="100%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#fd5949" />
                      <stop offset="50%" stopColor="#d6249f" />
                      <stop offset="100%" stopColor="#285AEB" />
                    </linearGradient>
                  </defs>
                  <path
                    fill="url(#ig-contact-card-grad)"
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
                  />
                </svg>
              </div>
              <h4>Instagram</h4>
              <p>@myes_worship</p>
            </a>

            {/* 2. EMAIL */}
            <a
              href={`mailto:${s.contact_email || "myesworship@gmail.com"}`}
              className="panel info-card mail"
            >
              <div className="info-icon-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
                    fill="#EA4335"
                  />
                  <path
                    d="M0 5.457v13.909c0 .904.732 1.636 1.636 1.636h3.819V11.73l-6.545-4.91z"
                    fill="#34A853"
                  />
                  <path
                    d="M12 16.64l6.545-4.91v9.273H22.364A1.636 1.636 0 0 0 24 19.366V5.457c0-2.023-2.309-3.178-3.927-1.964L12 9.548 5.455 4.64C3.836 3.425 1.528 4.58 1.528 6.603V19.366A1.636 1.636 0 0 0 3.164 21h3.818V11.73L12 16.64z"
                    fill="#FBBC04"
                  />
                  <path
                    d="M12 16.64l6.545-4.91v9.273h-3.819V11.73L12 16.64z"
                    fill="#4285F4"
                  />
                </svg>
              </div>
              <h4>Email</h4>
              <p>{s.contact_email || "myesworship@gmail.com"}</p>
            </a>

            {/* 3. WHATSAPP */}
            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="panel info-card wa"
            >
              <div className="info-icon-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="#25D366"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.031 0C5.385 0 .004 5.38.004 12.02c0 2.124.551 4.195 1.6 6.015L.031 24l6.11-1.603a12.001 12.001 0 005.89 1.542h.005c6.643 0 12.025-5.381 12.025-12.022A12.016 12.016 0 0020.536 3.51 11.966 11.966 0 0012.031 0zM12.03 21.942h-.003a9.98 9.98 0 01-5.076-1.39l-.364-.216-3.774.99.999-3.68-.237-.377a9.957 9.957 0 01-1.523-5.305c0-5.498 4.475-9.972 9.981-9.972 2.664 0 5.168 1.039 7.051 2.924a9.927 9.927 0 012.918 7.054c-.002 5.498-4.477 9.972-9.972 9.972zm5.474-7.464c-.3-.15-1.774-.877-2.049-.978-.275-.101-.476-.15-.676.15-.2.301-.775.978-.95 1.178-.175.2-.35.226-.65.076-.3-.15-1.266-.466-2.411-1.488-.891-.794-1.493-1.775-1.668-2.076-.175-.301-.019-.464.131-.614.135-.135.3-.35.45-.526.15-.175.2-.3.3-.5s.05-.376-.025-.526c-.075-.15-.676-1.627-.926-2.228-.243-.585-.49-.505-.676-.514-.175-.008-.376-.01-.576-.01-.2 0-.525.075-.8.376-.275.3-1.05 1.026-1.05 2.503s1.075 2.9 1.225 3.1c.15.2 2.115 3.228 5.123 4.529.717.31 1.275.494 1.71.633.72.23 1.375.197 1.892.12.585-.088 1.774-.726 2.024-1.428.25-.701.25-1.302.175-1.428-.075-.125-.275-.2-.575-.35z" />
                </svg>
              </div>
              <h4>WhatsApp</h4>
              <p>{s.contact_phone || "+62 822 9065 8336"}</p>
            </a>

            {/* 4. LOKASI */}
            <a
              href="https://maps.app.goo.gl/gqEXDHvSLFkn5LUc6"
              target="_blank"
              rel="noopener noreferrer"
              className="panel info-card map"
            >
              <div className="info-icon-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="#ef4444"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <h4>{lang === "id" ? "Lokasi" : "Location"}</h4>
              <p>
                {s.contact_address ||
                  "Lorong Tuminting 1 A, Jalan Sea Malalayang 1 Barat, Manado"}
              </p>
            </a>
          </div>

          {/* ========================================== */}
          {/* BAGIAN FORMULIR FULL WIDTH DI BAWAH */}
          {/* ========================================== */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "clamp(1.6rem, 1.2rem + 2vw, 2rem)",
                color: "#fff",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              {lang === "id"
                ? "Atau Kirim Pesan Langsung"
                : "Or Send a Direct Message"}
            </h2>
            <p style={{ color: "#94a3b8" }}>
              {lang === "id"
                ? "Isi formulir di bawah ini dan tim kami akan segera merespons Anda."
                : "Fill out the form below and our team will get back to you shortly."}
            </p>
          </div>

          <div className="panel form-wrapper">
            <ContactForm lang={lang} />
          </div>
        </div>
      </section>
    </>
  );
}
