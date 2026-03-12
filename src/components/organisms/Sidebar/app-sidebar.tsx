import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import Logo from '@/assets/images/logo.png';

const navItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/home',
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logoutUser, userData } = useUser();

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
          {navItems.map(item => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                isActive={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="size-4" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
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
