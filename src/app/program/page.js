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
        .program-card {
          position: relative;
          overflow: hidden;
          transition: transform 0.4s ease;
        }

        /* Overlay yang muncul saat di-hover */
        .program-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(5, 11, 20, 0.9);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          opacity: 0;
          transition: opacity 0.4s ease;
          text-align: center;
          z-index: 2;
        }

        .program-card:hover .program-overlay {
          opacity: 1;
        }

        .join-btn {
          margin-top: 1rem;
          padding: 0.8rem 1.5rem;
          background: #3b82f6;
          color: white;
          border-radius: 50px;
          text-decoration: none;
          font-weight: bold;
          font-size: 0.9rem;
        }
      `,
        }}
      />

      <header className="page-header">
        <div className="page-header-inner">
          <div className="overline">
            {lang === "id" ? "Apa Yang Kami Lakukan" : "What We Do"}
          </div>
          <h1>{lang === "id" ? "Program Kami" : "Our Programs"}</h1>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="program-grid">
            {items.map((p, i) => (
              <div key={p.id} className="program-card">
                {/* Overlay Interaktif */}
                <div className="program-overlay">
                  <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                    {t(p, "description")}
                  </p>
                  <a
                    href="https://chat.whatsapp.com/Fialpt9jLrCL0oLagStRTc"
                    className="join-btn"
                  >
                    {lang === "id" ? "Gabung Program" : "Join Program"}
                  </a>
                </div>

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
                  <p style={{ color: "#64748b" }}>
                    {t(p, "description").substring(0, 80)}...
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
