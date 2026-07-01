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
            .responsive-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
              gap: 4rem;
              align-items: center;
            }
            .news-title {
              font-size: 2.8rem;
              color: #fff;
              font-weight: 800;
              margin: 0.5rem 0 1.5rem 0;
              line-height: 1.2;
            }
            .location-title {
              font-size: 2.2rem;
              margin-bottom: 0.5rem;
              color: #fff;
              font-weight: bold;
            }
            .section-padding {
              padding-top: 6rem;
              padding-bottom: 6rem;
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
            @media (max-width: 768px) {
              .responsive-grid { gap: 2.5rem; }
              .news-title { font-size: 2rem; }
              .location-title { font-size: 1.8rem; }
              .section-padding { padding-top: 4rem; padding-bottom: 4rem; }
              .map-container { height: 300px !important; }
            }
          `,
        }}
      />

      <div className="hero-wrapper">
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
        {/* PERBAIKAN: width 100% dipastikan aktif */}
        <div
          className="container"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "2rem",
            width: "100%",
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
              gap: "1.5rem",
              alignItems: "center",
            }}
          >
            <a
              href="https://www.instagram.com/myes_worship"
              className="viva-social"
              target="_blank"
              rel="noopener noreferrer"
            >
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
              <span>{lang === "id" ? "Grup WhatsApp" : "Join WhatsApp"}</span>
            </a>
            <a
              href="https://www.tiktok.com/@myes_fellowship"
              className="viva-social"
              target="_blank"
              rel="noopener noreferrer"
            >
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
            backgroundImage: `linear-gradient(rgba(5, 11, 20, 0.85), rgba(5, 11, 20, 0.95)), url('${mainBg || ""}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="container" style={{ width: "100%" }}>
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
                        src={`${p.image}`}
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

      {news.length > 0 && (
        <section
          className="section section-alt section-padding"
          style={{
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#080e17",
            borderTop: "1px solid rgba(255,255,255,0.02)",
            borderBottom: "1px solid rgba(255,255,255,0.02)",
          }}
        >
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
            style={{ position: "relative", zIndex: 1, width: "100%" }}
          >
            <div className="responsive-grid">
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
                <h2 className="news-title">
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
        className="section section-padding"
        style={{
          backgroundImage: `linear-gradient(rgba(5, 11, 20, 0.85), rgba(5, 11, 20, 0.95)), url('home.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="container" style={{ width: "100%" }}>
          <div
            className="section-header"
            style={{ textAlign: "left", marginBottom: "3rem" }}
          >
            <div className="overline">
              {lang === "id" ? "Kunjungi Kami" : "Visit Us"}
            </div>
            <h2>{lang === "id" ? "Lokasi Kami" : "Our Location"}</h2>
          </div>
          <div className="responsive-grid">
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.6204589046138!2d124.80560197423821!3d1.4492102612499522!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32877544d235223b%3A0x216b2b2a129e1930!2sMG.Maru.Home!5e1!3m2!1sen!2sus!4v1782539996785!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              ></iframe>
            </div>
            <div className="location-info">
              <h3 className="location-title">M-YES Basecamp</h3>
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
            </div>
          </div>
        </div>
      </section>

      <VirtualGreeter lang={lang} />
      <SocialFloat />
    </>
  );
}
