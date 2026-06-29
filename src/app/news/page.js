import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Anti-Cache agar berita selalu update (real-time)
export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const cookieStore = cookies();
  const lang = cookieStore.get("lang")?.value || "en";

  const items = await prisma.news.findMany({
    where: { isActive: true },
    orderBy: { publishedAt: "desc" },
  });

  const t = (item, field) => {
    if (!item) return "";
    return lang === "id"
      ? item[field + "Id"] || item[field + "En"] || ""
      : item[field + "En"] || "";
  };

  return (
    <>
      <Navbar lang={lang} />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* Tata letak Grid: 3 Kolom di Laptop, 2 di Tablet, 1 di HP */
        .news-grid-page {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        /* Desain Kartu Flyer */
        .news-card-page {
          background: #050b14;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px; /* Disesuaikan agar lebih compact */
          overflow: hidden;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .news-card-page:hover {
          transform: translateY(-5px);
          border-color: #3b82f6;
          box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.2);
        }

        /* Bounding Box Gambar (Bentuk Portrait 4:5) */
        .news-img-box {
          width: 100%;
          aspect-ratio: 4 / 5; /* Proporsi standar flyer vertical */
          background-color: #000; /* Hitam pekat agar menyatu sebagai bingkai */
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .news-img-box img {
          width: 100%;
          height: 100%;
          object-fit: contain; /* KUNCI: Menampilkan seluruh gambar FIT 100% tanpa terpotong */
          object-position: center; /* Posisi pas di tengah */
          transition: transform 0.5s ease;
        }

        .news-card-page:hover .news-img-box img {
          transform: scale(1.02); /* Efek zoom tipis */
        }

        /* Bagian Teks di bawah gambar (Dibuat jauh lebih compact) */
        .news-card-content {
          padding: 1rem 1.2rem; /* Ruang kosong diperkecil drastis */
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .news-tag {
          align-self: flex-start;
          background: rgba(59, 130, 246, 0.15);
          color: #3b82f6;
          padding: 3px 8px; /* Diperkecil */
          border-radius: 4px;
          font-size: 0.7rem; /* Diperkecil */
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.6rem;
        }

        .news-title {
          font-size: 1.15rem; /* Diperkecil agar proporsional dengan gambar */
          color: #fff;
          font-weight: bold;
          margin: 0 0 0.5rem 0;
          line-height: 1.3;
        }

        .news-desc {
          color: #94a3b8;
          font-size: 0.85rem; /* Diperkecil */
          line-height: 1.5;
          margin-bottom: 1rem;
          flex: 1; 
        }

        .news-date {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #64748b;
          font-size: 0.8rem; /* Diperkecil */
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 0.8rem; /* Jarak batas garis diperkecil */
        }
      `,
        }}
      />

      <header
        className="page-header"
        style={{ borderBottom: "none", paddingBottom: "2rem" }}
      >
        <div className="page-header-inner">
          <div
            className="overline"
            style={{ letterSpacing: "2px", fontWeight: "bold" }}
          >
            {lang === "id" ? "Tetap Update" : "Stay Updated"}
          </div>
          <h1
            style={{
              fontSize: "3.5rem",
              fontWeight: "800",
              color: "#fff",
              margin: "0.5rem 0",
            }}
          >
            {lang === "id" ? "Berita Terbaru" : "Latest News"}
          </h1>
        </div>
      </header>

      <section
        className="section"
        style={{ paddingTop: "0rem", paddingBottom: "5rem", minHeight: "60vh" }}
      >
        <div className="container">
          {items.length > 0 ? (
            <div className="news-grid-page">
              {items.map((n) => (
                <div key={n.id} className="news-card-page">
                  {/* Bounding Box Flyer dengan objectFit: contain */}
                  <div className="news-img-box">
                    {n.image ? (
                      <img src={`${n.image}`} alt={t(n, "title")} />
                    ) : (
                      <span style={{ fontSize: "4rem" }}>📰</span>
                    )}
                  </div>

                  {/* Keterangan Teks Bawah yang sudah di-compact */}
                  <div className="news-card-content">
                    <span className="news-tag">{t(n, "tag") || "Update"}</span>
                    <h3 className="news-title">{t(n, "title")}</h3>
                    <p className="news-desc">
                      {t(n, "content")?.substring(0, 100)}
                      {t(n, "content")?.length > 100 ? "..." : ""}
                    </p>

                    <div className="news-date">
                      <svg
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      {n.publishedAt
                        ? new Date(n.publishedAt).toLocaleDateString(
                            lang === "id" ? "id-ID" : "en-US",
                            { day: "numeric", month: "long", year: "numeric" },
                          )
                        : "-"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                  ? "Belum ada berita saat ini."
                  : "No news available at the moment."}
              </h2>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
