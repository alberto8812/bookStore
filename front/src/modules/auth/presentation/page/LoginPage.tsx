import { useEffect } from "react";
import { useAuthStore } from "@/shared/presentation/store/auth.store";
import { LoginForm } from "../component/logintForm";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const navigate = useNavigate();
  const authstatus = useAuthStore((s) => s.authstatus);

  useEffect(() => {
    if (authstatus === 'authenticated') {
      navigate('/dashboard');
    }
  }, [authstatus, navigate]);
  return (
    <div className="min-h-svh grid md:grid-cols-2">
      {/* Panel izquierdo — Marca (oculto en móvil) */}
      <div
        className="hidden md:flex relative flex-col items-center justify-center gap-8 p-12 overflow-hidden"
        style={{ backgroundColor: "var(--color-teal)" }}
      >
        <div className="flex flex-col items-center gap-6 text-white">
          {/* Logo container */}
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm">
            <BookOpen className="w-10 h-10 text-white" strokeWidth={1.5} />
          </div>

          {/* Brand name */}
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white">
              BookStore
            </h1>
            <p className="mt-2 text-white/70 text-base font-medium">
              Tu catálogo de libros
            </p>
          </div>

          {/* Decorative separator */}
          <div className="w-12 h-0.5 rounded-full bg-white/30" />

          {/* Tagline */}
          <p className="text-white/60 text-sm text-center max-w-xs leading-relaxed">
            Gestiona tu inventario, controla tu catálogo y mantén todo en orden
            desde un solo lugar.
          </p>
        </div>

        {/* Subtle decorative circles */}
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/5 -translate-x-1/3 translate-y-1/3 pointer-events-none" />
        <div className="absolute top-0 left-0 w-48 h-48 rounded-full bg-white/5 -translate-x-1/4 -translate-y-1/4 pointer-events-none" />
      </div>

      {/* Panel derecho — Formulario */}
      <div className="flex flex-col items-center justify-center p-8 bg-background">
        {/* Logo visible solo en móvil */}
        <div className="flex md:hidden items-center gap-2 mb-8">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ backgroundColor: "var(--color-teal)" }}
          >
            <BookOpen className="w-4 h-4 text-white" strokeWidth={1.5} />
          </div>
          <span className="text-lg font-semibold text-foreground">
            BookStore
          </span>
        </div>

        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};
