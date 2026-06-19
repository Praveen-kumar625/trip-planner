import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeMap = {
  '/': 'Home',
  '/explore': 'Explore',
  '/planner': 'Trips',
  '/budget': 'Budget',
  '/maps': 'Maps',
  '/ai-concierge': 'AI Concierge',
};

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="w-full max-w-[1440px] mx-auto px-6 py-4 hidden md:flex items-center text-sm">
      <ol className="flex items-center gap-2">
        <li>
          <Link to="/" className="text-neutral-500 hover:text-primary-600 transition-colors flex items-center">
            <Home className="w-4 h-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const name = routeMap[to] || value.charAt(0).toUpperCase() + value.slice(1);

          return (
            <React.Fragment key={to}>
              <li>
                <ChevronRight className="w-4 h-4 text-neutral-300" />
              </li>
              <li>
                {isLast ? (
                  <span className="text-neutral-900 font-medium" aria-current="page">
                    {name}
                  </span>
                ) : (
                  <Link to={to} className="text-neutral-500 hover:text-primary-600 transition-colors">
                    {name}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
