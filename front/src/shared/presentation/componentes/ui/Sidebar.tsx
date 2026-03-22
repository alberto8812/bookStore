import { NavLink } from "react-router-dom";
import { ChevronsUpDown, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
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

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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
      <SidebarHeader
        className="px-3 py-3"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
      >
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
          <SidebarTrigger
            className="hidden group-data-[state=collapsed]:flex shrink-0 h-8 w-8 items-center justify-center rounded-md text-[var(--color-teal)] bg-[var(--color-teal-soft)] hover:bg-[var(--color-teal)] hover:text-white transition-colors duration-150"
          />
        </div>
      </SidebarHeader>

      {/* ── Navigation Groups ── */}
      <SidebarContent className="px-2 py-2">
        {groups.map((group) => (
          <SidebarGroup key={group.label} className="py-1">
            <SidebarGroupLabel
              className="text-[11px] font-medium uppercase tracking-wider px-2 mb-1"
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
                              "flex items-center gap-2.5 px-2.5 h-10 w-full rounded-md text-sm transition-all duration-150",
                              "group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-2",
                              isActive
                                ? "bg-[var(--color-teal-soft)] font-medium border-l-2 border-[var(--color-teal)] pl-[9px] group-data-[state=collapsed]:border-transparent group-data-[state=collapsed]:pl-2.5"
                                : "hover:bg-[var(--color-teal-soft)] border-l-2 border-transparent",
                            )
                          }
                          style={({ isActive }) => ({
                            color: isActive
                              ? "var(--color-teal)"
                              : "var(--color-text-gray)",
                          })}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="flex-1 group-data-[state=collapsed]:hidden">{item.title}</span>
                          {item.badge !== undefined && (
                            <span
                              className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full text-[11px] font-medium px-1 group-data-[state=collapsed]:hidden"
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
                              className="h-3.5 w-3.5 shrink-0 group-data-[state=collapsed]:hidden"
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
        className="px-3 py-3"
        style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
      >
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-[var(--color-teal-soft)] rounded-lg cursor-pointer transition-colors duration-150"
            >
              <Avatar className="h-8 w-8 rounded-lg shrink-0">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback
                  className="text-xs font-semibold rounded-lg"
                  style={{
                    backgroundColor: "var(--color-teal)",
                    color: "var(--color-white)",
                  }}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 min-w-0 text-left leading-tight">
                <span
                  className="text-sm font-medium truncate"
                  style={{ color: "var(--color-text-dark)" }}
                >
                  {user.name}
                </span>
                <span
                  className="text-xs truncate"
                  style={{ color: "var(--color-text-gray)" }}
                >
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown
                className="h-4 w-4 shrink-0"
                style={{ color: "var(--color-gray-light)" }}
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
