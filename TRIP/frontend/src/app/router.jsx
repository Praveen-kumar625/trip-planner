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
          const { TripsPage } = await import('@/pages/TripsPage');
          return { Component: TripsPage };
        },
      },
      {
        path: 'explore',
        lazy: async () => {
          const { ExplorePage } = await import('@/pages/ExplorePage');
          return { Component: ExplorePage };
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
          return { Component: ProfilePage };
        },
      },
      {
        path: 'community',
        lazy: async () => {
          const { CommunityPage } = await import('@/pages/CommunityPage');
          return { Component: CommunityPage };
        },
      },
      {
        path: 'u/:userId',
        lazy: async () => {
          const { PublicProfilePage } = await import('@/pages/PublicProfilePage');
          return { Component: PublicProfilePage };
        },
      },
      {
        path: 'trip/:id',
        lazy: async () => {
          const { TripDashboardShell } = await import('@/pages/TripDashboardShell');
          return { Component: TripDashboardShell };
        },
        children: [
          {
            index: true,
            lazy: async () => {
              const { TripPage } = await import('@/pages/TripPage');
              return { Component: TripPage };
            }
          },
          {
            path: 'budget',
            lazy: async () => {
              const { BudgetModule } = await import('@/pages/TripModules');
              return { Component: BudgetModule };
            }
          },
          {
            path: 'routes',
            lazy: async () => {
              const { RoutesModule } = await import('@/pages/TripModules');
              return { Component: RoutesModule };
            }
          },
          {
            path: 'hotels',
            lazy: async () => {
              const { HotelsModule } = await import('@/pages/TripModules');
              return { Component: HotelsModule };
            }
          },
          {
            path: 'food',
            lazy: async () => {
              const { FoodModule } = await import('@/pages/TripModules');
              return { Component: FoodModule };
            }
          },
          {
            path: 'maps',
            lazy: async () => {
              const { MapsModule } = await import('@/pages/TripModules');
              return { Component: MapsModule };
            }
          }
        ]
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
