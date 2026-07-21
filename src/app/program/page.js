import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function ProgramPage() {
  const lang = cookies().get("lang")?.value || "en";
  const items = await prisma.program.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const t = (item, f) =>
    lang === "id" ? item[f + "Id"] || item[f + "En"] : item[f + "En"];

  return (
    <>
      <Navbar lang={lang} />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .pg-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
          gap: clamp(1.25rem, 3vw, 2.25rem);
        }

        .pg-card {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .pg-media {
          position: relative;
          aspect-ratio: 16 / 10;
          background: #030812;
          overflow: hidden;
        }
        .pg-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .pg-card:hover .pg-media img {
          transform: scale(1.06);
        }
        .pg-media .emoji-hero {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          background:
            radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.18), transparent 60%),
            radial-gradient(circle at 75% 85%, rgba(232, 163, 61, 0.1), transparent 55%);
          filter: drop-shadow(0 12px 18px rgba(0, 0, 0, 0.5));
        }
        /* Nomor program besar di pojok media */
        .pg-index {
          position: absolute;
          top: 12px;
          left: 14px;
          z-index: 2;
          font-family: "Playfair Display", serif;
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
          background: rgba(3, 8, 18, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 4px 12px;
          border-radius: 99px;
          letter-spacing: 1px;
        }
        .pg-media::after {
          content: '';
          position: absolute;
          inset: auto 0 0 0;
          height: 60%;
          background: linear-gradient(to top, rgba(7, 14, 27, 0.95), transparent);
        }

        .pg-body {
          padding: 1.5rem 1.5rem 1.25rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .pg-body h3 {
          font-size: 1.35rem;
          color: #fff;
          margin: 0 0 0.6rem;
        }
        .pg-body .pg-excerpt {
          color: #94a3b8;
          font-size: 0.95rem;
          line-height: 1.7;
          margin: 0;
        }

        /* ====== FOOTER AKSI KARTU ====== */
        .program-overlay {
          padding: 0 1.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          text-align: left;
        }
        .program-overlay .full-desc {
          color: #cbd5e1;
          font-size: 0.92rem;
          line-height: 1.7;
          margin: 0;
          border-top: 1px dashed rgba(148, 178, 224, 0.2);
          padding-top: 0.9rem;
        }

        .join-btn {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 46px;
          padding: 0.7rem 1.6rem;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          color: white;
          border-radius: 50px;
          text-decoration: none;
          font-weight: bold;
          font-size: 0.9rem;
          box-shadow: 0 8px 22px rgba(59, 130, 246, 0.4);
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow 0.35s ease;
        }
        .join-btn::after {
          content: '→';
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .join-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 32px rgba(59, 130, 246, 0.55);
        }
        .join-btn:hover::after {
          transform: translateX(4px);
        }

        /* Di perangkat dengan hover (desktop) */
        @media (hover: hover) and (pointer: fine) {
          .program-overlay .full-desc {
            max-height: 0;
            opacity: 0;
            overflow: hidden;
            padding-top: 0;
            border-top-color: transparent;
            transition: max-height 0.5s cubic-bezier(0.22, 1, 0.36, 1),
                        opacity 0.4s ease,
                        padding-top 0.4s ease;
          }
          .pg-card:hover .program-overlay .full-desc {
            max-height: 300px;
            opacity: 1;
            padding-top: 0.9rem;
            border-top-color: rgba(148, 178, 224, 0.2);
          }
        }

        /* ==================== RESPONSIVE KHUSUS ANDROID/MOBILE ==================== */
        @media (max-width: 768px) {
          /* Memaksa grid program menjadi 2 kolom berdampingan di HP */
          .pg-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.6rem !important;
            margin-top: 1rem !important;
          }
          .pg-card {
            border-radius: 12px !important;
          }
          .pg-index {
            top: 8px !important;
            left: 8px !important;
            font-size: 0.7rem !important;
            padding: 2px 8px !important;
          }
          .pg-media .emoji-hero {
            font-size: 2.5rem !important;
          }
          .pg-body {
            padding: 0.75rem !important;
          }
          .pg-body h3 {
            font-size: 0.95rem !important;
            margin-bottom: 0.3rem !important;
            line-height: 1.2 !important;
          }
          .pg-body .pg-excerpt {
            font-size: 0.75rem !important;
            line-height: 1.4 !important;
          }
          /* Di HP, teks lengkap di-hidden dan tombol diperkecil agar rapi */
          .program-overlay {
            padding: 0 0.75rem 0.75rem !important;
            gap: 0.5rem !important;
          }
          .program-overlay .full-desc {
            display: none !important;
          }
          .join-btn {
            min-height: 36px !important;
            padding: 0.4rem 1rem !important;
            font-size: 0.75rem !important;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
          }
        }
      `,
        }}
      />

      <header className="ph2">
        <div className="ph2-inner">
          <span className="ph2-watermark" aria-hidden="true">
            Programs
          </span>
          <div className="ph2-overline">
            <span className="live-dot" />
            {lang === "id" ? "Apa Yang Kami Lakukan" : "What We Do"}
          </div>
          <h1 className="ph2-title">
            {lang === "id" ? (
              <>
                Program <em>Kami</em>
              </>
            ) : (
              <>
                Our <em>Programs</em>
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
        <div className="container">
          <div className="pg-grid">
            {items.map((p, i) => (
              <div key={p.id} className="panel pg-card">
                {/* Media atas: foto full-bleed atau emoji hero */}
                <div className="pg-media">
                  <span className="pg-index">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {p.image ? (
                    <img src={`${p.image}`} alt="" />
                  ) : (
                    <span className="emoji-hero">{p.emoji}</span>
                  )}
                </div>

                {/* Judul + cuplikan singkat */}
                <div className="pg-body">
                  <h3>{t(p, "title")}</h3>
                  <p className="pg-excerpt">
                    {t(p, "description").substring(0, 80)}...
                  </p>
                </div>

                {/* Deskripsi lengkap + tombol Join */}
                <div className="program-overlay">
                  <p className="full-desc">{t(p, "description")}</p>
                  <a
                    href="https://chat.whatsapp.com/Fialpt9jLrCL0oLagStRTc"
                    className="join-btn"
                  >
                    {lang === "id" ? "Gabung Program" : "Join Program"}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
