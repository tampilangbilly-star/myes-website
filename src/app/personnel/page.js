import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SocialFloat from "@/components/SocialFloat";

export const dynamic = "force-dynamic";

export default async function PersonnelPage() {
  const cookieStore = cookies();
  const lang = cookieStore.get("lang")?.value || "en";

  // Mengambil data dari database
  const items = await prisma.personnel.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const t = (item, f) =>
    lang === "id" ? item[f + "Id"] || item[f + "En"] : item[f + "En"];

  // ========================================================
  // LOGIKA BARU: BERDASARKAN KATEGORI DROPDOWN ADMIN
  // ========================================================
  const pembina = { leaders: [], members: [] };
  const pengurus = []; // Pengurus digabung jadi 1 array agar semuanya kotak
  const bidang = { members: [] };
  const lainnya = [];

  items.forEach((p) => {
    const displayRole = t(p, "role") || "ANGGOTA";
    const category = p.category || "Lainnya";
    const memberData = { ...p, displayRole };

    if (category === "Pembina") {
      // Pembina HANYA menjadikan Ketua dan Sekretaris sebagai kotak (leaders)
      const isPembinaLeader = /(ketua|sekretaris)/i.test(displayRole);
      if (isPembinaLeader) pembina.leaders.push(memberData);
      else pembina.members.push(memberData);
    } else if (category === "Pengurus Inti") {
      // Sesuai instruksi: Seluruh Pengurus Inti dijadikan kotak
      pengurus.push(memberData);
    } else if (category === "Bidang-Bidang") {
      // Semua bidang masuk ke bulat
      bidang.members.push(memberData);
    } else {
      lainnya.push(memberData);
    }
  });

  return (
    <>
      <Navbar lang={lang} />
      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* ==================== KELOMPOK & JUDUL ==================== */
        .group-section { margin-bottom: clamp(4rem, 9vw, 7rem); }
        .group-title-wrapper {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-bottom: clamp(2.5rem, 6vw, 4rem);
        }
        .group-title-wrapper::before,
        .group-title-wrapper::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(148, 178, 224, 0.3));
        }
        .group-title-wrapper::after {
          background: linear-gradient(270deg, transparent, rgba(148, 178, 224, 0.3));
        }
        .group-title {
          font-family: "Playfair Display", serif;
          font-size: clamp(1.6rem, 1.2rem + 2vw, 2.2rem);
          color: #fff;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 3px;
          margin: 0;
          padding: 0.4rem 1.6rem;
          border: 1px solid rgba(148, 178, 224, 0.18);
          border-radius: 99px;
          background: rgba(15, 26, 46, 0.6);
          white-space: nowrap;
        }
        
        /* ==================== LAYOUT HIERARKI (DESKTOP) ==================== */
        .leaders-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: clamp(1.5rem, 4vw, 3rem);
          margin-bottom: clamp(2.5rem, 5vw, 4rem);
        }
        .members-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
          gap: clamp(1.25rem, 3vw, 2.5rem);
          max-width: 1100px;
          margin: 0 auto;
        }

        /* ==================== KARTU PIMPINAN (PORTRAIT PREMIUM / KOTAK) ==================== */
        .leader-card {
          padding: clamp(2rem, 5vw, 3rem) clamp(1.5rem, 4vw, 2rem);
          text-align: center;
          width: 100%;
          max-width: 360px;
        }
        .leader-card::before {
          content: '';
          position: absolute;
          top: 0; left: 20%; right: 20%;
          height: 3px;
          border-radius: 0 0 6px 6px;
          background: linear-gradient(90deg, #1d4ed8, #60a5fa);
        }
        .avatar-rect {
          width: min(200px, 60vw);
          height: min(260px, 78vw);
          border-radius: 24px;
          padding: 4px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(232, 163, 61, 0.35));
          box-shadow: 0 0 25px rgba(59, 130, 246, 0.2);
          margin: 0 auto 1.5rem auto;
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .leader-card:hover .avatar-rect {
          box-shadow: 0 0 35px rgba(59, 130, 246, 0.5);
          transform: scale(1.04);
        }
        .img-rect {
          width: 100%; height: 100%;
          border-radius: 20px;
          object-fit: cover;
          object-position: top;
          border: 4px solid #050b14;
          background-color: #0f172a;
        }

        /* ==================== KARTU ANGGOTA (BULAT) ==================== */
        .member-card {
          padding: clamp(2rem, 5vw, 3rem) 1.5rem;
          text-align: center;
          background: linear-gradient(180deg, rgba(15, 26, 46, 0.5), rgba(7, 14, 27, 0.6));
        }
        .avatar-ring {
          width: min(180px, 52vw);
          height: min(180px, 52vw);
          border-radius: 50%;
          padding: 4px;
          background: linear-gradient(135deg, rgba(148, 163, 184, 0.3), rgba(148, 163, 184, 0.05));
          margin: 0 auto 1.5rem auto;
          transition: all 0.4s ease;
        }
        .member-card:hover .avatar-ring {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.6), rgba(232, 163, 61, 0.25));
        }
        .img-circle {
          width: 100%; height: 100%;
          border-radius: 50%;
          object-fit: cover;
          object-position: top;
          border: 4px solid #0a0f1a;
          background-color: #0f172a;
        }

        /* ==================== PUSAT PELAYANAN (YESUS) ==================== */
        .jesus-card {
          text-align: center;
          margin: 0 auto clamp(3.5rem, 8vw, 6rem) auto;
          position: relative;
          padding: 2rem 0;
        }
        .jesus-card::before {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: min(520px, 90vw);
          height: min(520px, 90vw);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 215, 0, 0.12) 0%, transparent 65%);
          pointer-events: none;
        }
        .jesus-ring {
          position: relative;
          z-index: 1;
          width: min(260px, 68vw);
          height: min(260px, 68vw);
          border-radius: 50%;
          padding: 5px;
          background: linear-gradient(135deg, #FFD700, #FDB931);
          box-shadow: 0 0 50px rgba(255, 215, 0, 0.4);
          margin: 0 auto 1.5rem auto;
        }
        .jesus-img {
          width: 100%; height: 100%;
          border-radius: 50%;
          object-fit: cover;
          object-position: top;
          border: 4px solid #050b14;
        }
        .jesus-card::after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: calc(clamp(3.5rem, 8vw, 6rem) * -0.7);
          transform: translateX(-50%);
          width: 2px;
          height: clamp(2rem, 5vw, 3.5rem);
          background: linear-gradient(180deg, rgba(255, 215, 0, 0.5), transparent);
        }

        /* ==================== TYPOGRAPHY ==================== */
        .p-name {
          font-family: "Playfair Display", serif;
          font-size: 1.4rem; color: #f8fafc; font-weight: 700;
          margin: 0 0 0.5rem 0;
        }
        .leader-name { font-size: 1.6rem; }
        .p-role {
          color: #3b82f6; font-size: 0.9rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 1.5px; margin: 0;
        }
        .p-bio { color: #94a3b8; font-size: 0.95rem; line-height: 1.6; margin: 1rem 0 0 0; }

        /* ==================== RESPONSIVE KHUSUS ANDROID/MOBILE ==================== */
        @media (max-width: 768px) {
          .group-section { margin-bottom: 3.5rem; }
          .group-title { font-size: 1.1rem; padding: 0.3rem 1.2rem; }
          
          /* Merubah flex/grid lama menjadi sistem Grid Mobile */
          .leaders-row, .members-row {
            display: grid !important;
            gap: 0.5rem !important;
            margin-bottom: 1.5rem !important;
            padding: 0 0.25rem;
          }

          /* KELAS 2 KOLOM (Untuk Pimpinan & Pengurus) */
          .grid-2-mobile { grid-template-columns: repeat(2, 1fr) !important; }
          
          /* KELAS 3 KOLOM (Untuk Anggota Pembina & Bidang) */
          .grid-3-mobile { grid-template-columns: repeat(3, 1fr) !important; gap: 0.35rem !important; }

          /* ------------------- STYLING KOTAK DI MOBILE (2 Kolom) ------------------- */
          .grid-2-mobile .leader-card { padding: 0.75rem 0.25rem; }
          .grid-2-mobile .avatar-rect {
            width: 100%; max-width: 140px; height: 160px;
            border-radius: 12px; margin-bottom: 0.75rem;
          }
          .grid-2-mobile .img-rect { border-width: 2px; border-radius: 10px; }
          .grid-2-mobile .p-name { font-size: 0.85rem; line-height: 1.2; margin-bottom: 0.25rem; }
          .grid-2-mobile .p-role { font-size: 0.6rem; letter-spacing: 0.5px; }

          /* ------------------- STYLING BULAT DI MOBILE (3 Kolom) ------------------- */
          .grid-3-mobile .member-card { padding: 0.5rem 0.15rem; }
          .grid-3-mobile .avatar-ring {
            width: clamp(50px, 25vw, 85px); height: clamp(50px, 25vw, 85px);
            margin-bottom: 0.5rem; padding: 2px; border-radius: 50%;
          }
          .grid-3-mobile .img-circle { border-width: 2px; }
          .grid-3-mobile .p-name { font-size: 0.65rem; line-height: 1.1; margin-bottom: 0.2rem; }
          .grid-3-mobile .p-role { font-size: 0.5rem; letter-spacing: 0; }
          
          /* Sembunyikan biografi di layar kecil agar tidak memanjang */
          .p-bio { display: none; }
          
          /* Kecilkan gambar Yesus */
          .jesus-ring { width: 140px; height: 140px; }
          .jesus-card h3 { font-size: 1.5rem !important; }
        }
      `,
        }}
      />
      <header className="ph2">
        <div className="ph2-inner">
          <span className="ph2-watermark" aria-hidden="true">
            Team
          </span>
          <div className="ph2-overline">
            <span className="live-dot" />
            {lang === "id" ? "Tim Kami" : "Our Team"}
          </div>
          <h1 className="ph2-title">
            {lang === "id" ? (
              <>
                Personalia <em>Organisasi</em>
              </>
            ) : (
              <>
                Organization <em>Personnel</em>
              </>
            )}
          </h1>
          <p className="ph2-sub">
            {lang === "id"
              ? "Struktur pelayanan kami yang berpusat pada Kristus dan digerakkan oleh kasih."
              : "Our ministry structure, centered on Christ and driven by love."}
          </p>
          <div className="ph2-rule">
            <i />
            <i />
          </div>
        </div>
      </header>
      <section
        className="section"
        style={{ minHeight: "60vh", overflow: "hidden" }}
      >
        <div className="container">
          {/* 1. GAMBAR TUHAN YESUS (TOP CENTER) */}
          <div className="jesus-card">
            <div className="jesus-ring">
              <img
                src="jesus-christ.jpg"
                alt="Jesus Christ"
                className="jesus-img"
              />
            </div>
            <h3
              className="p-name leader-name"
              style={{ fontSize: "clamp(1.8rem, 1.4rem + 2vw, 2.4rem)" }}
            >
              Jesus Christ
            </h3>
            <p
              className="p-role"
              style={{ color: "#FFD700", fontSize: "1.1rem" }}
            >
              {lang === "id"
                ? "Kepala Gereja & Pusat Pelayanan"
                : "Head of the Church & Center of Ministry"}
            </p>
          </div>

          {/* 2. PEMBINA SECTION */}
          {(pembina.leaders.length > 0 || pembina.members.length > 0) && (
            <div className="group-section">
              <div className="group-title-wrapper">
                <h2 className="group-title">Dewan Pembina</h2>
              </div>
              {/* Baris Pimpinan Pembina (Kotak - 2 Kolom di Android) */}
              {pembina.leaders.length > 0 && (
                <div className="leaders-row grid-2-mobile">
                  {pembina.leaders.map((p) => (
                    <div key={p.id} className="panel leader-card">
                      <div className="avatar-rect">
                        {p.photo ? (
                          <img
                            src={`${p.photo}`}
                            alt={p.fullName || p.name}
                            className="img-rect"
                          />
                        ) : (
                          <div
                            className="img-rect"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "4rem",
                            }}
                          >
                            👤
                          </div>
                        )}
                      </div>
                      <h3 className="p-name leader-name">
                        {p.fullName || p.name}
                      </h3>
                      <p className="p-role">{p.displayRole}</p>
                      {t(p, "bio") && <p className="p-bio">{t(p, "bio")}</p>}
                    </div>
                  ))}
                </div>
              )}
              {/* Baris Anggota Pembina (Bulat Besar - 3 Kolom di Android) */}
              {pembina.members.length > 0 && (
                <div className="members-row grid-3-mobile">
                  {pembina.members.map((p) => (
                    <div key={p.id} className="panel member-card">
                      <div className="avatar-ring">
                        {p.photo ? (
                          <img
                            src={`${p.photo}`}
                            alt={p.fullName || p.name}
                            className="img-circle"
                          />
                        ) : (
                          <div
                            className="img-circle"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "3rem",
                            }}
                          >
                            👤
                          </div>
                        )}
                      </div>
                      <h3 className="p-name">{p.fullName || p.name}</h3>
                      <p className="p-role" style={{ color: "#94a3b8" }}>
                        {p.displayRole}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. PENGURUS INTI SECTION */}
          {pengurus.length > 0 && (
            <div className="group-section">
              <div className="group-title-wrapper">
                <h2 className="group-title">Pengurus Inti</h2>
              </div>
              {/* Sesuai Request: Seluruh Pengurus Dibuat Kotak (2 Kolom di Android) */}
              <div className="leaders-row grid-2-mobile">
                {pengurus.map((p) => (
                  <div key={p.id} className="panel leader-card">
                    <div className="avatar-rect">
                      {p.photo ? (
                        <img
                          src={`${p.photo}`}
                          alt={p.fullName || p.name}
                          className="img-rect"
                        />
                      ) : (
                        <div
                          className="img-rect"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "4rem",
                          }}
                        >
                          👤
                        </div>
                      )}
                    </div>
                    <h3 className="p-name leader-name">
                      {p.fullName || p.name}
                    </h3>
                    <p className="p-role">{p.displayRole}</p>
                    {t(p, "bio") && <p className="p-bio">{t(p, "bio")}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. BIDANG-BIDANG SECTION */}
          {bidang.members.length > 0 && (
            <div className="group-section">
              <div className="group-title-wrapper">
                <h2 className="group-title">Bidang-Bidang</h2>
              </div>
              {/* Bidang (Bulat - 3 Kolom di Android) */}
              <div className="members-row grid-3-mobile">
                {bidang.members.map((p) => (
                  <div key={p.id} className="panel member-card">
                    <div className="avatar-ring">
                      {p.photo ? (
                        <img
                          src={`${p.photo}`}
                          alt={p.fullName || p.name}
                          className="img-circle"
                        />
                      ) : (
                        <div
                          className="img-circle"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "3rem",
                          }}
                        >
                          👤
                        </div>
                      )}
                    </div>
                    <h3 className="p-name">{p.fullName || p.name}</h3>
                    <p className="p-role" style={{ color: "#94a3b8" }}>
                      {p.displayRole}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. LAINNYA (JIKA ADA) */}
          {lainnya.length > 0 && (
            <div className="group-section">
              <div className="group-title-wrapper">
                <h2 className="group-title">Lainnya</h2>
              </div>
              <div className="members-row grid-3-mobile">
                {lainnya.map((p) => (
                  <div key={p.id} className="panel member-card">
                    <div className="avatar-ring">
                      {p.photo ? (
                        <img
                          src={`${p.photo}`}
                          alt={p.fullName || p.name}
                          className="img-circle"
                        />
                      ) : (
                        <div
                          className="img-circle"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "3rem",
                          }}
                        >
                          👤
                        </div>
                      )}
                    </div>
                    <h3 className="p-name">{p.fullName || p.name}</h3>
                    <p className="p-role" style={{ color: "#94a3b8" }}>
                      {p.displayRole}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      <SocialFloat />
    </>
  );
}
