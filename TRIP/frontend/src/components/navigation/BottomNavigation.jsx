import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Compass, Sparkles, Map, User, Menu } from 'lucide-react';
import { cn } from '@/components/ui/Layout';
import HamburgerDrawer from './HamburgerDrawer';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/explore', label: 'Explore', icon: Compass },
  { path: '/ai-concierge', label: 'AI', icon: Sparkles },
  { path: '/planner', label: 'Trips', icon: Map },
];

export default function BottomNavigation() {
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 pb-safe md:hidden shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                             (item.path !== '/' && location.pathname.startsWith(item.path));
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "relative flex flex-col items-center justify-center w-full h-full gap-1 text-[10px] font-medium transition-colors min-h-[48px] min-w-[48px]",
                  isActive ? "text-primary-600" : "text-neutral-500 hover:text-neutral-900"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-active"
                    className="absolute top-1 w-12 h-8 bg-primary-50 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={cn("w-5 h-5 transition-transform", isActive && "scale-110")} />
                {item.label}
              </NavLink>
            );
          })}
          
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex flex-col items-center justify-center w-full h-full gap-1 text-[10px] font-medium text-neutral-500 hover:text-neutral-900 min-h-[48px] min-w-[48px]"
          >
            <User className="w-5 h-5" />
            Profile
          </button>
        </div>
      </nav>

      <HamburgerDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
