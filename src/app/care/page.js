import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SocialFloat from "@/components/SocialFloat";
import CareGallery from "@/components/CareGallery";

export const dynamic = "force-dynamic";

export default async function CarePage() {
  const cookieStore = cookies();
  const lang = cookieStore.get("lang")?.value || "en";

  // Mengambil data kegiatan M-YES Care yang aktif, diurutkan dari yang terbaru
  const activities = await prisma.careActivity.findMany({
    where: { isActive: true },
    include: { media: true },
    orderBy: { activityDate: "desc" },
  });

  return (
    <>
      <Navbar lang={lang} />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* ===== STYLING GALERI CARE MENGIKUTI POLA WEEKLY GALLERY ===== */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 250px), 1fr));
          gap: 15px;
          margin-top: 2rem;
        }

        .gallery-img-wrapper {
          position: relative;
          height: 200px;
          border-radius: 12px;
          overflow: hidden;
          background-color: #050B14;
          cursor: zoom-in;
        }
        .gallery-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .gallery-img-wrapper:hover img {
          transform: scale(1.1);
        }

        .zoom-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(15, 23, 42, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .zoom-overlay span {
          font-size: 2.5rem;
          transform: scale(0.5);
          transition: transform 0.3s ease;
        }
        .gallery-img-wrapper:hover .zoom-overlay {
          opacity: 1;
        }
        .gallery-img-wrapper:hover .zoom-overlay span {
          transform: scale(1);
        }

        /* ==================== RESPONSIVE KHUSUS ANDROID/MOBILE ==================== */
        @media (max-width: 768px) {
          /* GALERI DIBUAT 3 KOLOM BERDAMPINGAN SEPERTI WEEKLY GALLERY */
          .gallery-grid {
             grid-template-columns: repeat(3, 1fr) !important;
             gap: 0.35rem !important;
             margin-top: 1rem !important;
          }
          .gallery-img-wrapper {
            height: clamp(85px, 28vw, 120px) !important;
            border-radius: 8px !important;
          }
          .zoom-overlay { display: none !important; }
        }
      `,
        }}
      />

      {/* HEADER REBRANDING */}
      <header className="ph2">
        <div className="ph2-inner">
          <span className="ph2-watermark" aria-hidden="true">
            Impact
          </span>
          <div className="ph2-overline">
            <span className="live-dot" />
            {lang === "id" ? "Berdampak Nyata" : "Making an Impact"}
          </div>
          <h1 className="ph2-title">
            M-YES <em>Care</em>
          </h1>
          <p className="ph2-sub">
            {lang === "id"
              ? "Kami juga melakukan berbagai kegiatan yang berdampak positif, membagikan kebaikan dan kepedulian kepada masyarakat maupun gereja-gereja."
              : "We also organize various impactful activities, sharing kindness and care with the community and local churches."}
          </p>
          <div className="ph2-rule">
            <i />
            <i />
          </div>
        </div>
      </header>

      {/* SECTION GALERI CARE */}
      <section className="section section-alt">
        <div className="container">
          <div className="vh-heading mb-10">
            <span className="bar" />
            <div>
              <span className="overline">
                {lang === "id" ? "Aksi Nyata" : "Real Actions"}
              </span>
              <h2>
                {lang === "id" ? "Galeri M-YES Care" : "M-YES Care Gallery"}
              </h2>
            </div>
          </div>

          <CareGallery activities={activities} lang={lang} />
        </div>
      </section>

      <SocialFloat />
      
    </>
  );
}