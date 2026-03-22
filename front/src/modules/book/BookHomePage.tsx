// ─── HOME PAGE ───────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(100vh) scale(0); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(-10vh) scale(1); opacity: 0; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%      { opacity: 0.7; transform: scale(1.08); }
        }

        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes logoReveal {
          from { opacity: 0; transform: translateY(-20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(43, 191, 176, 0.25);
          animation: floatUp linear infinite;
        }

        .hero-logo {
          animation: logoReveal 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
        }

        .hero-subtitle {
          animation: fadeInUp 0.8s ease 0.7s both;
        }

        .hero-cta {
          animation: fadeInUp 0.8s ease 1s both;
        }

        .mesh-bg {
          background: linear-gradient(
            135deg,
            rgba(43,191,176,0.08) 0%,
            rgba(240,253,251,0.6) 25%,
            rgba(255,255,255,0.9) 50%,
            rgba(240,253,251,0.6) 75%,
            rgba(43,191,176,0.08) 100%
          );
          background-size: 400% 400%;
          animation: gradientShift 10s ease infinite;
        }

        .orb-1 {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        .orb-2 {
          animation: pulse-slow 8s ease-in-out infinite 2s;
        }
        .orb-3 {
          animation: pulse-slow 7s ease-in-out infinite 4s;
        }
      `}</style>

      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* ── Animated gradient mesh background ── */}
        <div className="mesh-bg absolute inset-0" />

        {/* ── Soft orbs ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Top-left orb */}
          <div
            className="orb-1 absolute rounded-full"
            style={{
              width: 380,
              height: 380,
              background:
                "radial-gradient(circle, rgba(43,191,176,0.18) 0%, transparent 70%)",
              top: "-80px",
              left: "-80px",
            }}
          />
          {/* Bottom-right orb */}
          <div
            className="orb-2 absolute rounded-full"
            style={{
              width: 300,
              height: 300,
              background:
                "radial-gradient(circle, rgba(43,191,176,0.14) 0%, transparent 70%)",
              bottom: "-60px",
              right: "-60px",
            }}
          />
          {/* Center-right accent */}
          <div
            className="orb-3 absolute rounded-full"
            style={{
              width: 200,
              height: 200,
              background:
                "radial-gradient(circle, rgba(29,184,168,0.10) 0%, transparent 70%)",
              top: "30%",
              right: "8%",
            }}
          />

          {/* Floating particles */}
          {[
            { size: 8, left: "10%", delay: "0s", duration: "12s" },
            { size: 5, left: "20%", delay: "2s", duration: "15s" },
            { size: 10, left: "35%", delay: "4s", duration: "11s" },
            { size: 6, left: "50%", delay: "1s", duration: "14s" },
            { size: 8, left: "65%", delay: "3s", duration: "13s" },
            { size: 4, left: "75%", delay: "5s", duration: "16s" },
            { size: 7, left: "85%", delay: "0.5s", duration: "12s" },
            { size: 5, left: "92%", delay: "3.5s", duration: "10s" },
          ].map((p, i) => (
            <div
              key={i}
              className="particle"
              style={{
                width: p.size,
                height: p.size,
                left: p.left,
                bottom: "-20px",
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            />
          ))}
        </div>

        {/* ── Hero content ── */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 gap-6">
          {/* Logo */}
          <div className="hero-logo">
            <img
              src="/src/assets/juju-logo.png"
              alt="Juju — Soluciones amigables"
              style={{ maxWidth: 280, width: "100%" }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>

          {/* Divider line */}
          <div
            className="hero-subtitle"
            style={{
              width: 60,
              height: 3,
              borderRadius: 99,
              background: "var(--color-teal)",
              opacity: 0.5,
            }}
          />

          {/* Tagline */}
          <p
            className="hero-subtitle text-lg font-medium max-w-sm"
            style={{ color: "var(--color-text-gray)", lineHeight: 1.6 }}
          >
            Tu plataforma de gestión de libros, simple y poderosa.
          </p>
        </div>
      </div>
    </>
  );
}
