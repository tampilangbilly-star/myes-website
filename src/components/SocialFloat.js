"use client";

export default function SocialFloat() {
  // Nomor WA Anda (Format internasional tanpa tanda + atau spasi)
  const waNumber = "6282290658336";
  const waLink = `https://wa.me/${waNumber}?text=Halo%20kak%20Billy,%20saya%20ingin%20bertanya%20seputar%20komunitas%20M-YES!`;

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* Animasi Denyut Cahaya (Pulse) */
        @keyframes pulse-wa {
          0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(37, 211, 102, 0); }
          100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
        }

        .wa-float-btn {
          position: fixed;
          bottom: 30px;
          right: 30px; /* Di pojok kanan, menyeimbangkan AI Greeter di kiri */
          width: 60px;
          height: 60px;
          background-color: #25D366; /* Warna Hijau Khas WhatsApp */
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px rgba(37, 211, 102, 0.4);
          z-index: 99;
          transition: transform 0.3s ease, background-color 0.3s ease;
          text-decoration: none;
          animation: pulse-wa 2s infinite;
        }

        .wa-float-btn:hover {
          transform: scale(1.1) translateY(-5px);
          background-color: #20b858;
          animation: none; /* Hentikan denyut saat di-hover */
          box-shadow: 0 15px 35px rgba(37, 211, 102, 0.6);
        }

        /* Tooltip Teks (Muncul saat di-hover) */
        .wa-tooltip {
          position: absolute;
          right: 75px;
          background: rgba(15, 23, 42, 0.9);
          color: white;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: bold;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transform: translateX(10px);
          transition: all 0.3s ease;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .wa-float-btn:hover .wa-tooltip {
          opacity: 1;
          transform: translateX(0);
        }
      `,
        }}
      />

      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-float-btn"
        aria-label="Chat WhatsApp M-YES"
      >
        {/* Teks penjelas saat kursor mendekat */}
        <span className="wa-tooltip">Chat Admin (Billy)</span>

        {/* Ikon WhatsApp SVG yang bersih */}
        <svg width="35" height="35" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.031 0C5.385 0 .004 5.38.004 12.02c0 2.124.551 4.195 1.6 6.015L.031 24l6.11-1.603a12.001 12.001 0 005.89 1.542h.005c6.643 0 12.025-5.381 12.025-12.022A12.016 12.016 0 0020.536 3.51 11.966 11.966 0 0012.031 0zM12.03 21.942h-.003a9.98 9.98 0 01-5.076-1.39l-.364-.216-3.774.99.999-3.68-.237-.377a9.957 9.957 0 01-1.523-5.305c0-5.498 4.475-9.972 9.981-9.972 2.664 0 5.168 1.039 7.051 2.924a9.927 9.927 0 012.918 7.054c-.002 5.498-4.477 9.972-9.972 9.972zm5.474-7.464c-.3-.15-1.774-.877-2.049-.978-.275-.101-.476-.15-.676.15-.2.301-.775.978-.95 1.178-.175.2-.35.226-.65.076-.3-.15-1.266-.466-2.411-1.488-.891-.794-1.493-1.775-1.668-2.076-.175-.301-.019-.464.131-.614.135-.135.3-.35.45-.526.15-.175.2-.3.3-.5s.05-.376-.025-.526c-.075-.15-.676-1.627-.926-2.228-.243-.585-.49-.505-.676-.514-.175-.008-.376-.01-.576-.01-.2 0-.525.075-.8.376-.275.3-1.05 1.026-1.05 2.503s1.075 2.9 1.225 3.1c.15.2 2.115 3.228 5.123 4.529.717.31 1.275.494 1.71.633.72.23 1.375.197 1.892.12.585-.088 1.774-.726 2.024-1.428.25-.701.25-1.302.175-1.428-.075-.125-.275-.2-.575-.35z" />
        </svg>
      </a>
    </>
  );
}
