import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import SocialFloat from "@/components/SocialFloat";
import WeeklyGallery from "@/components/WeeklyGallery";

export const dynamic = "force-dynamic";

export default async function ActivitiesPage() {
  const cookieStore = cookies();
  const lang = cookieStore.get("lang")?.value || "en";

  const galleries = await prisma.activityGallery.findMany({
    where: { isActive: true },
    include: { photos: true },
    orderBy: { activityDate: "desc" },
  });

  return (
    <>
      <Navbar lang={lang} />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* ===== ALUR JUMAT (FRIDAY FLOW) ===== */
        .friday-flow {
          position: relative;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
          gap: clamp(1.5rem, 4vw, 2.5rem);
        }
        /* Garis penghubung antar sesi di desktop */
        @media (min-width: 761px) {
          .friday-flow::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 45%;
            right: 45%;
            height: 2px;
            background: linear-gradient(90deg, #3b82f6, var(--gold));
            box-shadow: 0 0 12px rgba(59, 130, 246, 0.5);
            z-index: 3;
          }
        }

        .schedule-card {
          position: relative;
          border-radius: 20px;
          padding: clamp(3rem, 7vw, 5rem) clamp(1.5rem, 4vw, 2rem);
          text-align: center;
          overflow: hidden;
          background-color: #050B14;
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow 0.45s ease, border-color 0.45s ease;
        }
        .schedule-card:hover {
          transform: translateY(-8px);
        }
        .schedule-card.blue:hover {
          box-shadow: 0 20px 40px -10px rgba(59, 130, 246, 0.3);
          border-color: rgba(59, 130, 246, 0.4);
        }
        .schedule-card.goldcard:hover {
          box-shadow: 0 20px 40px -10px rgba(232, 163, 61, 0.3);
          border-color: rgba(232, 163, 61, 0.45);
        }

        .card-bg-img {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          object-fit: cover;
          z-index: 0;
          transition: transform 0.6s ease;
        }
        .schedule-card:hover .card-bg-img {
          transform: scale(1.05);
        }

        .schedule-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.85) 0%, rgba(5, 11, 20, 0.95) 100%);
          z-index: 1;
          transition: opacity 0.3s ease;
        }
        .schedule-card:hover .schedule-overlay {
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.75) 0%, rgba(5, 11, 20, 0.85) 100%);
        }

        .schedule-content {
          position: relative;
          z-index: 2;
        }
        .schedule-content h2 {
          font-family: "Playfair Display", serif;
          font-size: clamp(1.8rem, 1.3rem + 2.6vw, 2.5rem);
          font-weight: 800;
          margin: 0 0 1rem;
          color: #fff;
        }
        .schedule-content p {
          color: #cbd5e1;
          line-height: 1.8;
          font-size: 1.02rem;
          max-width: 46ch;
          margin: 0 auto;
        }

        /* Penanda sesi (Sesi 1 / Sesi 2) */
        .session-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: "DM Sans", sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }
        .schedule-card.blue .session-badge { color: #93c5fd; }
        .schedule-card.goldcard .session-badge { color: var(--gold-light); }
        .session-badge::before,
        .session-badge::after {
          content: '';
          width: 18px;
          height: 1.5px;
          background: currentColor;
          opacity: 0.6;
        }

        .schedule-time {
          display: inline-block;
          padding: 0.5rem 1.5rem;
          border-radius: 30px;
          font-weight: bold;
          font-size: 1.05rem;
          margin-bottom: 1.5rem;
        }
        .schedule-card.blue .schedule-time {
          background-color: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }
        .schedule-card.goldcard .schedule-time {
          background-color: rgba(232, 163, 61, 0.14);
          color: var(--gold-light);
          border: 1px solid rgba(232, 163, 61, 0.35);
        }

        /* ===== BAGIAN LOKASI DENGAN MAPS LANGSUNG ===== */
        .location-section {
          margin-top: clamp(2.5rem, 6vw, 4rem);
          border-radius: 24px;
          padding: clamp(1.5rem, 5vw, 3rem);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(2rem, 5vw, 3rem);
          align-items: center;
        }

        .map-container {
          width: 100%;
          height: 350px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .maps-btn {
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          color: white;
          min-height: 48px;
          padding: 0.8rem 1.8rem;
          border-radius: 30px;
          text-decoration: none;
          font-weight: bold;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 8px 22px rgba(59, 130, 246, 0.4);
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow 0.35s ease;
        }
        .maps-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 32px rgba(59, 130, 246, 0.55);
        }

        @media (max-width: 992px) {
          .location-section {
            grid-template-columns: 1fr;
          }
          .map-container { height: 300px; }
        }

        /* ===== CSS GALERI ===== */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 250px), 1fr));
          gap: 15px;
          margin-top: 2rem;
        }

        .gallery-img-wrapper {
          position: relative;
          height: 200px;
          border-radius: 12px;
          overflow: hidden;
          background-color: #050B14;
          cursor: zoom-in;
        }
        .gallery-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .gallery-img-wrapper:hover img {
          transform: scale(1.1);
        }

        .zoom-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(15, 23, 42, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .zoom-overlay span {
          font-size: 2.5rem;
          transform: scale(0.5);
          transition: transform 0.3s ease;
        }
        .gallery-img-wrapper:hover .zoom-overlay {
          opacity: 1;
        }
        .gallery-img-wrapper:hover .zoom-overlay span {
          transform: scale(1);
        }
      `,
        }}
      />

      {/* HEADER REBRANDING */}
      <header className="ph2">
        <div className="ph2-inner">
          <span className="ph2-watermark" aria-hidden="true">
            Friday
          </span>
          <div className="ph2-overline">
            <span className="live-dot" />
            {lang === "id" ? "Setiap Jumat" : "Every Friday"}
          </div>
          <h1 className="ph2-title">
            M-YES <em>Friday</em>
          </h1>
          <p className="ph2-sub">
            {lang === "id"
              ? "Akhiri pekanmu dengan bertumbuh bersama kami setiap hari Jumat melalui pembelajaran bahasa Inggris interaktif dan persekutuan rohani yang hangat."
              : "Wrap up your week and grow with us every Friday through interactive English learning and warm spiritual fellowship."}
          </p>
          <div className="ph2-rule">
            <i />
            <i />
          </div>
        </div>
      </header>

      {/* 1. BAGIAN JADWAL & LOKASI */}
      <section className="section">
        <div className="container" style={{ maxWidth: "1000px" }}>
          {/* Kartu Jadwal — Alur Jumat */}
          <div className="friday-flow">
            <div className="schedule-card blue">
              <img src="learn-img.jpeg" className="card-bg-img" alt="" />
              <div className="schedule-overlay" />
              <div className="schedule-content">
                <span className="session-badge">
                  {lang === "id" ? "Sesi Pertama" : "First Session"}
                </span>
                <h2>English Learning</h2>
                <div className="schedule-time">17:30 - 18:30 WITA</div>
                <p>
                  {lang === "id"
                    ? "Sesi interaktif dan menyenangkan untuk mengasah kemampuan tata bahasa, kosakata, dan percakapan bahasa Inggris Anda."
                    : "An interactive and fun session to sharpen your English grammar, vocabulary, and conversation skills."}
                </p>
              </div>
            </div>

            <div className="schedule-card goldcard">
              <img src="worship-img.jpeg" className="card-bg-img" alt="" />
              <div className="schedule-overlay" />
              <div className="schedule-content">
                <span className="session-badge">
                  {lang === "id" ? "Sesi Kedua" : "Second Session"}
                </span>
                <h2>Youth Worship</h2>
                <div className="schedule-time">18:30 - Selesai</div>
                <p>
                  {lang === "id"
                    ? "Waktu yang intim untuk memuji, menyembah, dan mendengarkan kebenaran Firman Tuhan bersama komunitas."
                    : "An intimate time to praise, worship, and listen to the truth of God's Word together with the community."}
                </p>
              </div>
            </div>
          </div>

          {/* MAPS LANGSUNG */}
          <div className="panel location-section">
            {/* Bagian Kiri: Google Maps iframe */}
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.6204589046138!2d124.80560197423821!3d1.4492102612499522!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32877544d235223b%3A0x216b2b2a129e1930!2sMG.Maru.Home!5e1!3m2!1sen!2sus!4v1782539996785!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              ></iframe>
            </div>

            {/* Bagian Kanan: Detail Informasi */}
            <div>
              <div className="panel-kicker">
                {lang === "id" ? "Lokasi Pertemuan" : "Meeting Point"}
              </div>
              <h3
                style={{
                  fontSize: "clamp(1.7rem, 1.3rem + 2vw, 2.2rem)",
                  marginBottom: "0.5rem",
                  color: "#fff",
                  fontWeight: "bold",
                }}
              >
                M-YES Basecamp
              </h3>
              <div
                style={{
                  width: "60px",
                  height: "4px",
                  background: "linear-gradient(90deg, #1d4ed8, #60a5fa)",
                  marginBottom: "1.5rem",
                  borderRadius: "2px",
                }}
              ></div>
              <h4
                style={{
                  color: "#3b82f6",
                  fontSize: "1.2rem",
                  marginBottom: "1rem",
                }}
              >
                KEL. MARU - KIMBAL
              </h4>
              <p
                style={{
                  color: "#94a3b8",
                  lineHeight: "1.8",
                  marginBottom: "1rem",
                  fontSize: "1.05rem",
                }}
              >
                Lorong Tuminting 1 A, Jalan Sea Malalayang 1 Barat, Manado,
                Sulawesi Utara, Indonesia
              </p>

              {/* PENAMBAHAN EMAIL */}
              <p
                style={{
                  color: "#cbd5e1",
                  fontSize: "1.05rem",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "2rem",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: "#3b82f6" }}
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                myes.manado@gmail.com
              </p>

              <a
                href="https://maps.google.com/?q=Lorong+Tuminting+1+A,+Jalan+Sea+Malalayang+1+Barat,+Manado"
                target="_blank"
                rel="noopener noreferrer"
                className="maps-btn"
              >
                {lang === "id" ? "Buka di Google Maps" : "Open in Google Maps"}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BAGIAN GALERI KEGIATAN MINGGUAN */}
      <section className="section section-alt">
        <div className="container">
          <div className="vh-heading">
            <span className="bar" />
            <div>
              <span className="overline">
                {lang === "id" ? "Momen Kami" : "Our Moments"}
              </span>
              <h2>
                {lang === "id" ? "Galeri Kegiatan" : "Activities Gallery"}
              </h2>
            </div>
          </div>

          <WeeklyGallery galleries={galleries} lang={lang} />
        </div>
      </section>

      <SocialFloat />
    </>
  );
}
