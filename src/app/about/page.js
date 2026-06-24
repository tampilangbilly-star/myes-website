import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import SocialFloat from "@/components/SocialFloat";
import Footer from "@/components/Footer";

export default async function AboutPage() {
  const cookieStore = cookies();
  const lang = cookieStore.get("lang")?.value || "en";

  return (
    <>
      <Navbar lang={lang} />

      {/* CSS KHUSUS UNTUK BENTO GRID */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          margin-top: 2rem; 
        }

        .bento-card {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 3rem 2rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .bento-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at top left, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
          z-index: 0;
          pointer-events: none;
        }

        .bento-card:hover {
          transform: translateY(-8px);
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5), 0 0 20px rgba(59, 130, 246, 0.1);
        }

        .bento-content {
          position: relative;
          z-index: 1;
        }

        .icon-wrapper {
          width: 60px;
          height: 60px;
          background: rgba(59, 130, 246, 0.15);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          box-shadow: inset 0 0 10px rgba(59, 130, 246, 0.2);
        }

        .value-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .value-card {
          text-align: center;
          padding: 2.5rem 1.5rem;
          border-radius: 20px;
          background: linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.4s ease;
        }

        .value-card:hover {
          transform: scale(1.05);
          border-color: rgba(234, 179, 8, 0.4);
          background: linear-gradient(145deg, rgba(234, 179, 8, 0.05) 0%, rgba(255,255,255,0) 100%);
        }
      `,
        }}
      />

      {/* 1. HERO SECTION (DISAMAKAN PERSIS DENGAN LATEST NEWS) */}
      <header
        className="page-header"
        style={{ borderBottom: "none", paddingBottom: "2rem" }}
      >
        <div className="page-header-inner" style={{ textAlign: "center" }}>
          <div
            className="overline"
            style={{
              letterSpacing: "2px",
              fontWeight: "bold",
              textTransform: "uppercase",
              color: "#3b82f6",
            }}
          >
            {lang === "id" ? "Kenali Kami Lebih Dekat" : "Get To Know Us"}
          </div>
          <h1
            style={{
              fontSize: "4.5rem",
              fontWeight: "900",
              color: "#fff",
              margin: "0.5rem 0",
            }}
          >
            About M-YES
          </h1>
        </div>
      </header>

      {/* 2. MAIN CONTENT (Bento Grid) */}
      <section
        className="section"
        style={{
          paddingTop: "2rem",
          paddingBottom: "5rem",
          position: "relative",
        }}
      >
        {/* Background glow effects tipis di area konten */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "-10%",
            width: "40%",
            height: "60%",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "-10%",
            width: "40%",
            height: "60%",
            background:
              "radial-gradient(circle, rgba(234,179,8,0.03) 0%, transparent 70%)",
            zIndex: 0,
          }}
        />

        <div
          className="container"
          style={{ position: "relative", zIndex: 1, maxWidth: "1200px" }}
        >
          {/* Cerita Kami */}
          <div
            className="bento-card"
            style={{ marginBottom: "2rem", textAlign: "center" }}
          >
            <div className="bento-content">
              <div
                className="icon-wrapper"
                style={{ margin: "0 auto 1.5rem auto" }}
              >
                📖
              </div>
              <h2
                style={{
                  fontSize: "2.2rem",
                  marginBottom: "1.5rem",
                  color: "#fff",
                }}
              >
                {lang === "id" ? "Cerita Kami" : "Our Story"}
              </h2>
              <div
                style={{
                  maxWidth: "900px",
                  margin: "0 auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.2rem",
                }}
              >
                <p
                  style={{
                    color: "#cbd5e1",
                    fontSize: "1.1rem",
                    lineHeight: "1.8",
                    margin: 0,
                  }}
                >
                  {lang === "id"
                    ? "Manado Youth English Service (M-YES) lahir dari kerinduan untuk melihat generasi muda yang tidak hanya unggul dalam kapasitas global melalui penguasaan bahasa Inggris, tetapi juga memiliki akar iman yang kuat di dalam Kristus."
                    : "Manado Youth English Service (M-YES) was born out of a desire to see a young generation that not only excels in global capacity through English proficiency but also has deep roots of faith in Christ."}
                </p>
                <p
                  style={{
                    color: "#cbd5e1",
                    fontSize: "1.1rem",
                    lineHeight: "1.8",
                    margin: 0,
                  }}
                >
                  {lang === "id"
                    ? "Kami percaya bahwa belajar bersama dalam komunitas yang penuh kasih akan menciptakan lingkungan yang aman, suportif, dan menyenangkan bagi pemuda untuk bertumbuh secara utuh."
                    : "We believe that learning together in a loving community creates a safe, supportive, and enjoyable environment for youth to grow holistically."}
                </p>
              </div>
            </div>
          </div>

          {/* Visi & Misi */}
          <div className="bento-grid">
            <div className="bento-card">
              <div className="bento-content">
                <div
                  className="icon-wrapper"
                  style={{ marginBottom: "1.5rem" }}
                >
                  👁️
                </div>
                <h3
                  style={{
                    fontSize: "2rem",
                    marginBottom: "1.5rem",
                    color: "#fff",
                  }}
                >
                  {lang === "id" ? "Visi" : "Vision"}
                </h3>
                <p
                  style={{
                    color: "#cbd5e1",
                    lineHeight: "1.8",
                    fontSize: "1.05rem",
                    margin: 0,
                  }}
                >
                  {lang === "id"
                    ? "Menjadi komunitas pemuda yang bertumbuh dalam iman, melayani dengan kasih, dan mengembangkan kemampuan bahasa Inggris untuk memberikan dampak positif bagi masyarakat dan menjawab tantangan global."
                    : "To become a youth community that grows in faith, serves with love, and develops English proficiency to make a positive impact on society and respond to global challenges."}
                </p>
              </div>
            </div>

            <div className="bento-card">
              <div className="bento-content">
                <div
                  className="icon-wrapper"
                  style={{ marginBottom: "1.5rem" }}
                >
                  🎯
                </div>
                <h3
                  style={{
                    fontSize: "2rem",
                    marginBottom: "1.5rem",
                    color: "#fff",
                  }}
                >
                  {lang === "id" ? "Misi" : "Mission"}
                </h3>
                <ul
                  style={{
                    color: "#cbd5e1",
                    lineHeight: "1.8",
                    fontSize: "1.05rem",
                    paddingLeft: "1.2rem",
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.8rem",
                  }}
                >
                  <li>
                    {lang === "id"
                      ? "Memperdalam kehidupan spiritual anggota melalui persekutuan, pemuridan, doa, dan pendalaman firman Tuhan."
                      : "To deepen the spiritual life of members through fellowship, discipleship, prayer, and the study of God's Word."}
                  </li>
                  <li>
                    {lang === "id"
                      ? "Menumbuhkan karakter serupa Kristus yang berlandaskan cinta kasih, integritas, kerendahan hati, dan hati yang melayani."
                      : "To cultivate Christ-like character based on love, integrity, humility, and a heart for service."}
                  </li>
                  <li>
                    {lang === "id"
                      ? "Menyediakan lingkungan yang suportif, menyenangkan, dan berkelanjutan untuk belajar bahasa Inggris di kalangan pemuda."
                      : "To provide a supportive, enjoyable, and sustainable environment for learning English among young people."}
                  </li>
                  <li>
                    {lang === "id"
                      ? "Mengembangkan keterampilan komunikasi, kepemimpinan, dan kerja sama anggota untuk mempersiapkan mereka menjadi individu yang berpengaruh."
                      : "To develop members' communication, leadership, and teamwork skills, preparing them to become influential individuals."}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE VALUES SECTION */}
      <section
        className="section section-alt"
        style={{ padding: "6rem 0", backgroundColor: "#020617" }}
      >
        <div className="container" style={{ maxWidth: "1200px" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div
              className="overline"
              style={{
                color: "#eab308",
                marginBottom: "1rem",
                letterSpacing: "2px",
                fontWeight: "bold",
              }}
            >
              {lang === "id" ? "Prinsip Kami" : "Our Principles"}
            </div>
            <h2 style={{ fontSize: "3rem", color: "#fff", fontWeight: "bold" }}>
              {lang === "id" ? "Nilai-Nilai Inti" : "Core Values"}
            </h2>
          </div>

          <div className="value-grid">
            <div className="value-card">
              <div style={{ fontSize: "3.5rem", marginBottom: "1.5rem" }}>
                🙏
              </div>
              <h4
                style={{
                  fontSize: "1.8rem",
                  marginBottom: "1rem",
                  color: "#fff",
                  fontWeight: "bold",
                }}
              >
                Faith
              </h4>
              <p style={{ color: "#94a3b8", lineHeight: "1.6" }}>
                {lang === "id"
                  ? "Berakar kuat dalam kebenaran Firman Tuhan."
                  : "Deeply rooted in the truth of God's Word."}
              </p>
            </div>

            <div className="value-card">
              <div style={{ fontSize: "3.5rem", marginBottom: "1.5rem" }}>
                🤝
              </div>
              <h4
                style={{
                  fontSize: "1.8rem",
                  marginBottom: "1rem",
                  color: "#fff",
                  fontWeight: "bold",
                }}
              >
                Fellowship
              </h4>
              <p style={{ color: "#94a3b8", lineHeight: "1.6" }}>
                {lang === "id"
                  ? "Membangun persaudaraan yang hangat dan saling mendukung."
                  : "Building a warm and supportive brotherhood."}
              </p>
            </div>

            <div className="value-card">
              <div style={{ fontSize: "3.5rem", marginBottom: "1.5rem" }}>
                ⭐
              </div>
              <h4
                style={{
                  fontSize: "1.8rem",
                  marginBottom: "1rem",
                  color: "#fff",
                  fontWeight: "bold",
                }}
              >
                Excellence
              </h4>
              <p style={{ color: "#94a3b8", lineHeight: "1.6" }}>
                {lang === "id"
                  ? "Berusaha memberikan yang terbaik dalam proses belajar."
                  : "Striving to give the best in our learning process."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <SocialFloat />
    </>
  );
}
