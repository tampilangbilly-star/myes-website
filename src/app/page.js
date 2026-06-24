import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import SocialFloat from "@/components/SocialFloat";
import GuestSpeakerSlider from "@/components/GuestSpeakerSlider";
import NewsHomeSlider from "@/components/NewsHomeSlider";
import VirtualGreeter from "@/components/VirtualGreeter";
import HolySpiritAmbient from "@/components/HolySpiritAmbient";
async function getData() {
  const [
    slides,
    programs,
    news,
    socialItems,
    mainBgSetting,
    speakers,
    contactItems,
  ] = await Promise.all([
    prisma.slide.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.program.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      take: 6,
    }),
    prisma.news.findMany({
      where: { isActive: true },
      orderBy: { publishedAt: "desc" },
      take: 5,
    }),
    prisma.setting.findMany({ where: { group: "social" } }),
    prisma.setting.findUnique({ where: { key: "main_background" } }),
    prisma.guestSpeaker.findMany({
      where: { isActive: true },
      orderBy: { dateServed: "desc" },
    }),
    prisma.setting.findMany({ where: { group: "contact" } }),
  ]);

  const socials = {};
  socialItems.forEach((s) => {
    socials[s.key.replace("social_", "")] = s.valueEn;
  });
  const mainBg = mainBgSetting?.valueEn;

  return { slides, programs, news, socials, mainBg, speakers, contactItems };
}

export default async function Home() {
  const cookieStore = cookies();
  const lang = cookieStore.get("lang")?.value || "en";
  const { slides, programs, news, socials, mainBg, speakers, contactItems } =
    await getData();

  const t = (item, field) => {
    if (!item) return "";
    return lang === "id"
      ? item[field + "Id"] || item[field + "En"] || ""
      : item[field + "En"] || "";
  };

  const contactData = {};
  contactItems.forEach((i) => {
    contactData[i.key] = lang === "id" ? i.valueId || i.valueEn : i.valueEn;
  });

  const rawPhone = contactData.contact_phone || "+62 822 9065 8336";
  const cleanPhone = rawPhone.replace(/\D/g, "");
  const displayEmail = contactData.contact_email || "myesworship@gmail.com";

  return (
    <>
      <Navbar lang={lang} />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hero-wrapper {
          position: relative;
          width: 100%;
          overflow: hidden;
        }
        
        .guest-speaker-overlay {
          position: absolute;
          top: 50%;
          right: 8%;
          transform: translateY(-50%);
          z-index: 40;
        }

        .cta-button {
          display: inline-block;
          background: #3b82f6;
          color: #fff;
          padding: 1rem 2.5rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: bold;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
        }
        .cta-button:hover {
          background: #2563eb;
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.6);
        }

        .viva-social {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          color: #e2e8f0;
          text-decoration: none;
          font-weight: 500;
          font-size: 1.05rem;
          transition: all 0.3s ease;
        }
        .viva-social:hover {
          color: #fff;
          transform: translateY(-2px);
        }

        .modern-social-title {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 700;
          color: #f8fafc;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
        }

        .bounce-right-arrow {
          animation: bounceRight 1.5s infinite;
          color: #3b82f6;
          display: flex;
          align-items: center;
          margin-left: 1rem;
          background: rgba(59, 130, 246, 0.1);
          padding: 6px;
          border-radius: 50%;
        }

        @keyframes bounceRight {
          0%, 20%, 50%, 80%, 100% { transform: translateX(0); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(5px); }
        }

        @media (max-width: 992px) {
          .guest-speaker-overlay {
            position: relative;
            top: auto;
            right: auto;
            transform: none;
            margin: -100px auto 3rem auto;
            display: flex;
            justify-content: center;
            padding: 0 1rem;
            z-index: 40;
          }
        }
      `,
        }}
      />

      <div className="hero-wrapper">
        {/* Tambahkan baris ini di sini */}
        <HolySpiritAmbient />

        <HeroSlider slides={slides} socials={socials} lang={lang} />

        {speakers && speakers.length > 0 && (
          <div className="guest-speaker-overlay">
            <GuestSpeakerSlider speakers={speakers} lang={lang} />
          </div>
        )}
      </div>

      <div
        style={{
          backgroundColor: "#050B14",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          padding: "1.5rem 0",
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <h3 className="modern-social-title">
              {lang === "id" ? "Media Sosial" : "Social Media"}
            </h3>
            <div className="bounce-right-arrow">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "2.5rem",
              alignItems: "center",
            }}
          >
            <a
              href="https://www.instagram.com/myes_worship?igsh=MW5sa211OHN6eTJodg=="
              className="viva-social"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="28" height="28" viewBox="0 0 24 24">
                <defs>
                  <linearGradient
                    id="ig-grad-top"
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
                  fill="url(#ig-grad-top)"
                  d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
                />
              </svg>
              <span>
                {lang === "id" ? "Ikuti Instagram" : "Follow on Instagram"}
              </span>
            </a>
            <a
              href="https://chat.whatsapp.com/Fialpt9jLrCL0oLagStRTc"
              className="viva-social"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="28" height="28" fill="#25D366" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <span>{lang === "id" ? "Grup WhatsApp" : "Join WhatsApp"}</span>
            </a>
            <a
              href="https://www.tiktok.com/@myes_fellowship?_r=1&_t=ZS-97MYyNQj1Rl"
              className="viva-social"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="28" height="28" fill="#fff" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 15.68a6.34 6.34 0 0011.14 4.43v-7.4a8.27 8.27 0 004.86 1.52v-3.45a4.8 4.8 0 01-1.41-4.09z" />
              </svg>
              <span>
                {lang === "id" ? "Ikuti TikTok Kami" : "Follow Our TikTok"}
              </span>
            </a>
          </div>
        </div>
      </div>

      {programs.length > 0 && (
        <section
          className="section"
          style={{
            backgroundImage: `linear-gradient(rgba(5, 11, 20, 0.85), rgba(5, 11, 20, 0.95)), url('/uploads/bg-programs.jpeg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="container">
            <div className="section-header">
              <div className="overline">
                {lang === "id" ? "Apa Yang Kami Lakukan" : "What We Do"}
              </div>
              <h2>{lang === "id" ? "Program Kami" : "Our Programs"}</h2>
            </div>
            <div className="program-grid">
              {programs.map((p, i) => (
                <div key={p.id} className="program-card">
                  <div
                    className="program-card-top"
                    style={
                      i % 2 === 1
                        ? {
                            background:
                              "linear-gradient(90deg,var(--gold),var(--gold-light))",
                          }
                        : {}
                    }
                  />
                  <div className="program-card-body">
                    {p.image ? (
                      <img
                        src={`/uploads/${p.image}`}
                        style={{
                          width: "100%",
                          height: 140,
                          objectFit: "cover",
                          borderRadius: 8,
                          marginBottom: "1rem",
                        }}
                        alt=""
                      />
                    ) : (
                      <span className="emoji">{p.emoji}</span>
                    )}
                    <h3>{t(p, "title")}</h3>
                    <p>{t(p, "description")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* 2. SEKSI BERITA TERBARU (DENGAN AMBIENT GLOW EFFECT)      */}
      {/* ======================================================== */}
      {news.length > 0 && (
        <section
          className="section section-alt"
          style={{
            position: "relative" /* Kunci untuk elemen absolute di dalamnya */,
            overflow: "hidden" /* Mencegah glow melewati batas seksi */,
            backgroundColor: "#080e17",
            paddingTop: "6rem",
            paddingBottom: "6rem",
            borderTop: "1px solid rgba(255,255,255,0.02)",
            borderBottom: "1px solid rgba(255,255,255,0.02)",
          }}
        >
          {/* Efek Kabut Cahaya Biru di Kiri */}
          <div
            style={{
              position: "absolute",
              top: "-20%",
              left: "-10%",
              width: "50%",
              height: "100%",
              background:
                "radial-gradient(circle, rgba(59,130,246,0.08) 0%, rgba(8,14,23,0) 70%)",
              zIndex: 0,
            }}
          ></div>

          {/* Efek Kabut Cahaya Jingga di Kanan Bawah */}
          <div
            style={{
              position: "absolute",
              bottom: "-20%",
              right: "-10%",
              width: "50%",
              height: "100%",
              background:
                "radial-gradient(circle, rgba(234,67,53,0.05) 0%, rgba(8,14,23,0) 70%)",
              zIndex: 0,
            }}
          ></div>

          <div
            className="container"
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "4rem",
                alignItems: "center",
              }}
            >
              <div style={{ textAlign: "left" }}>
                <div
                  className="overline"
                  style={{
                    color: "#3b82f6",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                  }}
                >
                  {lang === "id" ? "Warta Mingguan" : "Weekly Update"}
                </div>
                <h2
                  style={{
                    fontSize: "2.8rem",
                    color: "#fff",
                    fontWeight: "800",
                    margin: "0.5rem 0 1.5rem 0",
                    lineHeight: "1.2",
                  }}
                >
                  {lang === "id"
                    ? "Berita & Flyer Kegiatan"
                    : "Latest Event Flyers"}
                </h2>
                <p
                  style={{
                    color: "#94a3b8",
                    lineHeight: "1.7",
                    fontSize: "1.05rem",
                    marginBottom: "2rem",
                  }}
                >
                  {lang === "id"
                    ? "Jangan lewatkan persekutuan ibadah, kelas pembelajaran bahasa Inggris, dan berbagai aktivitas seru M-YES setiap minggunya. Cek berkala deck kartu di samping untuk info terbaru!"
                    : "Stay tuned for our weekly youth worship services, English classes, and exciting fellowship events. Check out our dynamic card deck on the right!"}
                </p>
                <Link
                  href="/news"
                  className="cta-button"
                  style={{ padding: "0.8rem 2rem", fontSize: "1rem" }}
                >
                  {lang === "id" ? "Lihat Semua Berita" : "View All News"}
                </Link>
              </div>

              <div>
                <NewsHomeSlider items={news} lang={lang} />
              </div>
            </div>
          </div>
        </section>
      )}

      <section
        className="section"
        style={{
          paddingBottom: "8rem",
          paddingTop: "6rem",
          backgroundImage: `linear-gradient(rgba(5, 11, 20, 0.85), rgba(5, 11, 20, 0.95)), url('/uploads/home.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="container">
          <div
            className="section-header"
            style={{ textAlign: "left", marginBottom: "3rem" }}
          >
            <div className="overline">
              {lang === "id" ? "Kunjungi Kami" : "Visit Us"}
            </div>
            <h2>{lang === "id" ? "Lokasi Kami" : "Our Location"}</h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "4rem",
              alignItems: "center",
            }}
          >
            <div
              className="map-container"
              style={{
                width: "100%",
                height: "400px",
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
              }}
            >
              <iframe
                src="https://maps.google.com/maps?q=1.4492049,124.8081769&hl=id&z=16&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="location-info">
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
                }}
              ></div>
              <h4
                style={{
                  color: "#3b82f6",
                  fontSize: "1.3rem",
                  marginBottom: "1rem",
                }}
              >
                KEL. MARU - KIMBAL
              </h4>
              <p
                style={{
                  color: "#94a3b8",
                  lineHeight: "1.8",
                  marginBottom: "2.5rem",
                  fontSize: "1.05rem",
                }}
              >
                {contactData.contact_address ||
                  "Lorong Tuminting 1 A, Jalan Sea Malalayang 1 Barat, Manado, Sulawesi Utara, Indonesia"}
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.2rem",
                  }}
                >
                  <div
                    style={{
                      background: "rgba(37, 211, 102, 0.15)",
                      padding: "12px",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="#25D366"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.031 0C5.385 0 .004 5.38.004 12.02c0 2.124.551 4.195 1.6 6.015L.031 24l6.11-1.603a12.001 12.001 0 005.89 1.542h.005c6.643 0 12.025-5.381 12.025-12.022A12.016 12.016 0 0020.536 3.51 11.966 11.966 0 0012.031 0zM12.03 21.942h-.003a9.98 9.98 0 01-5.076-1.39l-.364-.216-3.774.99.999-3.68-.237-.377a9.957 9.957 0 01-1.523-5.305c0-5.498 4.475-9.972 9.981-9.972 2.664 0 5.168 1.039 7.051 2.924a9.927 9.927 0 012.918 7.054c-.002 5.498-4.477 9.972-9.972 9.972zm5.474-7.464c-.3-.15-1.774-.877-2.049-.978-.275-.101-.476-.15-.676.15-.2.301-.775.978-.95 1.178-.175.2-.35.226-.65.076-.3-.15-1.266-.466-2.411-1.488-.891-.794-1.493-1.775-1.668-2.076-.175-.301-.019-.464.131-.614.135-.135.3-.35.45-.526.15-.175.2-.3.3-.5s.05-.376-.025-.526c-.075-.15-.676-1.627-.926-2.228-.243-.585-.49-.505-.676-.514-.175-.008-.376-.01-.576-.01-.2 0-.525.075-.8.376-.275.3-1.05 1.026-1.05 2.503s1.075 2.9 1.225 3.1c.15.2 2.115 3.228 5.123 4.529.717.31 1.275.494 1.71.633.72.23 1.375.197 1.892.12.585-.088 1.774-.726 2.024-1.428.25-.701.25-1.302.175-1.428-.075-.125-.275-.2-.575-.35z" />
                    </svg>
                  </div>
                  <div>
                    <span
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        marginBottom: "4px",
                      }}
                    >
                      WhatsApp
                    </span>
                    <a
                      href={`https://wa.me/${cleanPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#e2e8f0",
                        textDecoration: "none",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                      }}
                    >
                      {rawPhone}
                    </a>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.2rem",
                  }}
                >
                  <div
                    style={{
                      background: "rgba(234, 67, 53, 0.15)",
                      padding: "12px",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
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
                  <div>
                    <span
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        marginBottom: "4px",
                      }}
                    >
                      Email
                    </span>
                    <a
                      href={`mailto:${displayEmail}`}
                      style={{
                        color: "#e2e8f0",
                        textDecoration: "none",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                      }}
                    >
                      {displayEmail}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <VirtualGreeter lang={lang} />
      <SocialFloat />
    </>
  );
}
