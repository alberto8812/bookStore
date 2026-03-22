import { Outlet } from "react-router-dom";
import { BookOpen, Home } from "lucide-react";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "../componentes/ui/Sidebar";
import type { AppSidebarConfig } from "../componentes/ui/Sidebar";
import { ErrorBoundary } from "../handkeErrors/GlobalErrorBoundary";
import { PageError } from "../handkeErrors/PageError";

const sidebarConfig: AppSidebarConfig = {
  brand: {
    name: "BookStore",
    subtitle: "",
    icon: BookOpen,
  },
  groups: [
    {
      label: "Navegación",
      items: [
        { title: "Home", url: "/dashboard", icon: Home },
        { title: "Book Store", url: "/dashboard/books", icon: BookOpen },
      ],
    },
  ],
  user: {
    name: "Carlos Velasco",
    email: "carlos@bookstore.com",
    avatar: "",
  },
};

export const DashboardLayout = () => {
  return (
    <ErrorBoundary fallback={() => <PageError />}>
      <SidebarProvider>
        <AppSidebar config={sidebarConfig} />

        <SidebarInset
          style={{
            background: `
              radial-gradient(ellipse 50% 40% at 80% 10%, rgba(43,191,176,0.12) 0%, transparent 70%),
              radial-gradient(ellipse 40% 35% at 10% 85%, rgba(43,191,176,0.10) 0%, transparent 70%),
              #f9fafb
            `,
          }}
        >
          {/* Header */}
          <header
            className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 px-4 border-b"
            style={{
              backgroundColor: "rgba(249,250,251,0.85)",
              backdropFilter: "blur(8px)",
              borderColor: "#e5e7eb",
            }}
          >
            <SidebarTrigger />
            <div className="h-4 w-px bg-gray-200" />
            <span
              className="text-sm font-medium"
              style={{ color: "var(--color-text-gray)" }}
            >
              BookStore
            </span>
          </header>

          {/* Outlet */}
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ErrorBoundary>
  );
};
