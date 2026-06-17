import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { LandingPage } = await import('@/pages/LandingPage');
          return { Component: LandingPage };
        },
      },
      {
        path: 'planner',
        lazy: async () => {
          const { PlannerPage } = await import('@/pages/PlannerPage');
          return { Component: PlannerPage };
        },
      },
      {
        path: 'explore',
        lazy: async () => {
          const { LandingPage } = await import('@/pages/LandingPage'); // Placeholder for explore
          return { Component: LandingPage };
        },
      },
      {
        path: 'budget',
        lazy: async () => {
          const { PlannerPage } = await import('@/pages/PlannerPage'); // Placeholder for budget
          return { Component: PlannerPage };
        },
      },
      {
        path: 'ai-concierge',
        lazy: async () => {
          const { PlannerPage } = await import('@/pages/PlannerPage'); // Placeholder
          return { Component: PlannerPage };
        },
      },
      {
        path: 'maps',
        lazy: async () => {
          const { PlannerPage } = await import('@/pages/PlannerPage'); // Placeholder
          return { Component: PlannerPage };
        },
      },
      {
        path: 'trip/:id',
        lazy: async () => {
          const { TripPage } = await import('@/pages/TripPage');
          return { Component: TripPage };
        },
      },
      {
        path: '*',
        lazy: async () => {
          const { NotFoundPage } = await import('@/pages/NotFoundPage');
          return { Component: NotFoundPage };
        },
      },
    ]
  }
]);
