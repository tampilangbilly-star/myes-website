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

      <header
        className="page-header"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="page-header-inner">
          <div
            className="overline"
            style={{ letterSpacing: "2px", fontWeight: "bold" }}
          >
            {lang === "id" ? "Menjangkau" : "Reaching Out"}
          </div>
          <h1
            style={{
              fontSize: "3.5rem",
              fontWeight: "800",
              color: "#fff",
              margin: "0.5rem 0",
            }}
          >
            {lang === "id" ? "Misi Perjalanan" : "Mission Trip"}
          </h1>
        </div>
      </header>

      <section
        className="section section-dark"
        style={{ minHeight: "60vh", paddingTop: "4rem" }}
      >
        <div
          className="container"
          style={{ maxWidth: "800px", margin: "0 auto" }}
        >
          <div className="mission-timeline">
            {groupedMissions.length > 0 ? (
              groupedMissions.map((group) => (
                <div
                  key={group.id}
                  className="mission-item"
                  style={{
                    marginBottom: "5rem",
                    padding: "2rem",
                    background: "#050b14",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div
                    className="mission-date"
                    style={{
                      color: "#3b82f6",
                      fontWeight: "bold",
                      marginBottom: "0.5rem",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      fontSize: "0.9rem",
                    }}
                  >
                    {group.dateLabel}
                  </div>

                  <h3
                    style={{
                      fontSize: "2rem",
                      color: "#fff",
                      marginBottom: "1rem",
                      fontWeight: "bold",
                    }}
                  >
                    {group.title}
                  </h3>

                  <p
                    style={{
                      color: "#94a3b8",
                      lineHeight: "1.8",
                      fontSize: "1.05rem",
                    }}
                  >
                    {group.description}
                  </p>

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
