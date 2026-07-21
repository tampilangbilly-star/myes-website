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
        /* Tata letak Grid: 3 Kolom di Laptop, 2 di Tablet/HP */
        .news-grid-page {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
          gap: clamp(1.25rem, 3vw, 2rem);
          margin-top: 2rem;
        }

        /* Desain Kartu Flyer generasi baru */
        .news-card-page {
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        /* Bounding Box Gambar (Bentuk Portrait 4:5) */
        .news-img-box {
          width: 100%;
          aspect-ratio: 4 / 5; /* Proporsi standar flyer vertical */
          background:
            radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.08), transparent 60%),
            #000;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .news-img-box img {
          width: 100%;
          height: 100%;
          object-fit: contain; /* KUNCI: Menampilkan seluruh gambar FIT 100% tanpa terpotong */
          object-position: center; /* Posisi pas di tengah */
          transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .news-card-page:hover .news-img-box img {
          transform: scale(1.03); /* Efek zoom tipis */
        }

        /* Chip tanggal melayang di atas flyer */
        .news-date-chip {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 99px;
          background: rgba(3, 8, 18, 0.75);
          border: 1px solid rgba(148, 178, 224, 0.25);
          color: #cbd5e1;
          font-family: "DM Sans", sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        /* Bagian Teks di bawah gambar (compact) */
        .news-card-content {
          padding: 1.1rem 1.25rem 1.25rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .news-tag {
          align-self: flex-start;
          background: rgba(59, 130, 246, 0.15);
          color: #93c5fd;
          padding: 4px 10px;
          border-radius: 99px;
          border: 1px solid rgba(96, 165, 250, 0.3);
          font-family: "DM Sans", sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 0.7rem;
          transition: background 0.3s ease, color 0.3s ease;
        }
        .news-card-page:hover .news-tag {
          background: #3b82f6;
          color: #fff;
        }

        .news-title {
          font-family: "Playfair Display", serif;
          font-size: 1.15rem;
          color: #fff;
          font-weight: bold;
          margin: 0 0 0.5rem 0;
          line-height: 1.35;
        }

        .news-desc {
          color: #94a3b8;
          font-size: 0.88rem;
          line-height: 1.6;
          margin-bottom: 1rem;
          flex: 1;
        }

        .news-date {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #64748b;
          font-size: 0.8rem;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding-top: 0.8rem;
        }

        /* ==================== RESPONSIVE KHUSUS ANDROID/MOBILE ==================== */
        @media (max-width: 768px) {
          /* Memaksa grid berita menjadi 2 kolom berdampingan di HP */
          .news-grid-page {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.6rem !important;
            margin-top: 1rem !important;
          }
          .news-card-page {
            border-radius: 12px !important;
          }
          .news-date-chip {
            top: 6px !important;
            right: 6px !important;
            padding: 3px 6px !important;
            font-size: 0.55rem !important;
          }
          .news-card-content {
            padding: 0.75rem !important;
          }
          .news-tag {
            font-size: 0.55rem !important;
            padding: 2px 6px !important;
            margin-bottom: 0.4rem !important;
            letter-spacing: 0.5px !important;
          }
          .news-title {
            font-size: 0.85rem !important;
            line-height: 1.2 !important;
            margin-bottom: 0.3rem !important;
          }
          .news-desc {
            font-size: 0.7rem !important;
            line-height: 1.3 !important;
            margin-bottom: 0.5rem !important;
          }
          .news-date {
            font-size: 0.65rem !important;
            padding-top: 0.5rem !important;
            gap: 0.3rem !important;
          }
          .news-date svg {
            width: 10px !important;
            height: 10px !important;
          }
        }
      `,
        }}
      />

      <header className="ph2">
        <div className="ph2-inner">
          <span className="ph2-watermark" aria-hidden="true">
            News
          </span>
          <div className="ph2-overline">
            <span className="live-dot" />
            {lang === "id" ? "Tetap Update" : "Stay Updated"}
          </div>
          <h1 className="ph2-title">
            {lang === "id" ? (
              <>
                Berita <em>Terbaru</em>
              </>
            ) : (
              <>
                Latest <em>News</em>
              </>
            )}
          </h1>
          <div className="ph2-rule">
            <i />
            <i />
          </div>
        </div>
      </header>

      <section className="section" style={{ minHeight: "60vh" }}>
        <div className="container">
          {items.length > 0 ? (
            <div className="news-grid-page">
              {items.map((n) => (
                <div key={n.id} className="panel news-card-page">
                  {/* Bounding Box Flyer dengan objectFit: contain */}
                  <div className="news-img-box">
                    <span className="news-date-chip">
                      <svg
                        width="12"
                        height="12"
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
                            { day: "numeric", month: "short", year: "numeric" },
                          )
                        : "-"}
                    </span>
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
