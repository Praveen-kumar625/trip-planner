import { RouterProvider } from 'react-router-dom';
import { Providers } from './providers';
import { router } from './router';

export function App() {
  return (
    <Providers>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <RouterProvider router={router} />
    </Providers>
  );
}

export default App;
