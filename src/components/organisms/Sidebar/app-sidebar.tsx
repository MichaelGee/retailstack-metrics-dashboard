import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { LayoutDashboard, Store, Activity, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import Logo from '@/assets/images/logo.png';
import { cn } from '@/lib/utils';

const navItems = [
  {
    title: 'Overview',
    icon: LayoutDashboard,
    path: '/overview',
  },
  {
    title: 'Stores',
    icon: Store,
    path: '/stores',
  },
  {
    title: 'System Health',
    icon: Activity,
    path: '/system',
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logoutUser, userData } = useUser();

  const isPathActive = React.useCallback(
    (path: string) => {
      return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
    },
    [location.pathname]
  );

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border-secondary p-4">
        <div className="flex items-center gap-2">
          <img src={Logo} alt="RetailStack" className="size-8" />
          <span className="text-sm font-semibold text-text-primary">Metrics Dashboard</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map(item => {
            const active = isPathActive(item.path);
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  isActive={active}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    active &&
                      'rounded-sm border-l-2 border-border-brand bg-bg-brand-secondary !py-2 !text-text-brand-secondary hover:!bg-bg-brand-secondary hover:!text-text-brand-secondary'
                  )}
                >
                  <item.icon
                    className={cn(
                      'size-4 transition-colors',
                      active
                        ? 'text-brand-600'
                        : 'text-text-tertiary group-hover/menu-item:text-brand-600'
                    )}
                  />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-border-secondary p-4">
        <div className="flex flex-col gap-3">
          {userData && (
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-bg-quaternary text-xs font-medium text-text-secondary">
                {userData.first_name?.[0] || userData.email?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-text-primary">
                  {userData.first_name} {userData.last_name}
                </span>
                <span className="text-xs text-text-tertiary">{userData.email}</span>
              </div>
            </div>
          )}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={logoutUser}>
                <LogOut className="size-4" />
                <span>Log out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
