import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';
import { AuthGuard } from '@/features/auth/components/AuthGuard';

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
        path: 'login',
        lazy: async () => {
          const { LoginPage } = await import('@/pages/auth/LoginPage');
          return { Component: LoginPage };
        },
      },
      {
        path: 'signup',
        lazy: async () => {
          const { SignupPage } = await import('@/pages/auth/SignupPage');
          return { Component: SignupPage };
        },
      },
      {
        path: 'planner',
        lazy: async () => {
          const { TripsPage } = await import('@/pages/TripsPage');
          return { 
            Component: () => <AuthGuard><TripsPage /></AuthGuard>
          };
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
          const { BudgetPage } = await import('@/pages/BudgetPage');
          return { Component: BudgetPage };
        },
      },
      {
        path: 'ai-concierge',
        lazy: async () => {
          const { PlannerPage } = await import('@/pages/PlannerPage');
          return { Component: PlannerPage };
        },
      },
      {
        path: 'new-trip',
        lazy: async () => {
          const { PlannerPage } = await import('@/pages/PlannerPage');
          return { Component: PlannerPage };
        },
      },
      {
        path: 'maps',
        lazy: async () => {
          const { MapsPage } = await import('@/pages/MapsPage');
          return { Component: MapsPage };
        },
      },
      {
        path: 'profile',
        lazy: async () => {
          const { ProfilePage } = await import('@/pages/ProfilePage');
          return {
            Component: () => <AuthGuard><ProfilePage /></AuthGuard>
          };
        },
      },
      {
        path: 'trip/:id',
        lazy: async () => {
          const { TripPage } = await import('@/pages/TripPage');
          return { 
            Component: () => <AuthGuard><TripPage /></AuthGuard>
          };
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
