import { ProtectedRoute } from '@/config/ProtectedRoute';
import { Outlet } from 'react-router-dom';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/organisms/Sidebar/app-sidebar';

export const DashboardLayout = () => {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
};
