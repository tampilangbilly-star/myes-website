import prisma from "@/lib/prisma";

export default async function AdminDashboard() {
  const stats = {
    personnel: await prisma.personnel.count(),
    programs: await prisma.program.count(),
    news: await prisma.news.count(),
    missions: await prisma.mission.count(),
    slides: await prisma.slide.count({ where: { isActive: true } }),
  };

  // Di dalam src/app/admin/page.js (Bagian return)

  return (
    <>
      <div className="stats-grid">
        <div
          className="stat-card"
          style={{ position: "relative", overflow: "hidden" }}
        >
          <div
            className="stat-icon"
            style={{
              background: "rgba(59, 130, 246, 0.1)",
              color: "#3b82f6",
              border: "1px solid rgba(59,130,246,0.3)",
              boxShadow: "0 0 15px rgba(59,130,246,0.2)",
            }}
          >
            👥
          </div>
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "2.5rem",
            }}
          >
            {stats.personnel}
          </h3>
          <p style={{ color: "var(--text-secondary)" }}>Personnel</p>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{
              background: "rgba(16, 185, 129, 0.1)",
              color: "#10b981",
              border: "1px solid rgba(16,185,129,0.3)",
              boxShadow: "0 0 15px rgba(16,185,129,0.2)",
            }}
          >
            📚
          </div>
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "2.5rem",
            }}
          >
            {stats.programs}
          </h3>
          <p style={{ color: "var(--text-secondary)" }}>Programs</p>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{
              background: "rgba(245, 158, 11, 0.1)",
              color: "#f59e0b",
              border: "1px solid rgba(245,158,11,0.3)",
              boxShadow: "0 0 15px rgba(245,158,11,0.2)",
            }}
          >
            📰
          </div>
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "2.5rem",
            }}
          >
            {stats.news}
          </h3>
          <p style={{ color: "var(--text-secondary)" }}>News</p>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{
              background: "rgba(139, 92, 246, 0.1)",
              color: "#8b5cf6",
              border: "1px solid rgba(139,92,246,0.3)",
              boxShadow: "0 0 15px rgba(139,92,246,0.2)",
            }}
          >
            🚀
          </div>
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "2.5rem",
            }}
          >
            {stats.missions}
          </h3>
          <p style={{ color: "var(--text-secondary)" }}>Missions</p>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{
              background: "rgba(236, 72, 153, 0.1)",
              color: "#ec4899",
              border: "1px solid rgba(236,72,153,0.3)",
              boxShadow: "0 0 15px rgba(236,72,153,0.2)",
            }}
          >
            🖼️
          </div>
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "2.5rem",
            }}
          >
            {stats.slides}
          </h3>
          <p style={{ color: "var(--text-secondary)" }}>Active Slides</p>
        </div>
      </div>

      <div
        className="data-table-wrap"
        style={{
          padding: "3rem 2rem",
          textAlign: "center",
          marginTop: "2rem",
          background: "var(--bg-surface-glass)",
        }}
      >
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#fff",
            fontSize: "2rem",
            marginBottom: "1rem",
          }}
        >
          Command Center M-YES
        </h3>
        <p
          style={{
            color: "var(--text-secondary)",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Kelola seluruh aset visual, program, dan informasi komunitas secara
          *real-time* melalui panel navigasi di sebelah kiri.
        </p>
      </div>
    </>
  );
}
