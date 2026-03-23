import { NavLink, useNavigate } from "react-router-dom";
import { ChevronRight, LogOut } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuthStore } from "@/shared/presentation/store/auth.store";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string | number;
  hasSubmenu?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export interface SidebarUser {
  name: string;
  email: string;
  avatar?: string;
}

export interface SidebarBrand {
  name: string;
  subtitle?: string;
  icon: LucideIcon;
}

export interface AppSidebarConfig {
  brand: SidebarBrand;
  groups: NavGroup[];
  user: SidebarUser;
}

interface AppSidebarProps {
  config: AppSidebarConfig;
}

export function AppSidebar({ config }: AppSidebarProps) {
  const { brand, groups, user } = config;
  const BrandIcon = brand.icon;
  const navigate = useNavigate();

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    useAuthStore.getState().logout();
    navigate("/login");
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r-0"
      style={{
        backgroundColor: "var(--color-bg-section)",
        borderRight: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      {/* ── Header / Brand ── */}
      <SidebarHeader className="px-3 py-3 pb-2">
        <div className="flex items-center justify-between gap-2">
          <SidebarMenu className="flex-1 min-w-0">
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="hover:bg-[var(--color-teal-soft)] data-[state=open]:bg-[var(--color-teal-soft)] rounded-lg transition-colors duration-150"
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0"
                  style={{
                    backgroundColor: "var(--color-teal)",
                    color: "var(--color-white)",
                  }}
                >
                  <BrandIcon className="h-4 w-4" />
                </div>
                <div className="flex flex-col flex-1 min-w-0 text-left leading-tight">
                  <span
                    className="font-semibold text-sm truncate"
                    style={{ color: "var(--color-text-dark)" }}
                  >
                    {brand.name}
                  </span>
                  {brand.subtitle && (
                    <span
                      className="text-xs truncate"
                      style={{ color: "var(--color-text-gray)" }}
                    >
                      {brand.subtitle}
                    </span>
                  )}
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarTrigger className="shrink-0 text-[var(--color-text-gray)] hover:text-[var(--color-text-dark)] hover:bg-[var(--color-teal-soft)] rounded-md transition-colors duration-150 group-data-[state=collapsed]:hidden" />
          <SidebarTrigger className="hidden group-data-[state=collapsed]:flex shrink-0 h-8 w-8 items-center justify-center rounded-md text-[var(--color-teal)] bg-[var(--color-teal-soft)] hover:bg-[var(--color-teal)] hover:text-white transition-colors duration-150" />
        </div>
        <div className="mx-4 h-px bg-black/5" />
      </SidebarHeader>

      {/* ── Navigation Groups ── */}
      <SidebarContent className="px-2 py-2">
        {groups.map((group) => (
          <SidebarGroup key={group.label} className="py-1 pt-2">
            <SidebarGroupLabel
              className="text-[10px] font-medium uppercase tracking-widest px-2 mb-1 opacity-0 select-none pointer-events-none h-0 overflow-hidden"
              style={{ color: "var(--color-gray-light)" }}
            >
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        className="p-0 h-auto hover:bg-transparent"
                      >
                        <NavLink
                          to={item.url}
                          end
                          className={({ isActive }) =>
                            cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 w-full",
                              "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2",
                              isActive
                                ? "bg-[var(--color-teal-soft)] text-[var(--color-teal-dark)] [&_svg]:text-[var(--color-teal)]"
                                : "text-[var(--color-text-gray)] hover:bg-black/[0.04] hover:text-[var(--color-text-dark)] [&_svg]:text-[var(--color-gray-light)]"
                            )
                          }
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="flex-1 group-data-[collapsible=icon]:hidden">
                            {item.title}
                          </span>
                          {item.badge !== undefined && (
                            <span
                              className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full text-[11px] font-medium px-1 group-data-[collapsible=icon]:hidden"
                              style={{
                                backgroundColor: "var(--color-teal)",
                                color: "var(--color-white)",
                              }}
                            >
                              {item.badge}
                            </span>
                          )}
                          {item.hasSubmenu && (
                            <ChevronRight
                              className="h-3.5 w-3.5 shrink-0 group-data-[collapsible=icon]:hidden"
                              style={{ color: "var(--color-gray-light)" }}
                            />
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* ── Footer / User ── */}
      <SidebarFooter
        className="px-1 py-2"
        style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
      >
        {/* Expanded: card with border */}
        <div className="mx-1 mb-1 rounded-xl border border-black/[0.06] bg-[var(--color-bg-section)] p-3 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-3">
            {/* Avatar with teal ring */}
            <div className="relative shrink-0">
              <Avatar className="h-8 w-8 rounded-full ring-2 ring-[var(--color-teal-soft)] ring-offset-1">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback
                  className="text-xs font-semibold rounded-full"
                  style={{
                    backgroundColor: "var(--color-teal)",
                    color: "var(--color-white)",
                  }}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
            {/* User info */}
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-semibold truncate leading-tight"
                style={{ color: "var(--color-text-dark)" }}
              >
                {user.name}
              </p>
              <p
                className="text-xs truncate leading-tight mt-0.5"
                style={{ color: "var(--color-text-gray)" }}
              >
                {user.email}
              </p>
            </div>
            {/* Logout button — subtle */}
            <button
              onClick={handleLogout}
              className="ml-auto p-1.5 rounded-lg transition-colors duration-150"
              style={{ color: "var(--color-text-gray)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgb(254 242 242)";
                (e.currentTarget as HTMLButtonElement).style.color = "rgb(239 68 68)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-gray)";
              }}
              title="Cerrar sesión"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>

        {/* Collapsed: icon-only avatar + logout */}
        <div className="hidden group-data-[collapsible=icon]:flex flex-col items-center gap-2 py-1">
          <Avatar className="h-8 w-8 rounded-full ring-2 ring-[var(--color-teal-soft)] ring-offset-1">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback
              className="text-xs font-semibold rounded-full"
              style={{
                backgroundColor: "var(--color-teal)",
                color: "var(--color-white)",
              }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg transition-colors duration-150"
            style={{ color: "var(--color-text-gray)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgb(254 242 242)";
              (e.currentTarget as HTMLButtonElement).style.color = "rgb(239 68 68)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-gray)";
            }}
            title="Cerrar sesión"
          >
            <LogOut size={15} />
          </button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
