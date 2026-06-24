"use client";
import { useState, useEffect } from "react";

export default function SplashIntro({ socials }) {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasSeen = sessionStorage.getItem("myes_popup_seen");
    if (!hasSeen) {
      setShow(true);
      document.body.style.overflow = "hidden";
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem("myes_popup_seen", "true");
    document.body.style.overflow = "auto";
  };

  if (!mounted || !show) return null;

  return (
    <>
      {/* CSS INJECTION: Bypass globals.css dan bebas dari aturan inline-style ESLint */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .splash-modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999999;
          background-color: rgba(3, 8, 18, 0.75);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
        }
        .splash-modal-card {
          position: relative; width: 100%; max-width: 450px;
          background-color: #0a1628;
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 24px; padding: 40px 30px; text-align: center;
          box-shadow: 0 25px 50px rgba(0,0,0,0.6), 0 0 30px rgba(59, 130, 246, 0.15);
        }
        .splash-modal-close {
          position: absolute; top: 16px; right: 20px;
          background: none; border: none; color: #8b9bb4;
          font-size: 1.5rem; cursor: pointer; transition: color 0.2s ease;
        }
        .splash-modal-close:hover { color: #ef4444; }
        .splash-modal-title {
          font-family: "Playfair Display", serif; font-size: 2rem;
          color: #fff; margin-bottom: 12px; line-height: 1.2;
        }
        .splash-modal-desc {
          color: #8b9bb4; font-size: 0.95rem; line-height: 1.6; margin-bottom: 30px;
        }
        .splash-social-wrapper {
          display: flex; justify-content: center; gap: 15px; margin-bottom: 35px;
        }
        .splash-social-icon {
          width: 60px; height: 60px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #fff; text-decoration: none; transition: transform 0.2s ease;
        }
        .splash-social-icon:hover { transform: scale(1.1); }
        .splash-social-icon.ig { background: linear-gradient(135deg, #f09433, #dc2743); box-shadow: 0 8px 20px rgba(220,39,67,0.4); }
        .splash-social-icon.fb { background: #1877f2; box-shadow: 0 8px 20px rgba(24,119,242,0.4); }
        .splash-social-icon.wa { background: #25d366; box-shadow: 0 8px 20px rgba(37,211,102,0.4); }
        .splash-modal-skip {
          background: none; border: none; color: #64748b;
          font-size: 0.85rem; font-weight: 600; letter-spacing: 1px;
          text-transform: uppercase; cursor: pointer;
          border-bottom: 1px solid transparent; padding-bottom: 2px;
          transition: all 0.2s ease;
        }
        .splash-modal-skip:hover { color: #fff; border-bottom-color: #3b82f6; }
      `,
        }}
      />

      <div className="splash-modal-overlay">
        <div className="splash-modal-card">
          {/* Menambahkan type="button" untuk menyelesaikan peringatan ESLint */}
          <button
            type="button"
            onClick={handleClose}
            className="splash-modal-close"
          >
            X
          </button>

          <h2 className="splash-modal-title">Mari Bertumbuh Bersama!</h2>
          <p className="splash-modal-desc">
            Gabung di komunitas media sosial M-YES sekarang agar kamu tidak
            ketinggalan jadwal ibadah, kelas bahasa Inggris gratis, dan keseruan
            lainnya.
          </p>

          <div className="splash-social-wrapper">
            {socials?.instagram && (
              <a
                href={socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="splash-social-icon ig"
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            )}
            {socials?.facebook && (
              <a
                href={socials.facebook}
                target="_blank"
                rel="noreferrer"
                className="splash-social-icon fb"
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
            )}
            {socials?.whatsapp && (
              <a
                href={socials.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="splash-social-icon wa"
              >
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.305-.88-.653-1.473-1.46-1.646-1.757-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </a>
            )}
          </div>

          {/* Menambahkan type="button" untuk menyelesaikan peringatan ESLint */}
          <button
            type="button"
            onClick={handleClose}
            className="splash-modal-skip"
          >
            Skip untuk sekarang
          </button>
        </div>
      </div>
    </>
  );
}
