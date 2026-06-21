import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Map, Wallet, Sparkles, User, Menu, Search, Sun, Moon, Globe } from 'lucide-react';
import { cn } from '@/components/ui/Layout';
import HamburgerDrawer from '@/components/navigation/HamburgerDrawer';
import SearchCommand from '@/components/navigation/SearchCommand';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/core/theme';

const navItems = [
  { path: '/explore', label: 'Explore', icon: Compass },
  { path: '/community', label: 'Community', icon: Globe },
  { path: '/planner', label: 'Trips', icon: Map },
  { path: '/budget', label: 'Budget', icon: Wallet },
  { path: '/ai-concierge', label: 'AI Concierge', icon: Sparkles },
];

export default function TopNavigation() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, isGuest } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const initials = user?.displayName
    ? user.displayName.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : null;

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const isLandingPage = location.pathname === '/';

  return (
    <>
      <header className={cn(
        "sticky top-0 z-40 w-full hidden md:block transition-all duration-300",
        isScrolled || !isLandingPage
          ? "glass-premium dark:glass-dark shadow-sm border-b border-white/10"
          : isLandingPage
            ? "bg-transparent border-b border-transparent"
            : "bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800"
      )}>
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-primary-600 dark:bg-primary-500 rounded-lg flex items-center justify-center text-white font-serif font-bold text-sm group-hover:shadow-lg group-hover:shadow-primary-500/25 transition-all duration-500">
                W
              </div>
              <span className={cn(
                "font-serif font-bold text-xl tracking-wider uppercase hidden lg:block transition-colors",
                isLandingPage && !isScrolled ? "text-white" : "text-slate-900 dark:text-white"
              )}>
                WanderSync
              </span>
            </Link>

            <button 
              onClick={() => setIsSearchOpen(true)}
              className={cn(
                "hidden lg:flex items-center gap-3 px-4 py-2 rounded-full transition-all w-64 group",
                isLandingPage && !isScrolled 
                  ? "bg-white/15 hover:bg-white/25 text-white/70 border border-white/20" 
                  : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
              )}
            >
              <Search className="w-4 h-4" />
              <span className="text-sm">Where to next?</span>
              <kbd className={cn(
                "ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded",
                isLandingPage && !isScrolled 
                  ? "bg-white/10 text-white/50" 
                  : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500"
              )}>⌘K</kbd>
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
                    "relative px-4 py-2 rounded-full flex items-center gap-2 text-[11px] font-bold tracking-[0.15em] uppercase transition-colors",
                    isActive
                      ? isLandingPage && !isScrolled ? "text-white" : "text-primary-600 dark:text-primary-400"
                      : isLandingPage && !isScrolled ? "text-white/70 hover:text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="top-nav-active"
                      className={cn(
                        "absolute inset-0 rounded-full -z-10",
                        isLandingPage && !isScrolled ? "bg-white/15" : "bg-primary-50 dark:bg-primary-500/10"
                      )}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              );
            })}

            <div className={cn(
              "w-px h-6 mx-2",
              isLandingPage && !isScrolled ? "bg-white/20" : "bg-slate-200 dark:bg-slate-700"
            )} />

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className={cn(
                "p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                isLandingPage && !isScrolled 
                  ? "text-white/70 hover:text-white hover:bg-white/10" 
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <motion.div
                key={isDarkMode ? 'moon' : 'sun'}
                initial={{ rotate: -30, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 30, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isDarkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              </motion.div>
            </button>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className={cn(
                "p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                isLandingPage && !isScrolled 
                  ? "text-white/70 hover:text-white hover:bg-white/10" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
              aria-label="Open settings menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link
              to="/profile"
              className={cn(
                "ml-2 w-9 h-9 rounded-full border-2 shadow-sm overflow-hidden flex items-center justify-center hover:ring-2 hover:ring-primary-500 transition-all",
                isLandingPage && !isScrolled ? "border-white/30" : "border-slate-200 dark:border-slate-700"
              )}
            >
              {initials ? (
                <div className="w-full h-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold font-serif">
                  {initials}
                </div>
              ) : (
                <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  <User className="w-4.5 h-4.5 text-slate-500 dark:text-slate-400" />
                </div>
              )}
            </Link>
          </nav>
        </div>
      </header>

      <HamburgerDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <SearchCommand isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
