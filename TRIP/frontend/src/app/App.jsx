import { RouterProvider } from 'react-router-dom';
import { Providers } from './providers';
import { router } from './router';
import { ErrorBoundary } from '@/core/ErrorBoundary';

export function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <RouterProvider router={router} />
      </Providers>
    </ErrorBoundary>
  );
}

export default App;
