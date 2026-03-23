import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { useToast } from "../hook/use-toast";

export const ProtectedRoute = () => {
  const { toast } = useToast();
  const { authstatus } = useAuthStore();

  if (authstatus === "authenticated") {
    toast.error("Acceso Autorizado , puede modificar,crear o eliminar libros");
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
