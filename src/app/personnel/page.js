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
  // LOGIKA SMART HIERARCHY (Membaca Jabatan Ketua/Wakil)
  // ========================================================
  const pembina = { leaders: [], members: [] };
  const pengurus = { leaders: [], members: [] };
  const lainnya = [];

  items.forEach((p) => {
    const rawRole = t(p, "role") || "ANGGOTA";
    let groupName = rawRole.toUpperCase();
    let displayRole = rawRole;

    // Memecah teks jika ada tanda "-" (Misal: "PEMBINA - Ketua Pembina")
    if (rawRole.includes("-")) {
      const parts = rawRole.split("-");
      groupName = parts[0].trim().toUpperCase();
      displayRole = parts[1].trim();
    }

    const memberData = { ...p, displayRole };

    // Deteksi apakah ini level pimpinan (Ketua / Wakil / Penanggung Jawab)
    const isLeader = /(KETUA|WAKIL|PENANGGUNG)/i.test(displayRole);

    if (groupName.includes("PEMBINA")) {
      if (isLeader) pembina.leaders.push(memberData);
      else pembina.members.push(memberData);
    } else if (groupName.includes("PENGURUS")) {
      if (isLeader) pengurus.leaders.push(memberData);
      else pengurus.members.push(memberData);
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
        .group-section { margin-bottom: 7rem; }
        
        .group-title-wrapper {
          text-align: center;
          margin-bottom: 4rem;
          position: relative;
        }

        .group-title {
          font-size: 2.2rem;
          color: #fff;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 3px;
          display: inline-block;
          position: relative;
          padding-bottom: 1rem;
        }

        .group-title::after {
          content: '';
          position: absolute;
          width: 60px;
          height: 4px;
          background: #3b82f6;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 2px;
        }

        /* ==================== LAYOUT HIERARKI ==================== */
        .leaders-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 3rem;
          margin-bottom: 4rem;
        }

        .members-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2.5rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        /* ==================== KARTU PIMPINAN (KOTAK BESAR PORTRAIT) ==================== */
        .leader-card {
          background: #050b14;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 24px;
          padding: 3rem 2rem;
          text-align: center;
          transition: all 0.4s ease;
          width: 100%;
          max-width: 360px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .leader-card:hover {
          transform: translateY(-8px);
          border-color: rgba(59, 130, 246, 0.4);
          box-shadow: 0 20px 40px -10px rgba(59, 130, 246, 0.2);
        }

        .avatar-rect {
          width: 200px; height: 260px;
          border-radius: 24px;
          padding: 4px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(59, 130, 246, 0.1));
          box-shadow: 0 0 25px rgba(59, 130, 246, 0.2);
          margin: 0 auto 1.5rem auto;
          transition: all 0.4s ease;
        }
        .leader-card:hover .avatar-rect {
          box-shadow: 0 0 35px rgba(59, 130, 246, 0.5);
          transform: scale(1.05);
        }
        .img-rect {
          width: 100%; height: 100%;
          border-radius: 20px;
          object-fit: cover;
          object-position: top; /* Anti Terpotong */
          border: 4px solid #050b14;
          background-color: #0f172a;
        }

        /* ==================== KARTU ANGGOTA (BULAT LEBIH BESAR) ==================== */
        .member-card {
          background: rgba(5, 11, 20, 0.5);
          border: 1px solid rgba(255,255,255,0.02);
          border-radius: 24px;
          padding: 3rem 1.5rem;
          text-align: center;
          transition: all 0.4s ease;
        }
        .member-card:hover {
          background: #050b14;
          transform: translateY(-5px);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .avatar-ring {
          width: 180px; height: 180px; /* DIPERBESAR (sebelumnya 130px) */
          border-radius: 50%;
          padding: 4px;
          background: linear-gradient(135deg, rgba(148, 163, 184, 0.3), rgba(148, 163, 184, 0.05));
          margin: 0 auto 1.5rem auto;
          transition: all 0.4s ease;
        }
        .member-card:hover .avatar-ring {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.6), rgba(59, 130, 246, 0.1));
        }
        .img-circle {
          width: 100%; height: 100%;
          border-radius: 50%;
          object-fit: cover;
          object-position: top; /* Anti Terpotong */
          border: 4px solid #0a0f1a;
          background-color: #0f172a;
        }

        /* ==================== PUSAT PELAYANAN (YESUS) ==================== */
        .jesus-card {
          text-align: center;
          margin: 0 auto 6rem auto;
          position: relative;
        }
        .jesus-ring {
          position: relative;
          z-index: 1;
          width: 260px; height: 260px;
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

        /* ==================== TYPOGRAPHY ==================== */
        .p-name { font-size: 1.4rem; color: #f8fafc; font-weight: 700; margin: 0 0 0.5rem 0; }
        .leader-name { font-size: 1.6rem; }
        
        .p-role { 
          color: #3b82f6; font-size: 0.9rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 1.5px; margin: 0;
        }
        .p-bio { color: #94a3b8; font-size: 0.95rem; line-height: 1.6; margin: 1rem 0 0 0; }
      `,
        }}
      />

      <header className="page-header">
        <div className="page-header-inner">
          <div className="overline">
            {lang === "id" ? "Tim Kami" : "Our Team"}
          </div>
          <h1>
            {lang === "id" ? "Personalia Organisasi" : "Organization Personnel"}
          </h1>
          <p>
            {lang === "id"
              ? "Struktur pelayanan kami yang berpusat pada Kristus dan digerakkan oleh kasih."
              : "Our ministry structure, centered on Christ and driven by love."}
          </p>
        </div>
      </header>

      <section
        className="section"
        style={{ minHeight: "60vh", padding: "4rem 1rem" }}
      >
        <div className="container">
          {/* 1. GAMBAR TUHAN YESUS (TOP CENTER) */}
          <div className="jesus-card">
            <div className="jesus-ring">
              <img
                src="/uploads/jesus-christ.jpg"
                alt="Jesus Christ"
                className="jesus-img"
              />
            </div>
            <h3 className="p-name leader-name" style={{ fontSize: "2.4rem" }}>
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
                <h2 className="group-title">Pembina</h2>
              </div>

              {/* Baris Pimpinan Pembina (Kotak) */}
              {pembina.leaders.length > 0 && (
                <div className="leaders-row">
                  {pembina.leaders.map((p) => (
                    <div key={p.id} className="leader-card">
                      <div className="avatar-rect">
                        {p.photo ? (
                          <img
                            src={`/uploads/${p.photo}`}
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

              {/* Baris Anggota Pembina (Bulat Besar) */}
              {pembina.members.length > 0 && (
                <div className="members-row">
                  {pembina.members.map((p) => (
                    <div key={p.id} className="member-card">
                      <div className="avatar-ring">
                        {p.photo ? (
                          <img
                            src={`/uploads/${p.photo}`}
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

          {/* 3. PENGURUS SECTION */}
          {(pengurus.leaders.length > 0 || pengurus.members.length > 0) && (
            <div className="group-section">
              <div className="group-title-wrapper">
                <h2 className="group-title">Pengurus</h2>
              </div>

              {/* Baris Pimpinan Pengurus (Kotak) */}
              {pengurus.leaders.length > 0 && (
                <div className="leaders-row">
                  {pengurus.leaders.map((p) => (
                    <div key={p.id} className="leader-card">
                      <div className="avatar-rect">
                        {p.photo ? (
                          <img
                            src={`/uploads/${p.photo}`}
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

              {/* Baris Anggota Pengurus (Bulat Besar) */}
              {pengurus.members.length > 0 && (
                <div className="members-row">
                  {pengurus.members.map((p) => (
                    <div key={p.id} className="member-card">
                      <div className="avatar-ring">
                        {p.photo ? (
                          <img
                            src={`/uploads/${p.photo}`}
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

          {/* 4. LAINNYA (JIKA ADA) */}
          {lainnya.length > 0 && (
            <div className="group-section">
              <div className="group-title-wrapper">
                <h2 className="group-title">Lainnya</h2>
              </div>
              <div className="members-row">
                {lainnya.map((p) => (
                  <div key={p.id} className="member-card">
                    <div className="avatar-ring">
                      {p.photo ? (
                        <img
                          src={`/uploads/${p.photo}`}
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
