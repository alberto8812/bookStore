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
      className="border-r-0"
      style={{
        backgroundColor: "var(--color-bg-section)",
        borderRight: "1px solid #e5e7eb",
      }}
    >
      {/* ── Header / Brand ── */}
      <SidebarHeader className="px-3 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-[var(--color-teal-soft)] data-[state=open]:bg-[var(--color-teal-soft)] rounded-lg"
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-md shrink-0"
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
              <ChevronsUpDown
                className="h-4 w-4 shrink-0"
                style={{ color: "var(--color-gray-light)" }}
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ── Navigation Groups ── */}
      <SidebarContent className="px-2 py-1">
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
                      <NavLink
                        to={item.url}
                        end
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-2 px-2 h-9 w-full rounded-md text-sm transition-colors",
                            isActive
                              ? "bg-[var(--color-teal)] text-white font-medium"
                              : "hover:bg-[var(--color-teal-soft)]",
                          )
                        }
                        style={({ isActive }) =>
                          isActive ? {} : { color: "var(--color-text-gray)" }
                        }
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1">{item.title}</span>
                        {item.badge !== undefined && (
                          <span
                            className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full text-[11px] font-medium px-1"
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
                            className="h-3.5 w-3.5 shrink-0"
                            style={{ color: "var(--color-gray-light)" }}
                          />
                        )}
                      </NavLink>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* ── Footer / User ── */}
      <SidebarFooter className="px-3 py-3 border-t border-gray-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-[var(--color-teal-soft)] rounded-lg cursor-pointer"
            >
              <Avatar className="h-8 w-8 rounded-md shrink-0">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback
                  className=" text-xs font-semibold "
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
    </Sidebar>
  );
}
