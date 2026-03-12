import ReactQueryProvider from '@/config/ReactQuery';
import { UserProvider } from './UserContext';

// Base providers for all routes (React Query)
export function Providers({ children }: { children: React.ReactNode }) {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
}

// Dashboard providers that include UserProvider for authenticated pages
// Note: ReactQueryProvider is NOT duplicated here — the app-level provider in Providers covers everything
export function DashboardProviders({ children }: { children: React.ReactNode }) {
  return <UserProvider>{children}</UserProvider>;
}
