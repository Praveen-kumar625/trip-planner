import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Map, Wallet, Sparkles, User, Menu, Search } from 'lucide-react';
import { cn } from '@/components/ui/Layout';
import HamburgerDrawer from './HamburgerDrawer';
import SearchCommand from './SearchCommand';

const navItems = [
  { path: '/explore', label: 'Explore', icon: Compass },
  { path: '/planner', label: 'Trips', icon: Map },
  { path: '/budget', label: 'Budget', icon: Wallet },
  { path: '/maps', label: 'Maps', icon: Map },
  { path: '/ai-concierge', label: 'AI Concierge', icon: Sparkles },
];

export default function TopNavigation() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-premium border-b border-white/20 hidden md:block shadow-premium">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold tracking-tighter group-hover:bg-primary-700 transition-colors">
                WS
              </div>
              <span className="font-bold text-xl tracking-tight text-neutral-900 hidden lg:block">
                WANDERSYNC AI
              </span>
            </Link>

            <button 
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:flex items-center gap-3 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-full text-neutral-500 transition-colors w-64"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm">Where to next?</span>
            </button>
          </div>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "relative px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary-600",
                    isActive ? "text-primary-600" : "text-neutral-600"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="top-nav-active"
                      className="absolute inset-0 bg-primary-50 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              );
            })}

            <div className="w-px h-6 bg-neutral-200 mx-2" />

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              aria-label="Open settings menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button className="ml-2 w-9 h-9 rounded-full bg-neutral-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center hover:ring-2 hover:ring-primary-500 transition-all">
              <User className="w-5 h-5 text-neutral-500" />
            </button>
          </nav>
        </div>
      </header>

      <HamburgerDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <SearchCommand isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
