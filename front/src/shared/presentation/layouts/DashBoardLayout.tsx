import { Outlet } from "react-router-dom";
import { BookOpen, Home } from "lucide-react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
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

        <SidebarInset className="min-w-0">
          {/* Mobile-only top bar */}
          <header
            className="flex items-center gap-3 px-4 h-14 md:hidden"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}
          >
            <SidebarTrigger
              className="text-[var(--color-text-gray)] hover:text-[var(--color-text-dark)] hover:bg-[var(--color-teal-soft)] rounded-md transition-colors duration-150"
            />
            <span
              className="font-semibold text-sm"
              style={{ color: "var(--color-text-dark)" }}
            >
              BookStore
            </span>
          </header>

          <main className="flex-1">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ErrorBoundary>
  );
};
