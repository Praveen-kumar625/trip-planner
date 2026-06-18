import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { router } from './router';
import { ErrorBoundary } from '../core/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <Toaster 
        position="bottom-right" 
        expand={true} 
        richColors 
        theme="system" 
      />
    </ErrorBoundary>
  );
}

export default App;
