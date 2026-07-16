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

      {/* CSS KHUSUS HALAMAN ABOUT — LAYOUT BARU */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* Cerita Kami: panel editorial dengan aksen ayat samping */
        .story-panel {
          padding: clamp(2rem, 6vw, 3.5rem);
          display: grid;
          grid-template-columns: auto 1fr;
          gap: clamp(1.5rem, 4vw, 3rem);
          align-items: start;
        }
        .story-icon {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.9rem;
          background: rgba(59, 130, 246, 0.14);
          border: 1px solid rgba(96, 165, 250, 0.3);
          box-shadow: inset 0 0 14px rgba(59, 130, 246, 0.18);
        }
        .story-panel h2 {
          font-size: clamp(1.7rem, 1.2rem + 2.4vw, 2.4rem);
          color: #fff;
          margin: 0 0 1.2rem;
        }
        .story-panel p {
          color: #cbd5e1;
          font-size: clamp(1rem, 0.95rem + 0.3vw, 1.1rem);
          line-height: 1.85;
          margin: 0;
        }

        /* Visi & Misi: dua panel dua nada (biru = visi, emas = misi) */
        .vm-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr));
          gap: clamp(1.25rem, 3vw, 2rem);
          margin-top: clamp(1.25rem, 3vw, 2rem);
        }
        .vm-card {
          padding: clamp(1.75rem, 5vw, 2.75rem);
          overflow: hidden;
        }
        .vm-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          border-radius: 20px 20px 0 0;
        }
        .vm-card.blue::before {
          background: linear-gradient(90deg, #1d4ed8, #60a5fa);
        }
        .vm-card.goldline::before {
          background: linear-gradient(90deg, var(--gold), var(--gold-light));
        }
        .vm-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.7rem;
          margin-bottom: 1.4rem;
        }
        .vm-card.blue .vm-icon {
          background: rgba(59, 130, 246, 0.14);
          border: 1px solid rgba(96, 165, 250, 0.3);
        }
        .vm-card.goldline .vm-icon {
          background: rgba(232, 163, 61, 0.12);
          border: 1px solid rgba(232, 163, 61, 0.35);
        }
        .vm-card h3 {
          font-size: clamp(1.5rem, 1.2rem + 1.4vw, 2rem);
          color: #fff;
          margin: 0 0 1.1rem;
        }
        .vm-card p, .vm-card li {
          color: #cbd5e1;
          line-height: 1.8;
          font-size: 1.02rem;
        }
        .vm-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }
        .vm-card ul li {
          position: relative;
          padding-left: 1.6rem;
        }
        .vm-card ul li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.7em;
          width: 12px;
          height: 2px;
          border-radius: 99px;
          background: linear-gradient(90deg, var(--gold), var(--gold-light));
        }

        /* Nilai Inti: strip horizontal dengan pemisah cahaya */
        .value-strip {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
          border: 1px solid rgba(148, 178, 224, 0.12);
          border-radius: 20px;
          overflow: hidden;
          background: linear-gradient(180deg, rgba(15, 26, 46, 0.7), rgba(7, 14, 27, 0.9));
        }
        .value-cell {
          text-align: center;
          padding: clamp(2.25rem, 5vw, 3rem) 1.5rem;
          position: relative;
          transition: background 0.4s ease;
        }
        .value-cell + .value-cell::before {
          content: '';
          position: absolute;
          left: 0;
          top: 18%;
          bottom: 18%;
          width: 1px;
          background: linear-gradient(180deg, transparent, rgba(148, 178, 224, 0.25), transparent);
        }
        .value-cell:hover {
          background: rgba(232, 163, 61, 0.05);
        }
        .value-cell .v-emoji {
          font-size: 2.8rem;
          display: inline-block;
          margin-bottom: 1.2rem;
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .value-cell:hover .v-emoji {
          transform: translateY(-6px) scale(1.12);
        }
        .value-cell h4 {
          font-size: 1.5rem;
          color: #fff;
          margin: 0 0 0.7rem;
        }
        .value-cell p {
          color: #94a3b8;
          line-height: 1.7;
          margin: 0;
          font-size: 0.95rem;
        }

        @media (max-width: 640px) {
          .story-panel {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .story-icon { margin: 0 auto; }
          .value-cell + .value-cell::before {
            left: 15%; right: 15%; top: 0; bottom: auto;
            width: auto; height: 1px;
            background: linear-gradient(90deg, transparent, rgba(148, 178, 224, 0.25), transparent);
          }
        }
      `,
        }}
      />

      {/* 1. PAGE HEADER EDITORIAL BARU */}
      <header className="ph2">
        <div className="ph2-inner">
          <span className="ph2-watermark" aria-hidden="true">
            M-YES
          </span>
          <div className="ph2-overline">
            <span className="live-dot" />
            {lang === "id" ? "Kenali Kami Lebih Dekat" : "Get To Know Us"}
          </div>
          <h1 className="ph2-title">
            About <em>M-YES</em>
          </h1>
          <p className="ph2-sub">
            {lang === "id"
              ? "Komunitas pemuda Manado yang bertumbuh dalam iman dan bahasa Inggris."
              : "A Manado youth community growing in faith and English."}
          </p>
          <div className="ph2-rule">
            <i />
            <i />
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT */}
      <section
        className="section"
        style={{ position: "relative", overflow: "hidden" }}
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
          <div className="panel story-panel">
            <div className="story-icon">📖</div>
            <div>
              <div className="panel-kicker">
                {lang === "id" ? "Awal Mula" : "Where It Began"}
              </div>
              <h2>{lang === "id" ? "Cerita Kami" : "Our Story"}</h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.2rem",
                }}
              >
                <p>
                  {lang === "id"
                    ? "Manado Youth English Service (M-YES) lahir dari kerinduan untuk melihat generasi muda yang tidak hanya unggul dalam kapasitas global melalui penguasaan bahasa Inggris, tetapi juga memiliki akar iman yang kuat di dalam Kristus."
                    : "Manado Youth English Service (M-YES) was born out of a desire to see a young generation that not only excels in global capacity through English proficiency but also has deep roots of faith in Christ."}
                </p>
                <p>
                  {lang === "id"
                    ? "Kami percaya bahwa belajar bersama dalam komunitas yang penuh kasih akan menciptakan lingkungan yang aman, suportif, dan menyenangkan bagi pemuda untuk bertumbuh secara utuh."
                    : "We believe that learning together in a loving community creates a safe, supportive, and enjoyable environment for youth to grow holistically."}
                </p>
              </div>
            </div>
          </div>

          {/* Visi & Misi */}
          <div className="vm-grid">
            <div className="panel vm-card blue">
              <div className="vm-icon">👁️</div>
              <div className="panel-kicker">
                {lang === "id" ? "Arah Kami" : "Our Direction"}
              </div>
              <h3>{lang === "id" ? "Visi" : "Vision"}</h3>
              <p>
                {lang === "id"
                  ? "Menjadi komunitas pemuda yang bertumbuh dalam iman, melayani dengan kasih, dan mengembangkan kemampuan bahasa Inggris untuk memberikan dampak positif bagi masyarakat dan menjawab tantangan global."
                  : "To become a youth community that grows in faith, serves with love, and develops English proficiency to make a positive impact on society and respond to global challenges."}
              </p>
            </div>

            <div className="panel panel--gold vm-card goldline">
              <div className="vm-icon">🎯</div>
              <div className="panel-kicker gold">
                {lang === "id" ? "Langkah Kami" : "Our Steps"}
              </div>
              <h3>{lang === "id" ? "Misi" : "Mission"}</h3>
              <ul>
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
      </section>

      {/* 3. CORE VALUES SECTION */}
      <section
        className="section section-alt"
        style={{ backgroundColor: "#020617" }}
      >
        <div className="container" style={{ maxWidth: "1200px" }}>
          <div className="vh-heading">
            <span className="bar" />
            <div>
              <span className="overline" style={{ color: "#eab308" }}>
                {lang === "id" ? "Prinsip Kami" : "Our Principles"}
              </span>
              <h2>{lang === "id" ? "Nilai-Nilai Inti" : "Core Values"}</h2>
            </div>
          </div>

          <div className="value-strip">
            <div className="value-cell">
              <span className="v-emoji">🙏</span>
              <h4>Faith</h4>
              <p>
                {lang === "id"
                  ? "Berakar kuat dalam kebenaran Firman Tuhan."
                  : "Deeply rooted in the truth of God's Word."}
              </p>
            </div>

            <div className="value-cell">
              <span className="v-emoji">🤝</span>
              <h4>Fellowship</h4>
              <p>
                {lang === "id"
                  ? "Membangun persaudaraan yang hangat dan saling mendukung."
                  : "Building a warm and supportive brotherhood."}
              </p>
            </div>

            <div className="value-cell">
              <span className="v-emoji">⭐</span>
              <h4>Excellence</h4>
              <p>
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
