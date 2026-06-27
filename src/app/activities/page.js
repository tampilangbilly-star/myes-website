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
        .schedule-card {
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 5rem 2rem;
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          overflow: hidden;
          background-color: #050B14;
        }
        .schedule-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px -10px rgba(59, 130, 246, 0.3);
          border-color: rgba(59, 130, 246, 0.4);
        }
        
        .card-bg-img {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          object-fit: cover;
          z-index: 0;
          transition: transform 0.5s ease;
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
        
        .schedule-time {
          display: inline-block;
          background-color: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
          padding: 0.5rem 1.5rem;
          border-radius: 30px;
          font-weight: bold;
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        /* BAGIAN LOKASI DENGAN MAPS LANGSUNG */
        .location-section {
          margin-top: 4rem;
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          padding: 3rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
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
          background: #3b82f6;
          color: white;
          padding: 0.8rem 1.8rem;
          border-radius: 30px;
          text-decoration: none;
          font-weight: bold;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: background 0.3s ease;
        }

        .maps-btn:hover {
          background: #2563eb;
        }

        @media (max-width: 992px) {
          .location-section {
            grid-template-columns: 1fr;
            padding: 2rem;
            gap: 2rem;
          }
        }
        
        /* CSS GALERI */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
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
      <header
        className="page-header"
        style={{ borderBottom: "none", paddingBottom: "2rem" }}
      >
        <div className="page-header-inner">
          <div
            className="overline"
            style={{
              letterSpacing: "2px",
              fontWeight: "bold",
              color: "#3b82f6",
            }}
          >
            {lang === "id" ? "Setiap Jumat" : "Every Friday"}
          </div>
          <h1
            style={{
              fontSize: "4.5rem",
              fontWeight: "900",
              color: "#fff",
              margin: "0.5rem 0",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            M-YES Friday
          </h1>
          <p
            style={{
              color: "#cbd5e1",
              fontSize: "1.2rem",
              maxWidth: "650px",
              margin: "1rem auto 0",
              lineHeight: "1.6",
            }}
          >
            {lang === "id"
              ? "Akhiri pekanmu dengan bertumbuh bersama kami setiap hari Jumat melalui pembelajaran bahasa Inggris interaktif dan persekutuan rohani yang hangat."
              : "Wrap up your week and grow with us every Friday through interactive English learning and warm spiritual fellowship."}
          </p>
        </div>
      </header>

      {/* 1. BAGIAN JADWAL & LOKASI */}
      <section className="section" style={{ paddingTop: "0" }}>
        <div className="container" style={{ maxWidth: "1000px" }}>
          {/* Kartu Jadwal */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
            }}
          >
            <div className="schedule-card">
              <img
                src="/uploads/learn-img.jpeg"
                className="card-bg-img"
                alt=""
              />
              <div className="schedule-overlay" />
              <div className="schedule-content">
                <h2
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "800",
                    marginBottom: "1rem",
                    color: "#fff",
                  }}
                >
                  English Learning
                </h2>
                <div className="schedule-time">17:30 - 18:30 WITA</div>
                <p
                  style={{
                    color: "#cbd5e1",
                    lineHeight: "1.8",
                    fontSize: "1.05rem",
                  }}
                >
                  {lang === "id"
                    ? "Sesi interaktif dan menyenangkan untuk mengasah kemampuan tata bahasa, kosakata, dan percakapan bahasa Inggris Anda."
                    : "An interactive and fun session to sharpen your English grammar, vocabulary, and conversation skills."}
                </p>
              </div>
            </div>

            <div className="schedule-card">
              <img
                src="/uploads/worship-img.jpeg"
                className="card-bg-img"
                alt=""
              />
              <div className="schedule-overlay" />
              <div className="schedule-content">
                <h2
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "800",
                    marginBottom: "1rem",
                    color: "#fff",
                  }}
                >
                  Youth Worship
                </h2>
                <div className="schedule-time">18:30 - Selesai</div>
                <p
                  style={{
                    color: "#cbd5e1",
                    lineHeight: "1.8",
                    fontSize: "1.05rem",
                  }}
                >
                  {lang === "id"
                    ? "Waktu yang intim untuk memuji, menyembah, dan mendengarkan kebenaran Firman Tuhan bersama komunitas."
                    : "An intimate time to praise, worship, and listen to the truth of God's Word together with the community."}
                </p>
              </div>
            </div>
          </div>

          {/* MAPS LANGSUNG */}
          <div className="location-section">
            {/* Bagian Kiri: Google Maps iframe (DIPERBAIKI) */}
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
              <div
                className="overline"
                style={{
                  color: "#3b82f6",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                }}
              >
                {lang === "id" ? "Lokasi Pertemuan" : "Meeting Point"}
              </div>
              <h3
                style={{
                  fontSize: "2.2rem",
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
                  backgroundColor: "#3b82f6",
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
                  marginBottom: "1rem" /* Margin disesuaikan */,
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
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div
              className="overline"
              style={{ color: "#3b82f6", marginBottom: "0.5rem" }}
            >
              {lang === "id" ? "Momen Kami" : "Our Moments"}
            </div>
            <h2 style={{ fontSize: "2.5rem" }}>
              {lang === "id" ? "Galeri Kegiatan" : "Activities Gallery"}
            </h2>
          </div>

          <WeeklyGallery galleries={galleries} lang={lang} />
        </div>
      </section>

      <SocialFloat />
    </>
  );
}
