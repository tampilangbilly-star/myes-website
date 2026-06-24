"use client";
import React from "react";

// Pastikan Anda menerima props "socials" jika data link-nya dinamis dari database
export default function SocialBar({ socials }) {
  return (
    <>
      <style jsx>{`
        .social-strip {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
          padding: 20px;
          background: rgba(
            10,
            19,
            36,
            0.4
          ); /* Latar belakang baris gelap transparan */
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .social-follow-text {
          color: #8b9bb4;
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-right: 12px;
        }
        .social-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 24px;
          border-radius: 99px; /* Bentuk Kapsul/Pil */
          font-size: 0.9rem;
          font-weight: 600;
          color: #fff;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .social-pill:hover {
          transform: translateY(-4px) scale(1.02);
        }
        .social-pill.ig {
          background: linear-gradient(135deg, #f09433, #dc2743, #bc1888);
          box-shadow: 0 10px 20px rgba(220, 39, 67, 0.25);
        }
        .social-pill.fb {
          background: #1877f2;
          box-shadow: 0 10px 20px rgba(24, 119, 242, 0.25);
        }
        .social-pill.tt {
          background: #010101;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }
        .social-pill.wa {
          background: #25d366;
          box-shadow: 0 10px 20px rgba(37, 211, 102, 0.25);
        }
        .svg-icon {
          width: 18px;
          height: 18px;
          fill: currentColor;
        }
      `}</style>

      <div className="social-strip">
        <span className="social-follow-text">Follow us:</span>

        {/* INSTAGRAM */}
        {socials?.instagram && (
          <a
            href={socials.instagram}
            target="_blank"
            rel="noreferrer"
            className="social-pill ig"
          >
            <svg viewBox="0 0 24 24" className="svg-icon">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            Instagram
          </a>
        )}

        {/* FACEBOOK */}
        {socials?.facebook && (
          <a
            href={socials.facebook}
            target="_blank"
            rel="noreferrer"
            className="social-pill fb"
          >
            <svg viewBox="0 0 24 24" className="svg-icon">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
            </svg>
            Facebook
          </a>
        )}

        {/* TIKTOK */}
        {socials?.tiktok && (
          <a
            href={socials.tiktok}
            target="_blank"
            rel="noreferrer"
            className="social-pill tt"
          >
            <svg viewBox="0 0 448 512" className="svg-icon">
              <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" />
            </svg>
            TikTok
          </a>
        )}

        {/* WHATSAPP */}
        {socials?.whatsapp && (
          <a
            href={socials.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="social-pill wa"
          >
            <svg viewBox="0 0 24 24" className="svg-icon">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.305-.88-.653-1.473-1.46-1.646-1.757-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            WhatsApp
          </a>
        )}
      </div>
    </>
  );
}
