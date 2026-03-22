import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "../handkeErrors/GlobalErrorBoundary";
import { PageError } from "../handkeErrors/PageError";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../componentes/ui/Sidebar";

export const DashboardLayout = () => {
  return (
    <ErrorBoundary
      fallback={(error, errorInfo) => {
        return <PageError />;
      }}
    >
      <>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Dancing+Script:wght@600&family=Nunito:wght@400;600;700&display=swap');

        @keyframes waveLeft {
          0%   { transform: rotate(0deg) translateY(0px); }
          20%  { transform: rotate(-18deg) translateY(-4px); }
          40%  { transform: rotate(0deg) translateY(0px); }
          60%  { transform: rotate(-12deg) translateY(-3px); }
          80%  { transform: rotate(0deg) translateY(0px); }
          100% { transform: rotate(0deg) translateY(0px); }
        }

        @keyframes waveRight {
          0%   { transform: rotate(0deg) translateY(0px); }
          20%  { transform: rotate(18deg) translateY(-4px); }
          40%  { transform: rotate(0deg) translateY(0px); }
          60%  { transform: rotate(12deg) translateY(-3px); }
          80%  { transform: rotate(0deg) translateY(0px); }
          100% { transform: rotate(0deg) translateY(0px); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes blob {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50%       { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }

        .animate-fade-up { animation: fadeUp 0.7s ease both; }
        .delay-1 { animation-delay: 0.15s; }
        .delay-2 { animation-delay: 0.3s; }
        .delay-3 { animation-delay: 0.45s; }
        .delay-4 { animation-delay: 0.6s; }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Nunito', sans-serif; }
      `}</style>
        <section className="relative flex flex-col items-center justify-center min-h-screen pt-24 pb-16 px-6 overflow-hidden">
          {/* Blobs decorativos */}
          <div
            className="absolute"
            style={{
              width: 420,
              height: 420,
              background: "rgba(43,191,176,0.10)",
              top: "10%",
              left: "-8%",
              animation: "blob 8s ease-in-out infinite",
            }}
          />
          <div
            className="absolute"
            style={{
              width: 320,
              height: 320,
              background: "rgba(43,191,176,0.07)",
              bottom: "8%",
              right: "-4%",
              animation: "blob 10s ease-in-out infinite reverse",
            }}
          />
          <SidebarProvider>
            <AppSidebar />
            <div
              className="w-screen h-screen"
              style={{ backgroundColor: "var(--color-white)" }}
            >
              <SidebarTrigger />
              <Outlet />
            </div>
          </SidebarProvider>
        </section>
      </>
    </ErrorBoundary>
  );
};
