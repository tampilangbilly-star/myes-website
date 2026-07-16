import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MissionCarousel from "@/components/MissionCarousel"; // Memanggil slider yang baru dibuat

export const dynamic = "force-dynamic";

export default async function MissionPage() {
  const cookieStore = cookies();
  const lang = cookieStore.get("lang")?.value || "en";

  const rawItems = await prisma.mission.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const t = (item, f) =>
    lang === "id" ? item[f + "Id"] || item[f + "En"] : item[f + "En"];

  // ========================================================
  // LOGIKA SMART GROUPING
  // Mengelompokkan gambar berdasarkan Judul (Title) yang sama
  // ========================================================
  const groupedMissions = [];

  rawItems.forEach((m) => {
    const groupTitle = t(m, "title");

    // Cek apakah judul lokasi ini sudah ada di dalam grup
    let group = groupedMissions.find((g) => g.title === groupTitle);

    // Jika belum ada, buat grup baru
    if (!group) {
      group = {
        id: m.id,
        title: groupTitle,
        description: t(m, "description"),
        dateLabel: t(m, "dateLabel"),
        images: [],
      };
      groupedMissions.push(group);
    }

    // Masukkan gambar ke dalam grup tersebut
    if (m.image) {
      group.images.push(m.image);
    }
  });

  return (
    <>
      <Navbar lang={lang} />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* ===== TIMELINE MISI GENERASI BARU ===== */
        .mt-timeline {
          position: relative;
          padding-left: clamp(2rem, 6vw, 3.25rem);
        }
        /* Garis vertikal bercahaya biru → emas */
        .mt-timeline::before {
          content: '';
          position: absolute;
          left: clamp(0.6rem, 2vw, 1.1rem);
          top: 6px;
          bottom: 6px;
          width: 2px;
          border-radius: 99px;
          background: linear-gradient(180deg, #60a5fa, #1d4ed8 45%, var(--gold) 100%);
          box-shadow: 0 0 16px rgba(59, 130, 246, 0.45);
        }

        .mt-item {
          position: relative;
          margin-bottom: clamp(2.5rem, 6vw, 4.5rem);
          padding: clamp(1.5rem, 4.5vw, 2.5rem);
        }
        .mt-item:last-child { margin-bottom: 0; }

        /* Titik penanda di garis */
        .mt-item::after {
          content: '';
          position: absolute;
          top: clamp(1.9rem, 4vw, 2.6rem);
          left: calc(clamp(2rem, 6vw, 3.25rem) * -1 + clamp(0.6rem, 2vw, 1.1rem) - 6px);
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #60a5fa;
          border: 3px solid var(--bg-base);
          box-shadow: 0 0 16px rgba(59, 130, 246, 0.8);
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
                      background 0.4s ease, box-shadow 0.4s ease;
        }
        .mt-item:hover::after {
          background: var(--gold-light);
          box-shadow: 0 0 22px var(--gold-glow), 0 0 40px rgba(232, 163, 61, 0.35);
          transform: scale(1.25);
        }
        .mt-item:hover {
          transform: translateY(-6px) translateX(6px);
        }

        .mt-date {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #93c5fd;
          background: rgba(37, 99, 235, 0.14);
          border: 1px solid rgba(96, 165, 250, 0.35);
          padding: 6px 16px;
          border-radius: 99px;
          font-family: "DM Sans", sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 1.1rem;
        }
        .mt-date::before {
          content: '';
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #60a5fa;
          box-shadow: 0 0 8px #60a5fa;
        }

        .mt-item h3 {
          font-family: "Playfair Display", serif;
          font-size: clamp(1.55rem, 1.2rem + 2vw, 2.1rem);
          color: #fff;
          margin: 0 0 0.9rem;
          font-weight: 800;
          line-height: 1.2;
        }

        .mt-item p {
          color: #94a3b8;
          line-height: 1.8;
          font-size: 1.02rem;
          margin: 0;
        }
      `,
        }}
      />

      <header className="ph2">
        <div className="ph2-inner">
          <span className="ph2-watermark" aria-hidden="true">
            Mission
          </span>
          <div className="ph2-overline">
            <span className="live-dot" />
            {lang === "id" ? "Menjangkau" : "Reaching Out"}
          </div>
          <h1 className="ph2-title">
            {lang === "id" ? (
              <>
                Misi <em>Perjalanan</em>
              </>
            ) : (
              <>
                Mission <em>Trip</em>
              </>
            )}
          </h1>
          <div className="ph2-rule">
            <i />
            <i />
          </div>
        </div>
      </header>

      <section className="section section-dark" style={{ minHeight: "60vh" }}>
        <div
          className="container"
          style={{ maxWidth: "800px", margin: "0 auto" }}
        >
          <div className="mt-timeline">
            {groupedMissions.length > 0 ? (
              groupedMissions.map((group) => (
                <div key={group.id} className="panel mt-item">
                  <div className="mt-date">{group.dateLabel}</div>

                  <h3>{group.title}</h3>

                  <p>{group.description}</p>

                  {/* Memanggil komponen Slider otomatis dengan mengirim kumpulan gambar */}
                  <MissionCarousel images={group.images} />
                </div>
              ))
            ) : (
              <div
                style={{
                  textAlign: "center",
                  color: "#64748b",
                  padding: "5rem 0",
                }}
              >
                <h2>
                  {lang === "id"
                    ? "Belum ada catatan perjalanan."
                    : "No mission trips recorded yet."}
                </h2>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
