"use client";

export default function HolySpiritAmbient() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none", // KUNCI: Agar tidak menghalangi saat user mengklik tombol
        overflow: "hidden",
        zIndex: 50, // Angka besar agar merpati terbang di DEPAN teks
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* 1. Animasi Masuk (Fly In) - Hanya terjadi sekali saat web dimuat */
        @keyframes flyIn {
          0% { 
            transform: translate(-30vw, 40vh) scale(0.5) rotate(25deg); 
            opacity: 0; 
          }
          100% { 
            transform: translate(25vw, 25vh) rotate(-2deg); 
            opacity: 1; 
          }
        }

        /* 2. Gerakan Mengambang Halus (Hovering in place) - Melanjutkan flyIn */
        @keyframes gentleHover {
          0%, 100% { 
            transform: translate(25vw, 25vh) rotate(-2deg); 
          }
          50% { 
            transform: translate(26vw, 23vh) rotate(3deg); 
          }
        }

        /* Gerakan Kepakan Halus (Naik Turun) */
        @keyframes bobbing {
          0%, 100% { margin-top: 0px; }
          50% { margin-top: -12px; }
        }

        /* Efek Cahaya Rohani yang Berdenyut */
        @keyframes holyGlow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5)); }
          50% { filter: drop-shadow(0 0 25px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 40px rgba(59, 130, 246, 0.6)); }
        }

        .real-dove-container {
          position: absolute;
          /* TRIK ANIMASI BERANTAI: 
             flyIn berjalan 2.5s lalu berhenti (forwards). 
             gentleHover menunggu 2.5s baru mulai dan berulang (infinite). */
          animation: 
            flyIn 2.5s ease-out forwards,
            gentleHover 8s ease-in-out 2.5s infinite; 
        }

        .real-dove-img {
          width: 180px; 
          height: auto;
          animation: bobbing 3s ease-in-out infinite, holyGlow 5s ease-in-out infinite;
        }
        
        /* =========================================
           PENYESUAIAN KHUSUS LAYAR HP (MOBILE)
           ========================================= */
        @media (max-width: 768px) {
          /* Merpati kini MENDARAT DI ZONA JUDUL UTAMA (Lebih ke atas): */
          @keyframes flyInMobile {
            0% { 
              transform: translate(-40vw, 15vh) scale(0.5) rotate(25deg); 
              opacity: 0; 
            }
            100% { 
              /* Mengubah dari 54vh menjadi 32vh agar posisinya naik */
              transform: translate(62vw, 32vh) rotate(-4deg); 
              opacity: 1; 
            }
          }

          @keyframes gentleHoverMobile {
            0%, 100% { transform: translate(62vw, 32vh) rotate(-4deg); }
            50% { transform: translate(63vw, 30.5vh) rotate(2deg); }
          }
          
          .real-dove-container {
            animation: 
              flyInMobile 2.8s ease-out forwards,
              gentleHoverMobile 8s ease-in-out 2.8s infinite;
          }

          .real-dove-img {
            width: 92px;  /* lebih mungil di zona teks agar elegan */
          }
        }
      `,
        }}
      />

      <div className="real-dove-container">
        <img src="dove.png" alt="Holy Spirit Dove" className="real-dove-img" />
      </div>
    </div>
  );
}
