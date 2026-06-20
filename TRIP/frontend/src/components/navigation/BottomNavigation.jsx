import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Compass, Sparkles, Map, User, Globe } from 'lucide-react';
import { cn } from '@/components/ui/Layout';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/explore', label: 'Explore', icon: Compass },
  { path: '/community', label: 'Community', icon: Globe },
  { path: '/ai-concierge', label: 'AI', icon: Sparkles, accent: true },
  { path: '/planner', label: 'Trips', icon: Map },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-40 md:hidden">
      <div className="glass-premium dark:glass-dark rounded-2xl shadow-premium-lg border border-white/30 dark:border-white/10 px-2">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                             (item.path !== '/' && location.pathname.startsWith(item.path));
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "relative flex flex-col items-center justify-center w-full h-full gap-1 text-[10px] font-semibold transition-all min-h-[48px] min-w-[48px]",
                  isActive 
                    ? "text-primary-600 dark:text-primary-400" 
                    : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-active"
                    className="absolute -top-0.5 w-8 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {item.accent && !isActive ? (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center -mt-5 shadow-lg shadow-primary-500/30 border-4 border-white dark:border-slate-900">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <Icon className={cn(
                    "w-5 h-5 transition-transform",
                    isActive && "scale-110"
                  )} />
                )}
                
                <span className={item.accent && !isActive ? "-mt-0.5" : ""}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
