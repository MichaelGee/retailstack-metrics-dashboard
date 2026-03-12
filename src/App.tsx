import RouterComponent from '@/config/Router';
import { BrowserRouter as Router } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Providers } from '@/contexts/Providers';
import { Toaster } from '@/components/ui/toaster';
import ErrorBoundary from '@/components/organisms/ErrorBoundary';

function App() {
  return (
    <Providers>
      <ErrorBoundary>
        <Router>
          <Toaster />
          <ReactQueryDevtools initialIsOpen={false} />
          <RouterComponent />
        </Router>
      </ErrorBoundary>
    </Providers>
  );
}

export default App;
